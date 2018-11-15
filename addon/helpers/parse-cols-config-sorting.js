/**
  @module ember-flexberry
*/

import Ember from 'ember';

export default Ember.Helper.extend({
  compute(sorting) {
    switch (sorting) {
      case '1':
        return '▲';
      case '-1':
        return '▼';
      default:
        return '-';
    }
  }
});
