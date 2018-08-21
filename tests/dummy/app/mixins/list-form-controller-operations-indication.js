/**
  @module ember-flexberry-dummy
*/

import Ember from 'ember';

/**
  List forms controllers mixin which handles delete operations indication.

  @class ListFormControllerOperationsIndicationMixin
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
      this.set('showFormSuccessMessage', false);
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
      this.set('showFormErrorMessage', false);
    }
  },

  /**
    Latest operation type ('save' or 'delete').

    @property latestOperationType.
    @type String
   */
  latestOperationType: undefined,

  /**
    Flag: indicates whether asynchronous operation succeed or not.

    @property showFormSuccessMessage.
    @type Boolean
   */
  showFormSuccessMessage: false,

  /**
    Success message caption related to current locale and operation type.

    @property formSuccessMessageCaption.
    @type String
   */
  formSuccessMessageCaption: Ember.computed('i18n.locale', 'latestOperationType', function() {
    let i18n = this.get('i18n');
    if (this.get('latestOperationType') === 'delete') {
      return i18n.t('forms.list-form.delete-success-message-caption');
    }

    return i18n.t('forms.list-form.load-success-message-caption');
  }),

  /**
    Success message related to current locale and operation type.

    @property formSuccessMessage.
    @type String
   */
  formSuccessMessage: Ember.computed('i18n.locale', 'latestOperationType', function() {
    let i18n = this.get('i18n');
    let message = null;
    if (this.get('latestOperationType') === 'delete') {
      message = i18n.t('forms.list-form.delete-success-message');
    } else {
      message = i18n.t('forms.list-form.load-success-message');
    }

    return new Ember.Handlebars.SafeString('<ul><li>' + message + '</li></ul>');
  }),

  /**
    Flag: indicates whether asynchronous operation failed or not.

    @property showFormErrorMessage.
    @type Boolean
   */
  showFormErrorMessage: false,

  /**
    Error message caption related to current locale and operation type.

    @property formErrorMessageCaption.
    @type String
   */
  formErrorMessageCaption: Ember.computed('i18n.locale', 'latestOperationType', function() {
    let i18n = this.get('i18n');
    if (this.get('latestOperationType') === 'delete') {
      return i18n.t('forms.list-form.delete-error-message-caption');
    }

    return i18n.t('forms.list-form.load-error-message-caption');
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
  onDeleteActionRejected(errorData, record) {
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
  }
});
