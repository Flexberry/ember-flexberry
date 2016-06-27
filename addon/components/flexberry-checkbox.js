/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
  Checkbox component for Semantic UI.

  Sample usage:
  ```handlebars
  {{flexberry-checkbox checked=model.enabled label='Enabled'}}
  ```

  @class FlexberryCheckboxComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Current checked value.

    @property value
    @type Boolean
    @default false
   */
  value: false,

  /**
    Classes for component wrapper.
  */
  class: '',

  /**
    Label for the checkbox.

    @property label
    @type String
  */
  label: undefined,

  /**
    DOM-element representing checkbox input.

    @property checkboxInput
    @type Object
    @default null
  */
  checkboxInput: null,

  /**
    Overload wrapper tag name for disabling wrapper.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#property_tagName).

    @property tagName
    @type String
    @default ''
    @readOnly
  */
  tagName: '',

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberryCheckbox'
  */
  appConfigSettingsPath: 'APP.components.flexberryCheckbox',

  /**
    Checkbox value's observer.
  */
  _valueDidChange: Ember.observer('value', (self) => {
    self.sendAction('onChange', {
      checked: self.get('value'),
    });
  }),
});
