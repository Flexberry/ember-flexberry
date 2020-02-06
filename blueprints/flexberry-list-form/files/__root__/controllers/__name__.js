import <%=importFormControllerName%> from '<%=importFormControllerPath%>';

export default ListFormController.extend({
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default '<%= editForm %>'
   */
  editFormRoute: '<%= editForm %>'
});
