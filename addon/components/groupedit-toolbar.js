/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
  Toolbar component for {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.

  @class GroupEditToolbarComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Service that triggers {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} events.

    @property _groupEditEventsService
    @type Service
    @private
  */
  _groupEditEventsService: Ember.inject.service('objectlistview-events'),

  /**
    Boolean flag to indicate enabled state of delete rows button.

    If rows at {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} are selected this flag is enabled.

    @property _isDeleteRowsEnabled
    @type Boolean
    @private
  */
  _isDeleteRowsEnabled: undefined,

  /**
    Default class for component wrapper.

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['groupedit-toolbar'],

  /**
    Boolean property to show or hide add button in toolbar.
    Add new record button will not display if set to false.

    @property createNewButton
    @type Boolean
    @default true
  */
  createNewButton: true,

  /**
    Boolean property to show or hide delete button in toolbar.
    Delete record button will not display if set to false.

    @property deleteButton
    @type Boolean
    @default true
  */
  deleteButton: true,

  actions: {
    /**
      Handles add record button click and triggers add record event on
      {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.

      @method actions.addRow
    */
    addRow() {
      if (this.get('readonly')) {
        return;
      }

      let componentName = this.get('componentName');
      this.get('_groupEditEventsService').addRowTrigger(componentName);
    },

    /**
      Handles delete records button click and triggers delete records event on
      {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.

      @method actions.deleteRows
    */
    deleteRows() {
      if (this.get('readonly')) {
        return;
      }

      let confirmDeleteRows = this.get('confirmDeleteRows');
      if (confirmDeleteRows) {
        Ember.assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRows === 'function');
        if (!confirmDeleteRows()) {
          return;
        }
      }

      let componentName = this.get('componentName');
      this.get('_groupEditEventsService').deleteRowsTrigger(componentName);
    }
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see {{#crossLink "FlexberryBaseComponent/init:method"}}init method{{/crossLink}}
    of {{#crossLink "FlexberryBaseComponent"}}{{/crossLink}}.

    @method init
    @throws {Error} An error occurred during the initialization of component.
  */
  init() {
    this._super(...arguments);
    let componentName = this.get('componentName');
    if (!componentName) {
      throw new Error('Name of flexberry-groupedit component was not defined.');
    }

    this.get('_groupEditEventsService').on('olvRowSelected', this, this._rowSelected);
    this.get('_groupEditEventsService').on('olvRowsDeleted', this, this._rowsDeleted);
  },

  /**
    An overridable method called when objects is teardowned.
    For more information see {{#crossLink "FlexberryBaseComponent/willDestroy:method"}}willDestroy method{{/crossLink}}
    of {{#crossLink "FlexberryBaseComponent"}}{{/crossLink}}.

    @method willDestroy
  */
  willDestroy() {
    this.get('_groupEditEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('_groupEditEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this._super(...arguments);
  },

  /**
    Event handler for "row has been selected" event in {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.

    @method _rowSelected
    @private

    @param {String} componentName The name of {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.
    @param {Model} record The model corresponding to selected row in {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.
    @param {Integer} count Count of selected rows in {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.
  */
  _rowSelected(componentName, record, count) {
    if (componentName === this.get('componentName')) {
      this.set('_isDeleteRowsEnabled', count > 0);
    }
  },

  /**
    Event handler for "selected rows has been deleted" event in {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.

    @method _rowsDeleted
    @private

    @param {String} componentName The name of {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.
    @param {Integer} count Count of deleted rows in {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.
  */
  _rowsDeleted(componentName, count) {
    if (componentName === this.get('componentName')) {
      this.set('_isDeleteRowsEnabled', false);
    }
  }
});
