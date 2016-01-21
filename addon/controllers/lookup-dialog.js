import ListFormPageController from '../controllers/list-form';

export default ListFormPageController.extend({
  _currentRow: undefined,

  /**
   * Current opened modal window.
   *
   * @property _openedModalDialog
   * @type JQuery
   * @default undefined
   */
  _openedModalDialog: undefined,

  title: undefined,
  modalWindowHeight: undefined,
  modalWindowWidth: undefined,

  actions: {

    // Save the currentRow on rowClicked.
    rowClick: function(record) {
      this.set('_currentRow', record);
    },

    saveLookupDialog: function() {
      var saveTo = this.get('saveTo');
      if (!saveTo) {
        throw new Error('Don\'t know where to save - no saveTo data defined.');
      }

      saveTo.model.set(saveTo.propName, this.get('_currentRow'));

      // Manually make record dirty, because ember-data does not do it when relationship changes.
      saveTo.model.makeDirty();
    },

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
     * Handles correcponding route's willTransition action.
     * It closes modal window if it is opened (if Ember uses hash location type, modal window won't be closed automatically).
     *
     * @method routeWillTransition
     */
    routeWillTransition: function() {
      let openedDialog = this.get('_openedModalDialog');
      if (openedDialog) {
        openedDialog.modal('hide');
        this.set('_openedModalDialog', undefined);
      }
    }
  },

  clear: function() {
    this.set('_currentRow', undefined);
    this.set('_openedModalDialog', undefined);
    this.set('saveTo', undefined);
    this.set('modelProjection', undefined);
    return this;
  },

  setCurrentRow: function() {
    var saveTo = this.get('saveTo');
    var currentRowVal = saveTo.model.get(saveTo.propName);
    this.set('_currentRow', currentRowVal);
    return this;
  }
});
