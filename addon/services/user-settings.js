/**
  @module ember-flexberry
*/

import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { SimplePredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

/**
  Service to store/read user settings to/from application storage.

  @class UserSettingsService
  @extends <a href="http://emberjs.com/api/classes/Ember.Service.html">Ember.Service</a>
*/
export default Ember.Service.extend({
  /**
    Ember data store.

    @private
    @property _store
    @type DS.Store
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
      moduleName: undefined,
      settingName: undefined
    }, options);

    let moduleName = methodOptions.moduleName;
    let settingName = methodOptions.settingName;

    Ember.assert('Module name is not defined for user setting getting.', moduleName);
    Ember.assert('Setting name is not defined for user setting getting.', settingName);

    return this._deleteExistingRecord(moduleName, settingName);
  },

  /**
    Saves given user setting to storage.

    @method saveUserSetting
    @param {Object} [options] Options.
    @param {String} options.moduleName Name of module for what setting is saved.
    @param {String} options.userSetting User setting data to save.
    @param {String} options.settingName Setting name to save as.
    @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>} Save operation promise.
  */
  saveUserSetting(options) {
    if (!this.get('isUserSettingsServiceEnabled')) {
      return new Ember.RSVP.Promise((resolve, reject) => {resolve();});
    }

    let methodOptions = Ember.merge({
      moduleName: undefined,
      userSetting: undefined,
      settingName: undefined
    }, options);

    let moduleName = methodOptions.moduleName;
    let userSetting = methodOptions.userSetting;
    let settingName = methodOptions.settingName;

    Ember.assert('Module name is not defined for user setting saving.', moduleName);
    Ember.assert('User setting data are not defined for user setting saving.', userSetting);
    Ember.assert('Setting name is not defined for user setting saving.', settingName);

    let store = this.get('_store');
    let ret = this._getExistingRecord(moduleName, settingName).then(
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
          foundRecord.set('moduleName', moduleName);
          foundRecord.set('settName', settingName);
          foundRecord.set('userName', currentUserName);
          foundRecord.set('txtVal', JSON.stringify(userSetting));
        }

        return foundRecord.save();
      });
    return ret;
  },

  /**
    Returns user setting from storage.

    @method getUserSetting
    @param {Object} [options] Parameters for user setting getting.
    @param {String} options.moduleName Name of module to search by.
    @param {String} options.settingName Setting name to search by.
    @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>} A promise that returns founded
    result or `undefined` if there is no such setting.
  */
  getUserSetting(options) {
    if (!this.get('isUserSettingsServiceEnabled')) {
      return new Ember.RSVP.Promise((resolve) => {
        resolve(undefined);
      });
    }

    let methodOptions = Ember.merge({
      moduleName: undefined,
      settingName: undefined
    }, options);

    let moduleName = methodOptions.moduleName;
    let settingName = methodOptions.settingName;

    Ember.assert('Module name is not defined for user setting getting.', moduleName);
    Ember.assert('Setting name is not defined for user setting getting.', settingName);

    return this._getExistingRecord(moduleName, settingName).then(
      (foundRecord) => {
        if (foundRecord) {
          let userSettingValue = foundRecord.get('txtVal');
          if (userSettingValue) {
            return JSON.parse(userSettingValue);
          }
        }

        return undefined;
      }
    );
  },

  /**
    Returns all user settings, related to a given module, from storage.

    @method getUserSettings
    @param {Object} [options] Parameters for user setting getting.
    @param {String} options.moduleName Name of module to search by.
    @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>} A promise that returns founded
    settings as following JSON: { <settingname>: <settingValue> }.
  */
  getUserSettings(options) {
    if (!this.get('isUserSettingsServiceEnabled')) {
      return new Ember.RSVP.Promise((resolve) => {
        resolve(undefined);
      });
    }

    let methodOptions = Ember.merge({
      moduleName: undefined,
    }, options);
    let moduleName = methodOptions.moduleName;
    Ember.assert('Module name is not defined for user setting getting.', moduleName);
    return this._getExistingRecords(moduleName).then(
      foundRecords => {
        let ret = {};
        if (foundRecords) {
          for (let i = 0; i < foundRecords.length; i++) {
            let foundRecord = foundRecords[i];
            let userSettingValue = foundRecord.record.get('txtVal');
            let settName  = foundRecord.record.get('settName');
            if (userSettingValue && settName) {
              ret[settName] = JSON.parse(userSettingValue);
            }
          }
        }

        return ret;
      }
    );
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
    Deletes user settings record.

    @private
    @method _deleteExistingRecord
    @param {Object} moduleName Module name of looked for record.
    @param {String} settingName Setting name of looked for record.
    @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>[]} Promises array
  */
  _deleteExistingRecord: function(moduleName, settingName) {
    // TODO: add search by username.
    let currentUserName = this.getCurrentUser();
    let p1 = new SimplePredicate('userName', 'eq', currentUserName);
    let p2 = new SimplePredicate('moduleName', 'eq', moduleName);
    let p3 = new SimplePredicate('settName', 'eq', settingName);
    let cp = new ComplexPredicate('and', p1, p2, p3);
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

    @private
    @method _getExistingRecord
    @param {Object} moduleName Module name of looked for record.
    @param {String} settingName Setting name of looked for record.
    @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>} A promise that returns founded record
    or `undefined` if there is no such setting.
  */
  _getExistingRecord(moduleName, settingName) {
    // TODO: add search by username.
    let currentUserName = this.getCurrentUser();
    let p1 = new SimplePredicate('userName', 'eq', currentUserName);
    let p2 = new SimplePredicate('moduleName', 'eq', moduleName);
    let p3 = new SimplePredicate('settName', 'eq', settingName);
    let cp = new ComplexPredicate('and', p1, p2, p3);
    let store = this.get('_store');
    let modelName = 'new-platform-flexberry-flexberry-user-setting';
    let builder = new QueryBuilder(store)
      .from(modelName)
      .selectByProjection('FlexberryUserSettingE')
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

    @private
    @method _getExistingRecord
    @param {Object} moduleName Module name of looked for record.
    @return {Promise} A promise that returns found record or `undefined` if there is no such setting.
  */
  _getExistingRecords(moduleName) {
    // TODO: add search by username.
    let currentUserName = this.getCurrentUser();
    let p1 = new SimplePredicate('userName', 'eq', currentUserName);
    let p2 = new SimplePredicate('moduleName', 'eq', moduleName);
    let cp = new ComplexPredicate('and', p1, p2);
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
  }
});
