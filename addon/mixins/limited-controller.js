/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Mixin for controller, that restrictions on the list form.

  @example
    ```javascript
    // app/controllers/employees.js
    import Ember from 'ember';
    import LimitedController from 'ember-flexberry/mixins/limited-controller'
    export default Ember.Controller.extend(LimitedController, {
      ...
    });
    ```

    ```javascript
    // app/routes/employees.js
    import Ember from 'ember';
    import LimitedRoute from 'ember-flexberry/mixins/limited-route'
    export default Ember.Route.extend(LimitedRoute, {
      ...
    });
    ```

    ```handlebars
    <!-- app/templates/employees.hbs -->
    ...
    {{flexberry-objectlistview
      ...
      enableFilters=enableFilters
      filters=filters
      applyFilters=(action "applyFilters")
      resetFilters=(action "resetFilters")
      ...
      filterButton=true
      filterText=filter
      filterByAnyMatch=(action 'filterByAnyMatch')
      ...
    }}
    ...
    ```

  @class LimitedController
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  /**
    Defines which query parameters the controller accepts. [More info.](http://emberjs.com/api/classes/Ember.Controller.html#property_queryParams).

    @property queryParams
    @type Array
    @default ['lf', 'filter']
   */
  queryParams: ['filter'],

  /**
    Filters filled in OLV component.

    @property filters
    @type Object
    @default null
  */
  filters: null,

  /**
    String with search query.

    @property filter
    @type String
    @default null
   */
  filter: null,

  /**
    Condition for predicate uses at filter by any match, can be `or` or `and`.

    @property filterCondition
    @type String
  */
  filterCondition: undefined,

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type Service
  */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  actions: {
    /**
      Save filters and refresh list.

      @method actions.applyFilters
      @param {Object} filters
    */
    applyFilters(filters) {
      this.set('filters', filters);
      this.send('refreshList');
    },

    /**
      Reset filters and refresh list.

      @method actions.resetFilters
      @param {String} componentName The name of objectlistview component.
    */
    resetFilters(componentName) {
      this.set('filters', null);
      this.send('refreshList');
      this.get('objectlistviewEventsService').resetFiltersTrigger(componentName);
    },

    /**
      Changes current pattern for objects filtering.

      @method filterByAnyMatch
      @param {String} pattern A substring that is searched in objects while filtering.
      @param {String} filterCondition Condition for predicate, can be `or` or `and`.
    */
    filterByAnyMatch(pattern, filterCondition) {
      if (this.get('filter') !== pattern) {
        this.setProperties({
          filterCondition: filterCondition,
          filter: pattern,
          page: 1
        });
      }
    },
  },
});
