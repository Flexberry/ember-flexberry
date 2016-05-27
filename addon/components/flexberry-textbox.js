/**
  @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

/**
  Textbox component for Semantic UI.

  Sample usage:
  ```handlebars
  {{flexberry-textbox
    value=model.name
    placeholder='Name'
  }}
  ```

  @class FlexberryTextbox
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
    Array CSS class names.
    [More info.](http://emberjs.com/api/classes/Ember.Component.html#property_classNames)

    @property classNames
    @type Array
    @readOnly
   */
  classNames: ['flexberry-textbox', 'ui', 'input', 'fluid'],

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberryTextbox'
   */
  appConfigSettingsPath: 'APP.components.flexberryTextbox',

  /**
    Initializes component.
   */
  init() {
    this._super(...arguments);

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'placeholder', defaultValue: null });
  },
});
