import Ember from 'ember';
import EmberValidations from 'ember-validations';
import ValidationData from '../objects/validation-data';
import DS from 'ember-data';

export default Ember.Mixin.create(EmberValidations, Ember.Evented, {
  /**
   * Model validation rules.
   */
  validations: {},

  /**
   * Save model method.
   */
  save: function() {
    var _this = this;
    var saveArguments = arguments;

    if (!_this.get('isDeleted')) {
      var validationData = ValidationData.create({
        anyErrors: _this.get('isInvalid')
      });
      validationData.fillErrorsFromProjectedModel(_this);

      if (validationData.anyErrors) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
          reject(validationData);
        });
      }
    }

    // Arguments for model 'preSave'.
    var presaveEventArgs = {
      promises: []
    };

    // Trigger 'preSave' event, and  give its handlers possibility to add async operations promises.
    _this.trigger('preSave', presaveEventArgs);

    // Promises array could be totally changed in event handlers, we should prevent possible errors.
    presaveEventArgs.promises = Ember.isArray(presaveEventArgs.promises) ? presaveEventArgs.promises : [];
    presaveEventArgs.promises = presaveEventArgs.promises.filter(function(item, index, array) {
      return item instanceof Ember.RSVP.Promise;
    });

    return new Ember.RSVP.Promise(function(resolve, reject) {
      // Wait for all 'preSave' promises to be resolved.
      Ember.RSVP.all(presaveEventArgs.promises).then(function(values) {
        // If all of 'preSave' promises has been successfully resolved, then call base class 'save' method.
        // The problem is that call to current save method is already finished,
        // and traditional _this._super will point to something else, but not to DS.Model.save method,
        // so there is no other way, except to call it through the base class prototype.
        var savePromise = DS.Model.prototype.save.apply(_this, saveArguments);
        if (savePromise && savePromise.then) {
          savePromise.then(function(value) {
            // Model has been successfully saved.
            resolve(value);
          }, function(reason) {
            // Model save has been failed.
            reject(reason);
          });
        } else {
          reject('Model save method did not return promise.');
        }
      }, function(reason) {
        // If any of 'preSave' promises has been rejected, don't save model & reject.
        reject(reason);
      });
    });
  }
});
