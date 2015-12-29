/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Service for triggering groupedit events.
 *
 * @class GroupEditEvents
 * @extends Ember.Service
 * @public
 */
export default Ember.Service.extend(Ember.Evented, {
  /**
   * Trigger for "add new row" event in groupedit.
   * Event name: groupEditAddRow.
   *
   * @method addRowTrigger
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   */
  addRowTrigger(componentName) {
    this.trigger('groupEditAddRow', componentName);
  },

  /**
   * Trigger for "delete current row" event in groupedit.
   * Event name: groupEditDeleteRow.
   *
   * @method deleteRowTrigger
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   */
  deleteRowTrigger(componentName) {
    this.trigger('groupEditDeleteRow', componentName);
  },

  /**
   * Trigger for "delete selected rows" event in groupedit.
   * Event name: groupEditDeleteRows.
   *
   * @method deleteRowsTrigger
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   */
  deleteRowsTrigger(componentName) {
    this.trigger('groupEditDeleteRows', componentName);
  },

  /**
   * Trigger for "new row has been added" event in groupedit.
   * Event name: groupEditRowAdded.
   *
   * @method rowAddedTrigger
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {Model} record The model corresponding to added row in groupedit.
   */
  rowAddedTrigger(componentName, record) {
    this.trigger('groupEditRowAdded', componentName, record);
  },

  /**
   * Trigger for "row has been deleted" event in groupedit.
   * Event name: groupEditRowDeleted.
   *
   * @method rowDeletedTrigger
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {Model} record The model corresponding to deleted row in groupedit.
   */
  rowDeletedTrigger(componentName, record) {
    this.trigger('groupEditRowDeleted', componentName, record);
  },

  /**
   * Trigger for "selected rows has been deleted" event in groupedit.
   * Event name: groupEditRowDeleted.
   *
   * @method rowDeletedTrigger
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {Integer} count Count of deleted rows in groupedit.
   */
  rowsDeletedTrigger(componentName, count) {
    this.trigger('groupEditRowsDeleted', componentName, count);
  },

  /**
   * Trigger for "row has been selected" event in groupedit.
   * Event name: groupEditRowSelected.
   *
   * @method rowSelectedTrigger
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {Model} record The model corresponding to selected row in groupedit.
   * @param {Integer} count Count of selected rows in groupedit.
   */
  rowSelectedTrigger(componentName, record, count) {
    this.trigger('groupEditRowSelected', componentName, record, count);
  },

  /**
   * Trigger for "model(s) corresponding to some row(s) was changed" event in groupedit.
   * Event name: groupEditRowsChanged.
   *
   * @method rowsChangedTrigger
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   */
  rowsChangedTrigger(componentName) {
    this.trigger('groupEditRowsChanged', componentName);
  }
});
