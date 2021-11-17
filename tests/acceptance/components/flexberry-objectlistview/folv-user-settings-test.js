import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';
import { deleteRecords, addRecords, refreshListByFunction } from './folv-tests-functions';
import { Query } from 'ember-flexberry-data';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

let app;
let store;
let route;
let path = 'components-acceptance-tests/flexberry-objectlistview/folv-user-settings';
let pathHelp = 'components-examples/flexberry-lookup/user-settings-example';
let modelName = 'ember-flexberry-dummy-suggestion-type';
let userService;

module('Acceptance | flexberry-objectlistview | per page user settings', {
  beforeEach() {

    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);
    store = app.__container__.lookup('service:store');
    route = app.__container__.lookup('route:components-acceptance-tests/flexberry-objectlistview/folv-user-settings');
    userService = app.__container__.lookup('service:user-settings')
  },

  afterEach() {
    // Destroy application.
    Ember.run(app, 'destroy');
  }
});

test('check saving of user settings', function(assert) {
  assert.expect(16);
  let uuid = generateUniqueId();
  let arr;

  route.set('developerUserSettings', { FOLVPagingObjectListView: { DEFAULT: { colsOrder: [ { propName: 'name' } ], perPage: 28 } } });

  // Add records for paging.
  Ember.run(() => {
    addRecords(store, modelName, uuid).then(function(resolvedPromises) {
      assert.ok(resolvedPromises, 'All records saved.');
      let done = assert.async();
      let builder = new Query.Builder(store).from(modelName).selectByProjection('SuggestionTypeE');
      store.query(modelName, builder.build()).then((result) => {
        arr = result.toArray();
      }).then(function() {
        visit(path);
        andThen(function() {
          try {
            assert.equal(currentPath(), path);
            let currentUrl = currentURL();
            assert.ok(currentUrl.contains("perPage=28"), "Переадресация выполнена успешно.");
            checkPaging(assert, '28');
            route.set('developerUserSettings', { FOLVPagingObjectListView: { DEFAULT: { colsOrder: [ { propName: 'name' } ], perPage: 17 } } });

            let doneHelp = assert.async();
            visit(pathHelp);
            andThen(function() {
              assert.equal(currentPath(), pathHelp);
              let done1 = assert.async();
              visit(path);
              andThen(function() {
                try {
                  assert.equal(currentPath(), path);
                  /* В настоящее время при тестировании наблюдается следующая бага: при переходе снова на visit(path)
                    срабатывает комбобокс с вариантами количества элементов на странице и затирает нужное значение на 5 в настройке в БД.
                    При тестировании в реальном окружении проходила корректная переадресация на perPage=28, которое уже сохранено в БД
                    и более приоритетно, нежели 17, заданное в developerUserSettings. Поэтому переход осуществляется через visit(pathHelp).
                  */

                  assert.ok(currentUrl.contains("perPage=28"), "Переадресация выполнена успешно.");
                  checkPaging(assert, '28');
                  
                  let done2 = assert.async();
                  click("div.cols-config i.dropdown");
                  andThen(function() {
                    try {
                      let done3 = assert.async();
                      click("div.cols-config i.remove");
                      andThen(function() {
                        try {
                          assert.ok(true, 'Произведён сброс настроек пользователя до developerUserSettings.');
                          let currentUrl = currentURL();
                          assert.ok(currentUrl.contains("perPage=17"), "Переадресация выполнена успешно.");
                          checkPaging(assert, '17');
                        } catch (error) {
                          throw error;
                        }
                        finally {
                          deleteRecords(store, modelName, uuid, assert);
                          deleteUserSetting(assert);
                          done3();
                        }
                      });
                    } catch (error) {
                      deleteRecords(store, modelName, uuid, assert);
                      deleteUserSetting(assert);
                      throw error;
                    }
                    finally{
                      done2();
                    }
                  });
                } catch(error) {
                  deleteRecords(store, modelName, uuid, assert);
                  deleteUserSetting(assert);
                  throw error;
                } finally {
                  done1();
                }
              });
              doneHelp();
            });
          }
          catch(error) {
            deleteRecords(store, modelName, uuid, assert);
            deleteUserSetting(assert);
            throw error;
          } 
          finally {
            done();
          }
        });
      });
    });
  });
});

// Function to check current perPage value on page.
function checkPaging(assert, expectedCount) {
  // check paging.
  let $perPageElement = Ember.$('div.flexberry-dropdown div.text');
  assert.equal($perPageElement.length, 1, "Элемент количества записей на странице найден.");
  assert.equal($perPageElement.text(), expectedCount, `Количество элементов на странице равно заданному: ${expectedCount}.`)
}

// Function for deleting user settings from database.
function deleteUserSetting(assert) {
  Ember.run(() => {
    let done = assert.async();
    userService._getExistingSettings("FOLVPagingObjectListView", "DEFAULT").then(
      foundRecords => {
        if (foundRecords && foundRecords.length > 0){
          assert.equal(foundRecords.length, 1, "Найдена настройка пользователя.");
          foundRecords[0].deleteRecord();
          foundRecords[0].save().then(() => {
            assert.ok(true, "Настройки пользователя удалены из БД.");
            done();
          });
        }
        else {
          assert.ok(true, "Настройки пользователя не найдены в БД.");
          done();
        }
      }
    )
  });
}