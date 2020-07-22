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
  /**
    Array of objects corresponding to list of pages.

    Each page is presented as object with following properties:
    - **number** - Number of page.
    - **isCurrent** - Page is current.
    - **isEllipsis** - If `true` this page not showing in list.

    @property _pages
    @type Array
    @readOnly
  */

  mobilePages: Ember.computed('pages', function() {
    let mobilePages = [];
    let pages = this.get('pages');
    let currentPageNumber = pages.find(page => page.isCurrent).number;

    // Rebuilding pages for mobile version.
    switch (currentPageNumber) {
      case 1:
      case 2:
        mobilePages.push(pages[0], pages[1], pages[2]);
        break;
      case 3:
        mobilePages.push(pages[1], pages[2], pages[3]);
        break;
      case pages[pages.length - 2].number:
      case pages[pages.length - 1].number:
        mobilePages.push(pages[pages.length - 3], pages[pages.length - 2], pages[pages.length - 1]);
        break;
      default:
        mobilePages.push(pages[2], pages[3], pages[4]);
        break;
    }

    return mobilePages;
  }),

  /**
    Array of pages without current.

    @property _allPages
    @type Array
    @readOnly
  */
  _allPages: Ember.computed('pages', function() {
    let allPages = [];
    let mobilePagesNumbers = Ember.A();
    let mobilePages = this.get('mobilePages');
    mobilePages.forEach( (page) => {
      mobilePagesNumbers.push(page.number);
    });

    for (let i = 1; i <=  this.get('recordsTotalCount'); i++) {
      if (!mobilePagesNumbers.contains(i)) {
        allPages[i] = i;
      }
    }

    return allPages;
  }),

  /*
    Convert array of object sorting to array.

    @property _currecntSortingArray
    @type Array
    @readOnly
  */
  _currecntSortingArray: Ember.computed('sorting',  function() {
    let sorting = this.get('sorting');
    let sortingKeys = Object.keys(this.get('sorting'));
    let columns = Ember.A();
    sortingKeys.forEach(key => {
      let column = sorting[key];
      columns.pushObject({
        key: key,
        sortNumber: column.sortNumber,
        sortAscending: column.sortAscending
      });
    });
    columns = columns.sort((a, b) => a.sortNumber - b.sortNumber);

    return columns;
  }),

  /**
    Class icons for sorting.

    @property mobileSortingSettingsIcon
    @type String
    @readOnly
  */
  mobileSortingSettingsIcon: Ember.computed('sorting',  function() {
    let icon = 'sort content descending';
    let firstColumn = this.get('_currecntSortingArray')[0];

    if (firstColumn !== undefined) {
      icon = firstColumn.sortAscending ? 'sort content ascending' : 'sort content descending';
    }

    return `${icon} icon`;
  }),

  /**
    Mobile sort text.

    @property mobileSortingSettingsCaption
    @type String
    @readOnly
  */
  mobileSortingSettingsCaption: Ember.computed('sorting', 'i18n.locale',  function() {
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

  didRender: function() {
    this._super(...arguments);
    let _this = this;
    let selectPageDropdown = Ember.$('.page-select-drodpown');
    selectPageDropdown.dropdown({
      onChange: function (val) {
        if (val !== undefined) {
          _this.get('currentController').send('gotoPage', val);
        }
      }
    });
  },

  actions: {
    showConfigDialog() {
      this.get('currentController').send('showConfigDialog', this.get('componentName'), undefined, false, false);
    }
  }
});
