import $ from 'jquery';
import { run } from '@ember/runloop';
import { get } from '@ember/object';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

let app;
const path = 'components-acceptance-tests/flexberry-simpledatetime/manual-enter';

module('Acceptance | flexberry-simpledatetime | manual enter on groupedit', {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach() {
      run(app, 'destroy');
    }
  });

test('manual enter on groupedit', (assert) => {
  assert.expect(5);
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path, 'Path is correct.');
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let detailModels = get(controller, 'model.details');
    assert.equal(detailModels.length, 2, 'Data contains two details as expected');

    let $datePickers = $('.custom-flatpickr');
    assert.equal($datePickers.length, 2, 'There are two rows on groupedit.');
    fillIn($datePickers[0], '01.01.2022');
    andThen(() => {
      assert.equal(
        '2022-01-01',
        get(detailModels.objectAt(0), 'date').toISOString().split('T')[0],
        'Properly initiated by custom date')
      let today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      let todayForGE = dd + '.' + mm + '.' + yyyy;
      fillIn($datePickers[1], todayForGE);
      andThen(() => {
        assert.equal(
          today.toISOString().split('T')[0],
          get(detailModels.objectAt(1), 'date').toISOString().split('T')[0],
          'Properly initiated by current date')
      });
    });
  });
});
