import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import wait from 'ember-test-helpers/wait';
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

  andThen(() => {
    assert.equal(currentPath(), path);

    let $olv = $('.object-list-view ');
    let $tbody = $('td.field', $olv)[0];
    run(() => {
      let done = assert.async();
      click($tbody);
      andThen(() => {
        const children = Ember.$('tbody', Ember.$('div.groupedit-container')[1])[0];
        let startChildrenCount;

        if (children.children[0].cells.length == 1) {
          startChildrenCount = 0;
        } else {            
          startChildrenCount = children.childElementCount;
        }
        let $addButton = Ember.$('button.ui.ui-add.button')[1];

        if (startChildrenCount == 0) {
          run(() => {
            $addButton.click();
          });
        }

        andThen(() => {
          let $lookupButton = Ember.$('button.ui.ui-change.button')[2];
          run(() => {
            $lookupButton.click();
          });
          wait().then(() => {
            let $modal = Ember.$('div.flexberry-modal')[0];
            let $checkbox1 = Ember.$('div.flexberry-checkbox.ui', $modal)[0];
            let $checkbox2 = Ember.$('div.flexberry-checkbox.ui', $modal)[1];

            $checkbox1.click();
            $checkbox2.click();
            wait().then(() => {
              $modal = Ember.$('div.flexberry-modal')[0];
              let $addRecords = Ember.$('button.ui.button', $modal)[0];
              run(() => {
                click($addRecords);
              });
              andThen(() => {
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
});
