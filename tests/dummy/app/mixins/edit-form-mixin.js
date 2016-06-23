import Ember from 'ember';

export default Ember.Mixin.create({
  /**
    Сleaning of the changes on edit form.

    @method resetController
  **/
  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);
    controller.set('showFormSuccessMessage', false);
    controller.set('showFormErrorMessage', false);
  },
});
