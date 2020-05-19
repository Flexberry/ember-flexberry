/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { set } from '@ember/object';
import Condition from 'ember-flexberry-data/query/condition';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import { DatePredicate } from 'ember-flexberry-data/query/predicate';
import { ComplexPredicate } from 'ember-flexberry-data/query/predicate';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';
import { isNone } from '@ember/utils';
import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
import { predicateForFilter } from 'ember-flexberry/utils/filter';

/**
  Mixin for route, that restrictions on the list form.

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
    import Route from '@ember/routing/route';
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

  @class LimitedRouteMixin
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
*/
export default Mixin.create({
  /**
    Configuration hash for this route's queryParams. [More info](https://www.emberjs.com/api/ember/release/classes/Route/properties/queryParams?anchor=queryParams).

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
