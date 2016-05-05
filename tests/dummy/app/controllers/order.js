import DetailEditFormController from './detail-edit-form';

export default DetailEditFormController.extend({
  // Caption of this particular edit form.
  title: 'Order',

  /**
   * Route name for transition on flexberry-objectlistview
   *
   * @property parentRoute
   * @type String
   * @default 'orders'
   */
  parentRoute: 'orders',
});
