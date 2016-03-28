/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import Proj from 'ember-flexberry-projections';
import EmberValidations from 'ember-validations';

/**
 * Base model for 'ember-flexberry' models.
 *
 * @class BaseModel
 * @extends Ember.Controller
 * @uses Proj.Model
 * @uses EmberValidationsMixin
 * @uses Ember.EventedMixin
 *
 * @event preSave
 * @param {Object} event Event object.
 * @param {Promise[]} promises Array to which custom 'preSave' promises could be pushed.
 */
export default Proj.Model.extend(EmberValidations, Ember.Evented, {
  /**
   * Model validation rules.
   *
   * @property validations
   * @type Object
   */
  validations: {
  },

  /**
   * Checks that model satisfies validation rules defined in 'validations' property.
   *
   * @method validate
   * @param {Object} [options] Method options.
   * @param {Boolean} [options.validateDeleted = true] Flag: indicates whether to validate model, if it is deleted, or not.
   * @return {Promise} A promise that will be resolved if model satisfies validation rules defined in 'validations' property.
   */
  validate: function(options) {
    options = Ember.merge({ validateDeleted: true }, options || {});
    if (options.validateDeleted === false && this.get('isDeleted')) {
      // Return resolved promise, because validation is unnecessary for deleted model.
      return new Ember.RSVP.Promise((resolve, reject) => {
        resolve();
      });
    }

    // Return normal validation promise without any additional logic.
    return this._super(...arguments);
  },

  /**
   * Triggers model's 'preSave' event & allows to execute some additional async logic before model will be saved.
   *
   * @method beforeSave
   * @return {Promise} A promise that will be resolved after all 'preSave' event handlers promises will be resolved.
   */
  beforeSave: function() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      // Trigger 'preSave' event, and  give its handlers possibility to add async operations promises.
      var preSaveEventArgs = { promises: [] };
      this.trigger('preSave', preSaveEventArgs);

      // Promises array could be totally changed in 'preSave' event handlers, we should prevent possible errors.
      preSaveEventArgs.promises = Ember.isArray(preSaveEventArgs.promises) ? preSaveEventArgs.promises : [];
      preSaveEventArgs.promises = preSaveEventArgs.promises.filter(function(item, index, array) {
        return item instanceof Ember.RSVP.Promise;
      });

      Ember.RSVP.all(preSaveEventArgs.promises).then((values) => {
        resolve(values);
      }).catch((reason) => {
        reject(reason);
      });
    });
  },

  /**
   * Validates model, triggers 'preSave' event, and finally saves model.
   *
   * @method save
   * @return {Promise} A promise that will be resolved after model will be successfully saved.
   */
  save: function() {
    var saveArguments = arguments;

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.validate({
        validateDeleted: false
      }).then(() => {
        return this.beforeSave();
      }).then(() => {
        // Call to base class 'save' method with right context.
        // The problem is that call to current save method will be already finished,
        // and traditional _this._super will point to something else, but not to Proj.Model 'save' method,
        // so there is no other way, except to call it through the base class prototype.
        return Proj.Model.prototype.save.apply(this, saveArguments);
      }).then((value) => {
        // Model validation was successful (model is valid or deleted),
        // all 'preSave' event promises has been successfully resolved,
        // finally model has been successfully saved,
        // so we can resolve 'save' promise.
        resolve(value);
      }).catch((reason) => {
        // Any of 'validate', 'beforeSave' or 'save' promises has been rejected,
        // so we should reject 'save' promise.
        reject(reason);
      });
    });
  },

  /**
   * Turns model into 'updated.uncommitted' state.
   *
   * @method makeDirty
   */
  makeDirty: function() {
    // Transition into the `updated.uncommitted` state
    // if the model in the `saved` state (no local changes).
    // Alternative: this.get('currentState').becomeDirty();
    this.send('becomeDirty');
  }
});
