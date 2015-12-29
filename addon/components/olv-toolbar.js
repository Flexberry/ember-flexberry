/**
 * @module ember-flexberry
 */

import Ember from 'ember';

export default Ember.Component.extend({
  modelName: null,
  modelController:null,
  createNewButton: false,
  refreshButton: false,
  createNewPath: Ember.computed('modelName', function() {
    return this.get('modelName') + '.new';
  }),

  actions: {
    clickRefreshButton: function() {
      this.get('modelController').send('refreshList');
    }
  }
});
