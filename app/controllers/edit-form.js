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
        this._onSaveFulfilled.bind(this),
        this._onSaveRejected.bind(this));
    },

    deleteRecord: function () {
      if (confirm('Are you sure you want to delete that record?')) {
        let model = this.get('model');
        let self = this;
        model.destroyRecord().then(function() {
          self.transitionToParentRoute();
        }, function (errorData) {
          if (self._throwAjaxError(errorData, 'Delete failed')) {
            return;
          }
          throw new Error('Unknown error has been rejected.');
        });
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

  _onSaveFulfilled: function() {
    alert('Saved');
  },

  _onSaveRejected: function(errorData) {
    if (this._throwValidationError(errorData)) {
      return;
    }

    if (this._throwAjaxError(errorData, 'Save failed')) {
      return;
    }

    throw new Error('Unknown error has been rejected.');
  },

  _throwValidationError: function(validationError) {
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

  _throwAjaxError: function(ajaxError, message) {
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
