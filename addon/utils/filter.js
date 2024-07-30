/**
  @module ember-flexberry
*/

import { set } from '@ember/object';
import { getOwner } from '@ember/application';
import { isNone } from '@ember/utils';
import moment from 'moment';

import {
  SimplePredicate,
  StringPredicate,
  DatePredicate,
  NotPredicate
} from 'ember-flexberry-data/query/predicate';

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
  let owner = getOwner(this);

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

      case 'boolean':
        switch (filter.condition) {
          case 'empty':
            return new SimplePredicate(filter.name, 'eq', null);
          case 'nempty':
            return new SimplePredicate(filter.name, 'neq', null);
          default:
            return new SimplePredicate(filter.name, filter.condition, filter.pattern);
        }

      case 'number':
        if (filter.condition === 'between') {
          if (!filter.pattern) {
            return new SimplePredicate(filter.name, filter.condition, null);
          } else {
            let [from, to] = filter.pattern.split('|');
            let isNumber = (s) => Number(s) === Number(s) && s;
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

      case 'decimal':
        if (filter.condition === 'between') {
          if (!filter.pattern) {
            return new SimplePredicate(filter.name, filter.condition, null);
          } else {
            let [from, to] = filter.pattern.split('|');
            let isNumber = (s) => Number(s) === Number(s) && s;
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

      case 'date':
        if (filter.condition === 'between' && filter.pattern) {
          const [from, to] = filter.pattern.split('|');
          const fromIsValid = moment(from).isValid();
          const toIsValid = moment(to).isValid();
          if (fromIsValid && toIsValid) {
            return new DatePredicate(filter.name, 'geq', from).and(
              new DatePredicate(filter.name, 'leq', to)
            );
          } else if (fromIsValid) {
            return new DatePredicate(filter.name, 'leq', to);
          } else if (toIsValid) {
            return new DatePredicate(filter.name, 'geq', from);
          } else {
            return null;
          }
        }
  
        return filter.pattern ?
          new DatePredicate(filter.name, filter.condition, filter.pattern, true) :
          new SimplePredicate(filter.name, filter.condition, null);
      default: {
        let transformInstance = owner.lookup('transform:' + filter.type);
        let transformClass = !isNone(transformInstance) ? transformInstance.constructor : null;

        if (transformClass && transformClass.predicateForFilter) {
          return transformClass.predicateForFilter(filter);
        }

        return null;
      }
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
};

export {
  predicateForFilter
};
