import $ from 'jquery';
import { assert } from '@ember/debug';
import Mixin from '@ember/object/mixin';
import { set, computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { isEmpty } from '@ember/utils';
import serializeSortingParam from '../utils/serialize-sorting-param';
/**
  Mixin for handling errors.

  @class ErrorableRouteMixin
  @extends <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
  @public
*/
export default Mixin.create({

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
    @property colsConfigMenu
    @type Service
  */
  colsConfigMenu: service(),

  /**
    @property colsSettingsItems
    @readOnly
  */
  colsSettingsItems: computed('i18n.locale', 'userSettingsService.isUserSettingsServiceEnabled', function() {
    let i18n = this.get('i18n');
    let rootItem = {
      icon: 'dropdown icon',
      iconAlignment: 'right',
      title: '',
      items: [],
      localeKey: '',
      rootElementsLength: undefined,
    };
    let newSettitingItem = {
      icon: 'table icon',
      iconAlignment: 'left',
      title: i18n.t('components.olv-toolbar.create-setting-title'),
      dividing: true,
      localeKey: 'components.olv-toolbar.create-setting-title'
      
    };

    let device = this.get('device');
    if (device.type() === 'phone') {
      newSettitingItem = {
        icon: 'icon-guideline-plus icon',
        iconAlignment: 'left',
        dividing: true,
        title: "Сохранить настройку"
      };
      if (isEmpty(this.get('componentName'))){
        rootItem = {
          icon: 'icon-guideline-menu-ellipsis-vertical',
          iconAlignment: 'right',
          title: '',
          items: [],
          localeKey: ''
        }
      }
    }

    rootItem.items[rootItem.items.length] = newSettitingItem;

    let setDefaultItem = {
      icon: 'remove circle icon',
      iconAlignment: 'left',
      title: i18n.t('components.olv-toolbar.set-default-setting-title'),
      dividing: true,
      localeKey: 'components.olv-toolbar.set-default-setting-title'
    };
    rootItem.items[rootItem.items.length] = setDefaultItem;
    rootItem.rootElementsLength = rootItem.items.length;

    return this.get('userSettingsService').isUserSettingsServiceEnabled ? [rootItem] : [];
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

    let rootItem = {
      icon: 'dropdown icon',
      iconAlignment: 'right',
      title: '',
      items: [],
      localeKey: '',
      rootElementsLength: undefined,
    };
    let newSettitingItem = {
      icon: 'file excel outline icon',
      iconAlignment: 'left',
      title: i18n.t('components.olv-toolbar.create-setting-title'),
      dividing: true,
      localeKey: 'components.olv-toolbar.create-setting-title'
    };

    let device = this.get('device');
    if (device.type() === 'phone') {
      newSettitingItem = {
        icon: 'icon-guideline-plus icon',
        iconAlignment: 'left',
        title: "Сохранить настройку",
        dividing: true
      };
      if (isEmpty(this.get('componentName'))){
        rootItem = {
          icon: 'icon-guideline-menu-ellipsis-vertical',
          iconAlignment: 'right',
          title: '',
          items: [],
          localeKey: ''
        }
      }
    }

    rootItem.items[rootItem.items.length] = newSettitingItem;
    rootItem.rootElementsLength = rootItem.items.length;

    return [rootItem];
  }),

  init() {
    this._super(...arguments);

    // if (!this.get('componentName')) {
    //   throw new Error('Name of flexberry-objectlictview component was not defined.');
    // }

    this.get('colsConfigMenu').on('updateNamedSetting', this, this._updateListNamedUserSettings);
    this.get('colsConfigMenu').on('addNamedSetting', this, this._addNamedSetting);
    this.get('colsConfigMenu').on('deleteNamedSetting', this, this._deleteNamedSetting);
    // this.get('colsConfigMenu').on('updateNamedAdvLimit', this, this._updateNamedAdvLimits);
  },

  _updateListNamedUserSettings(componentName, isExportExcel) {
    if (!this.get('userSettingsService').isUserSettingsServiceEnabled) {
      return;
    }
    this.set('componentName', componentName);
    // let isExportExcel = this.get('model.exportParams.isExportExcel');

    this._resetNamedUserSettings(isExportExcel);
    set(this, 'listNamedUserSettings', this.get('userSettingsService').getListCurrentNamedUserSetting(componentName));
    set(this, 'listNamedExportSettings', this.get('userSettingsService').getListCurrentNamedUserSetting(componentName, true));
  },

  _resetNamedUserSettings(isExportExcel) {
    let itemsName = isExportExcel ? 'exportExcelItems': 'colsSettingsItems';
    let itemsArray = this.get(itemsName)[0].items;
    let rootElementsCount = this.get(itemsName)[0].rootElementsLength;
    itemsArray.splice(rootElementsCount, itemsArray.length-rootElementsCount);

    set(this.get(itemsName)[0], 'items', itemsArray); 
  },

  _addNamedSetting(namedSetting, componentName, isExportExcel) {
    if (componentName !== this.get('componentName')) {
      return;
    }

    let itemsName = isExportExcel ? 'exportExcelItems': 'colsSettingsItems';
    let subItems = this.get(itemsName)[0].items;
    let newSubItems = subItems.slice();

    let itemExist = subItems.find(item => item.title === namedSetting);
    if (isEmpty(itemExist)) {
      newSubItems.push({ 
        title: namedSetting,
        buttons: [{
          buttonClasses: 'icon',
          iconClass: 'icon-guideline-delete icon',
          iconAlignment: 'right floated',
          disabled: false,
          buttonAction: (namedSetting) => {
            /* eslint-disable no-unused-vars */
            this.get('userSettingsService').deleteUserSetting(componentName, namedSetting, isExportExcel)
            .then(result => {
              this.get('colsConfigMenu').deleteNamedSettingTrigger(namedSetting, componentName, isExportExcel);
              alert('Настройка ' + namedSetting + ' удалена');
            });
            /* eslint-enable no-unused-vars */
          },
        },{
          buttonClasses: 'icon',
          iconClass: 'icon-guideline-edit icon',
          iconAlignment: 'right floated',
          disabled: false,
          buttonAction: (namedSetting) => {
            if (isExportExcel) {
              this.send('showExportDialog', namedSetting);
            } else {
              this.send('showConfigDialog', namedSetting.title);
            }
          },
        }]
      });

      set(this.get(itemsName)[0], 'items', newSubItems);
    }

    this._sortNamedSetting(isExportExcel);
  },

  _deleteNamedSetting(namedSetting, componentName, isExportExcel) {
    if (componentName === this.get('componentName')) {
      this._updateListNamedUserSettings(componentName, isExportExcel);
    }
  },

  _sortNamedSetting(isExportExcel) {
    let itemsName = isExportExcel ? 'exportExcelItems': 'colsSettingsItems';
    this.get(itemsName)[0].items.sort((a, b) => {
        a.title > b.title
    });
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](https://emberjs.com/api/ember/release/classes/Component#method_willDestroy) method of [Component](https://emberjs.com/api/ember/release/classes/Component).
  */
  willDestroy() {
    this.get('colsConfigMenu').off('updateNamedSetting', this, this._updateListNamedUserSettings);
    this.get('colsConfigMenu').off('addNamedSetting', this, this._addNamedSetting);
    this.get('colsConfigMenu').off('deleteNamedSetting', this, this._deleteNamedSetting);
    // this.get('colsConfigMenu').off('updateNamedAdvLimit', this, this._updateNamedAdvLimits);
    this._super(...arguments);
  },

  actions: {

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
        // Show save lightbox mobile
        case 'icon-guideline-plus': {
          this.set('lightboxIsOpen', true)
          break;
        }
        // New settings
        case 'table icon': {
          this.send('showConfigDialog');
          break;
        }
        // Default settings
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
              router.transitionTo(router.currentRouteName, { queryParams: { sort: sort, perPage: 5 } });
            }
          });
          /* eslint-enable no-unused-vars */
          break;
        }
        // Show settings
        case 'unhide icon': {
          let currentUserSetting = userSettingsService.getListCurrentUserSetting(componentName);
          let caption = this.get('i18n').t('components.olv-toolbar.show-setting-caption') + router.currentPath + '.js';
          this.showInfoModalDialog(caption, JSON.stringify(currentUserSetting, undefined, '  '));
          break;
        }
        // Use
        default: {

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

      switch (className) {
        // Show save lightbox mobile
        case 'icon-guideline-plus': {
          this.set('lightboxIsOpen', true)
          break;
        }
        // New settings
        case 'file excel outline icon': {
          this.send('showExportDialog');
          break;
        }
        // Unload
        default: {
          this.send('showExportDialog', namedSetting, true);
          break;
        }
      }
    },
  }
})