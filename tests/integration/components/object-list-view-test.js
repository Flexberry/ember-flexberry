import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import AggregatorModel from '../../../models/components-examples/flexberry-groupedit/shared/aggregator';
import UserSettingsService from 'ember-flexberry/services/user-settings';

let App;

moduleForComponent('object-list-view', 'Integration | Component | object list view', {
  integration: true,

  beforeEach: function () {
    App = startApp();
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n'),
      userSettingsService: Ember.inject.service('user-settings')
    });

    UserSettingsService.reopen({
      isUserSettingsServiceEnabled: false
    });

    // Just take it and turn it off...
    App.__container__.lookup('service:log').set('enabled', false);
  }
});

test('columns renders', function(assert) {
  let store = App.__container__.lookup('service:store');

  Ember.run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.render(hbs`{{object-list-view modelProjection=proj content=model.details componentName="someName"}}`);
    assert.notEqual(this.$().text().trim(), '');
  });
});
