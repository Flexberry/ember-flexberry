import EditFormRoute from 'prototype-ember-cli-application/routes/edit-form';
import Model from 'prototype-ember-cli-application/models/order';

export default EditFormRoute.extend({
  modelProjection: Model.Projections.OrderE,
  modelTypeKey: 'order'
});
