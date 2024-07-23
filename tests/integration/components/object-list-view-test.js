import Component from '@ember/component';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import AggregatorModel from '../../../models/components-examples/flexberry-groupedit/shared/aggregator';
import UserSettingsService from 'ember-flexberry/services/user-settings';

let App;

module('Integration | Component | object-list-view', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    App = startApp();
    Component.reopen({
      i18n: service('i18n'),
      userSettingsService: service('user-settings')
    });

    UserSettingsService.reopen({
      isUserSettingsServiceEnabled: false
    });

    // Just take it and turn it off...
    App.__container__.lookup('service:log').set('enabled', false);
  });

  test('columns renders', async function(assert) {
    let store = this.owner.lookup('service:store');

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');

      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
    });

    await render(hbs`{{object-list-view modelProjection=this.proj content=this.model.details componentName="someName"}}`);
    assert.notEqual(this.element.textContent.trim(), '');
  });
});