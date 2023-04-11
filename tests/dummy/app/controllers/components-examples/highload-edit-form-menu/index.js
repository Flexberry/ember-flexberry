import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'ember-flexberry-dummy-application-user-edit'
   */
  editFormRoute: 'components-examples/highload-edit-form-menu/on-edit-form/user',
});
