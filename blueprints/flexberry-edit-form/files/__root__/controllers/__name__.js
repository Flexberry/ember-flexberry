import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({<%if(parentRoute){%>
  parentRoute: '<%= parentRoute %>',<%}if (functionGetCellComponent) {%>

  getCellComponent<%= functionGetCellComponent %>,<%}%>
});
