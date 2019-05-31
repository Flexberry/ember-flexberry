/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

/**
  Controller to support a modal windows in FlexberryLookup component.

  @class LookupDialogController
  @extends ListFormController
  @uses SortableRouteMixin
*/
export default Ember.Controller.extend({
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
  title: t ('forms.ember-flexberry-dummy-suggestion-type-edit.caption'),

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
  }
});
