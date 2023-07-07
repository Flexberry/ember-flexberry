import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import wait from 'ember-test-helpers/wait';
let app;

module('Acceptance | high-edit-form-menu', {
  beforeEach() {
    app = startApp();
  },

  afterEach() {
    // Destroy application.
    run(app, 'destroy');
  },
});

test('it properly renders', function(assert) {
  assert.expect(7);
  let done = assert.async();

  let path = 'components-examples/highload-edit-form-menu/index';
  visit(path);
  andThen(function() {
    assert.equal(currentURL(), path);
    $('.object-list-view').find('tr')[1].children[1].click();

    andThen(function() {
      wait().then(() => {
        assert.equal($('.gruppaPolejVvoda').length, 4, 'all tabs are here');
        assert.equal($('.gruppaPolejVvoda.active').length, 1, 'only one tab is active');
        assert.equal($('.gruppaPolejVvoda')[0].classList.contains('active'), true, 'first tab is active')

        run(() => {
          $('.tabsNavigation')[0].click();
        });

        wait().then(() => {
          assert.equal($('.gruppaPolejVvoda')[1].classList.contains('active'), true, 'next tab is active')

          run(() => {
            $('.tabsNavigation')[1].click();
          });

          wait().then(() => {
            assert.equal($('.gruppaPolejVvoda')[0].classList.contains('active'), true, 'previous tab is active')

            run(() => {
              $('.showAllFormsButton').click();
            });

            wait().then(() => {
              assert.equal($('.gruppaPolejVvoda.active').length, 4, 'all tabs are active');
              done();
            });
          });
        });
      });
    });
  });
});
