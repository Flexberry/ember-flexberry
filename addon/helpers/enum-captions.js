/**
 * @module ember-flexberry
 */

import Ember from 'ember';
const { getOwner } = Ember;
import { enumCaptions } from '../utils/enum-functions';

/**
 * Helper for get array captions of registered enum
 */
export default Ember.Helper.extend({
  compute([enumName]) {
    let enumInstance = getOwner(this).lookup('enum:' + enumName);
    return enumCaptions(enumInstance);
  }
});
