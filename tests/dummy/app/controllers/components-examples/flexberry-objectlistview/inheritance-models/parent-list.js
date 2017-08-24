import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'components-examples/flexberry-objectlistview/inheritance-models/base-edit'
   */
  editFormRoute: 'components-examples/flexberry-objectlistview/inheritance-models/parent-edit'
});
