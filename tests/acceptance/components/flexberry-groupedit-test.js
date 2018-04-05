import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import wait from 'ember-test-helpers/wait';
let app;

module('Acceptance | flexberry-groupedit', {
  beforeEach() {
    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);
  },

  afterEach() {
    // Destroy application.
    Ember.run(app, 'destroy');
  },
});


test('it properly rerenders', function(assert) {
  let done = assert.async();

  let path = 'components-acceptance-tests/flexberry-groupedit/properly-rerenders';
  visit(path);
  wait().then(() => {

    assert.equal(Ember.$('.object-list-view').find('tr').length, 2);

    // Add record.
    let controller = app.__container__.lookup('controller:' + currentRouteName());

    let detailModel =  controller.get('model.details');
    let store = controller.get('store');

    let detail1 = store.createRecord('components-examples/flexberry-groupedit/shared/detail');
    let detail2 = store.createRecord('components-examples/flexberry-groupedit/shared/detail');
    detailModel.pushObjects([detail1, detail2]);

    wait().then(() => {
      assert.equal(Ember.$('.object-list-view').find('tr').length, 3);

      let $componentGroupEditToolbar = Ember.$('.groupedit-toolbar');
      let $componentButtons = $componentGroupEditToolbar.children('.ui.button');
      let $componentButtonAdd = Ember.$($componentButtons[0]);

      Ember.run(() => {
        $componentButtonAdd.click();
      });

      wait().then(() => {
        assert.equal(Ember.$('.object-list-view').find('tr').length, 4, 'details add properly');

        let $componentCheckBoxs = Ember.$('.flexberry-checkbox', Ember.$('.object-list-view'));
        let $componentFirstCheckBox = Ember.$($componentCheckBoxs[0]);

        Ember.run(() => {
          $componentFirstCheckBox.click();
        });

        wait().then(() => {
          let $componentButtonRemove = Ember.$($componentButtons[1]);

          Ember.run(() => {
            $componentButtonRemove.click();
          });

          assert.equal(Ember.$('.object-list-view').find('tr').length, 3, 'details remove properly');
          done();
        });
      });
    });
  });
});
