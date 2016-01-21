/**
 * @module ember-flexberry
 */

import Ember from 'ember';

export default Ember.Component.extend({
  modelName: null,
  modelController:null,
  createNewButton: false,
  refreshButton: false,

  actions: {
    refresh: function() {
      this.get('modelController').send('refreshList');
    },
    createNew: function() {
      let modelController = this.get('modelController');
      let modelName = this.get('modelName');
      modelController.transitionToRoute(modelName + '.new');
    }
  }
});
