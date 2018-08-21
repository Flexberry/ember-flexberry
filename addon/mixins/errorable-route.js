import Ember from 'ember';

/**
  Mixin for handling errors.

  @class ErrorableRouteMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
  @public
*/
export default Ember.Mixin.create({
  actions: {
    /**
      Event handler for processing promise model rejecting.
      [More info](https://emberjs.com/api/ember/2.4/classes/Ember.Route/events/error?anchor=error).

      @method actions.error
      @param {Object} error
      @param {Object} transition
    */
    error: function(error, transition) {
      this.handleError(error, transition);
    },

    handleError: function(error, transition) {
      this.handleError(error, transition);
    }
  },

  /**
    This method will be invoked during any of route hooks return a promise that rejects.

    @method handleError.
    @param {Object} errorData Error info.
    @param {Transition} transition Current transition object.
  */
  handleError(errorData, transition) {
    errorData = errorData || {};
    this._updateErrorToDisplay(errorData);
    if (!this.get('controller') || !this.get('controller.model') || this.get('controller.model.isLoading') || (transition && transition.isActive !== false)) {
      this.get('appState').error();
      errorData.retryRoute = this.routeName;

      // Trying to figure out if there is an id param.
      errorData.id = transition && transition.params[this.routeName] ? transition.params[this.routeName].id : undefined;

      transition.abort();
      this.intermediateTransitionTo('error', errorData);
    } else {
      this.controller.send('error', errorData);
    }
  },

  /**
    This method checks error message and makes some messages more appropriate for perception.

    @method _updateErrorToDisplay.
    @param {Object} errorData Data with error description and details.
    @private
  */
  _updateErrorToDisplay(errorData) {
    let msg;
    if (Ember.isArray(errorData)) {
      for (let i = 0; i < errorData.length; i++) {
        if (errorData[i].state && errorData[i].state === 'rejected') {
          msg += errorData[i].reason.message;
          msg += i !== (errorData.length - 1) ? '<br>' : '';
        }
      }
    } else {
      msg = errorData.message;
    }

    let message = msg ? msg.replace(/\n/g, ' ') : '';
    if (message.indexOf('Ember Data Request') !== -1 && message.indexOf('returned a 0 Payload (Empty Content-Type)') !== -1) {
      errorData.nameLocaleKey = 'forms.error-form.error';
      errorData.messageLocaleKey = 'forms.error-form.ember-data-request';
    } else if (message.indexOf('Invalid sorting value') !== -1) {
      errorData.nameLocaleKey = 'forms.error-form.error';
      errorData.messageLocaleKey = 'forms.error-form.invalid-sorting-value';
    }

  },

  resetController(controller, isExiting, transition) {
    if (isExiting) {
      if (controller.get('isSortingError')) {
        controller.set('sort', null);
        controller.set('isSortingError', undefined);
      }
    }
  }
});
