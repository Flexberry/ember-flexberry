import Ember from 'ember';

export default Ember.Object.extend({
  add: function(projPropName, proj) {
    this.set(projPropName, proj);
  }
});
