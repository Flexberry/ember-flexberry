import EditFormRoute from 'ember-flexberry/routes/edit-form';
import EditFormMixin from '../mixins/edit-form-mixin';

export default EditFormRoute.extend(EditFormMixin, {
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
  modelName: 'ember-flexberry-dummy-comment'
});
