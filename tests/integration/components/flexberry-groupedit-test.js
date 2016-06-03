import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import AggregatorModel from '../../../models/components-examples/flexberry-groupedit/settings-example/aggregator';

moduleForComponent('flexberry-groupedit', 'Integration | Component | Flexberry groupedit', {
  integration: true,

  beforeEach: function () {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('proj', AggregatorModel.projections.get('AggregatorE'));
  this.render(hbs`{{flexberry-groupedit modelProjection=proj componentName='my-group-edit'}}`);
  assert.ok(true);
});
