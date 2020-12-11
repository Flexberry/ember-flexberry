/**
  @module ember-flexberry
 */

/**
 * Registry options for default user settings
 *
 * @param applicationInstance
 */
export function initialize(applicationInstance) {

  applicationInstance.registerOptionsForType('default-user-setting', { instantiate: false });
}

export default {
  name: 'default-user-settings',
  initialize: initialize
};
