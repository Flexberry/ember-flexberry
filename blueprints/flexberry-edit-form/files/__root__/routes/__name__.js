import EditFormRoute from 'ember-flexberry/routes/edit-form';
import EditFormMixin from '../../mixins/edit-form-mixin';

export default EditFormRoute.extend(EditFormMixin, {
  modelProjection: '<%=modelProjection%>',
  modelName: '<%=modelName%>'
});
