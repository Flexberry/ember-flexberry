import Ember from 'ember';
const { getOwner } = Ember;
import FlexberryBaseComponent from './flexberry-base-component';

export default FlexberryBaseComponent.extend({

  idPrefix: 'ColDesc',
  modelForDOM: [],
  _userSettingsService: Ember.inject.service('user-settings-service'),
  _router: undefined,

  init: function() {
    this._super(...arguments);
    if (!this.model) {
      return;
    }

    for (let i = 0; i < this.model.length; i++) {
      let colDesc = this.model[i];
      let sortOrder = colDesc.sortOrder;
      if (sortOrder > 0) {
        colDesc.sortOrderAsc = 'selected';
      } else {
        if (sortOrder < 0) {
          colDesc.sortOrderDesc = 'selected';
        } else {
          colDesc.sortOrderdNot = 'selected';
        }
      }

      colDesc.trId = this.idPrefix + 'TR_' + i;
      colDesc.hideId = this.idPrefix + 'Hide_' + i;
      colDesc.sortOrderId = this.idPrefix + 'SortOrder_' + i;
      colDesc.sortPriorityId = this.idPrefix + 'SortPriority_' + i;
      colDesc.rowUpId = this.idPrefix + 'RowUp_' + i;
      colDesc.rowDownId = this.idPrefix + 'RowDown_' + i;
      this.modelForDOM[i] = colDesc;
    }
  },

  actions: {
    invertVisibility: function(n) {
      let element = this._getEventElement('Hide', n);
      let newHideState = !Ember.get(this.model[n], 'hide');
      Ember.set(this.model[n], 'hide', newHideState);
      if (newHideState) {
        element.className = element.className.replace('unhide', 'hide');
        Ember.$(element).parent().siblings('TD').removeClass('disabled');
      } else {
        element.className = element.className.replace('hide', 'unhide');
        Ember.$(element).parent().siblings('TD').addClass('disabled');
      }
    },

    setSortOrder: function(n) {
      let select = this._getEventElement('SortOrder', n);
      let tr = select.parentNode.parentNode;
      let tbody = tr.parentNode;
      let value = select.options.item(select.selectedIndex).value;
      let input = Ember.$(tr).find('input').get(0); //sortPriority field in this row
      let $inputs = Ember.$('input.sortPriority:enabled', tbody); // enabled sortPriority fields
      let SortPriority = 1;
      let index = this._getIndexFromId(input.id);
      if (value === '0') {
        input.value = '';
        input.disabled = true;  // Disable sortPriority field in this row
        input.style.display = 'none'; // Hide sortPriority field in this row
        Ember.set(this.model[index], 'sortPriority', undefined);
        Ember.set(this.model[n], 'sortOrder', undefined);
      } else {
        if (input.disabled) {
          input.disabled = false;
          input.style.display = '';
          if (input.value <= 0) {
            SortPriority = $inputs.length + 1;
            input.value = SortPriority;
            input.prevValue = SortPriority;
          }
        } else {
          SortPriority = input.value;
        }

        Ember.set(this.model[index], 'sortPriority', SortPriority);
        Ember.set(this.model[n], 'sortOrder', parseInt(value));
      }
    },

    setSortPriority: function(n) {
      let eventInput = this._getEventElement('SortPriority', n);
      let newValue = parseInt(eventInput.value);
      let prevValue = eventInput.getAttribute('prevValue');
      let tr = eventInput.parentNode.parentNode;
      let tbody = tr.parentNode;
      let input;
      let inputValue;
      let $inputs = Ember.$('input.sortPriority:enabled', tbody);
      if (isNaN(newValue) || newValue <= 0) {
        newValue = $inputs.length;
      }

      let index = this._getIndexFromId(eventInput.id);
      Ember.set(this.model[index], 'sortPriority', newValue);
      if (prevValue === newValue) {
        return;
      }

      eventInput.value = newValue;
      eventInput.setAttribute('prevValue', newValue);
      let from;
      let to;
      let delta;
      if (prevValue < newValue) {
        from = prevValue;
        to = newValue + 1;
        delta =  -1;
      } else {
        from = newValue - 1;
        to = prevValue;
        delta = 1;
      }

      for (let i = 0; i < $inputs.length; i++) {
        input = $inputs.get(i);
        inputValue = parseInt(input.value);
        if (input !== eventInput && inputValue > from && inputValue < to) {
          inputValue += delta;
          input.value = inputValue;
          input.prevValue = inputValue;
          index = this._getIndexFromId(input.id);
          Ember.set(this.model[index], 'sortPriority', inputValue);
        }
      }
    },

    rowUp: function(n) {
      let eventButton = this._getEventElement('RowUp', n);
      let newTr;
      let tr = eventButton.parentNode.parentNode.parentNode;
      let select = Ember.$(tr).find('SELECT').get(0);
      let selectedIndex = select.selectedIndex;
      let tbody = tr.parentNode;
      let prevTr = Ember.$(tr).prev('TR').get(0);
      if (prevTr) {
        newTr = tr.cloneNode(true);
        tbody.removeChild(tr);
        newTr = tbody.insertBefore(newTr, prevTr);
        select = Ember.$(newTr).find('SELECT').get(0);
        select.selectedIndex = selectedIndex;
      }
    },

    rowDown: function(n) {
      let eventButton = this._getEventElement('RowUp', n);
      var newTr;
      let tr = eventButton.parentNode.parentNode.parentNode;
      let select = Ember.$(tr).find('SELECT').get(0);
      let selectedIndex = select.selectedIndex;
      var tbody = tr.parentNode;
      var nextTr = Ember.$(tr).next('TR').get(0);
      if (nextTr) {
        newTr = tr.cloneNode(true);
        tbody.removeChild(tr);
        if (nextTr.nextSibling) {
          newTr = tbody.insertBefore(newTr, nextTr.nextSibling);
        } else {
          newTr = tbody.appendChild(newTr);
        }

        select = Ember.$(newTr).find('SELECT').get(0);
        select.selectedIndex = selectedIndex;
      }
    },
    apply: function() {
      let trs = Ember.$('#colsConfigtableRows').children('TR');
      let colsConfig = [];
      let colsOrder = [];
      let sortSettings = [];
      for (let i = 0; i < trs.length; i++) {
        let tr = trs[i];
        let index = this._getIndexFromId(tr.id);
        let model = this.model[index];
        colsOrder[i] = { propName: model.propName, hide: model.hide };
        if (model.sortPriority !== undefined) {
          sortSettings[sortSettings.length] = { propName: model.propName, sortOrder: model.sortOrder, sortPriority: model.sortPriority };
        }
      }

      let sortedSettings = sortSettings.sort((a, b) => a.sortPriority - b.sortPriority);
      let sorting = [];
      for (let i = 0; i < sortedSettings.length; i++) {
        let sortedSetting = sortedSettings[i];
        sorting[sorting.length] =  { propName: sortedSetting.propName, direction:  sortedSetting.sortOrder > 0 ? 'asc' : 'desc' };
      }

      colsConfig = { colsOrder: colsOrder, sorting: sorting };
      this._router = getOwner(this).lookup('router:main');
      let moduleName  =   this._router.currentRouteName;
      let savePromise = this.get('_userSettingsService').saveUserSetting({ moduleName: moduleName, settingName: 'DEFAULT', userSetting: colsConfig });
      savePromise.then(
        record => {
          if (this._router.location.location.hash.indexOf('sort=') >= 0) { // sort parameter exist in URL (ugly - TODO find sort in query parameters)
            this._router.router.transitionTo(this._router.currentRouteName, { queryParams: { sort: null } });
          } else {
            this._router.router.refresh();  //Reload current page and records (model) list
          }
        }
      );
      this.sendAction('close', colsConfig);
    }
  },

  _getIndexFromId: function(id) {
    let ret = id.substr(id.lastIndexOf('_') + 1);
    return parseInt(ret);
  },

  _getEventElement: function (prefix, n) {
    let id = '#' + this.idPrefix + prefix + '_' + n;
    let ret = Ember.$.find(id)[0];
    return ret;
  }
});
