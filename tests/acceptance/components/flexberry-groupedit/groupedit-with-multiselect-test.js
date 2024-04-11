import $ from 'jquery';
import { set } from '@ember/object';
import { run, scheduleOnce } from '@ember/runloop';
import { module, test } from 'qunit';
import wait from 'ember-test-helpers/wait';
import { click } from '@ember/test-helpers';
import startApp from '../../../helpers/start-app';

let app;
const path = 'components-examples/flexberry-groupedit/groupedit-with-multiselect-list';
const testName = 'check multiselect in lookup function';

module('Acceptance | flexberry-groupedit | ' + testName, {
  beforeEach() {

    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    set(applicationController,'isInAcceptanceTestMode', true);
  },

  afterEach() {
    // Destroy application.
    run(app, 'destroy');
  },
});

test(testName, function(assert) {
  assert.expect(2);
  let done = assert.async();

  visit(path);

  wait().then(() => {
    assert.equal(currentPath(), path);

    const $olv = $('.object-list-view ');
    const $tbody = $('td.field', $olv)[0];

    run(() => click($tbody));
    wait().then(() => {
      const children = $('tbody', $('div.groupedit-container')[1])[0];
      let startChildrenCount;

      if (children.children[0].cells.length == 1) {
        startChildrenCount = 0;
      } else {
        startChildrenCount = children.childElementCount;
      }

      const $addButton = $('button.ui.ui-add.button')[1];

      if (startChildrenCount == 0) {
        run(() => click($addButton));
      }

      wait().then(() => {
        const $lookupButton = $('button.ui.ui-change.button')[2];

        run(() => click($lookupButton));
        wait().then(() => {

          let fieldCheched = function () {
            const $modal = $('div.flexberry-modal')[0];
            const $checkbox1 = $('div.flexberry-checkbox.ui', $modal)[0];
            const $checkbox2 = $('div.flexberry-checkbox.ui', $modal)[1];

            run(() => {
              click($checkbox1);
              click($checkbox2);
            });
            wait().then(() => {

              /**
               *  Close edit form and equl test
               */
              function closeEditForm() {
                const children = $('tbody', $('div.groupedit-container')[1])[0];
                assert.equal(children.childElementCount, startChildrenCount + 2, 'All records are added');
                const $closeButton = $('button.ui.button.close-button')[0];

                run(() => click($closeButton));
                wait().then(() =>  scheduleOnce('afterRender', done()));
              }

              /**
               * Close lookup function
               */
              function closeLookup()  {
                const $modal = $('div.flexberry-modal')[0];
                const $addRecords = $('button.ui.button', $modal)[0];

                run(() => click($addRecords));
                wait().then(() => {
                  scheduleOnce('afterRender', closeEditForm());
                });
              }

              scheduleOnce('afterRender', closeLookup());
            });
          };

          scheduleOnce('afterRender', fieldCheched());
        });
      });
    });
  });
});

