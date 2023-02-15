/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
import { predicateForFilter } from 'ember-flexberry/utils/filter';

const { Condition, ComplexPredicate } = Query;

/**
  Mixin for route, that restrictions on the list form.

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

  @class LimitedRouteMixin
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  /**
    Configuration hash for this route's queryParams. [More info](http://emberjs.com/api/classes/Ember.Route.html#property_queryParams).

    @property queryParams
    @type Object
  */
  queryParams: {
    filter: { refreshModel: true },
    filterCondition: { refreshModel: true }
  },

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
    Builds predicate for filter.

    @example
      ```javascript
      // app/routes/example.js
      ...
      predicateForFilter(filter) {
        if (filter.type === 'string' && filter.condition === 'like') {
          return new StringPredicate(filter.name).contains(filter.pattern);
        }

        return this._super(...arguments);
      },
      ...
      ```

    @method predicateForFilter
    @param {Object} filter Object (`{ name, condition, pattern }`) with parameters for filter.
    @return {BasePredicate|null} Predicate to filter through.
  */
  predicateForFilter: predicateForFilter,

  /**
    Return predicate for `QueryBuilder` or `undefined`.

    @method _filtersPredicate
    @return {BasePredicate|undefined} Predicate for `QueryBuilder` or `undefined`.
    @private
  */
  _filtersPredicate() {
    let filters = this.controllerFor(this.routeName).get('filters');
    if (filters) {
      let predicates = [];
      for (let filter in filters) {
        if (filters.hasOwnProperty(filter)) {
          let predicate = this.predicateForFilter(filters[filter]);
          if (predicate) {
            predicates.push(predicate);
          }
        }
      }

      return predicates.length ? predicates.length > 1 ? new ComplexPredicate(Condition.And, ...predicates) : predicates[0] : undefined;
    }

    return undefined;
  }
});
