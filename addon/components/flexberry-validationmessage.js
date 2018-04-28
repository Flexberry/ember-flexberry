/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import { computed } from '@ember/object';

/**
  Component for showing error message from model validators.

  @class FlexberryValidationmessage
  @extends Ember.Component
*/
export default Component.extend({
  /**
    A list of properties of the view to apply as class names. If the property is a string value, the value of that string will be applied as a class name.

    @property classNameBindings
    @type Array
    @default ['color', 'pointing']
  */
  classNameBindings: ['color', 'pointing'],

  /**
    Default classes for component wrapper.
  */
  classNames: ['ui', 'basic', 'label'],

  /**
    Error messages array or error text for shown.
    Typically uses Ember.Model.errors for specific attribute, plain test also supported.

    @example
      {{flexberry-validationmessage error=model.errors.email}}

    @property error
    @type Array|String
  */
  error: undefined,

  /**
    Semantic color class name for label text.

    @property color
    @type String
    @default 'red'
  */
  color: 'red',

  /**
    Label pointing direction.
    Possible variants: '', pointing, pointing above, pointing below, left pointing, right pointing.

    @property pointing
    @type String
    @default ''
  */
  pointing: '',

  /**
    If error property isn't exists, the component will appear hidden in DOM.

    @property isVisible
    @type Boolean
    @readOnly
  */
  isVisible: computed('error', function() {
    let error = this.get('error');
    return !!(Array.isArray(error) ? error.length : error);
  }),

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {
    this._super(...arguments);

    let pointing = this.get('pointing');
    if (pointing) {
      let possiblePointings = [
        '',
        'pointing',
        'pointing above',
        'pointing below',
        'left pointing',
        'right pointing'];
      if (possiblePointings.indexOf(pointing) === -1) {
        let messagePointings = possiblePointings.map(function(item) {
          return `'${item}'`;
        });
        throw new Error(
          `Wrong value of flexberry-validationmessage pointing property, actual is '${pointing}', possible values are: ${messagePointings}`);
      }
    }
  }
});
