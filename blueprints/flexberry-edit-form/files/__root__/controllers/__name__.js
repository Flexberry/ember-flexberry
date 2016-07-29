import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  // Caption of this particular edit form.
  <%if(parentRoute){%>
  parentRoute: '<%= parentRoute %>',<%}if (functionGetCellComponent) {%>
  getCellComponent: <%= functionGetCellComponent %>,<%}%>
});
