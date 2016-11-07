/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { Query } from 'ember-flexberry-data';

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
  developerUserSettings:{},

  /**
    User settings for all pages before params applying.

    @property beforeParamUserSettings
    @type Object
    @default {}
    */
  beforeParamUserSettings:{},

  /**
    Current user settings for all pages

    @property currentUserSettings
    @type Object
    @default {}
    */
  currentUserSettings:{},

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

   @method setCurrentWebPage
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
    if (!(appPage  in this.currentUserSettings)) {
      this.currentUserSettings[appPage] = JSON.parse(JSON.stringify(developerUserSettings));
      this.beforeParamUserSettings[appPage] = JSON.parse(JSON.stringify(this.currentUserSettings[appPage]));
      this.developerUserSettings[appPage] = developerUserSettings;
      if (this.isUserSettingsServiceEnabled) {
        return this._getUserSettings().then(
          appPageUserSettings => {
            return this._setCurrentUserSettings(appPageUserSettings);
          }
        );
      }

    }

    return new Ember.RSVP.Promise(function(resolve) {
      resolve(undefined);
    });
  },

  /**
   Get list components Names.

   @method getListComponentNames
   @return {Array}
   */
  getListComponentNames() {
    let ret = [];
    let appPage = this.currentAppPage;
    if (appPage in  this.currentUserSettings) {
      for (let componentName in this.currentUserSettings[appPage]) {
        ret[ret.length] = componentName;
      }
    }

    return ret;
  },

  /**
   Implements current URL-params to currentUserSettings

   @method setCurrentParams
   @param {Object} params.
   */
  setCurrentParams(componentName, params) {
    let appPage = this.currentAppPage;
    let sorting;
    if ('sort' in params && params.sort) {
      sorting = this._deserializeSortingParam(params.sort);
    } else {
      sorting = this.beforeParamUserSettings[appPage][componentName][defaultSettingName].sorting;
    }

    this.currentUserSettings[appPage][componentName][defaultSettingName].sorting = sorting;
  },

  /**
    Returns  true if userSettings for current appPage exists.

    @method exists
    @return {Boolean}
   */
  exists() {
    let ret = this.currentAppPage in  this.currentUserSettings;
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
   *   Returns current list of userSetting.
   *
   *   @method getListCurrentUserSetting
   *   @return {String}
   */
  getListCurrentUserSetting(componentName) {
    let ret = [];
    if (this.currentAppPage in  this.currentUserSettings &&
      componentName in this.currentUserSettings[this.currentAppPage]
    ) {
      ret = this.currentUserSettings[this.currentAppPage][componentName];
    }

    return ret;
  },

  /**
   Returns current list of named userSetting.

   @method getListCurrentNamedUserSetting
   @return {String}
   */
  getListCurrentNamedUserSetting(componentName) {
    let ret = {};
    let listCurrentUserSetting = this.getListCurrentUserSetting(componentName);
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

   @method getCurrentSorting
   @param {String} componentName Name of component.
   @param {String} settingName Name of setting.
   @return {String}
   */
  getCurrentUserSetting(componentName, settingName) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    let ret;
    if (this.currentAppPage in  this.currentUserSettings &&
      componentName in this.currentUserSettings[this.currentAppPage] &&
      settingName in this.currentUserSettings[this.currentAppPage][componentName]
    ) {
      ret = this.currentUserSettings[this.currentAppPage][componentName][settingName];
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
    return currentUserSetting && 'sorting' in currentUserSetting ? currentUserSetting.sorting : [];
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
    if (this.currentAppPage in this.currentUserSettings &&
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
   Deletes given user setting from storage.

   @method deleteUserSetting
   @param {Object} [options] Parameters for user setting getting.
   @param {String} componentName component Name to search by.
   @param {String} settingName Setting name to search by.
   @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>[]} Promises array
   */
  deleteUserSetting(componentName, settingName) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
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
      return new Ember.RSVP.Promise(function(resolve) {
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
  saveUserSetting(componentName, settingName, userSetting) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    Ember.assert('saveUserSetting:: componentName is not defined for user setting saving.', componentName);
    Ember.assert('saveUserSetting:: User setting data are not defined for user setting saving.', userSetting);
    Ember.assert('saveUserSetting:: Setting name is not defined for user setting saving.', settingName !== undefined);

    if (!(this.currentAppPage in this.currentUserSettings)) {
      this.currentUserSettings[this.currentAppPage] = { };
    }

    if (!(componentName in this.currentUserSettings[this.currentAppPage])) {
      this.currentUserSettings[this.currentAppPage][componentName] = { };
    }

    this.currentUserSettings[this.currentAppPage][componentName][settingName] = userSetting;
    this.beforeParamUserSettings[this.currentAppPage] = JSON.parse(JSON.stringify(this.currentUserSettings[this.currentAppPage]));
    if (!this.get('isUserSettingsServiceEnabled')) {
      return new Ember.RSVP.Promise((resolve, reject) => {resolve();});
    }

    let store = this.get('_store');
    let ret = this._getExistingRecord(componentName, settingName).then(
      (foundRecord) => {
        if (foundRecord) {
          let prevUserSetting = JSON.parse(foundRecord.get('txtVal'));
          if (!prevUserSetting) {
            prevUserSetting = {};
          }

          for (let settingName in userSetting) {
            prevUserSetting[settingName] = userSetting[settingName];
          }

          foundRecord.set('txtVal', JSON.stringify(prevUserSetting));
        } else {
          let currentUserName = this.getCurrentUser();
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
    Returns current user name.
    Method must be overridden if application uses some authentication.

    @method getCurrentUser
    @return {String} Current user name.
  */
  getCurrentUser() {
    // TODO: add mechanism to return current user.
    return '';
  },

  /**
    Returns  user setting for current appPage from storage.

    @method _getUserSettings
    @return {Object}
   */
  _getUserSettings() {
    if (!this.get('isUserSettingsServiceEnabled')) {
      return { };
    }

    let settingsPromise = this._getExistingSettings();

    let ret = settingsPromise.then(
      foundRecords => {
        let ret = {};
        if (foundRecords) {
          for (let i = 0; i < foundRecords.length; i++) {
            let foundRecord = foundRecords[i];
            let userSettingValue = foundRecord.record.get('txtVal');
            let settName  = foundRecord.record.get('settName');
            let componentName  = foundRecord.record.get('moduleName');
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
    );
    return ret;
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
      ret[settingProperty] = (settingProperty in addSettings) ?
        Ember.merge(setting1[settingProperty], addSettings[settingProperty]) :
        setting1[settingProperty];
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
  _deleteExistingRecord: function(componentName, settingName) {
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
          for (let i =  0; i < foundRecords.length; i++) {
            delPromises[delPromises.length] = foundRecords[i].record.destroyRecord();
          }

          return Ember.RSVP.Promise.all(delPromises).then(
            result => {return result;}
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
    let currentUserName = this.getCurrentUser();
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
  },

  /**
   *    Convert string with sorting parameters to object.
   *
   *    Expected string type: '+Name1-Name2...', where: '+' and '-' - sorting direction, 'NameX' - property name for soring.
   *
   *    @method deserializeSortingParam
   *    @param {String} paramString String with sorting parameters.
   *    @returns {Array} Array objects type: { propName: 'NameX', direction: 'asc|desc' }
   */
  _deserializeSortingParam(paramString) {
    let result = [];
    while (paramString) {
      let order = paramString.charAt(0);
      let direction = order === '+' ? 'asc' :  order === '-' ? 'desc' : null;
      paramString = paramString.substring(1, paramString.length);
      let nextIndices = this._getNextIndeces(paramString);
      let nextPosition = Math.min.apply(null, nextIndices);
      let propName = paramString.substring(0, nextPosition);
      paramString = paramString.substring(nextPosition);

      if (direction) {
        result.push({
          propName: propName,
          direction: direction
        });
      }
    }

    return result;
  },

  /**
   * Return index start next sorting parameters.
   *
   * @method _getNextIndeces
   * @param {String} paramString
   * @return {Number}
   * @private
   */
  _getNextIndeces(paramString) {
    let nextIndices = ['+', '-', '!'].map(function(element) {
      let pos = paramString.indexOf(element);
      return pos === -1 ? paramString.length : pos;
    });

    return nextIndices;
  }

});
