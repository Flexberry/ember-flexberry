//import DS from 'ember-data';
import ApplicationSerializer from 'prototype-ember-cli-application/serializers/application';
import IdProxy from '../utils/idproxy';

// TODO? or override extractArray in ApplicationSerializer.
// (http://emberjs.com/api/data/classes/DS.RESTSerializer.html#method_extractArray)
export default ApplicationSerializer.extend(/*DS.EmbeddedRecordsMixin,*/ {
    /*attrs: {
        employee1: { embedded: 'always' },
        employees1: { serialize: 'ids', deserialize: 'records' }
    },*/

    // Раньше можно было определить primaryKey как функцию, и задать один алгоритм для всех сериализаторов.
    // Щас либо по отдельности для каждого задавать это свойство, либо переопределять функции,
    // в которых задействован primaryKey (нужно иметь ввиду, что Ember Data в бете).
    primaryKey: 'EmployeeID',

    normalizePayload: function(payload) {
        // TODO: refactor using extractSingle and extractArray.
        if (payload.value) {
            payload.employees = payload.value;
            delete payload.value;
        } else {
            payload = { employee: payload };
        }

        return payload;
    },

    // TODO: move to application serializer or extract into mixin/baseclass.
    normalize: function(type, hash, prop) {
        hash = this._super.apply(this, arguments);

        var view = hash._view;
        if (view) {
            hash._origId = hash.id;
            hash.id = IdProxy.mutate(hash.id, view);

            type.eachRelationship(function(key, relationship) {
                // It works with async relationships.
                // TODO: support embedded relationships (without links)
                if (relationship.kind === 'belongsTo') {
                    if (hash[key]) {
                        hash[key] = IdProxy.mutate(hash[key], view.masters[key]);
                    }
                } else if (relationship.kind === 'hasMany') {
                    if (hash[key]) {
                        var subview = view.details[key];
                        var ids = hash[key].map(function(id) {
                            return IdProxy.mutate(id, subview);
                        });

                        hash[key] = ids;
                    }
                }
            });
        }

        return hash;
    }
});
