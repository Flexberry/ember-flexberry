/**
  @module ember-flexberry
*/

import Ember from 'ember';

export default Ember.Helper.extend({
  compute([array, element]) {
    if (!Ember.isNone(element)) {
      return array.indexOf(element) >= 0;
    }

    return false;
  }
});
