/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Controller.extend({
  message: Ember.computed(() => {
    const message = {
      caption: '',
      type: 'error',
      visible: false,
      message: '',
      closeable: true
    };

    return message;
  }).readOnly(),

  /**
   * Current opened modal window.
   *
   * @property _openedModalDialog
   * @type JQuery
   * @default undefined
   */
  _openedModalDialog: undefined,

  title: t('components.advlimit-dialog-content.title'),

  actions: {
    /**
     * Handles create modal window action.
     * It saves created window to have opportunity to close it later.
     *
     * @method createdModalDialog
     * @param {JQuery} modalDialog Created modal window.
     */
    createdModalDialog(modalDialog) {
      this.set('message.visible', false);
      this.set('_openedModalDialog', modalDialog);
    },

    /**
     * Close current modal window if it exists.
     *
     * @method closeModalDialog
     */
    closeModalDialog() {
      let openedDialog = this.get('_openedModalDialog');
      if (openedDialog) {
        openedDialog.modal('hide');
        this.set('_openedModalDialog', undefined);
      }
    },
  }
});
