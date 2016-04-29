/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

export default FlexberryBaseComponent.extend({
  actions: {
    choose: function() {
      alert('choosed');
    },
    click(){
      alert('click');
    }
  }
})
