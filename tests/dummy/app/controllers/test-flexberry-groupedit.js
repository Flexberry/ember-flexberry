import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  title: 'Test flexberry-groupedit',

  getCellComponent: function(attr, bindingPath, model) {
    return this._super(...arguments);
  }
});
