import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

export default FlexberryBaseComponent.extend({
  /**
    Overload wrapper tag name for disabling wrapper.
  */
  tagName: '',

  /**
    Displaying value.

    @property value
    @type String
  */
  value: undefined,

  /**
    Max number of displayed symbols.
    Unlimited when 0.

    @property maxTextLength
    @type Integer
  */
  maxTextLength: 0,

  /**
    Indicates when component value cuts by spaces.

    @property cutBySpaces
    @type Boolean
  */
  cutBySpaces: false,

  /**
    Displaying value.

    @property displayValue
    @type String
    @readOnly
  */
  displayValue: Ember.computed('value', 'maxTextLength', 'cutBySpaces', function() {
    const value = this.get('value');
    const maxTextLength = this.get('maxTextLength');

    if (Ember.isBlank(value) || !maxTextLength) {
      return value;
    }

    const cutBySpaces = this.get('cutBySpaces');
    const formattedValue = String(value);

    let result = formattedValue.substr(0, maxTextLength);
    if (cutBySpaces && formattedValue[maxTextLength] !== ' ') {
      const spaceIndex = result.lastIndexOf(' ');
      if (spaceIndex > -1) {
        result = result.substring(0, spaceIndex);
      }
    }

    return result === formattedValue ? result : result + '...';
  }).readOnly(),

  /**
    Title value.

    @property titleValue
    @type String
    @readOnly
  */
  titleValue: Ember.computed('value', 'displayValue', function() {
    let value = this.get('value');
    const displayValue = this.get('displayValue');

    if (Ember.typeOf(value) !== Ember.typeOf(displayValue)) {
      value = String(value);
    }

    return value !== displayValue ? value : '';
  }).readOnly(),
});
