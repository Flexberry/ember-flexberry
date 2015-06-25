import Ember from 'ember';
import ValidationData from '../objects/validation-data';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import LookupFieldMixin from '../components/lookup-field/lookup-field-mixin';

export default Ember.Controller.extend(LookupFieldMixin, ErrorableControllerMixin, {

  // lookup controller name
  lookupControllerName: 'lookup-dialog',
  // lookup modal dialog name
  lookupDialogName: 'lookup-dialog',

  actions: {
    save: function() {
      this.send('dismissErrorMessages');
      let model = this.get('model');
      model.save().then(
        this._onSaveActionFulfilled.bind(this),
        this._onSaveActionRejected.bind(this));
    },

    delete: function () {
      if (confirm('Are you sure you want to delete that record?')) {
        let model = this.get('model');
        model.destroyRecord().then(
          this._onDeleteActionFulfilled.bind(this),
          this._onDeleteActionRejected.bind(this));
      }
    },

    close: function() {
      this.transitionToParentRoute();
    }
  },

  transitionToParentRoute: function () {
    // TODO: нужно учитывать пэйджинг.
    // Без сервера не обойтись, наверное. Нужно определять, на какую страницу редиректить.
    // Либо редиректить на что-то типа /{parentRoute}/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
    this.transitionToRoute(this.get('parentRoute'));
  },

  _onSaveActionFulfilled: function() {
    alert('Saved');
  },

  _onSaveActionRejected: function(errorData) {
    if (this._anyValidationErrors(errorData)) {
      return;
    }

    if (this._anyAjaxErrors(errorData, 'Save failed')) {
      return;
    }

    throw new Error('Unknown error has been rejected.');
  },

  _onDeleteActionFulfilled: function() {
    this.transitionToParentRoute();
  },

  _onDeleteActionRejected: function(errorData) {
    if (this._anyAjaxErrors(errorData, 'Delete failed')) {
      return;
    }
    throw new Error('Unknown error has been rejected.');
  },

  _anyValidationErrors: function(validationError) {
    if (!(validationError instanceof ValidationData)) {
      return false;
    }
    if (validationError.anyErrors) {
      // TODO: more detail message about validation errors.
      this.send('addErrorMessage', 'There are validation errors.');
      alert('Save failed');
    } else if (validationError.noChanges) {
      alert('There are no changes');
    } else {
      throw new Error('Unknown validation error.');
    }
    return true;
  },

  _anyAjaxErrors: function(ajaxError, message) {
    if (!(ajaxError && ajaxError.hasOwnProperty('responseText'))){
      return false;
    }

    var respJson = ajaxError.responseJSON;
    Ember.assert('XMLHttpRequest has responseJSON property', respJson);

    if (respJson.error && respJson.error.message) {
      this.send('addErrorMessage', respJson.error.message);
    }

    alert(message);
    return true;
  }
});
