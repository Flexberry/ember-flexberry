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
    Property to form array of special structures of custom user buttons.

    @property customButtons
    @type Array
   */
  customButtons: computed('i18n.locale', function() {
    let i18n = this.get('i18n');
    return [{
      buttonName: i18n.t('forms.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.custom-button-name'),
      buttonAction: 'userButtonActionTest',
      buttonClasses: 'test-click-button',
      buttonTitle: i18n.t('forms.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.custom-button-name')
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

      @method userButtonActionTest
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
      Handler for click on custom user button in row.

      @method userButtonActionTest
    */
    userButtonInRowActionTest(model) {
      this.set('modelFromClickedRow', model);
    },
  },
});
