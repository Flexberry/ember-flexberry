/**
  @module ember-flexberry
*/

import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    /**
      Table row click handler.

      @method actions.objectListViewRowClick
      @public

      @param {Ember.Object} record Record related to clicked table row
    */
    objectListViewRowClick(record, editFormRoute) {
      this.transitionTo(editFormRoute, record.get('id'));
    },

    /**
      This action is called when user click on refresh button.

      @method actions.refreshList
      @public
    */
    refreshList() {
      this.refresh();
    }
  }
});
