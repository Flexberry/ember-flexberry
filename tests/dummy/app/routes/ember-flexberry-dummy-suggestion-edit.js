import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  /**
   * Name of model projection to be used as record's properties limitation.
   *
   * @property modelProjection
   * @type String
   * @default 'SuggestionE'
   */
  modelProjection: 'SuggestionE',

  /**
   * Name of model to be used as form's record type.
   *
   * @property modelName
   * @type String
   * @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion'
});
