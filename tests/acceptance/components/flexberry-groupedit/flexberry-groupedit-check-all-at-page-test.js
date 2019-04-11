import Ember from 'ember';
import { module, test } from 'qunit';
import { loadingList } from '../flexberry-objectlistview/folv-tests-functions';
import startApp from '../../../helpers/start-app';

let app;
const path = 'components-examples/flexberry-groupedit/configurate-row-example';
const testName = 'check all at page';
var olvContainerClass = '.object-list-view-container';
var trTableClass = 'table.object-list-view tbody tr';

module('Acceptance | flexberry-groupedit | ' + testName, {
  beforeEach() {

    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);
  },

  afterEach() {
    Ember.run(app, 'destroy');
  }
});

test(testName, (assert) => {
  assert.expect(3);

  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $olv = Ember.$('.object-list-view ');
    let $thead = Ember.$('th.dt-head-left', $olv)[0];

    Ember.run(() => {
      let done = assert.async();
      loadingList($thead, olvContainerClass, trTableClass).then(($list) => {
        assert.ok($list);
        let $columns = Ember.$('.object-list-view-helper-column');

        let $checkAllAtPageButton = Ember.$('.check-all-at-page-button');
        $checkAllAtPageButton.click();

        let $checkBox = Ember.$('.object-list-view-helper-column-cell .flexberry-checkbox');
        let $checkCheckBox = Ember.$($checkBox, '.checked');
        assert.equal($checkCheckBox.length, $columns.length, 'all checkBox in row are select');

        done();
      });
    });
  });
});
