import Ember from 'ember';
import ListFormPageRoute from 'prototype-ember-cli-application/routes/list-form-page';
import Model from 'prototype-ember-cli-application/models/order';

export default ListFormPageRoute.extend({
  modelName: 'order',
  modelProjection: Ember.computed(function() {
    return Model.projections.OrderL;
  })
});
