import FlexberryUserSetting from '../models/new-platform-flexberry-flexberry-user-setting';
import FlexberryUserSettingSerializer from '../serializers/new-platform-flexberry-flexberry-user-setting';

/**
 * It registers technological classes.
 */
export function initialize(application) {
  application.register('model:new-platform-flexberry-flexberry-user-setting', FlexberryUserSetting);
  application.register('serializer:new-platform-flexberry-flexberry-user-setting', FlexberryUserSettingSerializer);
}

export default {
  name: 'ember-flexberry-model',
  initialize
};
