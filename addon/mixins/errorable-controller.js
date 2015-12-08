import Ember from 'ember';
import ValidationData from '../objects/validation-data';

export default Ember.Mixin.create({
  init: function() {
    this._super.apply(this, arguments);
    this.set('errorMessages', []);
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
    } else {
      this.send('addErrorMessage', 'Error occured.');
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

  _rejectAjaxError: function(ajaxError, message) {
    var respJson = ajaxError.responseJSON;
    Ember.assert('XMLHttpRequest has responseJSON property', respJson);

    if (respJson.error && respJson.error.message) {
      this.send('addErrorMessage', respJson.error.message);
    }

    alert(message);
  }
});
