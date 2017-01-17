import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
import { executeTest } from './execute-folv-test';

let checkSortingList = (store, assert, projection, $olv, ordr)=>{
  return new Ember.RSVP.Promise((resolve) => {
    Ember.run(() => {
      let modelName = projection.modelName;
      let builder = new Query.Builder(store).from(modelName).selectByProjection(projection.projectionName);
      builder = !ordr ? builder : builder.orderBy(ordr) ;
      store.query(modelName, builder.build()).then((records) => {
        let recordsArr = records.toArray();
        let $tr = Ember.$('table.object-list-view tbody tr').toArray();
        let isTrue = true;
        $tr.forEach((item, i, arr) => {
          let expectVal = !recordsArr[i].get('address') ? '': recordsArr[i].get('address');
          isTrue = isTrue && (Ember.$.trim(item.children[1].innerText) === expectVal);
        });
        resolve(isTrue);
      });
    });
  });
};

export function appendSort($ctrlForClick) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;
    let timeout = 10000;

    Ember.run(() => {
      $ctrlForClick.click();
    });

    Ember.run(() => {
      checkIntervalId = window.setInterval(() => {
        let $list = Ember.$('.object-list-view-container');
          let $records = Ember.$('table.object-list-view tbody tr', $list);
          if ($records.length === 0) {
            // Data isn't loaded yet.
            return;
        }
        // Data is loaded.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;
        resolve($list);
      }, checkInterval);
    });

    // Set wait timeout.
    Ember.run(() => {
      window.setTimeout(() => {
        if (checkIntervalSucceed) {
          return;
        }
        // Time is out.
        // Stop intervals & reject promise.
        window.clearInterval(checkIntervalId);
        reject('editForm load operation is timed out');
      }, timeout);
    });
  });
}

executeTest('check sorting', (store, assert, app) => {
  assert.expect(11);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {
    // Check page path.
    assert.equal(currentPath(), path);
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let projectionName = Ember.get(controller, 'modelProjection');

    let $olv = Ember.$('.object-list-view ');
    let getTh = (item) => { return Ember.$('th.dt-head-left', $olv)[item]; };
    Ember.run(() => {
      let done = assert.async();
      // Check sortihg in the first column. Sorting is not append.
      checkSortingList(store, assert,  projectionName, $olv, null).then((isTrue) => {
        assert.ok(isTrue, 'sorting is not applied');
        // Check sortihg icon in the first column. Sorting icon is not added.
        assert.equal( getTh(0).children[0].children.length, 1, 'no sorting icon in the first column' );

        appendSort(getTh(0)).then(($list) => {
          let ord = () => { return Ember.$(getTh(0).children[0].children[1].children[0]); };

          assert.ok($list);
          assert.equal(ord().attr('title'), 'Order ascending', 'title is Order ascending');
          assert.equal(Ember.$.trim(ord().text()), String.fromCharCode('9650')+'1', 'sorting symbol added');
          let done1 = assert.async();
          checkSortingList(store, assert,  projectionName, $olv, 'address asc').then((isTrue) => {
            assert.ok(isTrue, 'sorting applied');
            let done2 = assert.async();
            appendSort(getTh(0)).then(($list) => {
              assert.ok($list);
              assert.equal( ord().attr('title'), 'Order descending', 'title is Order descending' );
              assert.equal( Ember.$.trim(ord().text()), String.fromCharCode('9660')+'1', 'sorting symbol changed' );
              let done3 = assert.async();
              checkSortingList(store, assert,  projectionName, $olv, 'address desc').then((isTrue) => {
                assert.ok(isTrue, 'sorting applied');
                done3();
              });
            }).finally(() => {
              done2();
            });
            done1();
          });
        }).finally(() => {
          done();
        });
      });
    });
  });
});
