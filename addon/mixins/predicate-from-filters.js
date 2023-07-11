/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';

import { predicateForFilter } from 'ember-flexberry/utils/filter';

import Condition from 'ember-flexberry-data/query/condition';
import { ComplexPredicate } from 'ember-flexberry-data/query/predicate';

/**
  Mixin contains functions for predicate build from filters object.

  @class PredicateFromFiltersMixin
  @extends Mixin
  @public
*/
export default Mixin.create({
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
    let filters = this.get('filters');
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
  },
});
