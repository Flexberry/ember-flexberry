import EmberObject from '@ember/object';

/**
  @class ValidationDataObject
  @extends <a href="http://emberjs.com/api/classes/Ember.Object.html">Ember.Object</a>
  @public
*/
export default EmberObject.extend({
  /**
    noChanges property.

    @property noChanges
    @type Boolean
    @default true
  */
  noChanges: true,

  /**
    anyErrors property.

    @property anyErrors
    @type Boolean
    @default false
  */
  anyErrors: false,

  /**
    Errors object for display messages.

    @property errors
    @type Ember.Object
    @default {}
  */
  errors: {},

  /**
    addError method.

    @method addError

    @param propName
    @param value
  */
  addError(propName, value) {
    this.errors[propName] = value;
  },

  /**
    fillErrorsFromProjectedModel method.

    @method fillErrorsFromProjectedModel
    @param model
  */
  fillErrorsFromProjectedModel(model) {
    model.eachAttribute(name => {
      let propErrors = model.errors.get(name);
      if (propErrors.length > 0) {
        this.addError(name, propErrors);
      }
    });
  }
});
