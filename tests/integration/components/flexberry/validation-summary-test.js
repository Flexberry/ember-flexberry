import Ember from 'ember';
import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import {setupRenderingTest} from 'ember-qunit';
import {render} from '@ember/test-helpers';
import $ from 'jquery';

const { A, run } = Ember;

// eslint-disable-next-line ember/no-test-module-for
module( 'Integration | Component | flexberry/validation-summary', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders and works', async function(assert) {
    // eslint-disable-next-line ember/no-test-this-render, hbs/check-hbs-template-literals
    await render(hbs`{{flexberry/validation-summary errors=errors color=color header=header}}`);

    const errors = this.set('errors', A());
    assert.ok($('.ui.message', this.element).is(':hidden'), 'Component is hidden if no errors.');

    run(() => {
      errors.pushObject('Validation error.');
    });

    assert.ok($('.ui.message', this.element).is(':visible'), 'Component is visible if there errors.');
    assert.ok($(this.element).text().trim(), 'Validation error.', 'Component shows errors at added.');

    this.set('header', 'Validation errors');
    assert.ok(/Validation errors\s*/.test($(this.element).text().trim()), 'Component has a header.');

    assert.notOk($(this.element, '.ui.label').hasClass('red'), 'Override default color with undefined value.');

    this.set('color', 'blue');
    assert.ok($('.ui.message', this.element).hasClass('blue'), 'Color works through CSS class.');

    // eslint-disable-next-line ember/no-test-this-render, hbs/check-hbs-template-literals
    await render(hbs`{{flexberry/validation-summary}}`);

    assert.ok($('.ui.message', this.element).hasClass('red'), `Default color 'red'.`);
  });
});