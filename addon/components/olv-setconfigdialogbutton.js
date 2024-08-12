/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

export default FlexberryBaseComponent.extend({
  actions: {
    choose: function() {
      alert('choosed');
      this.get('choose')();
    }
  }
});
