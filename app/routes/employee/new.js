import EditFormNewRoute from 'prototype-ember-cli-application/routes/edit-form-new';
import Model from 'prototype-ember-cli-application/models/employee';

export default EditFormNewRoute.extend({
  modelProjection: Model.Projections.EmployeeE,
  modelTypeKey: 'employee'
});
