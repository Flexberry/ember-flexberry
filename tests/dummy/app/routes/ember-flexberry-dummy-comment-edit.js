import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  modelProjection: 'CommentE',
  modelName: 'ember-flexberry-dummy-comment',

  controllerName: 'ember-flexberry-dummy-comment-edit',
  templateName: 'ember-flexberry-dummy-comment-edit'
});
