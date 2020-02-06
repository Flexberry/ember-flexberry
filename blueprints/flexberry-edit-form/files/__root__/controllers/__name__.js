import <%=importFormControllerName%> from '<%=importFormControllerPath%>';

export default EditFormController.extend({<%if(parentRoute){%>
  parentRoute: '<%= parentRoute %>',<%}if (functionGetCellComponent) {%>

  getCellComponent<%= functionGetCellComponent %>,<%}%>
});
