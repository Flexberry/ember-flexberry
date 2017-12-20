import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-edit'
   */
  editFormRoute: 'components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox',

  exportExcelProjection: 'SuggestionL'
});
