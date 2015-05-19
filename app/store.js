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
        backburner.schedule('normalizeRelationships', store,
                            '_fetchAsyncRelationships', type, data);
      });
    }

    var record = this._super.apply(this, arguments);
    return record;
  },

  _fetchAsyncRelationships: function(type, data) {
    var store = this;
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

        if (!value.get('isEmpty')) {
          // TODO: value остается в памяти record? Нужно проверить.
          store.unloadRecord(value);
          //value = store.buildRecord(relationship.type, value.id); // or store.recordForId
          //data[key] = value;

          // Не релоад, потому что async relationships загружаются по требованию
          // и логичнее все же делать анлоад. Релоад же сразу загрузит.
          ////value.reload();
        }
      } else if (kind === 'hasMany') {
        for (var i = 0; i < value.length; i++) {
          var val = store.getById(relationship.type, value[i]);
          if (Ember.isNone(val)) {
            return;
          }

          if (!val.get('isEmpty')) {
            ////val.reload();
            store.unloadRecord(val);
          }
        }
      }
    });
  },

  // https://github.com/emberjs/data/issues/1576
  // TODO: remove, not used.
  findOneQuery: function(type, id, query) {
    Ember.assert('deprecated');
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

  // TODO: remove, not used.
  findOneByView: function(type, id, view, query) {
    Ember.assert('deprecated');
    var store = this,
        typeClass = store.modelFor(type),
        adapter = store.adapterFor(typeClass),
        serializer = store.serializerFor(typeClass),
        url = adapter.buildURL(type, id);

    var viewQuery = adapter.getDataObjectViewQuery(view, serializer);
    query = Ember.merge(viewQuery, query);
    return adapter.ajax(url, 'GET', { data: query });
  },

  // TODO: remove, not used.
  findManyByView: function(type, view, query) {
    Ember.assert('deprecated');
    var store = this,
        typeClass = store.modelFor(type),
        adapter = store.adapterFor(typeClass),
        serializer = store.serializerFor(typeClass);

    var viewQuery = adapter.getDataObjectViewQuery(view, serializer);
    query = Ember.merge(viewQuery, query);

    return store.find(type, query);
  }
});
