import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  /**
    Resets routes controller, clears save/delete operations messages.
  */
  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);

    controller.set('showFormSuccessMessage', false);
    controller.set('showFormErrorMessage', false);
  },

  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ApplicationUserPseudodetailE'
   */
  modelProjection: 'ApplicationUserPseudodetailE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-application-user'
   */
  modelName: 'ember-flexberry-dummy-application-user'
});
