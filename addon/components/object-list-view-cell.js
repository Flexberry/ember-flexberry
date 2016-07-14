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
        return value ? this.get('i18n').t('components.object-list-view-cell.boolean-true-caption')
          : this.get('i18n').t('components.object-list-view-cell.boolean-false-caption');
      default:
        return value;
    }
  })
});
