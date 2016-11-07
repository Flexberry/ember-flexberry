import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
const { getOwner } = Ember;
const _idPrefix = 'ColDesc';

/**
 * Columns configuration dialog Content component.
 *
 * @class ColsconfigDialogContentComponent
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   Columns configiration menu.

   @property colsConfigMenu
   @type {Class}
   @default Ember.inject.service()
   */
  colsConfigMenu: Ember.inject.service(),

  /**
   Model with added DOM elements.

   @property modelForDOM
   @type {Object}
   @default '[]'
   */
  modelForDOM: [],

  /**
   ObjectListView component name.
   *
   @property componentName
   @type {String}
   @default ''
   */
  componentName: '',

  /**
   ObjectListView setting name.
   *
   @property settingName
   @type {String}
   @default ''
   */
  settingName: '',

  /**
   changed flag.
   *
   @property isChanged
   @type {Boolean}
   @default false
   */
  _isChanged: false,

  /**
   Flag. If true, store columns width.

   @property saveColWidthState
   @type {Boolean}
   @default false
   */
  saveColWidthState: false,

  init: function() {
    this._super(...arguments);
    this.modelForDOM = [];
    if (!this.model || !('colDescs' in this.model)) {
      return;
    }

    this.settingName = this.model.settingName;
    this.componentName = this.model.componentName;
    let colDescs = this.model.colDescs;
    for (let i = 0; i < colDescs.length; i++) {
      let colDesc = colDescs[i];
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

      if ('columnWidth' in colDesc) {
        this.saveColWidthState = true;
      }

      colDesc.trId = _idPrefix + 'TR_' + i;
      colDesc.hideId = _idPrefix + 'Hide_' + i;
      colDesc.sortOrderId = _idPrefix + 'SortOrder_' + i;
      colDesc.sortPriorityId = _idPrefix + 'SortPriority_' + i;
      colDesc.columnWidthId = _idPrefix + 'ColumnWidth_' + i;
      colDesc.rowUpId = _idPrefix + 'RowUp_' + i;
      colDesc.rowDownId = _idPrefix + 'RowDown_' + i;
      this.modelForDOM[i] = colDesc;
    }
  },

  didRender: function() {
    let firstButtonUp = Ember.$('#ColDescRowUp_0');
    firstButtonUp.addClass('disabled'); // Disable first button up
    let lastButtondown = Ember.$('#ColDescRowDown_' + (this.modelForDOM.length - 1));
    lastButtondown.addClass('disabled'); // Disable last button down
  },

  actions: {
    /**
     Invert column visibility (On/Off)

     @method actions.invertVisibility
     @param {Int} n  column number (id suffix)
     */
    invertVisibility: function(n) {
      let element = this._getEventElement('Hide', n); // clicked DOM-element
      let newHideState = !Ember.get(this.model.colDescs[n], 'hide'); // Invert Hide/Unhide state from model.colDescs
      Ember.set(this.model.colDescs[n], 'hide', newHideState); // Set new state in model.colDescs
      if (newHideState) { // Hide element
        element.className = element.className.replace('unhide', 'hide');  // Change picture
        Ember.$(element).parent().siblings('TD').addClass('disabled'); // Disable row
      } else {
        element.className = element.className.replace('hide', 'unhide');  // Change picture
        Ember.$(element).parent().siblings('TD').removeClass('disabled');  // Enaable row
      }

      this._changed();
    },

    /**
     Set sort order for column: descending ascending, none) and eneble/disable sort priority

     @method actions.setSortOrder
     @param {Int} n  column number (id suffix)
     */
    setSortOrder: function(n) {
      let select = this._getEventElement('SortOrder', n); // changed select DOM-element
      let $tr = Ember.$(select).parents('tr');  // TR DOM-element
      let $tbody = Ember.$(select).parents('tbody');  // TBODY DOM-element
      let value = select.options.item(select.selectedIndex).value;  // Chosen sort order
      let input = Ember.$($tr).find('input').get(0); //sortPriority field in this row
      let $inputs = Ember.$('input.sortPriority:enabled', $tbody); // enabled sortPriority fields
      let SortPriority = 1;
      let index = this._getIndexFromId(input.id);
      if (value === '0') {  // Disable sorting?
        input.value = '';
        input.disabled = true;  // Disable sortPriority field in this row
        input.style.display = 'none'; // Hide sortPriority field in this row
        Ember.set(this.model.colDescs[index], 'sortPriority', undefined);
        Ember.set(this.model.colDescs[n], 'sortOrder', undefined);
      } else {
        if (input.disabled) { // SortPriority disabled
          input.disabled = false;  // Enable SortPriority field in this row
          input.style.display = 'block'; // Show SortPriority field in this row
          if (input.value <= 0) { //Sort priority not set
            SortPriority = $inputs.length + 1;  //Set current maximim
            input.value = SortPriority;
            input.prevValue = SortPriority; //remember previous value
          }
        } else {  // SortPriority enabled
          SortPriority = input.value;
        }

        Ember.set(this.model.colDescs[index], 'sortPriority', SortPriority); // Remember values in model.colDescs
        Ember.set(this.model.colDescs[n], 'sortOrder', parseInt(value));
      }

      this._changed();
    },

    /**
     Set sort priority for column

     @method actions.setSortPriority
     @param {Int} n  column number (id suffix)
     */
    setSortPriority: function(n) {
      let eventInput = this._getEventElement('SortPriority', n);  // changed input DOM-element
      let newValue = parseInt(eventInput.value);  //New value
      let prevValue = eventInput.getAttribute('prevValue'); // Previous value
      let $tbody = Ember.$(eventInput).parents('tbody');  // TBODY DOM-element
      let input;
      let inputValue;
      let $inputs = Ember.$('input.sortPriority:enabled', $tbody); // enabled sortPriority fields
      if (isNaN(newValue) || newValue <= 0) { //new Value incorrectly setAttribute
        newValue = $inputs.length;  // Set last value
      }

      let index = this._getIndexFromId(eventInput.id);  // get index of initial order  (if  columns order is changed n!=index )
      Ember.set(this.model.colDescs[index], 'sortPriority', newValue); // set new sortPriority value
      if (prevValue === newValue) { //value not changed
        return;
      }

      eventInput.value = newValue;  // value changed - set new
      eventInput.setAttribute('prevValue', newValue); //Remember value as prevoius

      //Reorder sortPriority values for values in interval prevValue <-> newValue
      let from; // From sortPriority value
      let to; // To sortPriority value
      let delta;  // shift value
      if (prevValue < newValue) { // prevoious value is lower
        from = prevValue;
        to = newValue + 1;
        delta =  -1;  // Decrement values in interval
      } else {
        from = newValue - 1;
        to = prevValue;
        delta = 1;  // Increment values in interval
      }

      for (let i = 0; i < $inputs.length; i++) {  //for each inputs
        input = $inputs.get(i);
        inputValue = parseInt(input.value);
        if (input !== eventInput && inputValue > from && inputValue < to) { // Value in interval
          inputValue += delta;
          input.value = inputValue; // Decrement/Increment value
          input.prevValue = inputValue; // Remeber previous value
          index = this._getIndexFromId(input.id); // get index of initial order
          Ember.set(this.model.colDescs[index], 'sortPriority', inputValue); // Set computed value
        }
      }

      this._changed();
    },

    /**
     Increase column in list (exchange previous column)

     @method actions.rowUp
     @param {Int} n  column number (id suffix)
     */
    rowUp: function(n) {
      let eventButton = this._getEventElement('RowUp', n);
      let newTr;
      let tr = Ember.$(eventButton).parents('tr').get(0);  // TR DOM-element
      let select = Ember.$(tr).find('SELECT').get(0);
      let selectedIndex = select.selectedIndex; // selected index of sort order
      var tbody = Ember.$(eventButton).parents('tbody').get(0);   // TBODY DOM-element
      let prevTr = Ember.$(tr).prev('TR').get(0); // Previous TR DOM-element
      if (prevTr) { // Previous TR exist
        newTr = tbody.removeChild(tr);
        newTr = tbody.insertBefore(newTr, prevTr);
        select = Ember.$(newTr).find('SELECT').get(0);
        select.selectedIndex = selectedIndex; // Reset selected index of sort order
        Ember.$(newTr).find('BUTTON').eq(1).removeClass('disabled');
        Ember.$(prevTr).find('BUTTON').eq(0).removeClass('disabled');
        if (Ember.$(newTr).prev('TR').length === 0) {  //First row
          Ember.$(newTr).find('BUTTON').eq(0).addClass('disabled');
        }

        if (Ember.$(prevTr).next('TR').length === 0) {  //Last row
          Ember.$(prevTr).find('BUTTON').eq(1).addClass('disabled');
        }
      }

      this._changed();
    },

    /**
     Decrease column in list (exchange  next column)

     @method actions.rowDown
     @param {Int} n  column number (id suffix)
     */
    rowDown: function(n) {
      let eventButton = this._getEventElement('RowDown', n);
      var newTr;
      let tr = Ember.$(eventButton).parents('tr').get(0);  // TR DOM-element
      let select = Ember.$(tr).find('SELECT').get(0);
      let selectedIndex = select.selectedIndex; // selected index of sort order
      var tbody = Ember.$(eventButton).parents('tbody').get(0);   // TBODY DOM-element
      var nextTr = Ember.$(tr).next('TR').get(0); // Next TR DOM-element
      if (nextTr) { // Next TR exist
        newTr = tbody.removeChild(tr);  // Exchange TR's
        if (Ember.$(nextTr).next('TR').length === 0) {  //Last row
          newTr = tbody.appendChild(newTr);
          Ember.$(newTr).find('BUTTON').eq(1).addClass('disabled');
        } else {  // last row
          newTr = tbody.insertBefore(newTr, nextTr.nextSibling);
        }

        if (Ember.$(nextTr).prev('TR').length === 0) {  //First row
          Ember.$(nextTr).find('BUTTON').eq(0).addClass('disabled');
        }

        select = Ember.$(newTr).find('SELECT').get(0);
        select.selectedIndex = selectedIndex; // Reset selected index of sort order
        Ember.$(newTr).find('BUTTON').eq(0).removeClass('disabled');
        Ember.$(nextTr).find('BUTTON').eq(1).removeClass('disabled');
      }

      this._changed();
    },

    /**
     Apply settings specified in the interface as DEFAULT values

     @method actions.apply
     */
    apply: function() {
      let colsConfig = this._getSettings();
      let settingName =  Ember.$('#columnConfigurtionSettingName')[0].value.trim();
      if (settingName.length > 0 && this._isChanged && !confirm(this.get('i18n').t('components.colsconfig-dialog-content.use-without-save') + settingName)) {
        return;
      }

      //Save colsConfig in userSettings as DEFAULT
      let router = getOwner(this).lookup('router:main');
      let savePromise = this._getSavePromise(undefined, colsConfig);
      savePromise.then(
        record => {
          if (router.location.location.hash.indexOf('sort=') >= 0) { // sort parameter exist in URL (ugly - TODO find sort in query parameters)
            router.router.transitionTo(router.currentRouteName, { queryParams: { sort: null } }); // Show page without sort parameters
          } else {
            router.router.refresh();  //Reload current page and records (model) list
          }
        }
      );
      this.sendAction('close', colsConfig); // close modal window
    },
    /**
     Save named settings specified in the interface as named values

     @method actions.saveColsSetting
     */
    saveColsSetting: function() {
      let settingName =  Ember.$('#columnConfigurtionSettingName')[0].value.trim();
      if (settingName.length <= 0) {
        alert(this.get('i18n').t('components.colsconfig-dialog-content.enter-setting-name'));
        return;
      }

      let colsConfig = this._getSettings();
      let savePromise = this._getSavePromise(settingName, colsConfig);
      this.get('colsConfigMenu').addNamedSettingTrigger(settingName);
      savePromise.then(
        record => {
          alert(this.get('i18n').t('components.colsconfig-dialog-content.setting') +
            settingName +
            this.get('i18n').t('components.colsconfig-dialog-content.is-saved'));
          Ember.$('#columnConfigurtionButtonSave')[0].className += ' disabled';
        },
        error => {
          alert(this.get('i18n').t('components.colsconfig-dialog-content.have-errors') + JSON.stringify(error));
        }
      );
    },

    /**
     Column width is changed

     @method actions.widthChanged
     */
    widthChanged: function() {
      this._changed();
    },

    /**
     Config name is defined

     @method actions.setConfigName
     */
    setConfigName: function() {
      this._changed();
    },

  },

  _getSavePromise: function(settingName, colsConfig) {
    return this.get('userSettingsService').saveUserSetting(this.componentName, settingName, colsConfig);
  },

  _getSettings: function() {
    let trs = Ember.$('#colsConfigtableRows').children('TR');
    let colsConfig = [];
    let colsOrder = [];
    let sortSettings = [];
    let widthSetting = [];

    //Set sortSettings and colsOrder array
    for (let i = 0; i < trs.length; i++) {  // Iterate TR list
      let tr = trs[i];
      let index = this._getIndexFromId(tr.id);  // get index of initial (model) order
      let colDesc = this.model.colDescs[index];  // Model for this tr
      colsOrder[i] = { propName: colDesc.propName, hide: colDesc.hide };  //Set colsOrder element
      if (colDesc.sortPriority !== undefined) { // Sort priority defined
        sortSettings[sortSettings.length] = { propName: colDesc.propName, sortOrder: colDesc.sortOrder, sortPriority: colDesc.sortPriority }; //Add sortSetting element
      }

      if (this.saveColWidthState) {
        let colWidthElement = this._getEventElement('ColumnWidth', index);
        let width = parseInt(colWidthElement.value, 10);
        if (width !== isNaN && width >= 0) {
          widthSetting[widthSetting.length] = { propName: colDesc.propName, width: width };
        }
      }
    }

    let sortedSettings = sortSettings.sort((a, b) => a.sortPriority - b.sortPriority);  // Sort sortSettings
    let sorting = [];
    for (let i = 0; i < sortedSettings.length; i++) { // produce sorting array
      let sortedSetting = sortedSettings[i];
      sorting[sorting.length] =  { propName: sortedSetting.propName, direction:  sortedSetting.sortOrder > 0 ? 'asc' : 'desc' };
    }

    colsConfig = { colsOrder: colsOrder, sorting: sorting };  // Set colsConfig Object
    if (this.saveColWidthState) {
      colsConfig.columnWidths = widthSetting;
    }

    return colsConfig;
  },

  _getIndexFromId: function(id) {
    let ret = id.substr(id.lastIndexOf('_') + 1);
    return parseInt(ret);
  },

  _getEventElement: function (prefix, n) {
    let id = '#' + _idPrefix + prefix + '_' + n;
    let ret = Ember.$.find(id)[0];
    return ret;
  },

  _changed: function() {
    this._isChanged = true;
    Ember.$('#columnConfigurtionButtonUse')[0].className = Ember.$('#columnConfigurtionButtonUse')[0].className.replace('disabled', '');
    Ember.$('#columnConfigurtionButtonSave')[0].className = Ember.$('#columnConfigurtionButtonSave')[0].className.replace('disabled', '');
  }
});
