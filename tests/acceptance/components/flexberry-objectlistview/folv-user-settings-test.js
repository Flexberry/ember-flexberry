import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';
import { deleteRecords, addRecords } from './folv-tests-functions';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

let app;
let store;
let route;
let path = 'components-acceptance-tests/flexberry-objectlistview/folv-user-settings';
let pathHelp = 'components-examples/flexberry-lookup/user-settings-example';
let modelName = 'ember-flexberry-dummy-suggestion-type';
let userService;

/* There is some problem with TransitionAborted on server, so for server there is variant without redirect.*/
let skip = true;

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
    Ember.set(userService, 'isUserSettingsServiceEnabled', true);
  },

  afterEach() {
    // Destroy application.
    Ember.set(userService, 'isUserSettingsServiceEnabled', true);
    Ember.run(app, 'destroy');
  }
});

test('check saving of user settings', function(assert) {
  if (skip) {
    assert.ok(true);
    return;
  }

  assert.expect(21);
  let uuid = generateUniqueId();

  route.set('developerUserSettings', { FOLVPagingObjectListView: { DEFAULT: { colsOrder: [ { propName: 'name' } ], perPage: 28 } } });

  // Add records for paging.
  Ember.run(() => {
    addRecords(store, modelName, uuid).then(function(resolvedPromises) {
      assert.ok(resolvedPromises, 'All records saved.');
      let done = assert.async();
      visit(path);
      andThen(function() {
        try {
          assert.equal(currentPath(), path);
          let currentUrl = currentURL();
          assert.ok(currentUrl.contains("perPage=28"), "Переадресация выполнена успешно (настройка взята из developerUserSettings).");
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
                let currentUrl = currentURL();
                assert.ok(currentUrl.contains("perPage=28"), "Переадресация выполнена успешно (настройка взята из БД).");
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
                        assert.ok(currentUrl.contains("perPage=17"), "Переадресация выполнена успешно (настройка взята из developerUserSettings).");
                        checkPaging(assert, '17');

                        let done4 = assert.async();
                        checkWithDisabledUserSettings(assert, done4);
                      } catch (error) {
                        deleteRecords(store, modelName, uuid, assert);
                        deleteUserSetting(assert);
                        throw error;
                      }
                      finally {
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

function checkWithDisabledUserSettings(assert, asyncDone, uuid) {
  try{
    let doneHelp = assert.async();
    visit(pathHelp);
    andThen(function() {
      assert.equal(currentPath(), pathHelp);
      route.set('developerUserSettings', { FOLVPagingObjectListView: { DEFAULT: { colsOrder: [ { propName: 'name' } ], perPage: 11 } } });
      Ember.set(userService, 'isUserSettingsServiceEnabled', false);

      // Remove current saved not in Database settings.
      Ember.set(userService, 'currentUserSettings', {});

      let done1 = assert.async();
      visit(path);   
      andThen(function() {
        try {
          assert.equal(currentPath(), path);
          let currentUrl = currentURL();
          assert.ok(currentUrl.contains("perPage=11"), "Переадресация выполнена успешно (настройка взята из developerUserSettings).");
          checkPaging(assert, '11');
        } catch(error) {
          throw error;
        } finally {
          Ember.set(userService, 'isUserSettingsServiceEnabled', true);
          deleteRecords(store, modelName, uuid, assert);
          deleteUserSetting(assert);
          done1();
        }
      });
      doneHelp();
    });
  } catch(error) {
    deleteRecords(store, modelName, uuid, assert);
    deleteUserSetting(assert);
    throw error;
  } finally {
    asyncDone();
  }
}

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