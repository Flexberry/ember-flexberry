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

      if (IdProxy.idIsProxied(id, this.constructor)) {
        return IdProxy.retrieve(id).view;
      } else {
        return null;
      }
    }
  })
});

Model.reopenClass({
  /**
   * Define Data Object Projections here using
   * DataObjectViewsCollection and DataObjectView.
   */
  // TODO: rename Views to Projections.
  Views: null
});

export default Model;
