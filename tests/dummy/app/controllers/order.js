import DetailEditFormController from './detail-edit-form';

export default DetailEditFormController.extend({
  // Caption of this particular edit form.
  title: 'Order',

  /**
   * Route name for transition after close edit form.
   *
   * @property parentRoute
   * @type String
   * @default 'orders'
   */
  parentRoute: 'orders',
});
