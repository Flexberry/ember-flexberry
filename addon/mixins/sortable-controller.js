/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { inject as service} from '@ember/service';
import serializeSortingParam from '../utils/serialize-sorting-param';

/**
  Mixin for {{#crossLink "DS.Controller"}}Controller{{/crossLink}} to support
  sorting on {{#crossLink "ObjectListView"}}{{/crossLink}}.

  @example
    ```javascript
    // app/controllers/employees.js
    import Controller from '@ember/controller';
    import SortableController from 'ember-flexberry/mixins/sortable-controller'
    export default Controller.extend(SortableController, {
    });
    ```
    ```javascript
    // app/routes/employees.js
    import Route from '@ember/routing/route';
    import SortableRoute from 'ember-flexberry/mixins/sortable-route'
    export default Route.extend(SortableRoute, {
    });
    ```
    ```handlebars
    <!-- app/templates/employees.hbs -->
    ...
    {{flexberry-objectlistview
      ...
      orderable=true
      sortByColumn=(action 'sortByColumn')
      addColumnToSorting=(action 'addColumnToSorting')
      ...
    }}
    ...
    ```

  @class SortableControllerMixin
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
  @public
 */
export default Mixin.create({
  /**
    Defines which query parameters the controller accepts.
    [More info](https://emberjs.com/api/ember/release/classes/Controller#property_queryParams).

    @property queryParams
    @type Array
    @default ['sort']
  */
  queryParams: ['sort'],

  /**
    Default value for sorting.

    @property sortDefaultValue
    @type String
  */
  sortDefaultValue: null,

  /**
    String with sorting parameters.

    @property sort
    @type String
  */
  sort: null,

  _userSettingsService: service('user-settings'),

  /**
    Dictionary with sorting data related to properties.

    @property computedSorting
    @type Object
    @readOnly
  */
  computedSorting: computed('model.sorting', function() {
    let sorting = this.get('model.sorting');
    let result = {};

    if (sorting) {
      for (let i = 0; i < sorting.length; i++) {
        let propName = sorting[i].propName;
        let sortDef = {
          sortAscending: sorting[i].direction === 'asc',
          sortNumber: i + 1
        };
        result[propName] = sortDef;
      }
    }

    return result;
  }),

  actions: {
    /**
      Sorting list by column.

      @method actions.sortByColumn
      @param {Object} column Column for sorting.
      @param {String} sortPath Path to oldSorting.
    */
    sortByColumn: function(column, componentName, sortPath = 'model.sorting') {
      let propName = column.propName;
      let oldSorting = this.get(sortPath);
      let newSorting = [];
      let sortDirection;
      if (oldSorting) {
        sortDirection = 'asc';
        for (let i = 0; i < oldSorting.length; i++) {
          if (oldSorting[i].propName === propName) {
            sortDirection = this._getNextSortDirection(oldSorting[i].direction);
            break;
          }
        }
      } else {
        sortDirection = 'asc';
      }

      newSorting.push({ propName: propName, direction: sortDirection });

      let sortQueryParam = serializeSortingParam(newSorting, this.get('sortDefaultValue'));
      this.set('sort', sortQueryParam);
    },

    /**
      Add column into end list sorting.

      @method actions.addColumnToSorting
      @param {Object} column Column for sorting.
      @param {String} sortPath Path to oldSorting.
    */
    addColumnToSorting: function(column, componentName, sortPath = 'model.sorting') {
      let propName = column.propName;
      let oldSorting = this.get(sortPath);
      let newSorting = [];
      let changed = false;

      for (let i = 0; i < oldSorting.length; i++) {
        if (oldSorting[i].propName === propName) {
          let newDirection = this._getNextSortDirection(oldSorting[i].direction);
          newSorting.push({ propName: propName, direction: newDirection });
          changed = true;
        } else {
          newSorting.push(oldSorting[i]);
        }
      }

      if (!changed) {
        newSorting.push({ propName: propName, direction: 'asc' });
      }

      let sortQueryParam = serializeSortingParam(newSorting, this.get('sortDefaultValue'));
      this.set('sort', sortQueryParam);
    }
  },

  /**
    Get next sorting direction.

    @method _getNextSortDirection
    @param {String} currentDirection Current sorting direction.
    @return {String} Sorting direction.
    @private
  */
  _getNextSortDirection: function(currentDirection) {
    let ret;
    switch (currentDirection) {
      case 'asc':
        ret = 'desc';
        break;
      case 'desc':
        ret = 'none';
        break;
      default: ret = 'asc';
    }
    return ret;
  },
});
