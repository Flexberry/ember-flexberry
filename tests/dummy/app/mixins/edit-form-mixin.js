import Ember from 'ember';

export default Ember.Mixin.create({
  /**
  Base edit form route for dummy application.
  **/
  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);
    controller.set('showFormSuccessMessage', false);
    controller.set('showFormErrorMessage', false);
  },
});
