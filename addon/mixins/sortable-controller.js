/**
  @module ember-flexberry
*/

import Ember from 'ember';
const { getOwner } = Ember;

/**
  Mixin for {{#crossLink "DS.Controller"}}Controller{{/crossLink}} to support
  sorting on {{#crossLink "ObjectListView"}}{{/crossLink}}.

  Example:
  ```javascript
  // app/controllers/employees.js
  import Ember from 'ember';
  import SortableController from 'ember-flexberry/mixins/sortable-controller'
  export default Ember.Controller.extend(SortableController, {
  });
  ```
  ```javascript
  // app/routes/employees.js
  import Ember from 'ember';
  import SortableRoute from 'ember-flexberry/mixins/sortable-route'
  export default Ember.Route.extend(SortableRoute, {
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
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
  @public
 */
export default Ember.Mixin.create({
  /**
    Defines which query parameters the controller accepts.
    [More info](http://emberjs.com/api/classes/Ember.Controller.html#property_queryParams).

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
  sort: Ember.computed.oneWay('sortDefaultValue'),

  _userSettingsService: Ember.inject.service('user-settings-service'),
  _router: undefined,

  /**
    Dictionary with sorting data related to properties.

    @property computedSorting
    @type Object
    @readOnly
  */
  computedSorting: Ember.computed('model.sorting', function() {
    var sorting = this.get('model.sorting');
    var result = {};

    if (sorting) {
      for (var i = 0; i < sorting.length; i++) {
        var propName = sorting[i].propName;
        var sortDef = {
          sortAscending: sorting[i].direction === 'asc' ? true : false,
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
    */
    sortByColumn: function(column) {
      var propName = column.propName;
      var oldSorting = this.get('model.sorting');
      var newSorting = [];
      var sortDirection;
      if (oldSorting) {
        sortDirection = 'asc';
        for (var i = 0; i < oldSorting.length; i++) {
          if (oldSorting[i].propName === propName) {
            sortDirection = this._getNextSortDirection(oldSorting[i].direction);
            break;
          }
        }
      } else {
        sortDirection = 'asc';
      }

      if (sortDirection !== 'none') {
        newSorting.push({ propName: propName, direction: sortDirection });
      }

      let sortQueryParam = this._serializeSortingParam(newSorting);
      if ('userSettings' in this) { // NON modal window
        this.userSettings.sorting = newSorting;
        let router = getOwner(this).lookup('router:main');
        let moduleName =  router.currentRouteName;
        let savePromise = this.get('_userSettingsService').
          saveUserSetting({
            moduleName: moduleName,
            settingName: 'DEFAULT',
            userSetting: { sorting: newSorting }
          }
        );
        savePromise.then(
          record => {
            this.set('sort', sortQueryParam);
          }
        );
      } else {
        this.set('sort', sortQueryParam);
      }
    },

    /**
      Add column into end list sorting.

      @method actions.addColumnToSorting
      @param {Object} column Column for sorting.
    */
    addColumnToSorting: function(column) {
      var propName = column.propName;
      var oldSorting = this.get('model.sorting');
      var newSorting = [];
      var changed = false;

      for (var i = 0; i < oldSorting.length; i++) {
        if (oldSorting[i].propName === propName) {
          var newDirection = this._getNextSortDirection(oldSorting[i].direction);
          if (newDirection !== 'none') {
            newSorting.push({ propName: propName, direction: newDirection });
          }

          changed = true;
        } else {
          newSorting.push(oldSorting[i]);
        }
      }

      if (!changed) {
        newSorting.push({ propName: propName, direction: 'asc' });
      }

      let sortQueryParam = this._serializeSortingParam(newSorting);
      if ('userSettings' in this) { // NON model window
        this.userSettings.sorting = newSorting;
        let router = getOwner(this).lookup('router:main');
        let moduleName =  router.currentRouteName;
        let savePromise = this.get('_userSettingsService').
          saveUserSetting({
            moduleName: moduleName,
            settingName: 'DEFAULT',
            userSetting: { sorting: newSorting }
          }
        );
        savePromise.then(
          record => {
            this.set('sort', sortQueryParam);
          }
        );
      } else {
        this.set('sort', sortQueryParam);
      }
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
    return currentDirection === 'asc' ? 'desc' : 'none';
  },

  /**
    Convert object with sorting parameters into string.

    @method _serializeSortingParam
    @param {Object} sorting Object with sorting parameters.
    @returns {String} String with sorting parameters.
    @private
  */
  _serializeSortingParam: function(sorting) {
    return sorting.map(function(element) {
      return (element.direction === 'asc' ? '+' : '-') + element.propName;
    }).join('') || this.get('sortDefaultValue');
  },
});
