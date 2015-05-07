import EditFormRoute from 'prototype-ember-cli-application/routes/edit-form';
import Model from 'prototype-ember-cli-application/models/order';

export default EditFormRoute.extend({
    view: Model.Views.OrderE,
    modelTypeKey: 'order'
});
