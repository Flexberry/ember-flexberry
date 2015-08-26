import Ember from 'ember';

export default Ember.Component.extend({
  modelName: null,
  modelController:null,
  createNewButton: false,
  refreshButton: false,
  createNewPath: function() {
    return this.get('modelName') + '.new';
  }.property('modelName'),

  actions: {
    clickRefreshButton: function() {
      this.get('modelController').send('refreshList');
    }
  }
});
