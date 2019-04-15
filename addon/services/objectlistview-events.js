/**
  @module ember-flexberry
 */

import Ember from 'ember';
import { BasePredicate } from 'ember-flexberry-data/query/predicate';

/**
  Service for triggering objectlistview events.

  @class ObjectlistviewEvents
  @extends Ember.Service
  @uses Ember.Evented
  @public
 */
export default Ember.Service.extend(Ember.Evented, {

  /**
    Current set of selected records for all list components.

    @property _selectedRecords
    @type Array
    @private
  */
  _selectedRecords: undefined,

  /**
    Init service.

    @method init
  */
  init() {
    this._super(...arguments);
    this.set('_selectedRecords', []);
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
    Trigger for "filter by any match" event in objectlistview.

    @method filterByAnyMatchTrigger

    @param {String} componentName The name of objectlistview component
    @param {String} pattern The pattern to match attributes values
  */
  filterByAnyMatchTrigger(componentName, pattern) {
    this.trigger('filterByAnyMatch', componentName, pattern);
  },

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
    if (count > 0 || !Ember.isNone(recordWithKey)) {
      if (!this.get('_selectedRecords')[componentName]) {
        this.get('_selectedRecords')[componentName] = Ember.Map.create();
      }

      if (checked) {
        this.get('_selectedRecords')[componentName].set(recordWithKey.key, recordWithKey);
      } else
      {
        this.get('_selectedRecords')[componentName].delete(recordWithKey.key);
      }
    }

    this.trigger('olvRowSelected', componentName, record, count, checked, recordWithKey);
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
    Current limit function for OLV.

    @property currentLimitFunction
    @type BasePredicate
    @default undefined
  */
  currentLimitFunction: undefined,

  /**
    Form's loading state.

    @property loadingState
    @type string
  */
  loadingState: Ember.computed.deprecatingAlias('appState.state', { id: 'service.app-state', until: '1.0.0' }),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: Ember.inject.service(),

  /**
    Sets current limit function for OLV.

    @method setLimitFunction

    @param {BasePredicate} limitFunction Current limit function.
  */
  setLimitFunction(limitFunction) {
    this.set('currentLimitFunction', limitFunction instanceof BasePredicate ? limitFunction : undefined);
  },

  /**
    Gets current limit function for OLV.

    @method getLimitFunction
    @return {BasePredicate} Current limit function.
  */
  getLimitFunction() {
    return this.get('currentLimitFunction');
  },

  /**
    Method that sets the form's loading state.
    This method is deprecated, use {{#crossLink "AppStateService"}}app state service{{/crossLink}}.

    @method setLoadingState
    @param {String} loadingState Loading state for set.
  */
  setLoadingState(loadingState) {
    Ember.deprecate('This method is deprecated, use app state service.', false, {
      id: 'service.app-state',
      until: '1.0.0',
    });

    switch (loadingState) {
      case 'loading':
        this.get('appState').loading();
        break;

      case 'success':
        this.get('appState').success();
        break;

      case 'error':
        this.get('appState').error();
        break;

      case 'warning':
        this.get('appState').warning();
        break;

      case '':
        this.get('appState').reset();
        break;

      default:
        throw new Error(`Unknown state: '${loadingState}'.`);
    }
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
    if (this.get('_selectedRecords')[componentName] &&
    this.get('_selectedRecords')[componentName].clear &&
    typeof this.get('_selectedRecords')[componentName].clear === 'function') {
      this.get('_selectedRecords')[componentName].clear();
    }
  }
});
