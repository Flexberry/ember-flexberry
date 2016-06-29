import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import AggregatorModel from '../../../models/components-examples/flexberry-groupedit/shared/aggregator';
import UserSettingsService from 'ember-flexberry/services/user-settings';

moduleForComponent('object-list-view', 'Integration | Component | object list view', {
  integration: true,

  beforeEach: function () {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n'),
      userSettingsService: Ember.inject.service('user-settings')
    });

    UserSettingsService.reopen({
      isUserSettingsServiceEnabled: false
    });
  }
});

test('columns renders', function(assert) {
  this.set('proj', AggregatorModel.projections.get('AggregatorE'));
  this.render(hbs`{{object-list-view modelProjection=proj componentName = "someName"}}`);
  assert.notEqual(this.$('thead tr th').length, 0);
});
