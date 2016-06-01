/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
 * Textbox component for Semantic UI.
 *
 * @class FlexberryTextbox
 * @extends FlexberryBaseComponent
 */
var FlexberryTextbox = FlexberryBaseComponent.extend({
  /**
   * Default classes for component wrapper.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['flexberry-textbox', 'ui', 'input', 'fluid'],

  /**
    Array CSS class names bindings.
    [More info.](http://emberjs.com/api/classes/Ember.Component.html#property_classNameBindings)
    @property classNameBindings
    @type Array
    @readOnly
   */
  classNameBindings: ['readonly:disabled'],

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryTextbox'
   */
  appConfigSettingsPath: 'APP.components.flexberryTextbox',

  /**
   * Input value.
   *
   * @property value
   * @type String
   * @default undefined
   */
  value: undefined,

  /**
   * The placeholder attribute.
   *
   * @property placeholder
   * @type Sring
   * @default 't('components.flexberry-textbox.placeholder')'
   */
  placeholder: t('components.flexberry-textbox.placeholder'),

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'placeholder', defaultValue: null });
  }
});

export default FlexberryTextbox;
