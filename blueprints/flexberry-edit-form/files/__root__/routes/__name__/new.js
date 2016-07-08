import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import EditFormMixin from '../../mixins/edit-form-mixin';

export default EditFormNewRoute.extend(EditFormMixin, {
  modelProjection: '<%=modelProjection%>',
  modelName: '<%=modelName%>',
  templateName: '<%=entityName%>',
});
