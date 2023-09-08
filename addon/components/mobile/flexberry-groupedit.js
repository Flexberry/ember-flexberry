/**
  @module ember-flexberry
*/

import FlexberryGroupeditComponent from './../flexberry-groupedit';

import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

/**
  Mobile version of {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} (with mobile-specific defaults).

  @class Mobile.FlexberryGroupeditComponent
  @extends FlexberryGroupeditComponent
  @constructor
*/
export default FlexberryGroupeditComponent.extend({
  /**
    Flag: indicates whether allow to resize columns (if `true`) or not (if `false`).

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/allowColumnResize:property"}}{{/crossLink}}
    of base component.

    @property allowColumnResize
    @type Boolean
    @default false
  */
  allowColumnResize: false,

    /**
    Service that triggers {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} events.

    @property _groupEditEventsService
    @type Service
    @private
  */
    _groupEditEventsService: service('objectlistview-events'),

  /**
    Flag: indicates whether ordering by clicking on column headers is allowed.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/orderable:property"}}{{/crossLink}}
    of base component.

    @property orderable
    @type Boolean
    @default false
  */
  orderable: false,

  /**
    Flag: indicates whether table rows are clickable.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/rowClickable:property"}}{{/crossLink}}
    of base component.

    @property rowClickable
    @type Boolean
    @default false
  */
  rowClickable: false,

  /**
    Flag: indicates whether to show asterisk icon in first column of every changed row.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/showAsteriskInRow:property"}}{{/crossLink}}
    of base component.

    @property showAsteriskInRow
    @type Boolean
    @default true
  */
  showAsteriskInRow: undefined,

  /**
    Flag: indicates whether to show checkbox in first column of every row.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/showCheckBoxInRow:property"}}{{/crossLink}}
    of base component.

    @property showCheckBoxInRow
    @type Boolean
    @default true
  */
  showCheckBoxInRow: true,

  /**
    Flag: indicates whether to show delete button in first column of every row.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/showDeleteButtonInRow:property"}}{{/crossLink}}
    of base component.

    @property showDeleteButtonInRow
    @type Boolean
    @default true
  */
  showDeleteButtonInRow: true,

  /**
    Flag: indicates whether to show dropdown menu with delete menu item, in last column of every row.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/showDeleteMenuItemInRow:property"}}{{/crossLink}}
    of base component.

    @property showDeleteMenuItemInRow
    @type Boolean
    @default false
  */
  showDeleteMenuItemInRow: false,

  /**
    Flag: indicates whether to show dropdown menu with edit menu item, in last column of every row.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/showEditMenuItemInRow:property"}}{{/crossLink}}
    of base component.

    @property showEditMenuItemInRow
    @type Boolean
    @default false
  */
  showEditMenuItemInRow: false,

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
    Columns descriptions.

    @property colDescs
    @type Array
  */
  colDescs: undefined,

  /**
    Existing GE sortings.

    @property currentSortings
    @type Map
  */
  currentSortings: new Map(),

  /**
    Set new sorting.

    @method setSorting
    @param componentName Component name.
    @param sorting New sorting.
    @param colDescs Columns description.
  */
  setSorting(componentName, sorting, colDescs) {
    sorting.componentName = componentName;
    this.set('colDescs', colDescs);
    this.set('sorting', sorting);
  },

  /**
    Set column names at default sortings.

    @method setDefaultColNames
    @param colDescs Columns description.
  */
  setDefaultColNames(colDescs) {
    this.set('colDescs', colDescs);
  },

  /**
    Convert array of object sorting to array.

    @private
    @property _currecntSortingArray
    @type Array
    @readOnly
  */
    _currecntSortingArray: computed('sorting',  function() {
      let sorting = this.get('sorting');
      let columns = A();
      if (sorting === null) {
        return columns;
      }
  
      let sortingKeys = Object.keys(sorting);
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
    _mobileSortingSettingsIcon: computed('sorting',  function() {
      let icon = 'sort content descending';

      let sorting = this.get('sorting');

      let currentComponentName = this.get('componentName');
      let sortedComponentName = this.get('sorting.componentName');

      if (sorting && currentComponentName == sortedComponentName) {
        let firstColumn = sorting[0];
  
        if (firstColumn !== undefined) {
          icon = firstColumn.direction == "asc" ? 'sort content ascending' : 'sort content descending';
        }
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
    _mobileSortingSettingsCaption: computed('sorting', 'i18n.locale',  function() {
      let i18n = this.get('i18n');
      let sorting = this.get('sorting');
      let currentComponentName = this.get('componentName');
      let sortedComponentName = this.get('sorting.componentName') || currentComponentName;

      if (currentComponentName != sortedComponentName) {
        return this.currentSortings.get(currentComponentName);
      }

      if (!sorting || sorting.length === 0 ) {
        let sortingValue = i18n.t('components.flexberry-objectlistview.without-sorting');
        this.currentSortings.set(currentComponentName, sortingValue );
        return sortingValue;
      } else {
  
        let sortingValue;
        let colDescs = this.get('colDescs');

        if (!colDescs) {
          return i18n.t('components.flexberry-objectlistview.without-sorting');
        }

        let colNames = new Map();
        colDescs.forEach((column) => {
          colNames.set(column.propName, column.name.string );
        });

        sorting.forEach((column) => {
          let columnName = colNames.get(column.propName);
          if (sortingValue  !== undefined) {
            sortingValue += `, ${columnName}`;
          } else {
            sortingValue = columnName;
          }
        });

        if (!sortingValue) {
          sortingValue = this.currentSortings.get(currentComponentName) || i18n.t('components.flexberry-objectlistview.without-sorting');
        }

        this.currentSortings.set(currentComponentName, sortingValue );
    
        return sortingValue;
      }
    }),

  init() {
    this._super(...arguments);

    this.get('_groupEditEventsService').on('setGeSort', this, this.setSorting);
    this.get('_groupEditEventsService').on('setDefaultGeSort', this, this.setDefaultColNames);

    let componentName = this.get('componentName');
    let component = this.get('currentController.developerUserSettings.' + `${componentName}`);
    let sorting = component.DEFAULT.sorting;
    this.set('sorting', sorting);

    this.get('currentController').send('getGeneratedColumns', this.get('componentName'), undefined, this.get('modelProjection'), this.get('sorting'));

    this.set('singleColumnCellComponent', {
      componentName: 'object-list-view-single-column-cell',
      componentProperties: null
    });
  },

  willDestroy() {
    this.get('_groupEditEventsService').off('setGeSort', this, this.setSorting);
    this.get('_groupEditEventsService').off('setDefaultGeSort', this, this.setDefaultColNames);
    this._super(...arguments);
  },

  actions: {
    showConfigDialog() {
      this.get('currentController').send('showSortGeDialog', 
                                          this.get('componentName'), 
                                          undefined, 
                                          this.get('useSidePageMode'), 
                                          this.get('modelProjection'),
                                          this.get('content'),
                                          this.get('sorting'));
    }
  }
});
