import Ember from 'ember';
// import layout from '../templates/components/colsconfig-dialog-content';
import FlexberryBaseComponent from './flexberry-base-component';


export default FlexberryBaseComponent.extend({

  modelForDOM:[],

  init: function() {
    this._super(...arguments);
    for (let i=0;i<this.model.length;i++) {
      let colDesc=this.model[i];
      let sortOrder=colDesc.sortOrder;
      if (sortOrder<0) {
        colDesc.orderdesc='selected';
      } else {
        if (sortOrder>0) {
          colDesc.orderasc='selected';
        } else {
          colDesc.orderdnot='selected';
        }
      }
      this.modelForDOM[i]=colDesc;
    }
    alert(JSON.stringify(this.modelForDOM));
  },

  actions: {
    invertVisibility: function(n) {
      var element=this._getEventElement('ColDescHide',n);
      let newHideState=!Ember.get(this.model[n],'hide');
      Ember.set(this.model[n],'hide',newHideState);
      if (newHideState) {
        element.className=element.className.replace('unhide','hide');
      } else {
        element.className=element.className.replace('hide','unhide');
      }
    }
  },

  _getEventElement:function (prefix,n) {
      let id='#'+prefix+'_'+n;
      let ret=Ember.$.find(id).get(0);
      return ret;
  }
});
