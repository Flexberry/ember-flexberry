/**
  @module ember-flexberry
 */

import Service from '@ember/service';
import Evented from '@ember/object/evented';
import EmberObject, { computed } from '@ember/object';
import { isNone } from '@ember/utils';
import { inject as service } from '@ember/service';
import { BasePredicate } from 'ember-flexberry-data/query/predicate';

/**
  Service for triggering objectlistview events.

  @class ObjectlistviewEvents
  @extends Service
  @uses Evented
  @public
 */
export default Service.extend(Evented, {

  /**
    Current set of selected records for all list components.

    @property _selectedRecords
    @type Array
    @private
  */
  _selectedRecords: undefined,

  /**
    Current model projection columns with available filters.

    @property _olvFilterColumnsArray
    @type Object
    @private
  */
  _olvFilterColumnsArray: computed(() => ({})),

  /**
    Init service.

    @method init
  */
  init() {
    this._super(...arguments);
    this.set('_selectedRecords', []);
    this.set('_multiRows', []);
  },

  /**
    Returns a list of selected rows from component.

    @method getMultiSelectedRecords
  */
  getMultiSelectedRecords(componentName) {
    return this.get('_multiRows')[componentName];
  },

  /**
    Removes all rows from list of selected rows from component.

    @method clearMultiSelectedRecords
  */
  clearMultiSelectedRecords() {
    this.set('_multiRows', []);
  },

  /**
    Remembers all selected rows to keep them when page is changing.

    @method holdMultiSelectedRecords
  */
  holdMultiSelectedRecords(componentName) {
    if (!this.get('_multiRows')[componentName]) {
      this.get('_multiRows')[componentName] = {};
    }

    const multiRows = Object.keys(this.getSelectedRecords(componentName) || {});
    multiRows.forEach((key) => {
      this.get('_multiRows')[componentName][multiRows[key]] = key;
    });
  },

  /**
    Trigger for "add new row" event in objectlistview.
    Event name: olvAddRow.

    @method addRowTrigger

    @param {String} componentName The name of objectlistview component
  */
  addRowTrigger(componentName) {
    this.trigger('olvAddRow', componentName);
  },

  /**
    Trigger for "delete current row" event in objectlistview.
    Event name: olvDeleteRow.

    @method deleteRowTrigger

    @param {String} componentName The name of objectlistview component
    @param {Boolean} immediately Flag to delete record immediately
  */
  deleteRowTrigger(componentName, immediately) {
    this.trigger('olvDeleteRow', componentName, immediately);
  },

  /**
    Trigger for "delete selected rows" event in objectlistview.
    Event name: olvDeleteRows.

    @method deleteRowsTrigger

    @param {String} componentName The name of objectlistview component
    @param {Boolean} immediately Flag to delete record immediately
  */
  deleteRowsTrigger(componentName, immediately) {
    this.trigger('olvDeleteRows', componentName, immediately);
  },

  /**
    Trigger for "delete all rows on all pages" event in objectlistview.
    Event name: olvDeleteAllRows.

    @method deleteAllRowsTrigger

    @param {String} componentName The name of objectlistview component
    @param {Object} filterQuery Filter applying before delete all records on all pages
  */
  deleteAllRowsTrigger(componentName, filterQuery) {
    this.trigger('olvDeleteAllRows', componentName, filterQuery);
  },

  /**
    Trigger for "refresh list" event in OLV component.

    @method refreshListTrigger
    @param {String} componentName The name of OLV component.
  */
  refreshListTrigger(componentName) {
    this.trigger('refreshList', componentName);
  },

  /**
    Trigger for "refresh list" event in OLV component by name.

    @method refreshListOnlyTrigger
    @param {String} componentName The name of OLV component.
  */
  refreshListOnlyTrigger(componentName) {
    this.trigger('refreshListOnly', componentName);
  },

  /**
    Trigger for "filter by any match" event in objectlistview.

    @method filterByAnyMatchTrigger

    @param {String} componentName The name of objectlistview component
    @param {String} pattern The pattern to match attributes values
  */
  filterByAnyMatchTrigger(componentName, pattern) {
    this.trigger('filterByAnyMatch', componentName, pattern);
  },

  /**
    Set of rows for multiselect function in groupedit.

    @property _multiRows
    @type Array
    @default null
  */
  _multiRows: null,

  /**
    Trigger for "new row has been added" event in objectlistview.
    Event name: olvRowAdded.

    @method rowAddedTrigger

    @param {String} componentName The name of objectlistview component
    @param {DS.Model} record The model corresponding to added row in objectlistview
  */
  rowAddedTrigger(componentName, record) {
    this.trigger('olvRowAdded', componentName, record);
  },

  /**
    Trigger for "row has been deleted" event in objectlistview.
    Event name: olvRowDeleted.

    @method rowDeletedTrigger

    @param {String} componentName The name of objectlistview component
    @param {DS.Model} record The model corresponding to deleted row in objectlistview
    @param {Boolean} immediately Flag to show if record was deleted immediately
  */
  rowDeletedTrigger(componentName, record, immediately) {
    this.trigger('olvRowDeleted', componentName, record, immediately);
  },

  /**
    Trigger for "selected rows has been deleted" event in objectlistview.
    Event name: groupEditRowDeleted.

    @method rowDeletedTrigger

    @param {String} componentName The name of objectlistview component
    @param {Number} count Count of deleted rows in objectlistview
    @param {Boolean} immediately Flag to show if records were deleted immediately
  */
  rowsDeletedTrigger(componentName, count, immediately) {
    this.trigger('olvRowsDeleted', componentName, count, immediately);
  },

  /**
    Trigger for "row has been selected" event in objectlistview.
    Event name: olvRowSelected.

    @method rowSelectedTrigger

    @param {String} componentName The name of objectlistview component
    @param {DS.Model} record The model corresponding to selected row in objectlistview
    @param {Number} count Count of selected rows in objectlistview
    @param {Boolean} checked Current state of row in objectlistview (checked or not)
    @param {Object} recordWithKey The model wrapper with additional key corresponding to selected row
  */
  rowSelectedTrigger(componentName, record, count, checked, recordWithKey) {
    if (!this.get('_multiRows')[componentName]) {
      this.get('_multiRows')[componentName] = {};
    }

    if (recordWithKey) {
      if (checked) {
        this.get('_multiRows')[componentName][recordWithKey.key] = recordWithKey;
      } else {
        delete this.get('_multiRows')[componentName][recordWithKey.key];
      }
    }

    if (count > 0 || !isNone(recordWithKey)) {
      if (!this.get('_selectedRecords')[componentName]) {
        this.get('_selectedRecords')[componentName] = {};
      }

      if (checked) {
        this.get('_selectedRecords')[componentName][recordWithKey.key] = recordWithKey;
      } else
      {
        delete this.get('_selectedRecords')[componentName][recordWithKey.key];
      }
    }

    this.trigger('olvRowSelected', componentName, record, count, checked, recordWithKey);
  },

  /**
    Creates records with all remembered multiselected rows.

    @method restoreSelectedRecords
  */
  restoreSelectedRecords(componentName) {
    if (!this.get('_multiRows')[componentName]) {
      this.get('_multiRows')[componentName] = {};
    }

    const multiRows = Object.keys(this.get('_multiRows')[componentName] || {});
    multiRows.forEach((key) => {
      let recordWithKey = EmberObject.create({});
      recordWithKey.set('key', multiRows[key]);
      recordWithKey.set('data', key.data);
      this.get('_selectedRecords')[componentName].set(multiRows[key], recordWithKey);
    });
  },

  /**
    Trigger for "model(s) corresponding to some row(s) was changed" event in objectlistview.
    Event name: olvRowsChanged.

    @method rowsChangedTrigger

    @param {String} componentName The name of objectlistview component
  */
  rowsChangedTrigger(componentName) {
    this.trigger('olvRowsChanged', componentName);
  },

  /**
    Trigger for "reset filters" event in simpleolv.
    Event name: resetFilters.

    @method resetFiltersTrigger

    @param {String} componentName The name of simpleolv component.
  */
  resetFiltersTrigger(componentName) {
    this.trigger('resetFilters', componentName);
  },

  /**
    Trigger for "setSorting" event in route.
    Event name: setSorting.

    @method setSortingTrigger

    @param {String} componentName The name of object-list-view component.
    @param {Array} sorting Array of sorting definitions.
  */
  setSortingTrigger(componentName, sorting = []) {
    this.trigger('setSorting', componentName, sorting);
  },

  /**
    Trigger for "setGeSort" event in route.
    Event name: setGeSort.

    @method setGeSortTrigger

    @param {String} componentName The name of object-list-view component.
    @param {Array} sorting Array of sorting definitions.
    @param {Array} colDescs Array column descriptions.
  */
  setGeSortTrigger(componentName, sorting, colDescs) {
    this.trigger('setGeSort', componentName, sorting, colDescs);
  },


  /**
    Trigger for "setDefaultGeSort" event in route.
    Event name: setDefaultGeSort.

    @method setDefaultGeSortTrigger

    @param {Array} colDescs Array column descriptions.
  */
  setDefaultGeSortTrigger(colDescs) {
    this.trigger('setDefaultGeSort', colDescs);
  },
  /**
    Trigger for "geSortApply" event in object-list-view.
    Event name: geSortApply.

    @method geSortApplyTrigger

    @param {String} componentName The name of object-list-view component.
    @param {Array} sorting Array of sorting definitions.
  */
  geSortApplyTrigger(componentName, sorting) {
    this.trigger('geSortApply', componentName, sorting);
  },

  /**
    Trigger for "updateWidth" event in object-list-view.
    Event name: updateWidth.

    @method updateWidthTrigger

    @param {String} componentName The name of object-list-view component
    (can be undefined for update all components widths).
  */
  updateWidthTrigger(componentName) {
    this.trigger('updateWidth', componentName);
  },

  /**
    Trigger for "selectAll" event in object-list-view.
    Event name: updateSelectAll.

    @method updateSelectAll

    @param {String} componentName The name of object-list-view component
    @param {Boolean} selectAllParameter Flag to specify if all records should be selected or unselected.
    @param {Boolean} skipConfugureRows Flag to specify if configuring rows needs to be skipped.
  */
  updateSelectAllTrigger(componentName, selectAllParameter, skipConfugureRows) {
    if (!selectAllParameter) {
      this.clearSelectedRecords(componentName);
    }

    this.trigger('updateSelectAll', componentName, selectAllParameter, skipConfugureRows);
  },

  /**
    Trigger for "moveRowTrigger" event in objectlistview.
    Event name: moveRow.

    @method moveRowTrigger

    @param {String} componentName The name of objectlistview component
    @param {Integer} shift Shift for rows
  */
  moveRowTrigger(componentName, shift) {
    this.trigger('moveRow', componentName, shift);
  },

  /**
    Method to fire the `filterConditionChanged` event.

    @method filterConditionChangedTrigger
    @param {String} componentName The name of the component relative to which the event occurred.
    @param {Object} filter Object with the filter description.
    @param {String} newValue The new value of the filter condition.
    @param {String} oldvalue The old value of the filter condition.
  */
  filterConditionChangedTrigger(componentName, filter, newValue, oldvalue) {
    this.trigger('filterConditionChanged', componentName, filter, newValue, oldvalue);
  },

  /**
    Current limit functions for OLV by componentNames.

    @property currentLimitFunctions
    @type Object
    @default {}
  */
  currentLimitFunctions: computed(function () { return {}; }).readOnly(),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: service(),

  /**
    Sets current limit function for OLV.

    @method setLimitFunction

    @param {BasePredicate} limitFunction Current limit function.
    @param {String} componentName Component name.
  */
  setLimitFunction(limitFunction, componentName) {
    this.get('currentLimitFunctions')[componentName] = limitFunction instanceof BasePredicate ? limitFunction : undefined;
  },

  /**
    Gets current limit function for OLV.

    @method getLimitFunction
    @param {String} componentName Component name.
    @return {BasePredicate} Current limit function.
  */
  getLimitFunction(componentName) {
    return this.get('currentLimitFunctions')[componentName];
  },

  /**
    Saves the set of columns with filters for the `flexberry-objectlistview` component.

    @method setOlvFilterColumnsArray
    @param {String} componentName The name of the component for which you want to save filters.
    @param {Object[]} columns The set of columns with filters.
  */
  setOlvFilterColumnsArray(componentName, columns) {
    this.get('_olvFilterColumnsArray')[componentName] = columns;
  },

  /**
    Returns the set of columns with filters saved for the `flexberry-objectlistview` component.

    @method getOlvFilterColumnsArray
    @param {String} componentName The name of the component for which you want to get filters.
    @return {Object[]} The set of columns with filters.
  */
  getOlvFilterColumnsArray(componentName) {
    return this.get('_olvFilterColumnsArray')[componentName];
  },

  /**
    Returns map with previously saved selected records for OLV component with specified name.

    @method getSelectedRecords

    @param {String} componentName The name of OLV component.
    @return {Ember.Map} Selected records for OLV component.
  */
  getSelectedRecords(componentName) {
    return this.get('_selectedRecords')[componentName];
  },

  /**
    Clears set of previously saved selected records for OLV component with specified name.

    @method clearSelectedRecords

    @param {String} componentName The name of OLV component.
  */
  clearSelectedRecords(componentName) {
    if (this.get('_selectedRecords')[componentName]) {
      this.get('_selectedRecords')[componentName] = {};
    }
  },

  /**
    Triggers when edit record dialog was created.

    @method editRecordDialogHiddenTrigger
  */
  editRecordDialogCreatedTrigger() {
    this.trigger('editRecordDialogCreated');
  },

  /**
    Triggers when edit record dialog was hidden.

    @method editRecordDialogHiddenTrigger
  */
  editRecordDialogHiddenTrigger() {
    this.trigger('editRecordDialogHidden');
  },
});
