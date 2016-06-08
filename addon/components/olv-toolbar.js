/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

export default FlexberryBaseComponent.extend({
  modelController: null,

  /**
   * Route for edit form by click row
   *
   * @property editFormRoute
   * @type String
   * @default undefined
   */
  editFormRoute: undefined,

  /**
   * Service that triggers objectlistview events.
   *
   * @property objectlistviewEventsService
   * @type ObjectlistviewEvents
   */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
   * Flag to use creation button at toolbar.
   *
   * @property createNewButton
   * @type Boolean
   * @default false
   */
  createNewButton: false,

  /**
   * The flag to specify whether the create button is enabled.
   *
   * @property createNewButton
   * @type Boolean
   * @default true
   */
  enableCreateNewButton: true,

  /**
   * Flag to use refresh button at toolbar.
   *
   * @property refreshButton
   * @type Boolean
   * @default false
   */
  refreshButton: false,

  /**
   * Flag to use delete button at toolbar.
   *
   * @property deleteButton
   * @type Boolean
   * @default false
   */
  deleteButton: false,

  /**
   * Flag to use filter button at toolbar.
   *
   * @property filterButton
   * @type Boolean
   * @default false
   */
  filterButton: false,

  /**
   * Used to specify default 'filter by any match' field text.
   *
   * @property filterText
   * @type String
   * @default null
   */
  filterText: null,

  /**
   * The flag to specify whether the delete button is enabled.
   *
   * @property deleteButton
   * @type Boolean
   * @default true
   */
  enableDeleteButton: true,

  /**
   * Name of action to send out, action triggered by click on user button.
   *
   * @property customButtonAction
   * @type String
   * @default 'customButtonAction'
   */
  customButtonAction: 'customButtonAction',

  /**
   * Handler to get custom buttons from controller.
   * It has to be closure event and return array of special structures [{ buttonName: ..., buttonAction: ..., buttonClasses: ... }, {...}, ...].
   *
   * @property customButtonsClosureEvent
   * @type Function
   * @default undefined
   */
  customButtonsClosureEvent: undefined,

  /**
   * Array of custom buttons.
   *
   * @property customButtonsArray
   * @type Array
   * @default undefined
   */
  customButtonsArray: undefined,

  colsSettingsItems: [],

  init: function() {
    this._super(...arguments);

    var componentName = this.get('componentName');
    if (this.get('deleteButton') === true && !componentName) {
      throw new Error('Name of flexberry-objectlictview component was not defined.');
    }

    this.get('objectlistviewEventsService').on('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').on('olvRowsDeleted', this, this._rowsDeleted);

    let customButton = this.get('customButtonsClosureEvent');
    if (customButton && typeof (customButton) === 'function') {
      let customButtonsResult = customButton();
      this.set('customButtonsArray', customButtonsResult);
    }

    let listUserSettings = this.modelController.model.listUserSettings;
    if ('DEFAULT' in listUserSettings) {
      delete listUserSettings.DEFAULT;
    }

    let listNamedSettings = [];
    for (let nameSetting in listUserSettings) {
      listNamedSettings[listNamedSettings.length] = nameSetting;
    }

    this.colsSettingsItems = [{
      icon: 'dropdown icon',
      iconAlignment: 'right',
      title: '',
      items: [{
        title: 'Создать настройку для отображения столбцов'
      }]
    }];
    if (listNamedSettings.length > 0) {
      let menus = [{ name: 'use', title: 'Применить' }, { name: 'edit', title: 'Редактировать' }, { name: 'remove', title: 'Удалить' }];
      let items = this.colsSettingsItems[0].items;
      for (let menu in menus) {
        let submenu = { icon: 'angle right icon', iconAlignment: 'right', title: menus[menu].title, items: [] };
        for (let i = 0; i < listNamedSettings.length; i++) {
          let subSubmenu = { title: listNamedSettings[i] };
          submenu.items[submenu.items.length] = subSubmenu;
        }

        items[items.length] = submenu;
      }
    }

  },

  /**
   * Implementation of component's teardown.
   *
   * @method willDestroy
   */
  willDestroy() {
    this.get('objectlistviewEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this._super(...arguments);
  },

  actions: {
    refresh: function() {
      this.get('modelController').send('refreshList');
    },
    createNew: function() {
      let editFormRoute = this.get('editFormRoute');
      let modelController = this.get('modelController');
      modelController.transitionToRoute(editFormRoute + '.new');
    },

    /**
     * Delete selected rows.
     *
     * @method delete
     */
    delete: function() {
      var componentName = this.get('componentName');
      this.get('objectlistviewEventsService').deleteRowsTrigger(componentName, true);
    },

    /**
     * Filters the content by "Filter by any match" field value.
     *
     * @method filterByAnyMatch
     */
    filterByAnyMatch: function() {
      var componentName = this.get('componentName');
      this.get('objectlistviewEventsService').filterByAnyMatchTrigger(componentName, this.get('filterByAnyMatchText'));
    },

    /**
     * Remove filter from url.
     *
     * @method removeFilter
     * @public
     */
    removeFilter: function() {
      this.set('filterText', null);
    },

    customButtonAction: function(actionName) {
      this.sendAction('customButtonAction', actionName);
    },

    showConfigDialog: function() {
      this.get('modelController').send('showConfigDialog');
    },

    onMenuItemClick: function (e) {
    }

  },

  /**
   * Flag shows enable-state of delete button.
   * If there are selected rows button is enabled. Otherwise - not.
   *
   * @property isDeleteButtonEnabled
   * @type Boolean
   * @default false
   */
  isDeleteButtonEnabled: false,

  /**
   * Stores the text from "Filter by any match" input field.
   *
   * @property filterByAnyMatchText
   * @type String
   * @default null
   */
  filterByAnyMatchText: Ember.computed.oneWay('filterText'),

  /**
   * Event handler for "row has been selected" event in objectlistview.
   *
   * @method _rowSelected
   * @private
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Model} record The model corresponding to selected row in objectlistview.
   * @param {Integer} count Count of selected rows in objectlistview.
   */
  _rowSelected: function(componentName, record, count) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', count > 0 && this.get('enableDeleteButton'));
    }
  }
});
