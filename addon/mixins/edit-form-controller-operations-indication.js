/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';
import { htmlSafe } from '@ember/template';
/**
  Edit forms controllers mixin which handles save/delete operations indication.

  @class EditFormControllerOperationsIndicationMixin
*/
export default Mixin.create({
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
    @default false
  */
  showFormSuccessMessage: false,

  /**
    Success message caption related to current locale and operation type.

    @property formSuccessMessageCaption.
    @type String
  */
  formSuccessMessageCaption: computed('i18n.locale', 'latestOperationType', function() {
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
  formSuccessMessage: computed('i18n.locale', 'latestOperationType', function() {
    let i18n = this.get('i18n');
    let message = null;
    if (this.get('latestOperationType') === 'save') {
      message = i18n.t('forms.edit-form.save-success-message');
    } else {
      message = i18n.t('forms.edit-form.delete-success-message');
    }

    return new htmlSafe('<ul><li>' + message + '</li></ul>');
  }),

  /**
    Flag: indicates whether asynchronous operation failed or not.

    @property showFormErrorMessage.
    @type Boolean
    @default false
  */
  showFormErrorMessage: false,

  /**
    Error message caption related to current locale and operation type.

    @property formErrorMessageCaption.
    @type String
  */
  formErrorMessageCaption: computed('i18n.locale', 'latestOperationType', function() {
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
  formErrorMessage: computed('errorMessages.[]', function() {
    let message = '';
    let errorMessages = this.get('errorMessages');
    if (isArray(errorMessages)) {
      errorMessages.forEach((currentErrorMessage) => {
        message += '<li>' + currentErrorMessage + '</li>';
      });
    }

    return new htmlSafe('<ul>' + message + '</ul>');
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
    this.set('showFormSuccessMessage', true);
    this.set('showFormErrorMessage', false);

    this._super(...arguments);
  },

  /**
    This method will be invoked when save operation completed, but failed.

    @method onSaveActionRejected.
    @param {Object} errorData Data about save operation fail.
  */
  /* eslint-disable no-unused-vars */
  onSaveActionRejected(errorData) {
    this._super(...arguments);

    this.set('showFormSuccessMessage', false);
    this.set('showFormErrorMessage', true);
  },
  /* eslint-enable no-unused-vars */

  /**
    This method will be invoked always when save operation completed,
    regardless of save promise's state (was it fulfilled or rejected).

    @method onSaveActionAlways.
    @param {Object} data Data about completed save operation.
  */
  /* eslint-disable no-unused-vars */
  onSaveActionAlways(data) {
    this._super(...arguments);
  },
  /* eslint-enable no-unused-vars */

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
  /* eslint-disable no-unused-vars */
  onDeleteActionRejected(errorData) {
    this._super(...arguments);

    this.set('showFormSuccessMessage', false);
    this.set('showFormErrorMessage', true);
  },
  /* eslint-enable no-unused-vars */

  /**
    This method will be invoked always when delete operation completed,
    regardless of delete promise's state (was it fulfilled or rejected).

    @method onDeleteActionAlways.
    @param {Object} data Data about completed delete operation.
  */
  /* eslint-disable no-unused-vars */
  onDeleteActionAlways(data) {
    this._super(...arguments);
  },
  /* eslint-enable no-unused-vars */

  /**
    This method will be invoked before close method will be called.

    @method onDeleteActionStarted.
  */
  onCloseActionStarted() {
    this.set('showFormSuccessMessage', false);
    this.set('showFormErrorMessage', false);
    this.set('latestOperationType', undefined);
  }
});
