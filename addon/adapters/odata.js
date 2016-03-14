import Ember from 'ember';
import DS from 'ember-data';
import SnapshotTransform from '../utils/snapshot-transform';

export default DS.RESTAdapter.extend({
  headers: {
    Prefer: 'return=representation'
  },

  idType: 'number',

  getPaginationQuery: function(page, perPage) {
    let query = { $top: perPage, $skip: (page - 1) * perPage, $count: true };
    return query;
  },

  getSortingQuery: function(sortingInfo, serializer) {
    let query = {};

    if (sortingInfo && sortingInfo.length) {
      query.$orderby = sortingInfo.map(function(element) {
        return serializer.keyForAttribute(element.propName) + ' ' + element.direction;
      }).join(', ');
    }

    return query;
  },

  /**
   * Creates query with given projection name (if not null) and limit function (if not empty).
   *
   * @method getLimitFunctionQuery
   * @param {String} limitFunction Filter to add to query (if empty noting will be added as filter).
   * @param {String} projectionName Projection name to add to query (if empty noting will be added as projection name).
   * @return {Object} Created query.
   */
  getLimitFunctionQuery: function(limitFunction, projectionName) {
    let query = {};
    if (limitFunction && typeof (limitFunction) === 'string' && limitFunction.length > 0) {
      Ember.merge(query, { $filter: limitFunction });
    }

    if (projectionName && typeof (projectionName) === 'string' && projectionName.length > 0) {
      Ember.merge(query, { projection: projectionName });
    }

    return query;
  },

  /**
   * Forms url to get all entities of certain type.
   *
   * @method getUrlForTypeQuery
   * @param {String} type Type of entities.
   * @return {Object} Formed url.
   * @throws {Error} Throws error if type parameter is undefined.
   */
  getUrlForTypeQuery: function(type) {
    if (!type) {
      throw new Error('Type is undefined.');
    }

    let url = this.urlForFindAll(type);
    return url;
  },

  /**
   * Forms query options to get entities by specified lookup options.
   *
   * @method getQueryOptionsForAutocompleteLookup
   * @param {Object} lookupParameters Specified lookup autocomplete options.
   * @return {Object} Formed query options.
   */
  getQueryOptionsForAutocompleteLookup: function(lookupParameters) {
    let options = Ember.$.extend(true, {
      lookupLimitFunction: undefined,
      top: undefined,
      limitField: undefined,
      limitValue: undefined
    }, lookupParameters);

    let query = {};
    let lookupLimitFunction = options.lookupLimitFunction;
    let top = options.top;
    let limitField = options.limitField;
    let limitValue = options.limitValue;

    // TODO: add projection?
    if (limitField && limitValue) {
      let limitFunction = 'contains(' + limitField + ', \'' + limitValue + '\')';
      if (lookupLimitFunction) {
        limitFunction = limitFunction + ' and ' + lookupLimitFunction;
      }

      Ember.merge(query, { $filter: limitFunction });
    } else if (lookupLimitFunction) {
      Ember.merge(query, { $filter: lookupLimitFunction });
    }

    if (top) {
      Ember.merge(query, { $top: top });
    }

    return query;
  },

  /**
   * Combines the provided filter string with filter expression to match those objects
   * which have attributes containing the provided pattern;
   * 
   * @method combineFilterWithFilterByAnyMatch
   * @param {Object} store The store to retrieve a serializer for model.
   * @param {String} currentFilter Current filter string to be combined with created expression.
   * @param {String} matchPattern The substring to match objects' attributes.
   * @param {String} modelName The name of the filtered model.
   * @param {Array} modelFields The array of strings containing names of model attributes to use in matching.
   *
   * ToDo: It's the temporary solution made to move backend-specific logic to adapter. It's needed
   * to use any abstract query language and create filters in Ember objects with it, then convert
   * these filters to backend-specific filter expressions by an utitility method in each adapter.
   */
  combineFilterWithFilterByAnyMatch: function(store, currentFilter, matchPattern, modelName, modelFields) {
    var containsExpressions = modelFields.map(function(fieldName) {
      var backendFieldName = store.serializerFor(modelName).keyForAttribute(fieldName);
      return 'contains(' + backendFieldName + ', \'' + matchPattern + '\')';
    });
    
    var newExpression = containsExpressions.join(" and ");
    if(typeof currentFilter === 'string' && currentFilter.length > 0) {
      newExpression = "(" + currentFilter + ") and (" + newExpression + ")";
    }

    return newExpression;
  },

  pathForType: function(type) {
    var camelized = Ember.String.camelize(type);
    var capitalized = Ember.String.capitalize(camelized);
    return Ember.String.pluralize(capitalized);
  },

  _buildURL: function(modelName, id) {
    var url = [];
    var host = Ember.get(this, 'host');
    var prefix = this.urlPrefix();
    var path;

    if (modelName) {
      path = this.pathForType(modelName);
      if (path) {
        url.push(path);
      }
    }

    if (prefix) {
      url.unshift(prefix);
    }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = '/' + url;
    }

    if (id != null) {
      // Append id as `(id)` (OData specification) instead of `/id`.
      url = this._appendIdToURL(id, url);
    }

    return url;
  },

  createRecord: function(store, type, snapshot) {
    return this._sendRecord(store, type, snapshot, 'createRecord');
  },

  updateRecord: function(store, type, snapshot) {
    return this._sendRecord(store, type, snapshot, 'updateRecord');
  },

  deleteRecord: function(store, type, snapshot) {
    return this._sendRecord(store, type, snapshot, 'deleteRecord');
  },

  /**
   * Makes HTTP request for creating, updating or deleting the record.
   */
  _sendRecord: function(store, type, snapshot, requestType) {
    // TODO: maybe move it into serializer (serialize or serializeIntoHash)?
    let skipUnchangedAttrs = true;
    SnapshotTransform.transformForSerialize(snapshot, skipUnchangedAttrs);

    // NOTE: for newly created records id is not defined.
    let url = this.buildURL(type.modelName, snapshot.id, snapshot, requestType);

    let httpMethod;
    switch (requestType) {
      case 'createRecord':
        httpMethod = 'POST';
        break;

      case 'updateRecord':
        httpMethod = skipUnchangedAttrs ? 'PATCH' : 'PUT';
        break;

      case 'deleteRecord':
        httpMethod = 'DELETE';
        break;

      default:
        throw new Error(`Unknown requestType: ${requestType}`);
    }

    let data;

    // Don't need to send any data for deleting.
    if (requestType !== 'deleteRecord') {
      let serializer = store.serializerFor(type.modelName);
      data = {};
      serializer.serializeIntoHash(data, type, snapshot);
    }

    return this.ajax(url, httpMethod, { data: data }).then(function(response) {
      return response;
    });
  },

  /**
   * Appends id to URL according to the OData specification.
   * @private
   */
  _appendIdToURL: function(id, url) {
    let encId = encodeURIComponent(id);
    let idType = Ember.get(this, 'idType');
    if (idType !== 'number') {
      encId = `'${encId}'`;
    }

    url += '(' + encId + ')';
    return url;
  }
});
