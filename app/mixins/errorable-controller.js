import Ember from 'ember';

// Structure to show common errors.
export default Ember.Mixin.create({
  init: function() {
    this._super();
    this.set('errorMessages', []);
  },

  actions:{
    addErrorMessage: function(msg) {
      this.get('errorMessages').pushObject(msg);
    },

    dismissErrorMessages: function() {
      this.get('errorMessages').clear();
    }
  }
});
