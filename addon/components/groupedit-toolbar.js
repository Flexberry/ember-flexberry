/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Toolbar compoent for flexberry-groupedit component.
 *
 * @class GroupEditToolbar
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * Default class for component wrapper.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['groupedit-toolbar', 'ui', 'middle', 'aligned', 'grid'],

  /**
   * Service that triggers groupedit events.
   *
   * @property groupEditEventsService
   * @type Service
   */
  groupEditEventsService: Ember.inject.service('objectlistview-events'),

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
   * The method called when component is instantiated.
   *
   * @method init
   * @throws {Error} An error occurred during the initialization of component.
   */
  init() {
    this._super(...arguments);
    var componentName = this.get('componentName');
    if (!componentName) {
      throw new Error('Name of flexberry-groupedit component was not defined.');
    }

    this.get('groupEditEventsService').on('olvRowSelected', this, this._rowSelected);
    this.get('groupEditEventsService').on('olvRowsDeleted', this, this._rowsDeleted);
  },

  /**
   * Implementation of component's teardown.
   *
   * @method willDestroy
   */
  willDestroy() {
    this.get('groupEditEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('groupEditEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this._super(...arguments);
  },

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
      var componentName = this.get('componentName');
      this.get('groupEditEventsService').addRowTrigger(componentName);
    },

    // Delete records click button handler
    deleteRows: function() {
      var componentName = this.get('componentName');
      this.get('groupEditEventsService').deleteRowsTrigger(componentName);
    }
  },

  /**
   * Boolean flag to indicate enabled state of delete rows button.
   *
   * @property isDeleteRowsEnabled
   * @type Boolean
   */
  isDeleteRowsEnabled: undefined,

  /**
   * Event handler for "row has been selected" event in groupedit.
   *
   * @method _rowSelected
   * @private
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {Model} record The model corresponding to selected row in groupedit.
   * @param {Integer} count Count of selected rows in groupedit.
   */
  _rowSelected: function(componentName, record, count) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteRowsEnabled', count > 0);
    }
  },

  /**
   * Event handler for "selected rows has been deleted" event in groupedit.
   *
   * @method __rowsDeleted
   * @private
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {Integer} count Count of deleted rows in groupedit.
   */
  _rowsDeleted: function(componentName, count) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteRowsEnabled', false);
    }
  }
});
