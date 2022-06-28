/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Helper for get array captions of registered enum.

  @class EnumCaptionHelper
  @extends <a href="http://emberjs.com/api/classes/Ember.Helper.html">Ember.Helper</a>
  @public
*/
export default Ember.Helper.extend({
  compute([element]) {
    return Ember.isBlank(element);
  }
});
