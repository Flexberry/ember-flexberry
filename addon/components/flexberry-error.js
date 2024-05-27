/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';
import { isNone } from '@ember/utils';
/**
  This component displaying errors.

  @example
    templates/my-form.hbs
    ```handlebars
    {{flexberry-error error=error}}
    ```

  @class FlexberryErrorComponent
  @extends Component
*/
export default Component.extend({
  /**
    Internal property to store the error.

    @property _error
    @type Error or Array
    @private
  */
  _error: undefined,

  /**
    Detects if error is an array.

    @property _errorIsArray
    @type Boolean
    @private
  */
  _errorIsArray: computed('_error', function () {
    return isArray(this.get('_error'));
  }),

  /**
    Detects if error has not own property with message.

    @property _messageIsNotSpecified
    @type Boolean
    @private
  */
  _messageIsNotSpecified: computed('_error', function () {
    return isNone(this.get('_error.message'));
  }),

  /**
    Define error display mode, in `{{modal-dailog}}` or `{{ui-message}}` component.

    @property modal
    @type Boolean
    @default true
  */
  modal: true,

  /**
    Selector for modal dialog's context.

    @property modalContext
    @type String
    @default '.pusher:first'
  */
  modalContext: '.pusher:first',

  /**
    Flag defining whether or not showing close button.
    Rewrites {{#crossLink "ModalDialog/useCloseButton:property"}}`useCloseButton`{{/crossLink}}.

    @property useCloseButton
    @type Boolean
    @default true
  */
  useCloseButton: true,

  /**
    Flag defining whether or not showing ok button.
    Rewrites {{#crossLink "ModalDialog/useOkButton:property"}}`useOkButton`{{/crossLink}}.

    @property useOkButton
    @type Boolean
    @default false
  */
  useOkButton: false,

  /**
    Error for displaying.

    @property error
    @type Error
  */
  error: computed('_error', {
    get() {
      return this.get('_error');
    },

    set(key, value) {
      return this.set('_error', value);
    },
  }),

  actions: {
    /**
      Cleans error after displaying.

      @method actions.close
    */
    close() {
      this.set('error', null);
    },
  },
});
