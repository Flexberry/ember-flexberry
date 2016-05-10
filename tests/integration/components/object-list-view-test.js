import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Employee from '../../../models/employee';

moduleForComponent('object-list-view', 'Integration | Component | object list view', {
  integration: true,

  beforeEach: function () {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
  }
});

test('columns renders', function(assert) {
  this.set('proj', Employee.projections.get('EmployeeE'));
  this.render(hbs`{{object-list-view modelProjection=proj componentName = "someName"}}`);
  assert.notEqual(this.$('thead tr th').length, 0);
});
