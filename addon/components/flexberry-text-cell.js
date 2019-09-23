import Ember from 'ember';
import OlvCell from './object-list-view-cell';

export default OlvCell.extend({
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
    const reg = new RegExp(`^(.{1,${maxTextLength}}${cutBySpaces ? '(?=\\s|$)' : ''}|.{1,${maxTextLength}})`);

    formattedValue = String(formattedValue);

    const result = formattedValue.match(reg)[0];

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
