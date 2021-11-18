import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';
import { deleteRecords, addRecords } from './folv-tests-functions';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

let app;
let store;
let route;
let path = 'components-acceptance-tests/flexberry-objectlistview/ember-flexberry-dummy-multi-list';
let userService;

module('Acceptance | flexberry-objectlistview | per page user settings on multi list', {
  beforeEach() {

    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);
    store = app.__container__.lookup('service:store');
    route = app.__container__.lookup('route:components-acceptance-tests/flexberry-objectlistview/ember-flexberry-dummy-multi-list');
    userService = app.__container__.lookup('service:user-settings')
    Ember.set(userService, 'isUserSettingsServiceEnabled', true);
  },

  afterEach() {
    // Destroy application.
    Ember.set(userService, 'isUserSettingsServiceEnabled', true);
    Ember.run(app, 'destroy');
  }
});

test('check perPage developerUserSetting in multi list', function(assert) {
  assert.expect(10);

  let modelInfos = [
    { modelName: 'ember-flexberry-dummy-application-user', uuid: generateUniqueId(), componentName: 'MultiUserList', perPage: [9] },
    { modelName: 'ember-flexberry-dummy-application-user', uuid: generateUniqueId(), componentName: 'MultiUserList2', perPage: [10] },
    { modelName: 'ember-flexberry-dummy-suggestion-type', uuid: generateUniqueId(), componentName: 'MultiSuggestionList', perPage: [11] }
  ];

  Ember.set(
    route,
    'developerUserSettings',
    { 
      'MultiUserList': { DEFAULT: { perPage: modelInfos[0].perPage[0] } },
      'MultiUserList2': { DEFAULT: { perPage: modelInfos[1].perPage[0] } }, 
      'MultiSuggestionList': { DEFAULT: { perPage: modelInfos[2].perPage[0] } } 
    });

  // Add records for paging.
  Ember.run(() => {
    initTestData(store, modelInfos).then(function(resolvedPromises) {
      assert.ok(resolvedPromises, 'All records saved.');
      let done = assert.async();
      
      visit(path);
      andThen(function() {
        try {
          assert.equal(currentPath(), path);
          let currentUrl = currentURL();
          assert.ok(true, "Текущий адрес: " + currentUrl);
          checkPaging(assert, modelInfos, 0)
        }
        catch(error) {
          throw error;
        } 
        finally {
          clearAllData(assert, store, modelInfos);
          done();
        }
      });
    });
  });
});

// Function to check current perPage value on page.
function checkPaging(assert, modelInfos, expectedIndex) {
  // check paging.
  let $perPageElement = Ember.$('div.flexberry-dropdown div.text');
  assert.equal($perPageElement.length, 3, "Элементы количества записей на странице найдены.");
  assert.equal($perPageElement.eq(0).text(), modelInfos[0].perPage[expectedIndex], `${modelInfos[0].componentName}: Количество элементов на странице равно заданному: ${modelInfos[0].perPage[expectedIndex]}.`);
  assert.equal($perPageElement.eq(1).text(), modelInfos[1].perPage[expectedIndex], `${modelInfos[1].componentName}: Количество элементов на странице равно заданному: ${modelInfos[1].perPage[expectedIndex]}.`);
  assert.equal($perPageElement.eq(2).text(), modelInfos[2].perPage[expectedIndex], `${modelInfos[2].componentName}: Количество элементов на странице равно заданному: ${modelInfos[2].perPage[expectedIndex]}.`);
}

function initTestData(store, modelInfos) {
  return Ember.RSVP.Promise.all([
    addRecords(store, modelInfos[0].modelName, modelInfos[0].uuid),
    addRecords(store, modelInfos[1].modelName, modelInfos[1].uuid),
    addRecords(store, modelInfos[2].modelName, modelInfos[2].uuid)
  ]);
}

function clearAllData(assert, store, modelInfos) {
  Ember.set(userService, 'isUserSettingsServiceEnabled', true);
  let done = assert.async();
  removeTestData(assert, store, modelInfos).then(function() {
    let done1 = assert.async();
    deleteAllUserSettings(assert, modelInfos).then(function() {
      done1();
    });
    done();
  });
}

function removeTestData(assert, store, modelInfos) {
  return Ember.RSVP.Promise.all([
    deleteRecords(store, modelInfos[0].modelName, modelInfos[0].uuid, assert),
    deleteRecords(store, modelInfos[1].modelName, modelInfos[1].uuid, assert),
    deleteRecords(store, modelInfos[2].modelName, modelInfos[2].uuid, assert)
  ]);
}

function deleteAllUserSettings(assert, modelInfos)
{
  return Ember.RSVP.Promise.all([
    deleteUserSetting(assert, modelInfos[0].componentName),
    deleteUserSetting(assert, modelInfos[1].componentName),
    deleteUserSetting(assert, modelInfos[2].componentName)
  ]);
}

// Function for deleting user settings from database.
function deleteUserSetting(assert, componentName) {
  Ember.run(() => {
    let done = assert.async();
    userService._getExistingSettings(componentName, "DEFAULT").then(
      foundRecords => {
        if (foundRecords && foundRecords.length > 0){
          assert.equal(foundRecords.length, 1, componentName + ": Найдена настройка пользователя.");
          foundRecords[0].deleteRecord();
          foundRecords[0].save().then(() => {
            assert.ok(true, componentName + ": Настройки пользователя удалены из БД.");
            done();
          });
        }
        else {
          assert.ok(true, componentName + ": Настройки пользователя не найдены в БД.");
          done();
        }
      }
    )
  });
}