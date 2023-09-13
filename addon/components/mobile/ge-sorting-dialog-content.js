import $ from 'jquery';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
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

  actions: {
    /**
    Sorting records and trigger `geSortApply` action.

    @method sortingFunction
  */
    sortingFunction() {
      let sorting = this._getSettings().sorting || [];
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
