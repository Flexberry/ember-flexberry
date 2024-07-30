/**
  @module ember-flexberry
*/

import Controller from '@ember/controller';

/**
  Controller for content of {{#crossLink "FlexberryFileComponent"}}flexberry-file{{/crossLink}} preview dialog.

  @class FlexberryFileViewDialogController
  @extends <a href="https://emberjs.com/api/ember/release/classes/Controller">Controller</a>
*/
export default Controller.extend({
  /**
    Currently opened modal dialog DOM element.

    @property _openedModalDialog
    @type <a href="http://api.jquery.com/Types/#jQuery">JQueryObject</a>
    @private
  */
  _openedModalDialog: undefined,

  /**
    Modal dialog title.

    @property title
    @type String
  */
  title: undefined,

  /**
    Size of modal dialog.
    Possible variants: 'small', 'large', 'fullscreen'.

    @property sizeClass
    @type String
    @default 'small'
  */
  sizeClass: 'small',

  /**
    File as base64string image data or as URL (to be setted as img tag's 'src' property).

    @property imageSrc
    @type String
    @default ''
  */
  imageSrc: '',

  actions: {
    /**
      Handles modal dialog creation.
      It saves reference to created dialog's DOM element to a controllers property (to make it possible to close it later).

      @method actions.createdModalDialog
      @param {<a href="http://api.jquery.com/Types/#jQuery">JQueryObject</a>} modalDialog Created modal dialog's DOM element.
      @public
    */
    createdModalDialog(modalDialog) {
      this.set('_openedModalDialog', modalDialog);
    },

    /**
      Handles corresponding route's willTransition action.
      It closes modal dialog if it is opened (if Ember uses hash location type, modal dialog won't be closed automatically).

      @method actions.routeWillTransition
      @public
    */
    routeWillTransition() {
      let openedDialog = this.get('_openedModalDialog');
      if (openedDialog) {
        openedDialog.modal('hide');
        this.set('_openedModalDialog', undefined);
      }
    }
  }
});
