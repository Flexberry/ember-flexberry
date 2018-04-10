/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import { A } from '@ember/array';

/**
  ValidationSummary component for Semantic UI.

  @class FlexberryValidationsummary
  @extends Ember.Component
*/
export default Component.extend({
  /**
    A list of properties of the view to apply as class names. If the property is a string value, the value of that string will be applied as a class name.

    @property classNameBindings
    @type Array
    @default ['color']
  */
  classNameBindings: ['color'],

  /**
    Default classes for component wrapper.
  */
  classNames: ['ui', 'message'],

  /**
    Semantic color class name for message text.

    @property color
    @type String
    @default 'red'
  */
  color: 'red',

  /**
    Errors object for display messages.

    @property errors
    @type Ember.Object
  */
  errors: undefined,

  /**
    Errors own properties with validation errors messages.

    @property validationProperties
    @private
  */
  validationProperties: undefined,

  /**
    Current errors messages

    @property messages
    @type Ember.A
  */
  messages: undefined,

  /**
    Header of validationsummary

    @property headerText
    @type String
  */
  headerText: undefined,

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {
    this._super(...arguments);

    let errors = this.get('errors');

    if (!errors) {
      throw new Error('Errors property for flexberry-validationsummary component must be set');
    }

    this.set('validationProperties', new A());

    for (let propertyName in errors) {
      // TODO: Delete after update Ember on 2.5.1 and up.
      if (errors.hasOwnProperty(propertyName) && propertyName !== 'toString') {
        this.get('validationProperties').push(propertyName);
        errors.addObserver(propertyName + '.[]', this, 'changeMessages');
      }
    }

    this.changeMessages();
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](http://emberjs.com/api/classes/Ember.Component.html#method_willDestroy) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroy() {
    let errors = this.get('errors');
    this.get('validationProperties').forEach(propertyName => errors.removeObserver(propertyName + '.[]', this, 'changeMessages'));
    this._super(...arguments);
  },

  /**
    Push validation errors to messages array
    and change component visibility if no errors occurred.
  */
  changeMessages() {
    let messages = new A();

    this.get('validationProperties').forEach((property) => {
      // TODO: Delete after update Ember on 2.5.1 and up.
      if (property !== 'toString') {
        let errorMessages = this.get('errors.' + property);
        errorMessages.forEach((errorMessage) => {
          messages.pushObject(errorMessage);
        });
      }
    });

    this.set('isVisible', !!messages.length);
    this.set('messages', messages);
  }
});
