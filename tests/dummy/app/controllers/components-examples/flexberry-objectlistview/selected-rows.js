import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-type-edit'
   */
  editFormRoute: 'ember-flexberry-dummy-suggestion-type-edit',

  /**
    Count selected rows.

    @property countSelectedRows
    @type Number
    @default 0
  */
  countSelectedRows: 0,

  actions: {
    configurateSelectedRows(selectedRecords) {
      this.set('countSelectedRows', selectedRecords.length);
    }
  }
});
