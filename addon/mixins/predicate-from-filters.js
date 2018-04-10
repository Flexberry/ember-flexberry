/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { set } from '@ember/object';
import { Query } from 'ember-flexberry-data';

const { Condition, SimplePredicate, StringPredicate, ComplexPredicate, DatePredicate } = Query;

/**
  Mixin contains functions for predicate build from filters object.

  @class PredicateFromFiltersMixin
  @extends Ember.Mixin
  @public
*/
export default Mixin.create({
  /**
    Return predicate to filter through.

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
  predicateForFilter(filter) {
    if (filter.pattern && filter.condition) {
      switch (filter.type) {
        case 'string':
          return filter.condition === 'like' ?
            new StringPredicate(filter.name).contains(filter.pattern) :
            new SimplePredicate(filter.name, filter.condition, filter.pattern);
        case 'boolean':
          return new SimplePredicate(filter.name, filter.condition, filter.pattern);
        case 'number':
          return new SimplePredicate(filter.name, filter.condition, filter.pattern ? Number(filter.pattern) : filter.pattern);
        case 'date':
          return new DatePredicate(filter.name, filter.condition, filter.pattern);

        default:
          return null;
      }
    } else {
      if (!filter.condition && filter.type === 'string') {
        set(filter, 'condition', 'like');
        return new StringPredicate(filter.name).contains(filter.pattern);
      }
    }

    return null;
  },

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
