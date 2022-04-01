/**
 * @module ember-flexberry
 */

import Service from  '@ember/service';
import { set } from '@ember/object';
import { getOwner } from '@ember/application';

const EMBER_VALIDATIONS_VALIDATORS = [
  'absence',
  'acceptance',
  'confirmation',
  'exclusion',
  'format',
  'inclusion',
  'length',
  'numericality',
  'presence',
];

/**
 * This service allows you to use addons `ember-validations` and `ember-cp-validations` at the same time in your application.
 * Add this service with `validations` name in your application.
 *
 * @example
 * ```
 * // app/services/validations.js
 * export { default } from 'ember-flexberry/services/compatibility-validations';
 * ```
 *
 * @class CompatibilityValidationsService
 */
export default Service.extend({
  init() {
    this._super(...arguments);

    const owner = getOwner(this);
    set(this, 'cache', EMBER_VALIDATIONS_VALIDATORS.reduce((cache, validatorName) => {
      cache[validatorName] = owner.resolveRegistration(`ember-validations@validator:local/${validatorName}`);

      return cache;
    }, {}));
  },
});
