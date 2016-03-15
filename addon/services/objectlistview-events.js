/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Service for triggering objectlistview events.
 *
 * @class ObjectlistviewEvents
 * @extends Ember.Service
 * @public
 */
export default Ember.Service.extend(Ember.Evented, {
  /**
   * Trigger for "add new row" event in objectlistview.
   * Event name: olvAddRow.
   *
   * @method addRowTrigger
   *
   * @param {String} componentName The name of objectlistview component.
   */
  addRowTrigger(componentName) {
    this.trigger('olvAddRow', componentName);
  },

  /**
   * Trigger for "delete current row" event in objectlistview.
   * Event name: olvDeleteRow.
   *
   * @method deleteRowTrigger
   *
   * @param {String} componentName The name of objectlistview component.
   */
  deleteRowTrigger(componentName) {
    this.trigger('olvDeleteRow', componentName);
  },

  /**
   * Trigger for "delete selected rows" event in objectlistview.
   * Event name: olvDeleteRows.
   *
   * @method deleteRowsTrigger
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Boolean} immediately Flag to delete record immediately.
   */
  deleteRowsTrigger(componentName, immediately) {
    this.trigger('olvDeleteRows', componentName, immediately);
  },

  /**
   * Trigger for "filter by any match" event in objectlistview.
   *
   * @method filterByAnyMatchTrigger
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {String} pattern The pattern to match attributes values.
   */
  filterByAnyMatchTrigger(componentName, pattern) {
    this.trigger('filterByAnyMatch', componentName, pattern);
  },

  /**
   * Trigger for "new row has been added" event in objectlistview.
   * Event name: olvRowAdded.
   *
   * @method rowAddedTrigger
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Model} record The model corresponding to added row in objectlistview.
   */
  rowAddedTrigger(componentName, record) {
    this.trigger('olvRowAdded', componentName, record);
  },

  /**
   * Trigger for "row has been deleted" event in objectlistview.
   * Event name: olvRowDeleted.
   *
   * @method rowDeletedTrigger
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Model} record The model corresponding to deleted row in objectlistview.
   * @param {Boolean} immediately Flag to show if record was deleted immediately.
   */
  rowDeletedTrigger(componentName, record, immediately) {
    this.trigger('olvRowDeleted', componentName, record, immediately);
  },

  /**
   * Trigger for "selected rows has been deleted" event in objectlistview.
   * Event name: groupEditRowDeleted.
   *
   * @method rowDeletedTrigger
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Integer} count Count of deleted rows in objectlistview.
   * @param {Boolean} immediately Flag to show if records were deleted immediately.
   */
  rowsDeletedTrigger(componentName, count, immediately) {
    this.trigger('olvRowsDeleted', componentName, count, immediately);
  },

  /**
   * Trigger for "row has been selected" event in objectlistview.
   * Event name: olvRowSelected.
   *
   * @method rowSelectedTrigger
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Model} record The model corresponding to selected row in objectlistview.
   * @param {Integer} count Count of selected rows in objectlistview.
   */
  rowSelectedTrigger(componentName, record, count) {
    this.trigger('olvRowSelected', componentName, record, count);
  },

  /**
   * Trigger for "model(s) corresponding to some row(s) was changed" event in objectlistview.
   * Event name: olvRowsChanged.
   *
   * @method rowsChangedTrigger
   *
   * @param {String} componentName The name of objectlistview component.
   */
  rowsChangedTrigger(componentName) {
    this.trigger('olvRowsChanged', componentName);
  }
});
