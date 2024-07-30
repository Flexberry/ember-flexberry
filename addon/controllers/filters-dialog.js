/**
 * @module ember-flexberry
 */

import Controller from '@ember/controller';
//import { translationMacro as t } from 'ember-i18n';

export default Controller.extend({
  /**
   * Current opened modal window.
   *
   * @property _openedModalDialog
   * @type JQuery
   * @default undefined
   */
  _openedModalDialog: undefined,

  title: /*t(*/'components.filters-dialog-content.title'/*)*/,

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
