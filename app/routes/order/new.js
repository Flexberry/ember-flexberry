import EditFormNewRoute from 'prototype-ember-cli-application/routes/edit-form-new';
import Model from 'prototype-ember-cli-application/models/order';

export default EditFormNewRoute.extend({
  view: Model.Views.OrderE,
  modelTypeKey: 'order'
});
