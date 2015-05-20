import Ember from 'ember';

export default Ember.Mixin.create({
  init: function() {
    this._super.apply(this, arguments);
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
