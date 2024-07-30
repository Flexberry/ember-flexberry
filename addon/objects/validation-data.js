import EmberObject from '@ember/object';

/**
  @class ValidationDataObject
  @extends <a href="https://emberjs.com/api/ember/release/classes/EmberObject">EmberObject</a>
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
    @type EmberObject
    @default {}
  */
  errors: undefined,

  init() {
    this._super(...arguments);
    this.set('errors', {});
  },

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
