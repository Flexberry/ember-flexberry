import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';


export default FlexberryBaseComponent.extend({

  idPrefix:'ColDesc',
  modelForDOM:[],

  init: function() {
    this._super(...arguments);
    for (let i=0;i<this.model.length;i++) {
      let colDesc=this.model[i];
      let sortOrder=colDesc.sortOrder;
      if (sortOrder<0) {
        colDesc.sortOrderDesc='selected';
      } else {
        if (sortOrder>0) {
          colDesc.sortOrderAsc='selected';
        } else {
          colDesc.sortOrderdNot='selected';
        }
      }
      colDesc.trId=this.idPrefix + 'TR_' + i;
      colDesc.hideId=this.idPrefix + 'Hide_' + i;
      colDesc.sortOrderId=this.idPrefix + 'SortOrder_' + i;
      colDesc.sortPriorityId=this.idPrefix + 'SortPriority_' + i;
      colDesc.rowUpId=this.idPrefix + 'RowUp_' + i;
      colDesc.rowDownId=this.idPrefix + 'RowDown_' + i;
      this.modelForDOM[i]=colDesc;
    }
//     alert(JSON.stringify(this.modelForDOM));
  },

  actions: {
    invertVisibility: function(n) {
      let element=this._getEventElement('Hide',n);
      let newHideState=!Ember.get(this.model[n],'hide');
      Ember.set(this.model[n],'hide',newHideState);
      if (newHideState) {
        element.className=element.className.replace('unhide','hide');
        $(element).parent().siblings('TD').removeClass('disabled');
      } else {
        element.className=element.className.replace('hide','unhide');
        $(element).parent().siblings('TD').addClass('disabled');
      }
    },

    setSortOrder: function(n) {
      let select=this._getEventElement('SortOrder',n);
      let tr=select.parentNode.parentNode;
      let tbody=tr.parentNode;
      let value=select.options.item(select.selectedIndex).value;
      let input=$(tr).find('input').get(0);
      let inputs=$('input.sortPriority:enabled',tbody);
      if (value=='-') {
        input.value='';
        input.disabled=true;
        input.style.display='none';
      } else {
        if (!input.disabled) return;
        input.disabled=false;
        input.style.display='';
        if (input.value<=0) {
          input.value=inputs.length+1;
          input.prevValue=inputs.length+1;
        }
      }
    },

    setSortPriority: function(n) {
      let eventInput=this._getEventElement('SortPriority',n);
      let newValue=parseInt(eventInput.value);
      let prevValue=eventInput.getAttribute("prevValue");
      let tr=eventInput.parentNode.parentNode;
      let tbody=tr.parentNode;
      let input,inputValue,inputs=$('input.sortPriority:enabled',tbody);
      if (isNaN(newValue) || newValue<=0) {
        newValue=inputs.length;
      }
      if (prevValue==newValue) return;
      eventInput.value=newValue;
      eventInput.setAttribute("prevValue",newValue);
      let from,to,delta;
      if (prevValue < newValue) {
        from=prevValue;
        to=newValue+1;
        delta= -1;
      } else {
        from=newValue-1;
        to=prevValue;
        delta=1;
      }
  //      alert(from+'-'+to + ' +='+delta);
      for (let i=0;i<inputs.length;i++) {
        input=inputs.get(i);
        inputValue=parseInt(input.value);
        if (input!==eventInput && inputValue > from && inputValue < to) {
          inputValue+=delta;
          input.value=inputValue;
          input.prevValue=inputValue;
        }
      }
    },

    rowUp: function(n) {
      let eventButton=this._getEventElement('RowUp',n);
      let newTr,tr=eventButton.parentNode.parentNode.parentNode;
      let tbody=tr.parentNode;
      let prevTr=$(tr).prev('TR').get(0);
      if (prevTr) {
        newTr=tr.cloneNode(true);
        tbody.removeChild(tr);
        tbody.insertBefore(newTr,prevTr);
      }
    },

    rowDown: function(n) {
      let eventButton=this._getEventElement('RowUp',n);
      var newTr,tr=eventButton.parentNode.parentNode.parentNode;
      var tbody=tr.parentNode;
      var nextTr=$(tr).next('TR').get(0);
      //      alert(tr.id+ ' ' + tbody.tagName + ' before=' + nextTr.id);
      if (nextTr) {
        newTr=tr.cloneNode(true);
        tbody.removeChild(tr);
        if (nextTr.nextSibling) {
          tbody.insertBefore(newTr,nextTr.nextSibling);
        } else {
          tbody.appendChild(newTr);
        }
      }
    }
  },


  _getEventElement:function (prefix,n) {
    let id='#'+this.idPrefix+prefix+'_'+n;
    let ret=Ember.$.find(id).get(0);
    return ret;
  }
});
