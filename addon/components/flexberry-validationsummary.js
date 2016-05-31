/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  ValidationSummary component for Semantic UI.

  @class FlexberryValidationsummary
  @extends Ember.Component
*/
export default Ember.Component.extend({
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

    @private
    @property validationProperties
  */
  validationProperties: undefined,

  /**
    Current errors messages

    @property messages
    @type Ember.A
  */
  messages: undefined,

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

    this.set('validationProperties', new Ember.A());

    for (let propertyName in errors) {
      if (errors.hasOwnProperty(propertyName)) {
        this.get('validationProperties').push(propertyName);
        errors.addObserver(propertyName + '.[]', this, 'changeMessages');
      }
    }

    this.get('classNames').push(this.get('color'));
    this.changeMessages();
  },

  /**
    Push validation errors to messages array
    and change component visibility if no errors occurred.
  */
  changeMessages() {
    let messages = new Ember.A();

    this.get('validationProperties').forEach(property =>
      messages.addObjects(this.get('errors.' + property))
    );

    this.set('isVisible', !!messages.length);
    this.set('messages', messages);
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](http://emberjs.com/api/classes/Ember.Component.html#method_willDestroy) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroy() {
    let errors = this.get('errors');
    this.get('validationProperties').forEach(propertyName => errors.removeObserver(propertyName + '.[]', this, 'changeMessages'));
    this._super(...arguments);
  }
});
