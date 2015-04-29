import Ember from 'ember';
import DS from 'ember-data';

export default DS.Store.reopen({
    push: function(typeName, data) {
        var backburner = this._backburner;
        var store = this;
        var type = this.modelFor(typeName); //TODO: get type of record maybe?
        var fetchAsyncRelationships = true;
        if (fetchAsyncRelationships) {
            backburner.join(function() {
                backburner.schedule('normalizeRelationships', store, '_fetchAsyncRelationships', record, type, data);
            });
        }

        var record = this._super.apply(this, arguments);

        backburner.join(function() {
            backburner.schedule('normalizeRelationships', store, '_setRelationshipsViews', record, type, data);
        });

        return record;
    },

    _fetchAsyncRelationships: function(record, type, data) {
        var store = this;
        // Argument `record` never used. `record` is null if this func is called before push -> _super.apply.
        //var view = record.get('_view');
        var view = data._view;
        type.eachRelationship(function(key, relationship) {
            if (relationship.options.polymorphic) { //TODO: if (options.async) maybe?
                return;
            }

            var value = data[key];
            if (Ember.isNone(value)) {
                return;
            }

            var kind = relationship.kind;
            if (kind === 'belongsTo') {
                value = store.getById(relationship.type, value);
                if (Ember.isNone(value)) {
                    return;
                }

                if (!value.get('isEmpty') && view.masters[key] !== value.get('_view')) {
                    ////value остается в памяти record
                    store.unloadRecord(value);
                    //value = store.buildRecord(relationship.type, value.id, { _view: view.masters[key] }); // or store.recordForId
                    //data[key] = value;

                    ////value.reload();
                }
            } else if (kind === 'hasMany') {
                for (var i = 0; i < value.length; i++) {
                    var val = store.getById(relationship.type, value[i]);
                    if (Ember.isNone(val)) {
                        return;
                    }

                    if (!val.get('isEmpty') && view.details[key] !== val.get('_view')) {
                        ////val.reload();
                        store.unloadRecord(val);
                    }
                }
            }
        });
    },

    _setRelationshipsViews: function(record, type, data) {
        var view = record.get('_view');
        type.eachRelationship(function(key, relationship) {
            var value = data[key];
            if (Ember.isNone(value)) {
                return;
            }

            var kind = relationship.kind;
            if (kind === 'belongsTo') {
                var masterView = view.masters[key];
                Ember.assert('Master View must be declared', masterView);
                // Attempted to handle event `didSetProperty` on <prototype-ember-cli-application@model:employee::ember717:2> while in state root.empty.
                ////value.set('_view', masterView);
                value._view = masterView;
            } else if (kind === 'hasMany') {
                var detailView = view.details[key];
                Ember.assert('Detail View must be declared', detailView);
                for (var i = 0; i < value.length; i++) {
                    ////value[i].set('_view', detailView);
                    value[i]._view = detailView;
                }
            }
        });
    },

    // https://github.com/emberjs/data/issues/1576
    findOneQuery: function(type, id, query) {
        var store = this,
            typeClass = store.modelFor(type),
            adapter = store.adapterFor(typeClass),
            serializer = store.serializerFor(typeClass),
            url = adapter.buildURL(type, id),
            ajaxPromise = adapter.ajax(url, 'GET', { data: query });

        return ajaxPromise.then(function(rawPayload) {
            var extractedPayload = serializer.extract(store, typeClass, rawPayload, id, 'find'),
                model = store.push(typeClass, extractedPayload);
            return model;
        });
    },

    findOneByView: function(type, id, view, query) {
        var store = this,
            typeClass = store.modelFor(type),
            adapter = store.adapterFor(typeClass),
            serializer = store.serializerFor(typeClass),
            url = adapter.buildURL(type, id);

        var viewQuery = adapter.getDataObjectViewQuery(view, serializer);
        query = Ember.merge(viewQuery, query);
        var ajaxPromise = adapter.ajax(url, 'GET', { data: query });

        return ajaxPromise.then(function(rawPayload) {
            var extractedPayload = serializer.extract(store, typeClass, rawPayload, id, 'find'),
                model = store.push(typeClass, extractedPayload);

            model.set('_view', view);
            return model;
        });
    },

    findManyByView: function(type, view, query) {
        var store = this,
            typeClass = store.modelFor(type),
            adapter = store.adapterFor(typeClass),
            serializer = store.serializerFor(typeClass);

        var viewQuery = adapter.getDataObjectViewQuery(view, serializer);
        query = Ember.merge(viewQuery, query);

        return store.find(type, query).then(function(records) {
            records.forEach(function(rec) {
                rec.set('_view', view);
            });
            return records;
        });
    }
});
