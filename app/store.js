import Ember from 'ember';
import DS from 'ember-data';

DS.Store.reopen({
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
