import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import EditFormMixin from '../../mixins/edit-form-mixin';

export default EditFormNewRoute.extend(EditFormMixin, {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'CommentE'
   */
  modelProjection: 'CommentE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-comment'
   */
  modelName: 'ember-flexberry-dummy-comment',

  /**
    Name of controller to be used.

    @property controllerName
    @type String
    @default 'ember-flexberry-dummy-comment-edit'
   */
  controllerName: 'ember-flexberry-dummy-comment-edit',

  /**
    Name of template to be rendered.

    @property templateName
    @type String
    @default 'ember-flexberry-dummy-comment-edit'
   */
  templateName: 'ember-flexberry-dummy-comment-edit'
});
