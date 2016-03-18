/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * ModalDialog component for SemanticUI
 *
 * @class ModalDialog
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  /**
   * Flag indicates whether to show apply button or not.
   *
   * @property useOkButton
   * @type Boolean
   * @default true
   */
  useOkButton: true,

  /**
   * Flag indicates whether to show close button or not.
   *
   * @property useCloseButton
   * @type Boolean
   * @default true
   */
  useCloseButton: true,

  /**
   * Flag indicates whether an image content is viewed at modal dialog or not.
   *
   * @property viewImageContent
   * @type Boolean
   * @default false
   */
  viewImageContent: false,

  /**
   * Flag: indicates buttons toolbar visibility
   * true if at least one of buttons is visible
   *
   * @property toolbarVisible
   * @type Boolean
   * @default true
   * @readonly
   */
  toolbarVisible: Ember.computed('useOkButton', 'useCloseButton', function () {
    return this.get('useOkButton') || this.get('useCloseButton');
  }),

  /**
   * Semantic-UI Modal settings,
   * more info at http://semantic-ui.com/modules/modal.html#settings
   *
   * @property settings,
   * @type Object
   * @default {}
   */
  settings: {},

  modalWindowHeight: undefined,

  modalWindowWidth: undefined,

  modalWindowContentHeight: 400,

  modalWindowHeightComputed: Ember.computed('modalWindowHeight', function () {
    var height = this.get('modalWindowHeight');
    if (height && typeof height === 'number') {
      return height;
    }

    return 600;
  }),

  modalWindowWidthComputed: Ember.computed('modalWindowWidth', function () {
    var width = this.get('modalWindowWidth');
    if (width && typeof width === 'number') {
      return width;
    }

    return 750;
  }),

  modalWindowContentHeightComputed: Ember.computed('modalWindowContentHeight', function () {
    var height = this.get('modalWindowContentHeight');
    if (height && typeof height === 'number') {
      return height;
    }

    return 400;
  }),

  didInsertElement: function () {
    let _this = this;
    let modalSettings = Ember.$.extend({
        onApprove: function () {
          _this.sendAction('ok');
        },
        onDeny: function () {
          _this.sendAction('close');
        },
        onHidden: function () {
          _this.sendAction('close');
          this.remove();
        },
        onVisible: function () {
          var wholeHeight = Ember.$(this).outerHeight();
          var headHeight = Ember.$('.header', this).outerHeight();
          var actionsHeight = Ember.$('.actions', this).outerHeight();
          var result = wholeHeight - headHeight - actionsHeight;
          _this.set('modalWindowContentHeight', result);
          _this.sendAction('created', Ember.$(this));
        }
      },
      _this.get('settings'));

    this.$('.ui.modal').modal(modalSettings).modal('show');
  }
});
