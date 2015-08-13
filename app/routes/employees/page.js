import Ember from 'ember';
import ListFormPageRoute from 'prototype-ember-cli-application/routes/list-form-page';
import Model from 'prototype-ember-cli-application/models/employee';

export default ListFormPageRoute.extend({
  modelName: 'employee',
  modelProjection: Ember.computed(function() {
    return Model.projections.EmployeeL;
  })
});
