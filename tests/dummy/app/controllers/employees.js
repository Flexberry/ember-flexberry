import ListFormController from './list-form';

var EmployeesController = ListFormController;
export default EmployeesController.extend({
  /**
   * Route name for edit model on row click in flexberry-objectlistview
   *
   * @property editFormRoute
   * @type String
   * @default 'employee-edit'
   */
  editFormRoute: 'employee-edit'
});
