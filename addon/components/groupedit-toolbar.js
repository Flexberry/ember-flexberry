/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { checkConfirmDeleteRows } from '../utils/check-function-when-delete-rows-and-records';

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
    @private
    @property _hasSelectedRows
    @type Boolean
    @default false
  */
  _hasSelectedRows: false,

  /**
    @private
    @property _disableMoveUpButton
    @type Boolean
    @default false
  */
  _disableMoveUpButton: false,

  /**
    @private
    @property _disableMoveDownButton
    @type Boolean
    @default false
  */
  _disableMoveDownButton: false,

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
    Name of action to send out, action triggered by click on user button.

    @property customButtonAction
    @type String
    @default 'customButtonAction'
  */
  customButtonAction: 'customButtonAction',

  /**
    See {{#crossLink "FlexberryGroupeditComponent/customButtons:property"}}{{/crossLink}}.

    @property customButtons
    @type Array
  */
  customButtons: undefined,

  /**
    Boolean property to show or hide delete button in toolbar.
    Delete record button will not display if set to false.

    @property deleteButton
    @type Boolean
    @default true
  */
  deleteButton: true,

  /**
    Flag: indicates whether to show default settings button at toolbar.

    @property defaultSettingsButton
    @type Boolean
    @default true
  */
  defaultSettingsButton: true,

  /**
    Boolean property to show or hide arrows button in toolbar.

    @property arrowsButtons
  */
  arrowsButtons: Ember.computed('orderedProperty', function() {
    return !Ember.isNone(this.get('orderedProperty'));
  }),

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

      let checkConfirmDeleteRowsResult = checkConfirmDeleteRows(this.get('confirmDeleteRow'));

      if (!checkConfirmDeleteRowsResult) return;

      checkConfirmDeleteRowsResult.then(() => {
        let componentName = this.get('componentName');
        this.get('_groupEditEventsService').deleteRowsTrigger(componentName);
      });
    },

    /**
      Handles default usersettings button click.

      @method actions.setDefaultSettings
    */
    setDefaultSettings() {
      let componentName = this.get('componentName');
      let userSettingsService = this.get('userSettingsService');
      let _this = this;

      if (!userSettingsService.haveDefaultUserSetting(componentName)) {
        return;
      }

      let defaultDeveloperUserSetting = userSettingsService.getDefaultDeveloperUserSetting(componentName) || {};
      let currentUserSetting = userSettingsService.getCurrentUserSetting(componentName);
      currentUserSetting.sorting = defaultDeveloperUserSetting.sorting || [];
      currentUserSetting.colsOrder = defaultDeveloperUserSetting.colsOrder;
      currentUserSetting.columnWidths = defaultDeveloperUserSetting.columnWidths;
      userSettingsService.saveUserSetting(componentName, undefined, currentUserSetting)
      .then(record => {
        this.set('sorting', currentUserSetting.sorting);
        _this.get('_groupEditEventsService').updateWidthTrigger(componentName);
      });
    },

    /**
      Action for custom button.
      @method actions.customButtonAction
      @public
      @param {Function|String} action The action or name of action.
    */
    customButtonAction(action) {
      let actionType = typeof action;
      if (actionType === 'function') {
        action();
      } else if (actionType === 'string') {
        this.sendAction('customButtonAction', action);
      } else {
        throw new Error('Unsupported action type for custom buttons.');
      }
    },

    /**
      Handles arrow buttons click.

      @method actions.moveRow
    */
    moveRow(shift) {
      if (this.get('readonly')) {
        return;
      }

      let componentName = this.get('componentName');
      this.get('_groupEditEventsService').moveRowTrigger(componentName, shift);
    },
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
    @param {Boolean} checked Current state of row in objectlistview (checked or not)
    @param {Object} recordWithKey The model wrapper with additional key corresponding to selected row
  */
  _rowSelected(componentName, record, count, checked, recordWithKey) {
    if (componentName === this.get('componentName') && !this.get('isDestroying')) {
      this.set('_hasSelectedRows', count > 0);

      const $tbody = this.$().parent().find('tbody');
      const $tr = $tbody.find('tr.active');

      this.set('_disableMoveUpButton', $tr.first().get(0) === $tbody.get(0).firstElementChild);
      this.set('_disableMoveDownButton', $tr.last().get(0) === $tbody.get(0).lastElementChild);
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
      this.set('_hasSelectedRows', false);
    }
  }
});
