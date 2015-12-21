import Ember from 'ember';
import ValidationData from '../objects/validation-data';

export default Ember.Mixin.create({
  init: function() {
    this._super.apply(this, arguments);
    this.set('errorMessages', Ember.A([]));
  },

  actions:{
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
    } else if (errorData.hasOwnProperty('responseText')) {
      this._rejectAjaxError(errorData, message);
    } else if (Ember.typeOf(errorData) === 'string') {
      this._rejectCommonError(errorData, message);
    } else {
      this.send('addErrorMessage', 'Unknown error occurred.');
      throw new Error('Unknown error has been rejected.');
    }
  },

  _rejectValidationError: function(validationError, message) {
    if (validationError.anyErrors) {
      // TODO: more detail message about validation errors.
      this.send('addErrorMessage', 'There are validation errors.');
      alert(message);
    } else if (validationError.noChanges) {
      alert('There are no changes.');
    } else {
      this.send('addErrorMessage', 'Error occured.');
      throw new Error('Unknown validation error.');
    }
  },

  _rejectAjaxError: function(xhr, message) {
    var ajaxErrorMessage = Ember.get(xhr, 'responseJSON.error.message') || xhr.statusText;

    if (responseJson.error && responseJson.error.message) {
      this.send('addErrorMessage', responseJson.error.message);
    }

    alert(message);
  },

  _rejectCommonError: function(errorText, message) {
    this.send('addErrorMessage', errorText);
    alert(message);
  }
});
