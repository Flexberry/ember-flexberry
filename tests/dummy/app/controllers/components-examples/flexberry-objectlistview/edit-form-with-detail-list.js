import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';
export default ListFormController.extend({
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'components-examples/flexberry-objectlistview/edit-form-with-detail-edit'
   */
  editFormRoute: 'components-examples/flexberry-objectlistview/edit-form-with-detail-edit',

  customButtonsInRow:Ember.computed('i18n.locale', function() {
    let i18n = this.get('i18n');
    return [{
      buttonName: i18n.t('forms.components-examples.flexberry-objectlistview.edit-form-with-detail-list.custom-row-button-name') + 1,
      buttonAction: 'test1',
      buttonClasses: 'test-click-button',
      buttonIcon: 'edit icon',
      buttonTitle: i18n.t('forms.components-examples.flexberry-objectlistview.edit-form-with-detail-list.custom-row-button-name') + 1
    },
    {
      buttonName: i18n.t('forms.components-examples.flexberry-objectlistview.edit-form-with-detail-list.custom-row-button-name') + 2,
      buttonAction: 'test2',
      buttonClasses: 'test-click-button',
      buttonIcon: 'edit icon',
      buttonTitle: i18n.t('forms.components-examples.flexberry-objectlistview.edit-form-with-detail-list.custom-row-button-name') + 2
    }];
  }),

  actions: {
    /**
      Handler for click on custom user button.
      @method userButtonActionTest
     */
    test1: function(rowId) {
      console.log('test 1 ' + rowId);
    },

    test2: function(rowId) {
      console.log('test 2 ' + rowId);
    }
  }
});
