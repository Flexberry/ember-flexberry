import BaseEditFormRoute from './base-edit-form';

export default BaseEditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'LocalizationE'
   */
  modelProjection: 'LocalizationE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-localization'
   */
  modelName: 'ember-flexberry-dummy-localization'
});
