import Ember from 'ember';

export default Ember.Component.extend({
  placeholder: '(no value)',
  chooseText: 'Choose',
  removeText: 'X',

  projection: undefined,
  value: undefined,
  relationName: undefined,

  init:function() {
    this._super();
  },

  actions: {
    choose: function (relationName, projection) {
      this.sendAction('choose', relationName, projection);
    },
    remove: function (relationName) {
      this.sendAction('remove', relationName);
    }
  }
});