import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';
import { set } from '@ember/object';

let app;
const path = 'components-examples/flexberry-multiple-lookup/configurate-tags';
const testName = 'configurate tags test';

module('Acceptance | flexberry-multiple-lookup | ' + testName, {
  beforeEach() {
    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    set(applicationController, 'isInAcceptanceTestMode', true);
  },

  afterEach() {
    run(app, 'destroy');
  }
});

test(testName, (assert) => {
  assert.expect(7);

  visit(path);

  wait().then(() => {
    assert.equal(currentPath(), path, 'Path is correct');

    const $lookup = $('.flexberry-lookup');
    const $lookupButtouChoose = $lookup.find('.ui-change');

    run(() => $lookupButtouChoose.click());

    wait().then(() => {
      let $olv = $('.object-list-view');
      let $tbody = $olv.find('td');

      run(() => $tbody[1].click());

      wait().then(() => {
        let $tags = $('div a.ui.label');

        assert.strictEqual($tags.length, 1, 'Tag is rendered');

        let $deleteIcon = $($tags[0]).children('i.delete.icon');
        const username = $tags[0].innerText.split(' ').join('');

        assert.strictEqual($deleteIcon.length, 1, 'Delete icon is rendered');

        run(() => $deleteIcon.click());

        wait().then(() => {
          $tags = $('div a.ui.label');

          assert.strictEqual($tags.length, 0, 'Tag removed');

          const $table = $('table.ui.celled.table.flexberry-word-break');
          const $fields = $table.find('.ember-text-field');
          const $checkboxes = $table.find('.ember-checkbox');

          fillIn($fields[0], username);
          fillIn($fields[1], 'red');

          run(() => $checkboxes[0].click());
          run(() => $checkboxes[1].click());
          run(() => $lookupButtouChoose.click());

          wait().then(() => {
            $olv = $('.object-list-view');
            $tbody = $olv.find('td');

            run(() => $tbody[1].click());

            wait().then(() => {
              $tags = $('div a.ui.label');

              assert.strictEqual($tags.length, 1, 'Tag is rendered');

              assert.strictEqual($($tags[0]).hasClass('red'), true, 'Component\'s wrapper has \'red\' css-class');

              $deleteIcon = $($tags[0]).children('i.delete.icon');

              assert.strictEqual($deleteIcon.length, 0, 'Delete icon is not rendered');
            });
          });
        });
      });
    });
  });
});
