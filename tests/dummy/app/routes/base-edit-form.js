import EditFormRoute from 'ember-flexberry/routes/edit-form';

/**
  Base edit form route for dummy application.
 **/
export default EditFormRoute.extend({
  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);
    controller.set('showFormSuccessMessage', false);
    controller.set('showFormErrorMessage', false);
  },
});
