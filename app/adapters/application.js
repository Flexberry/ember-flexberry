import Ember from 'ember';
import DS from 'ember-data';
import IdProxy from '../utils/idproxy';
import config from '../config/environment';
import ProjectionQuery from '../utils/projection-query';
import SnapshotTransform from '../utils/snapshot-transform';

// Adapter for OData service.
// TODO: ODataAdapter.
export default DS.RESTAdapter.extend({
  host: config.APP.backendUrls.api,
  pathForType: function(type) {
    var camelized = Ember.String.camelize(type);
    var capitalized = Ember.String.capitalize(camelized);
    return Ember.String.pluralize(capitalized);
  },

  // Own property - to solve the problem: id always is string - see ember-data.js, comments for function coerceId(id).
  idType: 'number',

  // Own method.
  getPaginationQuery: function(page, perPage, sortingInfo, serializer) {
    var query = { $top: perPage, $skip: (page - 1) * perPage, $count: true };

    if (sortingInfo && sortingInfo.length > 0) {
      query.$orderby = sortingInfo.map(function(element) {
        return serializer.keyForAttribute(element.propName) + ' ' + element.direction;
      }).join(', ');
    }

    return query;
  },

  find: function(store, type, id, snapshot) {
    if (!IdProxy.idIsProxied(id)) {
      return this._super.apply(this, arguments);
    }

    // Retrieve original primary key and projection.
    var data = IdProxy.retrieve(id, type);
    var projection = data.projection;
    Ember.assert('projection should be defined', !!projection);

    var url = this.buildURL(type.typeKey, data.id, snapshot, 'find');
    var serializer = store.serializerFor(type);
    var query = ProjectionQuery.get(projection, serializer);
    return this.ajax(url, 'GET', { data: query }).then(function(data) {
      // This variable will be handled by serializer in the normalize method.
      data._fetchedProjection = projection;
      return data;
    });
  },

  findQuery: function(store, type, query) {
    var projection = query.__fetchingProjection;
    if (!projection) {
      return this._super.apply(this, arguments);
    }

    delete query.__fetchingProjection;
    var serializer = store.serializerFor(type);
    var projectionQuery = ProjectionQuery.get(projection, serializer);
    query = Ember.merge(projectionQuery, query);
    return this._super(store, type, query).then(function(data) {
      for (var i = 0; i < data.value.length; i++) {
        // This variable will be handled by serializer in the normalize method.
        data.value[i]._fetchedProjection = projection;
      }

      return data;
    });
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

    if (id) {
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
    let projection = snapshot.record.get('projection');

    // IdProxy.idIsProxied isn't used because new record has no id,
    // but has a projection.
    let hasProjection = !!projection;

    // TODO: maybe move it into serializer (serialize or serializeIntoHash)?
    let skipProjectionAttrs = hasProjection;
    let skipUnchangedAttrs = hasProjection;
    SnapshotTransform.transformForSerialize(snapshot, skipProjectionAttrs, skipUnchangedAttrs);

    // FIXME: in newer ember versions buildURL signature has been changed.
    // NOTE: for newly created records id is not defined.
    let url = this.buildURL(type.typeKey, snapshot.id);

    let httpMethod;
    switch (requestType) {
      case 'createRecord':
        httpMethod = 'POST';
        break;

      case 'updateRecord':
        httpMethod = hasProjection ? 'PATCH' : 'PUT';
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
      let serializer = store.serializerFor(type.typeKey);
      data = {};
      serializer.serializeIntoHash(data, type, snapshot);
    }

    return this.ajax(url, httpMethod, { data: data }).then(function(response) {
      if (hasProjection && response && requestType === 'createRecord') {
        // Serializer will use fetched projection to mutate new record id.
        response._fetchedProjection = projection;
      }

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
