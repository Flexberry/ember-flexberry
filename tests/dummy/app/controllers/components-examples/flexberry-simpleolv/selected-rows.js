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
    Name of compoent.

    @property componentName
    @type String
    @default 'suggestionTypeLocalizedTypesObjectListView'
   */
  componentName: 'SOLVsuggestionTypeLocalizedTypesObjectListView',

  /**
    Count selected rows.

    @property countSelectedRows
    @type Number
    @default 0
  */
  countSelectedRows: 0,

  actions: {
    configurateSelectedRows(selectedRecords) {
      if (this.get('allSelect')) {
        this.set('countSelectedRows', this.model.meta.count);
      } else {
        this.set('countSelectedRows', selectedRecords.length);
      }
    }
  },

  _selectAll(componentName, selectAllParameter) {
    if (componentName === this.get('componentName')) {
      this.set('allSelect', selectAllParameter);
    }
  },

  init: function() {
    this.get('objectlistviewEventsService').on('updateSelectAll', this, this._selectAll);
  }
});
