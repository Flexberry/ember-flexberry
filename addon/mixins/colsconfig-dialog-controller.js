import Mixin from '@ember/object/mixin';
//import { translationMacro as t } from 'ember-i18n';

export default Mixin.create({
  queryParams: ['sort'],
  sort: null,
  message: {
    caption: '',
    type: 'error',
    visible: false,
    message: ''
  },

  /**
   * Current opened modal window.
   *
   * @property _openedModalDialog
   * @type JQuery
   * @default undefined
   */
  _openedModalDialog: undefined,
  title: /*t(*/'components.colsconfig-dialog-content.title'/*)*/,
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

    /* eslint-disable no-unused-vars */
    sortByColumnsConfig: function (colsConfig) {
      this.closeModalDialog();
    }
    /* eslint-enable no-unused-vars */
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
