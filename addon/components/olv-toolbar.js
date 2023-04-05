/**
  @module ember-flexberry
*/

import $ from 'jquery';
import { Promise } from 'rsvp';
import { assert } from '@ember/debug';
import { set, computed, observer } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';
import { later } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import FlexberryBaseComponent from './flexberry-base-component';
import serializeSortingParam from '../utils/serialize-sorting-param';
import EditInModalOpen from '../mixins/edit-in-modal-open';

/**
  @class OlvToolbar
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend(EditInModalOpen, {
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
  objectlistviewEventsService: service('objectlistview-events'),

  /**
    Service for managing advLimits for lists.

    @property advLimit
    @type AdvLimitService
  */
  advLimit: service(),

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
    Flag indicate when edit form of new record must be open in modal window.
    @property editInModal
    @type Boolean
    @default false
    @private
  */
  editInModal: false,

  /**
    Indicates that the `flexberry-objectlistview` component is used for the `flexberry-lookup` component.

    @property inLookup
    @type Boolean
    @default false
  */
  inLookup: false,

  /**
    Used to link to objectListView with same componentName.

    @property componentName
    @type String
    @default ''
  */
  componentName: '',

  /**
    The name of the `flexberry-lookup` component for which the `flexberry-objectlistview` component is used.

    @property lookupComponentName
    @type String
  */
  lookupComponentName: undefined,

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
    See {{#crossLink "FlexberryObjectlistviewComponent/customButtons:property"}}{{/crossLink}}.

    @property customButtons
    @type Array
  */
  customButtons: undefined,

  /**
    @property listNamedUserSettings
  */
  listNamedUserSettings: undefined,

  _listNamedUserSettings: observer('listNamedUserSettings', function() {
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

  _listNamedExportSettings: observer('listNamedExportSettings', function() {
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
  colsConfigMenu: service(),

  /**
    @property menus
    @readOnly
  */
  menus: computed(() => A([
    { name: 'use', icon: 'checkmark box' },
    { name: 'edit', icon: 'setting' },
    { name: 'remove', icon: 'remove' }
  ])).readOnly(),

  /**
    @property colsSettingsItems
    @readOnly
  */
  colsSettingsItems: computed('i18n.locale', 'userSettingsService.isUserSettingsServiceEnabled', function() {
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
  advLimitItems: computed('i18n.locale', 'advLimit.isAdvLimitServiceEnabled', 'namedAdvLimits', function() {
    const i18n = this.get('i18n');
    const rootItem = {
      icon: 'dropdown icon',
      iconAlignment: 'right',
      title: '',
      items: A(),
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
    const editMenus = A();
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

    return this.get('advLimit.isAdvLimitServiceEnabled') ? A([rootItem]) : A();
  }),

  _colsSettingsItems: observer('colsSettingsItems', function() {
    this._updateListNamedUserSettings(this.get('componentName'));
  }),

  /**
    @property exportExcelItems
    @readOnly
  */
  exportExcelItems: computed(function() {
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
  filterByAnyMatchText: oneWay('filterText'),

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
    The name of the component for themodal window.
    If the `flexberry-objectlistview` component is used for the `flexberry-lookup` component, we must pass the name of the `flexberry-lookup` component to the modal window.

    @private
    @property _componentNameForModalWindow
    @type String
  */
  _componentNameForModalWindow: computed('inLookup', 'componentName', 'lookupComponentName', function () {
    return this.get('inLookup') ? this.get('lookupComponentName') : this.get('componentName');
  }),

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
      let modelController = this.get('modelController');
      let appController = getOwner(this).lookup('controller:application');
      let thisRouteName = appController.get('currentRouteName');
      let thisRecordId = modelController.get('model.id');
      let editInModal = this.get('editInModal');      
      let transitionOptions = {
        queryParams: {
          parentRoute: thisRouteName,
          parentRouteRecordId: thisRecordId
        }
      };
      if (editInModal) {
        this.openCreateModalDialog(modelController, editFormRoute);
      } else {
        assert('Property editFormRoute is not defined in controller', editFormRoute);
        this.get('objectlistviewEventsService').setLoadingState('loading');
        later((function() {
          modelController.transitionToRoute(editFormRoute + '.new', transitionOptions);
        }), 50);
      }
    },

    /**
      Delete selected rows.

      @method actions.delete
      @public
    */
    delete() {
      let confirmDeleteRows = this.get('confirmDeleteRows');
      let possiblePromise = null;

      if (confirmDeleteRows) {
        assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRows === 'function');

        possiblePromise = confirmDeleteRows();

        if ((!possiblePromise || !(possiblePromise instanceof Promise))) {
          return;
        }
      }

      if (possiblePromise || (possiblePromise instanceof Promise)) {
        possiblePromise.then(() => {
          this._confirmDeleteRows();
        });
      } else {
        this._confirmDeleteRows();
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

      later((function() {
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
      assert('showConfigDialog:: componentName is not defined in flexberry-objectlistview component', this.componentName);
      this.get('modelController').send('showConfigDialog', this.get('_componentNameForModalWindow'), settingName, this.get('useSidePageMode'));
    },

    /**
      Action to show confis dialog.

      @method actions.showConfigDialog
      @public
    */
    showAdvLimitDialog(settingName) {
      assert('showAdvLimitDialog:: componentName is not defined in flexberry-objectlistview component', this.componentName);
      this.get('modelController').send('showAdvLimitDialog', this.get('_componentNameForModalWindow'), settingName);
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
        const columns = this.get('objectlistviewEventsService').getOlvFilterColumnsArray(componentName);
        const useSidePageMode = this.get('useSidePageMode');

        this.get('modelController').send('showFiltersDialog', componentName, columns, useSidePageMode);
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
      assert('showExportDialog:: componentName is not defined in flexberry-objectlistview component', this.componentName);
      this.get('modelController').send('showConfigDialog', this.get('_componentNameForModalWindow'), settName, this.get('useSidePageMode'), true, immediateExport);
    },

    /**
      Handler click on flexberry-menu.

      @method actions.onMenuItemClick
      @public
      @param {jQuery.Event} e jQuery.Event by click on menu item
    */
    onMenuItemClick(e) {
      let iTags = $(e.currentTarget).find('i');
      let namedSettingSpans = $(e.currentTarget).find('span');
      if (iTags.length <= 0 || namedSettingSpans.length <= 0) {
        return;
      }

      let router = getOwner(this).lookup('router:main');
      let className = iTags.get(0).className;
      let namedSetting = namedSettingSpans.get(0).innerText;
      let componentName = this.get('componentName');
      let userSettingsService = this.get('userSettingsService');

      switch (className) {
        case 'table icon': {
          this.send('showConfigDialog');
          break;
        }

        case 'checkmark box icon': {

          //TODO move this code and  _getSavePromise@addon/components/colsconfig-dialog-content.js to addon/components/colsconfig-dialog-content.js
          /* eslint-disable no-unused-vars */
          let colsConfig = this.listNamedUserSettings[namedSetting];
          userSettingsService.saveUserSetting(componentName, undefined, colsConfig).
            then(record => {
              let currentController = this.get('currentController');
              let userSettingsApplyFunction = currentController.get('userSettingsApply');
              if (userSettingsApplyFunction instanceof Function) {
                userSettingsApplyFunction.apply(currentController, [componentName, colsConfig.sorting, colsConfig.perPage]);
              } else {
                let sort = serializeSortingParam(colsConfig.sorting);
                router.transitionTo(router.currentRouteName, { queryParams: { sort: sort, perPage: colsConfig.perPage || 5 } });
              }
            });
          /* eslint-disable no-unused-vars */
          break;
        }

        case 'setting icon': {
          this.send('showConfigDialog', namedSetting);
          break;
        }

        case 'remove icon': {
          /* eslint-disable no-unused-vars */
          userSettingsService.deleteUserSetting(componentName, namedSetting)
          .then(result => {
            this.get('colsConfigMenu').deleteNamedSettingTrigger(namedSetting, componentName);
            alert('Настройка ' + namedSetting + ' удалена');
          });
          /* eslint-enable no-unused-vars */
          break;
        }

        case 'remove circle icon': {
          if (!userSettingsService.haveDefaultUserSetting(componentName)) {
            alert('No default usersettings');
            break;
          }

          let defaultDeveloperUserSetting = userSettingsService.getDefaultDeveloperUserSetting(componentName);
          /* eslint-disable no-unused-vars */
          userSettingsService.saveUserSetting(componentName, undefined, defaultDeveloperUserSetting)
          .then(record => {
            let currentController = this.get('currentController');
            let userSettingsApplyFunction = currentController.get('userSettingsApply');
            if (userSettingsApplyFunction instanceof Function) {
              userSettingsApplyFunction.apply(currentController, [componentName, defaultDeveloperUserSetting.sorting, defaultDeveloperUserSetting.perPage]);
            } else {
              let sort = serializeSortingParam(defaultDeveloperUserSetting.sorting);
              let perPageDefault = defaultDeveloperUserSetting.perPage;
              router.transitionTo(router.currentRouteName, { queryParams: { sort: sort, perPage: perPageDefault || 5 } });
            }
          });
          /* eslint-enable no-unused-vars */
          break;
        }
        case 'unhide icon': {
          let currentUserSetting = userSettingsService.getListCurrentUserSetting(componentName);
          let caption = this.get('i18n').t('components.olv-toolbar.show-setting-caption') + router.currentPath + '.js';
          this.showInfoModalDialog(caption, JSON.stringify(currentUserSetting, undefined, '  '));
          break;
        }
      }
    },

    /**
      Handler click on flexberry-menu of advLimits.

      @method actions.onLimitMenuItemClick
      @public
      @param {jQuery.Event} e jQuery.Event by click on menu item
    */
    onLimitMenuItemClick(e) {
      const iTags = $(e.currentTarget).find('i');
      const namedLimitSpans = $(e.currentTarget).find('span');
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
        case 'checkmark box icon': {
          const advLimit = this.get(`namedAdvLimits.${advLimitName}`);
          advLimitService.saveAdvLimit(advLimit, componentName).
            then(() => {
              this.send('refresh');
            });
          break;
        }
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
      let iTags = $(e.currentTarget).find('i');
      let namedSettingSpans = $(e.currentTarget).find('span');
      if (iTags.length <= 0 || namedSettingSpans.length <= 0) {
        return;
      }

      let className = iTags.get(0).className;
      let namedSetting = namedSettingSpans.get(0).innerText;
      let componentName = this.get('componentName');
      let userSettingsService = this.get('userSettingsService');

      switch (className) {
        case 'file excel outline icon': {
          this.send('showExportDialog');
          break;
        }

        case 'checkmark box icon': {
          this.send('showExportDialog', namedSetting, true);
          break;
        }

        case 'setting icon': {
          this.send('showExportDialog', namedSetting);
          break;
        }

        case 'remove icon': {
          /* eslint-disable no-unused-vars */
          userSettingsService.deleteUserSetting(componentName, namedSetting, true)
          .then(result => {
            this.get('colsConfigMenu').deleteNamedSettingTrigger(namedSetting, componentName);
            alert('Настройка ' + namedSetting + ' удалена');
          });
          /* eslint-enable no-unused-vars */
          break;
        }
      }
    },

    /* eslint-disable no-unused-vars */
    copyJSONContent(event) {
      let infoModalDialog = this.get('_infoModalDialog');
      infoModalDialog.find('.olv-toolbar-info-modal-dialog-content textarea').select();
      let copied = document.execCommand('copy');
      let oLVToolbarInfoCopyButton = infoModalDialog.find('.olv-toolbar-info-modal-dialog-copy-button');
      oLVToolbarInfoCopyButton.get(0).innerHTML = this.get('i18n').t(copied ? 'components.olv-toolbar.copied' : 'components.olv-toolbar.ctrlc');
      oLVToolbarInfoCopyButton.addClass('disabled');
    }
    /* eslint-enable no-unused-vars */
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](https://emberjs.com/api/ember/release/classes/EmberObject/methods/init?anchor=init) method of [EmberObject](https://emberjs.com/api/ember/release/classes/EmberObject).
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
    if (isNone(modelController)) {
      this.set('modelController', this.get('currentController'));
    }

    this._updateListNamedUserSettings(this.get('componentName'));
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](https://emberjs.com/api/ember/release/classes/Component#method_willDestroy) method of [Component](https://emberjs.com/api/ember/release/classes/Component).
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
  /* eslint-disable no-unused-vars */
  _rowSelected(componentName, record, count, checked, recordWithKey) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', count > 0 && this.get('enableDeleteButton'));
    }
  },
  /* eslint-enable no-unused-vars */

  /**
    Handler for "Olv rows deleted" event in objectlistview.

    @method _rowsDeleted

    @param {String} componentName The name of objectlistview component
    @param {Integer} count Number of deleted records
  */
  /* eslint-disable no-unused-vars */
  _rowsDeleted(componentName, count) {
    if (this.get('allSelect')) {
      this.get('objectlistviewEventsService').updateSelectAllTrigger(this.get('componentName'), false);
    }

    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', false);
    }
  },
  /* eslint-enable no-unused-vars */

  _updateListNamedUserSettings(componentName) {
    if (!(this.get('userSettingsService').isUserSettingsServiceEnabled && componentName === this.get('componentName'))) {
      return;
    }

    this._resetNamedUserSettings();
    set(this, 'listNamedUserSettings', this.get('userSettingsService').getListCurrentNamedUserSetting(this.componentName));
    set(this, 'listNamedExportSettings', this.get('userSettingsService').getListCurrentNamedUserSetting(this.componentName, true));
  },

  _resetNamedUserSettings() {
    let menus = this.get('menus');
    for (let i = 0; i < menus.length; i++) {
      set(this.get('colsSettingsItems')[0].items[i + 1], 'items', []);
      set(this.get('exportExcelItems')[0].items[i + 1], 'items', []);
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
        set(this.get('exportExcelItems')[0].items[i + 1], 'items', newSubItems);
      } else {
        set(this.get('colsSettingsItems')[0].items[i + 1], 'items', newSubItems);
      }
    }

    this._sortNamedSetting(isExportExcel);
  },

  _deleteNamedSetting(namedSetting, componentName) {
    if (componentName === this.get('componentName')) {
      this._updateListNamedUserSettings(componentName);
    }
  },
  /* eslint-enable no-unused-vars */

  /* eslint-disable no-unused-vars */
  _selectAll(componentName, selectAllParameter, skipConfugureRows) {
    if (componentName === this.get('componentName')) {
      this.set('allSelect', selectAllParameter);
      this.set('isDeleteButtonEnabled', selectAllParameter);
    }
  },
  /* eslint-enable no-unused-vars */

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
    if (isNone(itemsNameList)) {
      return A();
    }

    const itemsNames = A(Object.keys(itemsNameList)).sortBy('name');
    return itemsNames.map(name => { return { title: name, icon: icon, iconAlignment: 'left' }; });
  },

  /**
    Delete rows when it confirmed.

    @method _confirmDeleteRows
    @private
  */
  _confirmDeleteRows() {
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
  }
});
