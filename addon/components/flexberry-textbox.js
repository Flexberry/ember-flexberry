/**
  @module ember-flexberry
*/

import FlexberryBaseComponent from './flexberry-base-component';
import { inject as service } from '@ember/service';

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
  intl: service(),

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
    @default 't('components.flexberry-textbox.placeholder')'
  */
  placeholder: undefined,

  /**
    Array CSS class names.
    [More info.](https://emberjs.com/api/ember/release/classes/Component#property_classNames)

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['flexberry-textbox', 'ui', 'input'],

  /**
    Type of html input.

    @property type
    @type String
    @default 'text'
   */
  type: 'text',

  /**
    Specifies the maximum number of characters (in UTF-16 code units) that the user can enter.
    Working only with input types: text, email, search, password, tel, or url.

    @property maxlength
    @type Number
    @default undefined
   */
  maxlength: undefined,

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

    this.set('placeholder', this.intl.t('components.flexberry-textbox.placeholder'));

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'placeholder', defaultValue: null });
  }
});
