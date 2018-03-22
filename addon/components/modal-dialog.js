/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Modal dialog component based on Semantic UI Modal module.

  @example
    ```handlebars
    {{#modal-dialog
      title="Title"
      sizeClass="large"
      close="removeModalDialog"
      created="createdModalDialog"
      useOkButton=false
      useCloseButton=false
      settings=(hash
        duration=500
      )
    }}
      {{outlet 'modal-content'}}
    {{/modal-dialog}}
    ```

  @class ModalDialog
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/
export default Ember.Component.extend({
  /**
    Service that triggers lookup events.

    @private
    @property _lookupEvents
    @type Ember.Service
  */
  _lookupEvents: Ember.inject.service('lookup-events'),

  /**
    @private
    @property _toolbarVisible
    @type Boolean
    @readOnly
  */
  _toolbarVisible: Ember.computed.or('useOkButton', 'useCloseButton').readOnly(),

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property classNameBindings
  */
  classNameBindings: ['sizeClass'],

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property classNames
  */
  classNames: ['ui', 'modal', 'flexberry-modal'],

  /**
    See [Semantic UI API](http://semantic-ui.com/modules/modal.html#settings).

    @property settings
    @type Object
  */
  settings: undefined,

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
    Used to identify lookup on the page.

    @property componentName
    @type String
  */
  componentName: undefined,

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @method didInsertElement
  */
  didInsertElement() {
    this._super(...arguments);

    let settings = Ember.$.extend({
      observeChanges: true,
      detachable: false,
      allowMultiple: true,
      context: '.ember-application > .ember-view',
      onApprove: () => {
        // Call to 'lookupDialogOnHiddenTrigger' causes asynchronous animation, so Ember.run is necessary.
        Ember.run(() => {
          this.sendAction('ok');
          this.get('_lookupEvents').lookupDialogOnHiddenTrigger(this.get('componentName'));
        });
      },
      onHidden: () => {
        Ember.run(() => {
          this.sendAction('close');

          // IE doesn't support "this.remove()", that's why "thi.$().remove()" is used.
          this.$().remove();
          this.get('_lookupEvents').lookupDialogOnHiddenTrigger(this.get('componentName'));
        });
      },
      onVisible: () => {
        // Handler of 'created' action causes asynchronous animation, so Ember.run is necessary.
        Ember.run(() => {
          this.sendAction('created', this.$());
        });
      },
    }, this.get('settings'));

    this.$().modal(settings).modal('show');
  },
});
