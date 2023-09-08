import $ from 'jquery';
import { inject as service } from '@ember/service';
import { A, isArray } from '@ember/array';
import { set, get } from '@ember/object';
import FlexberryBaseComponent from '../flexberry-base-component';
import { isNone } from '@ember/utils';

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
   @default service()
   */
  colsConfigMenu: service(),  

  /**
    Service that triggers {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} events.

    @property _groupEditEventsService
    @type Service
    @private
  */
    _groupEditEventsService: service('objectlistview-events'),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: service(),

  /**
    Current store.

    @property store
    @type {Object}
    @default undefined
  */
  store: undefined,

  /**
    Content to be displayed (models collection).

    @property content
    @type DS.ManyArray
    @default null
  */
  content: null,

  init: function() {
    this._super(...arguments);
    if (!this.get('model.colDescs')) {
      return;
    }

    this.set('store', this.get('model.store'));
    this.set('model.colDescs', A(this.get('model.colDescs')));
  },

  didInsertElement: function() {
    this._super(...arguments);
    this.$('.sort-direction-dropdown').each((index, element) => {
      const colDesc = this.get(`model.colDescs.${index}`);
      $(element).dropdown({
        onChange: (value) => {
          this.send('setSortOrder', colDesc, value);
        }
      });
      $(element).dropdown('set selected', get(colDesc, 'sortOrder'));
    });
  },

  /**
    Client-side sorting for groupEdit content.

    @method sortRecords
    @param {Array} records Records for sorting.
    @param {Object} sortDef Sorting definition.
    @param {Int} start First index in records.
    @param {Int} end Last index in records.
    @return {Array} Sorted records.
  */
    sortRecords(records, sortDef, start, end) {
      let recordsSort = records;
      if (start >= end) {
        return recordsSort;
      }
  
      // Form hash array (there can be different observers on recordsSort changing, so it is better to minimize such changes).
      let hashArray = [];
      for (let i = start; i <= end; i++) {
        let currentRecord = recordsSort.objectAt(i);
        let currentHash = currentRecord.get(sortDef.attributePath || sortDef.propName);
        let hashStructure = {
          record: currentRecord,
          hash: currentHash
        };
  
        hashArray.push(hashStructure);
      }
  
      let hashArrayLength = hashArray.length;
  
      // Compare record with number koef1 and koef2.
      // It returns true if records should be exchanged.
      let condition = function(koef1, koef2) {
        let firstProp = hashArray[koef1].hash;
        let secondProp = hashArray[koef2].hash;
        if (sortDef.direction === 'asc') {
          return isNone(secondProp) && !isNone(firstProp) ? true : firstProp > secondProp;
        }
  
        if (sortDef.direction === 'desc') {
          return !isNone(secondProp) && isNone(firstProp) ? true : firstProp < secondProp;
        }
  
        return false;
      };
  
      // Sort with minimum exchanges.
      for(let i = 0; i < hashArrayLength; i++) {
        // Find minimum in right not sorted part.
        let min = i;
        for(let j = i + 1; j < hashArrayLength; j++) {
          if(condition(min, j)) {
            min = j;
          }
        }
        if (min != i) {
          // Exchange current with minimum.
          let tmp = hashArray[i];
          hashArray[i] = hashArray[min];
          hashArray[min] = tmp;
        }
      }
  
      // Remove unsorted part.
      recordsSort.removeAt(start, end - start + 1);
  
      // Insert sorted elements.
      for (let i = start; i <= end; i++) {
        recordsSort.insertAt(i, hashArray[i-start].record);
      }
  
      return recordsSort;
    },

  actions: {
    /**
    Sorting records and trigger `geSortApply` action.

    @method sortingFunction
  */
    sortingFunction() {
      let records = this.get('content.content');
      let sorting = this._getSettings().sorting || [];
      if (isArray(records) && records.length > 1) {
        if (sorting.length === 0) {
          sorting = [{ propName: 'id', direction: 'asc' }];
        }

        for (let i = 0; i < sorting.length; i++) {
          let sort = sorting[i];
          if (i === 0) {
            records = this.sortRecords(records, sort, 0, records.length - 1);
          } else {
            let index = 0;
            for (let j = 1; j < records.length; j++) {
              for (let sortIndex = 0; sortIndex <  i; sortIndex++) {
                if (records.objectAt(j).get(sorting[sortIndex].propName) !== records.objectAt(j - 1).get(sorting[sortIndex].propName)) {
                  records = this.sortRecords(records, sort, index, j - 1);
                  index = j;
                  break;
                }
              }
            }

            records = this.sortRecords(records, sort, index, records.length - 1);
          }
        }

        this.set('content.content', records);
      }

      let componentName = this.get('model.componentName');
      this.get('_groupEditEventsService').geSortApplyTrigger(componentName, sorting);
      
      this.get('_groupEditEventsService').setGeSortTrigger(componentName, sorting, this.get('model.colDescs'));

      this.get('close')();
    },

    /**
     Set sort order and priority for column.

     @method actions.setSortOrder
     @param {Object} colDesc Column description object.
     @param {String} value Selected value.
     */
    setSortOrder: function(colDesc, value) {
      if (colDesc.sortOrder !== parseInt(value)) {
        if (value === '0') {
          set(colDesc, 'sortPriority', undefined);
          set(colDesc, 'sortOrder', undefined);
        } else {
          if (isNone(colDesc.sortPriority)) {
            let max = 0;
            this.get('model.colDescs').filter(c => {
              let sortPriority = parseInt(c.sortPriority);
              if (max < sortPriority) {
                max = sortPriority;
              }
            });
            set(colDesc, 'sortPriority', max + 1);
          }

          set(colDesc, 'sortOrder', parseInt(value));
        }
      }
    },
  },

  _getSettings: function() {
    let colsOrder = [];
    let sortSettings = [];

    let colDescs = this.get('model.colDescs');
    colDescs.forEach((colDesc) => {
      colsOrder.push({ propName: colDesc.propName, name: colDesc.name.toString() });
      if (!isNone(colDesc.sortPriority)) {
        sortSettings.push({ propName: colDesc.propName, sortOrder: colDesc.sortOrder, sortPriority: colDesc.sortPriority });
      }
    }, this);

    sortSettings = sortSettings.sort((a, b) => a.sortPriority - b.sortPriority);
    sortSettings = sortSettings.map((s) => { return { propName: s.propName, direction:  s.sortOrder > 0 ? 'asc' : 'desc' }; });

    let colsConfig = { colsOrder: colsOrder, sorting: sortSettings };
    
    return colsConfig;
  }
});
