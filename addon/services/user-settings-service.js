/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Service to work with user settings on server.
 *
 * @class DetailInterationService
 * @extends Ember.Service
 * @public
 */
export default Ember.Service.extend({
  // TODO: read from config.
  /**
   * Url to request user settings service.
   *
   * @property userSettingServiceUrl
   * @type String
   * @default ``
   */
  userSettingServiceUrl:'',

  /**
   * It saves user settings.
   *
   * @method saveUserSetting
   * @public
   *
   * @param {Object} [options] Options.
   * @param {String} options.moduleName Name of module for what setting is saved.
   * @param {String} options.userSetting User setting data to save.
   * @param {String} options.settingName Setting name to save as.
   */
  saveUserSetting: function(options) {
    let methodOptions = Ember.merge({
      moduleName: undefined,
      userSetting: undefined,
      settingName: undefined
    }, options);

    let userSettingServiceUrl = this.get('userSettingServiceUrl');
    let moduleName = methodOptions.moduleName;
    let userSetting = methodOptions.userSetting;
    let settingName = methodOptions.settingName;

    Ember.assert('Url of user settings service is not defined.', userSettingServiceUrl);
    Ember.assert('Module name is not defined for user setting saving.', moduleName);
    Ember.assert('User setting data are not defined for user setting saving.', userSetting);
    Ember.assert('Setting name is not defined for user setting saving.', settingName);

    let ajaxCallParameter = {
      moduleName: moduleName,
      userSetting: userSetting,
      settingName: settingName
    };

    Ember.$.ajax(userSettingServiceUrl + '?' + Ember.$.param(ajaxCallParameter))
    .fail(function(jqXHR, textStatus, errorThrown) {
      Ember.Logger.error(
        `There was an error during saving user setting '${settingName}' for module '${moduleName}': '${errorThrown}'.`);
    });
  },

  /**
   * It gets user setting from server by setting's and module's names.
   *
   * @method getUserSetting
   *
   * @param {Object} [options] Parameters for user setting getting.
   * @param {String} options.moduleName Name of module to search by.
   * @param {String} options.settingName Setting name to search by.
   * @return {Promise} A promise. It will be resoled when a result from server will be returned.
   */
  getUserSetting: function(options) {
    let methodOptions = Ember.merge({
      moduleName: undefined,
      settingName: undefined
    }, options);

    let userSettingServiceUrl = this.get('userSettingServiceUrl');
    let moduleName = methodOptions.moduleName;
    let settingName = methodOptions.settingName;

    Ember.assert('Url of user settings service is not defined.', userSettingServiceUrl);
    Ember.assert('Module name is not defined for user setting getting.', moduleName);
    Ember.assert('Setting name is not defined for user setting getting.', settingName);

    let ajaxCallParameter = {
      moduleName: moduleName,
      settingName: settingName
    };

    let ajaxPromise = Ember.$.ajax(userSettingServiceUrl + '?' + Ember.$.param(ajaxCallParameter))
    .fail(function(jqXHR, textStatus, errorThrown) {
      Ember.Logger.error(
        `There was an error during getting user setting '${settingName}' for module '${moduleName}': '${errorThrown}'.`);
    });

    return ajaxPromise;
  }
});
