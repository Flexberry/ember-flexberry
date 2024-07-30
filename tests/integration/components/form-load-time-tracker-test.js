import Component from '@ember/component';
import Service from '@ember/service';
import { inject as service } from '@ember/service';

import I18nService from 'ember-i18n/services/i18n';
import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

const formLoadTimeTracker = Service.extend({
  loadTime: 1.0000,
  renderTime: 2.0000,
});

module('Integration | Component | form load time tracker', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:form-load-time-tracker', formLoadTimeTracker);
    this.owner.register('service:i18n', I18nService);

    this.i18n = this.owner.lookup('service:i18n');
    Component.reopen({
      i18n: service('i18n')
    });

    this.formLoadTimeTracker = this.owner.lookup('service:form-load-time-tracker');

    // Set 'ru' as initial locale.
    this.set('i18n.locale', 'ru');
  });

  test('it renders', async function(assert) {
    let i18n = this.get('i18n');
    let loadTimeText = i18n.t('components.form-load-time-tracker.load-time');
    let renderTimeText = i18n.t('components.form-load-time-tracker.render-time');
    await render(hbs`{{form-load-time-tracker}}`);
    assert.equal($(this.element).text().trim(), loadTimeText + ': 1\n' + renderTimeText + ': 2');

    await render(hbs`{{#form-load-time-tracker}}Yield here!{{/form-load-time-tracker}}`);
    assert.equal($(this.element).text().trim(), loadTimeText + ': 1\n' + renderTimeText + ': 2\nYield here!');
  });
});
