import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  /**
    Property to form array of special structures of custom user buttons.

    @property customButtons
    @type Array
   */
  customButtons: Ember.computed('i18n.locale', function() {
    let i18n = this.get('i18n');
    return [{
      buttonName: i18n.t('forms.user-setting-forms.user-setting-delete.all-del-button-name'),
      buttonAction: 'allDelButtonAction',
      buttonClasses: 'all-del-user-button negative'
    }];
  }),

  actions: {
    /**
      Handler for click on custom user button.

      @method userButtonActionTest
     */
    allDelButtonAction: function() {
      this.get('store').findAll('new-platform-flexberry-flexberry-user-setting')
      .then((settings) => {
        settings.content.forEach(function(setting) {
          setting.deleteRecord();
          setting.save();
        });
      });
    }
  }
});
