import Ember from 'ember';

export default Ember.Component.extend({
  placeholder: '(no value)',
  chooseText: 'Choose',
  removeText: 'X',

  projection: undefined,
  value: undefined,
  relationName: undefined,
  title: undefined,

  actions: {
    choose: function(relationName, projection, title) {
      this.sendAction('choose', relationName, projection, title, undefined);
    },
    remove: function(relationName) {
      this.sendAction('remove', relationName, undefined);
    }
  }
});
