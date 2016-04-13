/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Service to work with authentication and authorization throught plugin `ember-simple-auth`.
 *
 * @class FlexberryEmberSimpleAuthService
 * @extends Ember.Service
 * @public
 */
export default Ember.Service.extend({
  /**
   * Store to get adapter where auth elements are placed.
   *
   * @property _store
   * @type Service
   */
  _store: Ember.inject.service('store'),

  /**
   * Adapter where auth elements are placed.
   *
   * @property _store
   * @type DS.Adapter
   */
  _adapter: Ember.computed('_store', function() {
    return this.get('_store').adapterFor('application');
  }),

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
    let methodOptions = Ember.merge({
      xhr: undefined,
      element: undefined
    }, options);

    let xhr = methodOptions.xhr;
    Ember.assert('Some parameters for flexberry-ember-simple-auth-service are not defined.', xhr);

    let adapter = this.get('_adapter');
    let authorizer = adapter.get('authorizer');
    let session = adapter.get('session');
    session.authorize(authorizer, (headerName, headerValue) => {
      xhr.setRequestHeader(headerName, headerValue);
    });

    return options;
  }
});
