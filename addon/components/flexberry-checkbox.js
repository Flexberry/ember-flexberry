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
    DOM-element representing semantic ui-checkbox component.

    @property checkboxDomElement
    @type Object
    @default null
  */
  checkboxDomElement: null,

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

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    For more information see [didInsertElement](http://emberjs.com/api/classes/Ember.Component.html#event_didInsertElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  didInsertElement() {
    this._super(...arguments);

    // We need to select and remember DOM-element representing ui-checkbox component,
    // but we can't just call to this.$('.flexberry-checkbox'), because ember will throw an error
    // "You cannot access this.$() on a component with tagName: ''.".
    // So we have to search our element in 'childViews' collection.
    let checkboxView = this.get('childViews').find(view => {
      let tagName = view.get('tagName');
      if (Ember.typeOf(tagName) === 'string') {
        tagName = tagName.trim();
      }

      return tagName !== '' && view.$().hasClass('flexberry-checkbox');
    });

    let checkboxDomElement = !Ember.isNone(checkboxView) ? checkboxView.$() : null;
    this.set('checkboxDomElement', checkboxDomElement);

    checkboxDomElement.checkbox({
      uncheckable: true
    });
  },
});
