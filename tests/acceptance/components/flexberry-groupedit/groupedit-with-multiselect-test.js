import $ from 'jquery';
import { run } from '@ember/runloop';
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
    applicationController.set('isInAcceptanceTestMode', true);
  }
});

test(testName, (assert) => {
  assert.expect(2);
  visit(path);

  wait().then(() => {
    assert.equal(currentPath(), path);

    let $olv = $('.object-list-view ');
    let $tbody = $('td.field', $olv)[0];
    let done = assert.async();
    run(() => click($tbody));
    wait().then(() => {
      const children = $('tbody', $('div.groupedit-container')[1])[0];
      let startChildrenCount;

      if (children.children[0].cells.length == 1) {
        startChildrenCount = 0;
      } else {            
        startChildrenCount = children.childElementCount;
      }
      let $addButton = $('button.ui.ui-add.button')[1];

      if (startChildrenCount == 0) {
        run(() => {
          click($addButton);
        });
      }

      wait().then(() => {
        let $lookupButton = $('button.ui.ui-change.button')[2];
        run(() => {
          click($lookupButton);
        });
        wait().then(() => {
          let $modal = $('div.flexberry-modal')[0];
          let $checkbox1 = $('div.flexberry-checkbox.ui', $modal)[0];
          let $checkbox2 = $('div.flexberry-checkbox.ui', $modal)[1];

          run( function () {
            click($checkbox1);
            click($checkbox2);
          });
          wait().then(() => {
            $modal = $('div.flexberry-modal')[0];
            let $addRecords = $('button.ui.button', $modal)[0];
            run(() => {
              click($addRecords);
            });
            wait().then(() => {
              assert.equal(children.childElementCount, startChildrenCount + 2, 'All records are added');
              
              wait().then(() => {
                run(app, 'destroy');
              });
              done();
            });
          });
        });
      });
    });
  });
});
