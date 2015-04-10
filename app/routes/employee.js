import EditFormRoute from 'prototype-ember-cli-application/routes/edit-form';
import Model from 'prototype-ember-cli-application/models/employee';

export default EditFormRoute.extend({
    view: Model.Views.EmployeeeE,
    modelTypeKey: 'employee'
});
