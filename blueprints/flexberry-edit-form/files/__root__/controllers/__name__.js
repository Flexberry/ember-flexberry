import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  // Caption of this particular edit form.
  title: '<%=caption%>',<%if(parentRoute){%>
  parentRoute: '<%=parentRoute%>',<%}%>
});
