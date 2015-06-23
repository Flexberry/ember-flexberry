import Ember from 'ember';
import DS from 'ember-data';
import IdProxy from '../utils/idproxy';
import config from '../config/environment';
import ProjectionQuery from '../utils/projection-query';
import SnapshotTransform from '../utils/snapshot-transform';

// Adapter for OData service.
// TODO: ODataAdapter.
export default DS.RESTAdapter.extend({
  host: config.APP.activeHost.api,
  pathForType: function(type) {
    var camelized = Ember.String.camelize(type);
    var capitalized = Ember.String.capitalize(camelized);
    return Ember.String.pluralize(capitalized);
  },

  // Own property - to solve the problem: id always is string - see ember-data.js, comments for function coerceId(id).
  idType: 'number',

  // Own method.
  getPaginationQuery: function(page, perPage, sortingInfo, serializer) {
    var query = { '$top': perPage, '$skip': (page - 1) * perPage, '$count': true };

    if (sortingInfo && sortingInfo.length > 0) {
      query['$orderby'] = sortingInfo.map(function(element) {
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

    var url = this.buildURL(type.typeKey, data.id);
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

  buildURL: function(type, id, record) {
    var url = [];
    var host = Ember.get(this, 'host');
    var prefix = this.urlPrefix();

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
      var encId = encodeURIComponent(id);
      var idType = Ember.get(this, 'idType');
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
    var hasProjection = IdProxy.idIsProxied(snapshot.id);

    // TODO: maybe move it into serializer (serialize or serializeIntoHash)?
    SnapshotTransform.transformForSerialize(snapshot, hasProjection, hasProjection);

    if (!hasProjection) {
      // Sends a PUT request.
      return this._super.apply(this, arguments);
    }

    var data = {};
    var serializer = store.serializerFor(type.typeKey);
    serializer.serializeIntoHash(data, type, snapshot);

    var url = this.buildURL(type.typeKey, snapshot.id, snapshot);
    return this.ajax(url, 'PATCH', { data: data });
  }
});
