/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

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
  */
  value: undefined,

  /**
    Date format.

    @property dateFormat
    @type String
  */
  dateFormat: undefined,

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
    Path to property for display.

    @property displayMemberPath
    @type String
  */
  displayMemberPath: undefined,

  /**
    Formatted displaying value.

    @property formattedValue
    @type String
    @readOnly
  */
  formattedValue: Ember.computed('value', 'dateFormat', function() {
    let value = this.get('value');
    let valueType = Ember.typeOf(value);

    switch (valueType) {
      case 'date':

        // Convert date to string.
        // Locale is current 'locale' from i18n, format is current 'moment.defaultFormat' from config/environment).
        let momentValue = this.get('moment').moment(value);
        let dateFormat = this.get('dateFormat');
        return dateFormat ? momentValue.format(dateFormat) : momentValue.format();
      case 'boolean':
        return Ember.String.htmlSafe(`<div class='ui checkbox disabled'><input type='checkbox' class='hidden' ${value ? 'checked' : ''}><label></label></div>`);
      default:
        return value;
    }
  }),

  /**
    Displaying value.

    @property displayValue
    @type String
    @readOnly
  */
  displayValue: Ember.computed('formattedValue', 'maxTextLength', 'cutBySpaces', function() {
    const value = this.get('value');
    const valueType = Ember.typeOf(value);
    const maxTextLength = this.get('maxTextLength');
    let formattedValue = this.get('formattedValue');

    const displayMemberPath = this.get('displayMemberPath');
    if (!Ember.isNone(displayMemberPath) && formattedValue.get) {
      formattedValue = formattedValue.get(displayMemberPath);
    }

    if (valueType === 'boolean' || Ember.isBlank(value) || !maxTextLength) {
      return formattedValue;
    }

    const cutBySpaces = this.get('cutBySpaces');

    formattedValue = String(formattedValue);

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
  titleValue: Ember.computed('formattedValue', 'displayValue', 'displayMemberPath', function() {
    let formattedValue = this.get('formattedValue');
    const displayValue = this.get('displayValue');

    const displayMemberPath = this.get('displayMemberPath');
    if (!Ember.isNone(displayMemberPath) && formattedValue.get) {
      formattedValue = formattedValue.get(displayMemberPath);
    }

    if (Ember.typeOf(formattedValue) !== Ember.typeOf(displayValue)) {
      formattedValue = String(formattedValue);
    }

    return formattedValue !== displayValue ? formattedValue : '';
  }).readOnly(),
});
