import { computed } from '@ember/object';
import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  /**
    Property to count clicks on user button.

    @property clickCounter
    @type Number
    @default 1
  */
  clickCounter: 1,

  /**
    Property to show user message after click on user button.

    @property messageForUser
    @type String
  */
  messageForUser: undefined,

  /**
    The state of the hi button, is disabled if `true` or enabled if `false`.

    @property hiButtonState
    @type Boolean
    @default true
  */
  hiButtonState: true,

  /**
    Property to form array of special structures of custom user buttons.

    @property customButtons
    @type Array
   */
  customButtons: computed('i18n.locale', 'hiButtonState', function() {
    let i18n = this.get('i18n');
    let hiButtonState = this.get('hiButtonState');
    let togglerButtonType = hiButtonState ? 'enable' : 'disable';
    let hiButtonText = i18n.t('forms.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.custom-button-name');
    let togglerButtonText = i18n.t(`forms.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.${togglerButtonType}-button-name`);
    return [{
      buttonName: hiButtonText,
      buttonAction: 'userButtonActionTest',
      buttonClasses: 'test-click-button',
      iconClasses: 'paw icon',
      buttonTitle: hiButtonText,
      disabled: hiButtonState,
    }, {
      buttonName: togglerButtonText,
      buttonAction: 'toggleHiButton',
      buttonClasses: 'toggle-hi-button',
      buttonTitle: togglerButtonText,
      disabled: false,
    }];
  }),

  customButtonsInRow: computed('i18n.locale', function() {
    let i18n = this.get('i18n');
    return [{
      buttonName: i18n.t('forms.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.custom-row-button-name'),
      buttonAction: 'userButtonInRowActionTest',
      buttonClasses: 'icon',
      buttonIcon: 'bug icon',
      buttonTitle: i18n.t('forms.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.custom-row-button-name'),
    }];
  }),

  actions: {
    /**
      Handler for click on custom user button.

      @method actions.userButtonActionTest
    */
    userButtonActionTest() {
      let i18n = this.get('i18n');
      let clickCounter = this.get('clickCounter');
      this.set('clickCounter', clickCounter + 1);
      this.set('messageForUser',
        i18n.t('forms.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.custom-message').string +
        ' ' + clickCounter);
    },

    /**
      Toggles the state of the hi button.

      @method actions.toggleHiButton
    */
    toggleHiButton() {
      this.toggleProperty('hiButtonState');
    },

    /**
      Handler for click on custom user button in row.

      @method userButtonActionTest
    */
    userButtonInRowActionTest(model) {
      this.set('modelFromClickedRow', model);
    },
  },
});
