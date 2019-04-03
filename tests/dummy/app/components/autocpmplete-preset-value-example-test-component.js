/**
  @module ember-flexberry-dummy
 */

import Ember from 'ember';

/**
  Number input component.

  @class NumberInputComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
 */
export default Ember.Component.extend({
    displayValue:undefined,
    value:undefined,
    /**
    Initializes component.
    */
    init() {
    this._super(...arguments);
    }
});
