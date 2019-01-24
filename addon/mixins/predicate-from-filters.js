/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { Query } from 'ember-flexberry-data';

const { Condition, SimplePredicate, StringPredicate, ComplexPredicate, DatePredicate } = Query;

/**
  Mixin contains functions for predicate build from filters object.

  @class PredicateFromFiltersMixin
  @extends Ember.Mixin
  @public
*/
export default Ember.Mixin.create({
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
            return (!Ember.isNone(filter.pattern)) ?
              new StringPredicate(filter.name).contains(filter.pattern) :
              null;
          } else {
            return (!Ember.isNone(filter.pattern)) ?
              new SimplePredicate(filter.name, filter.condition, filter.pattern) :
              new SimplePredicate(filter.name, filter.condition, null);
          }

          break;
        case 'boolean':
          return new SimplePredicate(filter.name, filter.condition, filter.pattern);
        case 'number':
          if (!Ember.isNone(filter.pattern)) {
            return new SimplePredicate(filter.name, filter.condition, filter.pattern ? Number(filter.pattern) : filter.pattern);
          } else {
            return null;
          }

          break;
        case 'date':
          if (!Ember.isNone(filter.pattern)) {
            return filter.pattern ?
              new DatePredicate(filter.name, filter.condition, filter.pattern, true) :
              new SimplePredicate(filter.name, filter.condition, filter.pattern);
          } else {
            return null;
          }

          break;
        default:
          return null;
      }
    } else if (filter.pattern) {
      switch (filter.type) {
        case 'string':
          Ember.set(filter, 'condition', 'like');
          return new StringPredicate(filter.name).contains(filter.pattern);
        case 'date':
          Ember.set(filter, 'condition', 'eq');
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
