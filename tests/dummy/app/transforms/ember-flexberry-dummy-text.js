import { isNone } from '@ember/utils';
import Transform from '@ember-data/serializer/transform';
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
export default class FlexberryTextTransform extends Transform {
  deserialize(serialized) {
    return isNone(serialized) ? null : String(serialized);
  }

  serialize(deserialized) {
    return isNone(deserialized) ? null : String(deserialized);
  }

  conditionsForFilter() {
    return {
      'eq': 'Text equal',
      'neq': 'Text not equal',
      'like': 'Text like',
      'nlike': 'Text not like',
      'hasAttr': 'Text has attribute',
    };
  }

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
  }

  componentForFilter() {
    return { name: 'flexberry-textbox', properties: { class: 'compact fluid' } };
  }

  getOdataValue(predicateValue) {
    return `'${String(predicateValue).replace(/'/g, `''`)}'`;
  }
};
