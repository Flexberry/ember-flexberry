/**
  @module ember-flexberry-dummy
*/

import Ember from 'ember';

/**
  Edit forms controllers mixin which handles save/delete operations indication.

  @class EditFormControllerOperationsIndicationMixin
*/
export default Ember.Mixin.create({
  actions: {
    /**
      Handler for success ui-message component 'onShow' action.

      @method actions.onSuccessMessageShow
     */
    onSuccessMessageShow() {
    },

    /**
      Handler for success ui-message component 'onHide' action.

      @method actions.onSuccessMessageHide
     */
    onSuccessMessageHide() {
      this.set('showFormSuccessMessage', undefined);
    },

    /**
      Handler for error ui-message component 'onShow' action.

      @method actions.onErrorMessageShow
     */
    onErrorMessageShow() {
    },

    /**
      Handler for error ui-message component 'onHide' action.

      @method actions.onErrorMessageHide
     */
    onErrorMessageHide() {
      this.set('showFormErrorMessage', undefined);
    }
  },

  /**
    Latest operation type ('save' or 'delete').

    @property latestOperationType.
    @type String
   */
  latestOperationType: undefined,

  /**
    Flag: indicates whether asynchronous operation is in progress or not.

    @property showFormSpinner.
    @type Boolean
   */
  showFormSpinner: undefined,

  /**
    Flag: indicates whether asynchronous operation succeed or not.

    @property showFormSuccessMessage.
    @type Boolean
   */
  showFormSuccessMessage: undefined,

  /**
    Success message caption related to current locale and operation type.

    @property formSuccessMessageCaption.
    @type String
   */
  formSuccessMessageCaption: Ember.computed('i18n.locale', 'latestOperationType', function() {
    let i18n = this.get('i18n');
    if (this.get('latestOperationType') === 'save') {
      return i18n.t('forms.edit-form.save-success-message-caption');
    }

    return i18n.t('forms.edit-form.delete-success-message-caption');
  }),

  /**
    Success message related to current locale and operation type.

    @property formSuccessMessage.
    @type String
   */
  formSuccessMessage: Ember.computed('i18n.locale', 'latestOperationType', function() {
    let i18n = this.get('i18n');
    let message = null;
    if (this.get('latestOperationType') === 'save') {
      message = i18n.t('forms.edit-form.save-success-message');
    } else {
      message = i18n.t('forms.edit-form.delete-success-message');
    }

    return new Ember.Handlebars.SafeString('<ul><li>' + message + '</li></ul>');
  }),

  /**
    Flag: indicates whether asynchronous operation failed or not.

    @property showFormErrorMessage.
    @type Boolean
   */
  showFormErrorMessage: undefined,

  /**
    Error message caption related to current locale and operation type.

    @property formErrorMessageCaption.
    @type String
   */
  formErrorMessageCaption: Ember.computed('i18n.locale', 'latestOperationType', function() {
    let i18n = this.get('i18n');
    if (this.get('latestOperationType') === 'save') {
      return i18n.t('forms.edit-form.save-error-message-caption');
    }

    return i18n.t('forms.edit-form.delete-error-message-caption');
  }),

  /**
    Success message related to current locale and operation type.

    @property formErrorMessage
    @type String
   */
  formErrorMessage: Ember.computed('errorMessages.[]', function() {
    let message = '';
    let errorMessages = this.get('errorMessages');
    if (Ember.isArray(errorMessages)) {
      errorMessages.forEach((currentErrorMessage) => {
        message += '<li>' + currentErrorMessage + '</li>';
      });
    }

    return new Ember.Handlebars.SafeString('<ul>' + message + '</ul>');
  }),

  /**
    This method will be invoked before save operation will be called.

    @method onSaveActionStarted.
   */
  onSaveActionStarted() {
    this._super(...arguments);

    this.set('latestOperationType', 'save');
  },

  /**
    This method will be invoked when save operation successfully completed.

    @method onSaveActionFulfilled.
   */
  onSaveActionFulfilled() {
    this._super(...arguments);

    this.set('showFormSuccessMessage', true);
    this.set('showFormErrorMessage', false);
  },

  /**
    This method will be invoked when save operation completed, but failed.

    @method onSaveActionRejected.
    @param {Object} errorData Data about save operation fail.
   */
  onSaveActionRejected(errorData) {
    this._super(...arguments);

    this.set('showFormSuccessMessage', false);
    this.set('showFormErrorMessage', true);
  },

  /**
    This method will be invoked always when save operation completed,
    regardless of save promise's state (was it fulfilled or rejected).

    @method onSaveActionAlways.
    @param {Object} data Data about completed save operation.
   */
  onSaveActionAlways(data) {
    this._super(...arguments);
  },

  /**
    This method will be invoked before delete operation will be called.

    @method onDeleteActionStarted.
   */
  onDeleteActionStarted() {
    this._super(...arguments);

    this.set('latestOperationType', 'delete');
  },

  /**
    This method will be invoked when delete operation successfully completed.

    @method onDeleteActionFulfilled.
   */
  onDeleteActionFulfilled() {
    this._super(...arguments);

    this.set('showFormSuccessMessage', true);
    this.set('showFormErrorMessage', false);
  },

  /**
    This method will be invoked when delete operation completed, but failed.

    @method onDeleteActionRejected.
    @param {Object} errorData Data about delete operation fail.
   */
  onDeleteActionRejected(errorData) {
    this._super(...arguments);

    this.set('showFormSuccessMessage', false);
    this.set('showFormErrorMessage', true);
  },

  /**
    This method will be invoked always when delete operation completed,
    regardless of delete promise's state (was it fulfilled or rejected).

    @method onDeleteActionAlways.
    @param {Object} data Data about completed delete operation.
   */
  onDeleteActionAlways(data) {
    this._super(...arguments);
  },

  /**
    This method will be invoked before close method will be called.

    @method onDeleteActionStarted.
   */
  onCloseActionStarted() {
    this.set('showFormSuccessMessage', undefined);
    this.set('showFormErrorMessage', undefined);
    this.set('latestOperationType', undefined);
  }
});
