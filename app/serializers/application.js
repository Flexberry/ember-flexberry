import Ember from 'ember';
import DS from 'ember-data';
import IdProxy from '../utils/idproxy';

export default DS.RESTSerializer.extend({
  extractSingle: function(store, typeClass, payload, id) {
    payload = {
      [typeClass.typeKey]: payload
    };

    return this._super(store, typeClass, payload, id);
  },

  extractArray: function(store, typeClass, payload) {
    let rootKey = Ember.String.pluralize(typeClass.typeKey);
    payload = {
      [rootKey]: payload.value
    };

    return this._super(store, typeClass, payload);
  },

  extractMeta: function(store, type, payload) {
    if (!payload) {
      return;
    }

    let odataMetaPrefix = '@odata.';
    let meta = {};
    for (var key in payload) {
      if (payload.hasOwnProperty(key) && key.indexOf(odataMetaPrefix) === 0) {
        var metaKey = key.substring(odataMetaPrefix.length);
        meta[metaKey] = payload[key];
        delete payload[key];
      }
    }

    store.setMetadataFor(type, meta);
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
