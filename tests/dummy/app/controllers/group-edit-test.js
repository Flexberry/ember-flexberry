import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  title: 'Group edit test',

  getCellComponent: function (attr, bindingPath) {
    return 'object-list-view-input-cell';
  }
});
