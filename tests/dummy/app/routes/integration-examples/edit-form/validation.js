import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'BaseE'
   */
  modelProjection: 'BaseE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'integration-examples/edit-form/validation/base'
   */
  modelName: 'integration-examples/edit-form/validation/base',

  /**
    Returns model related to current route.

    @method model
   */
  model(params) {
    return this.get('store').createRecord('integration-examples/edit-form/validation/base', {});
  }
});
