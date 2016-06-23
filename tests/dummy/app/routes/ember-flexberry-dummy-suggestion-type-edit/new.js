import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import EditFormMixin from '../../mixins/edit-form-mixin';

export default EditFormNewRoute.extend(EditFormMixin, {
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
  modelName: 'ember-flexberry-dummy-suggestion-type',

  /**
    Name of controller to be used.

    @property controllerName
    @type String
    @default 'ember-flexberry-dummy-suggestion-type-edit'
   */
  controllerName: 'ember-flexberry-dummy-suggestion-type-edit',

  /**
    Name of template to be rendered.

    @property templateName
    @type String
    @default 'ember-flexberry-dummy-suggestion-type-edit'
   */
  templateName: 'ember-flexberry-dummy-suggestion-type-edit'
});
