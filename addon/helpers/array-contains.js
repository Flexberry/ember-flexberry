/**
  @module ember-flexberry
*/

import Helper from '@ember/component/helper';
import { isNone } from '@ember/utils';

export default Helper.extend({
  compute([array, element]) {
    if (!isNone(element)) {
      return array.indexOf(element) >= 0;
    }

    return false;
  }
});
