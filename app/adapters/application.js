import Ember from 'ember';
import DS from 'ember-data';
import IdProxy from '../utils/idproxy';

// Adapter for OData service.
// TODO: ODataAdapter.
export default DS.RESTAdapter.extend({
  host: 'http://northwindodata.azurewebsites.net/odata',
  //host: 'http://localhost:4356/odata',
  pathForType: function(type) {
    var camelized = Ember.String.camelize(type),
        capitalized = Ember.String.capitalize(camelized);
    return Ember.String.pluralize(capitalized);
  },

  // Own property - to solve the problem: id always is string - see ember-data.js, comments for function coerceId(id).
  idType: 'number',

  // Own method.
  getPaginationQuery: function(page, perPage, sortingInfo, serializer) {
    var query = { '$top': perPage, '$skip': (page - 1) * perPage, '$count': true };

    if (sortingInfo && sortingInfo.length > 0) {
      var serializedSortingInfo = sortingInfo.map(function(element) {
        return serializer.keyForAttribute(element.propName) + ' ' + element.direction;
      }).join(', ');
      query['$orderby'] = serializedSortingInfo;
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

    var url = this.buildURL(type.typeKey, data.id);
    var serializer = store.serializerFor(type);
    var query = this.getModelProjectionQuery(projection, serializer);
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
    var projectionQuery = this.getModelProjectionQuery(projection, serializer);
    query = Ember.merge(projectionQuery, query);
    return this._super(store, type, query).then(function(data) {
      for (var i = 0; i < data.value.length; i++) {
        // This variable will be handled by serializer in the normalize method.
        data.value[i]._fetchedProjection = projection;
      }

      return data;
    });
  },

  // TODO: move these functions to utils/.
  // Supports OData v4 only.
  getModelProjectionQuery: function(projection, serializer) {
    var tree = this._getODataQueryTree(projection, serializer),
        query = this._getODataQuery(tree);
    return query;
  },

  _getODataQueryTree: function(projection, serializer) {
    var self = this,
        tree = {
          select: [serializer.primaryKey],
          expand: {}
        },
        expanders = [projection.masters, projection.details];

    if (projection.properties) {
      projection.properties.forEach(function(prop) {
        tree.select.push(serializer.keyForAttribute(prop));
      });
    }

    expanders.forEach(function(expander) {
      if (!expander) {
        return;
      }

      for (var propertyName in expander) {
        if (expander.hasOwnProperty(propertyName)) {
          var normalizedPropName = serializer.keyForAttribute(propertyName);
          tree.select.push(normalizedPropName);

          var expanderProjection = expander[propertyName];
          tree.expand[normalizedPropName] = self._getODataQueryTree(expanderProjection, serializer);
        }
      }
    });

    return tree;
  },

  _getODataQuery: function(queryTree) {
    var select = this._getODataSelectQuery(queryTree),
        expand = this._getODataExpandQuery(queryTree);

    var query = {};
    if (select) {
      query['$select'] = select;
    }

    if (expand) {
      //query['$expand'] = expand;
    }

    return query;
  },

  _getODataExpandQuery: function(queryTree) {
    var expandProperties = Object.keys(queryTree.expand);
    if (!expandProperties.length) {
      return null;
    }

    var self = this,
        query = [];
    expandProperties.forEach(function(propertyName) {
      var subTree = queryTree.expand[propertyName];
      var expr = propertyName;
      var select = self._getODataSelectQuery(subTree);
      var expand = self._getODataExpandQuery(subTree);
      if (select || expand) {
        expr += '(';
        if (select) {
          expr += '$select=' + select;
        }

        if (expand) {
          expr += ';' + '$expand=' + expand;
        }

        expr += ')';
      }

      query.push(expr);
    });

    return query.join(',');
  },

  _getODataSelectQuery: function(queryTree) {
    if (queryTree.select.length) {
      return queryTree.select.join(',');
    } else {
      return null;
    }
  },

  buildURL: function(type, id, record) {
    var url = [],
        host = Ember.get(this, 'host'),
        prefix = this.urlPrefix();

    if (type) {
      url.push(this.pathForType(type));
    }

    if (prefix) {
      url.unshift(prefix);
    }

    url = url.join('/');
    if (!host && url) {
      url = '/' + url;
    }

    //We might get passed in an array of ids from findMany
    //in which case we don't want to modify the url, as the
    //ids will be passed in through a query param
    if (id && !Ember.isArray(id)) {
      var encId = encodeURIComponent(id),
          idType = Ember.get(this, 'idType');
      if (idType !== 'number') {
        encId = "'" + encId + "'";
      }

      url += '(' + encId + ')';
    }

    // /Customers('ALFKI')
    // /Employees(4)
    return url;
  },

  // TODO: override createRecord and deleteRecord for projections support.
  updateRecord: function(store, type, snapshot) {
    if (!IdProxy.idIsProxied(snapshot.id)) {
      // Sends a PUT request.
      return this._super.apply(this, arguments);
    }

    var data = {};
    var serializer = store.serializerFor(type.typeKey);
    serializer.serializeIntoHash(data, type, snapshot);

    var originalId = IdProxy.retrieve(snapshot.id).id;
    var url = this.buildURL(type.typeKey, originalId, snapshot);
    return this.ajax(url, 'PATCH', { data: data });
  }
});
