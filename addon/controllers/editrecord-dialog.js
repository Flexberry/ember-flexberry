/**
  @module ember-flexberry
*/

import Controller from '@ember/controller';
import { inject as service} from '@ember/service';

/**
  Controller for editing record modal window in OLV component.

  @class EditrecordDialog
*/
export default Controller.extend({
  objectlistviewEvents: service(),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: service(),

  /**
    Service that triggers lookup events.

    @property lookupEventsService
    @type Service
  */
  lookupEventsService: service('lookup-events'),

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
    @default 'editrecord-dialog'
  */
  sizeClass: 'editrecord-dialog',

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
      this.get('objectlistviewEvents').editRecordDialogCreatedTrigger();
      this.get('appState').loading();
      this.get('lookupEventsService').on('lookupDialogOnHidden', this, this._refreshDimmer);
    },

    /**
      Handler for close editrecord modal dialog.

      @method actions.onEditRecordDialogClosing
      @public
    */
    onEditRecordDialogClosing: function() {
      this._closeModalDialog();
    },

    /**
      Handler for action after edit record dialog was closed.

      @method actions.onEditRecordDialogHidden
      @public
    */
    onEditRecordDialogHidden: function() {
      this._closeModalDialog();
      this.get('objectlistviewEvents').editRecordDialogHiddenTrigger();
    },
  },

  /**
    Close current modal window if it exists.

    @method _closeModalDialog
    @private
  */
  _closeModalDialog() {
    this.get('appState').reset();
    this.get('lookupEventsService').off('lookupDialogOnHidden', this, this._refreshDimmer);
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
  },

  /**
    Refresh dimmer for modal dialog.

    @method _refreshDimmer
    @private
  */
  _refreshDimmer() {
    let openedDialog = this.get('_openedModalDialog');
    if (openedDialog) {
      openedDialog.modal('show dimmer');
    }
  }
});
