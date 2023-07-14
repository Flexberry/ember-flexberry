import { isNone } from '@ember/utils';
import DS from 'ember-data';
import {
  SimplePredicate,
  StringPredicate,
  NotPredicate
} from 'ember-flexberry-data/query/predicate';

/**
  Transform for Text value.

  @class FlexberryTextTransform
  @extends <a href="http://emberjs.com/api/data/classes/DS.Transform.html">DS.Transform</a>
*/
let FlexberryTextTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    return isNone(serialized) ? null : String(serialized);
  },

  serialize: function(deserialized) {
    return isNone(deserialized) ? null : String(deserialized);
  },
});

FlexberryTextTransform.reopenClass({
  conditionsForFilter() {
    return {
      'eq': 'Text equal',
      'neq': 'Text not equal',
      'like': 'Text like',
      'nlike': 'Text not like',
      'hasAttr': 'Text has attribute',
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

  getOdataValue(predicateValue) {
    return `'${String(predicateValue).replace(/'/g, `''`)}'`;
  }
});

export default FlexberryTextTransform;