/**
  @module ember-flexberry
*/

import Helper from '@ember/component/helper';

/**
  Helper for showing index of an array for a user.

  @class IncreaseNumberHelper
  @extends <a href="http://emberjs.com/api/classes/Ember.Helper.html">Ember.Helper</a>
  @public
*/
export default Helper.extend({
  compute([element]) {
    return ++element;
  }
});
