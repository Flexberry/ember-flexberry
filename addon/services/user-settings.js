/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
import deserializeSortingParam from '../utils/deserialize-sorting-param';
import serializeSortingParam from '../utils/serialize-sorting-param';

const { Builder, SimplePredicate, ComplexPredicate } = Query;

const defaultSettingName = 'DEFAULT';

/**
  Service to store/read user settings to/from application storage.

  @class UserSettingsService
  @extends <a href="http://emberjs.com/api/classes/Ember.Service.html">Ember.Service</a>
*/
export default Ember.Service.extend({
  /**
    Ember data store.

    @property _store
    @type DS.Store
    @private
  */
  _store: Ember.inject.service('store'),

  /**
    Flag: indicates whether to use user settings service (if `true`) or not (if `false`).
    This flag is readed from config setting `APP.useUserSettingsService` and can be changed programatically later.

    @property isUserSettingsServiceEnabled
    @type Boolean
    @default false
  */
  isUserSettingsServiceEnabled: false,

  /**
    User settings for all pages defined by developer

    @property defaultDeveloperUserSettings
    @type Object
    @default {}
   */
  defaultDeveloperUserSettings: {},

  /**
    Current Application name.

    @property appName
    @type String
    @default ''
    */
  appName: '',

  /**
    Current WEB page.

    @property currentWebPage
    @type String
    @default ''
    */
  currentWebPage: '',

  /**
    Current App page.

    @property currentAppPage
    @type String
    @default ''
    */
  currentAppPage: '',

  /**
    User settings for all pages defined by developer

    @property developerUserSettings
    @type Object
    @default {}
   */
  developerUserSettings: {},

  /**
    User settings for all pages before params applying.

    @property beforeParamUserSettings
    @type Object
    @default {}
    */
  beforeParamUserSettings: {},

  /**
    Current user settings for all pages

    @property currentUserSettings
    @type Object
    @default {}
    */
  currentUserSettings: {},

  init() {
    this._super(...arguments);
    let appConfig = Ember.getOwner(this)._lookupFactory('config:environment');
    if (!Ember.isNone(appConfig.APP.useUserSettingsService)) {
      this.set('isUserSettingsServiceEnabled', appConfig.APP.useUserSettingsService);
    }
  },

  /**
   Set current Web Page.

   @method setCurrentWebPage
   @param {String} webPage.
   */
  setCurrentWebPage(webPage) {
    this.currentWebPage = webPage;
    this.currentAppPage = webPage + '@' + this.appName;
  },

  /**
   Get current Web Page.

   @method getCurrentWebPage
   @return {String}
   */
  getCurrentWebPage() {
    return this.currentWebPage;
  },

  /**
   Get current App Page.

   @method getCurrentAppPage
   @return {String}
   */
  getCurrentAppPage() {
    return this.currentAppPage;
  },

  /**
   Get current App Name.

   @method getCurrentAppName
   @return {String}
   */
  getCurrentAppName() {
    return this.currentAppPage;
  },

  /**
    Set initial userSetting for current webPage, defined by application developer
    Structure of developerUserSettings:
    {
    <componentName>: {
      <settingName>: {
          colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
          sorting: [{ propName: <colName>, direction: "asc"|"desc" }, ... ],
          colsWidths: [ <colName>:<colWidth>, ... ],
        },
        ...
      },
      ...
    }
    For default userSetting use empty name ('').
    <componentName> may contain any of properties: colsOrder, sorting, colsWidth or being empty.

    @method setDeveloperUserSettings
    @param {Object} developerUserSettings.
   */
  setDeveloperUserSettings(developerUserSettings) {
    for (let componentName in developerUserSettings) {
      let componentSettings = developerUserSettings[componentName];
      for (let settingName in componentSettings) {
        if (!('sorting' in componentSettings[settingName])) {
          componentSettings[settingName].sorting = [];
        }
      }

      if (!(defaultSettingName in componentSettings)) {
        componentSettings[defaultSettingName] = { sorting: [] };
      }
    }

    let appPage = this.currentAppPage;
    if (!(appPage in this.currentUserSettings)) {
      this.currentUserSettings[appPage] = JSON.parse(JSON.stringify(developerUserSettings));
      this.beforeParamUserSettings[appPage] = JSON.parse(JSON.stringify(this.currentUserSettings[appPage]));
      this.developerUserSettings[appPage] = JSON.parse(JSON.stringify(developerUserSettings));
      if (this.isUserSettingsServiceEnabled) {
        return this._getUserSettings().then(
          foundRecords => {
            let ret = {};
            if (foundRecords) {
              for (let i = 0; i < foundRecords.length; i++) {
                let foundRecord = foundRecords[i];
                let userSettingValue = foundRecord.record.get('txtVal');
                let settName = foundRecord.record.get('settName');
                let componentName = foundRecord.record.get('moduleName');
                if (!settName) {
                  settName = defaultSettingName;
                }

                if (userSettingValue) {
                  if (!(componentName in ret)) {
                    ret[componentName] = {};
                  }

                  ret[componentName][settName] = JSON.parse(userSettingValue);
                }
              }
            }

            return ret;
          }
        ).then(
          appPageUserSettings => {
            return this._setCurrentUserSettings(appPageUserSettings);
          }
        );
      }

    }

    return new Ember.RSVP.Promise(function (resolve) {
      resolve(undefined);
    });
  },

  /**
    Set initial userSetting for current webPage, defined by application developer

    @method setDefaultDeveloperUserSettings
    @param {Object} developerUserSettings.
   */
  setDefaultDeveloperUserSettings(developerUserSettings) {
    for (let componentName in developerUserSettings) {
      let componentSettings = developerUserSettings[componentName];
      for (let settingName in componentSettings) {
        if (!('sorting' in componentSettings[settingName])) {
          componentSettings[settingName].sorting = [];
        }
      }

      if (!(defaultSettingName in componentSettings)) {
        componentSettings[defaultSettingName] = { sorting: [] };
      }
    }

    let appPage = this.currentAppPage;
    this.defaultDeveloperUserSettings[appPage] = JSON.parse(JSON.stringify(developerUserSettings));
  },

  /**
   Get list components Names.

   @method getListComponentNames
   @return {Ember.NativeArray}
   */
  getListComponentNames() {
    let ret = Ember.A();
    let appPage = this.currentAppPage;
    if (appPage in this.currentUserSettings) {
      for (let componentName in this.currentUserSettings[appPage]) {
        ret.pushObject(componentName);
      }
    }

    return ret;
  },

  /**
   Implements current URL-params to currentUserSettings

   @method setCurrentParams
   @param {Object} params
   @return {String} URL params
   */
  setCurrentParams(componentName, params) {
    let appPage = this.currentAppPage;
    if (params.sort === null) {
      this.currentUserSettings[appPage][componentName][defaultSettingName].sorting = this.getCurrentSorting(componentName);
      return serializeSortingParam(this.currentUserSettings[appPage][componentName][defaultSettingName].sorting);
    } else {
      let sorting;
      if ('sort' in params && params.sort) {
        sorting = deserializeSortingParam(params.sort);
      } else if (this.beforeParamUserSettings[appPage] && this.beforeParamUserSettings[appPage][componentName]) {
        sorting = this.beforeParamUserSettings[appPage][componentName][defaultSettingName].sorting;
      }

      let userSetting = this.getCurrentUserSetting(componentName);
      userSetting.sorting = sorting;
      this.saveUserSetting(componentName, defaultSettingName, userSetting);
      this.currentUserSettings[appPage][componentName][defaultSettingName].sorting = sorting;
      return serializeSortingParam(this.currentUserSettings[appPage][componentName][defaultSettingName].sorting);
    }
  },

  /**
    Returns  true if userSettings for current appPage exists.

    @method exists
    @return {Boolean}
   */
  exists() {
    let ret = this.currentAppPage in this.currentUserSettings;
    return ret;
  },

  /**
    Returns  true if default userSettings for current appPage exists.

    @method exists
    @return {Boolean}
   */
  haveDefaultUserSetting(componentName) {
    let ret = this.exists() &&
      componentName in this.currentUserSettings[this.currentAppPage] &&
      defaultSettingName in this.currentUserSettings[this.currentAppPage][componentName];
    return ret;
  },

  /**
    Creates default user setting if setting for specified component isn't exists.

    @method createDefaultUserSetting
    @param {String} componentName
   */
  createDefaultUserSetting(componentName) {
    if (!(this.exists())) {
      Ember.set(this, `currentUserSettings.${this.currentAppPage}`, {});
    }

    if (!(componentName in this.currentUserSettings[this.currentAppPage])) {
      Ember.set(this, `currentUserSettings.${this.currentAppPage}.${componentName}`, {});
    }

    if (!(defaultSettingName in this.currentUserSettings[this.currentAppPage][componentName])) {
      Ember.set(this, `currentUserSettings.${this.currentAppPage}.${componentName}.${defaultSettingName}`, {});
    }
  },

  /**
   *   Returns current list of userSetting.
   *
   *   @method getListCurrentUserSetting
   *   @return {String}
   */
  getListCurrentUserSetting(componentName, isExportExcel) {
    let ret = {};
    if (this.exists() &&
      componentName in this.currentUserSettings[this.currentAppPage]
    ) {
      let sets = this.currentUserSettings[this.currentAppPage][componentName];

      for (let settingName in sets) {
        let settingNameSplit = settingName.split('/');
        if (isExportExcel && settingNameSplit[0] === 'ExportExcel') {
          ret[settingName] = sets[settingName];
        }

        if (!isExportExcel && settingNameSplit[0] !== 'ExportExcel') {
          ret[settingName] = sets[settingName];
        }
      }
    }

    return ret;
  },

  /**
    Returns current list of named userSetting.

    @method getListCurrentNamedUserSetting
    @return {String}
  */
  getListCurrentNamedUserSetting(componentName, isExportExcel) {
    let ret = {};
    let listCurrentUserSetting = this.getListCurrentUserSetting(componentName, isExportExcel);
    for (let settingName in listCurrentUserSetting) {
      if (settingName === defaultSettingName) {
        continue;
      }

      ret[settingName] = listCurrentUserSetting[settingName];
    }

    return ret;
  },

  /**
   Returns current userSetting.

   @method getCurrentUserSetting
   @param {String} componentName Name of component.
   @param {String} settingName Name of setting.
   @return {String}
   */
  getCurrentUserSetting(componentName, settingName) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    let ret;
    if (this.exists() &&
      componentName in this.currentUserSettings[this.currentAppPage] &&
      settingName in this.currentUserSettings[this.currentAppPage][componentName]
    ) {
      ret = this.currentUserSettings[this.currentAppPage][componentName][settingName];
    }

    return ret;
  },

  /**
   Returns default developer user settings for component.

   @method getDefaultDeveloperUserSetting
   @param {String} componentName Name of component.
   @return {Object}
   */
  getDefaultDeveloperUserSetting(componentName) {
    let settingName = defaultSettingName;

    let ret;
    if (this.currentAppPage in this.defaultDeveloperUserSettings &&
      componentName in this.defaultDeveloperUserSettings[this.currentAppPage] &&
      settingName in this.defaultDeveloperUserSettings[this.currentAppPage][componentName]
    ) {
      ret = this.defaultDeveloperUserSettings[this.currentAppPage][componentName][settingName];
    }

    return ret;
  },

  /**
   Returns current sorting .

   @method getCurrentSorting
   @param {String} componentName Name of component.
   @param {String} settingName Name of setting.
   @return {Array}
   */
  getCurrentSorting(componentName, settingName) {
    let currentUserSetting = this.getCurrentUserSetting(componentName, settingName);
    return currentUserSetting && 'sorting' in currentUserSetting ? currentUserSetting.sorting : Ember.A();
  },

  /**
   Returns current perPageValue .

   @method getCurrentPerPage
   @param {String} componentName Name of component.
   @param {String} settingName Name of setting.
   @return {Array}
   */
  getCurrentPerPage(componentName, settingName) {
    let currentUserSetting = this.getCurrentUserSetting(componentName, settingName);
    let configEnvironmentSettings = Ember.getOwner(this).resolveRegistration('config:environment');
    let defaultPerPage;
    
    try{
      defaultPerPage = configEnvironmentSettings.APP.components.flexberryObjectlistview.defaultPerPage;
      if(!defaultPerPage)
        throw new TypeError('configEnvironmentSettings returned invalid value');
    }
    catch(error){
      console.error(error.name + ': ' + error.message);
      defaultPerPage = 5;
    }

    return currentUserSetting && 'perPage' in currentUserSetting ? parseInt(currentUserSetting.perPage, 10) : defaultPerPage;
  },

  /**
   Returns current colsOrder .

   @method getCurrentColsOrder
   @param {String} componentName Name of component.
   @param {String} settingName Name of setting.
   @return {Array}
   */
  getCurrentColsOrder(componentName, settingName) {
    let currentUserSetting = this.getCurrentUserSetting(componentName, settingName);
    return currentUserSetting && 'colsOrder' in currentUserSetting ? currentUserSetting.colsOrder : undefined;
  },

  /**
   Returns current columnWidths.

   @method getCurrentColumnWidths
   @param {String} componentName Name of component.
   @param {String} settingName Name of setting.
   @return {Array}
   */
  getCurrentColumnWidths(componentName, settingName) {
    let currentUserSetting = this.getCurrentUserSetting(componentName, settingName);
    return currentUserSetting && 'columnWidths' in currentUserSetting ? currentUserSetting.columnWidths : undefined;
  },

  /**
   Returns current detSeparateCols.

   @method getDetSeparateCols
   @param {String} componentName Name of component.
   @param {String} settingName Name of setting.
   @return {Boolean}
   */
  getDetSeparateCols(componentName, settingName) {
    let currentUserSetting = this.getCurrentUserSetting(componentName, settingName);
    return currentUserSetting && 'detSeparateCols' in currentUserSetting ? currentUserSetting.detSeparateCols : false;
  },

  /**
   Returns current detSeparateRows.

   @method getDetSeparateRows
   @param {String} componentName Name of component.
   @param {String} settingName Name of setting.
   @return {Boolean}
   */
  getDetSeparateRows(componentName, settingName) {
    let currentUserSetting = this.getCurrentUserSetting(componentName, settingName);
    return currentUserSetting && 'detSeparateRows' in currentUserSetting ? currentUserSetting.detSeparateRows : false;
  },

  /**
   Set current columnWidths.

   @method setCurrentColumnWidths
   @param {String} componentName Name of component.
   @param {String} settingName Name of setting.
   @param {Array} columnWidths List columns width.
   */
  setCurrentColumnWidths(componentName, settingName, columnWidths) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    let userSetting;
    if (this.exists() &&
      componentName in this.currentUserSettings[this.currentAppPage] &&
      settingName in this.currentUserSettings[this.currentAppPage][componentName]
    ) {
      userSetting = this.currentUserSettings[this.currentAppPage][componentName][settingName];
    } else {
      userSetting = {};
    }

    userSetting.columnWidths = columnWidths;
    if (this.isUserSettingsServiceEnabled) {
      this.saveUserSetting(componentName, settingName, userSetting);
    }
  },

  /**
   Set current perPage.

   @method setCurrentPerPage
   @param {String} componentName Name of component.
   @param {String} settingName Name of setting.
   @param {Int} perPageValue Per page value.
   */
  setCurrentPerPage(componentName, settingName, perPageValue) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    let userSetting;
    if (this.exists() &&
      componentName in this.currentUserSettings[this.currentAppPage] &&
      settingName in this.currentUserSettings[this.currentAppPage][componentName]
    ) {
      userSetting = this.currentUserSettings[this.currentAppPage][componentName][settingName];
    } else {
      userSetting = {};
    }

    userSetting.perPage = perPageValue;
    if (this.isUserSettingsServiceEnabled) {
      this.saveUserSetting(componentName, settingName, userSetting);
    }
  },

  /**
   Set toggler status

   @method setTogglerStatus
   @param {String} componentName Name of component.
   @param {Boolean} togglerStatus Status to save.
   */
  setTogglerStatus(componentName, settingName, togglerStatus) {
    let userSetting;

    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    if (this.exists() &&
      componentName in this.currentUserSettings[this.currentAppPage] &&
      settingName in this.currentUserSettings[this.currentAppPage][componentName]
    ) {
      userSetting = this.currentUserSettings[this.currentAppPage][componentName][settingName];
    } else {
      userSetting = {};
    }

    userSetting.togglerStatus = togglerStatus;
    if (this.isUserSettingsServiceEnabled) {
      this.saveUserSetting(componentName, settingName, userSetting);
    }
  },

  /**
    Check sort, order and with of cloumns and set default if it broken.

    @method checkDeletedAtributes
    @param {Object} store Current store.
    @param {Object} modelName Name of model.
    @param {String} componentName Name of component.
   */
  checkDeletedAtributes(store, modelName, componentName) {
    let developerUserSettings = this.getCurrentUserSetting(componentName);
    let invalid = false;
    let modelClass = store.modelFor(modelName);
    let attributes = Ember.get(modelClass, 'fields');

    if (developerUserSettings) {
      if (developerUserSettings.columnWidths) {
        developerUserSettings.columnWidths.forEach((withProp) => {
          if (withProp.propName !== 'OlvRowToolbar' && withProp.propName !== 'OlvRowMenu') {
            let prop = attributes.get(withProp.propName.split('.')[0]);
            if (!prop) {
              invalid = true;
            }
          }
        });
      }

      if (developerUserSettings.colsOrder) {
        developerUserSettings.colsOrder.forEach((orderProp) => {
          let prop = attributes.get(orderProp.propName.split('.')[0]);
          if (!prop) {
            invalid = true;
          }
        });
      }

      if (developerUserSettings.sorting) {
        developerUserSettings.sorting.forEach((sortProp) => {
          let prop = attributes.get(sortProp.propName.split('.')[0]);
          if (!prop) {
            invalid = true;
          }
        });
      }
    }

    if (invalid) {
      this.setCurrentUserSettingsToDefault(componentName);
    }

    return invalid;
  },

  /**
    Set default to current user setting.

    @method clearUserSettingAndSetDefault
    @param {String} componentName Name of component.
   */
  setCurrentUserSettingsToDefault(componentName) {
    this.currentUserSettings[this.currentAppPage][componentName][defaultSettingName] = this.getDefaultDeveloperUserSetting(componentName);
  },

  /**
   Returns toggler status from user service.

   @method getTogglerStatus
   @param {String} componentName component Name to search by.
   @return {Boolean} Saved status.
   */
  getTogglerStatus(componentName, settingName) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    let currentUserSetting = this.getCurrentUserSetting(componentName, settingName);

    return currentUserSetting && 'togglerStatus' in currentUserSetting ? currentUserSetting.togglerStatus : null;
  },

  /**
   Deletes given user setting from storage.

   @method deleteUserSetting
   @param {Object} [options] Parameters for user setting getting.
   @param {String} componentName component Name to search by.
   @param {String} settingName Setting name to search by.
   @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>[]} Promises array
   */
  deleteUserSetting(componentName, settingName, isExportExcel) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    if (isExportExcel) {
      settingName = 'ExportExcel/' + settingName;
    }

    Ember.assert('deleteUserSetting:: componentName name is not defined for user setting getting.', componentName);
    Ember.assert('deleteUserSetting:: Setting name is not defined for user setting getting.', settingName);

    let appPage = this.currentAppPage;
    if (appPage in this.developerUserSettings &&
      componentName in this.developerUserSettings[appPage] &&
      settingName in this.developerUserSettings[appPage][componentName]) {
      this.currentUserSettings[appPage][componentName][settingName] = this.developerUserSettings[appPage][componentName][settingName];
    } else {
      if (settingName in this.currentUserSettings[appPage][componentName]) {
        delete this.currentUserSettings[appPage][componentName][settingName];
      }
    }

    if (!this.get('isUserSettingsServiceEnabled')) {
      return new Ember.RSVP.Promise(function (resolve) {
        resolve(undefined);
      });
    }

    return this._deleteExistingRecord(componentName, settingName);
  },

  /**
   Saves given user setting to storage.

   @method saveUserSetting
   @param {String} componentName Name of module for what setting is saved.
   @param {String} settingName Setting name to save as.
   @param {String} userSetting User setting data to save.
   @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>} Save operation promise.
   */
  saveUserSetting(componentName, settingName, userSetting, isExportExcel) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    if (isExportExcel) {
      settingName = 'ExportExcel/' + settingName;
    }

    Ember.assert('saveUserSetting:: componentName is not defined for user setting saving.', componentName);
    Ember.assert('saveUserSetting:: User setting data are not defined for user setting saving.', userSetting);
    Ember.assert('saveUserSetting:: Setting name is not defined for user setting saving.', settingName !== undefined);

    if (!(this.exists())) {
      this.currentUserSettings[this.currentAppPage] = {};
    }

    if (!(componentName in this.currentUserSettings[this.currentAppPage])) {
      this.currentUserSettings[this.currentAppPage][componentName] = {};
    }

    this.currentUserSettings[this.currentAppPage][componentName][settingName] = userSetting;
    this.beforeParamUserSettings[this.currentAppPage] = JSON.parse(JSON.stringify(this.currentUserSettings[this.currentAppPage]));
    if (!this.get('isUserSettingsServiceEnabled')) {
      return new Ember.RSVP.Promise((resolve, reject) => { resolve(); });
    }

    let store = this.get('_store');
    let _this = this;
    let ret = this._getExistingRecord(componentName, settingName).then(
      (foundRecord) => {
        if (foundRecord) {
          let prevUserSetting = JSON.parse(foundRecord.get('txtVal'));
          if (!prevUserSetting) {
            prevUserSetting = {};
          }

          for (let settingName in prevUserSetting) {
            if (Ember.isNone(userSetting[settingName])) {
              delete prevUserSetting[settingName];
            }
          }

          for (let settingName in userSetting) {
            prevUserSetting[settingName] = userSetting[settingName];
          }

          foundRecord.set('txtVal', JSON.stringify(prevUserSetting));
        } else {
          let userService = Ember.getOwner(_this).lookup('service:user');
          let currentUserName = userService.getCurrentUserName();
          foundRecord = store.createRecord('new-platform-flexberry-flexberry-user-setting');
          foundRecord.set('userName', currentUserName);
          foundRecord.set('appName', this.currentAppPage);
          foundRecord.set('moduleName', componentName);
          foundRecord.set('settName', settingName);
          foundRecord.set('txtVal', JSON.stringify(userSetting));
        }

        return foundRecord.save();
      });
    return ret;
  },

  /**
    Returns  user setting for current appPage from storage.

    @method _getUserSettings
    @return {Object}
   */
  _getUserSettings() {
    if (!this.get('isUserSettingsServiceEnabled')) {
      return {};
    }

    let settingsPromise = this._getExistingSettings();

    return settingsPromise;
  },

  /**
    Merge current developerUserSettings with appPageUserSettings

    @method _setCurrentUserSettings
    @param {Object} appPageUserSettings merged userSettings
    @return {Object}
   */
  _setCurrentUserSettings(appPageUserSettings) {
    let appPage = this.currentAppPage;
    if (!(appPage in this.developerUserSettings)) {
      return undefined;
    }

    for (let componentName in this.developerUserSettings[appPage]) {
      let namedSettings = this.developerUserSettings[appPage][componentName];
      let settings = appPageUserSettings[componentName];
      for (let settingName in namedSettings) {
        if (componentName in appPageUserSettings && settingName in settings) {
          this.currentUserSettings[appPage][componentName][settingName] = this._mergeSettings(namedSettings[settingName], settings[settingName]);
          delete settings[settingName];
        }
      }

      for (let settingName in settings) {
        this.currentUserSettings[appPage][componentName][settingName] = settings[settingName];
      }

      delete appPageUserSettings[componentName];
    }

    for (let componentName in appPageUserSettings) {
      this.currentUserSettings[appPage][componentName] = appPageUserSettings[componentName];
    }

    this.beforeParamUserSettings[appPage] = JSON.parse(JSON.stringify(this.currentUserSettings[appPage]));
    return this.currentUserSettings[appPage];
  },

  /**
   Merge two settings.

   @method _mergeSettings
   @param {Object} setting1 base settings.
   @param {Object} setting2 additions settings.
   @return {Object} merged settings.
   @private
   */
  _mergeSettings(setting1, setting2) {
    let ret = {};
    let addSettings = JSON.parse(JSON.stringify(setting2));
    for (let settingProperty in setting1) {
      if (settingProperty in addSettings) {
        ret[settingProperty] = (typeof (setting1[settingProperty]) === 'object') ?
        Ember.merge(setting1[settingProperty], addSettings[settingProperty]) :
        addSettings[settingProperty];
      } else {
        ret[settingProperty] = setting1[settingProperty];
      }

      delete addSettings[settingProperty];
    }

    for (let settingProperty in addSettings) {
      ret[settingProperty] = addSettings[settingProperty];
    }

    return ret;
  },

  /**
   Deletes user settings record.

   @method _deleteExistingRecord
   @param {Object} componentName Module name of looked for record.
   @param {String} settingName Setting name of looked for record.
   @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>[]} Promises array.
   @private
   */
  _deleteExistingRecord: function (componentName, settingName) {
    // TODO: add search by username.
    let cp = this._getSearchPredicate(componentName, settingName);
    let store = this.get('_store');
    let modelName = 'new-platform-flexberry-flexberry-user-setting';
    let builder = new Builder(store)
      .from(modelName)
      .selectByProjection('FlexberryUserSettingE')
      .where(cp);

    return store.query(modelName, builder.build()).then((result) => {
      if (result) {
        let delPromises = [];
        let foundRecords = result.get('content');
        if (Ember.isArray(foundRecords) && foundRecords.length > 0) {
          for (let i = 0; i < foundRecords.length; i++) {
            delPromises[delPromises.length] = foundRecords[i].record.destroyRecord();
          }

          return Ember.RSVP.Promise.all(delPromises).then(
            result => { return result; }
          );
        }
      }

      return undefined;
    });
  },

  /**
   Looks for already created user settings record.

   @method _getExistingRecord
   @param {Object} componentName Module name of looked for record.
   @param {String} settingName Setting name of looked for record.
   @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>} A promise that returns founded record
   or `undefined` if there is no such setting.
   @private
   */
  _getExistingRecord(componentName, settingName) {
    // TODO: add search by username.
    let cp = this._getSearchPredicate(componentName, settingName);
    let store = this.get('_store');
    let modelName = 'new-platform-flexberry-flexberry-user-setting';
    let builder = new Builder(store)
      .from(modelName)
      .selectByProjection('FlexberryUserSettingE')
      .orderBy('settLastAccessTime desc')
      .where(cp);
    return store.query(modelName, builder.build()).then((result) => {
      if (result) {
        let foundRecords = result.get('content');
        if (Ember.isArray(foundRecords) && foundRecords.length > 0) {
          for (let i = 1; i < foundRecords.length; i++) {
            foundRecords[i].record.destroyRecord();
          }

          return foundRecords[0].record;
        }
      }

      return undefined;
    });
  },

  /**
   Looks for all created user settings records.

   @method _getExistingSettings
   @param {String} componentName Component name of looked for record.
   @param {String} settingName Setting name of looked for record.
   @return {Promise} A promise that returns found record or `undefined` if there is no such setting.
   @private
   */
  _getExistingSettings(componentName, settingName) {
    // TODO: add search by username.
    let cp = this._getSearchPredicate(componentName, settingName);
    let store = this.get('_store');
    let modelName = 'new-platform-flexberry-flexberry-user-setting';
    let builder = new Builder(store)
      .from(modelName)
      .selectByProjection('FlexberryUserSettingE')
      .where(cp);

    return store.query(modelName, builder.build()).then((result) => {
      let foundRecords = [];
      if (result) {
        foundRecords = result.get('content');
        if (!Ember.isArray(foundRecords)) {
          foundRecords = [];
        }

        return foundRecords;
      }
    });
  },

  _getSearchPredicate(componentName, settingName) {
    let ret;
    let userService = Ember.getOwner(this).lookup('service:user');
    let currentUserName = userService.getCurrentUserName();
    let p1 = new SimplePredicate('appName', 'eq', this.currentAppPage);
    let p2 = new SimplePredicate('userName', 'eq', currentUserName);
    if (componentName !== undefined) {
      let p3 = new SimplePredicate('moduleName', 'eq', componentName);
      if (settingName !== undefined) {
        let p4 = new SimplePredicate('settName', 'eq', settingName);
        ret = new ComplexPredicate('and', p1, p2, p3, p4);
      } else {
        ret = new ComplexPredicate('and', p1, p2, p3);
      }
    } else {
      Ember.assert('Find settingName of undefined componentName', settingName === undefined);
      ret = new ComplexPredicate('and', p1, p2);
    }

    return ret;
  }
});
