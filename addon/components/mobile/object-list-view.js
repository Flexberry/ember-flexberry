/**
  @module ember-flexberry
*/

import { assert } from '@ember/debug';
import { computed  } from '@ember/object';
import ObjectListViewComponent from '../object-list-view';

/**
  Mobile version of {{#crossLink "ObjectListViewComponent"}}{{/crossLink}} (with mobile-specific defaults).

  @class Mobile.ObjectListViewComponent
  @extends ObjectListViewComponent
*/
export default ObjectListViewComponent.extend({
  /**
    Flag indicates whether allow to resize columns (if `true`) or not (if `false`).

    @property allowColumnResize
    @type Boolean
    @default false
  */
  allowColumnResize: false,

  /**
    Default cell component that will be used to display values in single column.

    @property {Object} singleColumnCellComponent
    @property {String} [singleColumnCellComponent.componentName='object-list-view-single-column-cell']
    @property {String} [singleColumnCellComponent.componentProperties=null]
  */
  singleColumnCellComponent: undefined,

  /**
    Header title of middlee column.

    @property singleColumnHeaderTitle
    @type String
  */
  singleColumnHeaderTitle: undefined,

  /**
    Total columns count (including additional columns).

    @property colspan
    @type Number
    @readOnly
  */
  colspan: computed('columns.length', 'showHelperColumn', 'showMenuColumn', function() {
    let columnsCount = 1;
    if (this.get('showHelperColumn')) {
      columnsCount += 1;
    }

    if (this.get('showMenuColumn')) {
      columnsCount += 1;
    }

    return columnsCount;
  }),

  init() {
    this._super(...arguments);
    this.set('singleColumnCellComponent', {
      componentName: 'object-list-view-single-column-cell',
      componentProperties: null
    });
  },

  actions: {
    /**
      Delete selected rows.

      @method actions.deleteSelectedRow
      @public
    */
    deleteSelectedRow() {
      let confirmDeleteRows = this.get('confirmDeleteRows');
      if (confirmDeleteRows) {
        assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRows === 'function');
        if (!confirmDeleteRows()) {
          return;
        }
      }

      let componentName = this.get('componentName');

      if (!this.get('allSelect')) {
        this._deleteRows(componentName, true);
      } else {
        let filterQuery = {
          predicate: this.get('currentController.filtersPredicate'),
          modelName: this.get('modelProjection.modelName')
        };

        this._deleteAllRows(componentName, filterQuery);
      }
    },

    /**
      Clear selected rows.

      @method actions.clearSelectedRecords
      @public
    */
    clearSelectedRecords() {
      if (this.get('allSelect')) {
        return;
      }

      let componentName = this.get('componentName');
      let contentWithKeys = this.get('contentWithKeys');
      let selectedRecords = this.get('selectedRecords');
      let selectedRows = contentWithKeys.filterBy('selected', true);
      for (let i = 0; i < selectedRows.length; i++) {
        let recordWithKey = selectedRows[i];
        let selectedRow = this._getRowByKey(recordWithKey.key);

        if (selectedRow.hasClass('active')) {
          selectedRow.removeClass('active');
        }

        selectedRecords.removeObject(recordWithKey.data);
        recordWithKey.set('selected', false);

        this.get('objectlistviewEventsService').rowSelectedTrigger(componentName, recordWithKey.data, selectedRecords.length, false, recordWithKey);
      }
    },
  }
});
