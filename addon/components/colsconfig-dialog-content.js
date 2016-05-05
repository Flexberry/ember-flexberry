import Ember from 'ember';
// import layout from '../templates/components/colsconfig-dialog-content';
import FlexberryBaseComponent from './flexberry-base-component';


export default FlexberryBaseComponent.extend({

  init: function() {
    this._super(...arguments);
  },
  
  actions: {
    invertVisibility: function(n) {
      alert('invertVisibility');
    }
  }
//   layout
});
