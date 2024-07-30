import $ from 'jquery';
import { A } from '@ember/array';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Builder from 'ember-flexberry-data/query/builder';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Функция ожидания загрузки списка.
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
 * Функция ожидания загрузки формы редактирования после ее открытия.
 * 
 * @public
 * @method openEditFormByFunction
 * @param {Function} openEditFormFunction Метод для открытия формы.
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

// Функция для проверки сортировки.
export async function checkSortingList(store, projection, $olv, ordr) {
  let modelName = projection.modelName;
  let builder = new Builder(store).from(modelName).selectByProjection(projection.projectionName).skip(0);
  if (ordr) {
    builder.orderBy(ordr);
  }
  
  let records = await store.query(modelName, builder.build());
  let recordsArr = records.toArray();
  let $tr = $('table.object-list-view tbody tr').toArray();

  return $tr.every((current, i) => {
    let expectVal = recordsArr[i] ? recordsArr[i].get('address') : '';
    return $.trim(current.children[1].innerText) === expectVal;
  });
}

// Функция для добавления записей.
export async function addRecords(store, modelName, uuid) {
  let promises = [];
  let listCount = 55;

  let builder = new Builder(store).from(modelName).count();
  let result = await store.query(modelName, builder.build());
  let howAddRec = listCount - result.meta.count;

  for (let i = 0; i < howAddRec; i++) {
    let newRecord = store.createRecord(modelName, 
      modelName === 'ember-flexberry-dummy-application-user'
        ? { name: uuid, eMail: uuid, phone1: uuid }
        : { name: uuid });
    promises.push(newRecord.save());
  }

  return Promise.all(promises);
}

// Функция для удаления записей.
export async function deleteRecords(store, modelName, uuid) {
  let builder = new Builder(store, modelName).where('name', FilterOperator.Eq, uuid);
  let records = await store.query(modelName, builder.build());
  return Promise.all(records.map(record => record.destroyRecord()));
}

// Функция ожидания загрузки локалей.
export async function loadingLocales(locale, app) {
  let i18n = app.__container__.lookup('service:i18n');
  i18n.set('locale', locale);
  await delay(500);
  return { msg: 'ok' };
}

// Функция для фильтрации object-list-view по списку операций и значений.
export async function filterObjectListView(objectListView, operations, filterValues) {
  let promises = [];

  let tableBody = objectListView.children('tbody');
  let tableRow = $(tableBody.children('tr'));
  let tableColumns = $(tableRow[0]).children('td');

  for (let i = 0; i < tableColumns.length; i++) {
    if (operations[i]) {
      promises.push(filterColumn(objectListView, i, operations[i], filterValues[i]));
    }
  }

  return Promise.all(promises);
}

// Функция для фильтрации object-list-view по одной колонке.
export async function filterColumn(objectListView, columnNumber, operation, filterValue) {
  let tableBody = objectListView.children('tbody');
  let tableRow = tableBody.children('tr');

  let filterOperation = $(tableRow[0]).find('.flexberry-dropdown')[columnNumber];
  let filterValueCell = $(tableRow[1]).children('td')[columnNumber];

  // Выбираем существующий элемент.
  $(filterOperation).dropdown('set selected', operation);

  let dropdown = $(filterValueCell).find('.flexberry-dropdown');
  let textbox = $(filterValueCell).find('.ember-text-field');

  if (textbox.length !== 0) {
    await fillIn(textbox, filterValue);
  }

  if (dropdown.length !== 0) {
    $(dropdown).dropdown('set selected', filterValue);
  }

  // Ждем небольшую задержку перед завершением
  await delay(300);
}

// Функция для получения условий сортировки.
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