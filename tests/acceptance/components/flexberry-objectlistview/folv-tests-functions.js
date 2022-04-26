import $ from 'jquery';
import { A } from '@ember/array';
import { later, run } from '@ember/runloop';
import RSVP from 'rsvp';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Builder from 'ember-flexberry-data/query/builder';

// Function for waiting list loading.
export function loadingList($ctrlForClick, list, records) {
  return new RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;
    let timeout = 10000;

    run(() => {
      $ctrlForClick.click();
    });

    run(() => {
      checkIntervalId = window.setInterval(() => {
        let $list = $(list);
        let $records = $(records, $list);
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
    run(() => {
      window.setTimeout(() => {
        if (checkIntervalSucceed) {
          return;
        }

        // Time is out.
        // Stop intervals & reject promise.
        window.clearInterval(checkIntervalId);
        reject('ListForm load operation is timed out');
      }, timeout);
    });
  });
}

/**
  Function for waiting editform loading afther open editform by function at acceptance test.

  @public
  @method openEditFormByFunction
  @param {Function} openEditFormFunction Method options.
 */
export function openEditFormByFunction(openEditFormFunction) {
  return new RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;
    let timeout = 10000;

    openEditFormFunction();

    run(() => {
      checkIntervalId = window.setInterval(() => {
        if ($('.ui.button.close-button').length === 0) {

          // Edit form isn't loaded yet.
          return;
        }

        // Edit form is loaded, wait to render.
        // Stop interval & resolve promise.
        window.setTimeout(() => {
          window.clearInterval(checkIntervalId);
          checkIntervalSucceed = true;
          resolve();
        });
      }, checkInterval);
    });

    // Set wait timeout.
    run(() => {
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

/**
  Function for waiting list loading afther refresh by function at acceptance test.

  @public
  @method refreshListByFunction
  @param {Function} refreshFunction Method options.
  @param {Object} controlle Current form controller.

  For use:
    Form controller must have the following code:
      ```js
        loadCount: 0
      ```

    Form router must have the following code:
      ```js
        onModelLoadingAlways(data) {
          let loadCount = this.get('controller.loadCount') + 1;
          this.set('controller.loadCount', loadCount);
        }
      ```
 */
export function refreshListByFunction(refreshFunction, controller) {
  return new RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;
    let renderInterval = 100;
    let timeout = 10000;
    let timeiutForLongTimeLoad = checkInterval + 500;

    let $lastLoadCount = controller.loadCount;
    refreshFunction();

    run(() => {
      checkIntervalId = window.setInterval(() => {
        let loadCount = controller.loadCount;
        if (loadCount === $lastLoadCount) {

          // Data isn't loaded yet.
          return;
        }

        // Data is loaded, wait to render.
        // Stop interval & resolve promise.
        window.setTimeout(() => {
          window.clearInterval(checkIntervalId);
          checkIntervalSucceed = true;
          resolve();
        }, renderInterval);
      }, checkInterval);
    });

    // Set wait timeout.
    run(() => {
      window.setTimeout(() => {
        // Timeout for with a long load, setInterval executed first.
        window.setTimeout(() => {
          if (checkIntervalSucceed) {
            return;
          }

          // Time is out.
          // Stop intervals & reject promise.
          window.clearInterval(checkIntervalId);
          reject('ListForm load operation is timed out');
        }, timeiutForLongTimeLoad);
      }, timeout);
    });
  });
}

// Function for check sorting.
export function checkSortingList(store, projection, $olv, ordr) {
  return new RSVP.Promise((resolve) => {
    run(() => {
      let modelName = projection.modelName;
      let builder = new Builder(store).from(modelName).selectByProjection(projection.projectionName).skip(0);
      builder = !ordr ? builder : builder.orderBy(ordr);
      store.query(modelName, builder.build()).then((records) => {
        let recordsArr = records.toArray();
        let $tr = $('table.object-list-view tbody tr').toArray();

        let isTrue = $tr.reduce((sum, current, i) => {
          let expectVal = !recordsArr[i].get('address') ? '' : recordsArr[i].get('address');
          return sum && ($.trim(current.children[1].innerText) === expectVal);
        }, true);

        resolve(isTrue);
      });
    });
  });
}

// Function for addition records.
export function addRecords(store, modelName, uuid) {
  let promises = A();
  let listCount = 55;
  run(() => {

    let builder = new Builder(store).from(modelName).count();
    store.query(modelName, builder.build()).then((result) => {
      let howAddRec = listCount - result.meta.count;
      let newRecords = A();

      for (let i = 0; i < howAddRec; i++) {
        newRecords.pushObject(
          store.createRecord(modelName, 
            modelName == 'ember-flexberry-dummy-application-user'
            ? { name: uuid, eMail: uuid, phone1: uuid }
            : { name: uuid }));
      }

      newRecords.forEach(function(item) {
        promises.push(item.save());
      });
    });
  });
  return RSVP.Promise.all(promises);
}

// Function for deleting records.
export function deleteRecords(store, modelName, uuid) {
  let builder = new Builder(store, modelName).where('name', FilterOperator.Eq, uuid);
  return store.query(modelName, builder.build()).then(r => RSVP.all(r.map(i => i.destroyRecord())));
}

// Function for waiting loading list.
export function loadingLocales(locale, app) {
  return new RSVP.Promise((resolve) => {
    let i18n = app.__container__.lookup('service:i18n');

    run(() => {
      i18n.set('locale', locale);
    });

    let timeout = 500;
    later((() => {
      resolve({ msg: 'ok' });
    }), timeout);
  });
}

// Function for filter object-list-view by list of operations and values.
export function filterObjectListView(objectListView, operations, filterValues) {
  let tableBody = objectListView.children('tbody');
  let tableRow = $(tableBody.children('tr'));
  let tableColumns = $(tableRow[0]).children('td');

  let promises = A();

  for (let i = 0; i < tableColumns.length; i++) {
    if (operations[i]) {
      promises.push(filterCollumn(objectListView, i, operations[i], filterValues[i]));
    }
  }

  return RSVP.Promise.all(promises);
}

// Function for filter object-list-view at one column by operations and values.
export function filterCollumn(objectListView, columnNumber, operation, filterValue) {
  return new RSVP.Promise((resolve) => {
    let tableBody = objectListView.children('tbody');
    let tableRow = tableBody.children('tr');

    let filterOperation = $(tableRow[0]).find('.flexberry-dropdown')[columnNumber];
    let filterValueCell = $(tableRow[1]).children('td')[columnNumber];

    // Select an existing item.
    $(filterOperation).dropdown('set selected', operation);

    let dropdown = $(filterValueCell).find('.flexberry-dropdown');
    let textbox = $(filterValueCell).find('.ember-text-field');

    let fillPromise;
    if (textbox.length !== 0) {
      fillPromise = fillIn(textbox, filterValue);
    }

    if (dropdown.length !== 0) {
      dropdown.dropdown('set selected', filterValue);
    }

    if (fillPromise) {
      fillPromise.then(() => resolve());
    } else {
      let timeout = 300;
      later((() => {
        resolve();
      }), timeout);
    }

  });
}

export function getOrderByClause(currentSorting) {
  return Object.keys(currentSorting).map(function(key) {
    return { name: key, sortOrder: currentSorting[key].sortAscending ? 'asc' : 'desc', sortNumber: currentSorting[key].sortNumber };
  }).sort(function(obj1, obj2) {
    if (obj1.sortNumber < obj2.sortNumber) {
      return -1;
    }

    if (obj1.sortNumber > obj2.sortNumber) {
      return 1;
    }

    return 0;
  }).map(function(obj) {
    return `${obj.name} ${obj.sortOrder}`;
  }).join(', ');
}
