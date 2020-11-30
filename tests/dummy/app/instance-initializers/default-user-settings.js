import SuggestionTypeDefaultUserSettings from '../default-user-settings/suggestion-type';

/**
 * Initializes default user settings for models
 *
 * @param applicationInstance
 */
export function initialize(applicationInstance) {

  applicationInstance.register('user-setting:ember-flexberry-dummy-suggestion-type', SuggestionTypeDefaultUserSettings.DEFAULT, { instantiate: false });
}

export default {
  name: 'default-user-settings',
  initialize: initialize
};
