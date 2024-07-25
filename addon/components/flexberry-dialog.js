/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import { observer } from '@ember/object';
import { isNone } from '@ember/utils';
import RequiredActionsMixin from '../mixins/required-actions';
import DomActionsMixin from '../mixins/dom-actions';
import DynamicActionsMixin from '../mixins/dynamic-actions';
import DynamicPropertiesMixin from '../mixins/dynamic-properties';
import { inject as service } from '@ember/service';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-dialog').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-dialog').
  @property {String} flexberryClassNames.header Component's header block CSS-class name ('flexberry-dialog-header').
  @property {String} flexberryClassNames.content Component's content block CSS-class name ('flexberry-dialog-content').
  @property {String} flexberryClassNames.toolbar Component's toolbar block CSS-class name ('flexberry-dialog-toolbar').
  @property {String} flexberryClassNames.approveButton Component's approve button CSS-class name ('flexberry-dialog-approve-button').
  @property {String} flexberryClassNames.cancelButton Component's cancel button CSS-class name ('flexberry-dialog-cancel-button').
  @property {String} flexberryClassNames.closeButton Component's close button CSS-class name ('flexberry-dialog-close-button').
  @readonly
  @static

  @for FlexberryDialogComponent
*/
const flexberryClassNamesPrefix = 'flexberry-dialog';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix,
  header: flexberryClassNamesPrefix + '-header',
  content: flexberryClassNamesPrefix + '-content',
  toolbar: flexberryClassNamesPrefix + '-toolbar',
  approveButton: flexberryClassNamesPrefix + '-approve-button',
  cancelButton: flexberryClassNamesPrefix + '-cancel-button',
  closeButton: flexberryClassNamesPrefix + '-close-button'
};

/**
  Flexberry dialog component with [Semantic UI modal style](http://semantic-ui.com/modules/modal.html).

  @class FlexberryDialogComponent
  @extends <a href="https://emberjs.com/api/ember/release/classes/Component">Component</a>
  @uses RequiredActionsMixin
  @uses DomActionsMixin
  @uses DynamicActionsMixin
  @uses DynamicPropertiesMixin
*/
let FlexberryDialogComponent = Component.extend(
  RequiredActionsMixin,
  DomActionsMixin,
  DynamicActionsMixin,
  DynamicPropertiesMixin, {
    intl: service(),

    /**
      Selected from DOM dialog block.

      @property _dialog
      @type <a href="http://learn.jquery.com/using-jquery-core/jquery-object/">jQuery-object</a>
      @private
    */
    _dialog: null,

    /**
      Reference to component's CSS-classes names.
      Must be also a component's instance property to be available from component's .hbs template.
    */
    flexberryClassNames,

    /**
      Component's wrapping <div> CSS-classes names.

      Any other CSS-classes can be added through component's 'class' property.
      ```handlebars
      {{flexberry-dialog class="large" approve=(action "onDialogApprove")}}
      ```

      @property classNames
      @type String[]
      @default ['flexberry-dialog', 'ui', 'modal']
    */
    classNames: [flexberryClassNames.wrapper, 'ui', 'modal'],

    /**
      Component's content CSS-class.

      @property contentClass
      @type String
      @default null
    */
    contentClass: null,

    /**
      Component's caption.

      @property caption
      @type String
      @default null
    */
    caption: null,

    /**
      Component's content.

      @property content
      @type String
      @default null
    */
    content: null,

    /**
      Component's approve button caption.

      @property approveButtonCaption
      @type String
      @default t('components.flexberry-dialog.approve-button.caption')
    */
    approveButtonCaption: undefined,

    /**
      Component's deny button caption.

      @property denyButtonCaption
      @type String
      @default t('components.flexberry-dialog.deny-button.caption')
    */
    denyButtonCaption: undefined,

    /**
      Component's vertical offset to allow for content outside of dialog, for example a close button, to be centered.

      @property offset
      @type Number
      @default 0
    */
    offset: 0,

    /**
      Flag: indicates whether multiple dialogs are allowed at the same time.

      @property allowMultiple
      @type Boolean
      @default false
    */
    allowMultiple: false,

    /**
      Flag: indicates whether dialog is closable (can be closed on it's dimmer click).

      @property allowMultiple
      @type Boolean
      @default false
    */
    closable: false,

    /**
      Component's transition animation name.

      @property duration
      @type String
      @default 'scale'
    */
    transition: 'scale',

    /**
      Component's animation duration (in milliseconds).

      @property duration
      @type Number
      @default 200
    */
    duration: 200,

    /**
      Flag: indicates whether dialog is visible or not.
      If true, then dialog will be shown, otherwise dialog will be closed.

      @property visible
      @type Boolean
      @default false
    */
    visible: false,

    /**
      Observes {{#crossLink "FlexberryDialogComponent/visible:property"}}'visible' property{{/crossLink}}.
      Shows dialog if property is true, otherwise hides dialog.

      @method _visibleDidChange
      @private
    */
    _visibleDidChange: observer('visible', function() {
      let $dialog = this.get('_dialog');
      if (isNone($dialog)) {
        return;
      }

      if (this.get('visible')) {
        $dialog.modal('show');
      } else {
        $dialog.modal('hide');
      }
    }),

    /**
      Initializes component.
    */
    init() {
      this._super(...arguments);

      this.set('approveButtonCaption', this.intl.t('components.flexberry-dialog.approve-button.caption'));
      this.set('denyButtonCaption', this.intl.t('components.flexberry-dialog.deny-button.caption'));
    },

    /**
      Initializes DOM-related component's properties.
    */
    didInsertElement() {
      this._super(...arguments);

      // Initialize Semantic UI modal.
      let $dialog = $(this.element).modal({
        autofocus: false,
        detachable: true,
        observeChanges: false,
        offset: this.get('offset'),
        allowMultiple: this.get('allowMultiple'),
        closable: this.get('closable'),
        transition: this.get('transition'),
        duration: this.get('duration'),
        onShow: () => {
          let e = { showDialog: true, target: this.get('_dialog') };
          this.sendDynamicAction('beforeShow', e);

          return e.showDialog;
        },
        onHide: () => {
          if (this.get('isDestroying') || this.get('isDestroyed')) {
            // Prevent hide animation on destroyed component to avoid animation exceptions.
            return false;
          }

          let e = { closeDialog: true, target: this.get('_dialog') };
          this.sendDynamicAction('beforeHide', e);

          return e.closeDialog;
        },
        onVisible: () => {
          this.set('visible', true);

          let e = { target: this.get('_dialog') };
          this.sendDynamicAction('show', e);
        },
        onHidden: () => {
          this.set('visible', false);

          let e = { target: this.get('_dialog') };
          this.sendDynamicAction('hide', e);
        },
        onApprove: () => {
          let e = { closeDialog: true, target: this.get('_dialog') };
          this.sendDynamicAction('approve', e);

          return e.closeDialog;
        },
        onDeny: () => {
          let e = { closeDialog: true, target: this.get('_dialog') };
          this.sendDynamicAction('deny', e);

          return e.closeDialog;
        }
      });

      // Show dialog if necessary.
      if (this.get('visible') && !isNone($dialog)) {
        $dialog.modal('show');
      }

      this.set('_dialog', $dialog);
    },

    /**
      Destroys DOM-related component's properties.
    */
    willDestroyElement() {
      this._super(...arguments);

      let $dialog = this.get('_dialog');
      if (isNone($dialog)) {
        return;
      }

      // Remove dialog from DOM (from its dimmer).
      $dialog.remove();

      // Hide dialog's dimmer.
      $dialog.modal('hideDimmer');

      // Destroy dialog.
      $dialog.modal('destroy');
    },

    /**
      Component's action invoking when dialog starts to show.

      @method sendingActions.beforeShow
    */

    /**
      Component's action invoking when dialog starts to hide.

      @method sendingActions.beforeHide
    */

    /**
      Component's action invoking when dialog is shown.

      @method sendingActions.show
    */

    /**
      Component's action invoking when dialog is hidden.

      @method sendingActions.hide
    */

    /**
      Component's action invoking when dialog is approved.

      @method sendingActions.approve
    */

    /**
      Component's action invoking when dialog is denied.

      @method sendingActions.deny
    */
  }
);

// Add component's CSS-class names as component's class static constants
// to make them available outside of the component instance.
FlexberryDialogComponent.reopenClass({
  flexberryClassNames
});

export default FlexberryDialogComponent;
