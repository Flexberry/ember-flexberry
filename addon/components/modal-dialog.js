/**
  @module ember-flexberry
*/

import $ from 'jquery';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import { isEmpty } from '@ember/utils';

/**
  Modal dialog component based on Semantic UI Modal module.

  @example
    ```handlebars
    {{#modal-dialog
      title="Title"
      sizeClass="large"
      close=(action "removeModalDialog")
      created=(action "createdModalDialog")
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
  @extends <a href="https://emberjs.com/api/ember/release/classes/Component">Component</a>
*/
export default Component.extend({
  /**
    Service that triggers lookup events.

    @private
    @property _lookupEvents
    @type Service
  */
  _lookupEvents: service('lookup-events'),

  /**
    @private
    @property _toolbarVisible
    @type Boolean
    @readOnly
  */
  _toolbarVisible: computed.or('useOkButton', 'useCloseButton').readOnly(),

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

  init() {
    this._super(...arguments);
    this.set('settings', {});
  },

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @method didInsertElement
  */
  didInsertElement() {
    this._super(...arguments);

    let settings = $.extend({
      observeChanges: true,
      detachable: false,
      allowMultiple: true,
      context: '.ember-application > .ember-view',
      onApprove: () => {
        // Call to 'lookupDialogOnHiddenTrigger' causes asynchronous animation, so run function is necessary.
        run(() => {
          if (!isEmpty(this.get('ok'))) {
            this.get('ok')();
          }

          this.get('_lookupEvents').lookupDialogOnHiddenTrigger(this.get('componentName'));
        });
      },
      onHidden: () => {
        run(() => {

          /* eslint-disable ember/closure-actions */
          this.sendAction('close'); //TODO
          /* eslint-enable ember/closure-actions */

          // IE doesn't support "this.remove()", that's why "this.$().remove()" is used.
          $(this).remove();
          this.get('_lookupEvents').lookupDialogOnHiddenTrigger(this.get('componentName'));
        });
      },
      onVisible: () => {
        // Handler of 'created' action causes asynchronous animation, so run function is necessary.
        run(() => {
          /* eslint-disable ember/closure-actions */
          this.sendAction('created', this.$()); //TODO
          /* eslint-enable ember/closure-actions */
        });
      },
    }, this.get('settings'));

    this.$().modal(settings).modal('show');
  },
});
