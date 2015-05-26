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
  },

  // To serialize only changed attributes when saving a record with projection.
  // Accordingly, the adapter will send a PATCH request instead of PUT
  // (see adapter.updateRecord method).
  serialize: function(snapshot, options) {
    if (!IdProxy.idIsProxied(snapshot.id)) {
      // FIXME: relationship id maybe proxied.
      return this._super.apply(this, arguments);
    }

    var data = IdProxy.retrieve(snapshot.id, snapshot.type);
    if (!data.projection) {
      // TODO: case with dynamically created projection? Or it must be added to the Projections collection?
      return this._super.apply(this, arguments);
    }

    var json = {};

    if (options && options.includeId) {
      var id = data.id;
      if (id) {
        json[Ember.get(this, 'primaryKey')] = id;
      }
    }

    var changedAttributes = Object.keys(snapshot.record.get('_inFlightAttributes'));

    snapshot.eachAttribute(function(key, attribute) {
      if (changedAttributes.indexOf(key) !== -1) {
        if (data.projection.get('properties').indexOf(key) === -1) {
          throw new Error('Property "' + key +
                          '" is modified, but not exists in current Model Projection: "' +
                          data.projectionName + '".');
        }

        this.serializeAttribute(snapshot, json, key, attribute);
      }
    }, this);

    snapshot.eachRelationship(function(key, relationship) {
      // TODO: override to retrieve original ids for relationships.
      if (relationship.kind === 'belongsTo') {
        this.serializeBelongsTo(snapshot, json, relationship);
      } else if (relationship.kind === 'hasMany') {
        this.serializeHasMany(snapshot, json, relationship);
      }
    }, this);

    return json;
  }
});
