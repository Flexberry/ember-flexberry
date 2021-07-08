import { computed } from '@ember/object';
import { typeOf } from '@ember/utils';
import FlexberryBaseComponent from './flexberry-base-component';
import cutStringByLength from '../utils/cut-string-by-length';

export default FlexberryBaseComponent.extend({
  /**
    Overload wrapper tag name for disabling wrapper.
  */
  tagName: '',

  /**
    Displaying value.

    @property value
    @type String
    @default undefined
  */
  value: undefined,

  /**
    Max number of displayed symbols.
    Unlimited when 0.

    @property maxTextLength
    @type Integer
    @default 0
  */
  maxTextLength: 0,

  /**
    Indicates when component value cuts by spaces.

    @property cutBySpaces
    @type Boolean
    @default false
  */
  cutBySpaces: false,

  /**
    Displaying value.

    @property displayValue
    @type String
    @readOnly
  */
  displayValue: computed('value', 'maxTextLength', 'cutBySpaces', function() {
    const value = this.get('value');
    const maxTextLength = this.get('maxTextLength');
    const cutBySpaces = this.get('cutBySpaces');

    return cutStringByLength(value, maxTextLength, cutBySpaces);
  }).readOnly(),

  /**
    Title value.

    @property titleValue
    @type String
    @readOnly
  */
  titleValue: computed('value', 'displayValue', function() {
    let value = this.get('value');
    const displayValue = this.get('displayValue');

    if (typeOf(value) !== typeOf(displayValue)) {
      value = String(value);
    }

    return value !== displayValue ? value : '';
  }).readOnly(),
});
