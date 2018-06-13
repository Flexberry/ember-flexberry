import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import serializeSortingParam from 'ember-flexberry/utils/serialize-sorting-param';
import { translationMacro as t } from 'ember-i18n';

export default EditFormController.extend({
  lookupComponentName: 'lookupUserSettings',

  actions: {
    /**
      This method returns custom properties for lookup window.

      @method getLookupFolvProperties
      @param {Object} options Parameters of lookup that called this method.
      @param {String} [options.projection] Lookup projection.
      @param {String} [options.relationName] Lookup relation name.
      @return {Object} Set of options for lookup window.
     */
    getLookupFolvProperties: function(options) {
      let methodArgs = Ember.merge({
        projection: undefined,
        relationName: undefined
      }, options);

      if (methodArgs.relationName === 'type') {
        return {
          filterButton: true,
          customButtons: [{
            i18n: this.get('i18n'),
            buttonName: t('components.olv-toolbar.clear-sorting-button-text'),
            buttonAction: () => {
              let defaultUserSetting = this.get('userSettingsService').getDefaultDeveloperUserSetting(this.get('lookupComponentName'));
              this.set('lookupController.sort', serializeSortingParam(defaultUserSetting.sorting || []));
            },
          }],
        };
      }

      return undefined;
    }
  }
});
