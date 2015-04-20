import Ember from 'ember';
import DS from 'ember-data';

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

    serialize: function(snapshot, options) {
        var objectView = snapshot.record.get('_view');
        if (!objectView) {
            return this._super.apply(this, arguments);
        }

        var json = {};

        if (options && options.includeId) {
            var id = snapshot.id;

            if (id) {
                json[Ember.get(this, 'primaryKey')] = id;
            }
        }

        var changedAttributes = Object.keys(snapshot.record.get('_inFlightAttributes'));

        snapshot.eachAttribute(function(key, attribute) {
            if (changedAttributes.indexOf(key) !== -1) {
                if (objectView.properties.indexOf(key) === -1) {
                    throw new Error('Property "' + key +
                                    '" is modified, but not exists in current DataObject View: "' +
                                    objectView.name + '".');
                }

                this.serializeAttribute(snapshot, json, key, attribute);
            }
        }, this);

        snapshot.eachRelationship(function(key, relationship) {
            if (relationship.kind === 'belongsTo') {
                this.serializeBelongsTo(snapshot, json, relationship);
            } else if (relationship.kind === 'hasMany') {
                this.serializeHasMany(snapshot, json, relationship);
            }
        }, this);

        return json;
    }
});
