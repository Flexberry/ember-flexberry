import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
const { getOwner } = Ember;


export default FlexberryBaseComponent.extend({

  idPrefix:'ColDesc',
  _userSettingsService: Ember.inject.service('user-settings-service'),
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
      let SortPriority=0;
      if (value=='0') {
        input.value='';
        input.disabled=true;
        input.style.display='none';
      } else {
        if (!input.disabled) return;
        input.disabled=false;
        input.style.display='';
        if (input.value<=0) {
          SortPriority=inputs.length+1;
          input.value=SortPriority;
          input.prevValue=SortPriority;
        }
      }
      let index=this._getIndexFromId(input.id);
      Ember.set(this.model[index],'sortPriority',SortPriority);
      Ember.set(this.model[n],'sortOrder',parseInt(value));
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
      let index=this._getIndexFromId(eventInput.id);
      Ember.set(this.model[index],'sortPriority',newValue);
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
          index=this._getIndexFromId(input.id);
          Ember.set(this.model[index],'sortPriority',inputValue);
        }
      }
    },

    rowUp: function(n) {
      let eventButton=this._getEventElement('RowUp',n);
      let newTr,tr=eventButton.parentNode.parentNode.parentNode;
      let select=$(tr).find('SELECT').get(0);
      let selectedIndex=select.selectedIndex;
      let tbody=tr.parentNode;
      let prevTr=$(tr).prev('TR').get(0);
      if (prevTr) {
        newTr=tr.cloneNode(true);
        tbody.removeChild(tr);
        newTr=tbody.insertBefore(newTr,prevTr);
        select=$(newTr).find('SELECT').get(0);
        select.selectedIndex=selectedIndex;
      }
    },

    rowDown: function(n) {
      let eventButton=this._getEventElement('RowUp',n);
      var newTr,tr=eventButton.parentNode.parentNode.parentNode;
      let select=$(tr).find('SELECT').get(0);
      let selectedIndex=select.selectedIndex;
      var tbody=tr.parentNode;
      var nextTr=$(tr).next('TR').get(0);
      //      alert(tr.id+ ' ' + tbody.tagName + ' before=' + nextTr.id);
      if (nextTr) {
        newTr=tr.cloneNode(true);
        tbody.removeChild(tr);
        if (nextTr.nextSibling) {
          newTr=tbody.insertBefore(newTr,nextTr.nextSibling);
        } else {
          newTr=tbody.appendChild(newTr);
        }
        select=$(newTr).find('SELECT').get(0);
        select.selectedIndex=selectedIndex;
      }
    },
    apply: function() {
//       alert('apply');
      let currentRoute=getOwner(this).lookup("router:main").get('currentRouteName');
      let trs=$('#colsConfigtableRows').children('TR');
      let colsConfig=[];
      let colsOrder=[];
      let sortSettings=[];
      for (let i=0;i<trs.length;i++) {
        let tr=trs[i];
        let index=this._getIndexFromId(tr.id);
        let model=this.model[index];
        colsOrder[i]={propName:model.propName,hide:model.hide};
        if ('sortPriority' in model) {
          sortSettings[sortSettings.length]={propName:model.propName,sortOrder:model.sortOrder,sortPriority:model.sortPriority};
        }
      }
      let sortedSettings=sortSettings.sort((a,b) => a.sortPriority-b.sortPriority);
      let sorting=[];
      for (let i=0;i<sortedSettings.length;i++) {
        let sortedSetting=sortedSettings[i];
        sorting[sorting.length]= {propName:sortedSetting.propName,direction: sortedSetting.sortOrder < 0 ? 'asc': 'desc'};
      }
      colsConfig={colsOrder:colsOrder,sorting:sorting};
      alert(' colsConfig=' +JSON.stringify(colsConfig));
      let moduleName = getOwner(this).lookup('router:main').currentRouteName;
      this.get('_userSettingsService').saveUserSetting({moduleName:moduleName,settingName:'DEFAULT',userSetting:colsConfig});
      this.sendAction('close',colsConfig);
    }
  },

  _getIndexFromId: function(id) {
    let ret=id.substr(id.lastIndexOf('_')+1);
    return parseInt(ret);
  },


  _getEventElement:function (prefix,n) {
    let id='#'+this.idPrefix+prefix+'_'+n;
    let ret=Ember.$.find(id).get(0);
    return ret;
  }
});
