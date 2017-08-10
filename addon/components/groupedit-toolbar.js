/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import serializeSortingParam from '../utils/serialize-sorting-param';
const { getOwner } = Ember;

/**
  Toolbar component for {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.

  @class GroupEditToolbarComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Controller for model.

    @property modelController
    @type Object
  */
  modelController: null,

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
    Used to link to objectListView with same componentName.

    @property componentName
    @type String
    @default ''
  */
  componentName: '',

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

  /**
    @property listNamedUserSettings
  */
  listNamedUserSettings: undefined,

  _listNamedUserSettings: Ember.observer('listNamedUserSettings', function() {
    let listNamedUserSettings = this.get('listNamedUserSettings');
    for (let namedSetting in listNamedUserSettings) {
      this._addNamedSetting(namedSetting);
    }
  }),

  /**
    Flag to use colsConfigButton button at toolbar.

    @property colsConfigButton
    @type Boolean
    @default true
    @readOnly
  */
  colsConfigButton: true,

  /**
    @property colsConfigMenu
    @type Service
  */
  colsConfigMenu: Ember.inject.service(),

  menus: [
    { name: 'use', icon: 'checkmark box' },
    { name: 'edit', icon: 'setting' },
    { name: 'remove', icon: 'remove' }
  ],

  /**
    @property colsSettingsItems
    @readOnly
  */
  colsSettingsItems:  Ember.computed(function() {
      let i18n = this.get('i18n');
      let menus = [
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.groupedit-toolbar.use-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.groupedit-toolbar.edit-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.groupedit-toolbar.remove-setting-title',
          items: []
        }
      ];
      let rootItem = {
        icon: 'dropdown icon',
        iconAlignment: 'right',
        title: '',
        items: [],
        localeKey: ''
      };
      let createSettitingItem = {
        icon: 'table icon',
        iconAlignment: 'left',
        title: i18n.t('components.groupedit-toolbar.create-setting-title'),
        localeKey: 'components.groupedit-toolbar.create-setting-title'
      };
      rootItem.items[rootItem.items.length] = createSettitingItem;
      rootItem.items.push(...menus);

      let setDefaultItem = {
        icon: 'remove circle icon',
        iconAlignment: 'left',
        title: i18n.t('components.groupedit-toolbar.set-default-setting-title'),
        localeKey: 'components.groupedit-toolbar.set-default-setting-title'
      };
      rootItem.items[rootItem.items.length] = setDefaultItem;
      if (this.get('colsConfigMenu').environment && this.get('colsConfigMenu').environment === 'development') {
        let showDefaultItem = {
          icon: 'unhide icon',
          iconAlignment: 'left',
          title: i18n.t('components.groupedit-toolbar.show-default-setting-title'),
          localeKey: 'components.groupedit-toolbar.show-default-setting-title'
        };
        rootItem.items[rootItem.items.length] = showDefaultItem;
      }

      this.colsSettingsItems = [rootItem];

      return this.get('userSettingsService').isUserSettingsServiceEnabled ? [rootItem] : [];
    }
  ),

  /**
   Shows info modal dialog.

   @method showInfoModalDialog
   @param {String} infoCaption Info caption (window header caption).
   @param {String} infoContent Info content (window body content).
   @returns {String} Info content.
   */
  showInfoModalDialog(infoCaption, infoContent) {
    let infoModalDialog = this.get('_infoModalDialog');
    if (infoModalDialog && infoModalDialog.modal) {
      this.set('_infoModalDialogCaption', infoCaption);
      this.set('_infoModalDialogContent', infoContent);
      infoModalDialog.modal('show');
    }

    let groupeditToolbarInfoCopyButton = Ember.$('#groupeditToolbarInfoCopyButton');
    groupeditToolbarInfoCopyButton.get(0).innerHTML = this.get('i18n').t('components.groupedit-toolbar.copy');
    groupeditToolbarInfoCopyButton.removeClass('disabled');
    return infoContent;
  },

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
    },

    /**
      Remove filter from url.

      @method actions.removeFilter
      @public
    */
    removeFilter() {
      let _this = this;
      if (_this.get('filterText')) {
        _this.get('currentController').set('state', 'loading');
      }

      Ember.run.later((function() {
        _this.set('filterText', null);
        _this.set('filterByAnyMatchText', null);
      }), 50);
    },

    /**
      Action to show confis dialog.

      @method actions.showConfigDialog
      @public
    */
    showConfigDialog(settingName) {
      Ember.assert('showConfigDialog:: componentName is not defined in flexberry-groupedit component', this.componentName);
      this.get('modelController').send('showConfigDialog', this.componentName, settingName, this.get('modelProjection'));
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
      let componentName  =  this.componentName;
      let userSettingsService = this.get('userSettingsService');

      switch (className) {
        case 'table icon':
          this.send('showConfigDialog');
          break;
        case 'checkmark box icon':

          //TODO move this code and  _getSavePromise@addon/components/colsconfig-dialog-content.js to addon/components/colsconfig-dialog-content.js
          let colsConfig = this.listNamedUserSettings[namedSetting];
          userSettingsService.saveUserSetting(componentName, undefined, colsConfig)
          .then(record => {
            let sort = serializeSortingParam(colsConfig.sorting);
            this.get('_groupEditEventsService').geSortApplyTrigger(componentName, sort);
            this.get('_groupEditEventsService').geColumnWidth(componentName);
          });
          break;
        case 'setting icon':
          this.send('showConfigDialog', namedSetting);
          break;
        case 'remove icon':
          userSettingsService.deleteUserSetting(componentName, namedSetting)
          .then(result => {
            this.get('colsConfigMenu').deleteNamedSettingTrigger(namedSetting);
            alert('Настройка ' + namedSetting + ' удалена');
          });
          break;
        case 'remove circle icon':
          if (!userSettingsService.haveDefaultUserSetting(componentName)) {
            alert('No default usersettings');
            break;
          }

          let defaultDeveloperUserSetting = userSettingsService.getDefaultDeveloperUserSetting(componentName);
          userSettingsService.saveUserSetting(componentName, undefined, defaultDeveloperUserSetting)
          .then(record => {
            let sort = serializeSortingParam(defaultDeveloperUserSetting.sorting);
            this.get('_groupEditEventsService').geSortApplyTrigger(componentName, sort);
            this.get('_groupEditEventsService').geColumnWidth(componentName);
          });
          break;
        case 'unhide icon':
          let currentUserSetting = userSettingsService.getListCurrentUserSetting(this.componentName);
          let caption = this.get('i18n').t('components.groupedit-toolbar.show-setting-caption') + this._router.currentPath + '.js';
          this.showInfoModalDialog(caption, JSON.stringify(currentUserSetting, undefined, '  '));
          break;
      }
    },

    copyJSONContent(event) {
      Ember.$('#groupeditToolbarInfoContent').select();
      let copied = document.execCommand('copy');
      let groupeditToolbarInfoCopyButton = Ember.$('#groupeditToolbarInfoCopyButton');
      groupeditToolbarInfoCopyButton.get(0).innerHTML = this.get('i18n').t(copied ? 'components.groupedit-toolbar.copied' : 'components.olv-toolbar.ctrlc');
      groupeditToolbarInfoCopyButton.addClass('disabled');
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

    this.get('colsConfigMenu').on('updateNamedSetting', this, this._updateListNamedUserSettings);
    this.get('colsConfigMenu').on('addNamedSetting', this, this._addNamedSetting);
    this.get('colsConfigMenu').on('deleteNamedSetting', this, this._deleteNamedSetting);
  },

  didInsertElement() {
    this._super(...arguments);

    // Initialize SemanticUI modal dialog, and remember it in a component property,
    // because after call to infoModalDialog.modal its html will disappear from DOM.
    let infoModalDialog = this.$('.groupedit-toolbar-info-modal-dialog');
    infoModalDialog.modal('setting', 'closable', true);
    this.set('_infoModalDialog', infoModalDialog);
    let modelController = this.get('modelController');
    if (Ember.isNone(modelController)) {
      this.set('modelController', this.get('currentController'));
    }

    this._updateListNamedUserSettings();
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
    this.get('colsConfigMenu').off('updateNamedSetting', this, this._updateListNamedUserSettings);
    this.get('colsConfigMenu').off('addNamedSetting', this, this._addNamedSetting);
    this.get('colsConfigMenu').off('deleteNamedSetting', this, this._deleteNamedSetting);
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
  },

  _updateListNamedUserSettings() {
    this._resetNamedUserSettings();
    Ember.set(this, 'listNamedUserSettings', this.get('userSettingsService').getListCurrentNamedUserSetting(this.componentName));
  },

  _resetNamedUserSettings() {
    let menus = this.get('menus');
    for (let i = 0; i < menus.length; i++) {
      Ember.set(this.get('colsSettingsItems')[0].items[i + 1], 'items', []);
    }
  },

  _addNamedSetting(namedSetting) {
    let menus = this.get('menus');
    for (let i = 0; i < menus.length; i++) {
      let icon = menus[i].icon + ' icon';
      let subItems = this.get('colsSettingsItems')[0].items[i + 1].items;
      let newSubItems = [];
      let exist = false;
      for (let j = 0; j < subItems.length; j++) {
        newSubItems[j] = subItems[j];
        if (subItems[j].title === namedSetting) {
          exist = true;
        }
      }

      if (!exist) {
        newSubItems[subItems.length] = { title: namedSetting, icon: icon, iconAlignment: 'left' };
      }

      Ember.set(this.get('colsSettingsItems')[0].items[i + 1], 'items', newSubItems);
    }
  },

  _deleteNamedSetting(namedSetting) {
    this._updateListNamedUserSettings();
  },
});
