import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
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

  customButtons: Ember.computed('i18n.locale', 'hiButtonState', function() {
    let i18n = this.get('i18n');
    let hiButtonState = this.get('hiButtonState');
    let togglerButtonType = hiButtonState ? 'enable' : 'disable';
    let hiButtonText = i18n.t('forms.components-examples.flexberry-groupedit.custom-buttons-example.custom-button-name');
    let togglerButtonText = i18n.t(`forms.components-examples.flexberry-groupedit.custom-buttons-example.${togglerButtonType}-button-name`);
    return [{
      buttonName: hiButtonText,
      buttonAction: 'customButtonActionTest',
      buttonClasses: 'test-click-button',
      buttonTitle: hiButtonText,
      disabled: hiButtonState,
    }, {
      buttonName: togglerButtonText,
      buttonAction: 'toggleHideCustomButton',
      buttonClasses: 'toggle-hi-button',
      buttonTitle: togglerButtonText,
      disabled: false,
    }];
  }),

  /**
    Current records.

    @property _records
    @type Object[]
    @protected
    @readOnly
  */
  records: [],

  actions: {
    /**
      Handler for click on custom user button.

      @method actions.customButtonActionTest
    */
    customButtonActionTest() {
      let i18n = this.get('i18n');
      let clickCounter = this.get('clickCounter');
      this.set('clickCounter', clickCounter + 1);
      this.set('messageForUser',
        i18n.t('forms.components-examples.flexberry-groupedit.custom-buttons-example.custom-message').string +
        ' ' + clickCounter);
    },

    /**
      Toggles the state of the hi button.

      @method actions.toggleHideCustomButton
    */
    toggleHideCustomButton() {
      this.toggleProperty('hiButtonState');
    },
  },
});
