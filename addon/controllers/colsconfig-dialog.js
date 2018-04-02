/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import ColsconfigDialogController from '../mixins/colsconfig-dialog-controller';

export default Ember.Controller.extend(ColsconfigDialogController, {
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
    createdModalDialog: function(modalDialog) {
      this.set('message.visible', false);
      this.set('_openedModalDialog', modalDialog);
    }
  },

  /**
   * Close current modal window if it exists.
   *
   * @method closeModalDialog
   */
  closeModalDialog: function () {
    let openedDialog = this.get('_openedModalDialog');
    if (openedDialog) {
      openedDialog.modal('hide');
      this.set('_openedModalDialog', undefined);
    }
  },

  clear: function() {
    this.set('_openedModalDialog', undefined);
    return this;
  }

});
