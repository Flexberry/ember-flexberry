import Ember from 'ember';
import DS from 'ember-data';

export default DS.Store.reopen({
  push: function(typeName, data) {
    var backburner = this._backburner;
    var store = this;
    var type = this.modelFor(typeName);

    // NOTE: Для чего это? Мы можем управлять получением модели:
    // store.find (getById) или store.fetch, но получением ее отношений нет.
    // Поэтому, если нужен fetch для отношений (мастера и детейлы),
    // нужно заюзать _fetchAsyncRelationships.
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
      if (relationship.options.polymorphic) { //TODO: if (!options.async) maybe?
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
  }
});
