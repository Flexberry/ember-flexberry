/**
  @module ember-flexberry
*/

import Helper from '@ember/component/helper';
import { isBlank } from '@ember/utils';

/**
  Helper for get array captions of registered enum.

  @class EnumCaptionHelper
  @extends <a href="http://emberjs.com/api/classes/Ember.Helper.html">Ember.Helper</a>
  @public
*/
export default Helper.extend({
  compute([element]) {
    return isBlank(element);
  }
});
