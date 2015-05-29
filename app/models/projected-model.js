import Ember from 'ember';
import DS from 'ember-data';
import IdProxy from '../utils/idproxy';

var Model = DS.Model.extend({
  primaryKey: Ember.computed('id', {
    get: function() {
      var id = this.get('id');
      if (id === null) {
        // id isn't setted in newly created records.
        return null;
      }

      if (IdProxy.idIsProxied(id)) {
        return IdProxy.retrieve(id).id;
      } else {
        return id;
      }
    }
  }),

  projection: Ember.computed('id', {
    get: function() {
      var id = this.get('id');
      if (id === null) {
        // id isn't setted in newly created records.
        return null;
      }

      if (IdProxy.idIsProxied(id)) {
        return IdProxy.retrieve(id, this.constructor).projection;
      } else {
        return null;
      }
    }
  })
});

Model.reopenClass({
  /**
   * Define Model Projections here using
   * ModelProjectionsCollection and ModelProjection classes.
   */
  Projections: null
});

export default Model;
