/**
  @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

/**
  Field component for Semantic UI.

  Sample usage:
  ```handlebars
  {{flexberry-field value=model.name label='Name'}}
  ```

  @class FlexberryField
  @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
    Input value.

    @property value
    @type String
   */
  value: undefined,

  /**
    Text to be displayed in field, if field has not been filled.

    @property placeholder
    @type String
   */
  placeholder: undefined,

  /**
    Label for field.

    @property label
    @type String
   */
  label: undefined,

  /**
    Array CSS class names.
    [More info.](http://emberjs.com/api/classes/Ember.Component.html#property_classNames)

    @property classNames
    @type Array
    @readOnly
   */
  classNames: ['flexberry-field', 'field'],

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberryField'
   */
  appConfigSettingsPath: 'APP.components.flexberryField',

  /**
    Initializes component.
   */
  init() {
    this._super(...arguments);

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'placeholder', defaultValue: null });
  },
});
