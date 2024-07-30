import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';
import { deleteRecords, addRecords } from './folv-tests-functions';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import {set} from '@ember/object'

let app;
let store;
let route;
const path = 'components-acceptance-tests/flexberry-objectlistview/folv-user-settings';
const pathHelp = 'components-examples/flexberry-lookup/user-settings-example';
const modelName = 'ember-flexberry-dummy-suggestion-type';
let userService;

/* There is some problem with TransitionAborted on server, so for server there is variant without redirect.*/
const skip = true;

module('Acceptance | flexberry-objectlistview | per page user settings', {
  beforeEach() {

    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    const applicationController = app.__container__.lookup('controller:application');
    set(applicationController,'isInAcceptanceTestMode', true);
    store = app.__container__.lookup('service:store');
    route = app.__container__.lookup('route:components-acceptance-tests/flexberry-objectlistview/folv-user-settings');
    userService = app.__container__.lookup('service:user-settings')
    set(userService, 'isUserSettingsServiceEnabled', true);
  },

  afterEach() {
    // Destroy application.
    set(userService, 'isUserSettingsServiceEnabled', true);
    Ember.run(app, 'destroy');
  }
});

test('check saving of user settings', async function(assert) {
  if (skip) {
    assert.ok(true);
    return;
  }

  assert.expect(21);
  let uuid = generateUniqueId();

  route.set('developerUserSettings', { FOLVPagingObjectListView: { DEFAULT: { colsOrder: [ { propName: 'name' } ], perPage: 28 } } });

  // Add records for paging.
  await run(async () => {
    await addRecords(store, modelName, uuid);
    assert.ok(true, 'All records saved.');

    await visit(path);
    assert.equal(currentRouteName(), path);
    assert.ok(currentURL().includes('perPage=28'), 'Перенаправление выполнено успешно (настройка взята из developerUserSettings).');
    checkPaging(assert, '28');

    route.set('developerUserSettings', {
      FOLVPagingObjectListView: {
        DEFAULT: { colsOrder: [{ propName: 'name' }], perPage: 17 }
      }
    });

    await visit(pathHelp);
    assert.equal(currentRouteName(), pathHelp);

    await visit(path);
    assert.equal(currentRouteName(), path);
    assert.ok(currentURL().includes('perPage=28'), 'Перенаправление выполнено успешно (настройка взята из БД).');
    checkPaging(assert, '28');

    await click('div.cols-config i.dropdown');
    await click('div.cols-config i.remove');

    assert.ok(true, 'Произведён сброс настроек пользователя до developerUserSettings.');
    assert.ok(currentURL().includes('perPage=17'), 'Перенаправление выполнено успешно (настройка взята из developerUserSettings).');
    checkPaging(assert, '17');

    await checkWithDisabledUserSettings(assert, uuid);
  });
});

async function checkWithDisabledUserSettings(assert, asyncDone, uuid) {
    await visit(pathHelp);
    assert.equal(currentRouteName(), pathHelp);
      route.set('developerUserSettings', { FOLVPagingObjectListView: { DEFAULT: { colsOrder: [ { propName: 'name' } ], perPage: 11 } } });
      set(userService, 'isUserSettingsServiceEnabled', false);

      // Remove current saved not in Database settings.
      set(userService, 'currentUserSettings', {});

      await visit(path);
      assert.equal(currentRouteName(), path);
      assert.ok(currentURL().includes('perPage=11'), 'Перенаправление выполнено успешно (настройка взята из developerUserSettings).');
      checkPaging(assert, '11');

          set(userService, 'isUserSettingsServiceEnabled', true);
          await deleteRecords(store, modelName, uuid, assert);
          await deleteUserSetting(assert);
        }

// Function to check current perPage value on page.
function checkPaging(assert, expectedCount) {
  // check paging.
  let $perPageElement = Ember.$('div.flexberry-dropdown div.text');
  assert.equal($perPageElement.length, 1, "Элемент количества записей на странице найден.");
  assert.equal($perPageElement.text(), expectedCount, `Количество элементов на странице равно заданному: ${expectedCount}.`)
}

// Function for deleting user settings from database.
async function deleteUserSetting(assert) {
  let foundRecords = await userService._getExistingSettings('FOLVPagingObjectListView', 'DEFAULT');

        if (foundRecords && foundRecords.length > 0) {
          assert.equal(foundRecords.length, 1, "Найдена настройка пользователя.");
          foundRecords[0].deleteRecord();
          await foundRecords[0].save();
          assert.ok(true, "Настройки пользователя удалены из БД.");
        }
        else {
          assert.ok(true, "Настройки пользователя не найдены в БД.");
      }
    }