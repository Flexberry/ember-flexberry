import Ember from 'ember';

export default Ember.Component.extend({
  addText: 'Add',
  removeText: 'Remove',

  items: undefined,
  projection: undefined,

  actions: {
    add: function () {
      this.sendAction('add');
    },
    remove: function () {
      this.sendAction('remove');
    }
  }
});
