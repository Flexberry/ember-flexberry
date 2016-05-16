import ListFormController from './list-form';

var OrdersController = ListFormController;
export default OrdersController.extend({
  /**
   * Route name for edit model on row click in flexberry-objectlistview.
   *
   * @property editFormRoute
   * @type String
   * @default 'order'
   */
  editFormRoute: 'order',
});
