/**
 * @module ember-flexberry
 */

import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * Boolean property to show or hide add button in toolbar.
   * Add new record button will not display if set to false.
   *
   * @property createNewButton
   * @type Boolean
   * @default true
   */
  createNewButton: true,

  /**
   * Boolean property to show or hide delete button in toolbar.
   * Delete record button will not display if set to false.
   *
   * @property deleteButton
   * @type Boolean
   * @default true
   */
  deleteButton: true,

  /**
   * Default class for component wrapper.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['groupedit-toolbar', 'ui', 'middle', 'aligned', 'grid'],

  /**
   * The collection of functions that will be invoked when
   * click on toolbar buttons.
   *
   * @property actions
   * @type Object
   * @readOnly
   */
  actions: {
    // Add record click button handler
    addRow: function() {
    },

    // Delete records click button handler
    deleteRows: function() {
      if (confirm('Do you really want to delete selected records?')) {
        var selectedRecords = this.get('selectedRecords');
        var selectedRows = this.get('selectedRows');
        selectedRows.forEach(function(item, index, enumerable) {
          item.remove();
        });
        selectedRecords.forEach(function(item, index, enumerable) {
          item.deleteRecord();
        });
        selectedRows.clear();
        selectedRecords.clear();
      }
    }
  },

  /**
   * The array of selected records in object-list-view
   *
   * @property selectedRecords
   * @type Array
   */
  selectedRecords: undefined,

  /**
   * The array of selected rows in object-list-view.
   * Each row in array is jQuery object.
   *
   * @property selectedRows
   * @type Array
   */
  selectedRows: undefined,

  /**
   * Boolean flag to indicate enabled state of delete rows button.
   *
   * @property isDeleteRowsEnabled
   * @type Boolean
   */
  isDeleteRowsEnabled: undefined,

  /**
   * Handles the event, when length of {{#crossLink "selectedRecords:property"}}{{/crossLink}} changed.
   * Changes state of {{#crossLink "isDeleteRowsEnabled:property"}}{{/crossLink}} flag.
   *
   * @method selectedRecordsLengthObserver
   */
  selectedRecordsLengthObserver: Ember.observer('selectedRecords.length', function() {
    var selectedRecords = this.get('selectedRecords');
    var operationEnabled = selectedRecords && selectedRecords.length > 0;
    this.set('isDeleteRowsEnabled', operationEnabled);
  })
});
