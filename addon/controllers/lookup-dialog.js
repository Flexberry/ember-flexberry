/**
  @module ember-flexberry
 */

import ListFormController from '../controllers/list-form';

/**
  Controller to support a modal windows in FlexberryLookup component.

  @class LookupDialogController
  @extends ListFormController
 */
export default ListFormController.extend({
  /**
    Current open a modal window.

    @property _openedModalDialog
    @type JQuery
    @private
   */
  _openedModalDialog: undefined,

  /**
    Title for modal window.

    @property title
    @type String
   */
  title: undefined,

  /**
    Size of Semantic-UI modal.
    [More info](http://semantic-ui.com/modules/modal.html#size).

    Possible variants:
    - **small**
    - **large**
    - **fullscreen**

    @property sizeClass
    @type String
    @default 'small'
   */
  sizeClass: 'small',

  actions: {
    /**
      Handlers OLV row click, Save selected row to object master property and close modal window.

      @method actions.rowClick
      @param {Object} record Selected row.
     */
    rowClick(record) {
      this._selectMaster(record);
      this._closeModalDialog();
    },

    /**
      Handlers create modal window action. Save created window, to have opportunity to close it later.

      @method actions.createdModalDialog
      @param {JQuery} modalDialog Created modal window.
     */
    createdModalDialog(modalDialog) {
      this.set('_openedModalDialog', modalDialog);
    },

    /**
      Handlers correcponding route's willTransition action.
      It closes modal window if it is opened (if Ember uses hash location type, modal window won't be closed automatically).

      @method actions.routeWillTransition
     */
    routeWillTransition() {
      this._closeModalDialog();
    },
  },

  /**
    Reset current state.

    @method clear
   */
  clear() {
    this.set('_openedModalDialog', undefined);
    this.set('saveTo', undefined);
    this.set('modelProjection', undefined);
    return this;
  },

  /**
    Set master to corresponding property of editing object.

    @method _selectMaster
    @param {Object} master Selected master for editing property.
    @private
   */
  _selectMaster(master) {
    var saveTo = this.get('saveTo');
    if (!saveTo) {
      throw new Error('Don\'t know where to save - no saveTo data defined.');
    }

    saveTo.model.set(saveTo.propName, master);

    // Manually make record dirty, because ember-data does not do it when relationship changes.
    saveTo.model.makeDirty();
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
  },
});
