/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * ModalDialog component for SemanticUI.
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
   * Size of Semantic-UI modal.
   * Possible variants: 'small', 'large', 'fullscreen'.
   *
   * @property sizeClass
   * @type String
   * @default 'small'
   */
  sizeClass: 'small',

  /**
   * Flag: indicates buttons toolbar visibility,
   * `true` if at least one of buttons is visible.
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
   * @property settings
   * @type Object
   * @default {}
   */
  settings: {},

  didInsertElement: function () {
    let _this = this;
    let modalSettings = Ember.$.extend({
        observeChanges: true,
        detachable: false,
        allowMultiple: true,

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
          Ember.run(() => {
            _this.sendAction('created', Ember.$(this));
          });
        }
      },
      _this.get('settings'));

    this.$('.ui.modal').modal(modalSettings).modal('show');
  }
});
