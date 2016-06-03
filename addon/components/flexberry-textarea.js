/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
 * Textarea component for Semantic UI.
 *
 * @class FlexberryTextarea
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * Default classes for component wrapper.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['flexberry-textarea', 'ui', 'input'],

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
   * @default 'APP.components.flexberryTextarea'
   */
  appConfigSettingsPath: 'APP.components.flexberryTextarea',

  /**
   * Input value.
   *
   * @property value
   * @type String
   */
  value: undefined,

  /**
   * The placeholder attribute.
   *
   * @property placeholder
   * @type String
   * @default 't('components.flexberry-textarea.placeholder')'
   */
  placeholder: t('components.flexberry-textarea.placeholder'),

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'placeholder', defaultValue: null });
  }
});
