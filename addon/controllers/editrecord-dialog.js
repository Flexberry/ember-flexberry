/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Controller for editing record modal window in OLV component.

  @class EditrecordDialog
*/
export default Ember.Controller.extend({
  /**
    Editrecord modal dialog outlet name

    @property modalOutletName
    @type String
    @default 'editrecord-modal'
  */
  modalOutletName: 'editrecord-modal',

  /**
    Editrecord modal dialog outlet name for content

    @property modalContentOutletName
    @type String
    @default 'editrecord-modal-content'
  */
  modalContentOutletName: 'editrecord-modal-content',

  /**
    Current open a modal window.

    @property _openedModalDialog
    @type JQuery
    @private
  */
  _openedModalDialog: undefined,

  /**
    Size of Semantic-UI modal and his class.
    [More info](http://semantic-ui.com/modules/modal.html#size).

    Possible variants of size:
    - **small**
    - **large**
    - **fullscreen**

    @property sizeClass
    @type String
    @default 'small editrecord-dialog'
  */
  sizeClass: 'small editrecord-dialog',

  actions: {
    /**
    * Handles create modal window action.
    * It saves created window to have opportunity to close it later.
    *
    * @method createdModalDialog
    * @param {JQuery} modalDialog Created modal window.
    */
    createdModalDialog: function(modalDialog) {
      this.set('_openedModalDialog', modalDialog);
    },

    /**
      Handler for close editrecord modal dialog.

      @method actions.closeEditrecordDialog
      @public
    */
    closeEditrecordDialog: function() {
      this._closeModalDialog();
    },
  },

  /**
    Close current modal window if it exists.

    @method _closeModalDialog
    @private
  */
  _closeModalDialog() {
    let openedDialog = this.get('_openedModalDialog');
    if (openedDialog) {
      openedDialog.modal('hide');
      this.set('_openedModalDialog', undefined);
    }

    let modalOutletName = this.get('modalOutletName');

    //close other opened modal windows
    this.send('removeModalDialog', { outlet: 'modal' });

    //close this modal window
    this.send('removeModalDialog', { outlet: modalOutletName });
  }
});
