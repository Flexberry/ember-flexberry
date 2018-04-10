/**
  @module ember-flexberry
*/

import Helper from '@ember/component/helper';
import { getOwner } from '@ember/application';
import { enumCaptions } from 'ember-flexberry-data/utils/enum-functions';

/**
  Helper for get array captions of registered enum.

  @class EnumCaptionHelper
  @extends <a href="http://emberjs.com/api/classes/Ember.Helper.html">Ember.Helper</a>
  @public
*/
export default Helper.extend({
  compute([enumName]) {
    let enumInstance = getOwner(this).lookup('enum:' + enumName);
    return enumCaptions(enumInstance);
  }
});
