import Ember from 'ember';
import DS from 'ember-data';
import IdProxy from '../utils/idproxy';

export default DS.RESTSerializer.extend({
  // Раньше можно было определить primaryKey как функцию, и задать один алгоритм для всех сериализаторов.
  // Щас либо по отдельности для каждого задавать это свойство, либо переопределять функции,
  // в которых задействован primaryKey (нужно иметь ввиду, что Ember Data в бете).
  primaryKey: 'ApplicationID',

  extractMeta: function(store, type, payload) {
    if (!payload) {
      return;
    }

    var odataMetaPrefix = '@odata.',
        meta = {};
    for (var key in payload) {
      if (payload.hasOwnProperty(key) && key.indexOf(odataMetaPrefix) === 0) {
        var metaKey = key.substring(odataMetaPrefix.length);
        meta[metaKey] = payload[key];
        delete payload[key];
      }
    }

    store.setMetadataFor(type, meta);
  },

  normalizePayload: function(payload) {
    // TODO: refactor using extractSingle and extractArray.
    if (payload.value) {
      payload.applications = payload.value;
      delete payload.value;
    } else {
      payload = { application: payload };
    }

    return payload;
  },

  normalize: function(type, hash, prop) {
    hash = this._super.apply(this, arguments);

    // Get a projection on which the hash was fetched
    // (see adapter find and findQuery methods).
    var projection = hash._fetchedProjection;
    if (projection) {
      delete hash._fetchedProjection;

      hash.id = IdProxy.mutate(hash.id, projection);

      type.eachRelationship(function(key, relationship) {
        // It works with async relationships.
        // TODO: support embedded relationships (without links)
        if (relationship.kind === 'belongsTo') {
          if (hash[key]) {
            hash[key] = IdProxy.mutate(hash[key], projection.masters[key]);
          }
        } else if (relationship.kind === 'hasMany') {
          if (hash[key]) {
            var subproj = projection.details[key];
            var ids = hash[key].map(function(id) {
              return IdProxy.mutate(id, subproj);
            });

            hash[key] = ids;
          }
        }
      });
    }

    return hash;
  },

  keyForAttribute: function(attr) {
    return Ember.String.capitalize(attr);
  },

  keyForRelationship: function(key, relationship) {
    return Ember.String.capitalize(key);
  },

  serializeIntoHash: function(hash, type, record, options) {
    // OData requires id in request body.
    options = options || {};
    options.includeId = true;

    // {...} instead of {"application": {...}}
    Ember.merge(hash, this.serialize(record, options));
  }
});
