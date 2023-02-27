import EditFormController from 'ember-flexberry/controllers/edit-form';
import Ember from 'ember';

export default EditFormController.extend({

  userSettings: Ember.inject.service(),

  /**
    Flag indicates whether 'flexberry-lookup' component use user settings or not.

    @property notUseUserSettings
    @type Boolean
    @default false
   */
  notUseUserSettings: false,

  actions: {
    getLookupFolvProperties() {
      return {
        colsConfigButton: true,
      };
    },

    clearUserSetting() {
      Ember.get(this, 'userSettings').deleteUserSetting('ApplicationUserObjectlistView');
    }
  }
});
