/* global $ */
import { get, set } from '@ember/object';
import { run } from '@ember/runloop';
import RSVP from 'rsvp';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';
import Builder from 'ember-flexberry-data/query/builder';

let openLookupDialog = function($lookup) {
  return new RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;

    let timeout = 4000;

    let $lookupChooseButton = $('.ui-change', $lookup);

    // Try to open lookup dialog.
    run(() => {
      $lookupChooseButton.click();
    });

    // Wait for lookup dialog to be opened & data loaded.
    run(() => {
      checkIntervalId = window.setInterval(() => {
        let $lookupDialog = $('.flexberry-modal');
        let $records = $('.content table.object-list-view tbody tr', $lookupDialog);
        if ($records.length === 0) {
          // Data isn't loaded yet.
          return;
        }

        // Data is loaded.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;

        resolve($lookupDialog);
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
        reject('flexberry-lookup load data operation is timed out');
      }, timeout);
    });
  });
};

let chooseRecordInLookupDialog = function($lookupDialog, recordIndex) {
  return new RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;

    let timeout = 4000;

    let $records = $('.content table.object-list-view tbody tr', $lookupDialog);
    let $choosedRecord = $($records[recordIndex]);

    // Try to choose record in the lookup dialog.
    run(() => {
      // Inside object-list-views component click actions are available only if cell in row has been clicked.
      // Click on whole row wont take an effect.
      let $choosedRecordFirstCell = $($('td', $choosedRecord)[1]);
      $choosedRecordFirstCell.click();

      // Click on modal-dialog close icon.
      // Сrutch correcting irregular bug
      let $modelDilogClose = $('.close.icon');
      $modelDilogClose.click();
    });

    // Wait for lookup dialog to be closed.
    run(() => {
      checkIntervalId = window.setInterval(() => {
        if (!$lookupDialog.hasClass('hidden')) {
          // Dialog is still opened.
          return;
        }

        // Dialog is closed.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;

        resolve();
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
        reject('flexberry-lookup choose record operation is timed out');
      }, timeout);
    });
  });
};

let app;
let latestReceivedRecords;

module('Acceptance | flexberry-lookup-base', {
  beforeEach() {
    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);

    // Override store.query method to receive & remember records which will be requested by lookup dialog.
    let store = app.__container__.lookup('service:store');
    let originalQueryMethod = store.query;
    store.query = function(...args) {
      // Call original method & remember returned records.
      return originalQueryMethod.apply(this, args).then((records) => {
        latestReceivedRecords = records.toArray();

        return records;
      });
    };
  },

  afterEach() {
    // Remove semantic ui modal dialog's dimmer.
    $('body .ui.dimmer.modals').remove();

    // Destroy application.
    run(app, 'destroy');
  },
});

test('changes in component\'s value causes changes in related model\'s specified \'belongsTo\' relation', function(assert) {
  visit('components-acceptance-tests/flexberry-lookup/base-operations');
  andThen(function() {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let model = get(controller, 'model');
    let relationName = get(controller, 'relationName');
    let displayAttributeName = get(controller, 'displayAttributeName');

    let $lookup = $('.flexberry-lookup');
    let $lookupInput = $('input', $lookup);
    assert.strictEqual($lookupInput.val(), '', 'lookup display value is empty by default');

    // Wait for lookup dialog to be opened, choose first record & check component's state.
    let asyncOperationsCompleted = assert.async();
    openLookupDialog($lookup).then(($lookupDialog) => {
      assert.ok($lookupDialog);

      // Lookup dialog successfully opened & data is loaded.
      // Try to choose first loaded record.
      return chooseRecordInLookupDialog($lookupDialog, 0);
    }).then(() => {
      // First loaded record chosen successfully.
      // Check that chosen record is now set to related model's 'belongsTo' relation.
      let chosenRecord = model.get(relationName);
      let expectedRecord = latestReceivedRecords[0];
      assert.strictEqual(
        chosenRecord,
        expectedRecord,
        'chosen record is set to model\'s \'' + relationName + '\' relation as expected');

      let chosenRecordDisplayAttribute = chosenRecord.get(displayAttributeName);
      assert.strictEqual(
        $lookupInput.val(),
        chosenRecordDisplayAttribute,
        'lookup display value is equals to chosen record\'s \'' + displayAttributeName + '\' attribute');
    }).catch((reason) => {
      throw new Error(reason);
    }).finally(() => {
      asyncOperationsCompleted();
    });
  });
});

test('changes in model\'s value causes changes in component\'s specified \'belongsTo\' model', function(assert) {
  visit('components-acceptance-tests/flexberry-lookup/base-operations');
  andThen(function() {

    let $lookup = $('.flexberry-lookup');
    let $lookupInput = $('input', $lookup);
    assert.strictEqual($lookupInput.val() === '', true, 'lookup display value is empty by default');

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let model = get(controller, 'model');
    let store = app.__container__.lookup('service:store');
    let suggestionType;

    // Create limit for query.
    let query = new Builder(store)
      .from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('SettingLookupExampleView');

    // Load olv data.
    store.query('ember-flexberry-dummy-suggestion-type', query.build()).then((suggestionTypes) => {

      let suggestionTypesArr = suggestionTypes.toArray();

      suggestionType = suggestionTypesArr.objectAt(0);

    }).then(() => {

      // Change data in the model.
      model.set('type', suggestionType);

      let done = assert.async();

      setTimeout(function() {
        $lookupInput = $('input', $lookup);
        assert.strictEqual($lookupInput.val() === suggestionType.get('name'), true, 'lookup display value isn\'t empty');
        done();
      }, 100);

    });
  });
});

test('flexberry-lookup limit function test', function(assert) {

  visit('components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

    let $limitFunctionButton = $('.limitFunction');
    let $lookupChouseButton = $('.ui-change');

    run(() => {
      $limitFunctionButton.click();
      $lookupChouseButton.click();
    });

    let store = app.__container__.lookup('service:store');
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let limitType = controller.limitType;
    let queryPredicate = new StringPredicate('name').contains(limitType);

    // Create limit for query.
    let query = new Builder(store)
      .from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('SettingLookupExampleView')
      .where(queryPredicate);

    // Load olv data.
    store.query('ember-flexberry-dummy-suggestion-type', query.build()).then((suggestionTypes) => {

      let suggestionTypesArr = suggestionTypes.toArray();
      let suggestionModelLength = suggestionTypesArr.length;

      let done = assert.async();

      run(() => {
        setTimeout(function() {
          let $lookupSearch = $('.content table.object-list-view');
          let $lookupSearchThead = $lookupSearch.children('tbody');
          let $lookupSearchTr = $lookupSearchThead.children('tr');
          let $lookupRows = $lookupSearchTr.children('td');
          let $suggestionTableLength = $lookupSearchTr.length;

          assert.expect(2 + $suggestionTableLength);

          assert.strictEqual(suggestionModelLength >= $suggestionTableLength, true,
            'Сorrect number of values restrictions limiting function');

          // Сomparison data in the model and olv table.
          for (let i = 0; i < $suggestionTableLength; i++) {
            let suggestionType = suggestionTypesArr.objectAt(i);
            let suggestionTypeName = suggestionType.get('name');

            let $cell = $($lookupRows[3 * i + 1]);
            let $cellDiv = $cell.children('div');
            let $cellText = $cellDiv.text().trim();

            assert.strictEqual(suggestionTypeName === $cellText, true, 'Сorrect data at lookup\'s olv');
          }

          done();
        }, 2000);
      });
    });
  });
});

test('flexberry-lookup actions test', function(assert) {
  assert.expect(5);

  let controller = app.__container__.lookup('controller:components-acceptance-tests/flexberry-lookup/settings-example-actions');

  // Remap remove action.
  let $onRemoveData;
  set(controller, 'actions.externalRemoveAction', (actual) => {
    $onRemoveData = actual;
    assert.notEqual($onRemoveData, undefined, 'Component sends \'remove\' action after first click');
    assert.strictEqual($onRemoveData.relationName, 'type', 'Component sends \'remove\' with actual relationName');
  });

  // Remap chose action.
  let $onChooseData;
  set(controller, 'actions.externalChooseAction', (actual) => {
    $onChooseData = actual;
    assert.notEqual($onChooseData, undefined, 'Component sends \'choose\' action after first click');
    assert.strictEqual($onChooseData.componentName, 'flexberry-lookup',
     'Component sends \'choose\' with actual componentName');
    assert.strictEqual($onChooseData.projection, 'SettingLookupExampleView',
     'Component sends \'choose\' with actual projection');
  });

  visit('components-acceptance-tests/flexberry-lookup/settings-example-actions');
  andThen(function() {
    let $lookupButtouChoose = $('.ui-change');
    let $lookupButtouRemove = $('.ui-clear');

    run(() => {
      $lookupButtouChoose.click();
      $lookupButtouRemove.click();
    });
  });
});

test('flexberry-lookup relation name test', function(assert) {
  visit('components-acceptance-tests/flexberry-lookup/settings-example-relation-name');
  andThen(function() {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let relationName = get(controller, 'relationName');
    assert.strictEqual(
      relationName,
      'Temp relation name',
      'relationName: \'' + relationName + '\' as expected');
  });
});

test('flexberry-lookup projection test', function(assert) {
  assert.expect(2);

  visit('components-acceptance-tests/flexberry-lookup/settings-example-projection');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-projection');

    let $lookupButtouChoose = $('.ui-change');

    // Click choose button.
    run(() => {
      $lookupButtouChoose.click();
    });

    run(() => {
      var done = assert.async();
      setTimeout(function() {

        let $lookupSearch = $('.content table.object-list-view');
        let $lookupSearchThead = $lookupSearch.children('thead');
        let $lookupSearchTr = $lookupSearchThead.children('tr');
        let $lookupHeaders = $lookupSearchTr.children('th');

        // Check count at table header.
        assert.strictEqual($lookupHeaders.length === 3, true, 'Component has SuggestionTypeE projection');

        done();
      }, 1000);
    });
  });
});

test('visiting flexberry-lookup dropdown', function(assert) {
  assert.expect(13);

  visit('components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

  andThen(function() {

    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

    // Retrieve component, it's inner <input>.
    let $lookupSearch = $('.lookup-field');
    let $lookupButtonChoose = $('.ui-change');
    let $lookupButtonClear = $('.lookup-remove-button');

    assert.strictEqual($lookupSearch.length === 0, true, 'Component has n\'t flexberry-lookup');
    assert.strictEqual($lookupButtonChoose.length === 0, true, 'Component has n\'t button choose');
    assert.strictEqual($lookupButtonClear.length === 0, true, 'Component has n\'t button remove');

    // Retrieve component, it's inner <input>.
    let $dropdown = $('.flexberry-dropdown.search.selection');
    let $dropdownSearch = $dropdown.children('.search');
    let $dropdownIcon = $dropdown.children('.dropdown.icon');
    let $dropdownMenu = $dropdown.children('.menu');
    let $deopdownText = $dropdown.children('.text');

    assert.strictEqual($dropdown.length === 1, true, 'Component has class flexberry-dropdown');
    assert.strictEqual($dropdown.hasClass('search'), true, 'Component\'s wrapper has \'search\' css-class');
    assert.strictEqual($dropdown.hasClass('selection'), true, 'Component\'s wrapper has \'selection\' css-class');
    assert.strictEqual($dropdown.hasClass('ember-view'), true, 'Component\'s wrapper has \'ember-view\' css-class');
    assert.strictEqual($dropdown.hasClass('dropdown'), true, 'Component\'s wrapper has \'dropdown\' css-class');

    assert.strictEqual($dropdownSearch.length === 1, true, 'Component has class search');

    assert.strictEqual($dropdownIcon.length === 1, true, 'Component has class dropdown and icon');

    assert.strictEqual($deopdownText.length === 1, true, 'Component has class text');

    assert.strictEqual($dropdownMenu.length === 1, true, 'Component has class menu');

  });
});

test('visiting flexberry-lookup autocomplete', function(assert) {
  assert.expect(5);

  visit('components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

  andThen(function() {

    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

    let $lookup = $('.flexberry-lookup');

    assert.strictEqual($lookup.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($lookup.hasClass('search'), true, 'Component\'s wrapper has \'search\' css-class');

    let $lookupField = $('.lookup-field');

    assert.strictEqual($lookupField.hasClass('prompt'), true, 'Component\'s wrapper has \'prompt\' css-class');

    let $result = $('.result');

    assert.strictEqual($result.length === 1, true, 'Component has inner class \'result\'');
  });
});
