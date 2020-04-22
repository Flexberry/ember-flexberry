/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
const { SimplePredicate, StringPredicate, DatePredicate, NotPredicate } = Query;

/**
  Builds predicate for filter

  @example
    ```javascript
    import { predicateForFilter } from 'ember-flexberry/utils/filter'
    predicateForFilter(filter)
    ```

  @method predicateForFilter
  @param {Object} filter Object (`{ name, condition, pattern }`) with parameters for filter.
  @return {BasePredicate|null} Predicate to filter through.
*/
let predicateForFilter = function (filter) {
  if (filter.condition) {
    switch (filter.type) {
      case 'string':
        switch (filter.condition) {
          case 'like':
            return new StringPredicate(filter.name).contains(filter.pattern || '');
          case 'nlike':
            return new NotPredicate(new StringPredicate(filter.name).contains(filter.pattern || ''));
          default:
            return new SimplePredicate(filter.name, filter.condition, filter.pattern || null);
        }

        break;
      case 'boolean':
        switch (filter.condition) {
          case 'empty':
            return new SimplePredicate(filter.name, 'eq', null);
          case 'nempty':
            return new SimplePredicate(filter.name, 'neq', null);
          default:
            return new SimplePredicate(filter.name, filter.condition, filter.pattern);
        }

        break;
      case 'number':
        if (filter.condition === 'between') {
          if (!filter.pattern) {
            return new SimplePredicate(filter.name, filter.condition, null);
          } else {
            let [from, to] = filter.pattern.split('|');
            let isNumber = (s) => Ember.isPresent(s) && Number(s) === Number(s);
            if (isNumber(from) && isNumber(to)) {
              return new SimplePredicate(filter.name, 'geq', Number(from)).and(
                new SimplePredicate(filter.name, 'leq', Number(to))
              );
            } else if (isNumber(from)) {
              return new SimplePredicate(filter.name, 'leq', Number(to));
            } else if (isNumber(to)) {
              return new SimplePredicate(filter.name, 'geq', Number(from));
            } else {
              return null;
            }
          }
        } else {
          return new SimplePredicate(filter.name, filter.condition, filter.pattern ? Number(filter.pattern) : null);
        }

        break;
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
};

export {
  predicateForFilter
};
