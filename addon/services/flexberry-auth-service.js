/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Service to work with authentication and authorization.
 * It is a wrapper for real used service which is set on applied part.

 Example:
 ```js
 // app/initializers/auth-initializer.js
 import Ember from 'ember';
 import FlexberryAuthService from 'ember-flexberry/services/flexberry-auth-service';

 export function initialize(application) {
   FlexberryAuthService.reopen({
     currentAuthService: Ember.inject.service('flexberry-ember-simple-auth-service')
   });
 }

 export default {
   name: 'auth-initializer',
   initialize
 };
 ```

 * @class FlexberryAuthService
 * @extends Ember.Service
 * @public
 */
export default Ember.Service.extend({
  /**
   * Flag: indicates whether to use flexberry auth service (if `true`) or not (if `false`).
   * This flag is readed from config setting `APP.flexberryAuthService` and can be changed programatically later.
   *
   * @property isFlexberryAuthServiceEnabled
   * @public
   * @type Boolean
   * @default false
   */
  isFlexberryAuthServiceEnabled: false,

  /**
   * Service to call auth methods.
   * If this service is not defined, stub is executed.
   *
   * @property currentAuthService
   * @type Service
   * @default undefined
   */
  currentAuthService: undefined,

  /**
   * It updates custom xhr before send in order to add necessary auth information.
   *
   * @method authCustomRequest
   * @param {Object} [options] Request parameters.
   * @param {Object} options.xhr Xhr to send.
   * @param {Object} options.element Current element which is going to request.
   * @return {Object} Updated method parameters.
   */
  authCustomRequest: function(options) {
    let currentAuthService = this.get('currentAuthService');
    if (!this.get('isFlexberryAuthServiceEnabled') || !currentAuthService) {
      return options;
    }

    return currentAuthService.authCustomRequest(options);
  }
});
