import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'th',
  classNames: ['dt-head-left'],
  column: null,
  action: 'headerCellClick',
  click: function(event) {
    this.sendAction('action', this.column, event);
  }
});
