/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * @class ObjectListViewCell
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * Overload wrapper tag name for disabling wrapper.
   *
   * @property tagName
   * @type String
   * @default ''
   * @readOnly
   */
  tagName: '',

  /**
   * Displaying value.
   *
   * @property value
   * @type String
   * @default undefined
   */
  value: undefined,

  /**
   * Formatted displaying value.
   *
   * @property formattedValue
   * @type String
   * @readonly
   */
  formattedValue: Ember.computed('value', function() {
    var value = this.get('value');
    var valueType = Ember.typeOf(value);

    switch (valueType) {
      case 'date':

        // Convert date to string.
        // Locale is current 'locale' from i18n, format is current 'moment.defaultFormat' from config/environment).
        return this.get('moment').moment(value).format();
      default:
        return value;
    }
  })
});
