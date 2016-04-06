import FlexberryUserSetting from '../models/flexberry-user-setting';

/**
 * It registers technological classes.
 */
export function initialize(application) {
  application.register('model:flexberry-user-setting', FlexberryUserSetting);
}

export default {
  name: 'ember-flexberry-model',
  initialize
};
