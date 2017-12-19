import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { filterCollumn } from './folv-tests-functions';
import { Query } from 'ember-flexberry-data';

executeTest('check filter by enter click', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let filtreInsertOperation = 'eq';
  let filtreInsertParametr;

  visit(path + '?perPage=500');
  andThen(function() {
    assert.equal(currentPath(), path);
    let builder2 = new Query.Builder(store).from(modelName).top(1);
    store.query(modelName, builder2.build()).then((result) => {
      let arr = result.toArray();
      filtreInsertParametr = arr.objectAt(0).get('address');
    }).then(function() {
      let $filterButtonDiv = Ember.$('.buttons.filter-active');
      let $filterButton = $filterButtonDiv.children('button');
      let $objectListView = Ember.$('.object-list-view');

      // Activate filtre row.
      $filterButton.click();

      filterCollumn($objectListView, 0, filtreInsertOperation, filtreInsertParametr);

      let done = assert.async();
      window.setTimeout(() => {
        // Apply filter by enter click.
        let input = Ember.$('.ember-text-field')[0];
        input.focus();

        keyEvent(input, "keydown", 13);

        let done1 = assert.async();
        window.setTimeout(() => {

          let controller = app.__container__.lookup('controller:' + currentRouteName());
          let filtherResult = controller.model.content;
          let $notSuccessful = true;
          for (let i = 0; i < filtherResult.length; i++) {
            let address = filtherResult[i]._data.address;
            if (address !== filtreInsertParametr) {
              $notSuccessful = false;
            }
          }

          assert.equal(filtherResult.length >= 1, true, 'Filtered list is not empty');
          assert.equal($notSuccessful, true, 'Filter successfully worked');
          done1();
        }, 100000);
        done();
      }, 100);
    });
  });
});
