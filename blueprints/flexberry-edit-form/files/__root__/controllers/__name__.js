import EditFormController from 'ember-flexberry/controllers/edit-form';
import { <%= modelProjection %>Validation } from '../mixins/regenerated/models/<%= modelName %>';

export default EditFormController.extend(<%= modelProjection %>Validation, {<%if(parentRoute){%>
  parentRoute: '<%= parentRoute %>',<%}if (functionGetCellComponent) {%>

  getCellComponent<%= functionGetCellComponent %>,<%}%>
});
