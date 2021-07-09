/**
 * @module ember-flexberry
 */

import Controller from '@ember/controller';

export default Controller.extend({
  /**
   * Current opened modal window.
   *
   * @property _openedModalDialog
   * @type JQuery
   * @default undefined
   */
  _openedModalDialog: undefined,

  actions: {
    /**
     * Handles create modal window action.
     * It saves created window to have opportunity to close it later.
     *
     * @method createdModalDialog
     * @param {JQuery} modalDialog Created modal window.
     */
    createdModalDialog(modalDialog) {
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
