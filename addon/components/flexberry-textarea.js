/**
  @module ember-flexberry
*/

import { computed } from '@ember/object';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
  Textarea component for Semantic UI.

  Sample usage:
  ```handlebars
  {{flexberry-textarea
    value=model.description
    placeholder='Enter description...'
  }}
  ```

  @class FlexberryTextarea
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Keeps `readonly` current value.

    @property _readonly
    @type Boolean
  */
  _readonly: undefined,

  /**
    Standard HTML attribute.

    @property readonly
    @type Boolean
  */
  readonly: computed('_readonly', {
    get() {
      return this.get('_readonly') === true ? true : undefined;
    },
    set(key, value) {
      return this.set('_readonly', value === true ? true : undefined);
    },
  }),

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
    @default 't('components.flexberry-textarea.placeholder')'
  */
  placeholder: t('components.flexberry-textarea.placeholder'),

  /**
    Array CSS class names.
    [More info.](https://emberjs.com/api/ember/release/classes/Component#property_classNames)

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['flexberry-textarea', 'ui', 'input'],

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberryTextarea'
  */
  appConfigSettingsPath: 'APP.components.flexberryTextarea',

  /**
    Table rows related to textarea.
    @type Integer
    @default 2
  */

  /* eslint-disable no-unused-vars */
  rows: computed({
    get(key) {
      this._super(...arguments);
    },
    set(key, value) {
      // IE does not handle null values.
      if (value === null || value === undefined)
      {
        return 2;
      }

      return value;
    }
  }),
  /* eslint-enable no-unused-vars */

  /**
    Table columns related to textarea.
    @type Integer
    @default 20
  */

  /* eslint-disable no-unused-vars */
  cols: computed({
    get(key) {
      this._super(...arguments);
    },
    set(key, value) {
      // IE does not handle null values.
      if (value === null || value === undefined)
      {
        return 20;
      }

      return value;
    }
  }),
  /* eslint-enable no-unused-vars */

  /**
    Initializes component.
  */
  init() {
    this._super(...arguments);

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'placeholder', defaultValue: null });
  },
});
