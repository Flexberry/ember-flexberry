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
  /* eslint-disable no-unused-vars */
  model(params) {
    let store = this.get('store');

    // Create base model.
    let base = store.createRecord('integration-examples/edit-form/validation/base', {});

    // Create detail & add to base model.
    let detail1 = store.createRecord('integration-examples/edit-form/validation/detail', {});
    base.get('details').pushObject(detail1);

    return base;
  }
  /* eslint-enable no-unused-vars */
});
