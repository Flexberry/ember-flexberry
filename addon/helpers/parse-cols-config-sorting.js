/**
  @module ember-flexberry
*/

import Helper from '@ember/component/helper';

export default Helper.extend({
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
