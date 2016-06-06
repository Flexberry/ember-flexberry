import Ember from 'ember';
const { getOwner } = Ember;
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Columns configuration dialog Content component.
 *
 * @class ColsconfigDialogContentComponent
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({

  _idPrefix: 'ColDesc',
  _userSettingsService: Ember.inject.service('user-settings-service'),
  _router: undefined,
  /**
   * model with
   *
   * @property modelForDOM
   * @type Object[]
   * @default 'APP.components.flexberryCheckbox'
   */
  modelForDOM: [],

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

      colDesc.trId = this._idPrefix + 'TR_' + i;
      colDesc.hideId = this._idPrefix + 'Hide_' + i;
      colDesc.sortOrderId = this._idPrefix + 'SortOrder_' + i;
      colDesc.sortPriorityId = this._idPrefix + 'SortPriority_' + i;
      colDesc.rowUpId = this._idPrefix + 'RowUp_' + i;
      colDesc.rowDownId = this._idPrefix + 'RowDown_' + i;
      this.modelForDOM[i] = colDesc;
    }
  },

  actions: {
    /**
     * Invert column visibility (On/Off)
     *
     * @method actions.invertVisibility
     * @param {Int} n  column number (id suffix)
     */
    invertVisibility: function(n) {
      let element = this._getEventElement('Hide', n); // clicked DOM-element
      let newHideState = !Ember.get(this.model[n], 'hide'); // Invert Hide/Unhide state from model
      Ember.set(this.model[n], 'hide', newHideState); // Set new state in model
      if (newHideState) { // Hide element
        element.className = element.className.replace('unhide', 'hide');  // Change picture
        Ember.$(element).parent().siblings('TD').removeClass('disabled'); // Disable row
      } else {
        element.className = element.className.replace('hide', 'unhide');  // Change picture
        Ember.$(element).parent().siblings('TD').addClass('disabled');  // Enaable row
      }
    },

    /**
     * Set sort order for column: descending ascending, none) and eneble/disable sort priority
     *
     * @method actions.setSortOrder
     * @param {Int} n  column number (id suffix)
     */
    setSortOrder: function(n) {
      let select = this._getEventElement('SortOrder', n); // changed select DOM-element
      let tr = select.parentNode.parentNode;  // TR DOM-element
      let tbody = tr.parentNode;  // TBODY DOM-element
      let value = select.options.item(select.selectedIndex).value;  // Chosen sort order
      let input = Ember.$(tr).find('input').get(0); //sortPriority field in this row
      let $inputs = Ember.$('input.sortPriority:enabled', tbody); // enabled sortPriority fields
      let SortPriority = 1;
      let index = this._getIndexFromId(input.id);
      if (value === '0') {  // Disable sorting?
        input.value = '';
        input.disabled = true;  // Disable sortPriority field in this row
        input.style.display = 'none'; // Hide sortPriority field in this row
        Ember.set(this.model[index], 'sortPriority', undefined);
        Ember.set(this.model[n], 'sortOrder', undefined);
      } else {
        if (input.disabled) { // SortPriority disabled
          input.disabled = false;  // Enable SortPriority field in this row
          input.style.display = ''; // Show SortPriority field in this row
          if (input.value <= 0) { //Sort priority not set
            SortPriority = $inputs.length + 1;  //Set current maximim
            input.value = SortPriority;
            input.prevValue = SortPriority; //remember previous value
          }
        } else {  // SortPriority enabled
          SortPriority = input.value;
        }

        Ember.set(this.model[index], 'sortPriority', SortPriority); // Remember values in model
        Ember.set(this.model[n], 'sortOrder', parseInt(value));
      }
    },

    /**
     * Set sort priority for column
     *
     * @method actions.setSortPriority
     * @param {Int} n  column number (id suffix)
     */
    setSortPriority: function(n) {
      let eventInput = this._getEventElement('SortPriority', n);  // changed input DOM-element
      let newValue = parseInt(eventInput.value);  //New value
      let prevValue = eventInput.getAttribute('prevValue'); // Previous value
      let tr = eventInput.parentNode.parentNode;  // TR DOM-element
      let tbody = tr.parentNode;  // TBODY DOM-element
      let input;
      let inputValue;
      let $inputs = Ember.$('input.sortPriority:enabled', tbody); // enabled sortPriority fields
      if (isNaN(newValue) || newValue <= 0) { //new Value incorrectly setAttribute
        newValue = $inputs.length;  // Set last value
      }

      let index = this._getIndexFromId(eventInput.id);  // get index of initial order  (if  columns order is changed n!=index )
      Ember.set(this.model[index], 'sortPriority', newValue); // set new sortPriority value
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
          Ember.set(this.model[index], 'sortPriority', inputValue); // Set computed value
        }
      }
    },

    /**
     * Increase column in list (exchange previous column)
     *
     * @method actions.rowUp
     * @param {Int} n  column number (id suffix)
     */
    rowUp: function(n) {
      let eventButton = this._getEventElement('RowUp', n);
      let newTr;
      let tr = eventButton.parentNode.parentNode.parentNode;  // TR DOM-element
      let select = Ember.$(tr).find('SELECT').get(0);
      let selectedIndex = select.selectedIndex; // selected index of sort order
      let tbody = tr.parentNode;  // TBODY DOM-element
      let prevTr = Ember.$(tr).prev('TR').get(0); // Previous TR DOM-element
      if (prevTr) { // Previous TR exist
        newTr = tr.cloneNode(true); // Exchange TR's
        tbody.removeChild(tr);
        newTr = tbody.insertBefore(newTr, prevTr);
        select = Ember.$(newTr).find('SELECT').get(0);
        select.selectedIndex = selectedIndex; // Reset selected index of sort order
      }
    },

    /**
     * Decrease column in list (exchange  next column)
     *
     * @method actions.rowDown
     * @param {Int} n  column number (id suffix)
     */
    rowDown: function(n) {
      let eventButton = this._getEventElement('RowUp', n);
      var newTr;
      let tr = eventButton.parentNode.parentNode.parentNode;  // TR DOM-element
      let select = Ember.$(tr).find('SELECT').get(0);
      let selectedIndex = select.selectedIndex; // selected index of sort order
      var tbody = tr.parentNode;   // TBODY DOM-element
      var nextTr = Ember.$(tr).next('TR').get(0); // Next TR DOM-element
      if (nextTr) { // Next TR exist
        newTr = tr.cloneNode(true); // Exchange TR's
        tbody.removeChild(tr);
        if (nextTr.nextSibling) { // Not last column
          newTr = tbody.insertBefore(newTr, nextTr.nextSibling);
        } else {  // last column
          newTr = tbody.appendChild(newTr);
        }

        select = Ember.$(newTr).find('SELECT').get(0);
        select.selectedIndex = selectedIndex; // Reset selected index of sort order
      }
    },

    /**
     * Apply settings specified in the interface as DEFAULT values
     *
     * @method actions.apply
     */
    apply: function() {
      let trs = Ember.$('#colsConfigtableRows').children('TR');
      let colsConfig = [];
      let colsOrder = [];
      let sortSettings = [];

      //Set sortSettings and colsOrder array
      for (let i = 0; i < trs.length; i++) {  // Iterate TR list
        let tr = trs[i];
        let index = this._getIndexFromId(tr.id);  // get index of initial (model) order
        let model = this.model[index];  // Model for this tr
        colsOrder[i] = { propName: model.propName, hide: model.hide };  //Set colsOrder element
        if (model.sortPriority !== undefined) { // Sort priority defined
          sortSettings[sortSettings.length] = { propName: model.propName, sortOrder: model.sortOrder, sortPriority: model.sortPriority }; //Add sortSetting element
        }
      }

      let sortedSettings = sortSettings.sort((a, b) => a.sortPriority - b.sortPriority);  // Sort sortSettings
      let sorting = [];
      for (let i = 0; i < sortedSettings.length; i++) { // produce sorting array
        let sortedSetting = sortedSettings[i];
        sorting[sorting.length] =  { propName: sortedSetting.propName, direction:  sortedSetting.sortOrder > 0 ? 'asc' : 'desc' };
      }

      //Save colsConfig in userSettings
      colsConfig = { colsOrder: colsOrder, sorting: sorting };  // Set colsConfig Object
      this._router = getOwner(this).lookup('router:main');
      let moduleName  =   this._router.currentRouteName;
      let savePromise = this.get('_userSettingsService').saveUserSetting({ moduleName: moduleName, settingName: 'DEFAULT', userSetting: colsConfig });
      savePromise.then(
        record => {
          if (this._router.location.location.hash.indexOf('sort=') >= 0) { // sort parameter exist in URL (ugly - TODO find sort in query parameters)
            this._router.router.transitionTo(this._router.currentRouteName, { queryParams: { sort: null } }); // Show page without sort parameters
          } else {
            this._router.router.refresh();  //Reload current page and records (model) list
          }
        }
      );
      this.sendAction('close', colsConfig); // close modal window
    }
  },

  _getIndexFromId: function(id) {
    let ret = id.substr(id.lastIndexOf('_') + 1);
    return parseInt(ret);
  },

  _getEventElement: function (prefix, n) {
    let id = '#' + this._idPrefix + prefix + '_' + n;
    let ret = Ember.$.find(id)[0];
    return ret;
  }
});
