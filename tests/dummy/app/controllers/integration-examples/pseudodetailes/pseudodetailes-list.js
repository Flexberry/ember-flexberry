import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'pseudodetailes-edit'
   */
  editFormRoute: 'integration-examples/pseudodetailes/pseudodetailes-edit'
});
