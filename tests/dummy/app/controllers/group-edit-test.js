import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  title: 'Group edit test',

  getCellComponent: function(attr, bindingPath, model) {
    return this._super(...arguments);
  }
});
