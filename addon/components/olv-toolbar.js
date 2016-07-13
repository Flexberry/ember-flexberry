/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';
const { getOwner } = Ember;

/**
  @class OlvToolbar
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Flag to show colsConfigButton button at toolbar or not.
  */
  _colsConfigButton: Ember.computed('colsConfigButton', function() {
    return this.get('userSettingsService').isUserSettingsServiceEnabled;
  }),

  modelController: null,

  /**
    Route for edit form by click row.

    @property editFormRoute
    @type String
  */
  editFormRoute: undefined,

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type Service
  */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
    Flag to use creation button at toolbar.

    @property createNewButton
    @type Boolean
    @default false
  */
  createNewButton: false,

  /**
    Flag to specify whether the create button is enabled.

    @property enableCreateNewButton
    @type Boolean
    @default true
  */
  enableCreateNewButton: true,

  /**
    Flag to use refresh button at toolbar.

    @property refreshButton
    @type Boolean
    @default false
  */
  refreshButton: false,

  /**
    Flag to use delete button at toolbar.

    @property deleteButton
    @type Boolean
    @default false
  */
  deleteButton: false,

  /**
    Flag to use colsConfigButton button at toolbar.

    @property colsConfigButton
    @type Boolean
    @default true
    @readOnly
  */
  colsConfigButton: true,

  /**
    Flag to use filter button at toolbar.

    @property filterButton
    @type Boolean
    @default false
  */
  filterButton: false,

  /**
    Used to specify default 'filter by any match' field text.

    @property filterText
    @type String
    @default null
  */
  filterText: null,
  /**
    Used to link to objectListView with same componentName.

    @property componentName
    @type String
    @default ''
  */
  componentName: '',

  /**
    The flag to specify whether the delete button is enabled.

    @property enableDeleteButton
    @type Boolean
    @default true
  */
  enableDeleteButton: true,

  /**
    Name of action to send out, action triggered by click on user button.

    @property customButtonAction
    @type String
    @default 'customButtonAction'
  */
  customButtonAction: 'customButtonAction',

  /**
    Array of custom buttons of special structures [{ buttonName: ..., buttonAction: ..., buttonClasses: ... }, {...}, ...].

    @example
      ```
      {
        buttonName: '...', // Button displayed name.
        buttonAction: '...', // Action that is called from controller on this button click (it has to be registered at component).
        buttonClasses: '...' // Css classes for button.
      }
      ```

    @property customButtonsArray
    @type Array
  */
  customButtons: undefined,

  /**
    @property listUserSettings
  */
  listUserSettings: undefined,

  /**
    @property createSettitingTitle
    @type String
    @default t('components.olv-toolbar.create-setting-title')
  */
  createSettitingTitle: t('components.olv-toolbar.create-setting-title'),

  /**
    @property useSettitingTitle
    @type String
    @default t('components.olv-toolbar.use-setting-title')
  */
  useSettitingTitle: t('components.olv-toolbar.use-setting-title'),

  /**
    @property editSettitingTitle
    @type String
    @default t('components.olv-toolbar.edit-setting-title')
  */
  editSettitingTitle: t('components.olv-toolbar.edit-setting-title'),

  /**
    @property removeSettitingTitle
    @type String
    @default t('components.olv-toolbar.remove-setting-title')
  */
  removeSettitingTitle: t('components.olv-toolbar.remove-setting-title'),

  /**
    @property setDefaultSettitingTitle
    @type String
    @default t('components.olv-toolbar.set-default-setting-title')
  */
  setDefaultSettitingTitle: t('components.olv-toolbar.set-default-setting-title'),

  /**
    @property colsConfigMenu
    @type Service
  */
  colsConfigMenu: Ember.inject.service(),

  /**
    @property listUserSettings
  */
  listNamedSettings: null,

  /**
    @property colsSettingsItems
    @readOnly
  */
  colsSettingsItems:  Ember.computed(
    'createSettitingTitle',
    'setDefaultSettitingTitle',
    'useSettitingTitle',
    'editSettitingTitle',
    'removeSettitingTitle',
    'listNamedSettings',
    function() {
      let params = {
        createSettitingTitle: this.get('createSettitingTitle'),
        setDefaultSettitingTitle: this.get('setDefaultSettitingTitle'),
        useSettitingTitle: this.get('useSettitingTitle'),
        editSettitingTitle: this.get('editSettitingTitle'),
        removeSettitingTitle: this.get('removeSettitingTitle'),
        listNamedSettings: this.get('listNamedSettings'),
      };

      return this.get('userSettingsService').isUserSettingsServiceEnabled ?
        this.get('colsConfigMenu').resetMenu(params) :
        [];
    }
  ),

  /**
    Flag shows enable-state of delete button.
    If there are selected rows button is enabled. Otherwise - not.

    @property isDeleteButtonEnabled
    @type Boolean
    @default false
  */
  isDeleteButtonEnabled: false,

  /**
    Stores the text from "Filter by any match" input field.

    @property filterByAnyMatchText
    @type String
  */
  filterByAnyMatchText: Ember.computed.oneWay('filterText'),

  actions: {
    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.refresh
      @public
    */
    refresh() {
      this.get('objectlistviewEventsService').refreshListTrigger(this.get('componentName'));
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.createNew
      @public
    */
    createNew() {
      let editFormRoute = this.get('editFormRoute');
      let modelController = this.get('modelController');
      modelController.transitionToRoute(editFormRoute + '.new');
    },

    /**
      Delete selected rows.

      @method actions.delete
      @public
    */
    delete() {
      let confirmDeleteRows = this.get('confirmDeleteRows');
      if (confirmDeleteRows) {
        Ember.assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRows === 'function');
        if (!confirmDeleteRows()) {
          return;
        }
      }

      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').deleteRowsTrigger(componentName, true);
    },

    /**
      Filters the content by "Filter by any match" field value.

      @method actions.filterByAnyMatch
      @public
    */
    filterByAnyMatch() {
      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').filterByAnyMatchTrigger(componentName, this.get('filterByAnyMatchText'));
    },

    /**
      Remove filter from url.

      @method actions.removeFilter
      @public
    */
    removeFilter() {
      this.set('filterText', null);
    },

    /**
      Action for custom button.

      @method actions.customButtonAction
      @public
      @param {String} actionName The name of action
    */
    customButtonAction(actionName) {
      this.sendAction('customButtonAction', actionName);
    },

    /**
      Action to show confis dialog.

      @method actions.showConfigDialog
      @public
    */
    showConfigDialog(settingName) {
      this.get('modelController').send('showConfigDialog', this.componentName, settingName);
    },

    /**
      Handler click on flexberry-menu.

      @method actions.onMenuItemClick
      @public
      @param {jQuery.Event} e jQuery.Event by click on menu item
    */
    onMenuItemClick(e) {
      let iTags = Ember.$(e.currentTarget).find('i');
      let namedSettingSpans = Ember.$(e.currentTarget).find('span');
      if (iTags.length <= 0 || namedSettingSpans.length <= 0) {
        return;
      }

      this._router = getOwner(this).lookup('router:main');
      let className = iTags.get(0).className;
      let namedSetting = namedSettingSpans.get(0).innerText;
      let moduleName  =   this._router.currentRouteName;
      let userSettingsService = this.get('userSettingsService');

      switch (className) {
        case 'table icon':
          this.send('showConfigDialog');
          break;
        case 'checkmark box icon':

          //TODO move this code and  _getSavePromise@addon/components/colsconfig-dialog-content.js to addon/components/colsconfig-dialog-content.js
          let colsConfig = this.listUserSettings[namedSetting];
          userSettingsService.saveUserSetting(this.componentName, undefined, colsConfig).
            then(record => {
              if (this._router.location.location.href.indexOf('sort=') >= 0) { // sort parameter exist in URL (ugly - TODO find sort in query parameters)
                this._router.router.transitionTo(this._router.currentRouteName, { queryParams: { sort: null } }); // Show page without sort parameters
              } else {
                this._router.router.refresh();  //Reload current page and records (model) list
              }
            });
          break;
        case 'setting icon':
          this.send('showConfigDialog', namedSetting);
          break;
        case 'remove icon':
          userSettingsService.deleteUserSetting({
            moduleName: moduleName,
            settingName: namedSetting
          }).then(result => {
            this.get('colsConfigMenu').deleteNamedSettingTrigger(namedSetting);
            alert('Настройка ' + namedSetting + ' удалена');
          });
          break;
        case 'remove circle icon':
          userSettingsService.deleteUserSetting({
            moduleName: moduleName,
            settingName: 'DEFAULT'
          }).then(record => {
            if (this._router.location.location.href.indexOf('sort=') >= 0) { // sort parameter exist in URL (ugly - TODO find sort in query parameters)
              this._router.router.transitionTo(this._router.currentRouteName, { queryParams: { sort: null } }); // Show page without sort parameters
            } else {
              this._router.router.refresh();  //Reload current page and records (model) list
            }
          });
          break;
      }
    }
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {
    this._super(...arguments);

    let componentName = this.get('componentName');
    if (this.get('deleteButton') === true && !componentName) {
      throw new Error('Name of flexberry-objectlictview component was not defined.');
    }

    this.get('objectlistviewEventsService').on('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').on('olvRowsDeleted', this, this._rowsDeleted);

    this.get('colsConfigMenu').on('addNamedSetting', this, this._addNamedSetting);
    this.get('colsConfigMenu').on('deleteNamedSetting', this, this._deleteNamedSetting);
  },

  didReceiveAttrs() {
    this._super(...arguments);
//     let listUserSettings = this.modelController.model.listUserSettings;
    let listUserSettings = this.get('userSettingsService').getListCurrentUserSetting(this.componentName);
    if (listUserSettings && 'DEFAULT' in listUserSettings) {
      delete listUserSettings.DEFAULT;
    }

    this.listUserSettings = listUserSettings;
    Ember.set(this, 'listNamedSettings', {});
    if (listUserSettings) {
      for (let nameSetting in listUserSettings) {
        Ember.set(this.listNamedSettings, nameSetting, true);
      }
    }
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](http://emberjs.com/api/classes/Ember.Component.html#method_willDestroy) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroy() {
    this.get('objectlistviewEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this.get('colsConfigMenu').off('addNamedSetting', this, this._addNamedSetting);
    this.get('colsConfigMenu').off('deleteNamedSetting', this, this._deleteNamedSetting);
    this._super(...arguments);
  },

  /**
    Event handler for "row has been selected" event in objectlistview.

    @method _rowSelected
    @private

    @param {String} componentName The name of objectlistview component
    @param {DS.Model} record The model corresponding to selected row in objectlistview
    @param {Number} count Count of selected rows in objectlistview
  */
  _rowSelected(componentName, record, count) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', count > 0 && this.get('enableDeleteButton'));
    }
  },

  _addNamedSetting(namedSetting) {
    let listNamedSettings = JSON.parse(JSON.stringify(this.listNamedSettings));
    listNamedSettings[namedSetting] = true;
    Ember.set(this, 'listNamedSettings', listNamedSettings);
  },

  _deleteNamedSetting(namedSetting) {
    let listNamedSettings = JSON.parse(JSON.stringify(this.listNamedSettings));
    delete listNamedSettings[namedSetting];
    Ember.set(this, 'listNamedSettings', listNamedSettings);
  },
});
