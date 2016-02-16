/**
 * @module ember-flexberry
 */
import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * @class FlexberryDropDown
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
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryBaseComponent'
   */
  appConfigSettingsPath: 'APP.components.flexberryDropdown',

  /**
   * Dropdown type from semantic ui ('fluid', 'compact', ...).
   *
   * @property type
   * @type String
   * @default 'fluid'
   */
  type: 'fluid',

  /**
   * Default text (wil be displayed if there is no selected item).
   *
   * @property defaultText
   * @type String
   * @default ''
   */
  defaultText: undefined,

  /**
   * Selected item.
   *
   * @property value
   * @type String
   * @default null
   */
  value: null,

  /**
   * Available items.
   *
   * @property items
   * @type Array
   * @default []
   */
  items: [],

  /**
   * Currently displaying text.
   *
   * @property text
   * @type String
   */
  currentText: Ember.computed('value', 'defaultText', function() {
    var value = this.get('value');
    if (Ember.typeOf(value) === 'string') {
      return value;
    }

    var defaultText = this.get('defaultText');
    if (Ember.typeOf(defaultText) === 'string') {
      return defaultText;
    }

    return '';
  }),

  /**
   * Handles changes in available items and in selected item.
   */
  itemsOrValueDidChange: Ember.on('init', Ember.observer('items.[]', 'value', function() {
    var items = this.get('items');
    var value = this.get('value');

    if (!Ember.isArray(items)) {
      throw new Error(`Wrong type of flexberry-dropdown \`items\` propery: actual type is ${Ember.typeOf(items)}, but array is expected.`);
    }

    if (!Ember.isNone(value) && items.indexOf(value) < 0) {
      throw new Error(`Wrong value of flexberry-dropdown \`value\` propery: \`items\` array does not contain \`${value}\` value.`);
    }
  })),

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'defaultText', defaultValue: '' });
  }
});
