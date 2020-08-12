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
  showCheckBoxInRow: false,

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
  singleColumnCellComponent: undefined,

  /**
    Header title of single column.

    @property singleColumnHeaderTitle
    @type String
  */
  singleColumnHeaderTitle: undefined,

  /**
    Flag indicates whether table are striped.

    @property tableStriped
    @type Boolean
    @default false
  */
  tableStriped: false,

  init() {
    this._super(...arguments);
    this.set('singleColumnCellComponent', {
      componentName: 'object-list-view-single-column-cell',
      componentProperties: null
    });
  },

  /**
    Indicates whether or not autoresize columns for fit the page width.

    @property columnsWidthAutoresize
    @type Boolean
    @default true
  */
  columnsWidthAutoresize: true,

  /**
    Array CSS class names.
    [More info](https://emberjs.com/api/ember/release/classes/Component#property_classNames).

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['mobile']

  /**
    Array of objects corresponding to list of pages.

    Each page is presented as object with following properties:
    - **number** - Number of page.
    - **isCurrent** - If `true` this page is current.
    - **isEllipsis** - If `true` this page showing in pages list.

    @private
    @property _mobilePages
    @type Array
    @readOnly
  */
  _mobilePages: Ember.computed('pages', function() {
    let mobilePages = Ember.A();
    let pages = Ember.A(this.get('pages'));

    if (pages.length <= 4) {
      return pages;
    }

    let currentPageNumber = pages.find(page => page.isCurrent).number;
    let lastPageNumber = pages[pages.length - 1].number;

    for (let i = 1; i <= lastPageNumber; i++) {
      let isEllipsis;

      if (currentPageNumber === 1 || currentPageNumber === lastPageNumber) {
        isEllipsis  = currentPageNumber === 1 ? i > 3 : i < lastPageNumber - 2;
      } else {
        isEllipsis = currentPageNumber - 1 > i || i > currentPageNumber + 1;
      }

      let page = {
        isCurrent: i === currentPageNumber,
        isEllipsis: isEllipsis,
        number: i
      };

      mobilePages.pushObject(page);
    }

    return mobilePages;
  }),

  /*
    Convert array of object sorting to array.

    @private
    @property _currecntSortingArray
    @type Array
    @readOnly
  */
  _currecntSortingArray: Ember.computed('sorting',  function() {
    let sorting = this.get('sorting');
    let sortingKeys = Object.keys(sorting);
    let columns = Ember.A();
    sortingKeys.forEach(key => {
      let column = sorting[key];
      columns.pushObject({
        key: key,
        sortNumber: column.sortNumber,
        sortAscending: column.sortAscending
      });
    });

    columns.sortBy('sortNumber');

    return columns;
  }),

  /**
    Class icons for sorting.

    @private
    @property _mobileSortingSettingsIcon
    @type String
    @readOnly
  */
  _mobileSortingSettingsIcon: Ember.computed('_currecntSortingArray',  function() {
    let icon = 'sort content descending';
    let firstColumn = this.get('_currecntSortingArray')[0];

    if (firstColumn !== undefined) {
      icon = firstColumn.sortAscending ? 'sort content ascending' : 'sort content descending';
    }

    return `${icon} icon`;
  }),

  /**
    Mobile sort text.

    @private
    @property _mobileSortingSettingsCaption
    @type String
    @readOnly
  */
  _mobileSortingSettingsCaption: Ember.computed('_currecntSortingArray', 'i18n.locale',  function() {
    let i18n = this.get('i18n');
    let sorting = this.get('_currecntSortingArray');
    if (sorting.length === 0) {
      return i18n.t('components.flexberry-objectlistview.without-sorting');
    }

    let sortingValue;
    sorting.forEach((column) => {
      let columnHeader = i18n.t(getAttrLocaleKey(this.get('modelName'), this.get('modelProjection').projectionName, column.key)).string;
      if (columnHeader !== undefined) {
        let key = column.key.split('.')[0];
        columnHeader = i18n.t(getAttrLocaleKey(this.get('modelName'), this.get('modelProjection').projectionName, key)).string;
      }

      if (sortingValue  !== undefined) {
        sortingValue += `, ${columnHeader}`;
      } else {
        sortingValue = columnHeader;
      }
    });

    return sortingValue;
  }),
  actions: {
    showConfigDialog() {
      this.get('currentController').send('showConfigDialog', this.get('componentName'), undefined, false, false);
    }
  }
});
