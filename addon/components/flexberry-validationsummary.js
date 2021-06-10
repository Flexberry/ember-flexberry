/**
  @module ember-flexberry
*/

import Ember from 'ember';
import Errors from 'ember-validations/errors';

const { get, set, computed } = Ember;

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

    @property validationProperties
    @private
  */
  validationProperties: undefined,

  /**
    Current errors messages.

    @property messages
    @type Ember.A
  */
  messages: Ember.computed('_messages', '_errorsListChanged', function() {
    var errors = Ember.get(this, 'errors');
    var validationProperties = Ember.get(this, 'validationProperties');
    var actualValidationProperties = new Ember.A();
    var needActualizeValidationProperties = false;

    validationProperties.forEach(propertyName => {
      needActualizeValidationProperties = needActualizeValidationProperties
          || (!errors.hasOwnProperty(propertyName) && !Ember.get(this, '_wrongErrorsPropertiesList').contains(propertyName));
    });

    for (let propertyName in errors) {
      if (errors.hasOwnProperty(propertyName) && !Ember.get(this, '_wrongErrorsPropertiesList').contains(propertyName)) {
        actualValidationProperties.push(propertyName);
        needActualizeValidationProperties = needActualizeValidationProperties || !validationProperties.contains(propertyName);
      }
    }

    if (needActualizeValidationProperties) {
      Ember.set(this, 'validationProperties', actualValidationProperties);
      Ember.set(
        this,
        "_messages",
        Ember.computed(this._getMessageComputingKey(actualValidationProperties), Ember.get(this, '_recomputeMessage')));
    }

    var realMessages =  Ember.get(this, '_messages');
    Ember.set(this, 'isVisible', !!realMessages.length);
    return realMessages;
  }),

  /**
    Header of validationsummary

    @property headerText
    @type String
  */
  headerText: undefined,

  /**
    Flag indicating that there is added a new property to errors object.

    @property _errorsListChanged
    @type Boolean
    @private
  */
  _errorsListChanged: false,

  /**
    A list of properties that should not be observed.

    @property _wrongErrorsPropertiesList
    @type Array
    @private
  */
  _wrongErrorsPropertiesList: Ember.A(['toString', '_super', 'setUnknownProperty']),

  /**
   Current errors messages

    @property _messages
    @type Ember.A
    @private
  */
  _messages: undefined,

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {
    this._super(...arguments);

    let errors = Ember.get(this, 'errors');

    if (!errors) {
      throw new Error('Errors property for flexberry-validationsummary component must be set');
    }

    let validationProperties = new Ember.A();

    for (let propertyName in errors) {
      // TODO: Delete after update Ember on 2.5.1 and up.
      if (errors.hasOwnProperty(propertyName) && !Ember.get(this, '_wrongErrorsPropertiesList').contains(propertyName)) {
        validationProperties.push(propertyName);
      }
    }

    Ember.set(this, 'validationProperties', validationProperties);
    Ember.get(this, 'classNames').push(Ember.get(this, 'color'));

    if (errors instanceof Errors) {
      errors.on('errorListChanged', this, this._onErrorListChanged);
    }

    set(this, '_messages', computed(this._getMessageComputingKey(validationProperties), this._recomputeMessage));
  },

  willDestroy() {
    const errors = get(this, 'errors');
    if (errors instanceof Errors) {
      errors.off('errorListChanged', this, this._onErrorListChanged);
    }
  },

  _onErrorListChanged() {
    set(this, '_errorsListChanged', !get(this, '_errorsListChanged'));
  },

  /**
    This method returns validation error messages.

    @method _recomputeMessage
    @private

    @return {Ember.A} Validation error messages.
  */
  _recomputeMessage: function() {
    let messages = new Ember.A();

    Ember.get(this, 'validationProperties').forEach((property) => {
      // TODO: Delete after update Ember on 2.5.1 and up.
      if (!Ember.get(this, '_wrongErrorsPropertiesList').contains(property)) {
        let errorMessages = Ember.get(this, 'errors.' + property);
        errorMessages.forEach((errorMessage) => {
          messages.pushObject(errorMessage);
        });
      }
    });

    return messages;
  },

  /**
    This method returns key forcreated in runtime computed property.
    This computed property observes changes in arrays that are kept in properties of errors object.

    @method _getMessageComputingKey
    @private

    @param {Ember.A} validationProperties List of properties computed property should observe for.
    @return {String} Key for compo.
  */
  _getMessageComputingKey: function(validationProperties) {
    var computingKey = ``;
    validationProperties.forEach(propertyName => {
      computingKey = (computingKey !== '' ? `${computingKey},` : '') + `${propertyName}.[]`;
    });

    computingKey = computingKey !== '' ? `errors.{${computingKey}}` : 'errors';

    return computingKey;
  },
});
