/**
  @module ember-flexberry-dummy
 */

import Component from '@ember/component';
import { observer } from '@ember/object';
import { isNone } from '@ember/utils';

/**
  Number input component.

  @class NumberInputComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
 */
export default Component.extend({
  /**
    Override wrapper tag name to disable component's wrapping div.

    @property tagName
    @type String
    @default ''
   */
  tagName: '',

  /**
    Value typed through component's input.

    @property inputValue
    @type String
   */
  inputValue: undefined,

  /**
    Value typed through component's input & converted to number.

    @property value
    @type Number
   */
  value: undefined,

  /**
    Handles changes in inputValue.
   */
  inputValueDidChange: observer('inputValue', function() {
    let value = parseInt(this.get('inputValue'), 10);
    this.set('value', isNaN(value) ? undefined : value);
  }),

  /**
    Initializes component.
   */
  init() {
    this._super(...arguments);

    let value = this.get('value');
    if (!isNone(value)) {
      this.set('inputValue', '' + value);
    }
  }
});
