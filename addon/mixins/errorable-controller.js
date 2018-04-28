import Mixin from '@ember/object/mixin';
import { A, isArray } from '@ember/array';
import { typeOf } from '@ember/utils';
import { get } from '@ember/object';
import ValidationData from '../objects/validation-data';

/**
  Mixin for handling errors.

  @class ErrorableControllerMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
  @public
*/
export default Mixin.create({
  actions: {
    /**
      Save the error.

      @method actions.error
      @param {Error} error
    */
    error(error) {
      this.set('error', error);
    },

    /**
      Add error message.

      @method actions.addErrorMessage
      @public
      @param {String} msg Message
    */
    addErrorMessage(msg) {
      this.get('errorMessages').pushObject(msg);
    },

    /**
      Dismiss error messages.

      @method actions.dismissErrorMessages
      @public
    */
    dismissErrorMessages() {
      this.get('errorMessages').clear();
    }
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {
    this._super(...arguments);
    this._super.apply(this, arguments);
    this.set('errorMessages', A([]));
  },

  /**
    Reject Error.

    @method rejectError
    @public

    @param {String} errorData
    @param {String} message
  */
  rejectError(errorData, message) {
    if (errorData instanceof ValidationData) {
      this._rejectValidationError(errorData, message);
    } else if (errorData instanceof Error) {
      this._rejectError(errorData, message);
    } else if (errorData.hasOwnProperty('responseText')) {
      this._rejectAjaxError(errorData, message);
    } else if (typeOf(errorData) === 'string') {
      this._rejectStringError(errorData, message);
    } else {
      this.send('addErrorMessage', 'Unknown error occurred.');
    }
  },

  _rejectError(errorData, message) {
    this.send('addErrorMessage', message + ' ' + errorData.message);
    if (isArray(errorData.errors) && errorData.errors.length > 0) {
      let errors = errorData.errors;
      for (let i = 0, len = errors.length; i < len; i++) {
        let error = errors[i];
        this.send('addErrorMessage', error.status + ' - ' + error.title);
      }
    }
  },

  _rejectValidationError(validationError, message) {
    if (validationError.anyErrors) {
      // TODO: more detail message about validation errors.
      this.send('addErrorMessage', message + ' There are validation errors.');
    } else {
      this.send('addErrorMessage', 'Unknown validation error.');
    }
  },

  _rejectAjaxError(xhr, message) {
    let ajaxErrorMessage = get(xhr, 'responseJSON.error.message') || xhr.statusText;
    this.send('addErrorMessage', message + ' ' + ajaxErrorMessage);
  },

  _rejectStringError(errorText, message) {
    this.send('addErrorMessage', message + ' ' + errorText);
  }
});
