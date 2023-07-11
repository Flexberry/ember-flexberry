import { isNone } from '@ember/utils';
import DS from 'ember-data';
import {
  SimplePredicate,
  StringPredicate,
  NotPredicate
} from 'ember-flexberry-data/query/predicate';

/**
  Test transform for JSON value.

  @class FlexberryJsonTransform
  @extends <a href="http://emberjs.com/api/data/classes/DS.Transform.html">DS.Transform</a>
*/
let FlexberryJsonTransform = DS.Transform.extend({
  deserialize: function(json) {
    return isNone(json) ? null : String(json);
  },

  serialize: function(js) {
    return isNone(js) ? null : String(js);
  },
});

FlexberryJsonTransform.reopenClass({
  conditionsForFilter() {
    return {
      'eq': 'JSON equal',
      'neq': 'JSON not equal',
      'like': 'JSON like',
      'nlike': 'JSON not like',
      'hasAttr': 'JSON has attribute',
    };
  },

  predicateForFilter(filter) {
    if (filter.condition) {
      switch (filter.condition) {
        case 'like':
          return new StringPredicate(filter.name).contains(filter.pattern || '');
        case 'nlike':
          return new NotPredicate(new StringPredicate(filter.name).contains(filter.pattern || ''));
        case 'hasAttr':
            return new StringPredicate(filter.name).contains('"' + filter.pattern + '":' || '');
        default:
          return new SimplePredicate(filter.name, filter.condition, filter.pattern || null);
      }
    }

    return null;
  },

  componentForFilter() {
    return { name: 'flexberry-textbox', properties: { class: 'compact fluid' } };
  },
});

export default FlexberryJsonTransform;