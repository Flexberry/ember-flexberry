import Ember from 'ember';

export default Ember.Controller.extend({
  // TODO: remove dublicate code.

  /**
   * Current opened modal window.
   *
   * @property _openedModalDialog
   * @type JQuery
   * @default undefined
   */
  _openedModalDialog: undefined,

  /**
   * Title of modal window.
   *
   * @property title
   * @type String
   * @default undefined
   */
  title: undefined,

  /**
   * Size of Semantic-UI modal.
   * Possible variants: small, large, fullscreen.
   *
   * @property sizeClass
   * @type String
   * @default small
   */
  sizeClass: 'small',

  /**
   * Content of image to view at modal window.
   *
   * @property imageSrc
   * @type String
   * @default ``
   */
  imageSrc: '',

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
  }
});
