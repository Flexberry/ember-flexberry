import ListFormController from 'ember-flexberry/controllers/list-form';
import ListFormControllerOperationsIndicationMixin from 'dummy/mixins/list-form-controller-operations-indication';

export default ListFormController.extend(ListFormControllerOperationsIndicationMixin, {
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-edit'
   */
  editFormRoute: 'components-examples/flexberry-groupedit/groupedit-with-multiselect-edit',

  exportExcelProjection: 'SuggestionL'
});

