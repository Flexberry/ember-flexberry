import $ from 'jquery';
import { A } from '@ember/array';
import { later, run } from '@ember/runloop';
import RSVP from 'rsvp';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Builder from 'ember-flexberry-data/query/builder';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function for waiting list loading.
export async function loadingList($ctrlForClick, list, records) {
  $ctrlForClick.click();

  let checkInterval = 500;
  let timeoutDuration = 10000;

  let startTime = Date.now();
  while (Date.now() - startTime < timeoutDuration) {
    await delay(checkInterval);
    let $list = $(list);
    let $records = $(records, $list);

    if ($records.length > 0) {
      return $list; // Данные загружены
    }
  }

  throw new Error('ListForm load operation is timed out');
}

/**
  Function for waiting editform loading afther open editform by function at acceptance test.
  @public
  @method openEditFormByFunction
  @param {Function} openEditFormFunction Method options.
 */
  export async function openEditFormByFunction(openEditFormFunction) {
    openEditFormFunction();
  
    let checkInterval = 500;
    let timeoutDuration = 10000;
  
    let startTime = Date.now();
    while (Date.now() - startTime < timeoutDuration) {
      await delay(checkInterval);
  
      if ($('.ui.button.close-button').length > 0) {
        await delay(100); // Ждем рендеринга
        return; // Форма загружена
      }
    }
  
    throw new Error('editForm load operation is timed out');
  }

/**
  * Функция ожидания загрузки списка после обновления.
  * 
  * @public
  * @method refreshListByFunction
  * @param {Function} refreshFunction Метод для обновления.
  * @param {Object} controller Текущий контроллер формы.
  */
export async function refreshListByFunction(refreshFunction, controller) {
  let checkInterval = 500;
  let renderInterval = 100;
  let timeoutDuration = 10000;

  let lastLoadCount = controller.loadCount;
  refreshFunction();

  let startTime = Date.now();
  while (Date.now() - startTime < timeoutDuration) {
    await delay(checkInterval);

    let loadCount = controller.loadCount;
    if (loadCount !== lastLoadCount) {
      await delay(renderInterval); // Ждем рендеринга
      return; // Данные загружены
    }
  }

  throw new Error('ListForm load operation is timed out');
}

// Function for check sorting.
export async function checkSortingList(store, projection, $olv, ordr) {
  let modelName = projection.modelName;
  let builder = new Builder(store)
    .from(modelName)
    .selectByProjection(projection.projectionName)
    .skip(0);

  if (ordr) {
    builder = builder.orderBy(ordr);
  }

  let isSortingValid;
  try {
    let records = await store.query(modelName, builder.build());
    let recordsArr = records.toArray();
    let $tr = $('table.object-list-view tbody tr').toArray();

    isSortingValid = $tr.reduce((sum, current, i) => {
      let expectVal = (recordsArr[i] && recordsArr[i].get('address')) ? recordsArr[i].get('address') : '';
      return sum && ($.trim(current.children[1].innerText) === expectVal);
    }, true);
  } catch (error) {
    console.error('Error fetching records:', error);
    isSortingValid = false;
  }

  return isSortingValid;
}

// Function for addition records.
export function addRecords(store, modelName, uuid) {
  let promises = A();
  let listCount = 55;

  try {
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
  } catch (error) {
    console.error('Error adding records:', error);
  }
  return RSVP.Promise.all(promises);
}

// Function for deleting records.
export async function deleteRecords(store, modelName, uuid) {
  let builder = new Builder(store, modelName).where('name', FilterOperator.Eq, uuid);
  let records = await store.query(modelName, builder.build());
  return Promise.all(records.map(record => record.destroyRecord()));
}

// Function for waiting loading list.
export async function loadingLocales(locale, app) {
  let i18n = app.__container__.lookup('service:i18n');
  i18n.set('locale', locale);
  await delay(500);
  return { msg: 'ok' };
}

// Function for filter object-list-view by list of operations and values.
export async function filterObjectListView(objectListView, operations, filterValues) {
  let tableBody = objectListView.children('tbody');
  let tableRow = $(tableBody.children('tr'));
  let tableColumns = $(tableRow[0]).children('td');

  let promises = [];

  for (let i = 0; i < tableColumns.length; i++) {
    if (operations[i]) {
      promises.push(filterCollumn(objectListView, i, operations[i], filterValues[i]));
    }
  }

  return Promise.all(promises);
}

// Function for filter object-list-view at one column by operations and values.
export async function filterCollumn(objectListView, columnNumber, operation, filterValue) {
  return new Promise((resolve) => {
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
  return Object.keys(currentSorting)
    .map(key => ({
      name: key,
      sortOrder: currentSorting[key].sortAscending ? 'asc' : 'desc',
      sortNumber: currentSorting[key].sortNumber
    }))
    .sort((obj1, obj2) => obj1.sortNumber - obj2.sortNumber)
    .map(obj => `${obj.name} ${obj.sortOrder}`)
    .join(', ');
}