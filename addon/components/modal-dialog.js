/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  ModalDialog component for Semantic UI.

  @example
    ```handlebars
    {{#modal-dialog
      title='Title'
      sizeClass='large'
      close='removeModalDialog'
      created='createdModalDialog'
      useOkButton=false
      useCloseButton=false
    }}
      {{outlet 'modal-content'}}
    {{/modal-dialog}}
    ```

  @class ModalDialog
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/
export default Ember.Component.extend({
  /**
    Size of Semantic UI modal.
    Possible variants:
    - 'small'
    - 'large'
    - 'fullscreen'

    @property sizeClass
    @type String
    @default 'small'
  */
  sizeClass: 'small',

  /**
    Flag indicates whether an image content is viewed at modal dialog or not.

    @property viewImageContent
    @type Boolean
    @default false
  */
  viewImageContent: false,

  /**
    Flag indicates whether to show apply button or not.

    @property useOkButton
    @type Boolean
    @default true
  */
  useOkButton: true,

  /**
    Flag indicates whether to show close button or not.

    @property useCloseButton
    @type Boolean
    @default true
  */
  useCloseButton: true,

  /**
    Flag indicates toolbar visibility, `true` if at least one of buttons is visible.

    @property toolbarVisible
    @type Boolean
    @readOnly
  */
  toolbarVisible: Ember.computed('useOkButton', 'useCloseButton', function () {
    return this.get('useOkButton') || this.get('useCloseButton');
  }),

  /**
    Semantic UI Modal settings, [more info here](http://semantic-ui.com/modules/modal.html#settings).

    @property settings
    @type Object
    @default {}
  */
  settings: {},

  /**
    Service that triggers lookup events.

    @property lookupEventsService
    @type Service
  */
  lookupEventsService: Ember.inject.service('lookup-events'),

  /**
    Initializes DOM-related component's logic.
  */
  didInsertElement() {
    let _this = this;
    let modalSettings = Ember.$.extend({
        observeChanges: true,
        detachable: false,
        allowMultiple: true,

        onApprove: function () {
          _this.sendAction('ok');
          _this.get('lookupEventsService').showDialogTrigger(false);
        },
        onDeny: function () {
          _this.sendAction('close');
          _this.get('lookupEventsService').showDialogTrigger(false);
        },
        onHidden: function () {
          _this.sendAction('close');

          // IE doesn't support "this.remove()", that's why "Ember.$(this).remove()" is used.
          Ember.$(this).remove();
          _this.get('lookupEventsService').showDialogTrigger(false);
        },
        onVisible: function () {
          _this.get('lookupEventsService').showDialogTrigger(true);
          Ember.run(() => {
            _this.sendAction('created', Ember.$(this));
          });
        }
      },
      _this.get('settings'));

    this.$('.ui.modal').modal(modalSettings).modal('show');    
  },
});
