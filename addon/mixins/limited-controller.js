/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

/**
  Mixin for controller, that restrictions on the list form.

  @example
    ```javascript
    // app/controllers/employees.js
    import Controller from '@ember/controller';
    import LimitedController from 'ember-flexberry/mixins/limited-controller'
    export default Controller.extend(LimitedController, {
      ...
    });
    ```

    ```javascript
    // app/routes/employees.js
    import Controller from '@ember/controller';
    import LimitedRoute from 'ember-flexberry/mixins/limited-route'
    export default Route.extend(LimitedRoute, {
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
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
*/
export default Mixin.create({
  /**
    Defines which query parameters the controller accepts. [More info.](https://emberjs.com/api/ember/release/classes/Controller#property_queryParams).

    @property queryParams
    @type Array
    @default ['lf', 'filter']
   */
  queryParams: ['filter', 'filterCondition'],

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
    Result predicate with all restrictions for olv.

    @property resultPredicate
    @type BasePredicate
    @default null
   */
  resultPredicate: null,

  /**
    Result predicate with filters restrictions for olv.

    @property filterPredicate
    @type BasePredicate
    @default null
   */
  filterPredicate: null,

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
  objectlistviewEventsService: service('objectlistview-events'),

  actions: {
    /**
      Save filters and refresh list.

      @method actions.applyFilters
      @param {Object} filters
    */
    applyFilters(filters) {
      this.set('page', 1);
      this.set('filters', filters);
      this.get('objectlistviewEventsService').setLoadingState('loading');
      this.send('refreshList');
    },

    /**
      Reset filters and refresh list.

      @method actions.resetFilters
      @param {String} componentName The name of objectlistview component.
    */
    resetFilters(componentName) {
      this.set('page', 1);
      this.set('filters', null);
      this.get('objectlistviewEventsService').setLoadingState('loading');
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
      if (this.get('filter') !== pattern || this.get('filterCondition') !== filterCondition) {
        this.get('objectlistviewEventsService').setLoadingState('loading');
        let _this = this;
        later((function() {
          _this.setProperties({
            filterCondition: filterCondition,
            filter: pattern,
            page: 1
          });
        }), 50);
      }
    },
  },
});
