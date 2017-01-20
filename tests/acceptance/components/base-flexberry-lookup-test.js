import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { Query } from 'ember-flexberry-data';
const { StringPredicate } = Query;

let openLookupDialog = function($lookup) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;

    let timeout = 1000;

    let $lookupChooseButton = Ember.$('.lookup-choose-button', $lookup);

    // Try to open lookup dialog.
    Ember.run(() => {
      $lookupChooseButton.click();
    });

    // Wait for lookup dialog to be opened & data loaded.
    Ember.run(() => {
      checkIntervalId = window.setInterval(() => {
        let $lookupDialog = Ember.$('.flexberry-modal');
        let $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
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
    Ember.run(() => {
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
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;

    let timeout = 1000;

    let $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
    let $choosedRecord = Ember.$($records[recordIndex]);

    // Try to choose record in the lookup dialog.
    Ember.run(() => {
      // Inside object-list-views component click actions are available only if cell in row has been clicked.
      // Click on whole row wont take an effect.
      let $choosedRecordFirstCell = Ember.$(Ember.$('td', $choosedRecord)[1]);
      $choosedRecordFirstCell.click();

      // Click on modal-dialog close icon.
      // Сrutch correcting irregular bug
      let $modelDilogClose = Ember.$('.close.icon');
      $modelDilogClose.click();
    });

    // Wait for lookup dialog to be closed.
    Ember.run(() => {
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
    Ember.run(() => {
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
    Ember.$('body .ui.dimmer.modals').remove();

    // Destroy application.
    Ember.run(app, 'destroy');
  },
});

test('changes in component\'s value causes changes in related model\'s specified \'belongsTo\' relation', function(assert) {
  visit('components-acceptance-tests/flexberry-lookup/base-operations');
  andThen(function() {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let model = Ember.get(controller, 'model');
    let relationName = Ember.get(controller, 'relationName');
    let displayAttributeName = Ember.get(controller, 'displayAttributeName');

    let $lookup = Ember.$('.flexberry-lookup');
    let $lookupInput = Ember.$('input', $lookup);
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

    let $lookup = Ember.$('.flexberry-lookup');
    let $lookupInput = Ember.$('input', $lookup);
    assert.strictEqual($lookupInput.val() === '', true, 'lookup display value is empty by default');

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let model = Ember.get(controller, 'model');
    let store = app.__container__.lookup('service:store');
    let suggestionType;

    // Create limit for query.
    let query = new Query.Builder(store)
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
        $lookupInput = Ember.$('input', $lookup);
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

    let $limitFunctionButton = Ember.$('.limitFunction');
    let $lookupChouseButton = Ember.$('.lookup-choose-button');

    Ember.run(() => {
      $limitFunctionButton.click();
      $lookupChouseButton.click();
    });

    let store = app.__container__.lookup('service:store');
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let limitType = controller.limitType;
    let queryPredicate = new StringPredicate('name').contains(limitType);

    // Create limit for query.
    let query = new Query.Builder(store)
      .from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('SettingLookupExampleView')
      .where(queryPredicate);

    // Load olv data.
    store.query('ember-flexberry-dummy-suggestion-type', query.build()).then((suggestionTypes) => {

      let suggestionTypesArr = suggestionTypes.toArray();
      let suggestionModelLength = suggestionTypesArr.length;

      let done = assert.async();

      Ember.run(() => {
        setTimeout(function() {
          let $lookupSearch = Ember.$('.content table.object-list-view');
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
  Ember.set(controller, 'actions.externalRemoveAction', (actual) => {
    $onRemoveData = actual;
    assert.notEqual($onRemoveData, undefined, 'Component sends \'remove\' action after first click');
    assert.strictEqual($onRemoveData.relationName, 'type', 'Component sends \'remove\' with actual relationName');
  });

  // Remap chose action.
  let $onChooseData;
  Ember.set(controller, 'actions.externalChooseAction', (actual) => {
    $onChooseData = actual;
    assert.notEqual($onChooseData, undefined, 'Component sends \'choose\' action after first click');
    assert.strictEqual($onChooseData.componentName, 'flexberry-lookup',
     'Component sends \'choose\' with actual componentName');
    assert.strictEqual($onChooseData.projection, 'SettingLookupExampleView',
     'Component sends \'choose\' with actual projection');
  });

  visit('components-acceptance-tests/flexberry-lookup/settings-example-actions');
  andThen(function() {
    let $lookupButtouChoose = Ember.$('.lookup-choose-button');
    let $lookupButtouRemove = Ember.$('.lookup-clear-button');

    Ember.run(() => {
      $lookupButtouChoose.click();
      $lookupButtouRemove.click();
    });
  });
});

test('flexberry-lookup relation name test', function(assert) {
  visit('components-acceptance-tests/flexberry-lookup/settings-example-relation-name');
  andThen(function() {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let relationName = Ember.get(controller, 'relationName');
    assert.strictEqual(
      relationName,
      'Temp relation name',
      'relationName: \'' + relationName + '\' as expected');
  });
});
