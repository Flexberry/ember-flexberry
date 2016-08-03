/**
  @module ember-flexberry
*/

import Ember from 'ember';
const { getOwner } = Ember;
import { enumCaptions } from 'ember-flexberry-data/utils/enum-functions';

/**
  Helper for get array captions of registered enum.

  @class EnumCaptionHelper
  @extends <a href="http://emberjs.com/api/classes/Ember.Helper.html">Ember.Helper</a>
  @public
*/
export default Ember.Helper.extend({
  compute([enumName]) {
    let enumInstance = getOwner(this).lookup('enum:' + enumName);
    return enumCaptions(enumInstance);
  }
});
