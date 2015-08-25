import Ember from 'ember';

export default Ember.Component.extend({
  modelName: null,
  createNewButton: false,
  refreshButton: false,
  createNewPath: function() {
    return this.get('modelName') + '.new';
  }.property('modelName')
});
