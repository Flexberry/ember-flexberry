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

/**
  Mixin contains functions for predicate build from filters object.

  @class PredicateFromFiltersMixin
  @extends Mixin
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
    if (filter.condition) {
      switch (filter.type) {
        case 'string':
          if (filter.condition === 'like') {
            return (!isNone(filter.pattern)) ?
              new StringPredicate(filter.name).contains(filter.pattern) :
              new StringPredicate(filter.name).contains('');
          } else {
            return (!isNone(filter.pattern)) ?
              new SimplePredicate(filter.name, filter.condition, filter.pattern) :
              new SimplePredicate(filter.name, filter.condition, null);
          }
        case 'boolean':
          return new SimplePredicate(filter.name, filter.condition, filter.pattern);
        case 'number':
          return new SimplePredicate(filter.name, filter.condition, filter.pattern ? Number(filter.pattern) : null);
        case 'date':
          return filter.pattern ?
            new DatePredicate(filter.name, filter.condition, filter.pattern, true) :
            new SimplePredicate(filter.name, filter.condition, null);
        default:
          return null;
      }
    } else if (filter.pattern) {
      switch (filter.type) {
        case 'string':
          set(filter, 'condition', 'like');
          return new StringPredicate(filter.name).contains(filter.pattern);
        case 'date':
          set(filter, 'condition', 'eq');
          return new DatePredicate(filter.name, filter.condition, filter.pattern, true);
        default:
          return null;
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
