/**
  @module ember-flexberry
*/

import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { SimplePredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

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
   */
  appName: '',

  /**
    Current WEB page.
   */
  currentWebPage: '',

  /**
    Current App page.
   */
  currentAppPage: '',

  /**
    User settings for all pages defined by developer
   */
  developerUserSettings:{},
  /**
    Current user settings for all pages
   */
  currentUserSettings:{},

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
    let appPage = this.currentAppPage;
    if (!(appPage  in this.currentUserSettings)) {
      this.currentUserSettings[appPage] = developerUserSettings;
      this.developerUserSettings[appPage] = developerUserSettings;
      if (this.isUserSettingsServiceEnabled) {
        return this.getUserSettings({ }).then(
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

    return this.currentUserSettings[appPage];
  },

  /**
   Implements current URL-params to currentUserSettings

   @method setDeveloperUserSettings
   @param {Object} params.
   */
  setCurrentParams(params) {
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
   *   Returns current userSetting.
   *
   *   @method getCurrentSorting
   *   @return {String}
   */
  getCurrentUserSetting(componentName, settingName) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    let ret = undefined;
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
   @return {String}
   */
  getCurrentSorting(componentName, settingName) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    let ret = [];
    if (this.currentAppPage in  this.currentUserSettings &&
      componentName in this.currentUserSettings[this.currentAppPage] &&
      settingName in this.currentUserSettings[this.currentAppPage][componentName] &&
      'sorting' in this.currentUserSettings[this.currentAppPage][componentName][settingName]
    ) {
      ret = this.currentUserSettings[this.currentAppPage][componentName][settingName].sorting;
    }

    return ret;
  },

  /**
   Returns current colsOrder .
   *
   @method getCurrentColsOrder
   @return {String}
   */
  getCurrentColsOrder(componentName, settingName) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    let ret;
    if (this.currentAppPage in  this.currentUserSettings &&
      componentName in this.currentUserSettings[this.currentAppPage] &&
      settingName in this.currentUserSettings[this.currentAppPage][componentName] &&
      'colsOrder' in this.currentUserSettings[this.currentAppPage][componentName][settingName]
    ) {
      ret = this.currentUserSettings[this.currentAppPage][componentName][settingName].colsOrder;
    }

    return ret;
  },

  /**
   *   Returns current columnWidths.
   *
   *   @method getCurrentColumnWidths
   *   @return {String}
   */
  getCurrentColumnWidths(componentName, settingName) {
    if (settingName === undefined) {
      settingName = defaultSettingName;
    }

    let ret;
    if (this.currentAppPage in  this.currentUserSettings &&
      componentName in this.currentUserSettings[this.currentAppPage] &&
      settingName in this.currentUserSettings[this.currentAppPage][componentName] &&
      'columnWidths' in this.currentUserSettings[this.currentAppPage][componentName][settingName]
    ) {
      ret = this.currentUserSettings[this.currentAppPage][componentName][settingName].columnWidths;
    }

    return ret;
  },

  /**
   *   Set current columnWidths.
   *
   *   @method setCurrentColumnWidths
   */
  setCurrentColumnWidths(componentName, settingName, columnWidths) {
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
    Returns  user setting for current appPage from storage.

    @method getUserSettings
    @param {Object} options Parameters for user setting getting.
    @param {String} options.componentName Name of component to search by [optional].
    @param {String} options.settingName Name of setting to search by [optional].
    @return {Object}
   */
  getUserSettings(options) {
    if (!this.get('isUserSettingsServiceEnabled')) {
      return { };
    }

    let methodOptions = Ember.merge({
      componentName: undefined,
      settingName: undefined
    }, options);
    let settingsPromise = this._getExistingSettings(methodOptions);

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
   Deletes given user setting from storage.

   @method deleteUserSetting
   @param {Object} [options] Parameters for user setting getting.
   @param {String} options.moduleName Name of module to search by.
   @param {String} options.settingName Setting name to search by.
   @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>[]} Promises array
   */
  deleteUserSetting(options) {
    if (!this.get('isUserSettingsServiceEnabled')) {
      return new Ember.RSVP.Promise(function(resolve) {
        resolve(undefined);
      });
    }

    let methodOptions = Ember.merge({
      componentName: undefined,
      settingName: undefined
    }, options);

    let componentName = methodOptions.componentName;
    let settingName = methodOptions.settingName;

    Ember.assert('ComponesettNament name is not defined for user setting getting.', componentName);
    Ember.assert('Setting name is not defined for user setting getting.', settingName);

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

    Ember.assert('Component name is not defined for user setting saving.', componentName);
    Ember.assert('User setting data are not defined for user setting saving.', userSetting);
    Ember.assert('Setting name is not defined for user setting saving.', settingName !== undefined);

    if (!(this.currentAppPage in this.currentUserSettings)) {
      this.currentUserSettings[this.currentAppPage] = { };
    }

    if (!(componentName in this.currentUserSettings[this.currentAppPage])) {
      this.currentUserSettings[this.currentAppPage][componentName] = { };
    }

    this.currentUserSettings[this.currentAppPage][componentName][settingName] = userSetting;
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
    let cp = this._getSearchPredicate({ componentName: componentName, settingName: settingName });
    let store = this.get('_store');
    let modelName = 'new-platform-flexberry-flexberry-user-setting';
    let builder = new QueryBuilder(store)
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
    let cp = this._getSearchPredicate({ componentName: componentName, settingName: settingName });
    let store = this.get('_store');
    let modelName = 'new-platform-flexberry-flexberry-user-setting';
    let builder = new QueryBuilder(store)
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
   @param {Object} componentName Component name of looked for record.
   @param {Object} settingName Setting name of looked for record.
   @return {Promise} A promise that returns found record or `undefined` if there is no such setting.
   @private
   */
  _getExistingSettings(methodOptions) {
    // TODO: add search by username.
    let cp = this._getSearchPredicate(methodOptions);
    let store = this.get('_store');
    let modelName = 'new-platform-flexberry-flexberry-user-setting';
    let builder = new QueryBuilder(store)
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

  _getSearchPredicate(methodOptions) {
    let ret;
    let currentUserName = this.getCurrentUser();
    let p1 = new SimplePredicate('appName', 'eq', this.currentAppPage);
    let p2 = new SimplePredicate('userName', 'eq', currentUserName);
    let componentName = methodOptions.componentName;
    let settingName = methodOptions.settingName;
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
