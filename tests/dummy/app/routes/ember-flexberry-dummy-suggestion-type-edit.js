import BaseEditFormRoute from './base-edit-form';

export default BaseEditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionTypeE'
   */
  modelProjection: 'SuggestionTypeE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion-type'
   */
  modelName: 'ember-flexberry-dummy-suggestion-type'
});
