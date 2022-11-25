import Component from '@ember/component';
import Service, { inject as service } from '@ember/service';

import I18nService from 'ember-i18n/services/i18n';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const formLoadTimeTracker = Service.extend({
  loadTime: 1.0000,
  renderTime: 2.0000,
});

moduleForComponent('form-load-time-tracker', 'Integration | Component | form load time tracker', {
  integration: true,

  beforeEach() {
    this.register('service:form-load-time-tracker', formLoadTimeTracker);
    this.register('service:i18n', I18nService);

    this.inject.service('i18n', { as: 'i18n' });
    Component.reopen({
      i18n: service('i18n')
    });

    this.inject.service('form-load-time-tracker', { as: 'formLoadTimeTracker' });

    // Set 'ru' as initial locale.
    this.set('i18n.locale', 'ru');
  },
});

test('it renders', function(assert) {
  let i18n = this.get('i18n');
  let loadTimeText = i18n.t('components.form-load-time-tracker.load-time');
  let renderTimeText = i18n.t('components.form-load-time-tracker.render-time');
  this.render(hbs`{{form-load-time-tracker}}`);
  assert.equal(this.$().text().trim(), loadTimeText + ': 1\n' + renderTimeText + ': 2');

  this.render(hbs`{{#form-load-time-tracker}}Yield here!{{/form-load-time-tracker}}`);
  assert.equal(this.$().text().trim(), loadTimeText + ': 1\n' + renderTimeText + ': 2\nYield here!');
});
