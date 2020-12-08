/**
 * Registry options for default user settings
 *
 * @param applicationInstance
 */
export function initialize(applicationInstance) {
  applicationInstance.registerOptionsForType('user-setting', { instantiate: false });
}

export default {
  name: 'default-user-settings',
  initialize: initialize
};
