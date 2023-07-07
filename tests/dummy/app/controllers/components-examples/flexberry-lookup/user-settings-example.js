import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({

  userSettings: service(),

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
      get(this, 'userSettings').deleteUserSetting('ApplicationUserObjectlistView');
    }
  }
});
