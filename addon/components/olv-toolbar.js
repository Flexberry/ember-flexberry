/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import serializeSortingParam from '../utils/serialize-sorting-param';
const { getOwner } = Ember;

/**
  @class OlvToolbar
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
    Service for managing advLimits for lists.

    @property advLimit
    @type AdvLimitService
  */
  advLimit: Ember.inject.service(),

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
    Flag to use advLimitButton button at toolbar.

    @property advLimitButton
    @type Boolean
    @default true
    @readOnly
  */
  advLimitButton: false,

  /**
    Flag indicates whether to show exportExcelButton button at toolbar.

    @property exportExcelButton
    @type Boolean
    @default false
  */
  exportExcelButton: false,

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
  The flag to specify whether the select all button is on.

    @property selectAll
    @type Boolean
    @default true
  */
  allSelect: false,

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
        buttonClasses: '...', // Css classes for button.
        buttonTitle: '...' // Button title.
      }
      ```

    @property customButtonsArray
    @type Array
  */
  customButtons: undefined,

  /**
    @property listNamedUserSettings
  */
  listNamedUserSettings: undefined,

  /**
    Current store. Used for loading data for autocomplete and for dropdown.

    @property store
    @type Projection.OnlineStore
    @readOnly
  */
  store: Ember.inject.service('store'),

  _listNamedUserSettings: Ember.observer('listNamedUserSettings', function() {
    let listNamedUserSettings = this.get('listNamedUserSettings');
    for (let namedSetting in listNamedUserSettings) {
      this._addNamedSetting(namedSetting, this.get('componentName'));
    }

    this._sortNamedSetting();
  }),

  /**
    @property listNamedExportSettings
  */
  listNamedExportSettings: undefined,

  _listNamedExportSettings: Ember.observer('listNamedExportSettings', function() {
    let listNamedExportSettings = this.get('listNamedExportSettings');
    for (let namedSetting in listNamedExportSettings) {
      let settName = namedSetting.split('/');
      settName.shift();
      settName = settName.join('/');
      this._addNamedSetting(settName, this.get('componentName'), true);
    }

    this._sortNamedSetting(true);
  }),

  /**
    Current adv limits.

    @property namedAdvLimits
    @type Object
  */
  namedAdvLimits: undefined,

  /**
    @property colsConfigMenu
    @type Service
  */
  colsConfigMenu: Ember.inject.service(),

  /**
    @property menus
    @readOnly
  */
  menus: Ember.computed(() => Ember.A([
    { name: 'use', icon: 'checkmark box' },
    { name: 'edit', icon: 'setting' },
    { name: 'remove', icon: 'remove' }
  ])).readOnly(),

  /**
    @property colsSettingsItems
    @readOnly
  */
  colsSettingsItems: Ember.computed('i18n.locale', 'userSettingsService.isUserSettingsServiceEnabled', function() {
      let i18n = this.get('i18n');
      let menus = [
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.use-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.edit-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.remove-setting-title',
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
        title: i18n.t('components.olv-toolbar.create-setting-title'),
        localeKey: 'components.olv-toolbar.create-setting-title'
      };
      rootItem.items[rootItem.items.length] = createSettitingItem;
      rootItem.items.push(...menus);

      let setDefaultItem = {
        icon: 'remove circle icon',
        iconAlignment: 'left',
        title: i18n.t('components.olv-toolbar.set-default-setting-title'),
        localeKey: 'components.olv-toolbar.set-default-setting-title'
      };
      rootItem.items[rootItem.items.length] = setDefaultItem;
      if (this.get('colsConfigMenu').environment && this.get('colsConfigMenu').environment === 'development') {
        let showDefaultItem = {
          icon: 'unhide icon',
          iconAlignment: 'left',
          title: i18n.t('components.olv-toolbar.show-default-setting-title'),
          localeKey: 'components.olv-toolbar.show-default-setting-title'
        };
        rootItem.items[rootItem.items.length] = showDefaultItem;
      }

      return this.get('userSettingsService').isUserSettingsServiceEnabled ? [rootItem] : [];
    }
  ),

  /**
    @property advLimitItems
    @readOnly
  */
  advLimitItems: Ember.computed('i18n.locale', 'advLimit.isAdvLimitServiceEnabled', 'namedAdvLimits', function() {
    const i18n = this.get('i18n');
    const rootItem = {
      icon: 'dropdown icon',
      iconAlignment: 'right',
      title: '',
      items: Ember.A(),
      localeKey: ''
    };
    const createLimitItem = {
      icon: 'flask icon',
      iconAlignment: 'left',
      title: i18n.t('components.olv-toolbar.create-limit-title'),
      localeKey: 'components.olv-toolbar.create-limit-title'
    };
    rootItem.items.addObject(createLimitItem);

    const limitItems = this.get('namedAdvLimits');
    const menus = this.get('menus');
    const editMenus = Ember.A();
    menus.forEach(menu => {
      const menuSubitem = this._createMenuSubitems(limitItems, menu.icon + ' icon');
      if (menuSubitem.length > 0) {
        editMenus.addObject({
          icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: `components.olv-toolbar.${menu.name}-limit-title`,
          items: menuSubitem
        });
      }
    }, this);

    if (editMenus.length > 0) {
      rootItem.items.addObjects(editMenus);
    }

    const setDefaultItem = {
      icon: 'remove circle icon',
      iconAlignment: 'left',
      title: i18n.t('components.olv-toolbar.set-default-limit-title'),
      localeKey: 'components.olv-toolbar.set-default-limit-title'
    };
    rootItem.items.addObject(setDefaultItem);

    return this.get('advLimit.isAdvLimitServiceEnabled') ? Ember.A([rootItem]) : Ember.A();
  }),

  _colsSettingsItems: Ember.observer('colsSettingsItems', function() {
    this._updateListNamedUserSettings(this.get('componentName'));
  }),

  /**
    @property exportExcelItems
    @readOnly
  */
  exportExcelItems:  Ember.computed(function() {
      let i18n = this.get('i18n');
      let menus = [
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.export-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.edit-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.remove-setting-title',
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
        icon: 'file excel outline icon',
        iconAlignment: 'left',
        title: i18n.t('components.olv-toolbar.create-setting-title'),
        localeKey: 'components.olv-toolbar.create-setting-title'
      };
      rootItem.items[rootItem.items.length] = createSettitingItem;
      rootItem.items.push(...menus);

      return [rootItem];
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
    Flag used to display filters in modal.

    @property showFiltersInModal
    @type Boolean
    @default false
    @private
  */
  showFiltersInModal: false,

  /**
    Stores the text from "Filter by any match" input field.

    @property filterByAnyMatchText
    @type String
  */
  filterByAnyMatchText: Ember.computed.oneWay('filterText'),

  /**
    Caption to be displayed in info modal dialog.
    It will be displayed only if some info occurs.

    @property _infoModalDialogCaption
    @type String
    @default ''
    @private
  */
  _infoModalDialogCaption: '',

  /**
    Content to be displayed in info modal dialog.
    It will be displayed only if some info occurs.

    @property _infoModalDialogContent
    @type String
    @default ''
    @private
  */
  _infoModalDialogContent: '',

  /**
    Selected jQuery object, containing HTML of error modal dialog.

    @property _errorModalDialog
    @type <a href="http://api.jquery.com/Types/#jQuery">JQueryObject</a>
    @default null
    @private
  */
  _infoModalDialog: null,

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

    let oLVToolbarInfoCopyButton = infoModalDialog.find('.olv-toolbar-info-modal-dialog-copy-button');
    oLVToolbarInfoCopyButton.get(0).innerHTML = this.get('i18n').t('components.olv-toolbar.copy');
    oLVToolbarInfoCopyButton.removeClass('disabled');
    return infoContent;
  },

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
      Ember.assert('Property editFormRoute is not defined in controller', editFormRoute);
      let modelController = this.get('modelController');
      this.get('objectlistviewEventsService').setLoadingState('loading');
      let appController = getOwner(this).lookup('controller:application');
      let thisRouteName = appController.get('currentRouteName');
      let thisRecordId = modelController.get('model.id');
      let transitionOptions = {
        queryParams: {
          parentParameters: {
            parentRoute: thisRouteName,
            parentRouteRecordId: thisRecordId
          }
        }
      };

      Ember.run.later((function() {
        modelController.transitionToRoute(editFormRoute + '.new', transitionOptions);
      }), 50);
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

      if (!this.get('allSelect'))
      {
        this.get('objectlistviewEventsService').deleteRowsTrigger(componentName, true);
      } else {
        let modelName = this.get('modelController.modelProjection.modelName');

        let filterQuery = {
          predicate: this.get('currentController.filtersPredicate'),
          modelName: modelName
        };

        this.get('objectlistviewEventsService').deleteAllRowsTrigger(componentName, filterQuery);
      }
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
      Checks if "Enter" button was pressed.
      If "Enter" button was pressed then filters the content by "Filter by any match" field value.

      @method actions.keyDownFilterAction
      @public
    */
    keyDownFilterAction(currentValue, e) {
      if (e.keyCode === 13) {
        this.send('filterByAnyMatch');
        e.preventDefault();
        return false;
      }
    },

    /**
      Remove filter from url.

      @method actions.removeFilter
      @public
    */
    removeFilter() {
      let _this = this;

      Ember.run.later((function() {
        _this.set('filterByAnyMatchText', null);
        let componentName = _this.get('componentName');
        _this.get('objectlistviewEventsService').filterByAnyMatchTrigger(componentName, null);
      }), 50);
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
      Action to show confis dialog.

      @method actions.showConfigDialog
      @public
    */
    showConfigDialog(settingName) {
      Ember.assert('showConfigDialog:: componentName is not defined in flexberry-objectlistview component', this.componentName);
      this.get('modelController').send('showConfigDialog', this.componentName, settingName);
    },

    /**
      Action to show confis dialog.

      @method actions.showConfigDialog
      @public
    */
    showAdvLimitDialog(settingName) {
      Ember.assert('showAdvLimitDialog:: componentName is not defined in flexberry-objectlistview component', this.componentName);
      this.get('modelController').send('showAdvLimitDialog', this.componentName, settingName);
    },

    /**
      Action to show filters tool.

      @method actions.showFiltersTool
      @public
    */
    showFiltersTool() {
      const showFiltersInModal = this.get('showFiltersInModal');

      if (showFiltersInModal) {
        const componentName = this.get('componentName');
        const columns = this.get('objectlistviewEventsService').getRelatedColums();

        // Disable key-down action, which was set in object-list-view.
        columns.forEach((column) => {
          if (!Ember.isNone(column.filter.component.properties.keyDown)) {
            column.filter.component.properties.keyDown = undefined;
          }
        });

        this.get('modelController').send('showFiltersDialog', componentName, columns);
      } else {
        this.sendAction('toggleStateFilters');
      }
    },

    /**
      Action to show export dialog.

      @method actions.showExportDialog
      @public
    */
    showExportDialog(settingName, immediateExport) {
      let settName = settingName ? 'ExportExcel/' + settingName : settingName;
      Ember.assert('showExportDialog:: componentName is not defined in flexberry-objectlistview component', this.componentName);
      this.get('modelController').send('showConfigDialog', this.componentName, settName, true, immediateExport);
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

      let router = getOwner(this).lookup('router:main');
      let className = iTags.get(0).className;
      let namedSetting = namedSettingSpans.get(0).innerText;
      let componentName = this.get('componentName');
      let userSettingsService = this.get('userSettingsService');

      switch (className) {
        case 'table icon':
          this.send('showConfigDialog');
          break;
        case 'checkmark box icon':

          //TODO move this code and  _getSavePromise@addon/components/colsconfig-dialog-content.js to addon/components/colsconfig-dialog-content.js
          let colsConfig = this.listNamedUserSettings[namedSetting];
          userSettingsService.saveUserSetting(componentName, undefined, colsConfig).
            then(record => {
              let currentController = this.get('currentController');
              let userSettingsApplyFunction = currentController.get('userSettingsApply');
              if (userSettingsApplyFunction instanceof Function) {
                userSettingsApplyFunction.apply(currentController, [componentName, colsConfig.sorting, colsConfig.perPage]);
              } else {
                let sort = serializeSortingParam(colsConfig.sorting);
                router.router.transitionTo(router.currentRouteName, { queryParams: { sort: sort, perPage: colsConfig.perPage || 5 } });
              }
            });
          break;
        case 'setting icon':
          this.send('showConfigDialog', namedSetting);
          break;
        case 'remove icon':
          userSettingsService.deleteUserSetting(componentName, namedSetting)
          .then(result => {
            this.get('colsConfigMenu').deleteNamedSettingTrigger(namedSetting, componentName);
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
            let currentController = this.get('currentController');
            let userSettingsApplyFunction = currentController.get('userSettingsApply');
            if (userSettingsApplyFunction instanceof Function) {
              userSettingsApplyFunction.apply(currentController, [componentName, defaultDeveloperUserSetting.sorting, defaultDeveloperUserSetting.perPage]);
            } else {
              let sort = serializeSortingParam(defaultDeveloperUserSetting.sorting);
              router.router.transitionTo(router.currentRouteName, { queryParams: { sort: sort, perPage: 5 } });
            }
          });
          break;
        case 'unhide icon':
          let currentUserSetting = userSettingsService.getListCurrentUserSetting(componentName);
          let caption = this.get('i18n').t('components.olv-toolbar.show-setting-caption') + router.currentPath + '.js';
          this.showInfoModalDialog(caption, JSON.stringify(currentUserSetting, undefined, '  '));
          break;
      }
    },

    /**
      Handler click on flexberry-menu of advLimits.

      @method actions.onLimitMenuItemClick
      @public
      @param {jQuery.Event} e jQuery.Event by click on menu item
    */
    onLimitMenuItemClick(e) {
      const iTags = Ember.$(e.currentTarget).find('i');
      const namedLimitSpans = Ember.$(e.currentTarget).find('span');
      if (iTags.length <= 0 || namedLimitSpans.length <= 0) {
        return;
      }

      const className = iTags.get(0).className;
      const advLimitName = namedLimitSpans.get(0).innerText;
      const componentName = this.get('componentName');
      const advLimitService = this.get('advLimit');

      switch (className) {
        case 'flask icon':
          this.send('showAdvLimitDialog');
          break;
        case 'checkmark box icon':
          const advLimit = this.get(`namedAdvLimits.${advLimitName}`);
          advLimitService.saveAdvLimit(advLimit, componentName).
            then(() => {
              this.send('refresh');
            });
          break;
        case 'setting icon':
          this.send('showAdvLimitDialog', advLimitName);
          break;
        case 'remove icon':
          advLimitService.deleteAdvLimit(componentName, advLimitName)
          .then(() => {
            this.get('colsConfigMenu').updateNamedAdvLimitTrigger(componentName);
            alert(
              this.get('i18n').t('components.advlimit-dialog-content.limit') +
              '"' + advLimitName + '"' +
              this.get('i18n').t('components.advlimit-dialog-content.is-deleted')
            );
          });
          break;
        case 'remove circle icon':
          advLimitService.saveAdvLimit('', componentName)
          .then(() => {
            this.send('refresh');
          });
          break;
      }
    },

    /**
      Handler click on flexberry-menu.

      @method actions.onExportMenuItemClick
      @public
      @param {jQuery.Event} e jQuery.Event by click on menu item
    */
    onExportMenuItemClick(e) {
      let iTags = Ember.$(e.currentTarget).find('i');
      let namedSettingSpans = Ember.$(e.currentTarget).find('span');
      if (iTags.length <= 0 || namedSettingSpans.length <= 0) {
        return;
      }

      let className = iTags.get(0).className;
      let namedSetting = namedSettingSpans.get(0).innerText;
      let componentName = this.get('componentName');
      let userSettingsService = this.get('userSettingsService');

      switch (className) {
        case 'file excel outline icon':
          this.send('showExportDialog');
          break;
        case 'checkmark box icon':
          this.send('showExportDialog', namedSetting, true);
          break;
        case 'setting icon':
          this.send('showExportDialog', namedSetting);
          break;
        case 'remove icon':
          userSettingsService.deleteUserSetting(componentName, namedSetting, true)
          .then(result => {
            this.get('colsConfigMenu').deleteNamedSettingTrigger(namedSetting, componentName);
            alert('Настройка ' + namedSetting + ' удалена');
          });
          break;
      }
    },

    copyJSONContent(event) {
      let infoModalDialog = this.get('_infoModalDialog');
      infoModalDialog.find('.olv-toolbar-info-modal-dialog-content textarea').select();
      let copied = document.execCommand('copy');
      let oLVToolbarInfoCopyButton = infoModalDialog.find('.olv-toolbar-info-modal-dialog-copy-button');
      oLVToolbarInfoCopyButton.get(0).innerHTML = this.get('i18n').t(copied ? 'components.olv-toolbar.copied' : 'components.olv-toolbar.ctrlc');
      oLVToolbarInfoCopyButton.addClass('disabled');
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
    this.get('objectlistviewEventsService').on('updateSelectAll', this, this._selectAll);

    this.get('colsConfigMenu').on('updateNamedSetting', this, this._updateListNamedUserSettings);
    this.get('colsConfigMenu').on('addNamedSetting', this, this._addNamedSetting);
    this.get('colsConfigMenu').on('deleteNamedSetting', this, this._deleteNamedSetting);
    this.get('colsConfigMenu').on('updateNamedAdvLimit', this, this._updateNamedAdvLimits);
  },

  didInsertElement() {
    this._super(...arguments);

    // Initialize SemanticUI modal dialog, and remember it in a component property,
    // because after call to infoModalDialog.modal its html will disappear from DOM.
    let infoModalDialog = this.$('.olv-toolbar-info-modal-dialog');
    infoModalDialog.modal('setting', 'closable', true);
    this.set('_infoModalDialog', infoModalDialog);
    let modelController = this.get('modelController');
    if (Ember.isNone(modelController)) {
      this.set('modelController', this.get('currentController'));
    }

    this._updateListNamedUserSettings(this.get('componentName'));
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](http://emberjs.com/api/classes/Ember.Component.html#method_willDestroy) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroy() {
    this.get('objectlistviewEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this.get('objectlistviewEventsService').off('updateSelectAll', this, this._selectAll);
    this.get('colsConfigMenu').off('updateNamedSetting', this, this._updateListNamedUserSettings);
    this.get('colsConfigMenu').off('addNamedSetting', this, this._addNamedSetting);
    this.get('colsConfigMenu').off('deleteNamedSetting', this, this._deleteNamedSetting);
    this.get('colsConfigMenu').off('updateNamedAdvLimit', this, this._updateNamedAdvLimits);
    this._super(...arguments);
  },

  /**
    Event handler for "row has been selected" event in objectlistview.

    @method _rowSelected
    @private

    @param {String} componentName The name of objectlistview component
    @param {DS.Model} record The model corresponding to selected row in objectlistview
    @param {Number} count Count of selected rows in objectlistview
    @param {Boolean} checked Current state of row in objectlistview (checked or not)
    @param {Object} recordWithKey The model wrapper with additional key corresponding to selected row
  */
  _rowSelected(componentName, record, count, checked, recordWithKey) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', count > 0 && this.get('enableDeleteButton'));
    }
  },

  /**
    Handler for "Olv rows deleted" event in objectlistview.

    @method _rowsDeleted

    @param {String} componentName The name of objectlistview component
    @param {Integer} count Number of deleted records
  */
  _rowsDeleted(componentName, count) {
    if (this.get('allSelect')) {
      this.get('objectlistviewEventsService').updateSelectAllTrigger(this.get('componentName'), false);
    }

    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', false);
    }
  },

  _updateListNamedUserSettings(componentName) {
    if (!(this.get('userSettingsService').isUserSettingsServiceEnabled && componentName === this.get('componentName'))) {
      return;
    }

    this._resetNamedUserSettings();
    Ember.set(this, 'listNamedUserSettings', this.get('userSettingsService').getListCurrentNamedUserSetting(this.componentName));
    Ember.set(this, 'listNamedExportSettings', this.get('userSettingsService').getListCurrentNamedUserSetting(this.componentName, true));
  },

  _resetNamedUserSettings() {
    let menus = this.get('menus');
    for (let i = 0; i < menus.length; i++) {
      Ember.set(this.get('colsSettingsItems')[0].items[i + 1], 'items', []);
      Ember.set(this.get('exportExcelItems')[0].items[i + 1], 'items', []);
    }
  },

  _addNamedSetting(namedSetting, componentName, isExportExcel) {
    if (componentName !== this.get('componentName')) {
      return;
    }

    let menus = this.get('menus');
    for (let i = 0; i < menus.length; i++) {
      let icon = menus[i].icon + ' icon';
      let subItems = isExportExcel ? this.get('exportExcelItems')[0].items[i + 1].items :
        this.get('colsSettingsItems')[0].items[i + 1].items;
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

      if (isExportExcel) {
        Ember.set(this.get('exportExcelItems')[0].items[i + 1], 'items', newSubItems);
      } else {
        Ember.set(this.get('colsSettingsItems')[0].items[i + 1], 'items', newSubItems);
      }
    }

    this._sortNamedSetting(isExportExcel);
  },

  _deleteNamedSetting(namedSetting, componentName) {
    if (componentName === this.get('componentName')) {
      this._updateListNamedUserSettings(componentName);
    }
  },

  _selectAll(componentName, selectAllParameter, skipConfugureRows) {
    if (componentName === this.get('componentName')) {
      this.set('allSelect', selectAllParameter);
      this.set('isDeleteButtonEnabled', selectAllParameter);
    }
  },

  _sortNamedSetting(isExportExcel) {
    for (let i = 0; i < this.menus.length; i++) {
      if (isExportExcel) {
        this.get('exportExcelItems')[0].items[i + 1].items.sort((a, b) => a.title > b.title);
      } else {
        this.get('colsSettingsItems')[0].items[i + 1].items.sort((a, b) => a.title > b.title);
      }
    }
  },

  /**
    Refresh current adv limits list.

    @method _updateNamedAdvLimits

    @param {String} componentName The name of objectlistview component
  */
  _updateNamedAdvLimits(componentName) {
    const advLimitService = this.get('advLimit');
    const thisComponentName = this.get('componentName');
    if (!(advLimitService.get('isAdvLimitServiceEnabled') && componentName === thisComponentName)) {
      return;
    }

    this.set('namedAdvLimits', advLimitService.getNamedAdvLimits(thisComponentName));
  },

  /**
    Creating menu subitems.

    @method _createMenuSubitems

    @param {Object} itemsNameList Object with items names as keys.
    @param {String} icon Icon class for menu items.
  */
  _createMenuSubitems(itemsNameList, icon) {
    if (Ember.isNone(itemsNameList)) {
      return Ember.A();
    }

    const itemsNames = Ember.A(Object.keys(itemsNameList)).sortBy('name');
    return itemsNames.map(name => { return { title: name, icon: icon, iconAlignment: 'left' }; });
  }
});
