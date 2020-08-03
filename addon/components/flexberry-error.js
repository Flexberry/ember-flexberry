/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  This component displaying errors.

  @example
    templates/my-form.hbs
    ```handlebars
    {{flexberry-error error=error}}
    ```

  @class FlexberryErrorComponent
  @extends Ember.Component
*/
export default Ember.Component.extend({
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
  _errorIsArray: Ember.computed('_error', function () {
    return Ember.isArray(this.get('_error'));
  }),

  /**
    Detects if error has not own property with message.

    @property _messageIsNotSpecified
    @type Boolean
    @private
  */
  _messageIsNotSpecified: Ember.computed('_error', function () {
    return Ember.isNone(this.get('_error.message'));
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
    Error for displaying.

    @property error
    @type Error
  */
  error: Ember.computed('_error', {
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
