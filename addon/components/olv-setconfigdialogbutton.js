/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

//var FlexberrySetConfogDialog = FlexberryBaseComponent.extend({
export default FlexberryBaseComponent.extend({
  actions: {
    choose: function() {
      alert('choosed');
      this.get('choose')();
    }
  }
});
