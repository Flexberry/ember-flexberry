import ListFormController from 'ember-flexberry/controllers/list-form';
import ListFormControllerOperationsIndicationMixin from 'dummy/mixins/list-form-controller-operations-indication';

export default ListFormController.extend(ListFormControllerOperationsIndicationMixin, {
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-edit'
   */
  editFormRoute: 'components-examples/flexberry-lookup/numeric-autocomplete/numeric-autocomplete-edit',

  exportExcelProjection: 'SuggestionL',

  actions: {
    /**
      Hook that executes before deleting all records on all pages.
      Need to be overriden in corresponding application controller.
    */
    beforeDeleteAllRecords(modelName, data) {
      data.cancel = false;
    }
  }
});
