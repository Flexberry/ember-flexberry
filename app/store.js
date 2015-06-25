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
      if (!relationship.options.async) {
        return;
      }

      var value = data[key];
      if (Ember.isNone(value)) {
        return;
      }

      var kind = relationship.kind;
      if (kind === 'belongsTo') {
        let id = value;
        store._fetchAsyncRelationshipRecord(relationship.type, id);
      } else if (kind === 'hasMany') {
        let ids = value;
        for (let i = 0; i < ids.length; i++) {
          store._fetchAsyncRelationshipRecord(relationship.type, ids[i]);
        }
      }
    });
  },

  _fetchAsyncRelationshipRecord: function(type, id) {
    // Не reload, потому что async relationships загружаются по требованию,
    // и логичнее все же делать unload. Reload же сразу загрузит отношение.
    const reloadRightNow = false;

    let record = this.getById(type, id);
    if (Ember.isNone(record)) {
      return;
    }

    if (!record.get('isEmpty')) {
      if (reloadRightNow) {
        record.reload();
      } else {
        this.unloadRecord(record);
      }
    }
  },

  // create a new record with 'modelProjection'
  createProjectedRecord: function(type, projection) {
    return this.createRecord(type, {
      projection: projection
    });
  }
});
