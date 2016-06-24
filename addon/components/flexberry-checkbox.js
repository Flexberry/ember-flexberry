/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Checkbox component for Semantic UI.
 *
 * @class FlexberryCheckboxComponent
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
    Classes for component wrapper.
  */
  class: '',

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryCheckbox'
   */
  appConfigSettingsPath: 'APP.components.flexberryCheckbox',

  /**
   * Current checked value.
   *
   * @property value
   * @type Boolean
   * @default false
   */
  value: false,

  /**
   * Label for the checkbox.
   *
   * @property label
   * @type String
   * @default undefined
   */
  label: undefined,

  /**
   * DOM-element representing checkbox input.
   *
   * @property checkboxInput
   * @type Object
   */
  checkboxInput: null,

  /**
   * Checkbox value's observer.
   */
  valueDidChange: Ember.observer('value', function() {
    this.sendAction('onChange', {
      checked: this.get('value')
    });
  }),

  /**
   * Initializes checkbox component.
   */
  init: function() {
    this._super(...arguments);
  }
});
