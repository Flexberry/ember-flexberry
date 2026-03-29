import $ from 'jquery';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { settled } from '@ember/test-helpers';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { run } from '@ember/runloop';

let app;
module('Acceptance | high-edit-form-menu', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    app = startApp();
  });

  hooks.afterEach(function () {
    // Destroy application.
    run(app, 'destroy');
  });

  test('it properly renders', async function (assert) {
    assert.expect(7);

    let path = 'components-examples/highload-edit-form-menu/index';
    await visit(path);
    assert.equal(currentURL(), path);
    $('.object-list-view').find('tr')[1].children[1].click();

    await settled();
    assert.equal($('.gruppaPolejVvoda').length, 4, 'all tabs are here');
    assert.equal($('.gruppaPolejVvoda.active').length, 1, 'only one tab is active');
    assert.equal($('.gruppaPolejVvoda')[0].classList.contains('active'), true, 'first tab is active');

    run(() => {
      $('.tabsNavigation')[0].click();
    });

    await settled();
    assert.equal($('.gruppaPolejVvoda')[1].classList.contains('active'), true, 'next tab is active');

    run(() => {
      $('.tabsNavigation')[1].click();
    });

    await settled();
    assert.equal($('.gruppaPolejVvoda')[0].classList.contains('active'), true, 'previous tab is active');

    run(() => {
      $('.showAllFormsButton').click();
    });

    await settled();
    assert.equal($('.gruppaPolejVvoda.active').length, 4, 'all tabs are active');
  });
});
