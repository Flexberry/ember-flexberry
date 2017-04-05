import Ember from 'ember';
import { Query } from 'ember-flexberry-data';

// Function for waiting list loading.
export function loadingList($ctrlForClick, list, records) {
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
        let $list = Ember.$(list);
        let $records = Ember.$(records, $list);
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

// Function for check sorting.
export function checkSortingList(store, projection, $olv, ordr) {
  return new Ember.RSVP.Promise((resolve) => {
    Ember.run(() => {
      let modelName = projection.modelName;
      let builder = new Query.Builder(store).from(modelName).selectByProjection(projection.projectionName);
      builder = !ordr ? builder : builder.orderBy(ordr);
      store.query(modelName, builder.build()).then((records) => {
        let recordsArr = records.toArray();
        let $tr = Ember.$('table.object-list-view tbody tr').toArray();

        let isTrue = $tr.reduce((sum, current, i) => {
          let expectVal = !recordsArr[i].get('address') ? '' : recordsArr[i].get('address');
          return sum && (Ember.$.trim(current.children[1].innerText) === expectVal);
        }, true);

        resolve(isTrue);
      });
    });
  });
}

// Function for addition records.
export function addRecords(store, modelName, uuid) {
  let promises = Ember.A();
  let listCount = 55;
  Ember.run(() => {

    let builder = new Query.Builder(store).from(modelName).count();
    store.query(modelName, builder.build()).then((result) => {
      let howAddRec = listCount - result.meta.count;
      let newRecords = Ember.A();

      for (let i = 0; i < howAddRec; i++) {
        newRecords.pushObject(store.createRecord(modelName, { name: uuid }));
      }

      newRecords.forEach(function(item) {
        promises.push(item.save());
      });
    });
  });
  return Ember.RSVP.Promise.all(promises);
}

// Function for deleting records.
export function deleteRecords(store, modelName, uuid, assert) {
  Ember.run(() => {
    let done = assert.async();
    let builder = new Query.Builder(store, modelName).where('name', Query.FilterOperator.Eq, uuid);
    store.query(modelName, builder.build()).then((results) => {
      results.content.forEach(function(item) {
        item.deleteRecord();
        item.save();
      });
      done();
    });
  });
}

// Function for waiting loading list.
export function loadingLocales(locale, app) {
  return new Ember.RSVP.Promise((resolve) => {
    let i18n = app.__container__.lookup('service:i18n');

    Ember.run(() => {
      i18n.set('locale', locale);
    });

    let timeout = 500;
    Ember.run.later((() => {
      resolve({ msg: 'ok' });
    }), timeout);
  });
}
