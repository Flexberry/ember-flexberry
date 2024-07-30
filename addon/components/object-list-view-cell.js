/**
  @module ember-flexberry
*/

import { computed } from '@ember/object';
import { typeOf, isNone } from '@ember/utils';
import { htmlSafe } from '@ember/template';
import FlexberryBaseComponent from './flexberry-base-component';
import cutStringByLength from '../utils/cut-string-by-length';

/**
  @class ObjectListViewCell
  @extends FlexberryBaseComponent
*/
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
    Date format.

    @property dateFormat
    @type String
    @default undefined
  */
  dateFormat: undefined,

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
    Path to property for display.

    @property displayMemberPath
    @type String
    @default undefined
  */
  displayMemberPath: undefined,

  /**
    Formatted displaying value.

    @property formattedValue
    @type String
    @readOnly
  */
  formattedValue: computed('value', 'dateFormat', function() {
    let value = this.get('value');
    let valueType = typeOf(value);

    switch (valueType) {
      case 'date': {

        // Convert date to string.
        // Locale is current 'locale' from i18n, format is current 'moment.defaultFormat' from config/environment).
        let momentValue = this.get('moment').moment(value);
        let dateFormat = this.get('dateFormat');
        return dateFormat ? momentValue.format(dateFormat) : momentValue.format();
      }

      case 'boolean': {
        return htmlSafe(`<div class='ui checkbox disabled'><input type='checkbox' class='hidden' ${value ? 'checked' : ''}><label></label></div>`);
      }

      default: {
        return value;
      }
    }
  }),

  /**
    Displaying value.

    @property displayValue
    @type String
    @readOnly
  */
  displayValue: computed('formattedValue', 'maxTextLength', 'cutBySpaces', function() {
    const value = this.get('value');
    const valueType = typeOf(value);
    const maxTextLength = this.get('maxTextLength');
    let formattedValue = this.get('formattedValue');

    const displayMemberPath = this.get('displayMemberPath');
    if (!isNone(displayMemberPath) && formattedValue.get) {
      formattedValue = formattedValue.get(displayMemberPath);
    }

    if (valueType === 'boolean') {
      return formattedValue;
    }

    const cutBySpaces = this.get('cutBySpaces');

    return cutStringByLength(formattedValue, maxTextLength, cutBySpaces);
  }).readOnly(),

  /**
    Title value.

    @property titleValue
    @type String
    @readOnly
  */
  titleValue: computed('formattedValue', 'displayValue', 'displayMemberPath', function() {
    let formattedValue = this.get('formattedValue');
    const displayValue = this.get('displayValue');

    const displayMemberPath = this.get('displayMemberPath');
    if (!isNone(displayMemberPath) && formattedValue.get) {
      formattedValue = formattedValue.get(displayMemberPath);
    }

    if (typeOf(formattedValue) !== typeOf(displayValue)) {
      formattedValue = String(formattedValue);
    }

    return formattedValue !== displayValue ? formattedValue : '';
  }).readOnly(),
});
