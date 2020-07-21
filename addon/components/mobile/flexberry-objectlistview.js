/**
  @module ember-flexberry
*/

import FlexberryObjectlistview from './../flexberry-objectlistview';
import getAttrLocaleKey from '../../utils/get-attr-locale-key';
import Ember from 'ember';

/**
  Mobile version of flexberry-objectlistview (with mobile-specific defaults).

  @class Mobile.FlexberryObjectlistview
  @extends FlexberryObjectlistview
*/
export default FlexberryObjectlistview.extend({
  /**
    Flag: indicates whether to show asterisk icon in first column of every changed row.

    @property showAsteriskInRow
    @type Boolean
    @default false
  */
  showAsteriskInRow: false,

  /**
    Flag indicates whether to show checkbox in first column of every row.

    @property showCheckBoxInRow
    @type Boolean
    @default false
  */
  showCheckBoxInRow: true,

  /**
    Flag indicates whether to show delete button in first column of every row.

    @property showDeleteButtonInRow
    @type Boolean
    @default false
  */
  showDeleteButtonInRow: false,

  /**
    Flag indicates whether to show dropdown menu with edit menu item, in last column of every row.

    @property showEditMenuItemInRow
    @type Boolean
    @default true
  */
  showEditMenuItemInRow: true,

  /**
    Flag indicates whether to show dropdown menu with delete menu item, in last column of every row.

    @property showDeleteMenuItemInRow
    @type Boolean
    @default false
  */
  showDeleteMenuItemInRow: false,

  /**
    Flag indicates whether table rows are clickable.

    @property rowClickable
    @type Boolean
    @default true
  */
  rowClickable: true,

  /**
    Flag indicates whether ordering by clicking on column headers is allowed.

    @property orderable
    @type Boolean
    @default false
  */
  orderable: false,

  /**
    Flag indicates whether to show creation button at toolbar.

    @property createNewButton
    @type Boolean
    @default false
  */
  createNewButton: false,

  /**
    Flag indicates whether to show refresh button at toolbar.

    @property refreshButton
    @type Boolean
    @default false
  */
  refreshButton: false,

  /**
    Flag indicates whether to show delete button at toolbar.

    @property deleteButton
    @type Boolean
    @default false
  */
  deleteButton: false,

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
  singleColumnCellComponent: {
    componentName: 'object-list-view-single-column-cell',
    componentProperties: null
  },

  /**
    Header title of single column.

    @property singleColumnHeaderTitle
    @type String
  */
  singleColumnHeaderTitle: undefined,

  /**
    Indicates whether or not autoresize columns for fit the page width.

    @property columnsWidthAutoresize
    @type Boolean
    @default true
  */
  columnsWidthAutoresize: true,

  currecntSortingArray: Ember.computed('sorting', {
    get() {
      let sorting = this.get('sorting');
      let rows = [];
      if (Object.keys(sorting).length !== 0) {
        for (let variable in sorting) {
          let row = sorting[variable];
          rows[rows.length] = {
            key: variable,
            sortNumber: row.sortNumber,
            sortAscending: row.sortAscending
          };
        }

        rows = rows.sort((a, b) => b.sortAscending - a.sortAscending);
      }

      return rows;
    }
  }),

  mobileSortingSettingsIcon: Ember.computed('sorting', {
    get() {
      let icon = 'sort content descending';
      let firstRow = this.get('currecntSortingArray')[0];

      if (firstRow !== undefined) {
        icon = firstRow.sortAscending ? 'sort content ascending' : 'sort content descending';
      }

      return `${icon} icon`;
    }
  }),

  mobileSortingSettingsCaption: Ember.computed('sorting', 'i18n.locale', {
    get() {
      let i18n = this.get('i18n');
      let sorting = this.get('currecntSortingArray');
      if (sorting.length === 0) {
        return i18n.t('components.flexberry-objectlistview.without-sorting');
      }

      let sortingValue;
      sorting.forEach((row) => {
        let rowHeader = i18n.t(getAttrLocaleKey(this.get('modelName'), this.get('modelProjection').projectionName, row.key)).string;
        if (rowHeader !== undefined) {
          let key = row.key.split('.')[0];
          rowHeader = i18n.t(getAttrLocaleKey(this.get('modelName'), this.get('modelProjection').projectionName, row.key)).string;
        }

        if (sortingValue  !== undefined) {
          sortingValue += `, ${rowHeader}`;
        } else {
          sortingValue = rowHeader;
        }
      });

      return sortingValue;
    }
  }),

  actions: {
    showConfigDialog() {
      this.get('currentController').send('showConfigDialog', this.get('componentName'), false, false);
    }
  }
});
