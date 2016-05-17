/**
 * @module ember-flexberry
 */

import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    /**
     * Table row click handler.
     *
     * @param {Ember.Object} record Record related to clicked table row.
     */
    objectListViewRowClick: function(record, editFormRoute) {
      this.transitionTo(editFormRoute, record.get('id'));
    },

    refreshList: function() {
      this.refresh();
    }
  }
});
