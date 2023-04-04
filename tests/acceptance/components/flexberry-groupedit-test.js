import $ from 'jquery';
import { run } from '@ember/runloop';
import { get, set } from '@ember/object';
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
    set(applicationController, 'isInAcceptanceTestMode', true);
  },

  afterEach() {
    // Destroy application.
    run(app, 'destroy');
  },
});


test('it properly rerenders', function(assert) {
  assert.expect(4);
  let done = assert.async();

  let path = 'components-acceptance-tests/flexberry-groupedit/properly-rerenders';
  visit(path);
  wait().then(() => {

    assert.equal($('.object-list-view').find('tr').length, 2);

    // Add record.
    let controller = app.__container__.lookup('controller:' + currentRouteName());

    let detailModel =  get(controller, 'model.details');
    let store = get(controller, 'store');

    let detail1 = store.createRecord('components-examples/flexberry-groupedit/shared/detail');
    let detail2 = store.createRecord('components-examples/flexberry-groupedit/shared/detail');
    detailModel.pushObjects([detail1, detail2]);

    wait().then(() => {
      assert.equal($('.object-list-view').find('tr').length, 3);

      let $componentGroupEditToolbar = $('.groupedit-toolbar');
      let $componentButtons = $componentGroupEditToolbar.children('.ui.button');
      let $componentButtonAdd = $($componentButtons[0]);

      run(() => {
        $componentButtonAdd.click();
      });

      wait().then(() => {
        assert.equal($('.object-list-view').find('tr').length, 4, 'details add properly');

        let $componentCheckBoxs = $('.flexberry-checkbox', $('.object-list-view'));
        let $componentFirstCheckBox = $($componentCheckBoxs[0]);

        run(() => {
          $componentFirstCheckBox.click();
        });

        wait().then(() => {
          let $componentButtonRemove = $($componentButtons[1]);

          run(() => {
            $componentButtonRemove.click();
          });

          assert.equal($('.object-list-view').find('tr').length, 3, 'details remove properly');
          done();
        });
      });
    });
  });
});
