import Ember from 'ember';

export let separator = ':';

export default {
  mutate: function(id, projection) {
    Ember.assert('id is defined', !!id);
    Ember.assert('projection.name is defined', !!projection.name);
    return id + separator + projection.type + separator + projection.name + separator;
  },

  // TODO: refactor? maybe func(id, store)??
  retrieve: function(id, type = null) {
    var arr = id.split(separator);
    Ember.assert('id splitted into 4 parts', arr.length === 4);
    var projectionOwner = arr[1];
    var projectionName = arr[2];
    var projection;

    if (type) {
      if (type.typeKey === projectionOwner) {
        projection = type.projections.get(projectionName);
      } else {
        var store = type.store;
        var ownerType = store.modelFor(projectionOwner);
        projection = ownerType.projections.get(projectionName);
      }
    } else {
      projection = null;
    }

    return {
      id: arr[0],
      projectionOwner: projectionOwner,
      projectionName: projectionName,
      projection: projection
    };
  },

  idIsProxied: function(id) {
    // make method work for new records (with id === null),
    // and return that no projection defined in 'id' prop
    if (!id) {
      return false;
    }
    return id[id.length - 1] === separator;
  }
};
