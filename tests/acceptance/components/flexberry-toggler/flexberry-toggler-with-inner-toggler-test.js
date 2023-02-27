import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

let app;
const path = 'components-examples/flexberry-toggler/settings-example-inner';
const testName = 'flexberry-toggler with inner toggler test';

module('Acceptance | flexberry-toggler | ' + testName, {
  beforeEach() {

    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);

    let controller = app.__container__.lookup('controller:components-examples/flexberry-toggler/settings-example-inner');
    controller.set('duration', 0);
  },

  afterEach() {
    Ember.run(app, 'destroy');
  }
});

test(testName, (assert) => {

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path, 'Path is correct');

    let rows = Ember.$('table.flexberry-word-break tbody tr');
    let caption = Ember.$('.ember-text-field', rows[0]);
    fillIn(caption, 'Caption text example');

    andThen(() => {
      let title1 = Ember.$('.title')[0].innerText;
      assert.equal(caption[0].value, title1, 'Caption is correct');

      let expandedInnerCaption = Ember.$('.ember-text-field', rows[5]);
      let collapsedInnerCaption = Ember.$('.ember-text-field', rows[6]);
      fillIn(expandedInnerCaption, 'Expanded inner caption text example');
      fillIn(collapsedInnerCaption, 'Collapsed inner caption text example');

      let expandedCaption = Ember.$('.ember-text-field', rows[1]);
      let collapsedCaption = Ember.$('.ember-text-field', rows[2]);
      fillIn(expandedCaption, 'Expanded caption text example');
      fillIn(collapsedCaption, 'Collapsed caption text example');

      andThen(() => {
        let toggler = Ember.$('.flexberry-toggler .title');
        assert.equal(collapsedInnerCaption[0].value, toggler[1].innerText, 'Collapsed inner caption is correct');

        let promise1 = new Promise((resolve) => {
          click(toggler[1]);
          resolve();
        });

        promise1.then(() => {
          let done = assert.async();
          Ember.run(() => {
            assert.equal(expandedInnerCaption[0].value, toggler[1].innerText, 'Expanded inner caption is correct');
            assert.equal(expandedCaption[0].value, toggler[0].innerText, 'Expanded caption is correct');
            let expandedCheckbox = rows[3].children[0].children[0];
            assert.equal(expandedCheckbox.checked, true, 'expanded=true');

            let promise2 = new Promise((resolve) => {
              click(toggler[0]);
              resolve();
            });
            
            promise2.then(() => {
              Ember.run(() => {
                assert.equal(collapsedCaption[0].value, toggler[0].innerText, 'Collapsed caption is correct');
                assert.equal(expandedCheckbox.checked, false, 'expanded=false');
                click(expandedCheckbox);
                andThen(() => {
                  assert.equal(expandedCheckbox.checked, true, 'expanded=true');
                  let expandedInnerCheckbox = rows[7].children[0].children[0];
                  assert.equal(expandedInnerCheckbox.checked, true, 'inner expanded=true');
                  click(expandedInnerCheckbox);
                  andThen(() => {
                    assert.equal(expandedInnerCheckbox.checked, false, 'inner expanded=false');
                    assert.equal(expandedCheckbox.checked, true, 'expanded=true');
                    let icon = Ember.$('.flexberry-toggler .title .icon')[0];
                    assert.equal(icon.className, 'dropdown icon', 'dropdown icon');
                    let collapsedCaption = Ember.$('.ember-text-field', rows[8]);
                    fillIn(collapsedCaption, 'paw icon');
                    andThen(() => {
                      assert.equal(icon.className, 'paw icon', 'paw icon');
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
  });
});
