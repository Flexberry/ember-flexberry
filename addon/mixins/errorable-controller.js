import Ember from 'ember';
import ValidationData from '../objects/validation-data';

export default Ember.Mixin.create({
  init: function() {
    this._super.apply(this, arguments);
    this.set('errorMessages', Ember.A([]));
  },

  actions: {
    addErrorMessage: function(msg) {
      this.get('errorMessages').pushObject(msg);
    },

    dismissErrorMessages: function() {
      this.get('errorMessages').clear();
    }
  },

  rejectError: function(errorData, message) {
    if (errorData instanceof ValidationData) {
      this._rejectValidationError(errorData, message);
    } else if (errorData instanceof Error) {
      this._rejectError(errorData, message);
    } else if (errorData.hasOwnProperty('responseText')) {
      this._rejectAjaxError(errorData, message);
    } else if (Ember.typeOf(errorData) === 'string') {
      this._rejectStringError(errorData, message);
    } else {
      this.send('addErrorMessage', 'Unknown error occurred.');
    }
  },

  _rejectError: function(errorData, message) {
    this.send('addErrorMessage', message + ' ' + errorData.message);
    if (Ember.isArray(errorData.errors) && errorData.errors.length > 0) {
      var errors = errorData.errors;
      for (var i = 0, len = errors.length; i < len; i++) {
        var error = errors[i];
        this.send('addErrorMessage', error.status + ' - ' + error.title);
      }
    }
  },

  _rejectValidationError: function(validationError, message) {
    if (validationError.anyErrors) {
      // TODO: more detail message about validation errors.
      this.send('addErrorMessage', message + ' There are validation errors.');
    } else {
      this.send('addErrorMessage', 'Unknown validation error.');
    }
  },

  _rejectAjaxError: function(xhr, message) {
    var ajaxErrorMessage = Ember.get(xhr, 'responseJSON.error.message') || xhr.statusText;
    this.send('addErrorMessage', message + ' ' + ajaxErrorMessage);
  },

  _rejectStringError: function(errorText, message) {
    this.send('addErrorMessage', message + ' ' + errorText);
  }
});
