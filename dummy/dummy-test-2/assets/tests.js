'use strict';

define('dummy/tests/acceptance/components/base-flexberry-lookup-test', ['qunit', 'dummy/tests/helpers/start-app', 'ember-flexberry-data/query/predicate', 'ember-flexberry-data/query/builder'], function (_qunit, _startApp, _predicate, _builder) {
  'use strict';

  var openLookupDialog = function openLookupDialog($lookup) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = void 0;
      var checkIntervalSucceed = false;
      var checkInterval = 500;

      var timeout = 4000;

      var $lookupChooseButton = Ember.$('.ui-change', $lookup);

      // Try to open lookup dialog.
      Ember.run(function () {
        $lookupChooseButton.click();
      });

      // Wait for lookup dialog to be opened & data loaded.
      Ember.run(function () {
        checkIntervalId = window.setInterval(function () {
          var $lookupDialog = Ember.$('.flexberry-modal');
          var $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
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
      Ember.run(function () {
        window.setTimeout(function () {
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

  var chooseRecordInLookupDialog = function chooseRecordInLookupDialog($lookupDialog, recordIndex) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = void 0;
      var checkIntervalSucceed = false;
      var checkInterval = 500;

      var timeout = 4000;

      var $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
      var $choosedRecord = Ember.$($records[recordIndex]);

      // Try to choose record in the lookup dialog.
      Ember.run(function () {
        // Inside object-list-views component click actions are available only if cell in row has been clicked.
        // Click on whole row wont take an effect.
        var $choosedRecordFirstCell = Ember.$(Ember.$('td', $choosedRecord)[1]);
        $choosedRecordFirstCell.click();

        // Click on modal-dialog close icon.
        // Сrutch correcting irregular bug
        var $modelDilogClose = Ember.$('.close.icon');
        $modelDilogClose.click();
      });

      // Wait for lookup dialog to be closed.
      Ember.run(function () {
        checkIntervalId = window.setInterval(function () {
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
      Ember.run(function () {
        window.setTimeout(function () {
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

  var app = void 0;
  var latestReceivedRecords = void 0;

  (0, _qunit.module)('Acceptance | flexberry-lookup-base', {
    beforeEach: function beforeEach() {
      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);

      // Override store.query method to receive & remember records which will be requested by lookup dialog.
      var store = app.__container__.lookup('service:store');
      var originalQueryMethod = store.query;
      store.query = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        // Call original method & remember returned records.
        return originalQueryMethod.apply(this, args).then(function (records) {
          latestReceivedRecords = records.toArray();

          return records;
        });
      };
    },
    afterEach: function afterEach() {
      // Remove semantic ui modal dialog's dimmer.
      Ember.$('body .ui.dimmer.modals').remove();

      // Destroy application.
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)('changes in component\'s value causes changes in related model\'s specified \'belongsTo\' relation', function (assert) {
    visit('components-acceptance-tests/flexberry-lookup/base-operations');
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var model = Ember.get(controller, 'model');
      var relationName = Ember.get(controller, 'relationName');
      var displayAttributeName = Ember.get(controller, 'displayAttributeName');

      var $lookup = Ember.$('.flexberry-lookup');
      var $lookupInput = Ember.$('input', $lookup);
      assert.strictEqual($lookupInput.val(), '', 'lookup display value is empty by default');

      // Wait for lookup dialog to be opened, choose first record & check component's state.
      var asyncOperationsCompleted = assert.async();
      openLookupDialog($lookup).then(function ($lookupDialog) {
        assert.ok($lookupDialog);

        // Lookup dialog successfully opened & data is loaded.
        // Try to choose first loaded record.
        return chooseRecordInLookupDialog($lookupDialog, 0);
      }).then(function () {
        // First loaded record chosen successfully.
        // Check that chosen record is now set to related model's 'belongsTo' relation.
        var chosenRecord = model.get(relationName);
        var expectedRecord = latestReceivedRecords[0];
        assert.strictEqual(chosenRecord, expectedRecord, 'chosen record is set to model\'s \'' + relationName + '\' relation as expected');

        var chosenRecordDisplayAttribute = chosenRecord.get(displayAttributeName);
        assert.strictEqual($lookupInput.val(), chosenRecordDisplayAttribute, 'lookup display value is equals to chosen record\'s \'' + displayAttributeName + '\' attribute');
      }).catch(function (reason) {
        // Error output.
        assert.ok(false, reason);
      }).finally(function () {
        asyncOperationsCompleted();
      });
    });
  });

  (0, _qunit.test)('changes in model\'s value causes changes in component\'s specified \'belongsTo\' model', function (assert) {
    assert.expect(2);
    visit('components-acceptance-tests/flexberry-lookup/base-operations');
    andThen(function () {

      var $lookup = Ember.$('.flexberry-lookup');
      var $lookupInput = Ember.$('input', $lookup);
      assert.strictEqual($lookupInput.val() === '', true, 'lookup display value is empty by default');

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var model = Ember.get(controller, 'model');
      var store = app.__container__.lookup('service:store');
      var suggestionType = void 0;

      // Create limit for query.
      var query = new _builder.default(store).from('ember-flexberry-dummy-suggestion-type').selectByProjection('SettingLookupExampleView');

      // Load olv data.
      store.query('ember-flexberry-dummy-suggestion-type', query.build()).then(function (suggestionTypes) {

        var suggestionTypesArr = suggestionTypes.toArray();

        suggestionType = suggestionTypesArr.objectAt(0);
      }).then(function () {

        // Change data in the model.
        model.set('type', suggestionType);

        var done = assert.async();

        setTimeout(function () {
          $lookupInput = Ember.$('input', $lookup);
          assert.strictEqual($lookupInput.val() === suggestionType.get('name'), true, 'lookup display value isn\'t empty');
          done();
        }, 100);
      });
    });
  });

  (0, _qunit.test)('flexberry-lookup limit function test', function (assert) {

    visit('components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

    andThen(function () {
      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

      var $limitFunctionButton = Ember.$('.limitFunction');
      var $lookupChouseButton = Ember.$('.ui-change');

      Ember.run(function () {
        $limitFunctionButton.click();
        $lookupChouseButton.click();
      });

      var store = app.__container__.lookup('service:store');
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var limitType = controller.limitType;
      var queryPredicate = new _predicate.StringPredicate('name').contains(limitType);

      // Create limit for query.
      var query = new _builder.default(store).from('ember-flexberry-dummy-suggestion-type').selectByProjection('SettingLookupExampleView').where(queryPredicate);

      // Load olv data.
      store.query('ember-flexberry-dummy-suggestion-type', query.build()).then(function (suggestionTypes) {

        var suggestionTypesArr = suggestionTypes.toArray();
        var suggestionModelLength = suggestionTypesArr.length;

        var done = assert.async();

        Ember.run(function () {
          setTimeout(function () {
            var $lookupSearch = Ember.$('.content table.object-list-view');
            var $lookupSearchThead = $lookupSearch.children('tbody');
            var $lookupSearchTr = $lookupSearchThead.children('tr');
            var $lookupRows = $lookupSearchTr.children('td');
            var $suggestionTableLength = $lookupSearchTr.length;

            assert.expect(2 + $suggestionTableLength);

            assert.strictEqual(suggestionModelLength >= $suggestionTableLength, true, 'Сorrect number of values restrictions limiting function');

            // Сomparison data in the model and olv table.
            for (var i = 0; i < $suggestionTableLength; i++) {
              var suggestionType = suggestionTypesArr.objectAt(i);
              var suggestionTypeName = suggestionType.get('name');

              var $cell = Ember.$($lookupRows[3 * i + 1]);
              var $cellDiv = $cell.children('div');
              var $cellText = $cellDiv.text().trim();

              assert.strictEqual(suggestionTypeName === $cellText, true, 'Сorrect data at lookup\'s olv');
            }

            done();
          }, 2000);
        });
      });
    });
  });

  (0, _qunit.test)('flexberry-lookup actions test', function (assert) {
    assert.expect(5);

    var controller = void 0;
    Ember.run(function () {
      controller = app.__container__.lookup('controller:components-acceptance-tests/flexberry-lookup/settings-example-actions');
    });

    // Remap remove action.
    var $onRemoveData = void 0;
    Ember.set(controller, 'actions.externalRemoveAction', function (actual) {
      $onRemoveData = actual;
      assert.notEqual($onRemoveData, undefined, 'Component sends \'remove\' action after first click');
      assert.strictEqual($onRemoveData.relationName, 'type', 'Component sends \'remove\' with actual relationName');
    });

    // Remap chose action.
    var $onChooseData = void 0;
    Ember.set(controller, 'actions.externalChooseAction', function (actual) {
      $onChooseData = actual;
      assert.notEqual($onChooseData, undefined, 'Component sends \'choose\' action after first click');
      assert.strictEqual($onChooseData.componentName, 'flexberry-lookup', 'Component sends \'choose\' with actual componentName');
      assert.strictEqual($onChooseData.projection, 'SettingLookupExampleView', 'Component sends \'choose\' with actual projection');
    });

    visit('components-acceptance-tests/flexberry-lookup/settings-example-actions');
    andThen(function () {
      var $lookupButtouChoose = Ember.$('.ui-change');
      var $lookupButtouRemove = Ember.$('.ui-clear');

      Ember.run(function () {
        $lookupButtouChoose.click();
        $lookupButtouRemove.click();
      });
    });
  });

  (0, _qunit.test)('flexberry-lookup relation name test', function (assert) {
    assert.expect(1);
    visit('components-acceptance-tests/flexberry-lookup/settings-example-relation-name');
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var relationName = Ember.get(controller, 'relationName');
      assert.strictEqual(relationName, 'Temp relation name', 'relationName: \'' + relationName + '\' as expected');
    });
  });

  (0, _qunit.test)('flexberry-lookup projection test', function (assert) {
    assert.expect(2);

    visit('components-acceptance-tests/flexberry-lookup/settings-example-projection');

    andThen(function () {
      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-projection');

      var $lookupButtouChoose = Ember.$('.ui-change');

      // Click choose button.
      Ember.run(function () {
        $lookupButtouChoose.click();
      });

      Ember.run(function () {
        var done = assert.async();
        setTimeout(function () {

          var $lookupSearch = Ember.$('.content table.object-list-view');
          var $lookupSearchThead = $lookupSearch.children('thead');
          var $lookupSearchTr = $lookupSearchThead.children('tr');
          var $lookupHeaders = $lookupSearchTr.children('th');

          // Check count at table header.
          assert.strictEqual($lookupHeaders.length === 3, true, 'Component has SuggestionTypeE projection');

          done();
        }, 1000);
      });
    });
  });

  (0, _qunit.test)('visiting flexberry-lookup dropdown', function (assert) {
    assert.expect(13);

    visit('components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

    andThen(function () {

      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

      // Retrieve component, it's inner <input>.
      var $lookupSearch = Ember.$('.lookup-field');
      var $lookupButtonChoose = Ember.$('.ui-change');
      var $lookupButtonClear = Ember.$('.lookup-remove-button');

      assert.strictEqual($lookupSearch.length === 0, true, 'Component has n\'t flexberry-lookup');
      assert.strictEqual($lookupButtonChoose.length === 0, true, 'Component has n\'t button choose');
      assert.strictEqual($lookupButtonClear.length === 0, true, 'Component has n\'t button remove');

      // Retrieve component, it's inner <input>.
      var $dropdown = Ember.$('.flexberry-dropdown.search.selection');
      var $dropdownSearch = $dropdown.children('.search');
      var $dropdownIcon = $dropdown.children('.dropdown.icon');
      var $dropdownMenu = $dropdown.children('.menu');
      var $deopdownText = $dropdown.children('.text');

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

  (0, _qunit.test)('visiting flexberry-lookup autocomplete', function (assert) {
    assert.expect(5);

    visit('components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

    andThen(function () {

      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

      var $lookup = Ember.$('.flexberry-lookup');

      assert.strictEqual($lookup.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
      assert.strictEqual($lookup.hasClass('search'), true, 'Component\'s wrapper has \'search\' css-class');

      var $lookupField = Ember.$('.lookup-field');

      assert.strictEqual($lookupField.hasClass('prompt'), true, 'Component\'s wrapper has \'prompt\' css-class');

      var $result = Ember.$('.result');

      assert.strictEqual($result.length === 1, true, 'Component has inner class \'result\'');
    });
  });

  (0, _qunit.test)('flexberry-lookup limit function through dynamic properties test', function (assert) {

    var path = 'components-examples/flexberry-lookup/limit-function-through-dynamic-properties-example';

    visit(path);

    andThen(function () {
      assert.equal(currentURL(), path);

      var $limitFunctionButton1 = Ember.$('.firstLimitFunction');
      var $limitFunctionButton2 = Ember.$('.secondLimitFunction');
      var $clearLimitFunctionButton = Ember.$('.clearLimitFunction');
      var limitFunction1 = void 0;
      var limitFunction2 = void 0;

      var store = app.__container__.lookup('service:store');
      var controller = app.__container__.lookup('controller:' + currentRouteName());

      // Create limit for query.
      var query = new _builder.default(store).from('ember-flexberry-dummy-suggestion-type').selectByProjection('SettingLookupExampleView').top(2);

      // Load olv data.
      store.query('ember-flexberry-dummy-suggestion-type', query.build()).then(function (suggestionTypes) {
        var suggestionTypesArr = suggestionTypes.toArray();
        limitFunction1 = suggestionTypesArr.objectAt(0).get('name');
        limitFunction2 = suggestionTypesArr.objectAt(1).get('name');
      }).then(function () {

        $limitFunctionButton1.click();
        assert.equal(controller.lookupCustomLimitPredicate._containsValue, limitFunction1, 'Current limit function afther first limit function button click');

        $limitFunctionButton2.click();
        assert.equal(controller.lookupCustomLimitPredicate._containsValue, limitFunction2, 'Current limit function afther second limit function button click');

        $clearLimitFunctionButton.click();
        assert.equal(controller.lookupCustomLimitPredicate, undefined, 'Absent limit function afther clear limit function button click');
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-dropdown/flexberry-dropdown-conditional-render-test', ['qunit', 'dummy/tests/helpers/start-app'], function (_qunit, _startApp) {
  'use strict';

  var app = void 0;
  var path = 'components-examples/flexberry-dropdown/conditional-render-example';
  var testName = 'conditional render test';

  (0, _qunit.module)('Acceptance | flexberry-dropdown | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },
    afterEach: function afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {
    assert.expect(4);

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path, 'Path is correctly');

      var $dropdown = Ember.$('.flexberry-dropdown');
      assert.equal($dropdown.length, 1, 'Dropdown is render');

      // Select dropdown item.
      $dropdown.dropdown('set selected', 'Enum value №1');

      var done = assert.async();
      var timeout = 100;
      Ember.run.later(function () {
        var $dropdown = Ember.$('.flexberry-dropdown');
        assert.equal($dropdown.length, 0, 'Dropdown isn\'t render');

        var $span = Ember.$('div.field span');
        assert.equal($span.text(), 'Enum value №1', 'Span is render');
        done();
      }, timeout);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-dropdown/flexberry-dropdown-empty-value-test', ['qunit', 'dummy/tests/helpers/start-app'], function (_qunit, _startApp) {
  'use strict';

  var app = void 0;
  var path = 'components-examples/flexberry-dropdown/empty-value-example';
  var testName = 'empty value test';

  (0, _qunit.module)('Acceptance | flexberry-dropdown | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },
    afterEach: function afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {
    assert.expect(3);

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path, 'Path is correctly');

      var $dropdown = Ember.$('.flexberry-dropdown');
      assert.equal($dropdown.length, 1, 'Dropdown is render');
      assert.equal($dropdown[0].innerText, 'Enum value №2', 'Dropdown value is "Enum value №2"');
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-groupedit-test', ['qunit', 'dummy/tests/helpers/start-app', 'ember-test-helpers/wait'], function (_qunit, _startApp, _wait) {
  'use strict';

  var app = void 0;

  (0, _qunit.module)('Acceptance | flexberry-groupedit', {
    beforeEach: function beforeEach() {
      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },
    afterEach: function afterEach() {
      // Destroy application.
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)('it properly rerenders', function (assert) {
    assert.expect(4);
    var done = assert.async();

    var path = 'components-acceptance-tests/flexberry-groupedit/properly-rerenders';
    visit(path);
    (0, _wait.default)().then(function () {

      assert.equal(Ember.$('.object-list-view').find('tr').length, 2);

      // Add record.
      var controller = app.__container__.lookup('controller:' + currentRouteName());

      var detailModel = controller.get('model.details');
      var store = controller.get('store');

      var detail1 = store.createRecord('components-examples/flexberry-groupedit/shared/detail');
      var detail2 = store.createRecord('components-examples/flexberry-groupedit/shared/detail');
      detailModel.pushObjects([detail1, detail2]);

      (0, _wait.default)().then(function () {
        assert.equal(Ember.$('.object-list-view').find('tr').length, 3);

        var $componentGroupEditToolbar = Ember.$('.groupedit-toolbar');
        var $componentButtons = $componentGroupEditToolbar.children('.ui.button');
        var $componentButtonAdd = Ember.$($componentButtons[0]);

        Ember.run(function () {
          $componentButtonAdd.click();
        });

        (0, _wait.default)().then(function () {
          assert.equal(Ember.$('.object-list-view').find('tr').length, 4, 'details add properly');

          var $componentCheckBoxs = Ember.$('.flexberry-checkbox', Ember.$('.object-list-view'));
          var $componentFirstCheckBox = Ember.$($componentCheckBoxs[0]);

          Ember.run(function () {
            $componentFirstCheckBox.click();
          });

          (0, _wait.default)().then(function () {
            var $componentButtonRemove = Ember.$($componentButtons[1]);

            Ember.run(function () {
              $componentButtonRemove.click();
            });

            assert.equal(Ember.$('.object-list-view').find('tr').length, 3, 'details remove properly');
            done();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-groupedit/flexberry-groupedit-check-all-at-page-test', ['qunit', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'dummy/tests/helpers/start-app'], function (_qunit, _folvTestsFunctions, _startApp) {
  'use strict';

  var app = void 0;
  var path = 'components-examples/flexberry-groupedit/configurate-row-example';
  var testName = 'check all at page';
  var olvContainerClass = '.object-list-view-container';
  var trTableClass = 'table.object-list-view tbody tr';

  (0, _qunit.module)('Acceptance | flexberry-groupedit | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },
    afterEach: function afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {
    assert.expect(4);

    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $olv = Ember.$('.object-list-view ');
      var $thead = Ember.$('th.dt-head-left', $olv)[0];

      Ember.run(function () {
        var done = assert.async();
        (0, _folvTestsFunctions.loadingList)($thead, olvContainerClass, trTableClass).then(function ($list) {
          assert.ok($list);
          var $rows = Ember.$('.object-list-view-helper-column', $list);

          click('.ui.check-all-at-page-button');
          andThen(function () {
            var $checkCheckBox = Ember.$('.flexberry-checkbox.checked', $rows);
            assert.equal($checkCheckBox.length, $rows.length, 'All checkBox in row are select');

            click('.ui.check-all-at-page-button');
            andThen(function () {
              $checkCheckBox = Ember.$('.flexberry-checkbox.checked', $rows);
              assert.equal($checkCheckBox.length, 0, 'All checkBox in row are unselect');
            });
          });

          done();
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-groupedit/flexberry-groupedit-configurate-row-test', ['qunit', 'dummy/tests/helpers/start-app'], function (_qunit, _startApp) {
  'use strict';

  var app = void 0;
  var path = 'components-examples/flexberry-groupedit/configurate-row-example';
  var testName = 'configurate row';

  (0, _qunit.module)('Acceptance | flexberry-groupedit | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },
    afterEach: function afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {
    assert.expect(58);

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path, 'Path is correctly');
      var $folvRows = Ember.$('.object-list-view-container tbody tr');

      for (var i = 0; i < $folvRows.length; i++) {
        var $row = $folvRows[i];
        var $deleteButton = Ember.$('.object-list-view-row-delete-button', $row);
        var $flagField = Ember.$('.field .flexberry-checkbox', $row);

        if (i % 2 === 0) {
          assert.equal($deleteButton.hasClass('disabled'), true, 'Delete button in an even row is disabled');
          assert.equal($flagField.hasClass('checked'), true, 'CheckBox in an even row is checked');
        } else {
          assert.equal($deleteButton.hasClass('disabled'), false, 'Delete button in a non-even row isn\'t disabled');
          assert.equal($flagField.hasClass('checked'), false, 'CheckBox in an even row isn\'t checked');
        }

        var $textField = Ember.$('.field .flexberry-textbox input', $row);
        assert.equal($textField[0].value, i + 1 + 'test', 'TextBox have currect text');
      }
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-groupedit/flexberry-groupedit-user-button-test', ['qunit', 'dummy/tests/helpers/start-app'], function (_qunit, _startApp) {
  'use strict';

  var app = void 0;
  var testName = 'user button test';

  (0, _qunit.module)('Acceptance | flexberry-groupedit | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },
    afterEach: function afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {
    assert.expect(3);
    var path = 'components-examples/flexberry-groupedit/custom-buttons-example';

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());

      // Enable the hi button.
      click('.toggle-hi-button');

      // First click.
      click('.test-click-button');
      andThen(function () {
        return assert.equal(controller.clickCounter, 2, 'Test button was pressed');
      });

      // Second click.
      click('.test-click-button');
      andThen(function () {
        return assert.equal(controller.clickCounter, 3, 'Test button was pressed');
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/change-component-lookup-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  var openLookupDialog = function openLookupDialog($lookup) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = void 0;
      var checkIntervalSucceed = false;
      var checkInterval = 500;

      var timeout = 4000;

      var $lookupChooseButton = Ember.$('.ui-change', $lookup);

      // Try to open lookup dialog.
      Ember.run(function () {
        $lookupChooseButton.click();
      });

      // Wait for lookup dialog to be opened & data loaded.
      Ember.run(function () {
        checkIntervalId = window.setInterval(function () {
          var $lookupDialog = Ember.$('.flexberry-modal');
          var $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
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
      Ember.run(function () {
        window.setTimeout(function () {
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

  var chooseRecordInLookupDialog = function chooseRecordInLookupDialog($lookupDialog, recordIndex) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = void 0;
      var checkIntervalSucceed = false;
      var checkInterval = 500;

      var timeout = 4000;

      var $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
      var $choosedRecord = Ember.$($records[recordIndex]);

      // Try to choose record in the lookup dialog.
      Ember.run(function () {
        // Inside object-list-views component click actions are available only if cell in row has been clicked.
        // Click on whole row wont take an effect.
        var $choosedRecordFirstCell = Ember.$(Ember.$('td', $choosedRecord)[1]);
        $choosedRecordFirstCell.click();

        // Click on modal-dialog close icon.
        // Сrutch correcting irregular bug
        var $modelDilogClose = Ember.$('.close.icon');
        $modelDilogClose.click();
      });

      // Wait for lookup dialog to be closed.
      Ember.run(function () {
        checkIntervalId = window.setInterval(function () {
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
      Ember.run(function () {
        window.setTimeout(function () {
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

  (0, _executeFlexberryLookupTest.executeTest)('changes in component\'s value causes changes in related model\'s specified \'belongsTo\' relation', function (store, assert, app, latestReceivedRecords) {
    assert.expect(4);
    visit('components-acceptance-tests/flexberry-lookup/base-operations');

    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var model = Ember.get(controller, 'model');
      var relationName = Ember.get(controller, 'relationName');
      var displayAttributeName = Ember.get(controller, 'displayAttributeName');

      var $lookup = Ember.$('.flexberry-lookup');
      var $lookupInput = Ember.$('input', $lookup);
      assert.strictEqual($lookupInput.val(), '', 'lookup display value is empty by default');

      // Wait for lookup dialog to be opened, choose first record & check component's state.
      var asyncOperationsCompleted = assert.async();
      openLookupDialog($lookup).then(function ($lookupDialog) {
        assert.ok($lookupDialog);

        // Lookup dialog successfully opened & data is loaded.
        // Try to choose first loaded record.
        return chooseRecordInLookupDialog($lookupDialog, 0);
      }).then(function () {
        // First loaded record chosen successfully.
        // Check that chosen record is now set to related model's 'belongsTo' relation.
        var chosenRecord = model.get(relationName);
        var expectedRecord = latestReceivedRecords[0];
        assert.strictEqual(chosenRecord, expectedRecord, 'chosen record is set to model\'s \'' + relationName + '\' relation as expected');

        var chosenRecordDisplayAttribute = chosenRecord.get(displayAttributeName);
        assert.strictEqual($lookupInput.val(), chosenRecordDisplayAttribute, 'lookup display value is equals to chosen record\'s \'' + displayAttributeName + '\' attribute');
      }).catch(function (reason) {
        throw new Error(reason);
      }).finally(function () {
        asyncOperationsCompleted();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/change-model-lookup-test', ['ember-flexberry-data/query/builder', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_builder, _executeFlexberryLookupTest) {
  'use strict';

  (0, _executeFlexberryLookupTest.executeTest)('changes in model\'s value causes changes in component\'s specified \'belongsTo\' model', function (store, assert, app) {
    assert.expect(2);
    visit('components-acceptance-tests/flexberry-lookup/base-operations');
    andThen(function () {

      var $lookup = Ember.$('.flexberry-lookup');
      var $lookupInput = Ember.$('input', $lookup);
      assert.strictEqual($lookupInput.val() === '', true, 'lookup display value is empty by default');

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var model = Ember.get(controller, 'model');
      var store = app.__container__.lookup('service:store');
      var suggestionType = void 0;

      // Create limit for query.
      var query = new _builder.default(store).from('ember-flexberry-dummy-suggestion-type').selectByProjection('SettingLookupExampleView');

      // Load olv data.
      store.query('ember-flexberry-dummy-suggestion-type', query.build()).then(function (suggestionTypes) {

        var suggestionTypesArr = suggestionTypes.toArray();

        suggestionType = suggestionTypesArr.objectAt(0);
      }).then(function () {

        // Change data in the model.
        model.set('type', suggestionType);

        var done = assert.async();

        setTimeout(function () {
          $lookupInput = Ember.$('input', $lookup);
          assert.strictEqual($lookupInput.val() === suggestionType.get('name'), true, 'lookup display value isn\'t empty');
          done();
        }, 100);
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', ['exports', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _qunit, _startApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.executeTest = executeTest;
  function executeTest(testName, callback) {
    var app = void 0;
    var store = void 0;
    var latestReceivedRecords = Ember.A();

    (0, _qunit.module)('Acceptance | flexberry-lookup-base |' + testName, {
      beforeEach: function beforeEach() {

        // Start application.
        app = (0, _startApp.default)();

        // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
        var applicationController = app.__container__.lookup('controller:application');
        applicationController.set('isInAcceptanceTestMode', true);

        // Override store.query method to receive & remember records which will be requested by lookup dialog.
        var store = app.__container__.lookup('service:store');
        var originalQueryMethod = store.query;
        store.query = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          // Call original method & remember returned records.
          return originalQueryMethod.apply(this, args).then(function (records) {
            latestReceivedRecords.clear();
            latestReceivedRecords.addObjects(records.toArray());

            return records;
          });
        };
      },
      afterEach: function afterEach() {
        // Remove semantic ui modal dialog's dimmer.
        Ember.$('body .ui.dimmer.modals').remove();

        // Destroy application.
        Ember.run(app, 'destroy');
      }
    });

    (0, _qunit.test)(testName, function (assert) {
      return callback(store, assert, app, latestReceivedRecords);
    });
  }
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-actions-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup actions test', function (store, assert, app) {
    assert.expect(5);

    var controller = app.__container__.lookup('controller:components-acceptance-tests/flexberry-lookup/settings-example-actions');

    // Remap remove action.
    var $onRemoveData = void 0;
    Ember.set(controller, 'actions.externalRemoveAction', function (actual) {
      $onRemoveData = actual;
      assert.notEqual($onRemoveData, undefined, 'Component sends \'remove\' action after first click');
      assert.strictEqual($onRemoveData.relationName, 'type', 'Component sends \'remove\' with actual relationName');
    });

    // Remap chose action.
    var $onChooseData = void 0;
    Ember.set(controller, 'actions.externalChooseAction', function (actual) {
      $onChooseData = actual;
      assert.notEqual($onChooseData, undefined, 'Component sends \'choose\' action after first click');
      assert.strictEqual($onChooseData.componentName, 'flexberry-lookup', 'Component sends \'choose\' with actual componentName');
      assert.strictEqual($onChooseData.projection, 'SettingLookupExampleView', 'Component sends \'choose\' with actual projection');
    });

    visit('components-acceptance-tests/flexberry-lookup/settings-example-actions');
    andThen(function () {
      var $lookupButtouChoose = Ember.$('.ui-change');
      var $lookupButtouRemove = Ember.$('.ui-clear');

      Ember.run(function () {
        $lookupButtouChoose.click();
        $lookupButtouRemove.click();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-autocomplete-en-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', 'dummy/tests/acceptance/components/flexberry-lookup/lookup-test-functions', '@ember/test-helpers'], function (_executeFlexberryLookupTest, _lookupTestFunctions, _testHelpers) {
  'use strict';

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup autocomplete message en', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      (0, _lookupTestFunctions.loadingLocales)('en', app).then(function () {
        var textbox = Ember.$('.ember-text-field')[0];
        (0, _testHelpers.fillIn)(textbox, 'gfhfkjglkhlh');
      });

      var asyncOperationsCompleted = assert.async();
      Ember.run.later(function () {
        asyncOperationsCompleted();

        var $message = Ember.$('.message');
        assert.strictEqual($message.hasClass('empty'), true, 'Component\'s wrapper has message');

        var $messageHeader = $message.children('.header');
        assert.equal($messageHeader.text(), 'No results', 'Message\'s header is properly');

        var $messageDescription = $message.children('.description');
        assert.equal($messageDescription.text(), 'No results found', 'Message\'s description is properly');
      }, 5000);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-autocomplete-ru-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', 'dummy/tests/acceptance/components/flexberry-lookup/lookup-test-functions', '@ember/test-helpers'], function (_executeFlexberryLookupTest, _lookupTestFunctions, _testHelpers) {
  'use strict';

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup autocomplete message ru', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      (0, _lookupTestFunctions.loadingLocales)('ru', app).then(function () {
        var textbox = Ember.$('.ember-text-field')[0];
        (0, _testHelpers.fillIn)(textbox, 'gfhfkjglkhlh');
      });

      var asyncOperationsCompleted = assert.async();
      Ember.run.later(function () {
        asyncOperationsCompleted();

        var $message = Ember.$('.message');
        assert.strictEqual($message.hasClass('empty'), true, 'Component\'s wrapper has message');

        var $messageHeader = $message.children('.header');
        assert.equal($messageHeader.text(), 'Нет данных', 'Message\'s header is properly');

        var $messageDescription = $message.children('.description');
        assert.equal($messageDescription.text(), 'Значения не найдены', 'Message\'s description is properly');
      }, 5000);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-autofill-by-limit-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup autofillByLimit in readonly test', function (store, assert) {
    assert.expect(1);
    visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
    andThen(function () {
      var $lookupField = Ember.$('.isreadonly .lookup-field');
      var value = $lookupField.val();
      assert.ok(Ember.isBlank(value), 'Value was changed');
    });
  });

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup autofillByLimit is clean test', function (store, assert) {
    assert.expect(2);
    visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
    andThen(function () {
      var $lookupField = Ember.$('.isclean .lookup-field');
      var value = $lookupField.val();
      assert.notOk(Ember.isBlank(value), 'Value wasn\'t changed');

      Ember.run(function () {
        click('.isclean .ui-clear');
        andThen(function () {
          var $lookupFieldUpdate = Ember.$('.isclean .lookup-field');
          var valueUpdate = $lookupFieldUpdate.val();
          assert.ok(Ember.isBlank(valueUpdate), 'Value isn\'t empty');
        });
      });
    });
  });

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup autofillByLimit changes select value test', function (store, assert, app) {
    assert.expect(1);
    visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var defaultValue = Ember.get(controller, 'defaultValue.id');

      var $lookupField = Ember.$('.exist .lookup-field');
      var value = $lookupField.val();

      assert.notEqual(defaultValue, value, 'DefaultValue: \'' + defaultValue + '\' didn\'t change');
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-limit-function-test', ['ember-flexberry-data/query/builder', 'ember-flexberry-data/query/predicate', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_builder, _predicate, _executeFlexberryLookupTest) {
  'use strict';

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup limit function test', function (store, assert, app) {
    visit('components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

    andThen(function () {
      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

      var $limitFunctionButton = Ember.$('.limitFunction');
      var $lookupChouseButton = Ember.$('.ui-change');

      Ember.run(function () {
        $limitFunctionButton.click();
        $lookupChouseButton.click();
      });

      var store = app.__container__.lookup('service:store');
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var limitType = controller.limitType;
      var queryPredicate = new _predicate.StringPredicate('name').contains(limitType);

      // Create limit for query.
      var query = new _builder.default(store).from('ember-flexberry-dummy-suggestion-type').selectByProjection('SettingLookupExampleView').where(queryPredicate);

      // Load olv data.
      store.query('ember-flexberry-dummy-suggestion-type', query.build()).then(function (suggestionTypes) {

        var suggestionTypesArr = suggestionTypes.toArray();
        var suggestionModelLength = suggestionTypesArr.length;

        var done = assert.async();

        Ember.run(function () {
          setTimeout(function () {
            var $lookupSearch = Ember.$('.content table.object-list-view');
            var $lookupSearchThead = $lookupSearch.children('tbody');
            var $lookupSearchTr = $lookupSearchThead.children('tr');
            var $lookupRows = $lookupSearchTr.children('td');
            var $suggestionTableLength = $lookupSearchTr.length;

            assert.expect(2 + $suggestionTableLength);

            assert.strictEqual(suggestionModelLength >= $suggestionTableLength, true, 'Сorrect number of values restrictions limiting function');

            // Сomparison data in the model and olv table.
            for (var i = 0; i < $suggestionTableLength; i++) {
              var suggestionType = suggestionTypesArr.objectAt(i);
              var suggestionTypeName = suggestionType.get('name');

              var $cell = Ember.$($lookupRows[3 * i + 1]);
              var $cellDiv = $cell.children('div');
              var $cellText = $cellDiv.text().trim();

              assert.strictEqual(suggestionTypeName === $cellText, true, 'Сorrect data at lookup\'s olv');
            }

            done();
          }, 2000);
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-preview-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup preview in modal test', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var testName = controller.testName;
      var $inModal = Ember.$('.in-modal');

      click('.ui-preview', $inModal).then(function () {
        var $modal = Ember.$('.modal');
        var $form = Ember.$('.form', $modal);
        var $field = Ember.$('.flexberry-field .flexberry-textbox', $form);
        var value = $field.children('input').val();
        assert.equal(value, testName);
      });
    });
  });

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup preview in separate route test', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var testName = controller.testName;
      var $inSeparateRoute = Ember.$('.in-separate-route');

      click('.ui-preview', $inSeparateRoute).then(function () {
        var $form = Ember.$('.form');
        var $field = Ember.$('.flexberry-field .flexberry-textbox', $form);
        var value = $field.children('input').val();
        assert.equal(value, testName);
      });
    });
  });

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup preview in groupedit test', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var testName = controller.testName;
      var $inGroupedit = Ember.$('.in-groupedit');

      click('.ui-preview', $inGroupedit).then(function () {
        var $form = Ember.$('.form');
        var $field = Ember.$('.flexberry-field .flexberry-textbox', $form);
        var value = $field.children('input').val();
        assert.equal(value, testName);
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-projection-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup projection test', function (store, assert, app) {
    /* eslint-enable no-unused-vars */

    assert.expect(2);

    visit('components-acceptance-tests/flexberry-lookup/settings-example-projection');

    andThen(function () {
      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-projection');

      var $lookupButtouChoose = Ember.$('.ui-change');

      // Click choose button.
      Ember.run(function () {
        $lookupButtouChoose.click();
      });

      Ember.run(function () {
        var done = assert.async();
        setTimeout(function () {

          var $lookupSearch = Ember.$('.content table.object-list-view');
          var $lookupSearchThead = $lookupSearch.children('thead');
          var $lookupSearchTr = $lookupSearchThead.children('tr');
          var $lookupHeaders = $lookupSearchTr.children('th');

          // Check count at table header.
          assert.strictEqual($lookupHeaders.length === 3, true, 'Component has SuggestionTypeE projection');

          done();
        }, 5000);
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-relation-name-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup relation name test', function (store, assert, app) {
    assert.expect(1);
    visit('components-acceptance-tests/flexberry-lookup/settings-example-relation-name');
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var relationName = Ember.get(controller, 'relationName');
      assert.strictEqual(relationName, 'Temp relation name', 'relationName: \'' + relationName + '\' as expected');
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/lookup-test-functions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.loadingList = loadingList;
  exports.loadingLocales = loadingLocales;


  // Function for waiting list loading.
  function loadingList($ctrlForClick, list, records) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = void 0;
      var checkIntervalSucceed = false;
      var checkInterval = 500;
      var timeout = 10000;

      Ember.run(function () {
        $ctrlForClick.click();
      });

      Ember.run(function () {
        checkIntervalId = window.setInterval(function () {
          var $list = Ember.$(list);
          var $records = Ember.$(records, $list);
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
      Ember.run(function () {
        window.setTimeout(function () {
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

  // Function for waiting loading list.
  function loadingLocales(locale, app) {
    return new Ember.RSVP.Promise(function (resolve) {
      var i18n = app.__container__.lookup('service:i18n');

      Ember.run(function () {
        i18n.set('locale', locale);
      });

      var timeout = 500;
      Ember.run.later(function () {
        resolve({ msg: 'ok' });
      }, timeout);
    });
  }
});
define('dummy/tests/acceptance/components/flexberry-lookup/visiting-flexberry-lookup-autocomplete-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeFlexberryLookupTest.executeTest)('visiting flexberry-lookup autocomplete', function (store, assert, app) {
    /* eslint-enable no-unused-vars */
    assert.expect(5);

    visit('components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

    andThen(function () {

      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

      var $lookup = Ember.$('.flexberry-lookup');

      assert.strictEqual($lookup.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
      assert.strictEqual($lookup.hasClass('search'), true, 'Component\'s wrapper has \'search\' css-class');

      var $lookupField = Ember.$('.lookup-field');

      assert.strictEqual($lookupField.hasClass('prompt'), true, 'Component\'s wrapper has \'prompt\' css-class');

      var $result = Ember.$('.result');

      assert.strictEqual($result.length === 1, true, 'Component has inner class \'result\'');
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/visiting-flexberry-lookup-dropdown-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeFlexberryLookupTest.executeTest)('visiting flexberry-lookup dropdown', function (store, assert, app) {
    /* eslint-enable no-unused-vars */
    assert.expect(13);

    visit('components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

    andThen(function () {

      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

      // Retrieve component, it's inner <input>.
      var $lookupSearch = Ember.$('.lookup-field');
      var $lookupButtonChoose = Ember.$('.ui-change');
      var $lookupButtonClear = Ember.$('.lookup-remove-button');

      assert.strictEqual($lookupSearch.length === 0, true, 'Component has n\'t flexberry-lookup');
      assert.strictEqual($lookupButtonChoose.length === 0, true, 'Component has n\'t button choose');
      assert.strictEqual($lookupButtonClear.length === 0, true, 'Component has n\'t button remove');

      // Retrieve component, it's inner <input>.
      var $dropdown = Ember.$('.flexberry-dropdown.search.selection');
      var $dropdownSearch = $dropdown.children('.search');
      var $dropdownIcon = $dropdown.children('.dropdown.icon');
      var $dropdownMenu = $dropdown.children('.menu');
      var $deopdownText = $dropdown.children('.text');

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
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/checkbox-at-editform-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _folvTestsFunctions) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check checkbox at editform', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox';
    visit(path);
    andThen(function () {

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $folvContainer = Ember.$('.object-list-view-container');
      var $trTableBody = Ember.$('table.object-list-view tbody tr', $folvContainer);
      var $cell = $trTableBody[0].children[1];

      var timeout = 500;
      Ember.run.later(function () {
        controller.set('rowClickable', true);
        Ember.run.later(function () {
          var asyncOperationsCompleted = assert.async();
          (0, _folvTestsFunctions.loadingList)($cell, 'form.flexberry-vertical-form', '.field').then(function ($editForm) {
            var checkbox = Ember.$('.flexberry-checkbox');

            assert.ok($editForm, 'edit form open');
            assert.equal(checkbox.hasClass('checked'), true, 'checkbox is check');
          }).catch(function (reason) {
            // Error output.
            assert.ok(false, reason);
          }).finally(function () {
            asyncOperationsCompleted();
          });
        }, timeout);
      }, timeout);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', ['exports', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _qunit, _startApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.executeTest = executeTest;
  exports.addDataForDestroy = addDataForDestroy;


  var dataForDestroy = Ember.A();
  var app = void 0;

  function executeTest(testName, callback) {
    var store = void 0;
    var userSettingsService = void 0;

    (0, _qunit.module)('Acceptance | flexberry-objectlistview | ' + testName, {
      beforeEach: function beforeEach() {
        Ember.run(function () {
          // Start application.
          app = (0, _startApp.default)();

          // Just take it and turn it off...
          app.__container__.lookup('service:log').set('enabled', false);

          // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
          var applicationController = app.__container__.lookup('controller:application');
          applicationController.set('isInAcceptanceTestMode', true);
          store = app.__container__.lookup('service:store');

          userSettingsService = app.__container__.lookup('service:user-settings');
          var getCurrentPerPage = function getCurrentPerPage() {
            return 5;
          };

          userSettingsService.set('getCurrentPerPage', getCurrentPerPage);
        });
      },
      afterEach: function afterEach() {
        Ember.run(function () {
          if (dataForDestroy.length !== 0) {
            recursionDelete(0);
          } else {
            Ember.run(app, 'destroy');
          }
        });
      }
    });

    (0, _qunit.test)(testName, function (assert) {
      return callback(store, assert, app);
    });
  }

  /**
    Function to delete data after testing.
  
    @public
    @method addDataForDestroy
    @param {Object} data  or array of Object.
   */

  function addDataForDestroy(data) {
    if (Ember.isArray(data)) {
      dataForDestroy.addObjects(data);
    } else {
      dataForDestroy.addObject(data);
    }
  }

  function recursionDelete(index) {
    if (index < dataForDestroy.length) {
      if (!dataForDestroy[index].currentState.isDeleted) {
        dataForDestroy[index].destroyRecord().then(function () {
          recursionDelete(index + 1);
        });
      } else {
        recursionDelete(index + 1);
      }
    } else {
      dataForDestroy.clear();
      Ember.run(app, 'destroy');
    }
  }
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-empty-filter-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _folvTestsFunctions) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check empty filter', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/custom-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'empty';
    var filtreInsertParametr = '';
    var user = void 0;
    var type = void 0;
    var suggestion = void 0;
    Ember.run(function () {
      var newRecords = Ember.A();
      user = newRecords.pushObject(store.createRecord('ember-flexberry-dummy-application-user', { name: 'Random name fot empty filther test',
        eMail: 'Random eMail fot empty filther test' }));
      type = newRecords.pushObject(store.createRecord('ember-flexberry-dummy-suggestion-type', { name: 'Random name fot empty filther test' }));

      type.save().then(function () {
        user.save().then(function () {
          Ember.run(function () {
            suggestion = newRecords.pushObject(store.createRecord(modelName, { type: type, author: user, editor1: user }));
            suggestion.save();
            (0, _executeFolvTest.addDataForDestroy)(suggestion);
            (0, _executeFolvTest.addDataForDestroy)(type);
            (0, _executeFolvTest.addDataForDestroy)(user);
          });
        });
      });

      visit(path + '?perPage=500');
      andThen(function () {
        assert.equal(currentPath(), path);
        var $filterButtonDiv = Ember.$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = Ember.$('.object-list-view');

        // Activate filtre row.
        Ember.run(function () {
          $filterButton.click();
        });

        (0, _folvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = Ember.$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var filtherResult = controller.model.content;
            var successful = true;
            for (var i = 0; i < filtherResult.length; i++) {
              var address = filtherResult[i]._data.address;
              if (!Ember.isNone(address)) {
                successful = false;
              }
            }

            assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
            assert.equal(successful, true, 'Filter not successfully worked');
          }).finally(function () {
            newRecords[2].destroyRecord().then(function () {
              Ember.run(function () {
                newRecords[0].destroyRecord();
                newRecords[1].destroyRecord();
                done1();
              });
            });
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-filter-by-enther-click-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/query/filter-operator', 'ember-flexberry-data/query/builder'], function (_executeFolvTest, _folvTestsFunctions, _filterOperator, _builder) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check filter by enter click', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'eq';
    var filtreInsertParametr = void 0;

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder = new _builder.default(store).from(modelName).selectByProjection('SuggestionL').where('address', _filterOperator.default.Neq, '').top(1);
      store.query(modelName, builder.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('address');
        if (!filtreInsertParametr) {
          assert.ok(false, 'Empty data');
        }
      }).then(function () {
        var $filterButtonDiv = Ember.$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = Ember.$('.object-list-view');

        // Activate filtre row.
        Ember.run(function () {
          $filterButton.click();
        });

        (0, _folvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter by enter click function.
          var refreshFunction = function refreshFunction() {
            var input = Ember.$('.ember-text-field')[0];
            input.focus();
            keyEvent(input, 'keydown', 13);
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var filtherResult = controller.model.content;
            var successful = true;
            for (var i = 0; i < filtherResult.length; i++) {
              var address = filtherResult[i]._data.address;
              if (address !== filtreInsertParametr) {
                successful = false;
              }
            }

            assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
            assert.equal(successful, true, 'Filter successfully worked');
            done1();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-filter-render-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _folvTestsFunctions) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check filter renders', function (store, assert, app) {
    assert.expect(34);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';

    Ember.run(function () {
      visit(path);
      andThen(function () {
        assert.equal(currentPath(), path);

        var $filterButtonDiv = Ember.$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $filterRemoveButton = $filterButtonDiv.children('.removeFilter-button');
        var $filterButtonIcon = $filterButton.children('i');

        var $table = Ember.$('.object-list-view');
        var $tableTbody = $table.children('tbody');
        var $tableRows = $tableTbody.children('tr');

        // Check filtre button div.
        assert.strictEqual($filterButtonDiv.prop('tagName'), 'DIV', 'Filtre button\'s wrapper is a <div>');
        assert.strictEqual($filterButtonDiv.hasClass('ui icon buttons'), true, 'Filtre button\'s wrapper has \'ui icon buttons\' css-class');
        assert.strictEqual($filterButtonDiv.hasClass('filter-active'), true, 'Filtre button\'s wrapper has \'filter-active\' css-class');
        assert.strictEqual($filterButtonDiv.length === 1, true, 'Component has filter button');

        // Check filtre button.
        assert.strictEqual($filterButton.length === 1, true, 'Filtre button has inner button block');
        assert.strictEqual($filterButton.hasClass('ui button'), true, 'Filtre button\'s wrapper has \'ui button\' css-class');
        assert.strictEqual($filterButton[0].title, 'Добавить фильтр', 'Filtre button has title');
        assert.strictEqual($filterButton.prop('tagName'), 'BUTTON', 'Component\'s inner button block is a <button>');

        // Check button's icon <i>.
        assert.strictEqual($filterButtonIcon.length === 1, true, 'Filtre button\'s title has icon block');
        assert.strictEqual($filterButtonIcon.prop('tagName'), 'I', 'Filtre button\'s icon block is a <i>');
        assert.strictEqual($filterButtonIcon.hasClass('filter icon'), true, 'Filtre button\'s icon block has \'filter icon\' css-class');

        // Check filtre remove button.
        assert.strictEqual($filterRemoveButton.length === 0, true, 'Component hasn\'t remove filter button');

        // Check filtre row.
        assert.strictEqual($tableRows.length === 5, true, 'Filtre row aren\'t active');

        var $objectListView = Ember.$('.object-list-view');

        // Activate filtre row.
        Ember.run(function () {
          $filterButton.click();
        });

        $tableRows = $tableTbody.children('tr');

        // Check filtre row afther filter active.
        assert.strictEqual($tableRows.length === 7, true, 'Filtre row aren\'t active');

        var filtreInsertOperation = 'ge';
        var filtreInsertParametr = 'A value that will never be told';

        (0, _folvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = Ember.$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            $filterButtonDiv = Ember.$('.buttons.filter-active');
            $filterButton = $filterButtonDiv.children('.button.active');
            $filterButtonIcon = $filterButton.children('i');
            $filterRemoveButton = $filterButtonDiv.children('.removeFilter-button');
            var $filterRemoveButtonIcon = $filterRemoveButton.children('i');

            // Check filtre button div.
            assert.strictEqual($filterButtonDiv.prop('tagName'), 'DIV', 'Filtre button\'s wrapper is a <div>');
            assert.strictEqual($filterButtonDiv.hasClass('ui icon buttons'), true, 'Filtre button\'s wrapper has \'ui icon buttons\' css-class');
            assert.strictEqual($filterButtonDiv.hasClass('filter-active'), true, 'Filtre button\'s wrapper has \'filter-active\' css-class');
            assert.strictEqual($filterButtonDiv.length === 1, true, 'Component has filter button');

            // Check filtre button.
            assert.strictEqual($filterButton.length === 1, true, 'Filtre button has inner button block');
            assert.strictEqual($filterButton.hasClass('ui button'), true, 'Filtre button\'s wrapper has \'ui button\' css-class');
            assert.strictEqual($filterButton[0].title, 'Добавить фильтр', 'Filtre button has title');
            assert.strictEqual($filterButton.prop('tagName'), 'BUTTON', 'Component\'s inner button block is a <button>');

            // Check button's icon <i>.
            assert.strictEqual($filterButtonIcon.length === 1, true, 'Filtre button\'s title has icon block');
            assert.strictEqual($filterButtonIcon.prop('tagName'), 'I', 'Filtre button\'s icon block is a <i>');
            assert.strictEqual($filterButtonIcon.hasClass('filter icon'), true, 'Filtre button\'s icon block has \'filter icon\' css-class');

            // Check filtre remove button.
            assert.strictEqual($filterRemoveButton.length === 1, true, 'Filtre remove button has inner button block');
            assert.strictEqual($filterRemoveButton.hasClass('ui button'), true, 'Filtre remove button\'s wrapper has \'ui button\' css-class');
            assert.strictEqual($filterRemoveButton[0].title, 'Сбросить фильтр', 'Filtre remove button has title');
            assert.strictEqual($filterRemoveButton.prop('tagName'), 'BUTTON', 'Component\'s inner button block is a <button>');

            // Check remove button's icon <i>.
            assert.strictEqual($filterRemoveButtonIcon.length === 1, true, 'Filtre button\'s title has icon block');
            assert.strictEqual($filterRemoveButtonIcon.prop('tagName'), 'I', 'Filtre button\'s icon block is a <i>');
            assert.strictEqual($filterRemoveButtonIcon.hasClass('remove icon'), true, 'Filtre button\'s icon block has \'remove icon\' css-class');

            // Deactivate filtre row.
            Ember.run(function () {
              $filterButton.click();
            });

            // Apply filter.
            var done2 = assert.async();
            (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              $tableRows = $tableTbody.children('tr');

              // Check filtre row afther filter deactivate.
              assert.strictEqual($tableRows.length === 1, true, 'Filtre row aren\'t deactivate');
              done2();
            });
            done1();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-filter-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/query/filter-operator', 'ember-flexberry-data/query/builder'], function (_executeFolvTest, _folvTestsFunctions, _filterOperator, _builder) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check filter', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperationArr = ['eq', undefined, 'eq', 'eq', 'eq', 'eq'];
    var filtreInsertValueArr = void 0;

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _builder.default(store).from(modelName).selectByProjection('SuggestionL').where('address', _filterOperator.default.Neq, '').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertValueArr = [arr.objectAt(0).get('address'), undefined, arr.objectAt(0).get('votes'), arr.objectAt(0).get('moderated'), arr.objectAt(0).get('type.name'), arr.objectAt(0).get('author.name')];
      }).then(function () {
        var $filterButtonDiv = Ember.$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = Ember.$('.object-list-view');

        // Activate filtre row.
        Ember.run(function () {
          $filterButton.click();
        });

        (0, _folvTestsFunctions.filterObjectListView)($objectListView, filtreInsertOperationArr, filtreInsertValueArr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = Ember.$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          /* eslint-disable no-unused-vars */
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
            var filtherResult = controller.model.content;
            assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
            done1();
          });
          /* eslint-enable no-unused-vars */
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-ge-filter-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/query/builder'], function (_executeFolvTest, _folvTestsFunctions, _builder) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check ge filter', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'ge';
    var filtreInsertParametr = void 0;

    visit(path + '?perPage=500');
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _builder.default(store).from(modelName).selectByProjection('SuggestionL').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('votes') - 1;
      }).then(function () {
        var $filterButtonDiv = Ember.$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = Ember.$('.object-list-view');

        // Activate filtre row.
        Ember.run(function () {
          $filterButton.click();
        });

        (0, _folvTestsFunctions.filterCollumn)($objectListView, 2, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = Ember.$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var filtherResult = controller.model.content;
            var successful = true;
            for (var i = 0; i < filtherResult.length; i++) {
              var votes = filtherResult[0]._data.votes;
              if (votes <= filtreInsertParametr) {
                successful = false;
              }
            }

            assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
            assert.equal(successful, true, 'Filter successfully worked');
            done1();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-le-filter-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/query/builder'], function (_executeFolvTest, _folvTestsFunctions, _builder) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check le filter', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'le';
    var filtreInsertParametr = void 0;

    visit(path + '?perPage=500');
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _builder.default(store).from(modelName).selectByProjection('SuggestionL').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('votes') + 1;
      }).then(function () {
        var $filterButtonDiv = Ember.$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = Ember.$('.object-list-view');

        // Activate filtre row.
        Ember.run(function () {
          $filterButton.click();
        });

        (0, _folvTestsFunctions.filterCollumn)($objectListView, 2, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = Ember.$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var filtherResult = controller.model.content;
            var successful = true;
            for (var i = 0; i < filtherResult.length; i++) {
              var votes = filtherResult[0]._data.votes;
              if (votes >= filtreInsertParametr) {
                successful = false;
              }
            }

            assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
            assert.equal(successful, true, 'Filter successfully worked');
            done1();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-like-filter-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/query/filter-operator', 'ember-flexberry-data/query/builder'], function (_executeFolvTest, _folvTestsFunctions, _filterOperator, _builder) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check like filter', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'like';
    var filtreInsertParametr = void 0;

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _builder.default(store).from(modelName).selectByProjection('SuggestionL').where('address', _filterOperator.default.Neq, '').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('address');
        filtreInsertParametr = filtreInsertParametr.slice(1, filtreInsertParametr.length);
        if (!filtreInsertParametr) {
          assert.ok(false, 'Empty data');
        }
      }).then(function () {
        var $filterButtonDiv = Ember.$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = Ember.$('.object-list-view');

        // Activate filtre row.
        Ember.run(function () {
          $filterButton.click();
        });

        (0, _folvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = Ember.$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var filtherResult = controller.model.content;
            var successful = true;
            for (var i = 0; i < filtherResult.length; i++) {
              var address = filtherResult[i]._data.address;
              if (address.lastIndexOf(filtreInsertParametr) === -1) {
                successful = false;
              }
            }

            assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
            assert.equal(successful, true, 'Filter successfully worked');
            done1();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-neq-filter-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/query/filter-operator', 'ember-flexberry-data/query/builder'], function (_executeFolvTest, _folvTestsFunctions, _filterOperator, _builder) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check neq filter', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'neq';
    var filtreInsertParametr = void 0;

    visit(path + '?perPage=500');
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _builder.default(store).from(modelName).selectByProjection('SuggestionL').where('address', _filterOperator.default.Neq, '').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('address');
        if (!filtreInsertParametr) {
          assert.ok(false, 'Empty data');
        }
      }).then(function () {
        var $filterButtonDiv = Ember.$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = Ember.$('.object-list-view');

        // Activate filtre row.
        Ember.run(function () {
          $filterButton.click();
        });

        (0, _folvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = Ember.$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var filtherResult = controller.model.content;
            var successful = true;
            for (var i = 0; i < filtherResult.length; i++) {
              var address = filtherResult[i]._data.address;
              if (address === filtreInsertParametr) {
                successful = false;
              }
            }

            assert.equal(successful, true, 'Filter successfully worked');
            done1();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-without-operation-filter-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/query/filter-operator', 'ember-flexberry-data/query/builder'], function (_executeFolvTest, _folvTestsFunctions, _filterOperator, _builder) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check without operation filter', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = '';
    var filtreInsertParametr = void 0;

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _builder.default(store).from(modelName).selectByProjection('SuggestionL').where('address', _filterOperator.default.Neq, '').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('address');
        filtreInsertParametr = filtreInsertParametr.slice(1, filtreInsertParametr.length);
        if (!filtreInsertParametr) {
          assert.ok(false, 'Empty data');
        }
      }).then(function () {
        var $filterButtonDiv = Ember.$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = Ember.$('.object-list-view');

        // Activate filtre row.
        Ember.run(function () {
          $filterButton.click();
        });

        (0, _folvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = Ember.$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var filtherResult = controller.model.content;
            var successful = true;
            for (var i = 0; i < filtherResult.length; i++) {
              var address = filtherResult[i]._data.address;
              if (address.lastIndexOf(filtreInsertParametr) === -1) {
                successful = false;
              }
            }

            assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
            assert.equal(successful, true, 'Filter successfully worked');
            done1();
          });
        });
      });
    });
  });
});
// import { run } from '@ember/runloop';
// import $ from 'jquery';
// import { get } from '@ember/object';
// import { executeTest } from './execute-folv-test';
// import { loadingList, checkSortingList, loadingLocales, getOrderByClause } from './folv-tests-functions';

// var olvContainerClass = '.object-list-view-container';
// var trTableClass = 'table.object-list-view tbody tr';

// Need to add sort by multiple columns.
// TODO: Fix for menu
// executeTest('check select all at all page', (store, assert, app) => {
// assert.expect(10);
// let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
// visit(path);
// click('.ui.clear-sorting-button');
// andThen(() => {

//   // Check page path.
//   assert.equal(currentPath(), path);
//   let controller = app.__container__.lookup('controller:' + currentRouteName());
//   let projectionName = get(controller, 'modelProjection');

//   let orderByClause = null;

//   let $olv = $('.object-list-view ');
//   let $thead = $('th.dt-head-left', $olv)[0];

//   let currentSorting = controller.get('computedSorting');
//   if (!$.isEmptyObject(currentSorting)) {
//     orderByClause = getOrderByClause(currentSorting);
//   }

//   run(() => {
//     let done = assert.async();

//     // Check sortihg in the first column. Sorting is not append.
//     loadingLocales('ru', app).then(() => {
//       checkSortingList(store, projectionName, $olv, orderByClause).then((isTrue) => {
//         assert.ok(isTrue, 'sorting is not applied');

//         // Check sortihg icon in the first column. Sorting icon is not added.
//         assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');
//         let done1 = assert.async();
//         loadingList($thead, olvContainerClass, trTableClass).then(($list) => {

//           assert.ok($list);

//           let $checkAllButton = $('.check-all-button');
//           run(() => {
//             $checkAllButton.click();
//           });

//           let $checkAllAtPageButton = $('.check-all-at-page-button');
//           let $checkCheckBox = $('.flexberry-checkbox.checked.read-only');
//           let $deleteButton = $('.delete-button');

//           // Check afther select all.
//           assert.equal($checkAllAtPageButton.hasClass('disabled'), true, 'select all at page aren\'t available');
//           assert.equal($checkCheckBox.length, 5, 'all checkBox in row are select and readOnly');
//           assert.equal($deleteButton.hasClass('disabled'), false, 'delete are available');

//           run(() => {
//             $checkAllButton.click();
//           });

//           $checkAllAtPageButton = $('.check-all-at-page-button');
//           $checkCheckBox = $('.flexberry-checkbox.checked.read-only');
//           $deleteButton = $('.delete-button');

//           // Check afther unselect all.
//           assert.equal($checkAllAtPageButton.hasClass('disabled'), false, 'select all at page are available');
//           assert.equal($checkCheckBox.length, 0, 'all checkBox in row are select and readOnly');
//           assert.equal($deleteButton.hasClass('disabled'), true, 'delete aren\'t available');

//           done1();
//         });
//         done();
//       });
//     });
//   });
// });
// });
define("dummy/tests/acceptance/components/flexberry-objectlistview/folv-check-all-at-all-page-test", [], function () {
  "use strict";
});
// import { run } from '@ember/runloop';
// import $ from 'jquery';
// import { get } from '@ember/object';
// import { executeTest } from './execute-folv-test';
// import { loadingList, checkSortingList, loadingLocales, getOrderByClause } from './folv-tests-functions';

// var olvContainerClass = '.object-list-view-container';
// var trTableClass = 'table.object-list-view tbody tr';

// Need to add sort by multiple columns.
// executeTest('check select all at page', (store, assert, app) => {
// assert.expect(8);
// let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
// visit(path);
// click('.ui.clear-sorting-button');
// andThen(() => {

//   // Check page path.
//   assert.equal(currentPath(), path);
//   let controller = app.__container__.lookup('controller:' + currentRouteName());
//   let projectionName = get(controller, 'modelProjection');

//   let orderByClause = null;

//   let $olv = $('.object-list-view ');
//   let $thead = $('th.dt-head-left', $olv)[0];

//   let currentSorting = controller.get('computedSorting');
//   if (!$.isEmptyObject(currentSorting)) {
//     orderByClause = getOrderByClause(currentSorting);
//   }

//   run(() => {
//     let done = assert.async();

//     // Check sortihg in the first column. Sorting is not append.
//     loadingLocales('ru', app).then(() => {
//       checkSortingList(store, projectionName, $olv, orderByClause).then((isTrue) => {
//         assert.ok(isTrue, 'sorting is not applied');

//         // Check sortihg icon in the first column. Sorting icon is not added.
//         assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');
//         let done1 = assert.async();
//         loadingList($thead, olvContainerClass, trTableClass).then(($list) => {

//           assert.ok($list);

//           let $checkAllAtPageButton = $('.check-all-at-page-button');
//           run(() => {
//             $checkAllAtPageButton.click();
//           });

//           let $deleteButton = $('.delete-button');
//           let $checkCheckBox = $('.flexberry-checkbox.checked');

//           // Check afther select all at page.
//           assert.equal($checkCheckBox.length, 5, 'all checkBox in row are select');
//           assert.equal($deleteButton.hasClass('disabled'), false, 'delete are available');

//           run(() => {
//             $checkAllAtPageButton.click();
//           });

//           $deleteButton = $('.delete-button');
//           $checkCheckBox = $('.flexberry-checkbox.checked');

//           // Check afther unselect all at page.
//           assert.equal($checkCheckBox.length, 0, 'all checkBox in row are unselect');
//           assert.equal($deleteButton.hasClass('disabled'), true, 'delete aren\'t available');

//           done1();
//         });
//         done();
//       });
//     });
//   });
// });
// });
define("dummy/tests/acceptance/components/flexberry-objectlistview/folv-check-all-at-page-test", [], function () {
  "use strict";
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-check-config-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (_executeFolvTest) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check folv config', function (store, assert) {
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {
      var config = ['createNewButton', 'deleteButton', 'refreshButton', 'showDeleteMenuItemInRow'];
      checkOlvConfig('[data-test-olv]', null, assert, config);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-checked-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (_executeFolvTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeFolvTest.executeTest)('test checking', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var $folvContainer = Ember.$('.object-list-view-container');
      var $row = Ember.$('table.object-list-view tbody tr', $folvContainer).first();

      // Мark first record.
      var $firstCell = Ember.$('.object-list-view-helper-column-cell', $row);
      var $checkboxInRow = Ember.$('.flexberry-checkbox', $firstCell);

      $checkboxInRow.click();
      andThen(function () {
        var recordIsChecked = $checkboxInRow[0].className.indexOf('checked') >= 0;
        assert.ok(recordIsChecked, 'First row is checked');
      });
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-column-config-save-button-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (_executeFolvTest) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check column config save button test', function (store, assert) {
    assert.expect(3);
    var path = 'ember-flexberry-dummy-suggestion-list';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $configButton = Ember.$('button.config-button');
      click($configButton);

      andThen(function () {
        var $field = Ember.$('div.ui.action.input');
        var $fieldInput = $field.children('input');

        assert.equal($field.children('.cols-config-save.disabled').length === 1, true, 'button disabled');
        fillIn($fieldInput, 'aaayyyeee leemaauuuu');
      });

      andThen(function () {
        var $field = Ember.$('div.ui.action.input');
        assert.equal($field.children('.cols-config-save.disabled').length === 0, true, 'button active');
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-configurate-row-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (_executeFolvTest) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check configurate row test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/configurate-rows';

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $folvContainer = Ember.$('.object-list-view-container');

      // Get all positive row.
      var $positivRow = Ember.$('.positive', $folvContainer);
      assert.equal($positivRow.length, 2, 'One positive row at component');

      // Check positive row at folv.
      var $folvRow = $positivRow[0];
      var $cell = Ember.$('.oveflow-text', $folvRow);
      assert.equal($cell[0].innerText, controller.configurateRowByAddress, '');

      // Check positive row at GroupEdit.
      var $geRow = $positivRow[1];
      $cell = Ember.$('.oveflow-text', $geRow);
      assert.equal($cell[0].innerText, controller.configurateRowByAddress, '');

      // Get all negative row.
      var $negativRow = Ember.$('.negative', $folvContainer);
      assert.equal($negativRow.length, 8, 'Four negative row at component');
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-date-format-moment-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations'], function (_executeFolvTest, _folvTestsFunctions, _translations) {
  'use strict';

  (0, _executeFolvTest.executeTest)('date format moment L', function (store, assert, app) {
    assert.expect(5);
    var done = assert.async();
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      (0, _folvTestsFunctions.loadingLocales)('ru', app).then(function () {

        var olvContainerClass = '.object-list-view-container';

        var $toolBar = Ember.$('.ui.secondary.menu')[0];
        var $toolBarButtons = $toolBar.children;
        var $refreshButton = $toolBarButtons[0];
        assert.equal($refreshButton.innerText.trim(), Ember.get(_translations.default, 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');

        var controller = app.__container__.lookup('controller:' + currentRouteName());
        var refreshFunction = function refreshFunction() {
          var refreshButton = Ember.$('.refresh-button')[0];
          refreshButton.click();
        };

        (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
          var moment = app.__container__.lookup('service:moment');
          var momentValue = Ember.get(moment, 'defaultFormat');

          assert.equal(momentValue, 'L', 'moment value is \'L\' ');

          var $folvContainer = Ember.$(olvContainerClass);
          var $table = Ember.$('table.object-list-view', $folvContainer);
          var $headRow = Ember.$('thead tr', $table)[0].children;

          var indexDate = function indexDate() {
            var toReturn = void 0;
            /* eslint-disable no-unused-vars */
            Object.keys($headRow).forEach(function (element, index, array) {
              var $dateAttribute = Ember.$($headRow[element]).children('div');
              if ($dateAttribute.length !== 0 && Ember.$.trim($dateAttribute[0].getAttribute('data-olv-header-property-name')) === 'date') {
                toReturn = index;
                return false;
              }
            });
            /* eslint-enable no-unused-vars */

            return toReturn;
          };

          var $dateCell = function $dateCell() {
            return Ember.$.trim(Ember.$('tbody tr', $table)[0].children[indexDate()].innerText);
          };

          // Date format most be DD.MM.YYYY
          var dateFormatRuRe = /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d/;
          var findDateRu = dateFormatRuRe.exec($dateCell());

          assert.ok(findDateRu, 'date format is \'DD.MM.YYYY\' ');

          var done2 = assert.async();
          (0, _folvTestsFunctions.loadingLocales)('en', app).then(function () {

            var done1 = assert.async();
            (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              // Date format most be MM/DD/YYYY:
              var dateFormatEnRe = /(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/;
              var dataCellStr = $dateCell();

              var findDateEn = dateFormatEnRe.exec(dataCellStr);

              assert.ok(findDateEn, 'date format is \'MM/DD/YYYY\' ');
            }).catch(function (reason) {
              // Error output.
              assert.ok(false, reason);
            }).finally(function () {
              done1();
            });
            done2();
          });
          done();
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-data-cancel-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data/query/builder', 'ember-flexberry-data/query/filter-operator', '@ember/test-helpers'], function (_executeFolvTest, _generateUniqueId, _builder, _filterOperator, _testHelpers) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check delete before record data cancel test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-cancel';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _generateUniqueId.default)();

    // Add records for deleting.
    Ember.run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _executeFolvTest.addDataForDestroy)(newRecord);
        var builder = new _builder.default(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = Ember.$(olvContainerClass);
            var $rows = function $rows() {
              return Ember.$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            /* eslint-disable no-unused-vars */
            var clickPromises = [];
            $rows().forEach(function (element, i, arr) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element)[0];
                clickPromises.push((0, _testHelpers.click)($deleteBtnInRow));
              }
            });
            /* eslint-enable no-unused-vars */

            Promise.all(clickPromises).then(function () {
              var done2 = assert.async();

              // Check that the records wasn't remove in beforeDeleteRecord.
              var controller = app.__container__.lookup('controller:' + currentRouteName());
              assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

              // Check that the records have been removed.
              var recordsIsDeleteBtnInRow = $rows().every(function (element) {
                var nameRecord = Ember.$.trim(element.children[1].innerText);
                return nameRecord.indexOf(uuid) < 0;
              });

              assert.notOk(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' wasn\'t deleted with button in row');

              // Check that the records hadn't removed from store.
              var builder2 = new _builder.default(store, modelName).where('name', _filterOperator.default.Eq, uuid).count();
              var timeout = 500;
              Ember.run.later(function () {
                store.query(modelName, builder2.build()).then(function (result) {
                  assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
                  done2();
                }).finally(function () {
                  newRecord.destroyRecord();
                });
              }, timeout);
            });
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-data-immediately-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data/query/builder', 'ember-flexberry-data/query/filter-operator', '@ember/test-helpers'], function (_executeFolvTest, _generateUniqueId, _builder, _filterOperator, _testHelpers) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check delete before record data immediately test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-immediately';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _generateUniqueId.default)();

    // Add record for deleting.
    Ember.run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _executeFolvTest.addDataForDestroy)(newRecord);
        var builder = new _builder.default(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = Ember.$(olvContainerClass);
            var $rows = function $rows() {
              return Ember.$(trTableClass, $folvContainer).toArray();
            };

            // Check that the record have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            /* eslint-disable no-unused-vars */
            var clickPromises = [];
            $rows().forEach(function (element, i, arr) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element)[0];
                clickPromises.push((0, _testHelpers.click)($deleteBtnInRow));
              }
            });
            /* eslint-enable no-unused-vars */

            Promise.all(clickPromises).then(function () {
              var done2 = assert.async();

              // Check that the records wasn't removed in beforeDeleteRecord.
              var controller = app.__container__.lookup('controller:' + currentRouteName());
              assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

              // Check if the records haven't been removed.
              var recordsIsDeleteBtnInRow = $rows().every(function (element) {
                var nameRecord = Ember.$.trim(element.children[1].innerText);
                return nameRecord.indexOf(uuid) < 0;
              });

              assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' was deleted with button in row');

              // Check that the records have been removed from store.
              var builder2 = new _builder.default(store, modelName).where('name', _filterOperator.default.Eq, uuid).count();
              var timeout = 500;
              Ember.run.later(function () {
                store.query(modelName, builder2.build()).then(function (result) {
                  assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
                  done2();
                }).finally(function () {
                  newRecord.destroyRecord();
                });
              }, timeout);
            });
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data/query/builder', 'ember-flexberry-data/query/filter-operator', '@ember/test-helpers'], function (_executeFolvTest, _generateUniqueId, _builder, _filterOperator, _testHelpers) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check delete before record test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _generateUniqueId.default)();

    // Add records for deliting.
    Ember.run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _executeFolvTest.addDataForDestroy)(newRecord);
        var builder = new _builder.default(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = Ember.$(olvContainerClass);
            var $rows = function $rows() {
              return Ember.$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            /* eslint-disable no-unused-vars */
            var clickPromises = [];
            $rows().forEach(function (element, i, arr) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element)[0];
                clickPromises.push((0, _testHelpers.click)($deleteBtnInRow));
              }
            });
            /* eslint-enable no-unused-vars */

            Promise.all(clickPromises).then(function () {
              var done2 = assert.async();

              // Check that the records wasn't remove in beforeDeleteRecord.
              var controller = app.__container__.lookup('controller:' + currentRouteName());
              assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

              // Check that the records have been removed.
              var recordsIsDeleteBtnInRow = $rows().every(function (element) {
                var nameRecord = Ember.$.trim(element.children[1].innerText);
                return nameRecord.indexOf(uuid) < 0;
              });

              assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

              // Check that the records had been removed from store.
              var builder2 = new _builder.default(store, modelName).where('name', _filterOperator.default.Eq, uuid).count();
              var timeout = 500;
              Ember.run.later(function () {
                store.query(modelName, builder2.build()).then(function (result) {
                  assert.notOk(result.meta.count, 'record \'' + uuid + '\'not found in store');
                  done2();
                });
              }, timeout);
            });
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-data-cancel-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data/query/builder', 'ember-flexberry-data/query/filter-operator', '@ember/test-helpers'], function (_executeFolvTest, _generateUniqueId, _builder, _filterOperator, _testHelpers) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check delete before record with promise data cancel test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-cancel';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _generateUniqueId.default)();

    // Add records for deliting.
    Ember.run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _executeFolvTest.addDataForDestroy)(newRecord);
        var builder = new _builder.default(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = Ember.$(olvContainerClass);
            var $rows = function $rows() {
              return Ember.$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            /* eslint-disable no-unused-vars */
            var clickPromises = [];
            $rows().forEach(function (element, i, arr) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element)[0];
                clickPromises.push((0, _testHelpers.click)($deleteBtnInRow));
              }
            });
            /* eslint-enable no-unused-vars */

            Promise.all(clickPromises).then(function () {
              var done2 = assert.async();

              // Check that the records wasn't remove in beforeDeleteRecord.
              var controller = app.__container__.lookup('controller:' + currentRouteName());
              assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

              // Check if the records wasn't removed.
              var recordsIsDeleteBtnInRow = $rows().every(function (element) {
                var nameRecord = Ember.$.trim(element.children[1].innerText);
                return nameRecord.indexOf(uuid) < 0;
              });

              assert.notOk(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

              // Check that the records haven't been removed from store.
              var builder2 = new _builder.default(store, modelName).where('name', _filterOperator.default.Eq, uuid).count();
              var timeout = 500;
              Ember.run.later(function () {
                store.query(modelName, builder2.build()).then(function (result) {
                  assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
                  done2();
                }).finally(function () {
                  newRecord.destroyRecord();
                });
              }, timeout);
            });
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-data-immediately-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data/query/builder', 'ember-flexberry-data/query/filter-operator', '@ember/test-helpers'], function (_executeFolvTest, _generateUniqueId, _builder, _filterOperator, _testHelpers) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check delete before record with promise data immediately test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-immediately';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _generateUniqueId.default)();

    // Add records for deliting.
    Ember.run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _executeFolvTest.addDataForDestroy)(newRecord);
        var builder = new _builder.default(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = Ember.$(olvContainerClass);
            var $rows = function $rows() {
              return Ember.$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            /* eslint-disable no-unused-vars */
            var clickPromises = [];
            $rows().forEach(function (element, i, arr) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element)[0];
                clickPromises.push((0, _testHelpers.click)($deleteBtnInRow));
              }
            });
            /* eslint-enable no-unused-vars */

            Promise.all(clickPromises).then(function () {
              var done2 = assert.async();

              // Check that the records wasn't remove in beforeDeleteRecord.
              var controller = app.__container__.lookup('controller:' + currentRouteName());
              assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

              // Check if the records wasn't removed.
              var recordsIsDeleteBtnInRow = $rows().every(function (element) {
                var nameRecord = Ember.$.trim(element.children[1].innerText);
                return nameRecord.indexOf(uuid) < 0;
              });

              assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

              // Check that the records have been removed from store.
              var builder2 = new _builder.default(store, modelName).where('name', _filterOperator.default.Eq, uuid).count();
              var timeout = 500;
              Ember.run.later(function () {
                store.query(modelName, builder2.build()).then(function (result) {
                  assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
                  done2();
                }).finally(function () {
                  newRecord.destroyRecord();
                });
              }, timeout);
            });
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data/query/builder', 'ember-flexberry-data/query/filter-operator', '@ember/test-helpers'], function (_executeFolvTest, _generateUniqueId, _builder, _filterOperator, _testHelpers) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check delete before record with promise test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _generateUniqueId.default)();

    // Add records for deliting.
    Ember.run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _executeFolvTest.addDataForDestroy)(newRecord);
        var builder = new _builder.default(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = Ember.$(olvContainerClass);
            var $rows = function $rows() {
              return Ember.$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            /* eslint-disable no-unused-vars */
            var clickPromises = [];
            $rows().forEach(function (element, i, arr) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element)[0];
                clickPromises.push((0, _testHelpers.click)($deleteBtnInRow));
              }
            });
            /* eslint-enable no-unused-vars */

            Promise.all(clickPromises).then(function () {
              var done2 = assert.async();

              // Check that the records wasn't remove in beforeDeleteRecord.
              var controller = app.__container__.lookup('controller:' + currentRouteName());
              assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

              // Check that the records haven't been removed.
              var recordsIsDeleteBtnInRow = $rows().every(function (element) {
                var nameRecord = Ember.$.trim(element.children[1].innerText);
                return nameRecord.indexOf(uuid) < 0;
              });

              assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

              // Check that the records haven't been removed into store.
              var builder2 = new _builder.default(store, modelName).where('name', _filterOperator.default.Eq, uuid).count();
              var timeout = 500;
              Ember.run.later(function () {
                store.query(modelName, builder2.build()).then(function (result) {
                  assert.notOk(result.meta.count, 'record \'' + uuid + '\'not found in store');
                  done2();
                });
              }, timeout);
            });
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-button-in-row-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', '@ember/test-helpers', 'ember-flexberry-data/query/filter-operator', 'ember-flexberry-data/query/builder'], function (_executeFolvTest, _generateUniqueId, _testHelpers, _filterOperator, _builder) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeFolvTest.executeTest)('check delete button in row', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _generateUniqueId.default)();

    // Add records for deliting.
    Ember.run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _executeFolvTest.addDataForDestroy)(newRecord);
        var builder = new _builder.default(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = Ember.$(olvContainerClass);
            var $rows = function $rows() {
              return Ember.$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting, howAddRec, howAddRec + ' record added');

            /* eslint-disable no-unused-vars */
            var clickPromises = [];
            $rows().forEach(function (element, i, arr) {
              var nameRecord = Ember.$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element)[0];
                Ember.run(function () {
                  clickPromises.push((0, _testHelpers.click)($deleteBtnInRow));
                });
              }
            });
            /* eslint-enable no-unused-vars */

            Promise.all(clickPromises).then(function () {
              var done2 = assert.async();

              // Check that the records have been removed.
              var recordsIsDeleteBtnInRow = $rows().every(function (element) {
                var nameRecord = Ember.$.trim(element.children[1].innerText);
                return nameRecord.indexOf(uuid) < 0;
              });

              assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

              // Check that the records have been removed into store.
              var builder2 = new _builder.default(store, modelName).where('name', _filterOperator.default.Eq, uuid).count();
              var timeout = 500;
              Ember.run.later(function () {
                store.query(modelName, builder2.build()).then(function (result) {
                  assert.notOk(result.meta.count, 'record \'' + uuid + '\'not found in store');
                  done2();
                });
              }, timeout);
            });
          });
          done();
        });
        done1();
      });
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-button-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data/query/filter-operator', 'ember-flexberry-data/query/builder'], function (_executeFolvTest, _folvTestsFunctions, _generateUniqueId, _filterOperator, _builder) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeFolvTest.executeTest)('check delete using button on toolbar', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';

    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 2;
    var uuid = '0' + (0, _generateUniqueId.default)();

    // Add records for deliting.
    Ember.run(function () {
      var newRecords = Ember.A();

      for (var i = 0; i < howAddRec; i++) {
        newRecords.pushObject(store.createRecord('ember-flexberry-dummy-suggestion-type', { name: uuid }));
      }

      var done2 = assert.async();
      var promises = Ember.A();
      newRecords.forEach(function (item) {
        promises.push(item.save());
      });

      (0, _executeFolvTest.addDataForDestroy)(newRecords);

      Ember.RSVP.Promise.all(promises).then(function (resolvedPromises) {
        assert.ok(resolvedPromises, 'All records saved.');

        var builder = new _builder.default(store).from(modelName).count();
        var done1 = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);
            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = Ember.$(olvContainerClass);
            var $rows = function $rows() {
              return Ember.$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, current) {
              var nameRecord = Ember.$.trim(current.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting, howAddRec, howAddRec + ' records added');

            var checkRecords = function checkRecords() {
              promises.clear();
              $rows().forEach(function (row) {
                var nameRecord = Ember.$.trim(row.children[1].innerText);
                var $firstCell = Ember.$('.object-list-view-helper-column-cell', row);
                var checkboxInRow = Ember.$('.flexberry-checkbox', $firstCell)[0];
                if (nameRecord.indexOf(uuid) >= 0) {
                  promises.pushObject(click(checkboxInRow));
                }
              });

              return Ember.RSVP.Promise.all(promises);
            };

            checkRecords().then(function () {
              var $toolBar = Ember.$('.ui.secondary.menu')[0];
              var $deleteButton = $toolBar.children[2];
              var done = assert.async();

              // Delete the marked records.
              /* eslint-disable no-unused-vars */
              (0, _folvTestsFunctions.loadingList)($deleteButton, olvContainerClass, trTableClass).then(function ($list) {
                var recordsIsDelete = $rows().every(function (element) {
                  var nameRecord = Ember.$.trim(element.children[1].innerText);
                  return nameRecord.indexOf(uuid) < 0;
                });

                assert.ok(recordsIsDelete, 'Each entry begins with \'' + uuid + '\' is delete with button in toolbar button');

                // Check that the records have been removed into store.
                var builder2 = new _builder.default(store).from(modelName).where('name', _filterOperator.default.Eq, uuid).count();
                var done3 = assert.async();
                store.query(modelName, builder2.build()).then(function (result) {
                  assert.notOk(result.meta.count, 'records \'' + uuid + '\'not found in store');
                  done3();
                });
                done();
              });
              /* eslint-enable no-unused-vars */
            });
          });
          done1();
        });
        done2();
      });
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-edit-button-in-row-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _folvTestsFunctions) {
  'use strict';

  // Need to add sort by multiple columns.
  /* eslint-disable no-unused-vars */
  (0, _executeFolvTest.executeTest)('check edit button in row', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    visit(path);
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);

      var $editButtonInRow = Ember.$('.object-list-view-row-edit-button');

      assert.equal($editButtonInRow.length, 5, 'All row have editButton');

      // Apply filter function.
      var openEditFormFunction = function openEditFormFunction() {
        var editButtonInRow = Ember.$('.object-list-view-row-edit-button')[0];
        editButtonInRow.click();
      };

      // Open editform.
      var done1 = assert.async();
      (0, _folvTestsFunctions.openEditFormByFunction)(openEditFormFunction).then(function () {
        assert.ok(true, 'edit form open');
        done1();
      });
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-from-edit-form-with-queryparams-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _folvTestsFunctions) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check return from editForm with queryParam', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list?perPage=5';
    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());

      // Open editFirn function.
      var openEditFormFunction = function openEditFormFunction() {
        var editButtonInRow = Ember.$('.object-list-view-row-edit-button')[0];
        editButtonInRow.click();
      };

      // Return to listform  function.
      var returnToListFormFunction = function returnToListFormFunction() {
        var returnToListFormButton = Ember.$('.return-to-list-form')[0];
        returnToListFormButton.click();
      };

      // Open editform.
      var done = assert.async();
      (0, _folvTestsFunctions.openEditFormByFunction)(openEditFormFunction).then(function () {
        assert.ok(true, 'edit form open');

        (0, _folvTestsFunctions.refreshListByFunction)(returnToListFormFunction, controller).then(function () {
          assert.equal(controller.model.content.length, 1, 'QueryParams applied successfully');
          done();
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-getCellComponent-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/en/translations'], function (_executeFolvTest, _folvTestsFunctions, _translations) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check getCellComponent', function (store, assert, app) {
    assert.expect(7);
    var path = 'components-acceptance-tests/flexberry-objectlistview/date-format';
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      // Set 'en' as current locale.
      (0, _folvTestsFunctions.loadingLocales)('en', app).then(function () {

        var olvContainerClass = '.object-list-view-container';

        var controller = app.__container__.lookup('controller:' + currentRouteName());

        var $folvContainer = Ember.$('.object-list-view-container');
        var $table = Ember.$('table.object-list-view', $folvContainer);

        var $headRow = Ember.$('thead tr', $table)[0].children;

        var indexDate = function indexDate() {
          var toReturn = void 0;
          /* eslint-disable no-unused-vars */
          Object.keys($headRow).forEach(function (element, index, array) {
            if (Ember.$.trim($headRow[element].innerText) === 'Date') {
              toReturn = index;
              return false;
            }
          });
          /* eslint-enable no-unused-vars */
          return toReturn;
        };

        var $dateCell = function $dateCell() {
          return Ember.$.trim(Ember.$('tbody tr', $table)[0].children[indexDate()].innerText);
        };

        var myRe = /[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])/;

        // Date format most be YYYY-MM-DD.
        var myArray = myRe.exec($dateCell());

        var result = myArray ? myArray[0] : null;
        assert.ok(result, 'date format is \'YYYY-MM-DD\' ');

        controller.set('dateFormat', '2');
        var $toolBar = Ember.$('.ui.secondary.menu')[0];
        var $toolBarButtons = $toolBar.children;
        var $refreshButton = $toolBarButtons[0];
        assert.equal($refreshButton.innerText.trim(), Ember.get(_translations.default, 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');

        var timeout = 500;
        Ember.run.later(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = Ember.$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var done = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var $list = Ember.$(olvContainerClass);
            assert.ok($list, 'list loaded');

            /* eslint-disable no-useless-escape */
            // Date format most be DD.MM.YYYY, hh:mm:ss.
            var reDateTime = /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d\, ([0-1]\d|2[0-3])(:[0-5]\d){2}$/;
            var arrayDateTime = reDateTime.exec($dateCell());
            /* eslint-enable no-useless-escape */

            var resultDateTime = arrayDateTime ? arrayDateTime[0] : null;
            assert.ok(resultDateTime, 'date format is \'DD.MM.YYYY, hh:mm:ss\' ');
            controller.set('dateFormat', '3');

            var done2 = assert.async();
            Ember.run.later(function () {
              var done1 = assert.async();
              (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                var $list = Ember.$(olvContainerClass);
                assert.ok($list, 'list loaded');

                /* eslint-disable no-useless-escape */
                // Date format most be II (example Sep 4 1986).
                var reDateString = /[a-zA-Z]{3} ([1-9]|[12][0-9]|3[01])\, (19|20)\d\d/;
                var arrayDateString = reDateString.exec($dateCell());
                /* eslint-enable no-useless-escape */

                var resultDateString = arrayDateString ? arrayDateString[0] : null;
                assert.ok(resultDateString, 'date format is \'ll\' ');
                done1();
              });
              done2();
            }, timeout);
            done();
          });
        }, timeout);
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-goto-editform-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _folvTestsFunctions) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check goto editform', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $folvContainer = Ember.$('.object-list-view-container');
      var $trTableBody = Ember.$('table.object-list-view tbody tr', $folvContainer);
      var $cell = $trTableBody[0].children[1];

      assert.equal(currentPath(), path, 'edit form not open');

      var timeout = 500;
      Ember.run.later(function () {
        assert.equal(currentPath(), path, 'edit form not open');
        controller.set('rowClickable', true);
        Ember.run.later(function () {
          var asyncOperationsCompleted = assert.async();
          (0, _folvTestsFunctions.loadingList)($cell, 'form.flexberry-vertical-form', '.field').then(function ($editForm) {
            assert.ok($editForm, 'edit form open');
            assert.equal(currentPath(), 'ember-flexberry-dummy-suggestion-edit', 'edit form path');
          }).catch(function (reason) {
            // Error output.
            assert.ok(false, reason);
          }).finally(function () {
            asyncOperationsCompleted();
          });
        }, timeout);
      }, timeout);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-limit-function-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/query/builder', 'ember-flexberry-data/query/filter-operator'], function (_executeFolvTest, _folvTestsFunctions, _builder, _filterOperator) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check limit function', function (store, assert, app) {
    assert.expect(6);
    var path = 'components-examples/flexberry-objectlistview/limit-function-example?perPage=500';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var result1 = void 0;
    var result2 = void 0;
    var count = void 0;

    visit(path);
    andThen(function () {
      var builder1 = new _builder.default(store).from(modelName).selectByProjection('SuggestionL');
      store.query(modelName, builder1.build()).then(function (result) {
        var arr = result.toArray();
        count = arr.length;
      }).then(function () {
        var builder2 = new _builder.default(store).from(modelName).selectByProjection('SuggestionL').where('address', _filterOperator.default.Neq, '');
        store.query(modelName, builder2.build()).then(function (result) {
          var arr = result.toArray();
          result1 = arr.objectAt(0).get('address');
          result2 = arr.objectAt(1).get('address');

          if (!result1 && !result2) {
            assert.ok(false, 'Laad empty data');
          }
        }).then(function () {
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          controller.set('limitFunction', result1);

          var refreshFunction = function refreshFunction() {
            var refreshButton = Ember.$('.refresh-button')[0];
            refreshButton.click();
          };

          assert.equal(controller.model.content.length, count, 'Folv load with current object count');

          /* eslint-disable no-unused-vars */
          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
            var resultText = Ember.$('.oveflow-text')[0];
            assert.notEqual(controller.model.content.length, count, 'Folv load with object current count');
            assert.equal(resultText.innerText, result1, 'Correct result afther apply limitFunction');

            controller.set('limitFunction', result2);

            var done2 = assert.async();
            (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
              var resultText = Ember.$('.oveflow-text')[0];
              assert.notEqual(controller.model.content.length, count, 'Folv load with current object count');
              assert.equal(resultText.innerText, result2, 'Correct result afther apply limitFunction');

              controller.set('limitFunction', undefined);

              var done3 = assert.async();
              (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
                assert.equal(controller.model.content.length, count, 'Folv load with current object count');
                done3();
              });
              done2();
            });
            done1();
          });
          /* eslint-enable no-unused-vars */
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-locales-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations'], function (_executeFolvTest, _folvTestsFunctions, _translations, _translations2) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check locale change', function (store, assert, app) {
    assert.expect(11);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      function toolbarBtnTextAssert(currentLocale) {
        assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
        assert.equal($toolBarButtons[0].innerText.trim(), Ember.get(currentLocale, 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');
        assert.equal($toolBarButtons[1].innerText.trim(), Ember.get(currentLocale, 'components.olv-toolbar.add-button-text'), 'button create exist');
        assert.equal($toolBarButtons[2].innerText.trim(), Ember.get(currentLocale, 'components.olv-toolbar.delete-button-text'), 'button delete exist');
        assert.equal(Ember.$($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');
      }

      var $toolBar = Ember.$('.ui.secondary.menu')[0];
      var $toolBarButtons = $toolBar.children;

      // Set 'ru' as current locale.
      (0, _folvTestsFunctions.loadingLocales)('ru', app).then(function () {
        toolbarBtnTextAssert(_translations.default);
        (0, _folvTestsFunctions.loadingLocales)('en', app).then(function () {
          toolbarBtnTextAssert(_translations2.default);
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-open-newform-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (_executeFolvTest) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check goto new form', function (store, assert, app) {
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var newFormRoute = controller.get('editFormRoute') + '.new';
      goToNewForm('[data-test-olv]', null, assert, newFormRoute);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-paging-dropdown-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/utils/generate-unique-id'], function (_executeFolvTest, _folvTestsFunctions, _generateUniqueId) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check paging dropdown', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var uuid = (0, _generateUniqueId.default)();

    // Add records for paging.
    Ember.run(function () {

      (0, _folvTestsFunctions.addRecords)(store, modelName, uuid).then(function (resolvedPromises) {
        assert.ok(resolvedPromises, 'All records saved.');

        visit(path);
        andThen(function () {
          assert.equal(currentPath(), path);

          var $choosedIthem = void 0;
          var trTableBody = void 0;
          var activeItem = void 0;

          // Refresh function.
          var refreshFunction = function refreshFunction() {
            var $folvPerPageButton = Ember.$('.flexberry-dropdown.compact');
            var $menu = Ember.$('.menu', $folvPerPageButton);
            trTableBody = function trTableBody() {
              return Ember.$(Ember.$('table.object-list-view tbody tr')).length.toString();
            };

            activeItem = function activeItem() {
              return Ember.$(Ember.$('.item.active.selected', $menu)).text();
            };

            // The list should be more than 5 items.
            assert.equal(activeItem(), trTableBody(), 'equal perPage and visible element count');
            $folvPerPageButton.click();
            var timeout = 500;
            Ember.run.later(function () {
              var menuIsVisible = $menu.hasClass('visible');
              assert.strictEqual(menuIsVisible, true, 'menu is visible');
              $choosedIthem = Ember.$('.item', $menu);
              $choosedIthem[1].click();
            }, timeout);
          };

          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            // The list should be more than 10 items
            assert.equal(activeItem(), trTableBody(), 'equal perPage and visible element count');
          }).catch(function (reason) {
            // Error output.
            assert.ok(false, reason);
          }).finally(function () {
            (0, _folvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
            done();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-paging-navigation-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/utils/generate-unique-id'], function (_executeFolvTest, _folvTestsFunctions, _generateUniqueId) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check paging nav', function (store, assert, app) {
    assert.expect(29);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var uuid = (0, _generateUniqueId.default)();
    var last = void 0;

    // Add records for paging.
    Ember.run(function () {
      (0, _folvTestsFunctions.addRecords)(store, modelName, uuid).then(function (resolvedPromises) {
        assert.ok(resolvedPromises, 'All records saved.');
        var done = assert.async();
        visit(path + '?perPage=1');
        andThen(function () {
          assert.equal(currentPath(), path);
          var controller = app.__container__.lookup('controller:' + currentRouteName());

          // check paging.
          var $basicButtons = Ember.$('.ui.button', '.ui.basic.buttons');
          last = controller.get('model.meta.count');

          assert.equal(Ember.$($basicButtons[0]).hasClass('disabled'), true, 'button prev is disabled');
          assert.equal(Ember.$($basicButtons[1]).hasClass('active'), true, 'page 1 is active');
          assert.equal(Ember.$($basicButtons[1])[0].innerText, 1, '1st page is depicted');
          assert.equal(Ember.$($basicButtons[2])[0].innerText, 2, '2nd page is depicted');
          assert.equal(Ember.$($basicButtons[3])[0].innerText, 3, '3rd page is depicted');
          assert.equal(Ember.$($basicButtons[4])[0].innerText, 4, '4th page is depicted');
          assert.equal(Ember.$($basicButtons[5])[0].innerText, '...', '... page is depicted');
          assert.equal(Ember.$($basicButtons[6])[0].innerText, last, 'last page is depicted');

          var done1 = assert.async();
          var refreshFunction = function refreshFunction() {
            var refreshButton = $basicButtons[4];
            refreshButton.click();
          };

          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var $basicButtons = Ember.$('.ui.button', '.ui.basic.buttons');
            assert.equal(Ember.$($basicButtons[1]).hasClass('active'), false, 'page 1 is not active');
            assert.equal(Ember.$($basicButtons[4]).hasClass('active'), true, 'page 4 is active');
            assert.equal(Ember.$($basicButtons[1])[0].innerText, 1, '1st page is depicted');
            assert.equal(Ember.$($basicButtons[2])[0].innerText, '...', '... page is depicted');
            assert.equal(Ember.$($basicButtons[3])[0].innerText, 3, '3rd page is depicted');
            assert.equal(Ember.$($basicButtons[4])[0].innerText, 4, '4th page is depicted');
            assert.equal(Ember.$($basicButtons[5])[0].innerText, 5, '5th page is depicted');
            assert.equal(Ember.$($basicButtons[6])[0].innerText, '...', '... page is depicted');
            assert.equal(Ember.$($basicButtons[7])[0].innerText, last, 'last page is depicted');

            var done2 = assert.async();
            var refreshFunction = function refreshFunction() {
              var refreshButton = $basicButtons[7];
              refreshButton.click();
            };

            (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              var $basicButtons = Ember.$('.ui.button', '.ui.basic.buttons');
              assert.equal(Ember.$($basicButtons[4]).hasClass('active'), false, 'page 4 is not active');
              assert.equal(Ember.$($basicButtons[6]).hasClass('active'), true, 'last page is active');
              assert.equal(Ember.$($basicButtons[7]).hasClass('disabled'), true, 'button next is disabled');
              assert.equal(Ember.$($basicButtons[6])[0].innerText, last, 'last page is depicted');
              assert.equal(Ember.$($basicButtons[1])[0].innerText, 1, '1st page is depicted');
              assert.equal(Ember.$($basicButtons[2])[0].innerText, '...', '... page is depicted');
              assert.equal(Ember.$($basicButtons[3])[0].innerText, last - 3, 'n-3 page is depicted');
              assert.equal(Ember.$($basicButtons[4])[0].innerText, last - 2, 'n-2 page is depicted');
              assert.equal(Ember.$($basicButtons[5])[0].innerText, last - 1, 'n-1 page is depicted');
              assert.equal(Ember.$($basicButtons[6])[0].innerText, last, 'last page is depicted');
            }).catch(function (reason) {
              throw new Error(reason);
            }).finally(function () {
              (0, _folvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
              done2();
              done();
            });
          }).catch(function (reason) {
            throw new Error(reason);
          }).finally(function () {
            (0, _folvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
            done1();
          });
        });
      });
    });
  });
});
// import { executeTest} from './execute-folv-test';
// import Builder from 'ember-flexberry-data/query/builder';
// import $ from 'jquery';

// executeTest('check configurate selected rows', (store, assert, app) => {
//   assert.expect(8);
//   let path = 'components-examples/flexberry-objectlistview/selected-rows';
//   let modelName = 'ember-flexberry-dummy-suggestion-type';
//   let count;

//   visit(path);
//   andThen(() => {
//     assert.equal(currentPath(), path);

//     let builder = new Builder(store).from(modelName);
//     store.query(modelName, builder.build()).then((result) => {
//       let arr = result.toArray();
//       count = arr.length;
//     }).then(function() {
//       let $folvContainer = $('.object-list-view-container');
//       let $checkAllButtton = $('.check-all-button', $folvContainer).first();
//       let $checkAllAtPageButton = $('.check-all-at-page-button', $folvContainer).first();
//       let $row = $('table.object-list-view tbody tr', $folvContainer);
//       let controller = app.__container__.lookup('controller:' + currentRouteName());

//       let $firstCell = $('.flexberry-checkbox', $row[0]);
//       let $secondCell = $('.flexberry-checkbox', $row[1]);

//       // Сheck first record.
//       $firstCell.click();
//       assert.equal(controller.countSelectedRows, 1, 'First row is checked');

//       // Сheck second record.
//       $secondCell.click();
//       assert.equal(controller.countSelectedRows, 2, 'Second row is checked');

//       // Uncheck second record.
//       $firstCell.click();
//       assert.equal(controller.countSelectedRows, 1, 'First row is checked');

//       // Сheck all record at page.
//       $checkAllAtPageButton.click();
//       assert.equal(controller.countSelectedRows, 5, 'First row is checked');

//       // Uncheck all record at page.
//       $checkAllAtPageButton.click();
//       assert.equal(controller.countSelectedRows, 0, 'First row is checked');

//       // Сheck fist reccord and all record.
//       $firstCell.click();
//       $checkAllButtton.click();
//       assert.equal(controller.countSelectedRows, count, 'First row is checked');

//       // Uncheck all record.
//       $checkAllButtton.click();
//       assert.equal(controller.countSelectedRows, 0, 'First row is checked');
//     });
//   });
// });
define("dummy/tests/acceptance/components/flexberry-objectlistview/folv-select-record-test", [], function () {
  "use strict";
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-by-computable-field-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/query/builder'], function (_executeFolvTest, _folvTestsFunctions, _builder) {
  'use strict';

  // Need to add sort by multiple columns.
  (0, _executeFolvTest.executeTest)('check sorting by computable field', function (store, assert, app) {
    assert.expect(6);
    var path = 'components-acceptance-tests/flexberry-objectlistview/computable-field';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var minValue = void 0;
    var maxValue = void 0;

    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder = new _builder.default(store).from(modelName).selectByProjection('SuggestionL').orderBy('commentsCount');
      store.query(modelName, builder.build()).then(function (result) {
        var arr = result.toArray();
        minValue = arr.objectAt(0).get('commentsCount');
        maxValue = arr.objectAt(arr.length - 1).get('commentsCount');
      }).then(function () {

        var $olv = Ember.$('.object-list-view ');
        var $thead = Ember.$('th.dt-head-left', $olv)[9];
        var controller = app.__container__.lookup('controller:' + currentRouteName());

        // Refresh function.
        var refreshFunction = function refreshFunction() {
          $thead.click();
        };

        var done1 = assert.async();
        (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
          var $cellText = Ember.$('div.oveflow-text')[9];
          assert.equal(controller.sort, '+commentsCount', 'sorting symbol added');
          assert.equal($cellText.innerText, minValue, 'sorting symbol added');
          var done2 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var $cellText = Ember.$('div.oveflow-text')[9];
            assert.equal(controller.sort, '-commentsCount', 'sorting symbol added');
            assert.equal($cellText.innerText, maxValue, 'sorting symbol added');
            var done3 = assert.async();
            (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              assert.equal(controller.sort, null, 'sorting is reset');
              done3();
            });
            done2();
          });
          done1();
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-clear-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations'], function (_executeFolvTest, _folvTestsFunctions, _translations) {
  'use strict';

  // Need to add sort by multiple columns.
  (0, _executeFolvTest.executeTest)('check sorting clear', function (store, assert, app) {
    assert.expect(8);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var projectionName = Ember.get(controller, 'modelProjection');

      var orderByClause = null;

      var $olv = Ember.$('.object-list-view ');
      var $thead = Ember.$('th.dt-head-left', $olv)[0];

      var currentSorting = controller.get('computedSorting');
      if (!Ember.$.isEmptyObject(currentSorting)) {
        orderByClause = (0, _folvTestsFunctions.getOrderByClause)(currentSorting);
      }

      Ember.run(function () {
        var done = assert.async();

        // Check sortihg in the first column. Sorting is not append.
        (0, _folvTestsFunctions.loadingLocales)('ru', app).then(function () {
          (0, _folvTestsFunctions.checkSortingList)(store, projectionName, $olv, orderByClause).then(function (isTrue) {
            assert.ok(isTrue, 'sorting is not applied');

            // Check sortihg icon in the first column. Sorting icon is not added.
            assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');

            // Refresh function.
            var refreshFunction = function refreshFunction() {
              $thead.click();
            };

            var done1 = assert.async();
            (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              var $thead = Ember.$('th.dt-head-left', $olv)[0];
              var $ord = Ember.$('.object-list-view-order-icon', $thead);
              var $divOrd = Ember.$('div', $ord);

              assert.equal($divOrd.attr('title'), Ember.get(_translations.default, 'components.object-list-view.sort-ascending'), 'title is Order ascending');
              assert.equal(Ember.$('.icon', $divOrd).hasClass('ascending'), true, 'sorting symbol added');

              var done2 = assert.async();
              (0, _folvTestsFunctions.checkSortingList)(store, projectionName, $olv, 'address asc').then(function (isTrue) {
                assert.ok(isTrue, 'sorting applied');

                var done3 = assert.async();
                var refreshFunction2 = function refreshFunction2() {
                  var $clearButton = Ember.$('.clear-sorting-button');
                  $clearButton.click();
                };

                (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction2, controller).then(function () {
                  var $thead = Ember.$('th.dt-head-left', $olv)[0];
                  var $ord = Ember.$('.object-list-view-order-icon', $thead);
                  var $divOrd = Ember.$('div', $ord);

                  assert.equal($divOrd.attr('title'), undefined, 'sorting are clear');
                  assert.equal(Ember.$.trim($divOrd.text()), '', 'sorting symbol delete');

                  done3();
                });
                done2();
              });
              done1();
            });
            done();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations'], function (_executeFolvTest, _folvTestsFunctions, _translations) {
  'use strict';

  // Need to add sort by multiple columns.
  (0, _executeFolvTest.executeTest)('check sorting', function (store, assert, app) {
    assert.expect(14);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var projectionName = Ember.get(controller, 'modelProjection');

      var orderByClause = null;

      var $olv = Ember.$('.object-list-view ');
      var $thead = Ember.$('th.dt-head-left', $olv)[0];

      var currentSorting = controller.get('computedSorting');
      if (!Ember.$.isEmptyObject(currentSorting)) {
        orderByClause = (0, _folvTestsFunctions.getOrderByClause)(currentSorting);
      }

      Ember.run(function () {
        var done = assert.async();

        // Check sortihg in the first column. Sorting is not append.
        (0, _folvTestsFunctions.loadingLocales)('ru', app).then(function () {
          (0, _folvTestsFunctions.checkSortingList)(store, projectionName, $olv, orderByClause).then(function (isTrue) {
            assert.ok(isTrue, 'sorting is not applied');

            // Check sortihg icon in the first column. Sorting icon is not added.
            assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');
            assert.equal(controller.sort, undefined, 'no sorting in URL');

            // Refresh function.
            var refreshFunction = function refreshFunction() {
              $thead.click();
            };

            var done1 = assert.async();
            (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              var $thead = Ember.$('th.dt-head-left', $olv)[0];
              var $ord = Ember.$('.object-list-view-order-icon', $thead);
              var $divOrd = Ember.$('div', $ord);

              assert.equal($divOrd.attr('title'), Ember.get(_translations.default, 'components.object-list-view.sort-ascending'), 'title is Order ascending');
              assert.equal(Ember.$('.icon', $divOrd).hasClass("ascending"), true, 'sorting symbol added');
              assert.equal(controller.sort, '+address', 'up sorting in URL');

              var done2 = assert.async();
              (0, _folvTestsFunctions.checkSortingList)(store, projectionName, $olv, 'address asc').then(function (isTrue) {
                assert.ok(isTrue, 'sorting applied');
                var done3 = assert.async();
                (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                  var $thead = Ember.$('th.dt-head-left', $olv)[0];
                  var $ord = Ember.$('.object-list-view-order-icon', $thead);
                  var $divOrd = Ember.$('div', $ord);

                  assert.equal($divOrd.attr('title'), Ember.get(_translations.default, 'components.object-list-view.sort-descending'), 'title is Order descending');
                  assert.equal(Ember.$('.icon', $divOrd).hasClass("descending"), true, 'sorting symbol added');
                  assert.equal(controller.sort, '-address', 'down sorting in URL');

                  var done4 = assert.async();
                  (0, _folvTestsFunctions.checkSortingList)(store, projectionName, $olv, 'address desc').then(function (isTrue) {
                    assert.ok(isTrue, 'sorting applied');

                    var done5 = assert.async();
                    (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                      assert.equal(controller.sort, null, 'no sorting in URL');
                      var done6 = assert.async();
                      (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                        assert.equal(controller.sort, '+address', 'up sorting in URL');
                        done6();
                      });
                      done5();
                    });
                    done4();
                  });
                }).finally(function () {
                  done3();
                });
                done2();
              });
              done1();
            });
            done();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-with-default-setting-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations'], function (_executeFolvTest, _folvTestsFunctions, _translations) {
  'use strict';

  // Need to add sort by multiple columns.
  (0, _executeFolvTest.executeTest)('check sorting with default setting', function (store, assert, app) {
    assert.expect(9);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);
      var controller = app.__container__.lookup('controller:' + currentRouteName());

      var $olv = Ember.$('.object-list-view ');

      Ember.run(function () {
        (0, _folvTestsFunctions.loadingLocales)('ru', app).then(function () {
          // Refresh function.
          var refreshFunction = function refreshFunction() {
            $thead.click();
          };

          var $thead = Ember.$('th.dt-head-left', $olv)[0];
          var $ord = Ember.$('.object-list-view-order-icon', $thead);
          var $divOrd = Ember.$('div', $ord);

          assert.equal($divOrd.attr('title'), Ember.get(_translations.default, 'components.object-list-view.sort-ascending'), 'title is Order ascending');
          assert.equal(Ember.$('.icon', $divOrd).hasClass('ascending'), true, 'sorting symbol added');
          assert.equal(controller.sort, '+name', 'up sorting in URL');

          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var $thead = Ember.$('th.dt-head-left', $olv)[0];
            var $ord = Ember.$('.object-list-view-order-icon', $thead);
            var $divOrd = Ember.$('div', $ord);

            assert.equal($divOrd.attr('title'), Ember.get(_translations.default, 'components.object-list-view.sort-descending'), 'title is Order descending');
            assert.equal(Ember.$('.icon', $divOrd).hasClass('descending'), true, 'sorting symbol changed');
            assert.equal(controller.sort, '-name', 'down sorting in URL');

            var done2 = assert.async();
            (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              assert.equal(controller.sort, null, 'no sorting in URL');
              var done3 = assert.async();
              (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                assert.equal(controller.sort, '+name', 'up sorting in URL');
                done3();
              });
              done2();
            });
          }).finally(function () {
            done1();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', ['exports', 'ember-flexberry-data/query/filter-operator', 'ember-flexberry-data/query/builder'], function (exports, _filterOperator, _builder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.loadingList = loadingList;
  exports.openEditFormByFunction = openEditFormByFunction;
  exports.refreshListByFunction = refreshListByFunction;
  exports.checkSortingList = checkSortingList;
  exports.addRecords = addRecords;
  exports.deleteRecords = deleteRecords;
  exports.loadingLocales = loadingLocales;
  exports.filterObjectListView = filterObjectListView;
  exports.filterCollumn = filterCollumn;
  exports.getOrderByClause = getOrderByClause;


  // Function for waiting list loading.
  function loadingList($ctrlForClick, list, records) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = void 0;
      var checkIntervalSucceed = false;
      var checkInterval = 500;
      var timeout = 10000;

      Ember.run(function () {
        $ctrlForClick.click();
      });

      Ember.run(function () {
        checkIntervalId = window.setInterval(function () {
          var $list = Ember.$(list);
          var $records = Ember.$(records, $list);
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
      Ember.run(function () {
        window.setTimeout(function () {
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
  function openEditFormByFunction(openEditFormFunction) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = void 0;
      var checkIntervalSucceed = false;
      var checkInterval = 500;
      var timeout = 10000;

      openEditFormFunction();

      Ember.run(function () {
        checkIntervalId = window.setInterval(function () {
          if (Ember.$('.ui.button.close-button').length === 0) {

            // Edit form isn't loaded yet.
            return;
          }

          // Edit form is loaded, wait to render.
          // Stop interval & resolve promise.
          window.setTimeout(function () {
            window.clearInterval(checkIntervalId);
            checkIntervalSucceed = true;
            resolve();
          });
        }, checkInterval);
      });

      // Set wait timeout.
      Ember.run(function () {
        window.setTimeout(function () {
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
  function refreshListByFunction(refreshFunction, controller) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = void 0;
      var checkIntervalSucceed = false;
      var checkInterval = 500;
      var renderInterval = 100;
      var timeout = 10000;
      var timeiutForLongTimeLoad = checkInterval + 500;

      var $lastLoadCount = controller.loadCount;
      refreshFunction();

      Ember.run(function () {
        checkIntervalId = window.setInterval(function () {
          var loadCount = controller.loadCount;
          if (loadCount === $lastLoadCount) {

            // Data isn't loaded yet.
            return;
          }

          // Data is loaded, wait to render.
          // Stop interval & resolve promise.
          window.setTimeout(function () {
            window.clearInterval(checkIntervalId);
            checkIntervalSucceed = true;
            resolve();
          }, renderInterval);
        }, checkInterval);
      });

      // Set wait timeout.
      Ember.run(function () {
        window.setTimeout(function () {
          // Timeout for with a long load, setInterval executed first.
          window.setTimeout(function () {
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
  function checkSortingList(store, projection, $olv, ordr) {
    return new Ember.RSVP.Promise(function (resolve) {
      Ember.run(function () {
        var modelName = projection.modelName;
        var builder = new _builder.default(store).from(modelName).selectByProjection(projection.projectionName).skip(0);
        builder = !ordr ? builder : builder.orderBy(ordr);
        store.query(modelName, builder.build()).then(function (records) {
          var recordsArr = records.toArray();
          var $tr = Ember.$('table.object-list-view tbody tr').toArray();

          var isTrue = $tr.reduce(function (sum, current, i) {
            var expectVal = !recordsArr[i].get('address') ? '' : recordsArr[i].get('address');
            return sum && Ember.$.trim(current.children[1].innerText) === expectVal;
          }, true);

          resolve(isTrue);
        });
      });
    });
  }

  // Function for addition records.
  function addRecords(store, modelName, uuid) {
    var promises = Ember.A();
    var listCount = 55;
    Ember.run(function () {

      var builder = new _builder.default(store).from(modelName).count();
      store.query(modelName, builder.build()).then(function (result) {
        var howAddRec = listCount - result.meta.count;
        var newRecords = Ember.A();

        for (var i = 0; i < howAddRec; i++) {
          newRecords.pushObject(store.createRecord(modelName, { name: uuid }));
        }

        newRecords.forEach(function (item) {
          promises.push(item.save());
        });
      });
    });
    return Ember.RSVP.Promise.all(promises);
  }

  // Function for deleting records.
  function deleteRecords(store, modelName, uuid) {
    var builder = new _builder.default(store, modelName).where('name', _filterOperator.default.Eq, uuid);
    return store.query(modelName, builder.build()).then(function (r) {
      return Ember.RSVP.all(r.map(function (i) {
        return i.destroyRecord();
      }));
    });
  }

  // Function for waiting loading list.
  function loadingLocales(locale, app) {
    return new Ember.RSVP.Promise(function (resolve) {
      var i18n = app.__container__.lookup('service:i18n');

      Ember.run(function () {
        i18n.set('locale', locale);
      });

      var timeout = 500;
      Ember.run.later(function () {
        resolve({ msg: 'ok' });
      }, timeout);
    });
  }

  // Function for filter object-list-view by list of operations and values.
  function filterObjectListView(objectListView, operations, filterValues) {
    var tableBody = objectListView.children('tbody');
    var tableRow = Ember.$(tableBody.children('tr'));
    var tableColumns = Ember.$(tableRow[0]).children('td');

    var promises = Ember.A();

    for (var i = 0; i < tableColumns.length; i++) {
      if (operations[i]) {
        promises.push(filterCollumn(objectListView, i, operations[i], filterValues[i]));
      }
    }

    return Ember.RSVP.Promise.all(promises);
  }

  // Function for filter object-list-view at one column by operations and values.
  function filterCollumn(objectListView, columnNumber, operation, filterValue) {
    return new Ember.RSVP.Promise(function (resolve) {
      var tableBody = objectListView.children('tbody');
      var tableRow = tableBody.children('tr');

      var filterOperation = Ember.$(tableRow[0]).find('.flexberry-dropdown')[columnNumber];
      var filterValueCell = Ember.$(tableRow[1]).children('td')[columnNumber];

      // Select an existing item.
      Ember.$(filterOperation).dropdown('set selected', operation);

      var dropdown = Ember.$(filterValueCell).find('.flexberry-dropdown');
      var textbox = Ember.$(filterValueCell).find('.ember-text-field');

      var fillPromise = void 0;
      if (textbox.length !== 0) {
        fillPromise = fillIn(textbox, filterValue);
      }

      if (dropdown.length !== 0) {
        dropdown.dropdown('set selected', filterValue);
      }

      if (fillPromise) {
        fillPromise.then(function () {
          return resolve();
        });
      } else {
        var timeout = 300;
        Ember.run.later(function () {
          resolve();
        }, timeout);
      }
    });
  }

  function getOrderByClause(currentSorting) {
    return Object.keys(currentSorting).map(function (key) {
      return { name: key, sortOrder: currentSorting[key].sortAscending ? 'asc' : 'desc', sortNumber: currentSorting[key].sortNumber };
    }).sort(function (obj1, obj2) {
      if (obj1.sortNumber < obj2.sortNumber) {
        return -1;
      }

      if (obj1.sortNumber > obj2.sortNumber) {
        return 1;
      }

      return 0;
    }).map(function (obj) {
      return obj.name + ' ' + obj.sortOrder;
    }).join(', ');
  }
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-user-button-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (_executeFolvTest) {
  'use strict';

  (0, _executeFolvTest.executeTest)('user button test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/toolbar-custom-buttons-example';

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());

      // Enable the hi button.
      click('.toggle-hi-button');

      // First click.
      click('.test-click-button');
      andThen(function () {
        return assert.equal(controller.clickCounter, 2, 'Test button was pressed');
      });

      // Second click.
      click('.test-click-button');
      andThen(function () {
        return assert.equal(controller.clickCounter, 3, 'Test button was pressed');
      });

      assert.notOk(controller.get('modelFromClickedRow'));
      click('.ui.button > .bug.icon:first');
      andThen(function () {
        assert.equal(controller.get('modelFromClickedRow.id'), controller.get('model.firstObject.id'));
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-wrapper-projection-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _folvTestsFunctions) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check wrapper and projection', function (store, assert, app) {
    assert.expect(6);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var projectionName = function projectionName() {
        return Ember.get(controller, 'modelProjection');
      };

      var $olv = Ember.$('.object-list-view ');
      var $folvContainer = Ember.$('.object-list-view-container');
      var $tableInFolvContainer = Ember.$('table', $folvContainer);
      assert.equal($tableInFolvContainer.length, 1, 'folv table in container exist');

      var $tableBody = Ember.$('tbody', '.object-list-view-container');
      assert.equal($tableBody.length, 1, 'tbody in table exist');

      var dtHeadTable = Ember.$('.dt-head-left.me.class', 'thead', $tableInFolvContainer);

      var orderByClause = null;

      var currentSorting = controller.get('computedSorting');
      if (!Ember.$.isEmptyObject(currentSorting)) {
        orderByClause = (0, _folvTestsFunctions.getOrderByClause)(currentSorting);
      }

      var done = assert.async();
      (0, _folvTestsFunctions.checkSortingList)(store, projectionName(), $olv, orderByClause).then(function (isTrue) {
        assert.ok(isTrue, 'records are displayed correctly');
        done();
      }).then(function () {
        (0, _folvTestsFunctions.loadingLocales)('en', app).then(function () {

          // Check projectionName.
          var attrs = projectionName().attributes;
          var flag = true;
          /* eslint-disable no-unused-vars */
          Object.keys(attrs).forEach(function (element, index, array) {
            if (attrs[element].kind !== 'hasMany') {
              flag = flag && Ember.$.trim(dtHeadTable[index].innerText) === attrs[element].caption;
            }
          });
          /* eslint-enable no-unused-vars */
          assert.ok(flag, 'projection = columns names');

          var newProjectionName = 'SettingLookupExampleView';
          controller.set('modelProjection', newProjectionName);

          // get(controller, 'modelProjection') returns only the name of the projection when it replaced.
          assert.equal(projectionName(), newProjectionName, 'projection name is changed');
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/readonly-test/edit-form-readonly-test', ['qunit', 'dummy/tests/helpers/start-app'], function (_qunit, _startApp) {
  'use strict';

  var app = void 0;
  var path = 'components-acceptance-tests/edit-form-readonly';

  (0, _qunit.module)('Acceptance | edit-form | readonly-mode ', {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },
    afterEach: function afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)('controller is render properly', function (assert) {
    assert.expect(3);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      assert.equal(currentPath(), path, 'Path for edit-form-readonly-test is correctly');
      assert.strictEqual(controller.get('readonly'), true, 'Controller\'s flag \'readonly\' is enabled');

      controller.set('readonly', false);
      assert.strictEqual(controller.get('readonly'), false, 'Controller\'s flag \'readonly\' is disabled');
    });
  });

  (0, _qunit.test)('flexbery-checkbox on readonly editform', function (assert) {
    assert.expect(4);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $checkbox = find('[data-test-checkbox]');
      assert.strictEqual($checkbox.hasClass('read-only'), true, 'Checkbox is readonly');

      var $checkboxFge = find('[data-test-groupedit] .flexberry-checkbox');
      assert.strictEqual($checkboxFge.hasClass('read-only'), true, 'Groupedit\'s checkbox is readonly');

      controller.set('readonly', false);
      Ember.run.scheduleOnce('afterRender', function () {
        assert.strictEqual($checkbox.hasClass('read-only'), false, 'Checkbox is not readonly');
        assert.strictEqual($checkboxFge.hasClass('read-only'), false, 'Groupedit\'s checkbox is not readonly');
      });
    });
  });

  (0, _qunit.test)('flexbery-textbox on readonly editform', function (assert) {
    assert.expect(4);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $textboxInput = find('[data-test-textbox] input');
      assert.strictEqual(Ember.$.trim($textboxInput.attr('readonly')), 'readonly', 'Textbox is readonly');

      var $textboxFgeInput = find('[data-test-groupedit] .flexberry-textbox input');
      assert.strictEqual(Ember.$.trim($textboxFgeInput.attr('readonly')), 'readonly', 'Groupedit\'s textbox is readonly');

      controller.set('readonly', false);
      Ember.run.scheduleOnce('afterRender', function () {
        assert.strictEqual($textboxInput.is('readonly'), false, 'Textbox is not readonly');
        assert.strictEqual($textboxFgeInput.is('readonly'), false, 'Groupedit\'s textbox is not readonly');
      });
    });
  });

  (0, _qunit.test)('flexberry-textarea on readonly editform', function (assert) {
    assert.expect(4);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $textareaInput = find('[data-test-textarea] textarea');
      assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), 'readonly', 'Textarea is readonly');

      var $textareaInputFGE = find('[data-test-groupedit] .flexberry-textarea textarea');
      assert.strictEqual(Ember.$.trim($textareaInputFGE.attr('readonly')), 'readonly', 'Groupedit\'s textarea is readonly');

      controller.set('readonly', false);
      Ember.run.scheduleOnce('afterRender', function () {
        assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), '', 'Textarea don\'t readonly');
        assert.strictEqual(Ember.$.trim($textareaInputFGE.attr('readonly')), '', 'Groupedit\'s textarea don\'t readonly');
      });
    });
  });

  (0, _qunit.test)('flexberry-simpledatetime on readonly editform', function (assert) {
    assert.expect(4);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $simpledatetime = find('[data-test-simpledatetime] .custom-flatpickr');

      assert.strictEqual(Ember.$.trim($simpledatetime.attr('readonly')), 'readonly', 'Time is readonly');

      var $simpledatetimeFge = Ember.$('.in-groupedit .flexberry-simpledatetime .custom-flatpickr');
      assert.strictEqual(Ember.$.trim($simpledatetimeFge.attr('readonly')), 'readonly', 'Groupedit\'s datepicker is readonly');

      controller.set('readonly', false);
      Ember.run.scheduleOnce('afterRender', function () {
        assert.strictEqual(Ember.$.trim($simpledatetime.attr('readonly')), '', 'Time is not readonly');
        assert.strictEqual(Ember.$.trim($simpledatetimeFge.attr('readonly')), '', 'Groupedit\'s datepicker is not readonly');
      });
    });
  });

  (0, _qunit.test)('flexberry-dropdown on readonly editform', function (assert) {
    assert.expect(4);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $dropdown = find('.not-in-groupedit .flexberry-dropdown');
      assert.strictEqual($dropdown.hasClass('disabled'), true, 'Dropdown is readonly');

      var $dropdownFge = find('[data-test-groupedit] .flexberry-dropdown');
      assert.strictEqual($dropdownFge.hasClass('disabled'), true, 'Groupedit\'s dropdown is readonly');

      controller.set('readonly', false);
      Ember.run.scheduleOnce('afterRender', function () {
        assert.strictEqual($dropdown.hasClass('disabled'), false, 'Dropdown is not readonly');
        assert.strictEqual($dropdownFge.hasClass('disabled'), false, 'Groupedit\'s dropdown is not readonly');
      });
    });
  });

  (0, _qunit.test)('flexberry-file on readonly edit form', function (assert) {
    assert.expect(14);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $file = find('[data-test-file] input.flexberry-file-filename-input');
      assert.strictEqual(Ember.$.trim($file.attr('readonly')), 'readonly', 'Flexberry-file is readonly');
      var $downloadButton = find('[data-test-file] label.flexberry-file-download-button');
      assert.strictEqual($downloadButton.hasClass('disabled'), true, 'Flexberry-file\'s button \'Download\' is readonly');

      var $fileFge = find('[data-test-groupedit] input.flexberry-file-filename-input');
      assert.strictEqual(Ember.$.trim($fileFge.attr('readonly')), 'readonly', 'Groupedit\'s flexberry-file is readonly');
      var $downloadButtonFge = find('[data-test-groupedit] label.flexberry-file-download-button');
      assert.strictEqual($downloadButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file\'s button \'Download\' is readonly');

      controller.set('readonly', false);
      Ember.run.scheduleOnce('afterRender', function () {
        assert.strictEqual(Ember.$(undefined).is('readonly'), false, 'Flexberry-file don\'t readonly');
        var $addButton = find('[data-test-file] label.flexberry-file-add-button');
        assert.strictEqual($addButton.hasClass('disabled'), false, 'Flexberry-file\'s button \'Add\' don\'t readonly');
        var $removeButton = find('[data-test-file] label.flexberry-file-remove-button');
        assert.strictEqual($removeButton.hasClass('disabled'), true, 'Flexberry-file has button \'Remove\'');
        var $uploadButton = find('[data-test-file] label.flexberry-file-upload-button');
        assert.strictEqual($uploadButton.hasClass('disabled'), true, 'Flexberry-file has button \'Upload\'');
        assert.strictEqual($downloadButton.hasClass('disabled'), true, 'Flexberry-file has button \'Download\'');

        assert.strictEqual(Ember.$(undefined).is('readonly'), false, 'Groupedit\'s flexberry-file don\'t readonly');
        var $addButtonFge = find('[data-test-groupedit] label.flexberry-file-add-button');
        assert.strictEqual($addButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-file\'s button \'Add\' don\'t readonly');
        var $removeButtonFge = find('[data-test-groupedit] label.flexberry-file-remove-button');
        assert.strictEqual($removeButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file has button \'Remove\'');
        var $uploadButtonFge = find('[data-test-groupedit] label.flexberry-file-upload-button');
        assert.strictEqual($uploadButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file has button \'Upload\'');
        assert.strictEqual($downloadButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file has button \'Download\'');
      });
    });
  });

  (0, _qunit.test)('flexberry-lookup on readonly edit form', function (assert) {
    assert.expect(12);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $lookup = find('[data-test-lookup] input.lookup-field');
      assert.strictEqual(Ember.$.trim($lookup.attr('readonly')), 'readonly', 'Lookup is readonly');
      var $chooseButton = find('[data-test-lookup] button.ui-change');
      assert.strictEqual($chooseButton.hasClass('disabled'), true, 'Flexberry-lookup\'s button \'Choose\' is readonly');
      var $removeButton = find('[data-test-lookup] button.ui-clear');
      assert.strictEqual($removeButton.hasClass('disabled'), true, 'Flexberry-lookup\'s button \'Remove\' is readonly');

      var $lookupFge = find('[data-test-groupedit] input.lookup-field');
      assert.strictEqual(Ember.$.trim($lookupFge.attr('readonly')), 'readonly', 'Groupedit\'s lookup is readonly');
      var $chooseButtonFge = find('[data-test-groupedit] button.ui-change');
      assert.strictEqual($chooseButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-lookup\'s button \'Choose\' is readonly');
      var $removeButtonFge = find('[data-test-groupedit] button.ui-clear');
      assert.strictEqual($removeButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-lookup\'s button \'Remove\' is readonly');

      controller.set('readonly', false);
      Ember.run.scheduleOnce('afterRender', function () {
        $removeButton = find('[data-test-lookup] button.ui-clear');
        $removeButtonFge = find('[data-test-groupedit] button.ui-clear');
        assert.strictEqual(Ember.$(undefined).is('readonly'), false, 'Lookup don\'t readonly');
        assert.strictEqual($chooseButton.hasClass('disabled'), false, 'Flexberry-lookup\'s button \'Choose\' don\'t readonly');
        assert.strictEqual($removeButton.hasClass('disabled'), false, 'Flexberry-lookup\'s button \'Remove\' don\'t readonly');

        assert.strictEqual($lookupFge.is('readonly'), false, 'Groupedit\'s lookup is not readonly');
        assert.strictEqual($chooseButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-lookup\'s button \'Choose\' is not readonly');
        assert.strictEqual($removeButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-lookup\'s button \'Remove\' is not readonly');
      });
    });
  });

  (0, _qunit.test)('flexberry-lookup as dropdown on readonly edit form', function (assert) {
    assert.expect(2);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $dropdown = find('[data-test-lookup-d] .flexberry-dropdown');
      assert.strictEqual($dropdown.hasClass('disabled'), true, 'Lookup as dropdown is readonly');

      controller.set('readonly', false);
      Ember.run.scheduleOnce('afterRender', function () {
        assert.strictEqual($dropdown.hasClass('disabled'), false, 'Lookup as dropdown is not readonly');
      });
    });
  });

  (0, _qunit.test)('flexberry-groupedit on readonly edit form', function (assert) {
    assert.expect(2);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $groupedit = find('[data-test-groupedit] table');
      assert.strictEqual($groupedit.hasClass('readonly'), true, 'Groupedit is readonly');

      controller.set('readonly', false);
      Ember.run.scheduleOnce('afterRender', function () {
        assert.strictEqual($groupedit.hasClass('readonly'), false, 'Groupedit is not readonly');
      });
    });
  });

  (0, _qunit.test)('flexberry-groupedit\'s button on readonly edit form', function (assert) {
    assert.expect(12);

    visit(path);
    andThen(function () {
      var $addButton = find('[data-test-groupedit] .ui-add');
      var $removeButton = find('[data-test-groupedit] .ui-delete');
      var $checkbox = find('[data-test-groupedit] .flexberry-checkbox');
      var $removeButtonRow = find('[data-test-groupedit] .object-list-view-row-delete-button');
      var $itemEditMenu = find('[data-test-groupedit] .edit-menu');
      var $itemDeconsteMenu = find('[data-test-groupedit] .delete-menu');

      assert.strictEqual(Ember.$.trim($addButton.attr('disabled')), 'disabled', 'Flexberry-groupedit\'s button \'Add\' is readonly');
      assert.strictEqual(Ember.$.trim($removeButton.attr('disabled')), 'disabled', 'Flexberry-groupedit\'s button \'Remove\' is readonly');
      assert.strictEqual($checkbox.hasClass('read-only'), true, 'Flexberry-groupedit\'s checkbox helper is readonly');
      assert.strictEqual($removeButtonRow.hasClass('disabled'), true, 'Flexberry-groupedit\'s button \'Remove in row\' is readonly');
      assert.strictEqual($itemEditMenu.hasClass('disabled'), true, 'Flexberry-groupedit\'s item \'Edit\' in left menu is readonly');
      assert.strictEqual($itemDeconsteMenu.hasClass('disabled'), true, 'Flexberry-groupedit\'s item \'Deconste\' in left menu is readonly');

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      controller.set('readonly', false);
      Ember.run.scheduleOnce('afterRender', function () {
        $checkbox = find('[data-test-groupedit] .flexberry-checkbox');
        $itemEditMenu = find('[data-test-groupedit] .edit-menu');
        $itemDeconsteMenu = find('[data-test-groupedit] .delete-menu');
        $removeButtonRow = find('[data-test-groupedit] .object-list-view-row-delete-button');

        assert.strictEqual(Ember.$(undefined).is('disabled'), false, 'Flexberry-groupedit\'s button \'Add\' don\'t readonly');
        assert.strictEqual(Ember.$(undefined).is('disabled'), false, 'Flexberry-groupedit\'s button \'Remove\' don\'t readonly');
        assert.strictEqual($checkbox.hasClass('read-only'), false, 'Flexberry-groupedit\'s checkbox helper don\'t readonly');
        assert.strictEqual($removeButtonRow.hasClass('disabled'), false, 'Flexberry-groupedit\'s button \'Remove in row\' don\'t readonly');
        assert.strictEqual($itemEditMenu.hasClass('disabled'), false, 'Flexberry-groupedit\'s item \'Edit\' in left menu don\'t readonly');
        assert.strictEqual($itemDeconsteMenu.hasClass('disabled'), false, 'Flexberry-groupedit\'s item \'Deconste\' in left menu don\'t readonly');
      });
    });
  });
});
define('dummy/tests/acceptance/edit-form-validation-test/execute-validation-test', ['exports', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _qunit, _startApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.executeTest = executeTest;
  function executeTest(testName, callback) {
    var app = void 0;
    var store = void 0;
    var userSettingsService = void 0;

    (0, _qunit.module)('Acceptance | flexberry-validation | ' + testName, {
      beforeEach: function beforeEach() {

        // Start application.
        app = (0, _startApp.default)();

        // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
        var applicationController = app.__container__.lookup('controller:application');
        applicationController.set('isInAcceptanceTestMode', true);
        store = app.__container__.lookup('service:store');

        userSettingsService = app.__container__.lookup('service:user-settings');
        var getCurrentPerPage = function getCurrentPerPage() {
          return 5;
        };

        userSettingsService.set('getCurrentPerPage', getCurrentPerPage);
      },
      afterEach: function afterEach() {
        Ember.run(app, 'destroy');
        var daterangepicker = Ember.$('.daterangepicker');
        daterangepicker.remove();
      }
    });

    (0, _qunit.test)(testName, function (assert) {
      return callback(store, assert, app);
    });
  }
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-base-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check default value', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
      var $validationSixteenWide = Ember.$('.list');
      var $validationLi = $validationSixteenWide.children('li');

      // Сounting the number of validationmessage.
      assert.equal($validationLablesContainer.length, 11, 'All components have default value');
      assert.equal($validationLi.length, 17, 'All components have default value in sixteenWide');
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-checkbox-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check operation checkbox', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = Ember.$(Ember.$('.field')[1]);
      var $validationFlexberryCheckbox = $validationField.children('.flexberry-checkbox');
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Flag is required,Flag must be \'true\' only', 'Checkbox\'s label have default value by default');

      Ember.run(function () {
        $validationFlexberryCheckbox.click();
      });

      // Check validationmessage text afther first click.
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Checkbox\'s label havn\'t value after first click');

      Ember.run(function () {
        $validationFlexberryCheckbox.click();
      });

      // Check validationmessage text = 'Flag must be 'true' only' afther first click.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Flag must be \'true\' only', 'Checkbox\'s label have value after second click');
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-detail-delete-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check detail delete', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      // Сounting the number of validationmessage.
      var $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
      assert.equal($validationLablesContainer.length, 11, 'All components have default value');

      // Delete detail.
      click('.groupedit-new-row .flexberry-checkbox:first');
      click('.groupedit-toolbar .ui-delete');

      andThen(function () {
        // Сounting the number of validationmessage = 8 afther detail delete.
        $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
        assert.equal($validationLablesContainer.length, 8, 'Detail was deleted without errors');
      });
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-detail-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check detail\'s components', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      // Сounting the number of validationmessage.
      var $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
      assert.equal($validationLablesContainer.length, 11, 'All components have default value');

      var $validationFlexberryCheckboxs = Ember.$('.flexberry-checkbox');
      var $validationFlexberryOLVCheckbox = Ember.$($validationFlexberryCheckboxs[2]);

      var $validationFlexberryTextboxs = Ember.$('.flexberry-textbox');
      var $validationFlexberryOLVTextbox1 = Ember.$($validationFlexberryTextboxs[2]);
      var $validationFlexberryOLVTextbox2 = Ember.$($validationFlexberryTextboxs[3]);

      // Selct textbox inner.
      var $validationFlexberryTextboxInner1 = $validationFlexberryOLVTextbox1.children('input');
      var $validationFlexberryTextboxInner2 = $validationFlexberryOLVTextbox2.children('input');

      // Select deteil's validationmessages.
      var $validationField1 = Ember.$($validationLablesContainer[8]);
      var $validationField2 = Ember.$($validationLablesContainer[9]);
      var $validationField3 = Ember.$($validationLablesContainer[10]);

      // Data insertion.
      Ember.run(function () {
        $validationFlexberryOLVCheckbox.click();
        $validationFlexberryTextboxInner1[0].value = '1';
        $validationFlexberryTextboxInner1.change();
        $validationFlexberryTextboxInner2[0].value = '12345';
        $validationFlexberryTextboxInner2.change();
      });

      // Validationmessage must be empty.
      assert.ok($validationField1.text().trim() === '' && $validationField2.text().trim() === '' && $validationField3.text().trim() === '', 'All components have default value');
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-dropdown-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check operation dropdown', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = Ember.$(Ember.$('.field')[6]);
      var $validationFlexberryDropdown = $validationField.children('.flexberry-dropdown');
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Enumeration is required', 'Dropdown have default value');

      Ember.run(function () {

        // Open dropdown.
        $validationFlexberryDropdown.click();
        var $validationFlexberryDropdownMenu = $validationFlexberryDropdown.children('.menu');
        var $validationFlexberryDropdownItems = $validationFlexberryDropdownMenu.children('.item');
        var $validationFlexberryDropdownItem = Ember.$($validationFlexberryDropdownItems[0]);

        // Select item
        $validationFlexberryDropdownItem.click();
      });

      // Validationmessage must be empty.
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Dropdown have value');
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-file-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check operation file', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationFieldFile = Ember.$(Ember.$('.field')[7]);
      var $validationFlexberryErrorLable = $validationFieldFile.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'File is required', 'Flexberry file have default value');

      var $validationFlexberryLookup = Ember.$('.flexberry-lookup');
      var $validationFlexberryLookupInput = $validationFlexberryLookup.children('.input');
      var $validationFlexberryLookupButton = $validationFlexberryLookupInput.children('.ui-change.button');

      // Click lookup button.
      Ember.run(function () {
        $validationFlexberryLookupButton.click();
      });

      var done = assert.async();

      // Сounting the number of validationmessage.
      setTimeout(function () {
        assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Flexberry file have value');
        done();
      }, 2000);
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-lookup-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check operation lookup', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = Ember.$(Ember.$('.field')[8]);
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Master is required', 'Lookup have default value');

      var $validationFlexberryLookup = Ember.$('.flexberry-lookup');
      var $validationFlexberryLookupInput = $validationFlexberryLookup.children('.input');
      var $validationFlexberryLookupButton = $validationFlexberryLookupInput.children('.ui-change.button');

      // Click lookup button.
      Ember.run(function () {
        $validationFlexberryLookupButton.click();
      });

      var done = assert.async();

      // Waiting for the action complete.
      setTimeout(function () {
        assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Lookup have value');
        done();
      }, 1000);
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test', '@ember/test-helpers'], function (_executeValidationTest, _testHelpers) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check complete all tests', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationDataField = Ember.$('.flexberry-simpledatetime');
      var $validationDataDiv = $validationDataField.children('.input');
      var $validationDataInput = $validationDataDiv.children('.flatpickr-input');

      Ember.run(function () {
        // Open datepicker calendar.
        Ember.$($validationDataInput[0]).click();
        var $validationDateButton = Ember.$('.flatpickr-day')[16];

        // Select date.
        (0, _testHelpers.click)($validationDateButton);
      });

      var $validationFlexberryLookup = Ember.$('.flexberry-lookup');
      var $validationFlexberryLookupInput = $validationFlexberryLookup.children('.input');
      var $validationFlexberryLookupButton = $validationFlexberryLookupInput.children('.ui-change.button');

      // Click lookup button.
      Ember.run(function () {
        $validationFlexberryLookupButton.click();
      });

      var $validationFlexberryCheckboxs = Ember.$('.flexberry-checkbox');
      var $validationFlexberryCheckbox = Ember.$($validationFlexberryCheckboxs[0]);
      var $validationFlexberryOLVCheckbox = Ember.$($validationFlexberryCheckboxs[2]);

      Ember.run(function () {
        $validationFlexberryCheckbox.click();
        $validationFlexberryOLVCheckbox.click();
      });

      var $validationFlexberryDropdown = Ember.$('.flexberry-dropdown');

      Ember.run(function () {

        // Open dropdown.
        $validationFlexberryDropdown.click();
        var $validationFlexberryDropdownMenu = $validationFlexberryDropdown.children('.menu');
        var $validationFlexberryDropdownItems = $validationFlexberryDropdownMenu.children('.item');
        var $validationFlexberryDropdownItem = Ember.$($validationFlexberryDropdownItems[0]);

        // Select item
        $validationFlexberryDropdownItem.click();
      });

      var $validationFlexberryTextboxs = Ember.$('.flexberry-textbox');
      var $validationFlexberryTextbox1 = Ember.$($validationFlexberryTextboxs[0]);
      var $validationFlexberryTextbox2 = Ember.$($validationFlexberryTextboxs[1]);
      var $validationFlexberryOLVTextbox1 = Ember.$($validationFlexberryTextboxs[2]);
      var $validationFlexberryOLVTextbox2 = Ember.$($validationFlexberryTextboxs[3]);
      var $validationFlexberryTextarea = Ember.$('.flexberry-textarea');

      var $validationFlexberryTextboxInner1 = $validationFlexberryTextbox1.children('input');
      var $validationFlexberryTextboxInner2 = $validationFlexberryTextbox2.children('input');
      var $validationFlexberryOLVTextboxInner1 = $validationFlexberryOLVTextbox1.children('input');
      var $validationFlexberryOLVTextboxInner2 = $validationFlexberryOLVTextbox2.children('input');
      var $validationFlexberryTextAreaInner = $validationFlexberryTextarea.children('textarea');

      // Insert text in textbox and textarea.
      Ember.run(function () {
        $validationFlexberryTextboxInner1[0].value = '1';
        $validationFlexberryTextboxInner1.change();
        $validationFlexberryTextboxInner2[0].value = '12345';
        $validationFlexberryTextboxInner2.change();
        $validationFlexberryTextAreaInner.val('1');
        $validationFlexberryTextAreaInner.change();
        $validationFlexberryOLVTextboxInner1[0].value = '1';
        $validationFlexberryOLVTextboxInner1.change();
        $validationFlexberryOLVTextboxInner2[0].value = '12345';
        $validationFlexberryOLVTextboxInner2.change();
      });

      var $validationFlexberryFileAddButton = Ember.$('.add.outline');

      Ember.run(function () {
        $validationFlexberryFileAddButton.click();
      });

      var done = assert.async();

      // Сounting the number of validationmessage.
      setTimeout(function () {
        var $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
        var $validationMessage = true;

        for (var i = 0; i < 10; i++) {
          if ($validationLablesContainer[i].textContent.trim() !== '') {
            $validationMessage = false;
          }
        }

        var $validationSixteenWide = Ember.$('.list');
        var $validationLi = $validationSixteenWide.children('li');

        // Сounting the number of validationmessage.
        assert.equal($validationLi.length, 0, 'All components have default value in sixteenWide');

        assert.ok($validationMessage, 'All components have correct value, All validationmessage disabled');
        done();
      }, 5000);
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-textarea-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check operation textarea', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = Ember.$(Ember.$('.field')[4]);
      var $validationFlexberryTextarea = Ember.$('.flexberry-textarea');
      var $validationFlexberryTextboxInner = $validationFlexberryTextarea.children('textarea');
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Long text is required', 'Textarea have default value');

      // Insert text in textarea.
      Ember.run(function () {
        $validationFlexberryTextboxInner.val('1');
        $validationFlexberryTextboxInner.change();
      });

      // Validationmessage must be empty.
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Textarea have default value');
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-textbox-letter-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check operation letter textbox', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = Ember.$(Ember.$('.field')[3]);
      var $validationFlexberryTextbox = $validationField.children('.flexberry-textbox');
      var $validationFlexberryTextboxInner = $validationFlexberryTextbox.children('input');
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Text is required,Text length must be >= 5', 'letter textbox have default value');

      // Insert text in textbox.
      Ember.run(function () {
        $validationFlexberryTextboxInner[0].value = '1';
        $validationFlexberryTextboxInner.change();
      });

      // Check default validationmessage for text length <5 letter.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Text length must be >= 5', 'letter textbox have < 5 letter');

      // Insert text in textbox.
      Ember.run(function () {
        $validationFlexberryTextboxInner[0].value = '12345';
        $validationFlexberryTextboxInner.change();
      });

      // Check default validationmessage for text length >5 letter.
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'letter textbox have >= 5 letter');
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-textbox-numeric-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check operation numeric textbox', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = Ember.$(Ember.$('.field')[2]);
      var $validationFlexberryTextbox = $validationField.children('.flexberry-textbox');
      var $validationFlexberryTextboxInner = $validationFlexberryTextbox.children('input');
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Number is required,Number is invalid', 'Numeric textbox have default value');

      // Insert text in textbox.
      Ember.run(function () {
        $validationFlexberryTextboxInner[0].value = '2';
        $validationFlexberryTextboxInner.change();
      });

      // Check default validationmessage text for even numbers.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Number must be an odd', 'Numeric textbox have even value');

      // Insert text in textbox.
      Ember.run(function () {
        $validationFlexberryTextboxInner[0].value = '1';
        $validationFlexberryTextboxInner.change();
      });

      // Check default validationmessage text for odd numbers.
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Numeric textbox have odd value');
    });
  });
  /* eslint-enable no-unused-vars */
});
define('dummy/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/css-picker.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/css-picker.js should pass ESLint\n\n');
  });

  QUnit.test('components/number-input.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/number-input.js should pass ESLint\n\n');
  });

  QUnit.test('components/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/application.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/edit-form-readonly.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/edit-form-readonly.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/edit-form-validation/validation.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/edit-form-validation/validation.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-groupedit/properly-rerenders.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-groupedit/properly-rerenders.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/base-operations.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/base-operations.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/settings-example-actions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/settings-example-actions.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/settings-example-autocomplete.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/settings-example-autocomplete.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/settings-example-dropdown.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/settings-example-dropdown.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/settings-example-limit-function.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/settings-example-limit-function.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/settings-example-preview-page.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/settings-example-preview-page.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/settings-example-preview.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/settings-example-preview.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/settings-example-projection.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/settings-example-projection.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/settings-example-relation-name.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/settings-example-relation-name.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-lookup/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-lookup/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-objectlistview/base-operations.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-objectlistview/base-operations.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-objectlistview/computable-field.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-objectlistview/computable-field.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-objectlistview/custom-filter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-objectlistview/custom-filter.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-objectlistview/date-format.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-objectlistview/date-format.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-objectlistview/folv-filter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-objectlistview/folv-filter.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-acceptance-tests/flexberry-objectlistview/folv-paging.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-acceptance-tests/flexberry-objectlistview/folv-paging.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-button/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-button/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-checkbox/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-checkbox/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-ddau-checkbox/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-ddau-checkbox/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-dropdown/conditional-render-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-dropdown/conditional-render-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-dropdown/empty-value-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-dropdown/empty-value-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-dropdown/items-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-dropdown/items-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-dropdown/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-dropdown/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-field/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-field/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-file/flexberry-file-in-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-file/flexberry-file-in-modal.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-file/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-file/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-groupedit/configurate-row-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-groupedit/configurate-row-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-groupedit/custom-buttons-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-groupedit/custom-buttons-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-groupedit-with-lookup-with-computed-atribute.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-groupedit-with-lookup-with-computed-atribute.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-readonly-columns-by-configurate-row-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-readonly-columns-by-configurate-row-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-groupedit-with-lookup-with-computed-atribute.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-groupedit-with-lookup-with-computed-atribute.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-readonly-columns-by-configurate-row-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-readonly-columns-by-configurate-row-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-groupedit/model-update-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-groupedit/model-update-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-groupedit/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-groupedit/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/autocomplete-order-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/autocomplete-order-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/autofill-by-limit-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/autofill-by-limit-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/customizing-window-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/customizing-window-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/default-ordering-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/default-ordering-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/dropdown-mode-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/dropdown-mode-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/hierarchy-olv-in-lookup-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/hierarchy-olv-in-lookup-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/limit-function-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/limit-function-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/limit-function-through-dynamic-properties-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/limit-function-through-dynamic-properties-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/lookup-block-form-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/lookup-block-form-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/lookup-in-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/lookup-in-modal.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/numeric-autocomplete.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/numeric-autocomplete.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-lookup/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-lookup/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-menu/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-menu/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-cancel.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-cancel.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-immediately.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-immediately.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-cancel.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-cancel.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-immediately.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-immediately.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/configurate-rows.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/configurate-rows.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/custom-filter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/custom-filter.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/downloading-files-from-olv-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/downloading-files-from-olv-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/downloading-files-from-olv-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/downloading-files-from-olv-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/edit-form-with-detail-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/edit-form-with-detail-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/edit-form-with-detail-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/edit-form-with-detail-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/edit-form-with-detail-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/edit-form-with-detail-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/hierarchy-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/hierarchy-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/hierarchy-paging-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/hierarchy-paging-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/inheritance-models.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/inheritance-models.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/inheritance-models/parent-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/inheritance-models/parent-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/inheritance-models/parent-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/inheritance-models/parent-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/inheritance-models/parent-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/inheritance-models/parent-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/limit-function-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/limit-function-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/limited-text-size-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/limited-text-size-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/list-on-editform.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/list-on-editform.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/lock-services-editor-view-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/lock-services-editor-view-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/lock-services-editor-view-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/lock-services-editor-view-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/object-list-view-resize.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/object-list-view-resize.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/on-edit-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/on-edit-form.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/on-edit-form/suggestion.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/on-edit-form/suggestion.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/on-edit-form/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/on-edit-form/user.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/selected-rows.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/selected-rows.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-objectlistview/toolbar-custom-buttons-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-objectlistview/toolbar-custom-buttons-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-simpledatetime/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-simpledatetime/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-text-cell/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-text-cell/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-textarea/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-textarea/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-textbox/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-textbox/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-toggler/ge-into-toggler-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-toggler/ge-into-toggler-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-toggler/settings-example-inner.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-toggler/settings-example-inner.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-toggler/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-toggler/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/flexberry-tree/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/flexberry-tree/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/modal-dialog/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/modal-dialog/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/components-examples/ui-message/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/components-examples/ui-message/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-application-user-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-application-user-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-application-user-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-application-user-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-application-user-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-application-user-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-comment-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-comment-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-comment-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-comment-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-comment-vote-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-comment-vote-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-comment-vote-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-comment-vote-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-localization-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-localization-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-localization-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-localization-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-localization-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-localization-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-multi-list-user-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-multi-list-user-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-multi-list-user-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-multi-list-user-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-multi-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-multi-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-suggestion-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-suggestion-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-suggestion-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-suggestion-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-suggestion-file-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-suggestion-file-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-suggestion-file-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-suggestion-file-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-suggestion-file-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-suggestion-file-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-suggestion-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-suggestion-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-suggestion-type-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-suggestion-type-edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-suggestion-type-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-suggestion-type-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-suggestion-type-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-suggestion-type-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-toggler-example-master-e.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-toggler-example-master-e.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/ember-flexberry-dummy-toggler-example-master-e/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/ember-flexberry-dummy-toggler-example-master-e/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/integration-examples/edit-form/readonly-mode.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/integration-examples/edit-form/readonly-mode.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/integration-examples/edit-form/theming-components.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/integration-examples/edit-form/theming-components.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/integration-examples/edit-form/validation.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/integration-examples/edit-form/validation.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/log-service-examples/clear-log-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/log-service-examples/clear-log-form.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/log-service-examples/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/log-service-examples/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/login.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/new-platform-flexberry-services-lock-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/new-platform-flexberry-services-lock-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/user-setting-forms/user-setting-delete.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/user-setting-forms/user-setting-delete.js should pass ESLint\n\n');
  });

  QUnit.test('enums/components-examples/flexberry-dropdown/conditional-render-example/enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'enums/components-examples/flexberry-dropdown/conditional-render-example/enumeration.js should pass ESLint\n\n');
  });

  QUnit.test('enums/components-examples/flexberry-dropdown/empty-value-example/enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'enums/components-examples/flexberry-dropdown/empty-value-example/enumeration.js should pass ESLint\n\n');
  });

  QUnit.test('enums/components-examples/flexberry-dropdown/settings-example/enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'enums/components-examples/flexberry-dropdown/settings-example/enumeration.js should pass ESLint\n\n');
  });

  QUnit.test('enums/components-examples/flexberry-groupedit/shared/detail-enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'enums/components-examples/flexberry-groupedit/shared/detail-enumeration.js should pass ESLint\n\n');
  });

  QUnit.test('enums/ember-flexberry-dummy-gender.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'enums/ember-flexberry-dummy-gender.js should pass ESLint\n\n');
  });

  QUnit.test('enums/ember-flexberry-dummy-vote-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'enums/ember-flexberry-dummy-vote-type.js should pass ESLint\n\n');
  });

  QUnit.test('enums/integration-examples/edit-form/readonly-mode/enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'enums/integration-examples/edit-form/readonly-mode/enumeration.js should pass ESLint\n\n');
  });

  QUnit.test('enums/integration-examples/edit-form/validation/enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'enums/integration-examples/edit-form/validation/enumeration.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/to-safe-string.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/to-safe-string.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/to-string.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/to-string.js should pass ESLint\n\n');
  });

  QUnit.test('locales/en/translations.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'locales/en/translations.js should pass ESLint\n\n');
  });

  QUnit.test('locales/ru/translations.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'locales/ru/translations.js should pass ESLint\n\n');
  });

  QUnit.test('mixins/list-form-controller-operations-indication.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/list-form-controller-operations-indication.js should pass ESLint\n\n');
  });

  QUnit.test('mixins/list-form-route-operations-indication.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/list-form-route-operations-indication.js should pass ESLint\n\n');
  });

  QUnit.test('models/aggregator.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/aggregator.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-checkbox/settings-example/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-checkbox/settings-example/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-ddau-checkbox/settings-example/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-ddau-checkbox/settings-example/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-dropdown/conditional-render-example/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-dropdown/conditional-render-example/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-dropdown/empty-value-example/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-dropdown/empty-value-example/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-dropdown/settings-example/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-dropdown/settings-example/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-field/settings-example/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-field/settings-example/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-file/settings-example/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-file/settings-example/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-groupedit/shared/aggregator.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-groupedit/shared/aggregator.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-groupedit/shared/detail.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-groupedit/shared/detail.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-groupedit/shared/master.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-groupedit/shared/master.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-simpledatetime/settings-example/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-simpledatetime/settings-example/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-textarea/settings-example/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-textarea/settings-example/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/components-examples/flexberry-textbox/settings-example/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/components-examples/flexberry-textbox/settings-example/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-application-user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-application-user.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-comment-vote.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-comment-vote.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-comment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-comment.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-localization.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-localization.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-localized-suggestion-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-localized-suggestion-type.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-parent.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-parent.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-successor-phone.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-successor-phone.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-successor-social-network.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-successor-social-network.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-suggestion-file.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-suggestion-file.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-suggestion-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-suggestion-type.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-suggestion.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-suggestion.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-toggler-example-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-toggler-example-detail.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-toggler-example-master.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-toggler-example-master.js should pass ESLint\n\n');
  });

  QUnit.test('models/ember-flexberry-dummy-vote.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ember-flexberry-dummy-vote.js should pass ESLint\n\n');
  });

  QUnit.test('models/integration-examples/edit-form/readonly-mode/aggregator.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/integration-examples/edit-form/readonly-mode/aggregator.js should pass ESLint\n\n');
  });

  QUnit.test('models/integration-examples/edit-form/readonly-mode/detail.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/integration-examples/edit-form/readonly-mode/detail.js should pass ESLint\n\n');
  });

  QUnit.test('models/integration-examples/edit-form/readonly-mode/master-dropdown.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/integration-examples/edit-form/readonly-mode/master-dropdown.js should pass ESLint\n\n');
  });

  QUnit.test('models/integration-examples/edit-form/readonly-mode/master.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/integration-examples/edit-form/readonly-mode/master.js should pass ESLint\n\n');
  });

  QUnit.test('models/integration-examples/edit-form/validation/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/integration-examples/edit-form/validation/base.js should pass ESLint\n\n');
  });

  QUnit.test('models/integration-examples/edit-form/validation/detail.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/integration-examples/edit-form/validation/detail.js should pass ESLint\n\n');
  });

  QUnit.test('models/integration-examples/edit-form/validation/master.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/integration-examples/edit-form/validation/master.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/edit-form-readonly.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/edit-form-readonly.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/edit-form-validation/validation.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/edit-form-validation/validation.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-groupedit/properly-rerenders.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-groupedit/properly-rerenders.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/base-operations.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/base-operations.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/settings-example-actions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/settings-example-actions.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/settings-example-autocomplete.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/settings-example-autocomplete.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/settings-example-dropdown.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/settings-example-dropdown.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/settings-example-limit-function.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/settings-example-limit-function.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/settings-example-preview-page.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/settings-example-preview-page.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/settings-example-preview.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/settings-example-preview.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/settings-example-projection.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/settings-example-projection.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/settings-example-relation-name.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/settings-example-relation-name.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-lookup/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-lookup/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-objectlistview/base-operations.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-objectlistview/base-operations.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-objectlistview/computable-field.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-objectlistview/computable-field.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-objectlistview/custom-filter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-objectlistview/custom-filter.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-objectlistview/date-format.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-objectlistview/date-format.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-objectlistview/folv-filter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-objectlistview/folv-filter.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-acceptance-tests/flexberry-objectlistview/folv-paging.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-acceptance-tests/flexberry-objectlistview/folv-paging.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-button/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-button/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-checkbox/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-checkbox/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-ddau-checkbox/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-ddau-checkbox/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-dropdown/conditional-render-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-dropdown/conditional-render-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-dropdown/empty-value-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-dropdown/empty-value-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-dropdown/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-dropdown/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-field/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-field/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-file/flexberry-file-in-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-file/flexberry-file-in-modal.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-file/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-file/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-groupedit/configurate-row-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-groupedit/configurate-row-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-groupedit/custom-buttons-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-groupedit/custom-buttons-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-groupedit-with-lookup-with-computed-atribute.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-groupedit-with-lookup-with-computed-atribute.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-readonly-columns-by-configurate-row-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-readonly-columns-by-configurate-row-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-groupedit-with-lookup-with-computed-atribute.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-groupedit-with-lookup-with-computed-atribute.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-readonly-columns-by-configurate-row-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-readonly-columns-by-configurate-row-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-groupedit/model-update-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-groupedit/model-update-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-groupedit/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-groupedit/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/autocomplete-order-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/autocomplete-order-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/autofill-by-limit-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/autofill-by-limit-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/customizing-window-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/customizing-window-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/default-ordering-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/default-ordering-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/dropdown-mode-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/dropdown-mode-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/hierarchy-olv-in-lookup-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/hierarchy-olv-in-lookup-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/limit-function-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/limit-function-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/limit-function-through-dynamic-properties-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/limit-function-through-dynamic-properties-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/lookup-block-form-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/lookup-block-form-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/lookup-in-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/lookup-in-modal.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/numeric-autocomplete.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/numeric-autocomplete.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-lookup/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-lookup/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-menu/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-menu/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-cancel.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-cancel.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-immediately.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-immediately.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-cancel.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-cancel.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-immediately.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-immediately.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/configurate-rows.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/configurate-rows.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/custom-filter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/custom-filter.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/downloading-files-from-olv-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/downloading-files-from-olv-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/downloading-files-from-olv-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/downloading-files-from-olv-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/edit-form-with-detail-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/edit-form-with-detail-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/edit-form-with-detail-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/edit-form-with-detail-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/edit-form-with-detail-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/edit-form-with-detail-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/hierarchy-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/hierarchy-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/hierarchy-paging-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/hierarchy-paging-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/inheritance-models.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/inheritance-models.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/inheritance-models/parent-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/inheritance-models/parent-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/inheritance-models/parent-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/inheritance-models/parent-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/inheritance-models/parent-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/inheritance-models/parent-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/limit-function-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/limit-function-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/limited-text-size-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/limited-text-size-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/list-on-editform.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/list-on-editform.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/lock-services-editor-view-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/lock-services-editor-view-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/lock-services-editor-view-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/lock-services-editor-view-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/object-list-view-resize.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/object-list-view-resize.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/on-edit-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/on-edit-form.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/on-edit-form/suggestion.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/on-edit-form/suggestion.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/on-edit-form/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/on-edit-form/user.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/selected-rows.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/selected-rows.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-objectlistview/toolbar-custom-buttons-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-objectlistview/toolbar-custom-buttons-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-simpledatetime/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-simpledatetime/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-text-cell/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-text-cell/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-textarea/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-textarea/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-textbox/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-textbox/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-toggler/ge-into-toggler-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-toggler/ge-into-toggler-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-toggler/settings-example-inner.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-toggler/settings-example-inner.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-toggler/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-toggler/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/flexberry-tree/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/flexberry-tree/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/components-examples/ui-message/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/components-examples/ui-message/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-application-user-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-application-user-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-application-user-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-application-user-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-application-user-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-application-user-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-comment-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-comment-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-comment-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-comment-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-comment-vote-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-comment-vote-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-comment-vote-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-comment-vote-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-localization-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-localization-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-localization-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-localization-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-localization-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-localization-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-multi-list-user-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-multi-list-user-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-multi-list-user-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-multi-list-user-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-multi-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-multi-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-suggestion-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-suggestion-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-suggestion-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-suggestion-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-suggestion-file-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-suggestion-file-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-suggestion-file-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-suggestion-file-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-suggestion-file-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-suggestion-file-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-suggestion-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-suggestion-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-suggestion-type-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-suggestion-type-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-suggestion-type-edit/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-suggestion-type-edit/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-suggestion-type-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-suggestion-type-list.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-toggler-example-master-e.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-toggler-example-master-e.js should pass ESLint\n\n');
  });

  QUnit.test('routes/ember-flexberry-dummy-toggler-example-master-e/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/ember-flexberry-dummy-toggler-example-master-e/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/integration-examples/edit-form/readonly-mode.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/integration-examples/edit-form/readonly-mode.js should pass ESLint\n\n');
  });

  QUnit.test('routes/integration-examples/edit-form/theming-components.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/integration-examples/edit-form/theming-components.js should pass ESLint\n\n');
  });

  QUnit.test('routes/integration-examples/edit-form/validation.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/integration-examples/edit-form/validation.js should pass ESLint\n\n');
  });

  QUnit.test('routes/log-service-examples/clear-log-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/log-service-examples/clear-log-form.js should pass ESLint\n\n');
  });

  QUnit.test('routes/log-service-examples/settings-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/log-service-examples/settings-example.js should pass ESLint\n\n');
  });

  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/login.js should pass ESLint\n\n');
  });

  QUnit.test('routes/user-setting-forms/user-setting-delete.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/user-setting-forms/user-setting-delete.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/application.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-application-user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-application-user.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-comment-vote.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-comment-vote.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-comment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-comment.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-localization.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-localization.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-localized-suggestion-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-localized-suggestion-type.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-parent.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-parent.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-successor-phone.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-successor-phone.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-successor-social-network.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-successor-social-network.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-suggestion-file.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-suggestion-file.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-suggestion-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-suggestion-type.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-suggestion.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-suggestion.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-toggler-example-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-toggler-example-detail.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-toggler-example-master.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-toggler-example-master.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/ember-flexberry-dummy-vote.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/ember-flexberry-dummy-vote.js should pass ESLint\n\n');
  });

  QUnit.test('services/offline-globals.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/offline-globals.js should pass ESLint\n\n');
  });

  QUnit.test('services/store.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/store.js should pass ESLint\n\n');
  });

  QUnit.test('services/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/user.js should pass ESLint\n\n');
  });

  QUnit.test('transforms/components-examples/flexberry-dropdown/conditional-render-example/enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transforms/components-examples/flexberry-dropdown/conditional-render-example/enumeration.js should pass ESLint\n\n');
  });

  QUnit.test('transforms/components-examples/flexberry-dropdown/settings-example/enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transforms/components-examples/flexberry-dropdown/settings-example/enumeration.js should pass ESLint\n\n');
  });

  QUnit.test('transforms/components-examples/flexberry-groupedit/shared/detail-enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transforms/components-examples/flexberry-groupedit/shared/detail-enumeration.js should pass ESLint\n\n');
  });

  QUnit.test('transforms/ember-flexberry-dummy-gender.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transforms/ember-flexberry-dummy-gender.js should pass ESLint\n\n');
  });

  QUnit.test('transforms/ember-flexberry-dummy-vote-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transforms/ember-flexberry-dummy-vote-type.js should pass ESLint\n\n');
  });

  QUnit.test('transforms/integration-examples/edit-form/readonly-mode/enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transforms/integration-examples/edit-form/readonly-mode/enumeration.js should pass ESLint\n\n');
  });

  QUnit.test('transforms/integration-examples/edit-form/validation/enumeration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transforms/integration-examples/edit-form/validation/enumeration.js should pass ESLint\n\n');
  });
});
define('dummy/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('dummy/tests/helpers/ember-i18n/test-helpers', ['ember-i18n/test-support/-private/t', 'ember-i18n/test-support/-private/assert-translation'], function (_t2, _assertTranslation2) {
  'use strict';

  // example usage: find(`.header:contains(${t('welcome_message')})`)
  Ember.Test.registerHelper('t', function (app, key, interpolations) {
    return (0, _t2.default)(app.__container__, key, interpolations);
  });

  // example usage: expectTranslation('.header', 'welcome_message');
  Ember.Test.registerHelper('expectTranslation', function (app, element, key, interpolations) {
    var text = (0, _t2.default)(app.__container__, key, interpolations);

    (0, _assertTranslation2.default)(element, key, text);
  });
});
define('dummy/tests/helpers/ember-prop-types', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.createComponent = createComponent;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var VERSION = Ember.VERSION;


  /**
   * Determine if we are on a version of Ember that includes Glimmer 2
   * @returns {Boolean} whether or not we are on Glimmer 2
   */
  function isGlimmer2() {
    var _VERSION$split = VERSION.split('.'),
        _VERSION$split2 = _slicedToArray(_VERSION$split, 2),
        major = _VERSION$split2[0],
        minor = _VERSION$split2[1];

    return parseInt(major) > 1 && parseInt(minor) > 9;
  }

  /**
   * Programitcally instantiate instance of component class
   * @param {Ember.Component} component - component class to instantiate
   * @returns {Ember.Component} instance of component class
   */
  function createComponent(component) {
    if (isGlimmer2()) {
      return component.create({ renderer: {} });
    }

    return component.create();
  }
});
define('dummy/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Ember.RSVP.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };
});
define('dummy/tests/helpers/resolver', ['exports', 'dummy/resolver', 'dummy/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('dummy/tests/helpers/start-app', ['exports', 'dummy/app', 'dummy/config/environment', 'ember-flexberry/test-support'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes.autoboot = true;
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('dummy/tests/integration/components/flexberry-checkbox-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-checkbox', 'Integration | Component | flexberry-checkbox', {
    integration: true
  });

  (0, _emberQunit.test)('Component renders properly', function (assert) {
    assert.expect(15);

    this.render(Ember.HTMLBars.template({
      "id": "tLdNS8JB",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"caption\",\"class\"],[[22,[\"caption\"]],[22,[\"class\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component, it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check wrapper <div>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.strictEqual($component.hasClass('flexberry-checkbox'), true, 'Component\'s container has \'flexberry-checkbox\' css-class');
    assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($component.hasClass('checkbox'), true, 'Component\'s wrapper has \'checkbox\' css-class');

    // Check <input>.
    assert.strictEqual($checkboxInput.length === 1, true, 'Component has inner <input>');
    assert.strictEqual($checkboxInput.attr('type'), 'checkbox', 'Component\'s inner <input> is of checkbox type');
    assert.strictEqual($checkboxInput.hasClass('flexberry-checkbox-input'), true, 'Component\'s inner checkbox <input> has flexberry-checkbox-input css-class');
    assert.strictEqual($checkboxInput.hasClass('hidden'), true, 'Component\'s inner checkbox <input> has \'hidden\' css-class');
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked');

    // Check wrapper's additional CSS-classes.
    var additioanlCssClasses = 'radio slider toggle';
    this.set('class', additioanlCssClasses);

    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    this.set('class', '');
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('Component renders it\'s label properly', function (assert) {
    assert.expect(5);

    this.render(Ember.HTMLBars.template({
      "id": "5uyuK0Iw",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"label\"],[[22,[\"label\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component, it's inner <label>.
    var $component = this.$().children();
    var $checkboxLabel = $component.children('label');

    // Check <label>'s text.
    assert.strictEqual($checkboxLabel.length === 1, true, 'Component has inner <label>');
    assert.strictEqual($checkboxLabel.hasClass('flexberry-checkbox-label'), true, 'Component\'s inner <label> has flexberry-checkbox-label css-class');
    assert.strictEqual(Ember.$.trim($checkboxLabel.text()).length === 0, true, 'Component\'s inner <label> is empty by default');

    // Define some label & check <label>'s text again.
    var label = 'This is checkbox';
    this.set('label', label);
    assert.strictEqual(Ember.$.trim($checkboxLabel.text()) === label, true, 'Component\'s inner <label> has text defined in component\'s \'label\' property: \'' + label + '\'');

    // Clean up defined label & check <label>'s text again.
    label = null;
    this.set('label', label);
    assert.strictEqual(Ember.$.trim($checkboxLabel.text()).length === 0, true, 'Component\'s inner <label> is empty if component\'s \'label\' property is cleaned up');
  });

  (0, _emberQunit.test)('Changes in checkbox causes changes in binded value', function (assert) {
    var _this = this;

    assert.expect(9);

    this.render(Ember.HTMLBars.template({
      "id": "rdFET5ht",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"value\"],[[22,[\"flag\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' before first click');
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before first click');
    assert.strictEqual(Ember.typeOf(this.get('flag')), 'undefined', 'Component\'s binded value is \'undefined\' before first click');

    // Imitate click on component (change it's state to checked) & check it's state again.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
    Ember.run(function () {
      $component.click();
      assert.strictEqual($component.hasClass('checked'), true, 'Component has css-class \'checked\' after click');
      assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after click');
      assert.strictEqual(_this.get('flag'), true, 'Component\'s binded value is \'true\' after click');
    });

    // Imitate click on component again (change it's state to unchecked) & check it's state again.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
    Ember.run(function () {
      $component.click();
      assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' after second click');
      assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after second click');
      assert.strictEqual(_this.get('flag'), false, 'Component\'s binded value is \'false\' after second click');
    });
  });

  (0, _emberQunit.test)('Changes in in binded value causes changes in checkbox', function (assert) {
    assert.expect(7);

    this.render(Ember.HTMLBars.template({
      "id": "rdFET5ht",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"value\"],[[22,[\"flag\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' by default');
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked by default');
    assert.strictEqual(Ember.typeOf(this.get('flag')), 'undefined', 'Component\'s binded value is \'undefined\' by default');

    // Change binded value to 'true' & check component's state again (it must be checked).
    this.set('flag', true);
    assert.strictEqual($component.hasClass('checked'), true, 'Component has css-class \'checked\' after binded value changed to \'true\'');
    assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after binded value changed to \'true\'');

    // Change binded value to 'false' & check component's state again (it must be unchecked).
    this.set('flag', false);
    assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' after binded value changed to \'false\'');
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after binded value changed to \'false\'');
  });

  (0, _emberQunit.test)('Component sends \'onChange\' action', function (assert) {
    assert.expect(2);

    var onCheckboxChangeEventObject = null;
    this.set('actions.onCheckboxChange', function (e) {
      onCheckboxChangeEventObject = e;
    });

    this.render(Ember.HTMLBars.template({
      "id": "dqEUCwF1",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"value\",\"onChange\"],[[22,[\"flag\"]],[26,\"action\",[[21,0,[]],\"onCheckboxChange\"],null]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // Imitate click on component (change it's state to checked) & check action's event object.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
    Ember.run(function () {
      $component.click();
      assert.strictEqual(Ember.get(onCheckboxChangeEventObject, 'checked'), true, 'Component sends \'onChange\' action with \'checked\' property equals to \'true\' after first click');
    });

    // Imitate click on component again (change it's state to unchecked) & check action's event object again.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
    Ember.run(function () {
      $component.click();
      assert.strictEqual(Ember.get(onCheckboxChangeEventObject, 'checked'), false, 'Component sends \'onChange\' action with \'checked\' property equals to \'false\' after second click');
    });
  });

  (0, _emberQunit.test)('Component works properly in readonly mode', function (assert) {
    var _this2 = this;

    assert.expect(11);

    var onCheckboxChangeEventObject = null;
    this.set('actions.onCheckboxChange', function (e) {
      onCheckboxChangeEventObject = e;
    });

    this.render(Ember.HTMLBars.template({
      "id": "2G4FJDB7",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"readonly\",\"value\",\"onChange\"],[[22,[\"readonly\"]],[22,[\"flag\"]],[26,\"action\",[[21,0,[]],\"onCheckboxChange\"],null]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    assert.strictEqual($component.hasClass('read-only'), false, 'Component hasn\'t css-class \'read-only\' by default');

    // Enable readonly mode & check component's state again.
    this.set('readonly', true);
    assert.strictEqual($component.hasClass('read-only'), true, 'Component has css-class \'read-only\' when readonly mode is enabled');

    // Imitate click on component (try to change it's state to checked) & check it's state & action's event object.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
    Ember.run(function () {
      $component.click();
      assert.strictEqual(onCheckboxChangeEventObject, null, 'Component doesn\'t send \'onChange\' action in readonly mode');
      assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' after click in readonly mode');
      assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after click in readonly mode');
      assert.strictEqual(Ember.typeOf(_this2.get('flag')), 'undefined', 'Component\'s binded value is still \'undefined\' after click in readonly mode');
    });

    // Disable readonly mode & check component's state again.
    this.set('readonly', false);
    assert.strictEqual($component.hasClass('read-only'), false, 'Component hasn\'t css-class \'read-only\' when readonly mode is disabled');

    // Imitate click on component (try to change it's state to checked) & check it's state & action's event object.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
    Ember.run(function () {
      $component.click();
      assert.strictEqual(Ember.isNone(onCheckboxChangeEventObject), false, 'Component sends \'onChange\' action when readonly mode is disabled');
      assert.strictEqual($component.hasClass('checked'), true, 'Component has css-class \'checked\' after first click when readonly mode is disabled');
      assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after first click when readonly mode is disabled');
      assert.strictEqual(_this2.get('flag'), true, 'Component\'s binded value is equals to \'true\' after first click when readonly mode is disabled');
    });
  });

  (0, _emberQunit.test)('Setting up classes in checkbox', function (assert) {
    assert.expect(6);

    var checkClass = 'radio slider toggle';
    this.set('class', checkClass);
    this.render(Ember.HTMLBars.template({
      "id": "aF1xW7AU",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"value\",\"class\"],[[22,[\"flag\"]],[22,[\"class\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // Check component's initial state.
    assert.strictEqual($component.hasClass('radio'), true, 'Component hasn\'t css-class \'radio\' by default');
    assert.strictEqual($component.hasClass('slider'), true, 'Component hasn\'t css-class \'slider\' by default');
    assert.strictEqual($component.hasClass('toggle'), true, 'Component hasn\'t css-class \'toggle\' by default');

    // Change binded value to 'true' & check component's state again (it must be checked).
    this.set('flag', true);

    // Check component's afther change state.
    assert.strictEqual($component.hasClass('radio'), true, 'Component hasn\'t css-class \'radio\' afther change');
    assert.strictEqual($component.hasClass('slider'), true, 'Component hasn\'t css-class \'slider\' afther change');
    assert.strictEqual($component.hasClass('toggle'), true, 'Component hasn\'t css-class \'toggle\' afther change');
  });
});
define('dummy/tests/integration/components/flexberry-ddau-checkbox-test', ['ember-flexberry/components/flexberry-ddau-checkbox', 'ember-flexberry/mixins/flexberry-ddau-checkbox-actions-handler', 'ember-qunit'], function (_flexberryDdauCheckbox, _flexberryDdauCheckboxActionsHandler, _emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-ddau-checkbox', 'Integration | Component | flexberry-ddau-checkbox', {
    integration: true
  });

  (0, _emberQunit.test)('Component renders properly', function (assert) {
    assert.expect(17);

    this.render(Ember.HTMLBars.template({
      "id": "bedsM4UF",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"caption\",\"class\"],[[22,[\"caption\"]],[22,[\"class\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component, it's inner <input> & <label>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');
    var $checkboxCaption = $component.children('label');

    var flexberryClassNames = _flexberryDdauCheckbox.default.flexberryClassNames;

    // Check wrapper <div>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.strictEqual($component.hasClass(flexberryClassNames.wrapper), true, 'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');
    assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($component.hasClass('checkbox'), true, 'Component\'s wrapper has \'checkbox\' css-class');

    // Check <input>.
    assert.strictEqual($checkboxInput.length === 1, true, 'Component has inner <input>');
    assert.strictEqual($checkboxInput.attr('type'), 'checkbox', 'Component\'s inner <input> is of checkbox type');
    assert.strictEqual($checkboxInput.hasClass(flexberryClassNames.checkboxInput), true, 'Component\'s inner checkbox <input> has \'' + flexberryClassNames.checkboxInput + '\' css-class');
    assert.strictEqual($checkboxInput.hasClass('hidden'), true, 'Component\'s inner checkbox <input> has \'hidden\' css-class');
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked');

    // Check caption's <label>.
    assert.strictEqual($checkboxCaption.length === 1, true, 'Component has inner <label>');
    assert.strictEqual($checkboxCaption.hasClass(flexberryClassNames.checkboxCaption), true, 'Component\'s inner <label> has \'' + flexberryClassNames.checkboxCaption + '\' css-class');
    assert.strictEqual(Ember.$.trim($checkboxCaption.text()).length === 0, true, 'Component\'s inner <label> is empty by default');

    var checkboxCaptionText = 'Checkbox caption';
    this.set('caption', checkboxCaptionText);
    assert.strictEqual(Ember.$.trim($checkboxCaption.text()), checkboxCaptionText, 'Component\'s inner <label> text changes when component\'s \'caption\' property changes');

    // Check wrapper's additional CSS-classes.
    var additioanlCssClasses = 'additional-css-class-name and-another-one';
    this.set('class', additioanlCssClasses);

    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    this.set('class', '');
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('Component invokes actions', function (assert) {
    assert.expect(3);

    var latestEventObjects = {
      change: null
    };

    // Bind component's action handlers.
    this.set('actions.onFlagChange', function (e) {
      latestEventObjects.change = e;
    });
    this.render(Ember.HTMLBars.template({
      "id": "rgT1ZVdB",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"change\"],[[26,\"action\",[[21,0,[]],\"onFlagChange\"],null]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

    // Imitate first click on component.
    $component.click();
    assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after first click');

    // Imitate second click on component.
    latestEventObjects.change = null;
    $component.click();
    assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');
  });

  (0, _emberQunit.test)('Component changes binded value (without \'change\' action handler)', function (testAssert) {
    // Mock Ember.assert method.
    var thrownExceptions = Ember.A();
    var originalEmberAssert = Ember.assert;
    Ember.assert = function () {
      try {
        originalEmberAssert.apply(undefined, arguments);
      } catch (ex) {
        thrownExceptions.pushObject(ex);
      }
    };

    testAssert.expect(4);

    this.set('flag', false);
    this.render(Ember.HTMLBars.template({
      "id": "RkoVMjZ5",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"value\"],[[22,[\"flag\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    testAssert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before click');

    // Imitate click on component & check for exception.
    $component.click();

    // Check component's state after click (it should be changed).
    testAssert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> isn\'t checked after click (without \'change\' action handler)');

    // Check binded value state after click (it should be unchanged, because 'change' action handler is not defined).
    testAssert.strictEqual(this.get('flag'), true, 'Component\'s binded value changed (without \'change\' action handler)');

    testAssert.strictEqual(thrownExceptions.length === 1 && /.*required.*change.*action.*not.*defined.*/gi.test(thrownExceptions[0].message), true, 'Component throws single exception if \'change\' action handler is not defined');

    // Clean up after mock Ember.assert.
    Ember.assert = originalEmberAssert;
  });

  (0, _emberQunit.test)('Component changes binded value (with \'change\' action handler)', function (assert) {
    var _this = this;

    assert.expect(7);

    this.set('flag', false);

    // Bind component's 'change' action handler.
    this.set('actions.onFlagChange', function (e) {
      assert.strictEqual(e.originalEvent.target.id, _this.$('input')[0].id);
      _this.set('flag', e.newValue);
    });

    this.render(Ember.HTMLBars.template({
      "id": "WVc54MPf",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"value\",\"change\"],[[22,[\"flag\"]],[26,\"action\",[[21,0,[]],\"onFlagChange\"],null]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before click');

    // Make component checked.
    $component.click();
    assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after click (with \'change\' action handler)');
    assert.strictEqual(this.get('flag'), true, 'Component\'s binded value changed (with \'change\' action handler)');

    // Make component unchecked.
    $component.click();
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> is unchecked after second click (with \'change\' action handler)');
    assert.strictEqual(this.get('flag'), false, 'Component\' binded value changed after second click (with \'change\' action handler)');
  });

  (0, _emberQunit.test)('Component changes binded value (with \'change\' action handler from special mixin)', function (assert) {
    assert.expect(5);

    this.set('flag', false);

    // Bind component's 'change' action handler from specialized mixin.
    this.set('actions.onCheckboxChange', _flexberryDdauCheckboxActionsHandler.default.mixins[0].properties.actions.onCheckboxChange);

    this.render(Ember.HTMLBars.template({
      "id": "RrZKXti+",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"value\",\"change\"],[[22,[\"flag\"]],[26,\"action\",[[21,0,[]],\"onCheckboxChange\",\"flag\"],null]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before click');

    // Make component checked.
    $component.click();
    assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after click (with \'change\' action handler from special mixin)');
    assert.strictEqual(this.get('flag'), true, 'Component changed binded value (with \'change\' action handler from special mixin)');

    // Make component unchecked.
    $component.click();
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> is unchecked after second click (with \'change\' action handler from special mixin)');
    assert.strictEqual(this.get('flag'), false, 'Component changed binded value after second click (with \'change\' action handler from special mixin)');
  });

  (0, _emberQunit.test)('Component works properly in readonly mode', function (assert) {
    assert.expect(9);

    var latestEventObjects = {
      change: null
    };

    // Bind component's action handlers.
    this.set('actions.onFlagChange', function (e) {
      latestEventObjects.change = e;
    });

    // Render component in readonly mode.
    this.set('flag', false);
    this.set('readonly', true);
    this.render(Ember.HTMLBars.template({
      "id": "67FR1zrZ",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"value\",\"readonly\",\"change\"],[[22,[\"flag\"]],[22,[\"readonly\"]],[26,\"action\",[[21,0,[]],\"onFlagChange\"],null]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before click');

    // Imitate click on component.
    $component.click();

    // Check after click state.
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after click');
    assert.strictEqual(latestEventObjects.change, null, 'Component doesn\'t send \'change\' action in readonly mode');

    // Disable readonly mode.
    this.set('readonly', false);

    // Imitate click on component.
    $component.click();

    // Check after click state.
    assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after click');
    assert.notStrictEqual(latestEventObjects.change, null, 'Component send \'change\' action after readonly mode disabling');

    latestEventObjects.change = null;

    // Imitate click on component.
    $component.click();

    // Check after click state.
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> is unchecked after click');
    assert.notStrictEqual(latestEventObjects.change, null, 'Component send \'change\' action after readonly mode disabling');

    latestEventObjects.change = null;

    // Enable readonly mode again.
    this.set('readonly', true);

    // Imitate click on component.
    $component.click();

    // Check after click state.
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after click');
    assert.strictEqual(latestEventObjects.change, null, 'Component doesn\'t send \'change\' action in readonly mode');
  });
});
define('dummy/tests/integration/components/flexberry-dropdown-test', ['ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit'], function (_i18n, _translations, _translations2, _emberQunit) {
  'use strict';

  var animationDuration = Ember.$.fn.dropdown.settings.duration + 100;

  (0, _emberQunit.moduleForComponent)('flexberry-dropdown', 'Integration | Component | flexberry dropdown', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _translations.default);
      this.register('locale:en/translations', _translations2.default);
      this.register('service:i18n', _i18n.default);

      this.inject.service('i18n', { as: 'i18n' });
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    }
  });

  // Helper method to expand flexberry-dropdown.
  var expandDropdown = function expandDropdown(options) {
    options = options || {};

    var $component = options.dropdown;
    var $menu = $component.children('div.menu');

    var callbacks = Ember.A(options.callbacks || []);

    return new Ember.RSVP.Promise(function (resolve, reject) {

      // Click on component to trigger expand animation.
      Ember.run(function () {
        $component.click();

        // Set timeouts for possibly defined additional callbacks.
        callbacks.forEach(function (callback) {
          setTimeout(callback.callback, callback.timeout);
        });

        // Set timeout for end of expand animation.
        setTimeout(function () {
          if ($component.hasClass('active') && $component.hasClass('visible') && $menu.hasClass('visible')) {
            resolve();
          } else {
            reject(new Error('flexberry-dropdown\'s menu isn\'t expanded'));
          }
        }, animationDuration);
      });
    });
  };

  // Helper method to select item with specified caption from already expanded flexberry-dropdown's menu.
  var selectDropdownItem = function selectDropdownItem(options) {
    options = options || {};

    var $component = options.dropdown;
    var $menu = $component.children('div.menu');

    var itemCaption = options.itemCaption;
    var callbacks = Ember.A(options.callbacks || []);

    return new Ember.RSVP.Promise(function (resolve, reject) {

      // To select some item, menu must be expanded.
      if (!($component.hasClass('active') && $component.hasClass('visible') && $menu.hasClass('visible'))) {
        reject(new Error('flexberry-dropdown\'s menu isn\'t expanded'));
      }

      // To select some item, menu must contain such item (with the specified caption).
      var $item = Ember.$('.item:contains(' + itemCaption + ')', $menu);
      if ($item.length === 0) {
        reject(new Error('flexberry-dropdown\'s menu doesn\'t contain item with caption \'' + itemCaption + '\''));
      }

      // Click on item to select it & trigger collapse animation.
      Ember.run(function () {
        $item.click();

        // Set timeouts for possibly defined additional callbacks.
        callbacks.forEach(function (callback) {
          setTimeout(callback.callback, callback.timeout);
        });

        // Set timeout for end of collapse animation.
        setTimeout(function () {
          if (!($component.hasClass('active') || $component.hasClass('visible') || $menu.hasClass('visible'))) {
            resolve();
          } else {
            reject(new Error('flexberry-dropdown\'s menu isn\'t collapsed'));
          }
        }, animationDuration);
      });
    });
  };

  (0, _emberQunit.test)('it renders properly', function (assert) {
    assert.expect(14);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "oYNzYx2F",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"class\"],[[22,[\"class\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownIcon = $component.children('i.icon');
    var $dropdownText = $component.children('div.text');
    var $dropdownMenu = $component.children('div.menu');

    // Check wrapper <div>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.strictEqual($component.hasClass('flexberry-dropdown'), true, 'Component\'s wrapper has \' flexberry-dropdown\' css-class');
    assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($component.hasClass('selection'), true, 'Component\'s wrapper has \'selection\' css-class');
    assert.strictEqual($component.hasClass('dropdown'), true, 'Component\'s wrapper has \'dropdown\' css-class');
    assert.strictEqual($dropdownIcon.hasClass('dropdown icon'), true, 'Component\'s wrapper has \'dropdown icon\' css-class');
    assert.strictEqual($dropdownText.hasClass('default text'), true, 'Component\'s wrapper has \'default text\' css-class');
    assert.strictEqual($dropdownMenu.hasClass('menu'), true, 'Component\'s wrapper has \'menu\' css-class');

    // Check wrapper's additional CSS-classes.
    var additioanlCssClasses = 'scrolling compact fluid';
    this.set('class', additioanlCssClasses);
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    // Clean up wrapper's additional CSS-classes.
    this.set('class', '');
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('it renders i18n-ed placeholder', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "5bCPYce6",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-dropdown\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownText = $component.children('div.default.text');

    // Check <dropdown>'s placeholder.
    assert.strictEqual(Ember.$.trim($dropdownText.text()), Ember.get(_translations.default, 'components.flexberry-dropdown.placeholder'), 'Component\'s inner <dropdown>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

    // Change current locale to 'en' & check <dropdown>'s placeholder again.
    this.set('i18n.locale', 'en');
    assert.strictEqual(Ember.$.trim($dropdownText.text()), Ember.get(_translations2.default, 'components.flexberry-dropdown.placeholder'), 'Component\'s inner <dropdown>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
  });

  (0, _emberQunit.test)('it renders manually defined placeholder', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "F/Gved3Y",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"placeholder\"],[[22,[\"placeholder\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Set <dropdown>'s placeholder' & render component.
    var placeholder = 'please type some text';
    this.set('placeholder', placeholder);

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownText = $component.children('div.default.text');

    // Check <dropdown>'s placeholder.
    assert.strictEqual(Ember.$.trim($dropdownText.text()), placeholder);

    // Change placeholder's value & check <dropdown>'s placeholder again.
    placeholder = 'dropdown has no value';
    this.set('placeholder', placeholder);
    assert.strictEqual(Ember.$.trim($dropdownText.text()), placeholder);
  });

  (0, _emberQunit.test)('readonly mode works properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "2NTwYzij",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"readonly\"],[true]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownMenu = $component.children('div.menu');

    // Activate readonly mode & check that readonly (disabled) attribute exists now & has value equals to 'readonly'.
    assert.strictEqual($component.hasClass('disabled'), true, 'Component\'s has readonly');

    // Check that component is disabled.
    /* eslint-disable no-unused-vars */
    new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.run(function () {
        $component.click();
      });

      Ember.run(function () {
        var animation = assert.async();
        setTimeout(function () {
          assert.strictEqual($dropdownMenu.hasClass('animating'), false, 'Component is not active');

          animation();
        }, animationDuration / 2);
      });
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('needChecksOnValue mode properly', function (assert) {
    var _this = this;

    var exceptionHandler = Ember.Test.Adapter.exception;
    Ember.Test.Adapter.exception = function (error) {
      throw error;
    };

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "Qnk53n/N",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"value\",\"items\",\"needChecksOnValue\"],[[22,[\"value\"]],[22,[\"itemsArray\"]],[22,[\"needChecksOnValue\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Change property binded to 'value' & check them.
    this.set('needChecksOnValue', true);
    var newValue = 'Caption4';

    // Check that errors handled properly.
    assert.throws(function () {
      _this.set('value', newValue);
    }, new RegExp(newValue));

    Ember.Test.Adapter.exception = exceptionHandler;
  });

  (0, _emberQunit.test)('dropdown with items represented by object renders properly', function (assert) {
    assert.expect(3);

    // Create objects for testing.
    var itemsObject = {
      item1: 'Caption1',
      item2: 'Caption2',
      item3: 'Caption3'
    };
    this.set('itemsObject', itemsObject);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "Ry1dXV6N",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"items\"],[[22,[\"itemsObject\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownMenu = $component.children('div.menu');
    var $dropdownItem = $dropdownMenu.children('div.item');

    // Check component's captions and objects.
    var itemsObjectKeys = Object.keys(itemsObject);
    $dropdownItem.each(function (i) {
      var $item = Ember.$(this);
      var itemKey = itemsObjectKeys[i];

      // Check that the captions matches the objects.
      assert.strictEqual($item.attr('data-value'), itemKey, 'Component\'s item\'s сaptions matches the objects');
    });
  });

  (0, _emberQunit.test)('dropdown with items represented by array renders properly', function (assert) {
    assert.expect(3);

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "1OcXHyQc",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"items\"],[[22,[\"itemsArray\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownMenu = $component.children('div.menu');
    var $dropdownItem = $dropdownMenu.children('div.item');

    // Check component's captions and array.
    $dropdownItem.each(function (i) {
      var $item = Ember.$(this);

      // Check that the captions matches the array.
      assert.strictEqual($item.attr('data-value'), String(i), 'Component\'s item\'s сaptions matches the array');
    });
  });

  (0, _emberQunit.test)('expand animation works properly', function (assert) {
    assert.expect(9);

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "1OcXHyQc",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"items\"],[[22,[\"itemsArray\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownMenu = $component.children('div.menu');

    // Check that component is collapsed by default.
    assert.strictEqual($component.hasClass('active'), false, 'Component hasn\'t class \'active\'');
    assert.strictEqual($component.hasClass('visible'), false, 'Component hasn\'t class \'visible\'');
    assert.strictEqual($dropdownMenu.hasClass('visible'), false, 'Component\'s menu hasn\'t class \'visible\'');
    assert.strictEqual($dropdownMenu.hasClass('hidden'), false, 'Component\'s menu hasn\'t class \'hidden\'');

    var asyncAnimationsCompleted = assert.async();
    expandDropdown({
      dropdown: $component,
      callbacks: [{
        timeout: animationDuration / 2,
        callback: function callback() {

          // Check that component is animating now.
          assert.strictEqual($dropdownMenu.hasClass('animating'), true, 'Component has class \'animating\' during expand animation');
        }
      }]
    }).then(function () {

      // Check that component is expanded now.
      assert.strictEqual($component.hasClass('active'), true, 'Component has class \'active\'');
      assert.strictEqual($component.hasClass('visible'), true, 'Component has class \'visible\'');
      assert.strictEqual($dropdownMenu.hasClass('visible'), true, 'Component\'s menu has class \'visible\'');
      assert.strictEqual($dropdownMenu.hasClass('hidden'), false, 'Component\'s menu hasn\'t class \'hidden\'');
    }).catch(function (e) {
      // Error output.
      assert.ok(false, e);
    }).finally(function () {
      asyncAnimationsCompleted();
    });
  });

  (0, _emberQunit.test)('collapse animation works properly', function (assert) {
    assert.expect(9);

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "1OcXHyQc",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"items\"],[[22,[\"itemsArray\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownMenu = $component.children('div.menu');

    var asyncAnimationsCompleted = assert.async();
    expandDropdown({
      dropdown: $component
    }).then(function () {

      // Check that component is expanded now.
      assert.strictEqual($component.hasClass('active'), true, 'Component has class \'active\'');
      assert.strictEqual($component.hasClass('visible'), true, 'Component has class \'visible\'');
      assert.strictEqual($dropdownMenu.hasClass('visible'), true, 'Component\'s menu has class \'visible\'');
      assert.strictEqual($dropdownMenu.hasClass('hidden'), false, 'Component\'s menu hasn\'t class \'hidden\'');

      // Collapse component.
      var itemCaption = itemsArray[1];
      return selectDropdownItem({
        dropdown: $component,
        itemCaption: itemCaption,
        callbacks: [{
          timeout: animationDuration / 2,
          callback: function callback() {

            // Check that component is animating now.
            assert.strictEqual($dropdownMenu.hasClass('animating'), true, 'Component has class \'animating\' during collapse animation');
          }
        }]
      });
    }).then(function () {

      // Check that component is collapsed now.
      assert.strictEqual($component.hasClass('active'), false, 'Component hasn\'t class \'active\'');
      assert.strictEqual($component.hasClass('visible'), false, 'Component hasn\'t class \'visible\'');
      assert.strictEqual($dropdownMenu.hasClass('visible'), false, 'Component\'s menu hasn\'t class \'visible\'');
      assert.strictEqual($dropdownMenu.hasClass('hidden'), true, 'Component\'s menu has class \'hidden\'');
    }).catch(function (e) {
      // Error output.
      assert.ok(false, e);
    }).finally(function () {
      asyncAnimationsCompleted();
    });
  });

  (0, _emberQunit.test)('changes in inner <dropdown> causes changes in property binded to \'value\'', function (assert) {
    var _this2 = this;

    assert.expect(5);

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);
    this.set('value', null);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "f+1idt22",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"items\",\"value\"],[[22,[\"itemsArray\"]],[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownMenu = $component.children('div.menu');

    // Caption of the item to be selected.
    var itemCaption = itemsArray[2];

    // Select item & perform all necessary checks.
    var asyncAnimationsCompleted = assert.async();
    expandDropdown({
      dropdown: $component
    }).then(function () {

      // Select item & collapse component.
      return selectDropdownItem({
        dropdown: $component,
        itemCaption: itemCaption
      });
    }).then(function () {
      var $selectedItems = $dropdownMenu.children('div.item.active.selected');
      var $selectedItem = Ember.$($selectedItems[0]);
      var $dropdownText = $component.children('div.text');

      // Check that specified item is selected now & it is the only one selected item.
      assert.strictEqual($selectedItems.length, 1, 'Only one component\'s item is active');
      assert.strictEqual(Ember.$.trim($selectedItem.text()), itemCaption, 'Selected item\'s caption is \'' + itemCaption + '\'');

      // Check that dropdown's text <div> has text equals to selected item's caption.
      assert.strictEqual($dropdownText.hasClass('default'), false, 'Component\'s text <div> hasn\'t class \'default\'');
      assert.strictEqual(Ember.$.trim($dropdownText.text()), itemCaption, 'Component\'s text <div> has content equals to selected item \'' + itemCaption + '\'');

      // Check that related model's value binded to dropdown is equals to selected item's caption.
      assert.strictEqual(_this2.get('value'), itemCaption, 'Related model\'s value binded to dropdown is \'' + itemCaption + '\'');
    }).catch(function (e) {
      // Error output.
      assert.ok(false, e);
    }).finally(function () {
      asyncAnimationsCompleted();
    });
  });

  (0, _emberQunit.test)('changes in inner <dropdown> causes call to \'onChange\' action', function (assert) {
    assert.expect(2);

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);
    this.set('value', null);

    var onChangeHasBeenCalled = false;
    var onChangeArgument = void 0;
    this.set('actions.onDropdownChange', function (e) {
      onChangeHasBeenCalled = true;
      onChangeArgument = e;
    });

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "Wt+WeSnd",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"value\",\"items\",\"onChange\"],[[22,[\"value\"]],[22,[\"itemsArray\"]],[26,\"action\",[[21,0,[]],\"onDropdownChange\"],null]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // Caption of the item to be selected.
    var itemCaption = itemsArray[2];

    // Select item & perform all necessary checks.
    var asyncAnimationsCompleted = assert.async();
    expandDropdown({
      dropdown: $component
    }).then(function () {

      // Select item & collapse component.
      return selectDropdownItem({
        dropdown: $component,
        itemCaption: itemCaption
      });
    }).then(function () {

      // Check that 'onChange' action has been called.
      assert.strictEqual(onChangeHasBeenCalled, true, 'Component\'s \'onChange\' action has been called');
      assert.strictEqual(onChangeArgument, itemCaption, 'Component\'s \'onChange\' action has been called with \'' + itemCaption + '\' as argument');
    }).catch(function (e) {
      // Error output.
      assert.ok(false, e);
    }).finally(function () {
      asyncAnimationsCompleted();
    });
  });
});
define('dummy/tests/integration/components/flexberry-error-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-error', 'Integration | Component | flexberry error', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    this.render(Ember.HTMLBars.template({
      "id": "jAayP0on",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-error\",null,[[\"error\",\"modalContext\"],[[22,[\"error\"]],\"body\"]]],false]],\"hasEval\":false}",
      "meta": {}
    }));
    this.set('error', new Error('Error, error, error...'));
    assert.ok(/Error, error, error.../.test(this.$().text()));
  });
});
define('dummy/tests/integration/components/flexberry-field-test', ['ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit'], function (_i18n, _translations, _translations2, _emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-field', 'Integration | Component | flexberry field', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _translations.default);
      this.register('locale:en/translations', _translations2.default);
      this.register('service:i18n', _i18n.default);

      this.inject.service('i18n', { as: 'i18n' });
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    }
  });

  (0, _emberQunit.test)('it renders properly', function (assert) {
    assert.expect(13);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "IwKP+my/",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"class\"],[[22,[\"class\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldTextbox = $component.children('div.flexberry-textbox');

    // Check wrapper <div>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.strictEqual($component.hasClass('flexberry-field'), true, 'Component\'s wrapper has \' flexberry-field\' css-class');
    assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($component.hasClass('field'), true, 'Component\'s wrapper has \'field\' css-class');
    assert.strictEqual($fieldTextbox.length === 1, true, 'Component has inner \'flexberry-textbox\'');

    // Check wrapper's additional CSS-classes.
    var additioanlCssClasses = 'transparent mini huge error';
    this.set('class', additioanlCssClasses);
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    // Clean up wrapper's additional CSS-classes.
    this.set('class', '');
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('label mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "/civMie0",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"class\",\"label\"],[[22,[\"class\"]],[22,[\"label\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Check that label attribute doesn't exist now.
    this.set('label', null);
    assert.strictEqual(this.get('label'), null, 'Component\'s hasn\'t inner <label>');

    // Add text for label & check that label attribute exist.
    var labelText = 'Some text for label';
    this.set('label', labelText);

    assert.strictEqual(this.get('label'), labelText, 'Component has inner <label>');

    // Check that label attribute doesn't exist now.
    this.set('label', null);
    assert.strictEqual(this.get('label'), null, 'Component\'s hasn\'t inner <label>');
  });

  (0, _emberQunit.test)('readonly mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "6FeqLNId",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"class\",\"readonly\"],[[22,[\"class\"]],[22,[\"readonly\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = Ember.$('.flexberry-textbox input', $component);

    // Check that <input>'s readonly attribute doesn't exist yet.
    assert.strictEqual(Ember.$.trim($fieldInput.attr('readonly')), '', 'Component\'s inner <input> hasn\'t readonly attribute by default');

    // Activate readonly mode & check that <input>'s readonly attribute exists now & has value equals to 'readonly'.
    this.set('readonly', true);

    $fieldInput = Ember.$('.flexberry-textbox input', $component);
    assert.strictEqual(Ember.$.trim($fieldInput.attr('readonly')), 'readonly', 'Component\'s inner <input> has readonly attribute with value equals to \'readonly\'');

    // Check that <input>'s readonly attribute doesn't exist now.
    this.set('readonly', false);

    $fieldInput = Ember.$('.flexberry-textbox input', $component);
    assert.strictEqual(Ember.$.trim($fieldInput.attr('readonly')), '', 'Component\'s inner <input> hasn\'t readonly attribute');
  });

  (0, _emberQunit.test)('readonly mode works properly with value', function (assert) {
    var _this = this;

    assert.expect(2);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.set('readonly', true);
    this.render(Ember.HTMLBars.template({
      "id": "W9EvN/jF",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"readonly\",\"value\"],[[22,[\"readonly\"]],[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = Ember.$('.flexberry-textbox input', $component);

    $fieldInput.on('change', function (e) {
      if (_this.get('readonly')) {
        e.stopPropagation();
        $fieldInput.val(null);
      }
    });

    var newValue = 'New value';
    $fieldInput.val(newValue);
    $fieldInput.change();

    // Check <input>'s value not changed.
    assert.strictEqual(Ember.$.trim($fieldInput.val()), '', 'Component\'s inner <input>\'s value not changed');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to unchanged \'value\'');
  });

  (0, _emberQunit.test)('click on field in readonly mode doesn\'t change value & it\'s type', function (assert) {
    assert.expect(3);

    // Set <input>'s value' & render component.
    var value = 123;
    this.set('value', value);
    this.render(Ember.HTMLBars.template({
      "id": "kjfAAAZM",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"readonly\",\"value\"],[true,[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = Ember.$('.flexberry-textbox input', $component);

    $fieldInput.click();
    $fieldInput.change();

    // Check <input>'s value not changed.
    assert.strictEqual(Ember.$.trim($fieldInput.val()), '' + value, 'Component\'s inner <input>\'s value not changed');
    assert.strictEqual(this.get('value'), value, 'Value binded to component\'s \'value\' property is unchanged');
    assert.strictEqual(Ember.typeOf(this.get('value')), 'number', 'Value binded to component\'s \'value\' property is still number');
  });

  (0, _emberQunit.test)('it renders i18n-ed placeholder', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "SjI7NtQV",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-field\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = Ember.$('.flexberry-textbox input', $component);

    // Check <input>'s placeholder.
    assert.strictEqual(Ember.$.trim($fieldInput.attr('placeholder')), Ember.get(_translations.default, 'components.flexberry-field.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

    // Change current locale to 'en' & check <input>'s placeholder again.
    this.set('i18n.locale', 'en');
    assert.strictEqual(Ember.$.trim($fieldInput.attr('placeholder')), Ember.get(_translations2.default, 'components.flexberry-field.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
  });

  (0, _emberQunit.test)('it renders manually defined placeholder', function (assert) {
    assert.expect(2);

    // Set <input>'s placeholder' & render component.
    this.render(Ember.HTMLBars.template({
      "id": "Qm8td5g4",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"placeholder\"],[[22,[\"placeholder\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = Ember.$('.flexberry-textbox input', $component);

    var placeholder = 'input is empty, please type some text';
    this.set('placeholder', placeholder);

    // Check <input>'s placeholder.
    assert.strictEqual(Ember.$.trim($fieldInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

    // Change placeholder's value & check <input>'s placeholder again.
    placeholder = 'input has no value';
    this.set('placeholder', placeholder);
    assert.strictEqual(Ember.$.trim($fieldInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');
  });

  (0, _emberQunit.test)('type mode works properly', function (assert) {
    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "PemiHgzt",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"class\",\"type\"],[[22,[\"class\"]],[22,[\"type\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = Ember.$('.flexberry-textbox input', $component);

    // Check that <input>'s type attribute 'text'.
    this.set('type', 'text');
    assert.strictEqual(Ember.$.trim($fieldInput.attr('type')), 'text', 'Component\'s inner <input> type attribute \'text\'');

    // Check that <input>'s type attribute 'number'.
    this.set('type', 'number');
    assert.strictEqual(Ember.$.trim($fieldInput.attr('type')), 'number', 'Component\'s inner <input> type attribute \'number\'');

    // Check that <input>'s type attribute 'password'.
    this.set('type', 'password');
    assert.strictEqual(Ember.$.trim($fieldInput.attr('type')), 'password', 'Component\'s inner <input> type attribute \'password\'');

    // Check that <input>'s type attribute 'color'.
    this.set('type', 'color');
    assert.strictEqual(Ember.$.trim($fieldInput.attr('type')), 'color', 'Component\'s inner <input> type attribute \'color\'');

    // Check that <input>'s type attribute 'button'.
    this.set('type', 'button');
    assert.strictEqual(Ember.$.trim($fieldInput.attr('type')), 'button', 'Component\'s inner <input> type attribute \'button\'');

    // Check that <input>'s type attribute 'hidden'.
    this.set('type', 'hidden');
    assert.strictEqual(Ember.$.trim($fieldInput.attr('type')), 'hidden', 'Component\'s inner <input> type attribute \'hidden\'');
  });

  (0, _emberQunit.test)('changes in inner <input> causes changes in property binded to \'value\'', function (assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.render(Ember.HTMLBars.template({
      "id": "VmTtyhIv",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = Ember.$('.flexberry-textbox input', $component);

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(Ember.$.trim($fieldInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change <input>'s value (imitate situation when user typed something into component's <input>)
    // & check them again ('change' event is needed to force bindings work).
    var newValue = 'Some text typed into field\'s inner input';
    $fieldInput.val(newValue);
    $fieldInput.change();

    assert.strictEqual(Ember.$.trim($fieldInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });

  (0, _emberQunit.test)('attribute maxlength rendered in html', function (assert) {
    assert.expect(1);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "w2woXa5q",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"maxlength\"],[5]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = Ember.$('.flexberry-textbox input', $component);

    // Check <input>'s maxlength attribute.
    assert.strictEqual($fieldInput.attr('maxlength'), '5', 'Component\'s inner <input>\'s attribute maxlength rendered');
  });

  (0, _emberQunit.test)('changes in property binded to \'value\' causes changes in inner <input>', function (assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.render(Ember.HTMLBars.template({
      "id": "VmTtyhIv",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = Ember.$('.flexberry-textbox input', $component);

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(Ember.$.trim($fieldInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change property binded to 'value' & check them again.
    var newValue = 'Some text typed into field\'s inner input';
    this.set('value', newValue);

    assert.strictEqual(Ember.$.trim($fieldInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });
});
define('dummy/tests/integration/components/flexberry-groupedit-test', ['ember-test-helpers/wait', 'dummy/tests/helpers/start-app', 'ember-qunit', 'ember-flexberry/services/user-settings', 'dummy/models/components-examples/flexberry-groupedit/shared/aggregator', 'dummy/models/ember-flexberry-dummy-suggestion', 'ember-flexberry/components/flexberry-base-component'], function (_wait, _startApp, _emberQunit, _userSettings, _aggregator, _emberFlexberryDummySuggestion, _flexberryBaseComponent) {
  'use strict';

  var App = void 0;

  (0, _emberQunit.moduleForComponent)('flexberry-groupedit', 'Integration | Component | Flexberry groupedit', {
    integration: true,

    beforeEach: function beforeEach() {
      App = (0, _startApp.default)();
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n'),
        userSettingsService: Ember.inject.service('user-settings')
      });

      _userSettings.default.reopen({
        isUserSettingsServiceEnabled: false
      });

      // Just take it and turn it off...
      App.__container__.lookup('service:log').set('enabled', false);
    },

    afterEach: function afterEach() {
      // Restore base component's reference to current controller to its initial state.
      _flexberryBaseComponent.default.prototype.currentController = null;

      Ember.run(App, 'destroy');
    }
  });

  (0, _emberQunit.test)('ember-grupedit element by default test', function (assert) {
    var _this = this;

    assert.expect(9);
    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this.set('model', model);
      _this.set('componentName', testComponentName);
      _this.set('searchForContentChange', true);
      _this.render(Ember.HTMLBars.template({
        "id": "/LNc+cH4",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showAsteriskInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      // Add record.
      var $component = _this.$().children();
      var $componentGroupEditToolbar = $component.children('.groupedit-toolbar');
      var $componentButtons = $componentGroupEditToolbar.children('.ui.button');
      var $componentButtonAdd = Ember.$($componentButtons[0]);

      Ember.run(function () {
        $componentButtonAdd.click();
      });

      andThen(function () {
        var $componentObjectListViewFirstCellAsterisk = Ember.$('.asterisk', $component);

        // Check object-list-view <i>.
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.length === 1, true, 'Component has inner object-list-view-operations blocks');
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('asterisk'), true, 'Component\'s inner object-list-view has \'asterisk\' css-class');
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('small'), true, 'Component\'s inner object-list-view has \'small\' css-class');
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('red'), true, 'Component\'s inner oobject-list-view has \'red\' css-class');
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

        var $componentObjectListViewFirstCell = Ember.$('.object-list-view-helper-column', $component);
        var $flexberryCheckbox = Ember.$('.flexberry-checkbox', $componentObjectListViewFirstCell);

        assert.ok($flexberryCheckbox, 'Component has flexberry-checkbox in first cell blocks');

        var $minusButton = Ember.$('.minus', $componentObjectListViewFirstCell);

        assert.strictEqual($minusButton.length === 0, true, 'Component hasn\'t delete button in first cell');

        var $editMenuButton = Ember.$('.button.right', $component);

        assert.strictEqual($editMenuButton.length === 0, true, 'Component hasn\'t edit menu in last cell');
      });
    });
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    var _this2 = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');

      _this2.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this2.set('model', model);
      _this2.render(Ember.HTMLBars.template({
        "id": "wU3hDn7c",
        "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-groupedit\",null,[[\"modelProjection\",\"content\",\"componentName\"],[[22,[\"proj\"]],[22,[\"model\",\"details\"]],\"my-group-edit\"]]],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.ok(true);
    });
  });

  (0, _emberQunit.test)('it properly rerenders', function (assert) {
    var _this3 = this;

    assert.expect(5);
    var done = assert.async();
    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this3.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this3.set('model', model);
      _this3.set('componentName', testComponentName);
      _this3.set('searchForContentChange', true);
      _this3.render(Ember.HTMLBars.template({
        "id": "ieiQ6Lvy",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.equal(_this3.$('.object-list-view').find('tr').length, 2);

      // Add record.
      var detailModel = _this3.get('model.details');
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '1' }));
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '2' }));

      (0, _wait.default)().then(function () {
        assert.equal(_this3.$('.object-list-view').find('tr').length, 3);

        // Add record.
        detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '3' }));
        (0, _wait.default)().then(function () {
          assert.equal(_this3.$('.object-list-view').find('tr').length, 4);

          // Delete record.
          _this3.get('model.details').get('firstObject').deleteRecord();
          (0, _wait.default)().then(function () {
            assert.equal(_this3.$('.object-list-view').find('tr').length, 3);

            // Disable search for changes flag and add record.
            _this3.set('searchForContentChange', false);
            detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '4' }));
            (0, _wait.default)().then(function () {
              assert.equal(_this3.$('.object-list-view').find('tr').length, 3);
              done();
            });
          });
        });
      });
    });
  });

  (0, _emberQunit.test)('it properly rerenders by default', function (assert) {
    var _this4 = this;

    assert.expect(72);

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this4.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this4.set('model', model);
      _this4.set('componentName', testComponentName);
      _this4.set('searchForContentChange', true);
      _this4.render(Ember.HTMLBars.template({
        "id": "ieiQ6Lvy",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal(_this4.$('.object-list-view').find('tr').length, 2);

      var $detailsAtributes = _this4.get('proj.attributes.details.attributes');
      var $detailsAtributesArray = Object.keys($detailsAtributes);

      var $component = _this4.$().children();
      var $componentGroupEditToolbar = $component.children('.groupedit-toolbar');

      // Check groupedit-toolbar <div>.
      assert.strictEqual($componentGroupEditToolbar.length === 1, true, 'Component has inner groupedit-toolbar block');
      assert.strictEqual($componentGroupEditToolbar.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
      assert.strictEqual($componentGroupEditToolbar.hasClass('ember-view'), true, 'Component\'s inner groupedit-toolbar block has \'ember-view\' css-class');
      assert.strictEqual($componentGroupEditToolbar.hasClass('groupedit-toolbar'), true, 'Component inner has \'groupedit-toolbar\' css-class');

      var $componentButtons = $componentGroupEditToolbar.children('.ui.button');

      // Check button count.
      assert.strictEqual($componentButtons.length === 3, true, 'Component has inner two button blocks');

      var $componentButtonAdd = Ember.$($componentButtons[0]);

      // Check buttonAdd <button>.
      assert.strictEqual($componentButtonAdd.length === 1, true, 'Component has inner button block');
      assert.strictEqual($componentButtonAdd.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
      assert.strictEqual($componentButtonAdd.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
      assert.strictEqual($componentButtonAdd.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');

      var $componentButtonAddIcon = $componentButtonAdd.children('i');

      // Check buttonAddIcon <i>.
      assert.strictEqual($componentButtonAddIcon.length === 1, true, 'Component has inner button block');
      assert.strictEqual($componentButtonAddIcon.prop('tagName'), 'I', 'Component\'s inner groupedit block is a <i>');
      assert.strictEqual($componentButtonAddIcon.hasClass('plus'), true, 'Component\'s inner groupedit block has \'plus\' css-class');
      assert.strictEqual($componentButtonAddIcon.hasClass('icon'), true, 'Component\'s inner groupedit block has \'icon\' css-class');

      var $componentButtonRemove = Ember.$($componentButtons[1]);

      // Check buttonRemove <button>.
      assert.strictEqual($componentButtonRemove.length === 1, true, 'Component has inner button block');
      assert.strictEqual($componentButtonRemove.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
      assert.strictEqual($componentButtonRemove.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
      assert.strictEqual($componentButtonRemove.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');
      assert.strictEqual($componentButtonRemove.hasClass('disabled'), true, 'Component\'s inner groupedit block has \'disabled\' css-class');

      var $componentButtonDefauldSetting = Ember.$($componentButtons[2]);

      // Check buttonRemove <button>.
      assert.strictEqual($componentButtonDefauldSetting.length === 1, true, 'Component has inner button block');
      assert.strictEqual($componentButtonDefauldSetting.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
      assert.strictEqual($componentButtonDefauldSetting.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
      assert.strictEqual($componentButtonDefauldSetting.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');

      var $componentButtonRemoveIcon = $componentButtonRemove.children('i');

      // Check componentButtonRemove <i>.
      assert.strictEqual($componentButtonRemoveIcon.length === 1, true, 'Component has inner button block');
      assert.strictEqual($componentButtonRemoveIcon.prop('tagName'), 'I', 'Component\'s inner groupedit block is a <i>');
      assert.strictEqual($componentButtonRemoveIcon.hasClass('minus'), true, 'Component\'s inner groupedit block has \'minus\' css-class');
      assert.strictEqual($componentButtonRemoveIcon.hasClass('icon'), true, 'Component\'s inner groupedit block has \'icon\' css-class');

      var $componentListViewContainer = $component.children('.object-list-view-container');

      // Check list-view-container <div>.
      assert.strictEqual($componentListViewContainer.length === 1, true, 'Component has inner list-view-container block');
      assert.strictEqual($componentListViewContainer.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
      assert.strictEqual($componentListViewContainer.hasClass('ember-view'), true, 'Component\'s inner list-view-container block has \'ember-view\' css-class');
      assert.strictEqual($componentListViewContainer.hasClass('object-list-view-container'), true, 'Component has \'object-list-view-container\' css-class');

      var $componentJCLRgrips = $componentListViewContainer.children('.JCLRgrips');

      // Check JCLRgrips <div>.
      assert.strictEqual($componentJCLRgrips.length === 1, true, 'Component has inner JCLRgrips blocks');
      assert.strictEqual($componentJCLRgrips.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
      assert.strictEqual($componentJCLRgrips.hasClass('JCLRgrips'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');

      var $componentJCLRgrip = $componentJCLRgrips.children('.JCLRgrip');

      // Check JCLRgrip <div>.
      assert.strictEqual($componentJCLRgrip.length === 7, true, 'Component has inner JCLRgrip blocks');

      var $componentJCLRgripFirst = Ember.$($componentJCLRgrip[0]);

      // Check first JCLRgrip <div>.
      assert.strictEqual($componentJCLRgripFirst.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
      assert.strictEqual($componentJCLRgripFirst.hasClass('JCLRgrip'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');

      var $componentJCLRgripLast = Ember.$($componentJCLRgrip[6]);

      // Check last JCLRgrip <div>.
      assert.strictEqual($componentJCLRgripLast.length === 1, true, 'Component has inner JCLRgrips blocks');
      assert.strictEqual($componentJCLRgripLast.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
      assert.strictEqual($componentJCLRgripLast.hasClass('JCLRgrip'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');
      assert.strictEqual($componentJCLRgripLast.hasClass('JCLRLastGrip'), true, 'Component\'s inner list-view-container block has \'JCLRLastGrip\' css-class');

      var $componentObjectListView = $componentListViewContainer.children('.object-list-view');

      // Check object-list-view <div>.
      assert.strictEqual($componentObjectListView.length === 1, true, 'Component has inner object-list-view blocks');
      assert.strictEqual($componentObjectListView.prop('tagName'), 'TABLE', 'Component\'s inner component block is a <table>');
      assert.strictEqual($componentObjectListView.hasClass('object-list-view'), true, 'Component has \'object-list-view\' css-class');
      assert.strictEqual($componentObjectListView.hasClass('ui'), true, 'Component\'s inner object-list-view block has \'ui\' css-class');
      assert.strictEqual($componentObjectListView.hasClass('unstackable'), true, 'Component\'s inner object-list-view block has \'unstackable\' css-class');
      assert.strictEqual($componentObjectListView.hasClass('celled'), true, 'Component\'s inner object-list-view block has \'celled\' css-class');
      assert.strictEqual($componentObjectListView.hasClass('striped'), false, 'Component\'s inner object-list-view block has \'striped\' css-class');
      assert.strictEqual($componentObjectListView.hasClass('table'), true, 'Component\'s inner object-list-view block has \'table\' css-class');
      assert.strictEqual($componentObjectListView.hasClass('fixed'), true, 'Component\'s inner object-list-view block has \'fixed\' css-class');
      assert.strictEqual($componentObjectListView.hasClass('JColResizer'), true, 'Component\'s inner object-list-view block has \'JColResizer\' css-class');
      assert.strictEqual($componentObjectListView.hasClass('rowClickable'), false, 'Component\'s inner object-list-view block has \'striped\' css-class');

      var $componentObjectListViewThead = $componentObjectListView.children('thead');
      var $componentObjectListViewTr = $componentObjectListViewThead.children('tr');
      var $componentObjectListViewThFirstCell = $componentObjectListViewTr.children('.object-list-view-operations');

      // Check object-list-view <th>.
      assert.strictEqual($componentObjectListViewThFirstCell.length === 1, true, 'Component has inner object-list-view-operations blocks');
      assert.strictEqual($componentObjectListViewThFirstCell.prop('tagName'), 'TH', 'Component\'s inner component block is a <th>');
      assert.strictEqual($componentObjectListViewThFirstCell.hasClass('object-list-view-operations'), true, 'Component has \'object-list-view-operations\' css-class');
      assert.strictEqual($componentObjectListViewThFirstCell.hasClass('collapsing'), true, 'Component has \'collapsing\' css-class');

      var $componentObjectListViewThs = $componentObjectListViewTr.children('.dt-head-left');

      // Check object-list-view <th>.
      assert.strictEqual($componentObjectListViewThs.length === 6, true, 'Component has inner object-list-view-operations blocks');

      var $componentObjectListViewTh = Ember.$($componentObjectListViewThs[0]);

      // Check object-list-view <th>.
      assert.strictEqual($componentObjectListViewTh.length === 1, true, 'Component has inner object-list-view-operations blocks');
      assert.strictEqual($componentObjectListViewTh.prop('tagName'), 'TH', 'Component\'s inner component block is a <th>');
      assert.strictEqual($componentObjectListViewTh.hasClass('dt-head-left'), true, 'Component has \'object-list-view-operations\' css-class');
      assert.strictEqual($componentObjectListViewTh.hasClass('me'), true, 'Component\'s inner object-list-view-operations has \'collapsing\' css-class');
      assert.strictEqual($componentObjectListViewTh.hasClass('class'), true, 'Component\'s inner object-list-view-operations has \'collapsing\' css-class');

      for (var index = 0; index < 6; ++index) {
        assert.strictEqual($componentObjectListViewThs[index].innerText.trim().toLowerCase(), $detailsAtributesArray[index], 'title ok');
      }

      var $componentObjectListViewThDiv = $componentObjectListViewTh.children('div');
      var $componentObjectListViewThDivSpan = $componentObjectListViewThDiv.children('span');

      // Check object-list-view <span>.
      assert.strictEqual($componentObjectListViewThDivSpan.length === 1, true, 'Component has inner <span> blocks');

      var $componentObjectListViewBody = $componentObjectListView.children('tbody');
      $componentObjectListViewTr = $componentObjectListViewBody.children('tr');
      var $componentObjectListViewTd = $componentObjectListViewTr.children('td');
      var $componentObjectListViewTdInner = $componentObjectListViewTd[0];

      // Check object-list-view <td>.
      assert.strictEqual($componentObjectListViewTd.length === 1, true, 'Component has inner object-list-view-operations blocks');
      assert.strictEqual($componentObjectListViewTd.prop('tagName'), 'TD', 'Component\'s inner component block is a <th>');
      assert.strictEqual($componentObjectListViewTdInner.innerText, 'Нет данных', 'Component\'s inner component block is a <th>');
    });
  });

  (0, _emberQunit.test)('ember-grupedit placeholder test', function (assert) {
    var _this5 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this5.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this5.set('model', model);
      _this5.set('componentName', testComponentName);

      var tempText = 'Temp text.';

      _this5.set('placeholder', tempText);
      _this5.render(Ember.HTMLBars.template({
        "id": "4scvnOp5",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"placeholder\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"placeholder\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $componentObjectListView = Ember.$('.object-list-view');
      var $componentObjectListViewBody = $componentObjectListView.children('tbody');

      assert.strictEqual($componentObjectListViewBody.text().trim(), tempText, 'Component has placeholder: ' + tempText);
    });
  });

  (0, _emberQunit.test)('ember-grupedit striped test', function (assert) {
    var _this6 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this6.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this6.set('model', model);
      _this6.set('componentName', testComponentName);
      _this6.set('searchForContentChange', true);
      _this6.render(Ember.HTMLBars.template({
        "id": "0J767blZ",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"tableStriped\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],false]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $componentObjectListView = Ember.$('.object-list-view');

      // Check object-list-view <div>.
      assert.strictEqual($componentObjectListView.hasClass('striped'), false, 'Component\'s inner object-list-view block has \'striped\' css-class');
    });
  });

  (0, _emberQunit.test)('ember-grupedit off defaultSettingsButton, createNewButton and deleteButton test', function (assert) {
    var _this7 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this7.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this7.set('model', model);
      _this7.set('componentName', testComponentName);
      _this7.set('searchForContentChange', true);
      _this7.render(Ember.HTMLBars.template({
        "id": "bo7EKbr+",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"createNewButton\",\"deleteButton\",\"showCheckBoxInRow\",\"showAsteriskInRow\",\"defaultSettingsButton\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],false,false,false,false,false]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $component = _this7.$().children();
      var $componentButtons = Ember.$('.ui.button', $component);

      assert.strictEqual($componentButtons.length === 0, true, 'Component hasn\'t inner two button blocks');
    });
  });

  (0, _emberQunit.test)('ember-grupedit allowColumnResize test', function (assert) {
    var _this8 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this8.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this8.set('model', model);
      _this8.set('componentName', testComponentName);
      _this8.set('searchForContentChange', true);
      _this8.render(Ember.HTMLBars.template({
        "id": "JcPxk/B6",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showEditMenuItemInRow\",\"allowColumnResize\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true,false]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $componentJCLRgrips = Ember.$(Ember.$('.JCLRgrips')[0]);

      // Check JCLRgrips <div>.
      assert.strictEqual($componentJCLRgrips.length === 0, true, 'Component hasn\'t inner JCLRgrips blocks');

      var $componentObjectListView = Ember.$(Ember.$('.object-list-view')[0]);

      // Check object-list-view <div>.
      assert.strictEqual($componentObjectListView.hasClass('JColResizer'), false, 'Component\'s inner object-list-view block hasn\'t \'JColResizer\' css-class');
    });
  });

  (0, _emberQunit.test)('ember-grupedit showAsteriskInRow test', function (assert) {
    var _this9 = this;

    assert.expect(1);
    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this9.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this9.set('model', model);
      _this9.set('componentName', testComponentName);
      _this9.set('searchForContentChange', true);
      _this9.render(Ember.HTMLBars.template({
        "id": "Z9XTQZNp",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showAsteriskInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],false]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      // Add record.
      var $componentButtonAdd = Ember.$(Ember.$('.ui.button')[0]);

      Ember.run(function () {
        $componentButtonAdd.click();
      });

      andThen(function () {
        var $componentObjectListViewFirstCell = Ember.$('.asterisk');

        // Check object-list-view <i>.
        assert.strictEqual($componentObjectListViewFirstCell.length === 0, true, 'Component has small red asterisk blocks');
      });
    });
  });

  (0, _emberQunit.test)('ember-grupedit showCheckBoxInRow test', function (assert) {
    var _this10 = this;

    assert.expect(2);
    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this10.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this10.set('model', model);
      _this10.set('componentName', testComponentName);
      _this10.set('searchForContentChange', true);
      _this10.render(Ember.HTMLBars.template({
        "id": "KKlXRzM7",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showCheckBoxInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],false]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      // Add record.
      var $componentButtonAdd = Ember.$(Ember.$('.ui.button')[0]);

      Ember.run(function () {
        $componentButtonAdd.click();
      });

      andThen(function () {
        var $flexberryCheckbox = Ember.$('.flexberry-checkbox');

        assert.ok($flexberryCheckbox, false, 'Component hasn\'t flexberry-checkbox in first cell');

        var $componentObjectListViewEditMenu = Ember.$('.button.right.pointing');

        assert.strictEqual($componentObjectListViewEditMenu.length === 0, true, 'Component hasn\'t edit menu in last cell');
      });
    });
  });

  (0, _emberQunit.test)('ember-grupedit showDeleteButtonInRow test', function (assert) {
    var _this11 = this;

    assert.expect(1);
    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this11.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this11.set('model', model);
      _this11.set('componentName', testComponentName);
      _this11.set('searchForContentChange', true);
      _this11.render(Ember.HTMLBars.template({
        "id": "Y9WWHMdO",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showDeleteButtonInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $componentButtonAdd = Ember.$(Ember.$('.ui.button')[0]);

      Ember.run(function () {
        $componentButtonAdd.click();
      });

      andThen(function () {
        var $componentObjectListViewFirstCell = Ember.$('.object-list-view-helper-column');
        var $minusButton = Ember.$('.minus', $componentObjectListViewFirstCell);

        assert.strictEqual($minusButton.length === 1, true, 'Component has delete button in first cell');
      });
    });
  });

  (0, _emberQunit.test)('ember-grupedit showEditMenuItemInRow test', function (assert) {
    var _this12 = this;

    assert.expect(6);
    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this12.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this12.set('model', model);
      _this12.set('componentName', testComponentName);
      _this12.set('searchForContentChange', true);
      _this12.render(Ember.HTMLBars.template({
        "id": "seAsRGdp",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showEditMenuItemInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $component = _this12.$().children();
      var $componentButtonAdd = Ember.$(Ember.$('.ui.button')[0]);

      Ember.run(function () {
        $componentButtonAdd.click();
      });

      andThen(function () {
        var $editMenuButton = Ember.$('.button.right', $component);
        var $editMenuItem = Ember.$('.item', $editMenuButton);

        assert.strictEqual($editMenuItem.length === 1, true, 'Component has edit menu item in last cell');

        var $editMenuItemIcon = $editMenuItem.children('.edit');

        assert.strictEqual($editMenuItemIcon.length === 1, true, 'Component has only edit menu item in last cell');
        assert.strictEqual($editMenuItemIcon.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
        assert.strictEqual($editMenuItemIcon.hasClass('edit'), true, 'Component\'s inner object-list-view has \'edit\' css-class');
        assert.strictEqual($editMenuItemIcon.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

        var $editMenuItemSpan = $editMenuItem.children('span');
        assert.strictEqual($editMenuItemSpan.text().trim(), 'Редактировать запись', 'Component has edit menu item in last cell');
      });
    });
  });

  (0, _emberQunit.test)('ember-grupedit showDeleteMenuItemInRow test', function (assert) {
    var _this13 = this;

    assert.expect(6);
    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this13.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this13.set('model', model);
      _this13.set('componentName', testComponentName);
      _this13.set('searchForContentChange', true);
      _this13.render(Ember.HTMLBars.template({
        "id": "GHq3vlJI",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showDeleteMenuItemInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $component = _this13.$().children();
      var $componentButtonAdd = Ember.$(Ember.$('.ui.button')[0]);

      Ember.run(function () {
        $componentButtonAdd.click();
      });

      andThen(function () {
        var $editMenuButton = Ember.$('.button.right', $component);
        var $editMenuItem = Ember.$('.item', $editMenuButton);

        assert.strictEqual($editMenuItem.length === 1, true, 'Component has delete menu item in last cell');

        var $editMenuItemIcon = $editMenuItem.children('.trash');

        assert.strictEqual($editMenuItemIcon.length === 1, true, 'Component has only edit menu item in last cell');
        assert.strictEqual($editMenuItemIcon.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
        assert.strictEqual($editMenuItemIcon.hasClass('trash'), true, 'Component\'s inner object-list-view has \'edit\' css-class');
        assert.strictEqual($editMenuItemIcon.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

        var $editMenuItemSpan = $editMenuItem.children('span');
        assert.strictEqual($editMenuItemSpan.text().trim(), 'Удалить запись', 'Component has delete menu item in last cell');
      });
    });
  });

  (0, _emberQunit.test)('ember-grupedit showEditMenuItemInRow and showDeleteMenuItemInRow test', function (assert) {
    var _this14 = this;

    assert.expect(10);
    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this14.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this14.set('model', model);
      _this14.set('componentName', testComponentName);
      _this14.set('searchForContentChange', true);
      _this14.render(Ember.HTMLBars.template({
        "id": "X/KUQzm3",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showEditMenuItemInRow\",\"showDeleteMenuItemInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true,true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $component = _this14.$().children();
      var $componentButtonAdd = Ember.$(Ember.$('.ui.button')[0]);

      Ember.run(function () {
        $componentButtonAdd.click();
      });

      andThen(function () {
        var $editMenuButton = Ember.$('.button.right', $component);
        var $editMenuItem = Ember.$('.item', $editMenuButton);

        assert.strictEqual($editMenuItem.length === 2, true, 'Component has edit menu and delete menu item in last cell');

        var $editMenuItemIcon = $editMenuItem.children('.edit');

        assert.strictEqual($editMenuItemIcon.length === 1, true, 'Component has edit menu item in last cell');
        assert.strictEqual($editMenuItemIcon.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
        assert.strictEqual($editMenuItemIcon.hasClass('edit'), true, 'Component\'s inner object-list-view has \'edit\' css-class');
        assert.strictEqual($editMenuItemIcon.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

        $editMenuItemIcon = $editMenuItem.children('.trash');

        assert.strictEqual($editMenuItemIcon.length === 1, true, 'Component has edit menu item in last cell');
        assert.strictEqual($editMenuItemIcon.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
        assert.strictEqual($editMenuItemIcon.hasClass('trash'), true, 'Component\'s inner object-list-view has \'edit\' css-class');
        assert.strictEqual($editMenuItemIcon.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

        var $editMenuItemSpan = $editMenuItem.children('span');
        assert.strictEqual($editMenuItemSpan.text().trim(), 'Редактировать записьУдалить запись', 'Component has edit menu and delete menu item in last cell');
      });
    });
  });

  (0, _emberQunit.test)('ember-grupedit rowClickable test', function (assert) {
    var _this15 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this15.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this15.set('model', model);
      _this15.set('componentName', testComponentName);
      _this15.set('searchForContentChange', true);
      _this15.render(Ember.HTMLBars.template({
        "id": "G/bwSCG0",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"rowClickable\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $componentObjectListView = Ember.$('.object-list-view');

      // Check object-list-view <div>.
      assert.strictEqual($componentObjectListView.hasClass('selectable'), true, 'Component\'s inner object-list-view block has \'selectable\' css-class');
    });
  });

  (0, _emberQunit.test)('ember-grupedit buttonClass test', function (assert) {
    var _this16 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';
      var tempButtonClass = 'temp button class';

      _this16.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this16.set('model', model);
      _this16.set('componentName', testComponentName);
      _this16.set('buttonClass', tempButtonClass);
      _this16.render(Ember.HTMLBars.template({
        "id": "htLUA7Ap",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"rowClickable\",\"buttonClass\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],true,[22,[\"buttonClass\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $componentButtonAdd = Ember.$(Ember.$('.ui.button')[0]);

      assert.strictEqual($componentButtonAdd.hasClass(tempButtonClass), true, 'Button has class ' + tempButtonClass);
    });
  });

  (0, _emberQunit.test)('ember-grupedit customTableClass test', function (assert) {
    var _this17 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';
      var myCustomTableClass = 'tempcustomTableClass';

      _this17.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this17.set('model', model);
      _this17.set('componentName', testComponentName);
      _this17.set('customTableClass', myCustomTableClass);
      _this17.render(Ember.HTMLBars.template({
        "id": "i9Orxd/y",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"rowClickable\",\"customTableClass\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],true,[22,[\"customTableClass\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $componentObjectListView = Ember.$('.object-list-view');

      assert.strictEqual($componentObjectListView.hasClass(myCustomTableClass), true, 'Table has class ' + myCustomTableClass);
    });
  });

  (0, _emberQunit.test)('ember-grupedit orderable test', function (assert) {
    var _this18 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this18.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this18.set('model', model);
      _this18.set('componentName', testComponentName);
      _this18.set('orderable', true);
      _this18.render(Ember.HTMLBars.template({
        "id": "HoxVG+Rh",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"orderable\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"orderable\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $componentObjectListView = Ember.$('.object-list-view');
      var $componentObjectListViewTh = $componentObjectListView.children('thead').children('tr').children('th');
      var $componentOlvFirstHead = Ember.$($componentObjectListViewTh[1]);

      Ember.run(function () {
        $componentOlvFirstHead.click();
      });

      var $componentOlvFirstDiv = $componentOlvFirstHead.children('div');
      var $orderIcon = $componentOlvFirstDiv.children('div');

      assert.strictEqual($orderIcon.length === 1, true, 'Table has order');
    });
  });

  (0, _emberQunit.test)('ember-grupedit menuInRowAdditionalItems without standart element test', function (assert) {
    var _this19 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';
      var tempMenuInRowAdditionalItems = [{
        icon: 'remove icon',
        title: 'Temp menu item',
        actionName: 'tempAction'
      }];

      _this19.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this19.set('model', model);
      _this19.set('componentName', testComponentName);
      _this19.set('menuInRowAdditionalItems', tempMenuInRowAdditionalItems);
      _this19.render(Ember.HTMLBars.template({
        "id": "M3K8nyz0",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"menuInRowAdditionalItems\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"menuInRowAdditionalItems\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $addButton = Ember.$(Ember.$('.ui.button')[0]);

      Ember.run(function () {
        $addButton.click();
      });

      var componentOLVMenu = Ember.$('.button.right');
      var componentOLVMenuItem = componentOLVMenu.children('div').children('.item');

      assert.strictEqual(componentOLVMenuItem.length === 1, true, 'Component OLVMenuItem has only adding item');
      assert.strictEqual(componentOLVMenuItem.text().trim() === 'Temp menu item', true, 'Component OLVMenuItem text is \'Temp menu item\'');

      var componentOLVMenuItemIcon = componentOLVMenuItem.children('.icon');

      assert.strictEqual(componentOLVMenuItemIcon.hasClass('icon'), true, 'Component OLVMenuItemIcon has class icon');
      assert.strictEqual(componentOLVMenuItemIcon.hasClass('remove'), true, 'Component OLVMenuItemIcon has class remove');
    });
  });

  (0, _emberQunit.test)('ember-grupedit menuInRowAdditionalItems with standart element test', function (assert) {
    var _this20 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';
      var tempMenuInRowAdditionalItems = [{
        icon: 'remove icon',
        title: 'Temp menu item',
        actionName: 'tempAction'
      }];

      _this20.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this20.set('model', model);
      _this20.set('componentName', testComponentName);
      _this20.set('menuInRowAdditionalItems', tempMenuInRowAdditionalItems);
      _this20.render(Ember.HTMLBars.template({
        "id": "0gq0ZWUa",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"menuInRowAdditionalItems\",\"showEditMenuItemInRow\",\"showDeleteMenuItemInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"menuInRowAdditionalItems\"]],true,true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $addButton = Ember.$(Ember.$('.ui.button')[0]);

      Ember.run(function () {
        $addButton.click();
      });

      var componentOLVMenu = Ember.$('.button.right');
      var componentOLVMenuItem = componentOLVMenu.children('div').children('.item');

      assert.strictEqual(componentOLVMenuItem.length === 3, true, 'Component OLVMenuItem has standart and adding items');
    });
  });

  (0, _emberQunit.test)('ember-grupedit model projection test', function (assert) {
    var _this21 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this21.set('proj', _aggregator.default.projections.get('ConfigurateRowView'));
      _this21.set('model', model);
      _this21.set('componentName', testComponentName);
      _this21.render(Ember.HTMLBars.template({
        "id": "os+LRmZK",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var componentOLV = Ember.$('.object-list-view');
      var componentOLVThead = componentOLV.children('thead').children('tr').children('th');

      assert.strictEqual(componentOLVThead.length === 3, true, 'Component has \'ConfigurateRowView\' projection');
    });
  });

  (0, _emberQunit.test)('ember-grupedit main model projection test', function (assert) {
    var _this22 = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('ember-flexberry-dummy-suggestion');
      var testComponentName = 'my-test-component-to-count-rerender';
      var valueMainModelProjection = model.get('i18n').t('models.ember-flexberry-dummy-suggestion.projections.SuggestionMainModelProjectionTest.userVotes.voteType.__caption__');

      _this22.set('proj', _emberFlexberryDummySuggestion.default.projections.get('SuggestionMainModelProjectionTest'));
      _this22.set('model', model);
      _this22.set('componentName', testComponentName);
      _this22.render(Ember.HTMLBars.template({
        "id": "Fzime7cI",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"componentName\",\"content\",\"modelProjection\",\"mainModelProjection\"],[[22,[\"componentName\"]],[22,[\"model\",\"userVotes\"]],[22,[\"proj\",\"attributes\",\"userVotes\"]],[22,[\"proj\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var $componentObjectListView = Ember.$('.object-list-view');
      var $componentObjectListViewTh = $componentObjectListView.children('thead').children('tr').children('th');
      var $componentOlvFirstHead = $componentObjectListViewTh[1];

      assert.strictEqual($componentOlvFirstHead.innerText === valueMainModelProjection.toString(), true, 'Header has text \'Vote type\'');
    });
  });
});
define('dummy/tests/integration/components/flexberry-lookup-test', ['ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (_i18n, _translations, _translations2, _emberQunit, _startApp, _destroyApp) {
  'use strict';

  var app = void 0;

  (0, _emberQunit.moduleForComponent)('flexberry-lookup', 'Integration | Component | flexberry lookup', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _translations.default);
      this.register('locale:en/translations', _translations2.default);
      this.register('service:i18n', _i18n.default);

      this.inject.service('i18n', { as: 'i18n' });
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      this.set('i18n.locale', 'ru');
      app = (0, _startApp.default)();

      // Just take it and turn it off...
      app.__container__.lookup('service:log').set('enabled', false);
    },
    afterEach: function afterEach() {
      (0, _destroyApp.default)(app);
    }
  });

  (0, _emberQunit.test)('component renders properly', function (assert) {
    assert.expect(31);

    this.render(Ember.HTMLBars.template({
      "id": "E9riANNk",
      "block": "{\"symbols\":[],\"statements\":[[4,\"flexberry-lookup\",null,[[\"placeholder\"],[\"(тестовое значение)\"]],{\"statements\":[],\"parameters\":[]},null]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component, it's inner <input>.
    var $component = this.$().children();
    var $lookupFluid = $component.children('.fluid');
    var $lookupInput = $lookupFluid.children('.lookup-field');
    var $lookupButtonPreview = $lookupFluid.children('.ui-preview');
    var $lookupButtonChoose = $lookupFluid.children('.ui-change');
    var $lookupButtonClear = $lookupFluid.children('.ui-clear');
    var $lookupButtonClearIcon = $lookupButtonClear.children('.remove');

    // Check wrapper <flexberry-lookup>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
    assert.strictEqual($component.hasClass('flexberry-lookup'), true, 'Component\'s container has \'flexberry-lookup\' css-class');
    assert.strictEqual($component.hasClass('ember-view'), true, 'Component\'s wrapper has \'ember-view\' css-class');

    // Check wrapper <fluid>.
    assert.strictEqual($lookupFluid.length === 1, true, 'Component has inner title block');
    assert.strictEqual($lookupFluid.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
    assert.strictEqual($lookupFluid.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($lookupFluid.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');
    assert.strictEqual($lookupFluid.hasClass('action'), true, 'Component\'s wrapper has \'action\' css-class');
    assert.strictEqual($lookupFluid.hasClass('input'), true, 'Component\'s container has \'input\' css-class');

    // Check <input>.
    assert.strictEqual($lookupInput.length === 1, true, 'Component has inner title block');
    assert.strictEqual($lookupInput.prop('tagName'), 'INPUT', 'Component\'s wrapper is a <input>');
    assert.strictEqual($lookupInput.hasClass('lookup-field'), true, 'Component\'s title block has \'lookup-field\' css-class');
    assert.strictEqual($lookupInput.hasClass('ember-view'), true, 'Component\'s title block has \'ember-view\' css-class');
    assert.strictEqual($lookupInput.hasClass('ember-text-field'), true, 'Component\'s title block has \'ember-text-field\' css-class');
    assert.equal($lookupInput.attr('placeholder'), '(тестовое значение)', 'Component\'s container has \'input\' css-class');

    // Check <preview button>.
    assert.strictEqual($lookupButtonPreview.length === 0, true, 'Component has inner title block');

    // Check <choose button>.
    assert.strictEqual($lookupButtonChoose.length === 1, true, 'Component has inner title block');
    assert.strictEqual($lookupButtonChoose.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
    assert.strictEqual($lookupButtonChoose.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
    assert.strictEqual($lookupButtonChoose.hasClass('ui-change'), true, 'Component\'s container has \'ui-change\' css-class');
    assert.strictEqual($lookupButtonChoose.hasClass('button'), true, 'Component\'s container has \'button\' css-class');
    assert.equal($lookupButtonChoose.attr('title'), 'Выбрать');

    // Check <clear button>.
    assert.strictEqual($lookupButtonClear.length === 1, true, 'Component has inner title block');
    assert.strictEqual($lookupButtonClear.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
    assert.strictEqual($lookupButtonClear.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
    assert.strictEqual($lookupButtonClear.hasClass('ui-clear'), true, 'Component\'s container has \'ui-clear\' css-class');
    assert.strictEqual($lookupButtonClear.hasClass('button'), true, 'Component\'s container has \'button\' css-class');

    // Check <clear button icon>
    assert.strictEqual($lookupButtonClearIcon.length === 1, true, 'Component has inner title block');
    assert.strictEqual($lookupButtonClearIcon.prop('tagName'), 'I', 'Component\'s title block is a <i>');
    assert.strictEqual($lookupButtonClearIcon.hasClass('remove'), true, 'Component\'s container has \'remove\' css-class');
    assert.strictEqual($lookupButtonClearIcon.hasClass('icon'), true, 'Component\'s container has \'icon\' css-class');
  });

  (0, _emberQunit.test)('component with readonly renders properly', function (assert) {
    assert.expect(2);

    this.render(Ember.HTMLBars.template({
      "id": "NhaYr0BL",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"readonly\"],[true]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component, it's inner <input>.
    var $component = this.$().children();
    var $lookupFluid = $component.children('.fluid');
    var $lookupButtonChoose = $lookupFluid.children('.ui-change');
    var $lookupButtonClear = $lookupFluid.children('.ui-clear');

    // Check <choose button>.
    assert.strictEqual($lookupButtonChoose.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');

    // Check <clear button>.
    assert.strictEqual($lookupButtonClear.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');
  });

  (0, _emberQunit.test)('component with choose-text and remove-text properly', function (assert) {
    assert.expect(2);
    this.set('tempTextChoose', 'TempText1');
    this.set('tempTextRemove', 'TempText2');

    this.render(Ember.HTMLBars.template({
      "id": "hGBFU4mB",
      "block": "{\"symbols\":[],\"statements\":[[4,\"flexberry-lookup\",null,[[\"chooseText\",\"removeText\"],[[22,[\"tempTextChoose\"]],[22,[\"tempTextRemove\"]]]],{\"statements\":[],\"parameters\":[]},null]],\"hasEval\":false}",
      "meta": {}
    }));

    var $component = this.$().children();
    var $lookupFluid = $component.children('.fluid');
    var $lookupButtonChoose = $lookupFluid.children('.ui-change');
    var $lookupButtonClear = $lookupFluid.children('.ui-clear');

    // Check <choose button>.
    assert.equal($lookupButtonChoose.text().trim(), 'TempText1');

    // Check <clear button>.
    assert.equal($lookupButtonClear.text().trim(), 'TempText2');
  });

  (0, _emberQunit.test)('autocomplete doesn\'t send data-requests in readonly mode', function (assert) {
    var _this = this;

    assert.expect(1);

    var store = app.__container__.lookup('service:store');

    // Override store.query method.
    var ajaxMethodHasBeenCalled = false;
    var originalAjaxMethod = Ember.$.ajax;
    Ember.$.ajax = function () {
      ajaxMethodHasBeenCalled = true;

      return originalAjaxMethod.apply(this, arguments);
    };

    var asyncOperationsCompleted = assert.async();

    this.set('actions.showLookupDialog', function () {});
    this.set('actions.removeLookupValue', function () {});

    this.render(Ember.HTMLBars.template({
      "id": "t6Fqi2rh",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relatedModel\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"choose\",\"remove\",\"readonly\",\"autocomplete\"],[[22,[\"model\",\"parent\"]],[22,[\"model\"]],\"parent\",\"SuggestionTypeL\",\"name\",\"Parent\",[26,\"action\",[[21,0,[]],\"showLookupDialog\"],null],[26,\"action\",[[21,0,[]],\"removeLookupValue\"],null],true,true]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$();
    var $componentInput = Ember.$('input', $component);

    Ember.run(function () {
      _this.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'TestTypeName'
      }));

      var testPromise = new Ember.RSVP.Promise(function (resolve) {
        ajaxMethodHasBeenCalled = false;

        // Imitate focus on component, which can cause async data-requests.
        $componentInput.focusin();

        // Wait for some time which can pass after focus, before possible async data-request will be sent.
        Ember.run.later(function () {
          resolve();
        }, 300);
      });

      testPromise.then(function () {
        // Check that store.query hasn\'t been called after focus.
        assert.strictEqual(ajaxMethodHasBeenCalled, false, '$.ajax hasn\'t been called after click on autocomplete lookup in readonly mode');
      }).finally(function () {
        // Restore original method.
        Ember.$.ajax = originalAjaxMethod;

        asyncOperationsCompleted();
      });
    });
  });

  (0, _emberQunit.test)('preview button renders properly', function (assert) {
    var _this2 = this;

    assert.expect(11);

    var store = app.__container__.lookup('service:store');

    this.render(Ember.HTMLBars.template({
      "id": "yfTeYiZT",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"showPreviewButton\",\"previewFormRoute\"],[[22,[\"model\"]],\"parent\",\"SuggestionTypeL\",\"name\",\"Parent\",true,\"ember-flexberry-dummy-suggestion-type-edit\"]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $lookupFluid = $component.children('.fluid');

    assert.strictEqual($lookupFluid.children('.ui-preview').length === 0, true, 'Component has inner title block');

    Ember.run(function () {
      _this2.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'TestTypeName'
      }));

      var $lookupButtonPreview = $lookupFluid.children('.ui-preview');
      var $lookupButtonPreviewIcon = $lookupButtonPreview.children('.eye');

      assert.strictEqual($lookupButtonPreview.length === 1, true, 'Component has inner title block');
      assert.strictEqual($lookupButtonPreview.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
      assert.strictEqual($lookupButtonPreview.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
      assert.strictEqual($lookupButtonPreview.hasClass('ui-preview'), true, 'Component\'s container has \'ui-preview\' css-class');
      assert.strictEqual($lookupButtonPreview.hasClass('button'), true, 'Component\'s container has \'button\' css-class');
      assert.equal($lookupButtonPreview.attr('title'), 'Просмотр');

      assert.strictEqual($lookupButtonPreviewIcon.length === 1, true, 'Component has inner title block');
      assert.strictEqual($lookupButtonPreviewIcon.prop('tagName'), 'I', 'Component\'s title block is a <i>');
      assert.strictEqual($lookupButtonPreviewIcon.hasClass('eye'), true, 'Component\'s container has \'eye\' css-class');
      assert.strictEqual($lookupButtonPreviewIcon.hasClass('icon'), true, 'Component\'s container has \'icon\' css-class');
    });
  });

  (0, _emberQunit.test)('preview button view previewButtonClass and previewText properly', function (assert) {
    var _this3 = this;

    assert.expect(3);

    var store = app.__container__.lookup('service:store');

    Ember.run(function () {
      _this3.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'TestTypeName'
      }));

      _this3.set('previewButtonClass', 'previewButtonClassTest');
      _this3.set('previewText', 'previewTextTest');

      _this3.render(Ember.HTMLBars.template({
        "id": "qXjDh8Be",
        "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"showPreviewButton\",\"previewFormRoute\",\"previewButtonClass\",\"previewText\"],[[22,[\"model\"]],\"parent\",\"SuggestionTypeL\",\"name\",\"Parent\",true,\"ember-flexberry-dummy-suggestion-type-edit\",[22,[\"previewButtonClass\"]],[22,[\"previewText\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      // Retrieve component.
      var $component = _this3.$().children();
      var $lookupFluid = $component.children('.fluid');
      var $lookupButtonPreview = $lookupFluid.children('.ui-preview');

      assert.strictEqual($lookupButtonPreview.length === 1, true, 'Component has inner title block');
      assert.strictEqual($lookupButtonPreview.hasClass('previewButtonClassTest'), true, 'Component\'s container has \'previewButtonClassTest\' css-class');
      assert.equal($lookupButtonPreview.text().trim(), 'previewTextTest');
    });
  });

  (0, _emberQunit.test)('preview with readonly renders properly', function (assert) {
    var _this4 = this;

    assert.expect(1);

    var store = app.__container__.lookup('service:store');

    Ember.run(function () {
      _this4.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'TestTypeName'
      }));

      _this4.render(Ember.HTMLBars.template({
        "id": "ASa0a1tB",
        "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"showPreviewButton\",\"previewFormRoute\",\"readonly\"],[[22,[\"model\"]],\"parent\",\"SuggestionTypeL\",\"name\",\"Parent\",true,\"ember-flexberry-dummy-suggestion-type-edit\",true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      // Retrieve component.
      var $component = _this4.$().children();
      var $lookupFluid = $component.children('.fluid');
      var $lookupButtonPreview = $lookupFluid.children('.ui-preview');

      assert.strictEqual($lookupButtonPreview.hasClass('disabled'), false, 'Component\'s container has not \'disabled\' css-class');
    });
  });
});
define('dummy/tests/integration/components/flexberry-sidebar-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-sidebar', 'Integration | Component | flexberry-sidebar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    this.render(Ember.HTMLBars.template({
      "id": "GqM6eeCw",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-sidebar\"],false]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.equal(this.$().text().trim(), '');

    this.render(Ember.HTMLBars.template({
      "id": "ATlQLI0U",
      "block": "{\"symbols\":[],\"statements\":[[4,\"flexberry-sidebar\",null,null,{\"statements\":[[0,\"text\"]],\"parameters\":[]},null]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.equal(this.$().text().trim(), 'text');
  });
});
define('dummy/tests/integration/components/flexberry-simpledatetime-test', ['ember-qunit', 'ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations'], function (_emberQunit, _i18n, _translations, _translations2) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-simpledatetime', 'Integration | Component | flexberry simpledatetime', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _translations.default);
      this.register('locale:en/translations', _translations2.default);
      this.register('service:i18n', _i18n.default);

      this.inject.service('i18n', { as: 'i18n' });
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    }
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    this.render(Ember.HTMLBars.template({
      "id": "W16NdrYS",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-simpledatetime\"],false]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.ok(true);
  });

  (0, _emberQunit.test)('render with type before value', function (assert) {
    assert.expect(1);
    var typeName = 'date';
    this.set('type', typeName);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "/FqBGfvC",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-simpledatetime\",null,[[\"type\",\"value\"],[[22,[\"type\"]],[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$();
    var $componentInput = Ember.$('.flatpickr-input.custom-flatpickr', $component);

    // Click on component to open calendar.
    $componentInput.click();

    var $calendar = Ember.$('.flatpickr-calendar');

    // Check calendar.
    assert.strictEqual($calendar.hasClass('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');
  });

  (0, _emberQunit.test)('render with type afther value', function (assert) {
    assert.expect(1);
    var typeName = 'date';
    this.set('type', typeName);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "/qKq9/d4",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-simpledatetime\",null,[[\"value\",\"type\"],[[22,[\"value\"]],[22,[\"type\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$();
    var $componentInput = Ember.$('.flatpickr-input.custom-flatpickr', $component);

    // Click on component to open calendar.
    $componentInput.click();

    var $calendar = Ember.$('.flatpickr-calendar');

    // Check calendar.
    assert.strictEqual($calendar.hasClass('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');
  });
});
define('dummy/tests/integration/components/flexberry-sitemap-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-sitemap', 'Integration | Component | flexberry-sitemap', {
    integration: true
  });

  (0, _emberQunit.test)('it renders and works', function (assert) {
    this.render(Ember.HTMLBars.template({
      "id": "P0xSfbWL",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-sitemap\"],false]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.equal(this.$().text().trim(), '', 'Empty sitemap, empty result.');

    this.render(Ember.HTMLBars.template({
      "id": "eMvZeCrF",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-sitemap\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.equal(this.$().text().trim(), '', 'Block params not used.');

    // this.set('sitemap', {
    //   nodes: [
    //     {
    //       caption: 'Superheroes',
    //       children: [
    //         { link: 'superman', caption: 'Superman' },
    //         { link: 'ironman', caption: 'Ironman' },
    //       ],
    //     },
    //   ],
    // });
    // this.render(hbs`{{flexberry-sitemap sitemap=sitemap}}`);
    // assert.equal(this.$('.title-item-menu:visible').text().trim(), 'Superheroes', 'Menu is closed.');
    // this.$('.title-item-menu:visible').click();
    // assert.equal(this.$('.title-item-menu:visible').text().trim().replace(/\s+/g, ''), 'SuperheroesSupermanIronman', 'Menu is open.');
  });
});
define('dummy/tests/integration/components/flexberry-textarea-test', ['ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit'], function (_i18n, _translations, _translations2, _emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-textarea', 'Integration | Component | flexberry-textarea', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _translations.default);
      this.register('locale:en/translations', _translations2.default);
      this.register('service:i18n', _i18n.default);

      this.inject.service('i18n', { as: 'i18n' });
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    }
  });

  (0, _emberQunit.test)('it renders properly', function (assert) {
    assert.expect(10);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "Wgbr2/S5",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\"],[[22,[\"class\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // Check wrapper <div>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.strictEqual($component.hasClass('flexberry-textarea'), true, 'Component\'s wrapper has \' flexberry-textarea\' css-class');
    assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($component.hasClass('input'), true, 'Component\'s wrapper has \'input\' css-class');

    // Check wrapper's additional CSS-classes.
    var additioanlCssClasses = 'fluid mini huge';
    this.set('class', additioanlCssClasses);
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    // Clean up wrapper's additional CSS-classes.
    this.set('class', '');
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('readonly mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "K2qcPsaA",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"readonly\"],[[22,[\"class\"]],[22,[\"readonly\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s readonly attribute doesn't exist yet.
    assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), '', 'Component\'s inner <textarea> hasn\'t readonly attribute');

    // Activate readonly mode & check that <textarea>'s readonly attribute exists now & has value equals to 'readonly'.
    this.set('readonly', true);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), 'readonly', 'Component\'s inner <textarea> has readonly attribute with value equals to \'readonly\'');

    // Check that <textarea>'s readonly attribute doesn't exist now.
    this.set('readonly', false);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), '', 'Component\'s inner <textarea> hasn\'t readonly attribute');
  });

  (0, _emberQunit.test)('readonly mode works properly with value', function (assert) {
    var _this = this;

    assert.expect(2);

    // Set <textarea>'s value' & render component.
    this.set('value', null);
    this.set('readonly', true);
    this.render(Ember.HTMLBars.template({
      "id": "qq/ZSFhm",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"readonly\",\"value\"],[[22,[\"readonly\"]],[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    $textareaInput.on('change', function (e) {
      if (_this.get('readonly')) {
        e.stopPropagation();
        $textareaInput.val(null);
      }
    });

    var newValue = 'New value';
    $textareaInput.val(newValue);
    $textareaInput.change();

    // Check <textarea>'s value not changed.
    assert.strictEqual(Ember.$.trim($textareaInput.val()), '', 'Component\'s inner <textarea>\'s value not changed');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to unchanged \'value\'');
  });

  (0, _emberQunit.test)('it renders i18n-ed placeholder', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "tz1yXvrh",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-textarea\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check <textarea>'s placeholder.
    assert.strictEqual(Ember.$.trim($textareaInput.attr('placeholder')), Ember.get(_translations.default, 'components.flexberry-textarea.placeholder'), 'Component\'s inner <textarea>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

    // Change current locale to 'en' & check <textarea>'s placeholder again.
    this.set('i18n.locale', 'en');
    assert.strictEqual(Ember.$.trim($textareaInput.attr('placeholder')), Ember.get(_translations2.default, 'components.flexberry-textarea.placeholder'), 'Component\'s inner <textarea>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
  });

  (0, _emberQunit.test)('it renders manually defined placeholder', function (assert) {
    assert.expect(2);

    // Set <textarea>'s placeholder' & render component.
    var placeholder = 'textarea is empty, please type some text';
    this.set('placeholder', placeholder);
    this.render(Ember.HTMLBars.template({
      "id": "RweRkPSr",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"placeholder\"],[[22,[\"placeholder\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check <textarea>'s placeholder.
    assert.strictEqual(Ember.$.trim($textareaInput.attr('placeholder')), placeholder, 'Component\'s inner <textarea>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

    // Change placeholder's value & check <textarea>'s placeholder again.
    placeholder = 'textarea has no value';
    this.set('placeholder', placeholder);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('placeholder')), placeholder, 'Component\'s inner <textarea>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');
  });

  (0, _emberQunit.test)('required mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "P0+F1REW",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"required\"],[[22,[\"class\"]],[22,[\"required\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s required attribute doesn't exist yet.
    assert.strictEqual(Ember.$.trim($textareaInput.attr('required')), '', 'Component\'s inner <textarea> hasn\'t required attribute');

    // Activate required mode & check that <textarea>'s required attribute exists now & has value equals to 'required'.
    this.set('required', true);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('required')), 'required', 'Component\'s inner <textarea> has required attribute with value equals to \'required\'');

    // Check that <textarea>'s required attribute doesn't exist now.
    this.set('required', false);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('required')), '', 'Component\'s inner <textarea> hasn\'t required attribute');
  });

  (0, _emberQunit.test)('disabled mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "AOcMLYEP",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"disabled\"],[[22,[\"class\"]],[22,[\"disabled\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s disabled attribute doesn't exist yet.
    assert.strictEqual(Ember.$.trim($textareaInput.attr('disabled')), '', 'Component\'s inner <textarea> hasn\'t disabled attribute');

    // Activate disabled mode & check that <textarea>'s disabled attribute exists now & has value equals to 'disabled'.
    this.set('disabled', true);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('disabled')), 'disabled', 'Component\'s inner <textarea> has disabled attribute with value equals to \'disabled\'');

    // Check that <textarea>'s disabled attribute doesn't exist now.
    this.set('disabled', false);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('disabled')), '', 'Component\'s inner <textarea> hasn\'t disabled attribute');
  });

  (0, _emberQunit.test)('autofocus mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "xLt1DUdr",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"autofocus\"],[[22,[\"class\"]],[22,[\"autofocus\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s autofocus attribute doesn't exist yet.
    assert.strictEqual(Ember.$.trim($textareaInput.attr('autofocus')), '', 'Component\'s inner <textarea> hasn\'t autofocus attribute');

    // Activate autofocus mode & check that <textarea>'s autofocus attribute exists now & has value equals to 'autofocus'.
    this.set('autofocus', true);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('autofocus')), 'autofocus', 'Component\'s inner <textarea> has autofocus attribute with value equals to \'autofocus\'');

    // Check that <textarea>'s autofocus attribute doesn't exist now.
    this.set('autofocus', false);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('autofocus')), '', 'Component\'s inner <textarea> hasn\'t autofocus attribute');
  });

  (0, _emberQunit.test)('spellcheck mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "Vq4KEuUS",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"spellcheck\"],[[22,[\"class\"]],[22,[\"spellcheck\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s spellcheck attribute doesn't exist yet.
    assert.strictEqual(Ember.$.trim($textareaInput.attr('spellcheck')), '', 'Component\'s inner <textarea> hasn\'t spellcheck attribute');

    // Activate spellcheck mode & check that <textarea>'s spellcheck attribute exists now & has value equals to 'spellcheck'.
    this.set('spellcheck', true);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('spellcheck')), 'true', 'Component\'s inner <textarea> has spellcheck attribute with value equals to \'spellcheck\'');

    // Check that <textarea>'s spellcheck attribute doesn't exist now.
    this.set('spellcheck', false);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('spellcheck')), 'false', 'Component\'s inner <textarea> hasn\'t spellcheck attribute');
  });

  (0, _emberQunit.test)('wrap mode works properly', function (assert) {
    assert.expect(4);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "hhUAsNKD",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"wrap\"],[[22,[\"class\"]],[22,[\"wrap\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s wrap attribute 'soft'.
    this.set('wrap', 'soft');
    assert.strictEqual(Ember.$.trim($textareaInput.attr('wrap')), 'soft', 'Component\'s inner <textarea> wrap attribute \'soft\'');

    // Check that <textarea>'s wrap attribute 'hard'.
    this.set('wrap', 'hard');
    assert.strictEqual(Ember.$.trim($textareaInput.attr('wrap')), 'hard', 'Component\'s inner <textarea> wrap attribute \'hard\'');

    // Check that <textarea>'s wrap attribute 'soft'.
    this.set('wrap', 'soft');
    assert.strictEqual(Ember.$.trim($textareaInput.attr('wrap')), 'soft', 'Component\'s inner <textarea> wrap attribute \'soft\'');

    // Check that <textarea>'s wrap attribute 'off'.
    this.set('wrap', 'off');
    assert.strictEqual(Ember.$.trim($textareaInput.attr('wrap')), 'off', 'Component\'s inner <textarea> wrap attribute \'off\'');
  });

  (0, _emberQunit.test)('rows mode works properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "py1xI1wP",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"rows\"],[[22,[\"class\"]],[22,[\"rows\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Retrieve default rows count for current browser.
    var defaultRowsCount = $textareaInput.prop('rows');

    // Generate random rows count >= 2.
    var rowsValue = Math.floor(Math.random() * 10) + 2;

    // Check that <textarea>'s rows attribute is equals to specified value.
    this.set('rows', rowsValue);
    assert.strictEqual($textareaInput.prop('rows'), rowsValue, 'Component\'s inner <textarea>\'s value \'rows\' is equals to ' + rowsValue);

    // Check that <textarea>'s rows count is switched to default value.
    this.set('rows', null);
    assert.strictEqual($textareaInput.prop('rows'), defaultRowsCount, 'Component\'s inner <textarea>\'s rows count is switched to default value');
  });

  (0, _emberQunit.test)('cols mode works properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "CGpxkJex",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"cols\"],[[22,[\"class\"]],[22,[\"cols\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Retrieve default rows count for current browser.
    var defaultColsCount = $textareaInput.prop('cols');

    // Generate random cols count >= 20.
    var colsValue = Math.floor(Math.random() * 10) + 20;

    // Check that <textarea>'s cols attribute is equals to specified value.
    this.set('cols', colsValue);
    assert.strictEqual($textareaInput.prop('cols'), colsValue, 'Component\'s inner <textarea>\'s value \'cols\' is equals to ' + colsValue);

    // Check that <textarea>'s cols count is switched to default value.
    this.set('cols', null);
    assert.strictEqual($textareaInput.prop('cols'), defaultColsCount, 'Component\'s inner <textarea> hasn\'t value cols attribute');
  });

  (0, _emberQunit.test)('maxlength mode works properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "uGg5RJZ1",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"maxlength\"],[[22,[\"class\"]],[22,[\"maxlength\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    //Generate a random value 'maxlength' and convert to a string.
    var maxlengthValue = '' + Math.floor(Math.random() * 10);

    // Check that <textarea>'s maxlength attribute.
    this.set('maxlength', maxlengthValue);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('maxlength')), maxlengthValue, 'Component\'s inner <textarea>\'s value \'maxlength\' is equals to \'' + maxlengthValue + '\'');

    // Check that <textarea>'s hasn\'t value maxlength attribute.
    this.set('maxlength', null);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('maxlength')), '', 'Component\'s inner <textarea> hasn\'t value maxlength attribute');
  });

  (0, _emberQunit.test)('selectionStart mode works properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "l0ulxOle",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"selectionStart\"],[[22,[\"class\"]],[22,[\"selectionStart\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
    // & check them again ('change' event is needed to force bindings work).
    var newValue = 'Some text typed into textarea';
    $textareaInput.val(newValue);
    $textareaInput.change();

    //Generate a random value 'selectionStart' and convert to a string.
    var selectionStartValue = Math.floor(Math.random() * 10 + 1);

    var $this = this;

    // This timeout  is correcting problem with selectionStart in Mozila Firefox.
    var done = assert.async();
    setTimeout(function () {
      $this.set('selectionStart', selectionStartValue);
      assert.strictEqual($textareaInput.prop('selectionStart'), selectionStartValue, 'Component\'s inner <textarea>\'s value \'selectionStart\' is equals to \'' + selectionStartValue + '\'');

      // Check that <textarea>'s hasn\'t value maxlength attribute.
      $this.set('selectionStart', null);
      assert.strictEqual(Ember.$.trim($textareaInput.attr('selectionStart')), '', 'Component\'s inner <textarea> hasn\'t value selectionStart attribute');
      done();
    }, 10);
  });

  (0, _emberQunit.test)('selectionEnd mode works properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "zCgy2lRV",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"selectionEnd\"],[[22,[\"class\"]],[22,[\"selectionEnd\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
    // & check them again ('change' event is needed to force bindings work).
    var newValue = 'Some text typed into textarea';
    $textareaInput.val(newValue);
    $textareaInput.change();

    //Generate a random value 'selectionEnd' and convert to a string.
    var selectionEndValue = Math.floor(Math.random() * 10 + 1);

    // Check that <textarea>'s selectionEnd attribute.
    this.set('selectionEnd', selectionEndValue);
    assert.strictEqual($textareaInput.prop('selectionEnd'), selectionEndValue, 'Component\'s inner <textarea>\'s value \'selectionEnd\' is equals to \'' + selectionEndValue + '\'');

    // Check that <textarea>'s hasn\'t value maxlength attribute.
    this.set('selectionEnd', null);
    assert.strictEqual(Ember.$.trim($textareaInput.attr('selectionEnd')), '', 'Component\'s inner <textarea> hasn\'t value selectionEnd attribute');
  });

  (0, _emberQunit.test)('selectionDirection mode works properly', function (assert) {
    assert.expect(1);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "hfB/KRiF",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"selectionDirection\"],[[22,[\"class\"]],[22,[\"selectionDirection\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s hasn\'t value selectionDirection attribute.
    this.set('selectionDirection', null);
    assert.strictEqual($textareaInput.attr('selectionDirection'), undefined, 'Component\'s inner <textarea> hasn\'t value selectionDirection attribute');
  });

  (0, _emberQunit.test)('changes in inner <textarea> causes changes in property binded to \'value\'', function (assert) {
    assert.expect(4);

    // Set <textarea>'s value' & render component.
    this.set('value', null);
    this.render(Ember.HTMLBars.template({
      "id": "tacx7sgL",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check <textarea>'s value & binded value for initial emptyness.
    assert.strictEqual(Ember.$.trim($textareaInput.val()), '', 'Component\'s inner <textarea>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
    // & check them again ('change' event is needed to force bindings work).
    var newValue = 'Some text typed into textareas inner <textarea>';
    $textareaInput.val(newValue);
    $textareaInput.change();

    assert.strictEqual(Ember.$.trim($textareaInput.val()), newValue, 'Component\'s inner <textarea>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });

  (0, _emberQunit.test)('changes in property binded to \'value\' causes changes in inner <textarea>', function (assert) {
    assert.expect(4);

    // Set <textarea>'s value' & render component.
    this.set('value', null);
    this.render(Ember.HTMLBars.template({
      "id": "tacx7sgL",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check <textarea>'s value & binded value for initial emptyness.
    assert.strictEqual(Ember.$.trim($textareaInput.val()), '', 'Component\'s inner <textarea>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change property binded to 'value' & check them again.
    var newValue = 'Some text typed into textareas inner <textarea>';
    this.set('value', newValue);

    assert.strictEqual(Ember.$.trim($textareaInput.val()), newValue, 'Component\'s inner <textarea>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });
});
define('dummy/tests/integration/components/flexberry-textbox-test', ['ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit'], function (_i18n, _translations, _translations2, _emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-textbox', 'Integration | Component | flexberry-textbox', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _translations.default);
      this.register('locale:en/translations', _translations2.default);
      this.register('service:i18n', _i18n.default);

      this.inject.service('i18n', { as: 'i18n' });
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    }
  });

  (0, _emberQunit.test)('it renders properly', function (assert) {
    assert.expect(16);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "Sid7vGdE",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"class\"],[[22,[\"class\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check wrapper <div>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.strictEqual($component.hasClass('flexberry-textbox'), true, 'Component\'s wrapper has \' flexberry-textbox\' css-class');
    assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($component.hasClass('input'), true, 'Component\'s wrapper has \'input\' css-class');

    // Check <input>.
    assert.strictEqual($textboxInput.length === 1, true, 'Component has inner <input>');
    assert.strictEqual($textboxInput.attr('type'), 'text', 'Component\'s inner <input> is of text type');

    // Check wrapper's additional CSS-classes.
    var additioanlCssClasses = 'fluid transparent mini huge error';
    this.set('class', additioanlCssClasses);
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    // Clean up wrapper's additional CSS-classes.
    this.set('class', '');
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('class changes through base-component\'s dynamic properties works properly', function (assert) {
    assert.expect(6);

    var initialClass = 'class1 class2';
    var anotherClass = 'firstClass secondClass';
    var dynamicProperties = {
      class: initialClass
    };

    this.set('dynamicProperties', dynamicProperties);

    this.render(Ember.HTMLBars.template({
      "id": "e2oimvkQ",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n    \"],[1,[26,\"flexberry-textbox\",null,[[\"dynamicProperties\"],[[22,[\"dynamicProperties\"]]]]],false],[0,\"\\n  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    var $component = this.$().children();

    assert.strictEqual($component.hasClass('class1'), true, 'Component\'s container has \'class1\' css-class');
    assert.strictEqual($component.hasClass('class2'), true, 'Component\'s container has \'class2\' css-class');

    Ember.set(dynamicProperties, 'class', anotherClass);
    assert.strictEqual($component.hasClass('class1'), false, 'Component\'s container hasn\'t \'class1\' css-class');
    assert.strictEqual($component.hasClass('class2'), false, 'Component\'s container hasn\'t \'class2\' css-class');
    assert.strictEqual($component.hasClass('firstClass'), true, 'Component\'s container has \'firstClass\' css-class');
    assert.strictEqual($component.hasClass('secondClass'), true, 'Component\'s container has \'secondClass\' css-class');
  });

  (0, _emberQunit.test)('readonly mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "z7/lVeUo",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"class\",\"readonly\"],[[22,[\"class\"]],[22,[\"readonly\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check that <input>'s readonly attribute doesn't exist yet.
    assert.strictEqual(Ember.$.trim($textboxInput.attr('readonly')), '', 'Component\'s inner <input> hasn\'t readonly attribute');

    // Activate readonly mode & check that <input>'s readonly attribute exists now & has value equals to 'readonly'.
    this.set('readonly', true);

    $textboxInput = $component.children('input');
    assert.strictEqual(Ember.$.trim($textboxInput.attr('readonly')), 'readonly', 'Component\'s inner <input> has readonly attribute with value equals to \'readonly\'');

    // Check that <input>'s readonly attribute doesn't exist now.
    this.set('readonly', false);

    $textboxInput = $component.children('input');
    assert.strictEqual(Ember.$.trim($textboxInput.attr('readonly')), '', 'Component\'s inner <input> hasn\'t readonly attribute');
  });

  (0, _emberQunit.test)('readonly mode works properly with value', function (assert) {
    var _this = this;

    assert.expect(2);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.set('readonly', true);
    this.render(Ember.HTMLBars.template({
      "id": "LPWkt6eT",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"readonly\",\"value\"],[[22,[\"readonly\"]],[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    $textboxInput.on('change', function (e) {
      if (_this.get('readonly')) {
        e.stopPropagation();
        $textboxInput.val(null);
      }
    });

    var newValue = 'New value';
    $textboxInput.val(newValue);
    $textboxInput.change();

    // Check <input>'s value not changed.
    assert.strictEqual(Ember.$.trim($textboxInput.val()), '', 'Component\'s inner <input>\'s value not changed');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to unchanged \'value\'');
  });

  (0, _emberQunit.test)('click on textbox in readonly mode doesn\'t change value & it\'s type', function (assert) {
    assert.expect(3);

    // Set <input>'s value' & render component.
    var value = 123;
    this.set('value', value);
    this.render(Ember.HTMLBars.template({
      "id": "uEXOATyP",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"readonly\",\"value\"],[true,[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    $textboxInput.click();
    $textboxInput.change();

    // Check <input>'s value not changed.
    assert.strictEqual(Ember.$.trim($textboxInput.val()), '' + value, 'Component\'s inner <input>\'s value not changed');
    assert.strictEqual(this.get('value'), value, 'Value binded to component\'s \'value\' property is unchanged');
    assert.strictEqual(Ember.typeOf(this.get('value')), 'number', 'Value binded to component\'s \'value\' property is still number');
  });

  (0, _emberQunit.test)('it renders i18n-ed placeholder', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "2FwbsAq3",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-textbox\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check <input>'s placeholder.
    assert.strictEqual(Ember.$.trim($textboxInput.attr('placeholder')), Ember.get(_translations.default, 'components.flexberry-textbox.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

    // Change current locale to 'en' & check <input>'s placeholder again.
    this.set('i18n.locale', 'en');
    assert.strictEqual(Ember.$.trim($textboxInput.attr('placeholder')), Ember.get(_translations2.default, 'components.flexberry-textbox.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
  });

  (0, _emberQunit.test)('it renders manually defined placeholder', function (assert) {
    assert.expect(2);

    // Set <input>'s placeholder' & render component.
    var placeholder = 'Input is empty, please type some text';
    this.set('placeholder', placeholder);
    this.render(Ember.HTMLBars.template({
      "id": "LO/PMoJH",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"placeholder\"],[[22,[\"placeholder\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check <input>'s placeholder.
    assert.strictEqual(Ember.$.trim($textboxInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

    // Change placeholder's value & check <input>'s placeholder again.
    placeholder = 'Input has no value';
    this.set('placeholder', placeholder);
    assert.strictEqual(Ember.$.trim($textboxInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');
  });

  (0, _emberQunit.test)('changes in inner <input> causes changes in property binded to \'value\'', function (assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.render(Ember.HTMLBars.template({
      "id": "dT+OH+YL",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(Ember.$.trim($textboxInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change <input>'s value (imitate situation when user typed something into component's <input>)
    // & check them again ('change' event is needed to force bindings work).
    var newValue = 'Some text typed into textboxes inner <input>';
    $textboxInput.val(newValue);
    $textboxInput.change();

    assert.strictEqual(Ember.$.trim($textboxInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });

  (0, _emberQunit.test)('attribute maxlength rendered in html', function (assert) {
    assert.expect(1);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "w2woXa5q",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"maxlength\"],[5]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = Ember.$('.flexberry-textbox input', $component);

    // Check <input>'s maxlength attribute.
    assert.strictEqual($fieldInput.attr('maxlength'), '5', 'Component\'s inner <input>\'s attribute maxlength rendered');
  });

  (0, _emberQunit.test)('changes in property binded to \'value\' causes changes in inner <input>', function (assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.render(Ember.HTMLBars.template({
      "id": "dT+OH+YL",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(Ember.$.trim($textboxInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change property binded to 'value' & check them again.
    var newValue = 'Some text typed into textboxes inner <input>';
    this.set('value', newValue);

    assert.strictEqual(Ember.$.trim($textboxInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });
});
define('dummy/tests/integration/components/flexberry-toggler-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  var animationDuration = Ember.$.fn.accordion.settings.duration + 100;

  (0, _emberQunit.moduleForComponent)('flexberry-toggler', 'Integration | Component | flexberry toggler', {
    integration: true
  });

  // Common expand/collapse test method.
  var expandCollapseTogglerWithStateChecks = function expandCollapseTogglerWithStateChecks(assert, captions) {
    assert.expect(10);
    var endFunction = assert.async();
    var content = 'Toggler\'s content';

    captions = captions || {};
    var caption = captions.caption || '';
    var expandedCaption = captions.expandedCaption || caption;
    var collapsedCaption = captions.collapsedCaption || caption;

    this.set('content', content);
    this.set('caption', caption);
    this.set('expandedCaption', expandedCaption);
    this.set('collapsedCaption', collapsedCaption);

    this.render(Ember.HTMLBars.template({
      "id": "sK+tO5I7",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"caption\",\"expandedCaption\",\"collapsedCaption\"],[[22,[\"caption\"]],[22,[\"expandedCaption\"]],[22,[\"collapsedCaption\"]]]],{\"statements\":[[0,\"      \"],[1,[20,\"content\"],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component, it's inner <input>.
    var $component = this.$().children();
    var $componentTitle = $component.children('div .title');
    var $componentCaption = $componentTitle.children('span');
    var $componentContent = $component.children('div .content');

    // Check that component is collapsed by default.
    assert.strictEqual($componentTitle.hasClass('active'), false);
    assert.strictEqual($componentContent.hasClass('active'), false);
    assert.strictEqual(Ember.$.trim($componentCaption.text()), collapsedCaption);

    /* eslint-disable no-unused-vars */
    var expandAnimationCompleted = new Ember.RSVP.Promise(function (resolve, reject) {
      // Try to expand component.
      // Semantic UI will start asynchronous animation after click, so we need run function here.
      Ember.run(function () {
        $componentTitle.click();
      });

      // Check that component is animating now.
      assert.strictEqual($componentContent.hasClass('animating'), true);

      // Wait for expand animation to be completed & check component's state.
      Ember.run(function () {
        var animationCompleted = assert.async();
        setTimeout(function () {
          // Check that component is expanded now.
          assert.strictEqual($componentTitle.hasClass('active'), true);
          assert.strictEqual($componentContent.hasClass('active'), true);
          assert.strictEqual(Ember.$.trim($componentCaption.text()), expandedCaption);

          // Tell to test method that asynchronous operation completed.
          animationCompleted();

          // Resolve 'expandAnimationCompleted' promise.
          resolve();
        }, animationDuration);
      });
    });
    /* eslint-enable no-unused-vars */

    // Wait for expand animation to be completed (when resolve will be called inside previous timeout).
    // Then try to collapse component.
    expandAnimationCompleted.then(function () {
      // Semantic UI will start asynchronous animation after click, so we need run function here.
      Ember.run(function () {
        $componentTitle.click();
      });

      // Wait for collapse animation to be completed & check component's state.
      Ember.run(function () {
        var animationCompleted = assert.async();
        setTimeout(function () {
          // Check that component is expanded now.
          assert.strictEqual($componentTitle.hasClass('active'), false);
          assert.strictEqual($componentContent.hasClass('active'), false);
          assert.strictEqual(Ember.$.trim($componentCaption.text()), collapsedCaption);

          animationCompleted();
          endFunction();
        }, animationDuration);
      });
    });
  };

  (0, _emberQunit.test)('component renders properly', function (assert) {
    assert.expect(22);

    this.render(Ember.HTMLBars.template({
      "id": "6yrbjMAe",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"class\"],[[22,[\"class\"]]]],{\"statements\":[],\"parameters\":[]},null]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component, it's inner <input>.
    var $component = this.$().children();
    var $togglerTitle = $component.children('.title');
    var $togglerIcon = $togglerTitle.children('i');
    var $togglerCaption = $togglerTitle.children('span');
    var $togglerContent = $component.children('.content');

    // Check wrapper.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.strictEqual($component.hasClass('flexberry-toggler'), true, 'Component\'s wrapper has \'flexberry-toggler\' css-class');
    assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($component.hasClass('accordion'), true, 'Component\'s wrapper has \'accordion\' css-class');
    assert.strictEqual($component.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');

    // Check title's <div>.
    assert.strictEqual($togglerTitle.length === 1, true, 'Component has inner title block');
    assert.strictEqual($togglerTitle.prop('tagName'), 'DIV', 'Component\'s inner title block is a <div>');
    assert.strictEqual($togglerTitle.hasClass('title'), true, 'Component\'s inner title block has \'title\' css-class');

    // Check title's icon <i>.
    assert.strictEqual($togglerIcon.length === 1, true, 'Component\'s title has icon block');
    assert.strictEqual($togglerIcon.prop('tagName'), 'I', 'Component\'s icon block is a <i>');
    assert.strictEqual($togglerIcon.hasClass('dropdown icon'), true, 'Component\'s icon block has \'dropdown icon\' css-class');

    // Check title's caption <span>.
    assert.strictEqual($togglerCaption.length === 1, true, 'Component has inner caption block');
    assert.strictEqual($togglerCaption.prop('tagName'), 'SPAN', 'Component\'s caption block is a <span>');
    assert.strictEqual($togglerCaption.hasClass('flexberry-toggler-caption'), true, 'Component\'s caption block has \'flexberry-toggler-caption\' css-class');

    // Check content's <div>.
    assert.strictEqual($togglerContent.length === 1, true, 'Component has inner content block');
    assert.strictEqual($togglerContent.prop('tagName'), 'DIV', 'Component\'s content block is a <div>');
    assert.strictEqual($togglerContent.hasClass('content'), true, 'Component\'s content block has \'content\' css-class');
    assert.strictEqual($togglerContent.hasClass('flexberry-toggler-content'), true, 'Component\'s content block has \'flexberry-toggler-content\' css-class');

    // Check component's additional CSS-classes.
    var additioanlCssClasses = 'firstClass secondClass';
    this.set('class', additioanlCssClasses);

    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    this.set('class', '');
    /* eslint-disable no-unused-vars */
    Ember.A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('component\'s icon can be customized', function (assert) {
    assert.expect(2);

    this.render(Ember.HTMLBars.template({
      "id": "NWQn5fLd",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"iconClass\"],[[22,[\"iconClass\"]]]],{\"statements\":[],\"parameters\":[]},null]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component, it's inner <input>.
    var $component = this.$().children();
    var $togglerTitle = $component.children('.title');
    var $togglerIcon = $togglerTitle.children('i');

    // Change default icon class.
    var defaultIconClass = 'dropdown icon';
    assert.strictEqual($togglerIcon.attr('class'), defaultIconClass, 'Component\'s icon is \'dropdown icon\' by default');

    // Change icon class & check again.
    var iconClass = 'marker icon';
    this.set('iconClass', iconClass);
    assert.strictEqual($togglerIcon.attr('class'), iconClass, 'Component\'s icon is \'dropdown icon\' by default');
  });

  (0, _emberQunit.test)('component expands/collapses with defined \'expandedCaption\' & \'collapsedCaption\'', function (assert) {
    expandCollapseTogglerWithStateChecks.call(this, assert, {
      expandedCaption: 'Toggler\'s expanded caption',
      collapsedCaption: 'Toggler\'s collapsed caption'
    });
  });

  (0, _emberQunit.test)('component expands/collapses with defined \'caption\' & \'collapsedCaption\'', function (assert) {
    expandCollapseTogglerWithStateChecks.call(this, assert, {
      caption: 'Toggler\'s caption',
      collapsedCaption: 'Toggler\'s collapsed caption'
    });
  });

  (0, _emberQunit.test)('component expands/collapses with defined \'caption\' & \'expandedCaption\'', function (assert) {
    expandCollapseTogglerWithStateChecks.call(this, assert, {
      caption: 'Toggler\'s caption',
      expandedCaption: 'Toggler\'s expanded caption'
    });
  });

  (0, _emberQunit.test)('component expands/collapses with only \'caption\' defined', function (assert) {
    expandCollapseTogglerWithStateChecks.call(this, assert, {
      caption: 'Toggler\'s caption'
    });
  });

  (0, _emberQunit.test)('component expands/collapses with only \'expandedCaption\' defined', function (assert) {
    expandCollapseTogglerWithStateChecks.call(this, assert, {
      expandedCaption: 'Toggler\'s expanded caption'
    });
  });

  (0, _emberQunit.test)('component expands/collapses with only \'collapsedCaption\' defined', function (assert) {
    expandCollapseTogglerWithStateChecks.call(this, assert, {
      collapsedCaption: 'Toggler\'s collapsed caption'
    });
  });

  (0, _emberQunit.test)('component expands/collapses without defined captions', function (assert) {
    expandCollapseTogglerWithStateChecks.call(this, assert, {});
  });

  (0, _emberQunit.test)('changes in \'expanded\' property causes changing of component\'s expand/collapse state', function (assert) {
    assert.expect(9);

    var content = 'Toggler\'s content';
    var collapsedCaption = 'Toggler\'s collapsed caption';
    var expandedCaption = 'Toggler\'s expanded caption';

    this.set('content', content);
    this.set('collapsedCaption', collapsedCaption);
    this.set('expandedCaption', expandedCaption);

    this.render(Ember.HTMLBars.template({
      "id": "xUrRxBLi",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"expanded\",\"collapsedCaption\",\"expandedCaption\"],[[22,[\"expanded\"]],[22,[\"collapsedCaption\"]],[22,[\"expandedCaption\"]]]],{\"statements\":[[0,\"      \"],[1,[20,\"content\"],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component, it's inner <input>.
    var $component = this.$().children();
    var $togglerTitle = $component.children('.title');
    var $togglerCaption = $togglerTitle.children('span');
    var $togglerContent = $component.children('.content');

    // Check that component is collapsed by default.
    assert.strictEqual($togglerTitle.hasClass('active'), false);
    assert.strictEqual($togglerContent.hasClass('active'), false);
    assert.strictEqual(Ember.$.trim($togglerCaption.text()), collapsedCaption);

    // Expand & check that component is expanded.
    this.set('expanded', true);
    assert.strictEqual($togglerTitle.hasClass('active'), true);
    assert.strictEqual($togglerContent.hasClass('active'), true);
    assert.strictEqual(Ember.$.trim($togglerCaption.text()), expandedCaption);

    // Collapse & check that component is collapsed.
    this.set('expanded', false);
    assert.strictEqual($togglerTitle.hasClass('active'), false);
    assert.strictEqual($togglerContent.hasClass('active'), false);
    assert.strictEqual(Ember.$.trim($togglerCaption.text()), collapsedCaption);
  });

  (0, _emberQunit.test)('disabled animation', function (assert) {
    this.render(Ember.HTMLBars.template({
      "id": "30Kj9C3J",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"caption\",\"duration\"],[\"Click me!\",0]],{\"statements\":[[0,\"      Hello!\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.notOk(this.$('.flexberry-toggler .content').hasClass('active'));

    this.$('.flexberry-toggler .title').click();

    assert.ok(this.$('.flexberry-toggler .content').hasClass('active'));
  });

  (0, _emberQunit.test)('loong animation speed', function (assert) {
    var _this = this;

    assert.expect(3);
    var done = assert.async();

    this.render(Ember.HTMLBars.template({
      "id": "QzgUxXIS",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"caption\",\"duration\"],[\"Click me!\",750]],{\"statements\":[[0,\"      Hello!\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
      "meta": {}
    }));

    this.$('.flexberry-toggler .title').click();

    assert.ok(this.$('.flexberry-toggler .content').hasClass('animating'));
    Ember.run.later(function () {
      assert.ok(_this.$('.flexberry-toggler .content').hasClass('animating'));
    }, 500);
    Ember.run.later(function () {
      assert.notOk(_this.$('.flexberry-toggler .content').hasClass('animating'));
      done();
    }, 1000);
  });
});
define('dummy/tests/integration/components/flexberry-validationmessage-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-validationmessage', 'Integration | Component | flexberry-validationmessage', {
    integration: true
  });

  (0, _emberQunit.test)('it renders and works', function (assert) {
    var _this = this;

    this.render(Ember.HTMLBars.template({
      "id": "F4BP9WHG",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-validationmessage\",null,[[\"error\",\"color\",\"pointing\"],[[22,[\"error\"]],[22,[\"color\"]],[22,[\"pointing\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    [undefined, null, '', []].forEach(function (error) {
      _this.set('error', error);
      assert.ok(_this.$('.ui.label').is(':hidden'), 'Component is hidden if no error.');
    });

    this.set('error', 'This is error.');
    assert.ok(this.$('.ui.label').is(':visible'), 'Component is visible if there errors.');
    assert.equal(this.$().text().trim(), 'This is error.', 'Component shows error.');

    this.set('error', ['First error.', 'Second error.']);
    assert.equal(this.$().text().trim(), 'First error.,Second error.', 'Component shows all errors.');

    assert.notOk(this.$('.ui.label').hasClass('red'), 'Override default color with undefined value.');
    assert.notOk(this.$('.ui.label').hasClass('pointing'), 'Override default pointing with undefined value.');

    this.set('color', 'pink');
    this.set('pointing', 'left pointing');
    assert.ok(this.$('.ui.label').hasClass('pink'), 'Color works through CSS class.');
    assert.ok(this.$('.ui.label').hasClass('left'), 'Pointing works through CSS class.');

    this.render(Ember.HTMLBars.template({
      "id": "dJ7ABynb",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-validationmessage\"],false]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.ok(this.$('.ui.label').hasClass('red'), 'Default color \'red\'.');
    assert.ok(this.$('.ui.label').hasClass('pointing'), 'Default pointing \'pointing\'.');
  });
});
define('dummy/tests/integration/components/flexberry-validationsummary-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('flexberry-validationsummary', 'Integration | Component | flexberry-validationsummary', {
    integration: true
  });

  (0, _emberQunit.test)('it renders and works', function (assert) {
    this.render(Ember.HTMLBars.template({
      "id": "T3lhr2lq",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-validationsummary\",null,[[\"errors\",\"color\",\"header\"],[[22,[\"errors\"]],[22,[\"color\"]],[22,[\"header\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    var errors = this.set('errors', Ember.A());
    assert.ok(this.$('.ui.message').is(':hidden'), 'Component is hidden if no errors.');

    Ember.run(function () {
      errors.pushObject('Validation error.');
    });
    assert.ok(this.$('.ui.message').is(':visible'), 'Component is visible if there errors.');
    assert.ok(this.$().text().trim(), 'Validation error.', 'Component shows errors at added.');

    this.set('header', 'Validation errors');
    assert.ok(/Validation errors\s*/.test(this.$().text().trim()), 'Component has a header.');

    assert.notOk(this.$('.ui.label').hasClass('red'), 'Override default color with undefined value.');

    this.set('color', 'blue');
    assert.ok(this.$('.ui.message').hasClass('blue'), 'Color works through CSS class.');

    this.render(Ember.HTMLBars.template({
      "id": "B1HkP5Uq",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-validationsummary\"],false]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.ok(this.$('.ui.message').hasClass('red'), 'Default color \'red\'.');
  });
});
define('dummy/tests/integration/components/form-load-time-tracker-test', ['ember-i18n/services/i18n', 'ember-qunit'], function (_i18n, _emberQunit) {
  'use strict';

  var formLoadTimeTracker = Ember.Service.extend({
    loadTime: 1.0000,
    renderTime: 2.0000
  });

  (0, _emberQunit.moduleForComponent)('form-load-time-tracker', 'Integration | Component | form load time tracker', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('service:form-load-time-tracker', formLoadTimeTracker);
      this.register('service:i18n', _i18n.default);

      this.inject.service('i18n', { as: 'i18n' });
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      this.inject.service('form-load-time-tracker', { as: 'formLoadTimeTracker' });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    }
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    var i18n = this.get('i18n');
    var loadTimeText = i18n.t('components.form-load-time-tracker.load-time');
    var renderTimeText = i18n.t('components.form-load-time-tracker.render-time');
    this.render(Ember.HTMLBars.template({
      "id": "fiSH9ohk",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"form-load-time-tracker\"],false]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.equal(this.$().text().trim(), loadTimeText + ': 1\n' + renderTimeText + ': 2');

    this.render(Ember.HTMLBars.template({
      "id": "DtXIWqiD",
      "block": "{\"symbols\":[],\"statements\":[[4,\"form-load-time-tracker\",null,null,{\"statements\":[[0,\"Yield here!\"]],\"parameters\":[]},null]],\"hasEval\":false}",
      "meta": {}
    }));
    assert.equal(this.$().text().trim(), loadTimeText + ': 1\n' + renderTimeText + ': 2\nYield here!');
  });
});
define('dummy/tests/integration/components/groupedit-toolbar-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('groupedit-toolbar', 'Integration | Component | groupedit toolbar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "nz9cvBqP",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"groupedit-toolbar\",null,[[\"componentName\"],[\"someName\"]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "qbw45Nu2",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"groupedit-toolbar\",null,[[\"componentName\"],[\"someName\"]],{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    //Component does not support template block usage.
    assert.equal(this.$().text().trim(), '');
  });
});
define('dummy/tests/integration/components/modal-dialog-test', ['ember-qunit', 'ember-test-helpers/wait'], function (_emberQunit, _wait) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('modal-dialog', 'Integration | Component | modal dialog', {
    integration: true,

    beforeEach: function beforeEach() {
      var _this = this;

      // detachable need for jquery can do select child components
      this.set('settings', {
        detachable: false
      });

      this.set('created', false);
      this.set('createdConsumer', function () {
        _this.set('created', true);
      });

      Ember.Test.registerWaiter(this, function () {
        return _this.get('created');
      });
    },
    afterEach: function afterEach() {
      this.$('.flexberry-modal').modal('hide dimmer');
    }
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    var _this2 = this;

    this.render(Ember.HTMLBars.template({
      "id": "dBIiwO3L",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modal-dialog\",null,[[\"settings\",\"created\"],[[22,[\"settings\"]],[22,[\"createdConsumer\"]]]],{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    return (0, _wait.default)().then(function () {
      assert.equal(_this2.$('.content').text().trim(), 'template block text');
    });
  });

  (0, _emberQunit.test)('it should not show actions div if no buttons visible', function (assert) {
    var _this3 = this;

    this.render(Ember.HTMLBars.template({
      "id": "2I7g2N+e",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modal-dialog\",null,[[\"settings\",\"created\",\"useOkButton\",\"useCloseButton\"],[[22,[\"settings\"]],[22,[\"createdConsumer\"]],false,false]],{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    return (0, _wait.default)().then(function () {
      assert.equal(_this3.$('.actions').length, 0);
    });
  });
});
define('dummy/tests/integration/components/object-list-view-test', ['ember-qunit', 'dummy/tests/helpers/start-app', 'dummy/models/components-examples/flexberry-groupedit/shared/aggregator', 'ember-flexberry/services/user-settings'], function (_emberQunit, _startApp, _aggregator, _userSettings) {
  'use strict';

  var App = void 0;

  (0, _emberQunit.moduleForComponent)('object-list-view', 'Integration | Component | object list view', {
    integration: true,

    beforeEach: function beforeEach() {
      App = (0, _startApp.default)();
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n'),
        userSettingsService: Ember.inject.service('user-settings')
      });

      _userSettings.default.reopen({
        isUserSettingsServiceEnabled: false
      });

      // Just take it and turn it off...
      App.__container__.lookup('service:log').set('enabled', false);
    }
  });

  (0, _emberQunit.test)('columns renders', function (assert) {
    var _this = this;

    var store = App.__container__.lookup('service:store');

    Ember.run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');

      _this.set('proj', _aggregator.default.projections.get('AggregatorE'));
      _this.set('model', model);
      _this.render(Ember.HTMLBars.template({
        "id": "h5/LJ9Rn",
        "block": "{\"symbols\":[],\"statements\":[[1,[26,\"object-list-view\",null,[[\"modelProjection\",\"content\",\"componentName\"],[[22,[\"proj\"]],[22,[\"model\",\"details\"]],\"someName\"]]],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.notEqual(_this.$().text().trim(), '');
    });
  });
});
define('dummy/tests/integration/components/olv-filter-interval-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('olv-filter-interval', 'Integration | Component | olv filter interval', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "ZGoM5/ro",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"olv-filter-interval\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');
  });
});
define('dummy/tests/integration/components/ui-message-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('ui-message', 'Integration | Component | ui-message', {
    integration: true
  });

  (0, _emberQunit.test)('it renders properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "QST815LZ",
      "block": "{\"symbols\":[],\"statements\":[[1,[20,\"ui-message\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // Check wrapper <div>.
    assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($component.hasClass('message'), true, 'Component\'s wrapper has \' message\' css-class');
  });

  (0, _emberQunit.test)('size renders properly', function (assert) {
    var _this = this;

    assert.expect(8);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "YtPrj2kZ",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"size\"],[[22,[\"size\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // Check component's syze's types.
    var sizeTypes = Ember.A(['small', 'large', 'huge', 'massive']);
    /* eslint-disable no-unused-vars */
    sizeTypes.forEach(function (sizeCssClassName, index) {
      _this.set('size', sizeCssClassName);
      assert.strictEqual($component.hasClass(sizeCssClassName), true, 'Component\'s wrapper has size css-class \'' + sizeCssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    this.set('size', '');
    /* eslint-disable no-unused-vars */
    sizeTypes.forEach(function (sizeCssClassName, index) {
      assert.strictEqual($component.hasClass(sizeCssClassName), false, 'Component\'s wrapper hasn\'t size css-class \'' + sizeCssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('type renders properly', function (assert) {
    var _this2 = this;

    assert.expect(12);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "+dL3UPGt",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"type\"],[[22,[\"type\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // Check component's type's CSS-classes.
    var typeCssClasses = Ember.A(['warning', 'info', 'positive', 'success', 'negative', 'error']);
    /* eslint-disable no-unused-vars */
    typeCssClasses.forEach(function (typeCssClassName, index) {
      _this2.set('type', typeCssClassName);
      assert.strictEqual($component.hasClass(typeCssClassName), true, 'Component\'s wrapper has type css-class \'' + typeCssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    this.set('type', '');
    /* eslint-disable no-unused-vars */
    typeCssClasses.forEach(function (typeCssClassName, index) {
      assert.strictEqual($component.hasClass(typeCssClassName), false, 'Component\'s wrapper hasn\'t type css-class \'' + typeCssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('color renders properly', function (assert) {
    var _this3 = this;

    assert.expect(24);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "Gpe4jVFk",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"color\"],[[22,[\"color\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // Check component's color's CSS-classes.
    var colorCssClasses = Ember.A(['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'black']);
    /* eslint-disable no-unused-vars */
    colorCssClasses.forEach(function (colorCssClassName, index) {
      _this3.set('color', colorCssClassName);
      assert.strictEqual($component.hasClass(colorCssClassName), true, 'Component\'s wrapper has color css-class \'' + colorCssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    this.set('color', '');
    /* eslint-disable no-unused-vars */
    colorCssClasses.forEach(function (colorCssClassName, index) {
      assert.strictEqual($component.hasClass(colorCssClassName), false, 'Component\'s wrapper hasn\'t color css-class \'' + colorCssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });

  (0, _emberQunit.test)('floating renders properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "D889f8Ys",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"floating\"],[[22,[\"floating\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // Check wrapper <div>.
    assert.strictEqual($component.hasClass('floating'), false, 'Component\'s wrapper hasn\'t \'floating\' css-class');

    this.set('floating', true);
    assert.strictEqual($component.hasClass('floating'), true, 'Component\'s wrapper has \'floating\' css-class');

    this.set('floating', false);
    assert.strictEqual($component.hasClass('floating'), false, 'Component\'s wrapper hasn\'t \'floating\' css-class');
  });

  (0, _emberQunit.test)('attached renders properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "+iRwRmSZ",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"attached\"],[[22,[\"attached\"]]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // Check wrapper <div>.
    assert.strictEqual($component.hasClass('attached'), false, 'Component\'s wrapper hasn\'t \'attached\' css-class');

    this.set('attached', true);
    assert.strictEqual($component.hasClass('attached'), true, 'Component\'s wrapper has \'attached\' css-class');

    this.set('attached', false);
    assert.strictEqual($component.hasClass('attached'), false, 'Component\'s wrapper hasn\'t \'attached\' css-class');
  });

  (0, _emberQunit.test)('visible renders properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "ugsdBNVe",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"visible\",\"closeable\"],[[22,[\"visible\"]],true]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $closeableIcon = $component.children('i');

    // Component is visible.
    assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css-class \'hidden\'');

    // The component is hidden by the Close button.
    Ember.run(function () {
      $closeableIcon.click();
    });

    assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s wrapper has css-class \'hidden\'');

    // Component is visible again.
    this.set('visible', true);
    assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css-class \'hidden\'');
  });

  (0, _emberQunit.test)('closeable renders properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "UaYYereD",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"closeable\"],[true]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $closeableIcon = $component.children('i');

    assert.strictEqual($closeableIcon.hasClass('close'), true, 'Component\'s close icon has css-class \'close\'');
    assert.strictEqual($closeableIcon.hasClass('icon'), true, 'Component\'s wrapper has css-class \'icon\'');
  });

  (0, _emberQunit.test)('caption & massage renders properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "Frieyj9C",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"caption\",\"message\"],[\"My caption\",\"My message\"]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $captionText = $component.children('div');
    var $massageText = $component.children('p');

    assert.strictEqual($captionText.hasClass('header'), true, 'Component\'s caption block has \'header\' css-class');
    assert.strictEqual(Ember.$.trim($captionText.text()), 'My caption', 'Component\'s caption is right');
    assert.strictEqual(Ember.$.trim($massageText.text()), 'My message', 'Component\'s message is right');
  });

  (0, _emberQunit.test)('icon renders properly', function (assert) {
    assert.expect(7);

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "5DlouAdb",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"icon\",\"caption\",\"message\"],[\"icon paw\",\"My caption\",\"My message\"]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $messageIcon = $component.children('i');
    var $captionDiv = $component.children('div.content');
    var $captionText = $captionDiv.children('div.header');
    var $massageText = $captionDiv.children('p');

    assert.strictEqual($component.hasClass('icon'), true, 'Component\'s wrapper has \'icon\' css-class');
    assert.strictEqual($messageIcon.hasClass('paw'), true, 'Component\'s icon has \'paw\' css-class');
    assert.strictEqual($messageIcon.hasClass('icon'), true, 'Component\'s icon has \'icon\' css-class');
    assert.strictEqual($captionDiv.hasClass('content'), true, 'Component\'s content block has \'content\' css-class');
    assert.strictEqual($captionText.hasClass('header'), true, 'Component\'s caption block has \'header\' css-class');
    assert.strictEqual(Ember.$.trim($captionText.text()), 'My caption', 'Component\'s caption is right');
    assert.strictEqual(Ember.$.trim($massageText.text()), 'My message', 'Component\'s message is right');
  });

  (0, _emberQunit.test)('component sends \'onHide\' action', function (assert) {
    assert.expect(3);

    var messageClose = false;
    this.set('actions.onClose', function () {
      messageClose = true;
    });

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "IABVmd0q",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"closeable\",\"onHide\"],[true,[26,\"action\",[[21,0,[]],\"onClose\"],null]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();
    var $closeableIcon = $component.children('i');

    // The component is visible.
    assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper has\'t css-class \'hidden\'');

    // The component is hidden by the Close button.
    Ember.run(function () {
      var done = assert.async();
      $closeableIcon.click();
      setTimeout(function () {
        assert.strictEqual(messageClose, true, 'Component closed');
        assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s wrapper has css-class \'hidden\'');
        done();
      }, 50);
    });
  });

  (0, _emberQunit.test)('component sends \'onShow\' action', function (assert) {
    assert.expect(4);

    var messageVisible = false;
    this.set('actions.onVisible', function () {
      messageVisible = true;
    });

    // Render component.
    this.render(Ember.HTMLBars.template({
      "id": "DTAIN0dA",
      "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"closeable\",\"visible\",\"onShow\"],[true,[22,[\"visible\"]],[26,\"action\",[[21,0,[]],\"onVisible\"],null]]]],false]],\"hasEval\":false}",
      "meta": {}
    }));

    // Retrieve component.
    var $component = this.$().children();

    // The component is hidden.
    this.set('visible', false);
    assert.strictEqual(messageVisible, false, 'Component is not visible');
    assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s wrapper has css-class \'hidden\'');

    // The component is visible.
    this.set('visible', true);
    assert.strictEqual(messageVisible, true, 'Component is visible');
    assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css-class \'hidden\'');
  });
});
define('dummy/tests/test-helper', ['dummy/app', 'dummy/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('dummy/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('acceptance/components/base-flexberry-lookup-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/base-flexberry-lookup-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-dropdown/flexberry-dropdown-conditional-render-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-dropdown/flexberry-dropdown-conditional-render-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-dropdown/flexberry-dropdown-empty-value-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-dropdown/flexberry-dropdown-empty-value-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-groupedit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-groupedit-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-groupedit/flexberry-groupedit-check-all-at-page-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-groupedit/flexberry-groupedit-check-all-at-page-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-groupedit/flexberry-groupedit-configurate-row-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-groupedit/flexberry-groupedit-configurate-row-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-groupedit/flexberry-groupedit-user-button-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-groupedit/flexberry-groupedit-user-button-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/change-component-lookup-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/change-component-lookup-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/change-model-lookup-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/change-model-lookup-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/execute-flexberry-lookup-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/execute-flexberry-lookup-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/flexberry-lookup-actions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/flexberry-lookup-actions-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/flexberry-lookup-autocomplete-en-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/flexberry-lookup-autocomplete-en-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/flexberry-lookup-autocomplete-ru-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/flexberry-lookup-autocomplete-ru-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/flexberry-lookup-autofill-by-limit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/flexberry-lookup-autofill-by-limit-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/flexberry-lookup-limit-function-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/flexberry-lookup-limit-function-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/flexberry-lookup-preview-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/flexberry-lookup-preview-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/flexberry-lookup-projection-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/flexberry-lookup-projection-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/flexberry-lookup-relation-name-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/flexberry-lookup-relation-name-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/lookup-test-functions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/lookup-test-functions.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/visiting-flexberry-lookup-autocomplete-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/visiting-flexberry-lookup-autocomplete-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-lookup/visiting-flexberry-lookup-dropdown-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-lookup/visiting-flexberry-lookup-dropdown-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/checkbox-at-editform-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/checkbox-at-editform-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/execute-folv-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/execute-folv-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/filther/folv-empty-filter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/filther/folv-empty-filter-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/filther/folv-filter-by-enther-click-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/filther/folv-filter-by-enther-click-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/filther/folv-filter-render-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/filther/folv-filter-render-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/filther/folv-filter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/filther/folv-filter-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/filther/folv-ge-filter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/filther/folv-ge-filter-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/filther/folv-le-filter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/filther/folv-le-filter-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/filther/folv-like-filter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/filther/folv-like-filter-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/filther/folv-neq-filter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/filther/folv-neq-filter-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/filther/folv-without-operation-filter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/filther/folv-without-operation-filter-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-check-all-at-all-page-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-check-all-at-all-page-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-check-all-at-page-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-check-all-at-page-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-check-config-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-check-config-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-checked-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-checked-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-column-config-save-button-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-column-config-save-button-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-configurate-row-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-configurate-row-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-date-format-moment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-date-format-moment-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-data-cancel-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-data-cancel-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-data-immediately-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-data-immediately-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-data-cancel-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-data-cancel-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-data-immediately-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-data-immediately-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-delete-button-in-row-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-delete-button-in-row-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-delete-button-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-delete-button-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-edit-button-in-row-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-edit-button-in-row-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-from-edit-form-with-queryparams-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-from-edit-form-with-queryparams-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-getCellComponent-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-getCellComponent-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-goto-editform-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-goto-editform-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-limit-function-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-limit-function-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-locales-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-locales-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-open-newform-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-open-newform-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-paging-dropdown-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-paging-dropdown-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-paging-navigation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-paging-navigation-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-select-record-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-select-record-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-sorting-by-computable-field-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-sorting-by-computable-field-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-sorting-clear-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-sorting-clear-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-sorting-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-sorting-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-sorting-with-default-setting-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-sorting-with-default-setting-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-tests-functions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-tests-functions.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-user-button-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-user-button-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/flexberry-objectlistview/folv-wrapper-projection-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/flexberry-objectlistview/folv-wrapper-projection-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/components/readonly-test/edit-form-readonly-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/components/readonly-test/edit-form-readonly-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/execute-validation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/execute-validation-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-base-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-base-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-checkbox-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-checkbox-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-detail-delete-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-detail-delete-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-detail-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-detail-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-dropdown-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-dropdown-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-file-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-file-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-lookup-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-lookup-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-textarea-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-textarea-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-textbox-letter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-textbox-letter-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/edit-form-validation-test/validation-textbox-numeric-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/edit-form-validation-test/validation-textbox-numeric-test.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-checkbox-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-checkbox-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-ddau-checkbox-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-ddau-checkbox-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-dropdown-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-dropdown-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-error-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-error-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-field-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-field-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-groupedit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-groupedit-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-lookup-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-lookup-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-sidebar-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-sidebar-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-simpledatetime-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-simpledatetime-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-sitemap-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-sitemap-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-textarea-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-textarea-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-textbox-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-textbox-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-toggler-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-toggler-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-validationmessage-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-validationmessage-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flexberry-validationsummary-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flexberry-validationsummary-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/form-load-time-tracker-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/form-load-time-tracker-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/groupedit-toolbar-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/groupedit-toolbar-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/modal-dialog-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/modal-dialog-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/object-list-view-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/object-list-view-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/olv-filter-interval-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/olv-filter-interval-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/ui-message-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/ui-message-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/adapters/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/detail-edit-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/detail-edit-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/edit-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/edit-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/flexberry-file-view-dialog-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/flexberry-file-view-dialog-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/list-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/list-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/lookup-dialog-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/lookup-dialog-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/new-platform-flexberry-services-lock-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/new-platform-flexberry-services-lock-list-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/helpers/readonly-cell-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/readonly-cell-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/initializers/i18n-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/i18n-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/initializers/render-perf-logger-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/render-perf-logger-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/instance-initializers/i18n-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/instance-initializers/i18n-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/instance-initializers/lock-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/instance-initializers/lock-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/instance-initializers/moment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/instance-initializers/moment-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/dynamic-actions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/dynamic-actions-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/dynamic-properties-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/dynamic-properties-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/errorable-route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/errorable-route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/flexberry-file-controller-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/flexberry-file-controller-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/flexberry-groupedit-route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/flexberry-groupedit-route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/lock-route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/lock-route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/modal-application-route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/modal-application-route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/multi-list-controller-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/multi-list-controller-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/multi-list-model-edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/multi-list-model-edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/multi-list-model-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/multi-list-model-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/multi-list-route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/multi-list-route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/paginated-controller-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/paginated-controller-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/paginated-route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/paginated-route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/predicate-from-filters-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/predicate-from-filters-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/reload-list-mixin-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/reload-list-mixin-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/sortable-controller-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/sortable-controller-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/sortable-route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/sortable-route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/new-platform-flexberry-flexberry-user-setting-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/new-platform-flexberry-flexberry-user-setting-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/new-platform-flexberry-services-lock-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/new-platform-flexberry-services-lock-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/edit-form-new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/edit-form-new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/edit-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/edit-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/list-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/list-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/new-platform-flexberry-services-lock-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/new-platform-flexberry-services-lock-list-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/projected-model-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/projected-model-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/serializers/new-platform-flexberry-services-lock-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/new-platform-flexberry-services-lock-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/app-state-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/app-state-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/detail-interaction-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/detail-interaction-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/form-load-time-tracker-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/form-load-time-tracker-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/log-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/log-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/objectlistview-events-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/objectlistview-events-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/cut-string-by-length-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/cut-string-by-length-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/deserialize-sorting-param-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/deserialize-sorting-param-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/get-attr-locale-key-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/get-attr-locale-key-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/get-current-agregator-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/get-current-agregator-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/get-projection-by-name-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/get-projection-by-name-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/need-save-current-agregator-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/need-save-current-agregator-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/serialize-sorting-param-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/serialize-sorting-param-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/string-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/string-test.js should pass ESLint\n\n');
  });
});
define('dummy/tests/unit/adapters/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('adapter:application', 'ApplicationAdapter', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });
});
define('dummy/tests/unit/controllers/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:application', {
    needs: ['service:objectlistview-events', 'service:app-state']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('dummy/tests/unit/controllers/detail-edit-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:detail-edit-form', 'Unit | Controller | detail edit form', {
    needs: ['controller:advlimit-dialog', 'controller:colsconfig-dialog', 'controller:flexberry-file-view-dialog', 'controller:lookup-dialog', 'controller:filters-dialog', 'service:detail-interaction', 'service:objectlistview-events', 'service:user-settings', 'service:app-state', 'service:adv-limit']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var _this = this;

    var controller = void 0;
    Ember.run(function () {
      controller = _this.subject();
    });

    assert.ok(controller);
  });
});
define('dummy/tests/unit/controllers/edit-form-test', ['ember-data', 'ember-qunit', 'dummy/tests/helpers/start-app'], function (_emberData, _emberQunit, _startApp) {
  'use strict';

  var App;

  (0, _emberQunit.moduleFor)('controller:edit-form', 'Unit | Controller | edit form', {
    needs: ['controller:advlimit-dialog', 'controller:colsconfig-dialog', 'controller:flexberry-file-view-dialog', 'controller:lookup-dialog', 'controller:filters-dialog', 'service:detail-interaction', 'service:objectlistview-events', 'service:user-settings', 'service:app-state', 'service:adv-limit'],

    beforeEach: function beforeEach() {
      App = (0, _startApp.default)();
    },
    afterEach: function afterEach() {
      Ember.run(App, 'destroy');
      Ember.$.mockjax.clear();
    }
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var _this = this;

    var controller = void 0;
    Ember.run(function () {
      controller = _this.subject();
    });
    assert.ok(controller);
  });

  (0, _emberQunit.test)('save hasMany relationships recursively', function (assert) {
    var _this3 = this;

    var savedRecords = [];

    var TestModel = _emberData.default.Model.extend({
      save: function save() {
        var _this2 = this;

        return new Ember.RSVP.Promise(function (resolve) {
          savedRecords.push(_this2);
          resolve(_this2);
        });
      }
    });

    var Model1 = TestModel.extend({
      hasManyModel2: _emberData.default.hasMany('model2')
    });

    var Model2 = TestModel.extend({
      hasManyModel3: _emberData.default.hasMany('model3')
    });

    var Model3 = TestModel.extend({});

    App.register('model:model1', Model1);
    App.register('model:model2', Model2);
    App.register('model:model3', Model3);

    var controller = void 0;
    var store = void 0;
    Ember.run(function () {
      controller = _this3.subject();
      store = App.__container__.lookup('service:store');
    });

    Ember.run(function () {
      var record = store.createRecord('model1');
      var model21 = store.createRecord('model2');
      var model22 = store.createRecord('model2');
      record.get('hasManyModel2').pushObjects([model21, model22]);
      var model31 = store.createRecord('model3');
      model22.get('hasManyModel3').pushObjects([model31]);

      controller.set('model', record);
      controller._saveHasManyRelationships(record).then(function () {
        assert.equal(savedRecords[0], model21);
        assert.equal(savedRecords[1], model22);
        assert.equal(savedRecords[2], model31);
      });
    });
  });
});
define('dummy/tests/unit/controllers/flexberry-file-view-dialog-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:flexberry-file-view-dialog', 'Unit | Controller | edit form', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('dummy/tests/unit/controllers/list-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:list-form', 'Unit | Controller | list form', {
    needs: ['controller:advlimit-dialog', 'controller:colsconfig-dialog', 'controller:filters-dialog', 'service:objectlistview-events', 'service:user-settings', 'service:adv-limit']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('dummy/tests/unit/controllers/lookup-dialog-test', ['ember-qunit', 'sinon'], function (_emberQunit, _sinon) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:lookup-dialog', 'Unit | Controller | lookup dialog', {
    needs: ['controller:advlimit-dialog', 'controller:colsconfig-dialog', 'controller:filters-dialog', 'service:lookup-events', 'service:objectlistview-events', 'service:user-settings', 'service:adv-limit']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  (0, _emberQunit.test)('it shold set selected record to saveTo.propName of saveTo.model', function (assert) {
    var model = Ember.Object.extend({ makeDirty: function makeDirty() {} }).create();
    var saveTo = {
      model: model,
      propName: 'testProperty'
    };

    var controller = this.subject();
    controller.set('saveTo', saveTo);

    _sinon.default.stub(model, 'makeDirty');
    _sinon.default.stub(controller, '_closeModalDialog');
    var master = Ember.Object.create();

    controller.send('objectListViewRowClick', master);

    assert.equal(model.get('testProperty'), master);
  });
});
define('dummy/tests/unit/controllers/new-platform-flexberry-services-lock-list-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:new-platform-flexberry-services-lock-list', 'Unit | Controller | new-platform-flexberry-services-lock-list', {
    needs: ['controller:advlimit-dialog', 'controller:colsconfig-dialog', 'controller:filters-dialog', 'service:adv-limit', 'service:objectlistview-events', 'service:user-settings']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('dummy/tests/unit/helpers/readonly-cell-test', ['dummy/helpers/readonly-cell', 'qunit'], function (_readonlyCell, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Helper | readonly cell');

  (0, _qunit.test)('it works', function (assert) {
    Ember.run(function () {
      var result = (0, _readonlyCell.readonlyCell)([['test'], 'test', false]);
      assert.ok(result);
    });
  });
});
define('dummy/tests/unit/initializers/i18n-test', ['dummy/initializers/i18n', 'qunit'], function (_i18n, _qunit) {
  'use strict';

  var application = void 0;

  (0, _qunit.module)('Unit | Initializer | i18n', {
    beforeEach: function beforeEach() {
      Ember.run(function () {
        application = Ember.Application.create();
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    _i18n.default.initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('dummy/tests/unit/initializers/render-perf-logger-test', ['dummy/initializers/render-perf-logger', 'qunit'], function (_renderPerfLogger, _qunit) {
  'use strict';

  var application = void 0;

  (0, _qunit.module)('Unit | Initializer | render perf logger', {
    beforeEach: function beforeEach() {
      Ember.run(function () {
        application = Ember.Application.create();
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    _renderPerfLogger.default.initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('dummy/tests/unit/instance-initializers/i18n-test', ['ember-flexberry/instance-initializers/i18n', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (_i18n, _qunit, _startApp, _destroyApp) {
  'use strict';

  var application = void 0;
  var appInstance = void 0;
  var fakeLocale = void 0;

  (0, _qunit.module)('Unit | Instance Initializer | i18n', {
    beforeEach: function beforeEach() {
      application = (0, _startApp.default)();
      appInstance = application.buildInstance();

      // Just take it and turn it off...
      appInstance.lookup('service:log').set('enabled', false);

      // Set 'fake-locale' as default i18n-service locale.
      var i18n = appInstance.lookup('service:i18n');
      fakeLocale = 'fake-locale';
      i18n.set('locale', fakeLocale);
    },
    afterEach: function afterEach() {
      (0, _destroyApp.default)(appInstance);
      (0, _destroyApp.default)(application);
    }
  });

  (0, _qunit.test)('Configures i18n service for locale', function (assert) {
    Ember.run(function () {
      assert.expect(2);

      var i18n = appInstance.lookup('service:i18n');
      var ENV = appInstance.factoryFor('config:environment').class;
      var defaultLocale = (ENV.i18n || {}).defaultLocale;

      assert.strictEqual(i18n.get('locale'), fakeLocale, 'Default i18n-service locale is \'' + fakeLocale + '\'');

      var currentLocale = defaultLocale ? defaultLocale : window.navigator.languages ? window.navigator.languages[0] : window.navigator.language || window.navigator.userLanguage;

      var locales = appInstance.lookup('controller:application').get('locales');
      if (!locales || Ember.typeOf(locales) !== 'array' || locales.indexOf(currentLocale) === -1 || Ember.isBlank(currentLocale)) {
        currentLocale = 'en';
      }

      _i18n.default.initialize(appInstance);

      assert.strictEqual(i18n.get('locale'), currentLocale, 'Current i18n-service locale is \'' + currentLocale + '\'');
    });
  });
});
define('dummy/tests/unit/instance-initializers/lock-test', ['dummy/instance-initializers/lock', 'qunit', 'dummy/tests/helpers/destroy-app'], function (_lock, _qunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Instance Initializer | lock', {
    beforeEach: function beforeEach() {
      var _this = this;

      Ember.run(function () {
        _this.application = Ember.Application.create();
        _this.appInstance = _this.application.buildInstance();
      });
    },
    afterEach: function afterEach() {
      Ember.run(this.appInstance, 'destroy');
      (0, _destroyApp.default)(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _lock.initialize)(this.appInstance);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('dummy/tests/unit/instance-initializers/moment-test', ['ember-flexberry/instance-initializers/moment', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (_moment, _qunit, _startApp, _destroyApp) {
  'use strict';

  var application = void 0;
  var appInstance = void 0;
  var defaultLocale = void 0;
  var defaultFormat = void 0;

  (0, _qunit.module)('Unit | Instance Initializer | moment', {
    beforeEach: function beforeEach() {
      application = (0, _startApp.default)();
      appInstance = application.buildInstance();

      // Run instance-initializer.
      _moment.default.initialize(appInstance);

      // Set 'en' as default locale.
      var i18n = appInstance.lookup('service:i18n');
      defaultLocale = 'en';
      i18n.set('locale', defaultLocale);

      // Set 'DD.MM.YYYY' as default date format.
      var moment = appInstance.lookup('service:moment');
      defaultFormat = 'DD.MM.YYYY';
      moment.set('defaultFormat', defaultFormat);
    },
    afterEach: function afterEach() {
      (0, _destroyApp.default)(appInstance);
      (0, _destroyApp.default)(application);
    }
  });

  (0, _qunit.test)('Changes in i18n-service locale causes same changes in moment-service & in global moment object', function (assert) {
    assert.expect(4);

    var i18n = appInstance.lookup('service:i18n');
    var moment = appInstance.lookup('service:moment');

    assert.strictEqual(moment.get('locale'), defaultLocale, 'Initial locale in moment service is equals to \'' + defaultLocale + '\'');
    assert.strictEqual(window.moment.locale(), defaultLocale, 'Initial locale in window.moment object is equals to \'' + defaultLocale + '\'');

    var newLocale = 'ru';
    i18n.set('locale', newLocale);

    assert.strictEqual(moment.get('locale'), newLocale, 'Initial locale in moment service is equals to \'' + newLocale + '\'');
    assert.strictEqual(window.moment.locale(), newLocale, 'Initial locale in window.moment object is equals to \'' + newLocale + '\'');
  });

  (0, _qunit.test)('Changes in moment-service default format causes same changes in global moment object', function (assert) {
    assert.expect(4);

    var moment = appInstance.lookup('service:moment');

    assert.strictEqual(moment.get('defaultFormat'), defaultFormat, 'Initial locale in moment service is equals to \'' + defaultFormat + '\'');
    assert.strictEqual(window.moment.defaultFormat, defaultFormat, 'Initial locale in window.moment object is equals to \'' + defaultFormat + '\'');

    var newDefaultFormat = 'MMMM Do YYYY, h:mm:ss a';
    moment.set('defaultFormat', newDefaultFormat);

    assert.strictEqual(moment.get('defaultFormat'), newDefaultFormat, 'Initial locale in moment service is equals to \'' + newDefaultFormat + '\'');
    assert.strictEqual(window.moment.defaultFormat, newDefaultFormat, 'Initial locale in window.moment object is equals to \'' + newDefaultFormat + '\'');
  });
});
define('dummy/tests/unit/mixins/dynamic-actions-test', ['ember-flexberry/mixins/dynamic-actions', 'ember-flexberry/objects/dynamic-action', 'qunit'], function (_dynamicActions, _dynamicAction, _qunit) {
  'use strict';

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var ComponentWithDynamicActionsMixin = Ember.Component.extend(_dynamicActions.default, {});

  (0, _qunit.module)('Unit | Mixin | dynamic-actions mixin');

  (0, _qunit.test)('Mixin throws assertion failed exception if specified \'dynamicActions\' is not array', function (assert) {
    var wrongDynamicActionsArray = Ember.A([1, true, false, 'some string', {}, function () {}, new Date(), new RegExp()]);

    assert.expect(wrongDynamicActionsArray.length);

    wrongDynamicActionsArray.forEach(function (wrongDynamicActions) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: wrongDynamicActions,
        renderer: {}
      });

      try {
        component.sendDynamicAction('someAction');
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*dynamicActions.*/gi.test(ex.message), true, 'Throws assertion failed exception if specified \'dynamicActions\' property is \'' + Ember.typeOf(wrongDynamicActions) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'on\' property', function (assert) {
    var wrongOnPropertiesArray = Ember.A([1, true, false, {}, [], function () {}, new Date(), new RegExp()]);

    assert.expect(wrongOnPropertiesArray.length);

    wrongOnPropertiesArray.forEach(function (wrongOnProperty) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: Ember.A([_dynamicAction.default.create({
          on: wrongOnProperty,
          actionHandler: null,
          actionName: null,
          actionContext: null,
          actionArguments: null
        })]),
        renderer: {}
      });

      try {
        component.sendDynamicAction('someAction');
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*on.*/gi.test(ex.message), true, 'Throws assertion failed exception if one of specified \'dynamicActions\' has \'on\' property of wrong type \'' + Ember.typeOf(wrongOnProperty) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'actionHandler\' property', function (assert) {
    var wrongActionHandlersArray = Ember.A([1, true, false, 'some string', {}, [], new Date(), new RegExp()]);

    assert.expect(wrongActionHandlersArray.length);

    wrongActionHandlersArray.forEach(function (wrongActionHandler) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: Ember.A([_dynamicAction.default.create({
          on: 'someAction',
          actionHandler: wrongActionHandler,
          actionName: null,
          actionContext: null,
          actionArguments: null
        })]),
        renderer: {}
      });

      try {
        component.sendDynamicAction('someAction');
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*actionHandler.*/gi.test(ex.message), true, 'Throws assertion failed exception if one of specified \'dynamicActions\' has \'actionHandler\' property of wrong type \'' + Ember.typeOf(wrongActionHandler) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'actionName\' property', function (assert) {
    var wrongActionNamesArray = Ember.A([1, true, false, {}, [], function () {}, new Date(), new RegExp()]);

    assert.expect(wrongActionNamesArray.length);

    wrongActionNamesArray.forEach(function (wrongActionName) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: Ember.A([_dynamicAction.default.create({
          on: 'someAction',
          actionHandler: null,
          actionName: wrongActionName,
          actionContext: null,
          actionArguments: null
        })]),
        renderer: {}
      });

      try {
        component.sendDynamicAction('someAction');
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*actionName.*/gi.test(ex.message), true, 'Throws assertion failed exception if one of specified \'dynamicActions\' has \'actionName\' property of wrong type \'' + Ember.typeOf(wrongActionName) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if one of specified \'dynamicActions\' has defined \'actionName\', but' + ' wrong \'actionContext\' property (without \'send\' method)', function (assert) {
    var wrongActionContextsArray = Ember.A([null, 1, true, false, {}, [], function () {}, new Date(), new RegExp(), { send: function send() {} }]);

    // Assertion shouldn't be send for last object containing 'send' method,
    // that's why length - 1.
    assert.expect(wrongActionContextsArray.length - 1);

    wrongActionContextsArray.forEach(function (wrongActionContext) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: Ember.A([_dynamicAction.default.create({
          on: 'someAction',
          actionHandler: null,
          actionName: 'onSomeAction',
          actionContext: wrongActionContext,
          actionArguments: null
        })]),
        renderer: {}
      });

      try {
        component.sendDynamicAction('someAction');
      } catch (ex) {
        assert.strictEqual(/method\s*.*send.*\s*.*actionContext.*/gi.test(ex.message), true, 'Throws assertion failed exception if one of specified \'dynamicActions\' has defined \'actionName\', ' + 'but wrong \'actionContext\' property (without \'send\' method)');
      }
    });
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'actionArguments\' property', function (assert) {
    var wrongActionArgumentsArray = Ember.A([1, true, false, 'some string', {}, function () {}, new Date(), new RegExp()]);

    assert.expect(wrongActionArgumentsArray.length);

    wrongActionArgumentsArray.forEach(function (wrongActionArguments) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: Ember.A([_dynamicAction.default.create({
          on: 'someAction',
          actionHandler: null,
          actionName: null,
          actionContext: null,
          actionArguments: wrongActionArguments
        })]),
        renderer: {}
      });

      try {
        component.sendDynamicAction('someAction');
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*actionArguments.*/gi.test(ex.message), true, 'Throws assertion failed exception if one of specified \'dynamicActions\' has \'actionArguments\' property of wrong type \'' + Ember.typeOf(wrongActionArguments) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin does\'t break it\'s owner\'s standard \'sendAction\' logic', function (assert) {
    assert.expect(1);

    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: Ember.A([_dynamicAction.default.create({
        on: 'someAction',
        actionHandler: null,
        actionName: null,
        actionContext: null,
        actionArguments: null
      })]),
      renderer: {}
    });

    var someActionHandlerHasBeenCalled = false;
    component.attrs.someAction = function () {
      someActionHandlerHasBeenCalled = true;
    };

    component.sendDynamicAction('someAction');

    assert.strictEqual(someActionHandlerHasBeenCalled, true, 'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
  });

  (0, _qunit.test)('Mixin triggers specified \'dynamicActions\' handlers (\'actionHandler\' callbacks only) ' + 'if \'actionContext\' isn\'t specified', function (assert) {
    assert.expect(10);

    var someActionDynamicHandlerHasBeenCalled = false;
    var someAnotherActionDynamicHandlerHasBeenCalled = false;
    var someActionAgainDynamicHandlerHasBeenCalled = false;

    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: Ember.A([_dynamicAction.default.create({
        on: 'someAction',
        actionHandler: function actionHandler() {
          someActionDynamicHandlerHasBeenCalled = true;
        },
        actionName: null,
        actionContext: null,
        actionArguments: null
      }), _dynamicAction.default.create({
        on: 'someAnotherAction',
        actionHandler: function actionHandler() {
          someAnotherActionDynamicHandlerHasBeenCalled = true;
        },
        actionName: null,
        actionContext: null,
        actionArguments: null
      }), _dynamicAction.default.create({
        on: 'someAction',
        actionHandler: function actionHandler() {
          someActionAgainDynamicHandlerHasBeenCalled = true;
        },
        actionName: null,
        actionContext: null,
        actionArguments: null
      })]),
      renderer: {}
    });

    var someActionHandlerHasBeenCalled = false;
    component.attrs.someAction = function () {
      someActionHandlerHasBeenCalled = true;
    };

    var someAnotherActionHandlerHasBeenCalled = false;
    component.attrs.someAnotherAction = function () {
      someAnotherActionHandlerHasBeenCalled = true;
    };

    component.sendDynamicAction('someAction');
    assert.strictEqual(someActionHandlerHasBeenCalled, true, 'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
    assert.strictEqual(someAnotherActionHandlerHasBeenCalled, false, 'Component still normally doesn\'t trigger proper action handlers ' + '(binded explicitly with ember API, not with dynamic actions) for yet unsended actions');

    assert.strictEqual(someActionDynamicHandlerHasBeenCalled, true, 'Component triggers specified in dynamic action \'actionHandler\' for component\'s \'someAction\'');
    assert.strictEqual(someAnotherActionDynamicHandlerHasBeenCalled, false, 'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAnotherAction\'');
    assert.strictEqual(someActionAgainDynamicHandlerHasBeenCalled, true, 'Component triggers specified in dynamic action another \'actionHandler\' for component\'s \'someAction\'');

    someActionHandlerHasBeenCalled = false;
    someAnotherActionHandlerHasBeenCalled = false;
    someAnotherActionDynamicHandlerHasBeenCalled = false;
    someActionDynamicHandlerHasBeenCalled = false;
    someActionAgainDynamicHandlerHasBeenCalled = false;

    component.sendDynamicAction('someAnotherAction');
    assert.strictEqual(someActionHandlerHasBeenCalled, false, 'Component still normally doesn\'t trigger proper action handlers ' + '(binded explicitly with ember API, not with dynamic actions) for yet unsended actions');
    assert.strictEqual(someAnotherActionHandlerHasBeenCalled, true, 'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');

    assert.strictEqual(someActionDynamicHandlerHasBeenCalled, false, 'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAction\'');
    assert.strictEqual(someAnotherActionDynamicHandlerHasBeenCalled, true, 'Component triggers specified in dynamic action \'actionHandler\' for component\'s \'anotherAction\'');
    assert.strictEqual(someActionAgainDynamicHandlerHasBeenCalled, false, 'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAction\'');
  });

  (0, _qunit.test)('Mixin triggers all specified \'dynamicActions\' handlers (callbacks & normal actions) on given context', function (assert) {
    assert.expect(22);

    var someActionControllersHandlerHasBeenCalled = false;
    var someActionControllersHandlerContext = null;

    var someAnoterActionControllersHandlerHasBeenCalled = false;
    var someAnotherActionControllersHandlerContext = null;

    var someActionAgainControllersHandlerHasBeenCalled = false;
    var someActionAgainControllersHandlerContext = null;

    var controller = Ember.Controller.extend({
      actions: {
        onSomeAction: function onSomeAction() {
          someActionControllersHandlerHasBeenCalled = true;
          someActionControllersHandlerContext = this;
        },

        onSomeAnotherAction: function onSomeAnotherAction() {
          someAnoterActionControllersHandlerHasBeenCalled = true;
          someAnotherActionControllersHandlerContext = this;
        },

        onSomeActionAgain: function onSomeActionAgain() {
          someActionAgainControllersHandlerHasBeenCalled = true;
          someActionAgainControllersHandlerContext = this;
        }
      }
    }).create();

    var someActionDynamicHandlerHasBeenCalled = false;
    var someActionDynamicHandlerContext = null;

    var someAnotherActionDynamicHandlerHasBeenCalled = false;
    var someAnotherActionDynamicHandlerContext = null;

    var someActionAgainDynamicHandlerHasBeenCalled = false;
    var someActionAgainDynamicHandlerContext = null;

    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: Ember.A([_dynamicAction.default.create({
        on: 'someAction',
        actionHandler: function actionHandler() {
          someActionDynamicHandlerHasBeenCalled = true;
          someActionDynamicHandlerContext = this;
        },
        actionName: 'onSomeAction',
        actionContext: controller,
        actionArguments: null
      }), _dynamicAction.default.create({
        on: 'someAnotherAction',
        actionHandler: function actionHandler() {
          someAnotherActionDynamicHandlerHasBeenCalled = true;
          someAnotherActionDynamicHandlerContext = this;
        },
        actionName: 'onSomeAnotherAction',
        actionContext: controller,
        actionArguments: null
      }), _dynamicAction.default.create({
        on: 'someAction',
        actionHandler: function actionHandler() {
          someActionAgainDynamicHandlerHasBeenCalled = true;
          someActionAgainDynamicHandlerContext = this;
        },
        actionName: 'onSomeActionAgain',
        actionContext: controller,
        actionArguments: null
      })]),
      renderer: {}
    });

    var someActionHandlerHasBeenCalled = false;
    component.attrs.someAction = function () {
      someActionHandlerHasBeenCalled = true;
    };

    var someAnotherActionHandlerHasBeenCalled = false;
    component.attrs.someAnotherAction = function () {
      someAnotherActionHandlerHasBeenCalled = true;
    };

    component.sendDynamicAction('someAction');
    assert.strictEqual(someActionHandlerHasBeenCalled, true, 'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
    assert.strictEqual(someAnotherActionHandlerHasBeenCalled, false, 'Component still normally doesn\'t trigger proper action handlers ' + '(binded explicitly with ember API, not with dynamic actions) for yet unsended actions');

    assert.strictEqual(someActionDynamicHandlerHasBeenCalled, true, 'Component triggers specified in dynamic action \'actionHandler\' for component\'s \'someAction\'');
    assert.strictEqual(someActionDynamicHandlerContext, controller, 'Component triggers specified in dynamic action \'actionHandler\' for ' + 'component\'s \'someAction\' with specified \'actionContext\'');
    assert.strictEqual(someAnotherActionDynamicHandlerHasBeenCalled, false, 'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to ' + 'yet unsended \'someAnotherAction\'');
    assert.strictEqual(someActionAgainDynamicHandlerHasBeenCalled, true, 'Component triggers specified in dynamic action another \'actionHandler\' for component\'s \'someAction\'');
    assert.strictEqual(someActionAgainDynamicHandlerContext, controller, 'Component triggers specified in dynamic action \'actionHandler\' for ' + 'component\'s \'someAction\' with specified \'actionContext\'');

    assert.strictEqual(someActionControllersHandlerHasBeenCalled, true, 'Component triggers on given \'actionContext\' action with specified \'actionName\' for component\'s \'someAction\'');
    assert.strictEqual(someActionControllersHandlerContext, controller, 'Component triggers on given \'actionContext\' action with specified \'actionName\' for ' + 'component\'s \'someAction\' with specified \'actionContext\'');
    assert.strictEqual(someAnotherActionDynamicHandlerHasBeenCalled, false, 'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAnotherAction\'');
    assert.strictEqual(someActionAgainControllersHandlerHasBeenCalled, true, 'Component triggers on given \'actionContext\' action with specified \'actionName\' for component\'s \'someAction\'');
    assert.strictEqual(someActionAgainControllersHandlerContext, controller, 'Component triggers on given \'actionContext\' action with specified \'actionName\' for ' + 'component\'s \'someAction\' with specified \'actionContext\'');

    someActionHandlerHasBeenCalled = false;
    someAnotherActionHandlerHasBeenCalled = false;

    someActionDynamicHandlerHasBeenCalled = false;
    someActionDynamicHandlerContext = null;

    someAnotherActionDynamicHandlerHasBeenCalled = false;
    someAnotherActionDynamicHandlerContext = null;

    someActionAgainDynamicHandlerHasBeenCalled = false;
    someActionAgainDynamicHandlerContext = null;

    someActionControllersHandlerHasBeenCalled = false;
    someActionControllersHandlerContext = null;

    someAnoterActionControllersHandlerHasBeenCalled = false;
    someAnotherActionControllersHandlerContext = null;

    someActionAgainControllersHandlerHasBeenCalled = false;
    someActionAgainControllersHandlerContext = null;

    component.sendDynamicAction('someAnotherAction');
    assert.strictEqual(someActionHandlerHasBeenCalled, false, 'Component still normally doesn\'t trigger proper action handlers ' + '(binded explicitly with ember API, not with dynamic actions) for yet unsended actions');
    assert.strictEqual(someAnotherActionHandlerHasBeenCalled, true, 'Component still normally triggers proper action handlers ' + '(binded explicitly with ember API, not with dynamic actions)');

    assert.strictEqual(someActionDynamicHandlerHasBeenCalled, false, 'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAction\'');
    assert.strictEqual(someAnotherActionDynamicHandlerHasBeenCalled, true, 'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAnotherAction\'');
    assert.strictEqual(someAnotherActionDynamicHandlerContext, controller, 'Component triggers specified in dynamic action \'actionHandler\' for ' + 'component\'s \'someAnotherAction\' with specified \'actionContext\'');
    assert.strictEqual(someActionAgainDynamicHandlerHasBeenCalled, false, 'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded ' + 'to yet unsended \'someAction\'');

    assert.strictEqual(someActionControllersHandlerHasBeenCalled, false, 'Component doesn\'t trigger on given \'actionContext\' action with specified \'actionName\' binded ' + 'to yet unsended \'someAction\'');
    assert.strictEqual(someAnoterActionControllersHandlerHasBeenCalled, true, 'Component triggers on given \'actionContext\' action with specified \'actionName\' for ' + 'component\'s \'someAnotherAction\'');
    assert.strictEqual(someAnotherActionControllersHandlerContext, controller, 'Component triggers on given \'actionContext\' action with specified \'actionName\' for ' + 'component\'s \'someAnotherAction\' with specified \'actionContext\'');
    assert.strictEqual(someActionAgainControllersHandlerHasBeenCalled, false, 'Component doesn\'t trigger on given \'actionContext\' action with specified \'actionName\' binded to ' + 'yet unsended \'someAction\'');
  });

  (0, _qunit.test)('Mixin works properly with \'dynamicActions\' added/removed after component initialization', function (assert) {
    assert.expect(8);

    // Define component without any dynamic actions.
    var dynamicActions = Ember.A();
    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: dynamicActions,
      renderer: {}
    });

    // Define controller.
    var someActionControllersHandlerHasBeenCalled = false;
    var someActionControllersHandlerContext = null;
    var controller = Ember.Controller.extend({
      actions: {
        onSomeAction: function onSomeAction() {
          someActionControllersHandlerHasBeenCalled = true;
          someActionControllersHandlerContext = this;
        }
      }
    }).create();

    // Define dynamic action.
    var someActionDynamicHandlerHasBeenCalled = false;
    var someActionDynamicHandlerContext = null;
    var someDynamicAction = _dynamicAction.default.create({
      on: 'someAction',
      actionHandler: function actionHandler() {
        someActionDynamicHandlerHasBeenCalled = true;
        someActionDynamicHandlerContext = this;
      },
      actionName: 'onSomeAction',
      actionContext: controller,
      actionArguments: null
    });

    var someActionHandlerHasBeenCalled = false;
    component.attrs.someAction = function () {
      someActionHandlerHasBeenCalled = true;
    };

    // Add defined dynamic action to a component after it has been already initialized.
    dynamicActions.pushObject(someDynamicAction);

    // Check that all handlers were called with expected context.
    component.sendDynamicAction('someAction');
    assert.strictEqual(someActionHandlerHasBeenCalled, true, 'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
    assert.strictEqual(someActionDynamicHandlerHasBeenCalled, true, 'Component triggers specified in added dynamic action \'actionHandler\' for component\'s \'someAction\'');
    assert.strictEqual(someActionDynamicHandlerContext, controller, 'Component triggers specified in added dynamic action \'actionHandler\' for ' + 'component\'s \'someAction\' with specified \'actionContext\'');
    assert.strictEqual(someActionControllersHandlerHasBeenCalled, true, 'Component triggers on added dynamic action\'s \'actionContext\' action with specified \'actionName\' for ' + 'component\'s \'someAction\'');
    assert.strictEqual(someActionControllersHandlerContext, controller, 'Component triggers on added dynamic action\'s \'actionContext\' action with specified \'actionName\' for ' + 'component\'s \'someAction\' with specified \'actionContext\'');

    someActionHandlerHasBeenCalled = false;
    someActionDynamicHandlerHasBeenCalled = false;
    someActionDynamicHandlerContext = false;
    someActionControllersHandlerHasBeenCalled = false;
    someActionControllersHandlerContext = false;

    // Remove defined dynamic action to a component after it has been already initialized.
    dynamicActions.removeObject(someDynamicAction);
    component.sendDynamicAction('someAction');
    assert.strictEqual(someActionHandlerHasBeenCalled, true, 'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
    assert.strictEqual(someActionDynamicHandlerHasBeenCalled, false, 'Component doesn\'t trigger specified in removed dynamic action \'actionHandler\' for component\'s \'someAction\'');
    assert.strictEqual(someActionControllersHandlerHasBeenCalled, false, 'Component doesn\'t trigger on removed dynamic action\'s \'actionContext\' action with specified \'actionName\' for ' + 'component\'s \'someAction\'');
  });

  (0, _qunit.test)('Mixin adds specified in \'dynamicActions\' \'actionArguments\' to the beginning of handler\'s arguments array', function (assert) {
    assert.expect(3);

    var dynamicActionArguments = Ember.A(['firstDynamicArgument', 'secondDynamicArgument']);

    var someActionHandlerArguments = null;
    var someActionDynamicHandlerArguments = null;
    var someActionDynamicControllersHandlerArguments = null;

    var controller = Ember.Controller.extend({
      actions: {
        onSomeAction: function onSomeAction() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          someActionDynamicControllersHandlerArguments = Ember.A(args);
        }
      }
    }).create();

    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: Ember.A([_dynamicAction.default.create({
        on: 'someAction',
        actionHandler: function actionHandler() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          someActionDynamicHandlerArguments = Ember.A(args);
        },
        actionName: 'onSomeAction',
        actionContext: controller,
        actionArguments: dynamicActionArguments
      })]),
      renderer: {}
    });

    component.attrs.someAction = function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      someActionHandlerArguments = Ember.A(args);
    };

    // Check that all handlers were called with expected arguments.
    var originalActionArguments = Ember.A(['firstOriginalArgument', 'secondOriginalArgument']);
    component.sendDynamicAction.apply(component, ['someAction'].concat(_toConsumableArray(originalActionArguments)));
    assert.strictEqual(someActionHandlerArguments[0] === originalActionArguments[0] && someActionHandlerArguments[1] === originalActionArguments[1], true, 'Component\'s original action handler doesn\'t contain additional \'actionArguments\' from \'dynamicActions\' (only original arguments)');
    assert.strictEqual(someActionDynamicHandlerArguments[0] === dynamicActionArguments[0] && someActionDynamicHandlerArguments[1] === dynamicActionArguments[1] && someActionDynamicHandlerArguments[2] === originalActionArguments[0] && someActionDynamicHandlerArguments[3] === originalActionArguments[1], true, 'Component\'s dynamic action handler contains additional \'actionArguments\' from \'dynamicActions\'');
    assert.strictEqual(someActionDynamicControllersHandlerArguments[0] === dynamicActionArguments[0] && someActionDynamicControllersHandlerArguments[1] === dynamicActionArguments[1] && someActionDynamicControllersHandlerArguments[2] === originalActionArguments[0] && someActionDynamicControllersHandlerArguments[3] === originalActionArguments[1], true, 'Action handler with specified \'actionName\' contains additional \'actionArguments\' from \'dynamicActions\'');
  });

  (0, _qunit.test)('Mixin doesn\'t trigger component\'s inner method if outer action handler is not defined', function (assert) {
    assert.expect(2);

    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      renderer: {}
    });

    var innerSomeActionHasBeenCalled = false;
    component.someAction = function () {
      innerSomeActionHasBeenCalled = true;
    };

    component.sendDynamicAction('someAction');
    assert.strictEqual(innerSomeActionHasBeenCalled, false, 'Component doesn\'t trigger inner \'someAction\' method');

    var outerSomeActionHasBeenCalled = false;
    component.attrs.someAction = function () {
      outerSomeActionHasBeenCalled = true;
    };

    component.sendDynamicAction('someAction');
    assert.strictEqual(outerSomeActionHasBeenCalled && !innerSomeActionHasBeenCalled, true, 'Component trigger\'s outer \'someAction\' handler');
  });
});
define('dummy/tests/unit/mixins/dynamic-properties-test', ['ember-flexberry/mixins/dynamic-properties', 'qunit'], function (_dynamicProperties, _qunit) {
  'use strict';

  var ClassWithDynamicPropertiesMixin = Ember.Object.extend(_dynamicProperties.default, {});

  (0, _qunit.module)('Unit | Mixin | dynamic-properties mixin');

  (0, _qunit.test)('Mixin throws assertion failed exception if specified \'dynamicProperties\' property is not an \'object\' or an \'instance\'', function (assert) {
    var wrongDynamicPropertiesArray = Ember.A([1, true, false, 'some string', [], function () {}, new Date(), new RegExp()]);

    assert.expect(wrongDynamicPropertiesArray.length);

    wrongDynamicPropertiesArray.forEach(function (wrongDynamicProperties) {
      try {
        ClassWithDynamicPropertiesMixin.create({ dynamicProperties: wrongDynamicProperties });
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*dynamicProperties.*/gi.test(ex.message), true, 'Throws assertion failed exception if specified \'dynamicProperties\' property is \'' + Ember.typeOf(wrongDynamicProperties) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin assignes it\'s owner\'s properties form the specified \'dynamicProperties\'', function (assert) {
    assert.expect(1);

    var propertyValue = 'MyValue';
    var dynamicProperties = { property: propertyValue };
    var mixinOwner = ClassWithDynamicPropertiesMixin.create({ dynamicProperties: dynamicProperties });

    assert.strictEqual(mixinOwner.get('property'), propertyValue, 'Owner\'s properties are equals to related \'dynamicProperties\'');
  });

  (0, _qunit.test)('Mixin changes it\'s owner\'s properties (when something changes inside related \'dynamicProperties\')', function (assert) {
    assert.expect(2);

    var propertyValue = 'MyValue';
    var dynamicProperties = { property: propertyValue };
    var mixinOwner = ClassWithDynamicPropertiesMixin.create({ dynamicProperties: dynamicProperties });

    assert.strictEqual(mixinOwner.get('property'), propertyValue, 'Owner\'s properties are equals to related \'dynamicProperties\'');

    var propertyChangedValue = 'MyChangedValue';
    Ember.set(dynamicProperties, 'property', propertyChangedValue);

    assert.strictEqual(mixinOwner.get('property'), propertyChangedValue, 'Owner\'s properties changes when values inside \'dynamicProperties\' changes');
  });

  (0, _qunit.test)('Mixin removes old & adds new owner\'s properties (when reference to whole \'dynamicProperties\' object changes)', function (assert) {
    assert.expect(22);

    var propertyValue = 'MyProperty';
    var anotherPropertyValue = 'MyAnotherProperty';
    var dynamicProperties = { property: propertyValue, anotherProperty: anotherPropertyValue };

    var usualPropertyValue = 'MyUsualProperty';

    var mixinOwner = ClassWithDynamicPropertiesMixin.create({
      usualProperty: usualPropertyValue,
      dynamicProperties: dynamicProperties
    });

    assert.strictEqual(mixinOwner.get('usualProperty'), usualPropertyValue, 'Owner\'s \'usualProperty\' is equals to it\'s initially defined value');
    assert.strictEqual(mixinOwner.get('property'), propertyValue, 'Owner\'s \'property\' is equals to related dynamicProperty');
    assert.strictEqual(mixinOwner.get('anotherProperty'), anotherPropertyValue, 'Owner\'s \'anotherProperty\' is equals to related dynamicProperty');

    var ownerPropertiesNames = Ember.A(Object.keys(mixinOwner));
    assert.strictEqual(ownerPropertiesNames.includes('usualProperty'), true, 'Owner\'s properties keys contains \'usualProperty\'');
    assert.strictEqual(ownerPropertiesNames.includes('property'), true, 'Owner\'s properties keys contains \'property\'');
    assert.strictEqual(ownerPropertiesNames.includes('anotherProperty'), true, 'Owner\'s properties keys contains \'anotherProperty\'');

    var newPropertyValue = 'MyNewProperty';
    var newAnotherPropertyValue = 'MyNewAnotherProperty';
    var newDynamicProperties = { newProperty: newPropertyValue, newAnotherProperty: newAnotherPropertyValue };
    mixinOwner.set('dynamicProperties', newDynamicProperties);

    assert.strictEqual(mixinOwner.get('usualProperty'), usualPropertyValue, 'Owner\'s \'usualProperty\' is equals to it\'s initially defined value (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(Ember.typeOf(mixinOwner.get('property')), 'undefined', 'Owner\'s \'property\' is undefined (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(Ember.typeOf(mixinOwner.get('anotherProperty')), 'undefined', 'Owner\'s \'anotherProperty\' is undefined (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(mixinOwner.get('newProperty'), newPropertyValue, 'Owner\'s \'newProperty\' is equals to related dynamicProperty (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(mixinOwner.get('newAnotherProperty'), newAnotherPropertyValue, 'Owner\'s \'newAnotherProperty\' is equals to related dynamicProperty (after change of whole \'dynamicProperties\' object)');

    ownerPropertiesNames = Ember.A(Object.keys(mixinOwner));
    assert.strictEqual(ownerPropertiesNames.includes('usualProperty'), true, 'Owner\'s properties keys contains \'usualProperty\' (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(ownerPropertiesNames.includes('property'), false, 'Owner\'s properties keys doesn\'t contains \'property\' (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(ownerPropertiesNames.includes('anotherProperty'), false, 'Owner\'s properties keys doesn\'t contains \'anotherProperty\' (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(ownerPropertiesNames.includes('newProperty'), true, 'Owner\'s properties keys contains \'newProperty\' (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(ownerPropertiesNames.includes('newAnotherProperty'), true, 'Owner\'s properties keys contains \'newAnotherProperty\' (after change of whole \'dynamicProperties\' object)');

    mixinOwner.set('dynamicProperties', null);
    assert.strictEqual(mixinOwner.get('usualProperty'), usualPropertyValue, 'Owner\'s \'usualProperty\' is equals to it\'s initially defined value (after change of whole \'dynamicProperties\' object to null)');
    assert.strictEqual(Ember.typeOf(mixinOwner.get('newProperty')), 'undefined', 'Owner\'s \'newProperty\' is undefined (after change of whole \'dynamicProperties\' object to null)');
    assert.strictEqual(Ember.typeOf(mixinOwner.get('newAnotherProperty')), 'undefined', 'Owner\'s \'newAnotherProperty\' is undefined (after change of whole \'dynamicProperties\' object to null)');

    ownerPropertiesNames = Ember.A(Object.keys(mixinOwner));
    assert.strictEqual(ownerPropertiesNames.includes('usualProperty'), true, 'Owner\'s properties keys contains \'usualProperty\' (after change of whole \'dynamicProperties\' object to null)');
    assert.strictEqual(ownerPropertiesNames.includes('newProperty'), false, 'Owner\'s properties keys doesn\'t contains \'newProperty\' (after change of whole \'dynamicProperties\' object to null)');
    assert.strictEqual(ownerPropertiesNames.includes('newAnotherProperty'), false, 'Owner\'s properties keys doesn\'t contains \'newAnotherProperty\' (after change of whole \'dynamicProperties\' object to null)');
  });

  (0, _qunit.test)('Mixin removes assigned \'dynamicProperties\' before owner will be destroyed', function (assert) {
    assert.expect(12);

    var propertyValue = 'MyProperty';
    var anotherPropertyValue = 'MyAnotherProperty';
    var dynamicProperties = { property: propertyValue, anotherProperty: anotherPropertyValue };

    var usualPropertyValue = 'MyUsualProperty';

    var mixinOwner = ClassWithDynamicPropertiesMixin.create({
      usualProperty: usualPropertyValue,
      dynamicProperties: dynamicProperties
    });

    assert.strictEqual(mixinOwner.get('usualProperty'), usualPropertyValue, 'Owner\'s \'usualProperty\' is equals to it\'s initially defined value');
    assert.strictEqual(mixinOwner.get('property'), propertyValue, 'Owner\'s \'property\' is equals to related dynamicProperty');
    assert.strictEqual(mixinOwner.get('anotherProperty'), anotherPropertyValue, 'Owner\'s \'anotherProperty\' is equals to related dynamicProperty');

    var ownerPropertiesNames = Ember.A(Object.keys(mixinOwner));
    assert.strictEqual(ownerPropertiesNames.includes('usualProperty'), true, 'Owner\'s properties keys contains \'usualProperty\'');
    assert.strictEqual(ownerPropertiesNames.includes('property'), true, 'Owner\'s properties keys contains \'property\'');
    assert.strictEqual(ownerPropertiesNames.includes('anotherProperty'), true, 'Owner\'s properties keys contains \'anotherProperty\'');

    mixinOwner.willDestroy();

    assert.strictEqual(mixinOwner.get('usualProperty'), usualPropertyValue, 'Owner\'s \'usualProperty\' is equals to it\'s initially defined value (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(Ember.typeOf(mixinOwner.get('property')), 'undefined', 'Owner\'s \'property\' is undefined (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(Ember.typeOf(mixinOwner.get('anotherProperty')), 'undefined', 'Owner\'s \'anotherProperty\' is undefined (after change of whole \'dynamicProperties\' object)');

    ownerPropertiesNames = Ember.A(Object.keys(mixinOwner));
    assert.strictEqual(ownerPropertiesNames.includes('usualProperty'), true, 'Owner\'s properties keys contains \'usualProperty\'');
    assert.strictEqual(ownerPropertiesNames.includes('property'), false, 'Owner\'s properties keys doesn\'t contains \'property\'');
    assert.strictEqual(ownerPropertiesNames.includes('anotherProperty'), false, 'Owner\'s properties keys doesn\'t contains \'anotherProperty\'');
  });
});
define('dummy/tests/unit/mixins/errorable-route-test', ['ember-flexberry/mixins/errorable-route', 'qunit'], function (_errorableRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | errorable route');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var ErrorableRouteObject = Ember.Object.extend(_errorableRoute.default);
    var subject = ErrorableRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/flexberry-file-controller-test', ['ember-flexberry/mixins/flexberry-file-controller', 'qunit'], function (_flexberryFileController, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | flexberry file controller');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var FlexberryFileControllerObject = Ember.Object.extend(_flexberryFileController.default);
    var subject = FlexberryFileControllerObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/flexberry-groupedit-route-test', ['ember-flexberry/mixins/flexberry-groupedit-route', 'qunit'], function (_flexberryGroupeditRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | flexberry groupedit route');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var FlexberryGroupeditRouteObject = Ember.Object.extend(_flexberryGroupeditRoute.default);
    var subject = FlexberryGroupeditRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/lock-route-test', ['ember-flexberry/mixins/lock-route', 'qunit'], function (_lockRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | lock-route');

  (0, _qunit.test)('it works', function (assert) {
    assert.expect(3);
    var done = assert.async();
    var EditFormRoute = Ember.Route.extend(_lockRoute.default);
    var route = EditFormRoute.create();
    Ember.run(function () {
      assert.ok(route, 'Route created.');
      Ember.RSVP.all([route.openReadOnly().then(function (answer) {
        assert.ok(answer, 'Default \'openReadOnly\' === \'true\'.');
      }), route.unlockObject().then(function (answer) {
        assert.ok(answer, 'Default \'unlockObject\' === \'true\'.');
      })]).then(done);
    });
  });
});
define('dummy/tests/unit/mixins/modal-application-route-test', ['ember-flexberry/mixins/modal-application-route', 'qunit'], function (_modalApplicationRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('ModalApplicationRouteMixin');

  (0, _qunit.test)('it works', function (assert) {
    var ModalApplicationRouteObject = Ember.Object.extend(_modalApplicationRoute.default);
    var subject = ModalApplicationRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/multi-list-controller-test', ['ember-flexberry/mixins/multi-list-controller', 'qunit'], function (_multiListController, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | multi list controller');

  (0, _qunit.test)('it works', function (assert) {
    var MultiListControllerObject = Ember.Object.extend(_multiListController.default);
    var subject = MultiListControllerObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/multi-list-model-edit-test', ['ember-flexberry/mixins/multi-list-model-edit', 'qunit'], function (_multiListModelEdit, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | multi list model edit');

  (0, _qunit.test)('it works', function (assert) {
    var MultiListModelEditObject = Ember.Object.extend(_multiListModelEdit.default);
    var subject = MultiListModelEditObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/multi-list-model-test', ['ember-flexberry/mixins/multi-list-model', 'qunit'], function (_multiListModel, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | multi list model');

  (0, _qunit.test)('it works', function (assert) {
    var MultiListModelObject = Ember.Object.extend(_multiListModel.default);
    var subject = MultiListModelObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/multi-list-route-test', ['ember-flexberry/mixins/multi-list-route', 'qunit'], function (_multiListRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | multi list route');

  (0, _qunit.test)('it works', function (assert) {
    var MultiListRouteObject = Ember.Object.extend(_multiListRoute.default);
    var subject = MultiListRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/paginated-controller-test', ['ember-flexberry/mixins/paginated-controller', 'qunit'], function (_paginatedController, _qunit) {
  'use strict';

  (0, _qunit.module)('PaginatedControllerMixin');

  (0, _qunit.test)('it works', function (assert) {
    var PaginatedControllerObject = Ember.Object.extend(_paginatedController.default);
    var subject = PaginatedControllerObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/paginated-route-test', ['ember-flexberry/mixins/paginated-route', 'qunit'], function (_paginatedRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('PaginatedRouteMixin');

  (0, _qunit.test)('it works', function (assert) {
    var PaginatedRouteObject = Ember.Object.extend(_paginatedRoute.default);
    var subject = PaginatedRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/predicate-from-filters-test', ['ember-flexberry/mixins/predicate-from-filters', 'qunit'], function (_predicateFromFilters, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | predicate from filters');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var PredicateFromFiltersObject = Ember.Object.extend(_predicateFromFilters.default);
    var subject = PredicateFromFiltersObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/reload-list-mixin-test', ['ember-data', 'ember-flexberry/mixins/reload-list-mixin', 'qunit', 'dummy/tests/helpers/start-app', 'ember-flexberry-data/models/model', 'ember-flexberry-data/utils/attributes', 'ember-flexberry-data/serializers/odata', 'ember-flexberry-data/query/predicate'], function (_emberData, _reloadListMixin, _qunit, _startApp, _model, _attributes, _odata, _predicate) {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  (0, _qunit.module)('Unit | Mixin | reload list mixin');

  (0, _qunit.test)('it works', function (assert) {
    var ReloadListMixinObject = Ember.Object.extend(_reloadListMixin.default);
    var subject = ReloadListMixinObject.create();
    assert.ok(subject);
  });

  (0, _qunit.test)('it properly generates simple filter predicate', function (assert) {
    var Model = _model.default.extend({
      firstName: _emberData.default.attr('string')
    });

    Model.defineProjection('EmployeeE', 'employeeTest', {
      firstName: (0, _attributes.attr)()
    });

    var modelSerializer = _odata.default.extend({});
    var projection = Ember.get(Model, 'projections').EmployeeE;

    var app = (0, _startApp.default)();

    app.register('model:employeeTest', Model);
    app.register('serializer:employeeTest', modelSerializer);
    var store = app.__container__.lookup('service:store');

    var ReloadListMixinObject = Ember.Object.extend(_reloadListMixin.default);
    var objectInstance = ReloadListMixinObject.create();
    objectInstance.store = store;

    var result = objectInstance._getFilterPredicate(projection, { filter: 'test' });
    var resultUndefined = objectInstance._getFilterPredicate(projection, { filter: undefined });
    var resultEmpty = objectInstance._getFilterPredicate(projection, { filter: '' });
    Ember.run(app, 'destroy');

    assert.equal(typeof result === 'undefined' ? 'undefined' : _typeof(result), 'object');
    assert.equal(result.constructor, _predicate.StringPredicate);
    assert.equal(result.attributePath, 'firstName');
    assert.equal(result.containsValue, 'test');

    assert.equal(resultUndefined, null);
    assert.equal(resultEmpty, null);
  });

  (0, _qunit.test)('it properly generates complex filter predicate', function (assert) {
    var Model0 = _model.default.extend({
      firstName: _emberData.default.attr('string'),
      lastName: _emberData.default.attr('string'),
      dateField: _emberData.default.attr('date'),
      numberField: _emberData.default.attr('number')
    });

    var app = (0, _startApp.default)();
    app.register('model:employeeTest2', Model0);

    var Model = _model.default.extend({
      firstName: _emberData.default.attr('string'),
      lastName: _emberData.default.attr('string'),
      dateField: _emberData.default.attr('date'),
      numberField: _emberData.default.attr('number'),
      masterField: _emberData.default.belongsTo('employeeTest2', { inverse: null, async: false })
    });

    app.register('model:employeeTest', Model);

    Model.defineProjection('EmployeeE', 'employeeTest', {
      firstName: (0, _attributes.attr)(),
      lastName: (0, _attributes.attr)(),
      dateField: (0, _attributes.attr)(),
      numberField: (0, _attributes.attr)(),
      reportsTo: (0, _attributes.belongsTo)('employeeTest2', 'Reports To', {
        firstName: (0, _attributes.attr)('Reports To - First Name', {
          hidden: true
        })
      }, {
        displayMemberPath: 'firstName'
      })
    });

    var modelSerializer = _odata.default.extend({});
    var modelSerializer0 = _odata.default.extend({});
    var projection = Ember.get(Model, 'projections').EmployeeE;

    app.register('serializer:employeeTest2', modelSerializer0);
    app.register('serializer:employeeTest', modelSerializer);
    var store = app.__container__.lookup('service:store');

    var ReloadListMixinObject = Ember.Object.extend(_reloadListMixin.default);
    var objectInstance = ReloadListMixinObject.create();
    objectInstance.store = store;
    var result = objectInstance._getFilterPredicate(projection, { filter: '123' });
    Ember.run(app, 'destroy');

    assert.equal(typeof result === 'undefined' ? 'undefined' : _typeof(result), 'object');
    assert.equal(result.constructor, _predicate.ComplexPredicate);
    assert.equal(result.condition, 'or');

    // It counts only string fields.
    assert.equal(result.predicates.length, 4);
    assert.equal(result.predicates[0].constructor, _predicate.StringPredicate);
    assert.equal(result.predicates[0].attributePath, 'firstName');
    assert.equal(result.predicates[0].containsValue, '123');
    assert.equal(result.predicates[2].constructor, _predicate.SimplePredicate);
    assert.equal(result.predicates[2].attributePath, 'numberField');
    assert.equal(result.predicates[2].operator, 'eq');
    assert.equal(result.predicates[2].value, '123');
    assert.equal(result.predicates[3].constructor, _predicate.StringPredicate);
    assert.equal(result.predicates[3].attributePath, 'reportsTo.firstName');
    assert.equal(result.predicates[3].containsValue, '123');
  });
});
define('dummy/tests/unit/mixins/sortable-controller-test', ['ember-flexberry/mixins/sortable-controller', 'qunit'], function (_sortableController, _qunit) {
  'use strict';

  (0, _qunit.module)('SortableControllerMixin');

  (0, _qunit.test)('it works', function (assert) {
    var SortableControllerObject = Ember.Object.extend(_sortableController.default);
    var subject = SortableControllerObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/sortable-route-test', ['ember-flexberry/mixins/sortable-route', 'qunit'], function (_sortableRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('SortableRouteMixin');

  (0, _qunit.test)('it works', function (assert) {
    var SortableRouteObject = Ember.Object.extend(_sortableRoute.default);
    var subject = SortableRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/models/new-platform-flexberry-flexberry-user-setting-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('new-platform-flexberry-flexberry-user-setting', 'Unit | Model | new-platform-flexberry-flexberry-user-setting', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    assert.ok(!!model);
  });
});
define('dummy/tests/unit/models/new-platform-flexberry-services-lock-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('new-platform-flexberry-services-lock', 'Unit | Model | new-platform-flexberry-services-lock');

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    assert.ok(!!model);
  });
});
define('dummy/tests/unit/routes/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:application', {
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('dummy/tests/unit/routes/edit-form-new-test', ['ember-qunit', 'ember-flexberry/routes/edit-form-new'], function (_emberQunit, _editFormNew) {
  'use strict';

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = _editFormNew.default.create();
    assert.ok(route);
  });
});
define('dummy/tests/unit/routes/edit-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:edit-form', 'Unit | Route | edit form', {
    needs: ['service:cols-config-menu', 'service:detail-interaction', 'service:objectlistview-events', 'service:user-settings', 'service:app-state', 'service:adv-limit']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('dummy/tests/unit/routes/list-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:list-form', 'Unit | Route | list form', {
    needs: ['service:cols-config-menu', 'service:form-load-time-tracker', 'service:objectlistview-events', 'service:app-state', 'service:adv-limit']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('dummy/tests/unit/routes/new-platform-flexberry-services-lock-list-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:new-platform-flexberry-services-lock-list', 'Unit | Route | new-platform-flexberry-services-lock-list', {
    needs: ['service:cols-config-menu', 'service:form-load-time-tracker', 'service:objectlistview-events', 'service:app-state', 'service:adv-limit']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('dummy/tests/unit/routes/projected-model-form-test', ['qunit', 'ember-flexberry/routes/projected-model-form'], function (_qunit, _projectedModelForm) {
  'use strict';

  (0, _qunit.module)('route:projected-model-form');

  (0, _qunit.test)('it exists', function (assert) {
    var route = _projectedModelForm.default.create();
    assert.ok(route);
  });
});
define('dummy/tests/unit/serializers/new-platform-flexberry-services-lock-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('new-platform-flexberry-services-lock', 'Unit | Serializer | new-platform-flexberry-services-lock', {
    needs: ['serializer:new-platform-flexberry-services-lock']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();
    var serializedRecord = record.serialize();
    assert.ok(serializedRecord);
  });
});
define('dummy/tests/unit/services/app-state-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:app-state', 'Unit | Service | app-state', {});

  (0, _emberQunit.test)('it exists and works', function (assert) {
    var service = this.subject();

    assert.throws(function () {
      service.set('state', 'invalid');
    });
    assert.equal(service.get('state'), '', 'By default is empty string.');

    service.loading();
    assert.equal(service.get('state'), 'loading', 'Change to \'loading\'.');

    service.success();
    assert.equal(service.get('state'), 'success', 'Change to \'success\'.');

    service.error();
    assert.equal(service.get('state'), 'error', 'Change to \'error\'.');

    service.warning();
    assert.equal(service.get('state'), 'warning', 'Change to \'warning\'.');

    service.reset();
    assert.equal(service.get('state'), '', 'Reset to the default value.');
  });
});
define('dummy/tests/unit/services/detail-interaction-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:detail-interaction', 'Unit | Service | detail interaction', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('dummy/tests/unit/services/form-load-time-tracker-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:form-load-time-tracker', 'Unit | Service | form load time tracker', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('dummy/tests/unit/services/log-test', ['ember-data', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app', 'dummy/config/environment'], function (_emberData, _qunit, _startApp, _destroyApp, _environment) {
  'use strict';

  var app = void 0; //TODO Import Module. Replace Ember.Logger, Ember.testing = false;

  var adapter = void 0;
  var saveModel = void 0;

  (0, _qunit.module)('Unit | Service | log', {
    beforeEach: function beforeEach() {
      app = (0, _startApp.default)();

      adapter = Ember.Test.adapter;
      Ember.Test.adapter = null;
      Ember.testing = false;

      saveModel = _emberData.default.Model.prototype.save;
      _emberData.default.Model.prototype.save = function () {
        return Ember.RSVP.resolve(this);
      };
    },
    afterEach: function afterEach() {
      Ember.Test.adapter = adapter;
      Ember.testing = true;

      _emberData.default.Model.prototype.save = saveModel;

      (0, _destroyApp.default)(app);
    }
  });

  (0, _qunit.test)('error works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = true;
    var errorMessage = 'The system generated an error';
    var errorMachineName = location.hostname;
    var errorAppDomainName = window.navigator.userAgent;
    var errorProcessId = document.location.href;

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'ERROR');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '1');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), errorMachineName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), errorAppDomainName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), errorProcessId);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), _environment.default.modulePrefix);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), errorMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to Ember.Logger.error.
    Ember.run(function () {
      Ember.Logger.error(errorMessage);
    });
  });
  (0, _qunit.test)('logService works properly when storeErrorMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = false;
    var errorMessage = 'The system generated an error';

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to Ember.Logger.error.
    Ember.run(function () {
      Ember.Logger.error(errorMessage);
    });
  });

  (0, _qunit.test)('logService for error works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = false;
    logService.storeErrorMessages = true;
    var errorMessage = 'The system generated an error';

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      if (savedLogRecord) {
        throw new Error('Log is disabled, DB isn\'t changed');
      } else {
        assert.ok(true, 'Check log call, DB isn\'t changed');
      }

      done();
    });

    // Call to Ember.Logger.error.
    Ember.run(function () {
      Ember.Logger.error(errorMessage);
    });
  });

  (0, _qunit.test)('warn works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeWarnMessages = true;
    var warnMessage = 'The system generated an warn';
    var warnMachineName = location.hostname;
    var warnAppDomainName = window.navigator.userAgent;
    var warnProcessId = document.location.href;

    logService.on('warn', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'WARN');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '2');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), warnMachineName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), warnAppDomainName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), warnProcessId);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), _environment.default.modulePrefix);
      var savedMessageContainsWarnMessage = savedLogRecord.get('message').indexOf(warnMessage) > -1;
      assert.ok(savedMessageContainsWarnMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to warn.
    Ember.run(function () {
      (true && Ember.warn(warnMessage, false, { id: 'ember-flexberry-tests.log-test.warn-works-properly' }));
    });
  });

  (0, _qunit.test)('logService works properly when storeWarnMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeWarnMessages = false;
    var warnMessage = 'The system generated an warn';

    logService.on('warn', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to warn.
    Ember.run(function () {
      (true && Ember.warn(warnMessage, false, { id: 'ember-flexberry-tests.log-test.warn-works-properly-when-store-warn-messages-is-disabled' }));
    });
  });

  (0, _qunit.test)('logService for warn works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = false;
    logService.storeWarnMessages = true;
    var warnMessage = 'The system generated an warn';

    logService.on('warn', this, function (savedLogRecord) {
      // Check results asyncronously.
      if (savedLogRecord) {
        throw new Error('Log is disabled, DB isn\'t changed');
      } else {
        assert.ok(true, 'Check log call, DB isn\'t changed');
      }

      done();
    });

    // Call to warn.
    Ember.run(function () {
      (true && Ember.warn(warnMessage, false, { id: 'ember-flexberry-tests.log-test.warn-works-properly-when-log-service-is-disabled' }));
    });
  });

  (0, _qunit.test)('log works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeLogMessages = true;
    var logMessage = 'Logging log message';
    var logMachineName = location.hostname;
    var logAppDomainName = window.navigator.userAgent;
    var logProcessId = document.location.href;

    logService.on('log', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'LOG');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '3');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), logMachineName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), logAppDomainName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), logProcessId);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), _environment.default.modulePrefix);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), logMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to Ember.Logger.log.
    Ember.run(function () {
      Ember.Logger.log(logMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storeLogMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeLogMessages = false;
    var logMessage = 'Logging log message';

    logService.on('log', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to Ember.Logger.log.
    Ember.run(function () {
      Ember.Logger.log(logMessage);
    });
  });

  (0, _qunit.test)('logService for log works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = false;
    logService.storeLogMessages = true;
    var logMessage = 'Logging log message';

    logService.on('log', this, function (savedLogRecord) {
      // Check results asyncronously.
      if (savedLogRecord) {
        throw new Error('Log is disabled, DB isn\'t changed');
      } else {
        assert.ok(true, 'Check log call, DB isn\'t changed');
      }

      done();
    });

    // Call to Ember.Logger.log.
    Ember.run(function () {
      Ember.Logger.log(logMessage);
    });
  });

  (0, _qunit.test)('info works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeInfoMessages = true;
    var infoMessage = 'Logging info message';
    var infoMachineName = location.hostname;
    var infoAppDomainName = window.navigator.userAgent;
    var infoProcessId = document.location.href;

    logService.on('info', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'INFO');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '4');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), infoMachineName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), infoAppDomainName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), infoProcessId);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), _environment.default.modulePrefix);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), infoMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to Ember.Logger.info.
    Ember.run(function () {
      Ember.Logger.info(infoMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storeInfoMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeInfoMessages = false;
    var infoMessage = 'Logging info message';

    logService.on('info', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to Ember.Logger.info.
    Ember.run(function () {
      Ember.Logger.info(infoMessage);
    });
  });

  (0, _qunit.test)('logService for info works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = false;
    logService.storeInfoMessages = true;
    var infoMessage = 'Logging info message';

    logService.on('info', this, function (savedLogRecord) {
      // Check results asyncronously.
      if (savedLogRecord) {
        throw new Error('Log is disabled, DB isn\'t changed');
      } else {
        assert.ok(true, 'Check log call, DB isn\'t changed');
      }

      done();
    });

    // Call to Ember.Logger.info.
    Ember.run(function () {
      Ember.Logger.info(infoMessage);
    });
  });

  (0, _qunit.test)('debug works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeDebugMessages = true;
    var debugMessage = 'Logging debug message';
    var debugMachineName = location.hostname;
    var debugAppDomainName = window.navigator.userAgent;
    var debugProcessId = document.location.href;

    logService.on('debug', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'DEBUG');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '5');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), debugMachineName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), debugAppDomainName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), debugProcessId);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), _environment.default.modulePrefix);
      var savedMessageContainsDebugMessage = savedLogRecord.get('message').indexOf(debugMessage) > -1;
      assert.ok(savedMessageContainsDebugMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to debug.
    Ember.run(function () {
      Ember.debug(debugMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storeDebugMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeDebugMessages = false;
    var debugMessage = 'Logging debug message';

    logService.on('debug', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to debug.
    Ember.run(function () {
      Ember.debug(debugMessage);
    });
  });

  (0, _qunit.test)('logService for debug works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = false;
    logService.storeDebugMessages = true;
    var debugMessage = 'Logging debug message';

    logService.on('debug', this, function (savedLogRecord) {
      // Check results asyncronously.
      if (savedLogRecord) {
        throw new Error('Log is disabled, DB isn\'t changed');
      } else {
        assert.ok(true, 'Check log call, DB isn\'t changed');
      }

      done();
    });

    // Call to debug.
    Ember.run(function () {
      Ember.debug(debugMessage);
    });
  });

  (0, _qunit.test)('deprecate works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeDeprecationMessages = true;
    var deprecationMessage = 'The system generated an deprecation';
    var deprecationMachineName = location.hostname;
    var deprecationAppDomainName = window.navigator.userAgent;
    var deprecationProcessId = document.location.href;

    logService.on('deprecation', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'DEPRECATION');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '6');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), deprecationMachineName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), deprecationAppDomainName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), deprecationProcessId);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), _environment.default.modulePrefix);
      var savedMessageContainsDeprecationMessage = savedLogRecord.get('message').indexOf(deprecationMessage) > -1;
      assert.ok(savedMessageContainsDeprecationMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to deprecate.
    Ember.run(function () {
      Ember.deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
    });
  });

  (0, _qunit.test)('logService works properly when storeDeprecationMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeDeprecationMessages = false;
    var deprecationMessage = 'The system generated an deprecation';

    logService.on('deprecation', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to deprecate.
    Ember.run(function () {
      Ember.deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
    });
  });

  (0, _qunit.test)('logService for deprecate works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = false;
    logService.storeDeprecationMessages = true;
    var deprecationMessage = 'The system generated an deprecation';

    logService.on('deprecation', this, function (savedLogRecord) {
      // Check results asyncronously.
      if (savedLogRecord) {
        throw new Error('Log is disabled, DB isn\'t changed');
      } else {
        assert.ok(true, 'Check log call, DB isn\'t changed');
      }

      done();
    });

    // Call to deprecate.
    Ember.run(function () {
      Ember.deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
    });
  });

  (0, _qunit.test)('assert works properly', function (testAssert) {
    var done = testAssert.async();
    testAssert.expect(10);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = true;
    var assertMessage = 'The system generated an error';
    var assertMachineName = location.hostname;
    var assertAppDomainName = window.navigator.userAgent;
    var assertProcessId = document.location.href;

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      testAssert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'ERROR');
      testAssert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
      testAssert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '1');
      testAssert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), assertMachineName);
      testAssert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), assertAppDomainName);
      testAssert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), assertProcessId);
      testAssert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      testAssert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), _environment.default.modulePrefix);
      var savedMessageContainsAssertMessage = savedLogRecord.get('message').indexOf(assertMessage) > -1;
      testAssert.ok(savedMessageContainsAssertMessage);
      var formattedMessageContainsAssertMessage = savedLogRecord.get('formattedMessage').indexOf(assertMessage) > -1;
      testAssert.ok(formattedMessageContainsAssertMessage);

      done();
    });

    // Call to assert.
    Ember.run(function () {
      (true && !(false) && Ember.assert(assertMessage, false));
    });
  });

  (0, _qunit.test)('logService works properly when storeErrorMessages for assert disabled', function (testAssert) {
    var done = testAssert.async();
    testAssert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = false;
    var assertMessage = 'The system generated an error';

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      testAssert.notOk(savedLogRecord);

      done();
    });

    // Call to assert.
    Ember.run(function () {
      (true && !(false) && Ember.assert(assertMessage, false));
    });
  });

  (0, _qunit.test)('logService for assert works properly when it\'s disabled', function (testAssert) {
    var done = testAssert.async();
    testAssert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = false;
    logService.storeErrorMessages = true;
    var assertMessage = 'The system generated an error';

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      if (savedLogRecord) {
        throw new Error('Log is disabled, DB isn\'t changed');
      } else {
        testAssert.ok(true, 'Check log call, DB isn\'t changed');
      }

      done();
    });

    // Call to assert.
    Ember.run(function () {
      (true && !(false) && Ember.assert(assertMessage, false));
    });
  });

  (0, _qunit.test)('throwing exceptions logs properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = true;
    var errorMessage = 'The system thrown an exception';
    var errorMachineName = location.hostname;
    var errorAppDomainName = window.navigator.userAgent;
    var errorProcessId = document.location.href;

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'ERROR');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '1');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), errorMachineName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), errorAppDomainName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), errorProcessId);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), _environment.default.modulePrefix);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), errorMessage);
      var formattedMessageContainsErrorMessage = savedLogRecord.get('formattedMessage').indexOf(errorMessage) > -1;
      assert.ok(formattedMessageContainsErrorMessage);

      done();
    });

    // Throwing an exception.
    Ember.run(function () {
      throw new Error(errorMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storeErrorMessages for throw disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = false;
    var errorMessage = 'The system thrown an exception';

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Throwing an exception.
    Ember.run(function () {
      throw new Error(errorMessage);
    });
  });

  (0, _qunit.test)('logService for throw works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = false;
    logService.storeErrorMessages = true;
    var errorMessage = 'The system thrown an exception';

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      if (savedLogRecord) {
        throw new Error('Log is disabled, DB isn\'t changed');
      } else {
        assert.ok(true, 'Check log call, DB isn\'t changed');
      }

      done();
    });

    // Throwing an exception.
    Ember.run(function () {
      throw new Error(errorMessage);
    });
  });

  (0, _qunit.test)('promise errors logs properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storePromiseErrors = true;
    logService.showPromiseErrors = false;
    var promiseErrorMessage = 'Promise error';
    var promiseMachineName = location.hostname;
    var promiseAppDomainName = window.navigator.userAgent;
    var promiseProcessId = document.location.href;

    logService.on('promise', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'PROMISE');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '7');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), promiseMachineName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), promiseAppDomainName);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), promiseProcessId);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), _environment.default.modulePrefix);
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), promiseErrorMessage);

      var formattedMessageContainsPromiseErrorMessage = savedLogRecord.get('formattedMessage').indexOf(promiseErrorMessage) > -1;
      assert.ok(formattedMessageContainsPromiseErrorMessage);

      done();
    });

    // Throwing an exception.
    Ember.run(function () {
      Ember.RSVP.reject(promiseErrorMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storePromiseErrors disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storePromiseErrors = false;
    logService.showPromiseErrors = false;
    var promiseErrorMessage = 'Promise error';

    logService.on('promise', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Throwing an exception.
    Ember.run(function () {
      Ember.RSVP.reject(promiseErrorMessage);
    });
  });

  (0, _qunit.test)('logService for promise works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = false;
    logService.storePromiseErrors = true;
    var promiseErrorMessage = 'Promise error';

    logService.on('promise', this, function (savedLogRecord) {
      // Check results asyncronously.
      if (savedLogRecord) {
        throw new Error('Log is disabled, DB isn\'t changed');
      } else {
        assert.ok(true, 'Check log call, DB isn\'t changed');
      }

      done();
    });

    // Throwing an exception.
    Ember.run(function () {
      Ember.RSVP.reject(promiseErrorMessage);
    });
  });
});
define('dummy/tests/unit/services/objectlistview-events-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:objectlistview-events', 'Unit | Service | objectlistview events', {
    // Specify the other units that are required for this test.
    needs: ['service:app-state']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('dummy/tests/unit/utils/cut-string-by-length-test', ['dummy/utils/cut-string-by-length', 'qunit'], function (_cutStringByLength, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | cut string by length');

  (0, _qunit.test)('cut by length', function (assert) {
    var result = (0, _cutStringByLength.default)('test string', 6);
    assert.equal(result, 'test s...');

    result = (0, _cutStringByLength.default)('test string', 20);
    assert.equal(result, 'test string');

    result = (0, _cutStringByLength.default)('test string', 0);
    assert.equal(result, 'test string');

    result = (0, _cutStringByLength.default)('test string', 3);
    assert.equal(result, 'tes...');
  });

  (0, _qunit.test)('cut by spaces', function (assert) {
    var result = (0, _cutStringByLength.default)('test string with spaces', 6, true);
    assert.equal(result, 'test...');

    result = (0, _cutStringByLength.default)('test string with spaces', 50, true);
    assert.equal(result, 'test string with spaces');

    result = (0, _cutStringByLength.default)('test string with spaces', 0, true);
    assert.equal(result, 'test string with spaces');

    result = (0, _cutStringByLength.default)('test string with spaces', 3, true);
    assert.equal(result, 'tes...');

    result = (0, _cutStringByLength.default)('test string with spaces', 18, true);
    assert.equal(result, 'test string with...');

    result = (0, _cutStringByLength.default)('test string with spaces', 12, true);
    assert.equal(result, 'test string...');
  });
});
define('dummy/tests/unit/utils/deserialize-sorting-param-test', ['dummy/utils/deserialize-sorting-param', 'qunit'], function (_deserializeSortingParam, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | deserialize sorting param');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var stringToDeserialize = '+type.name-moderated';
    var result = (0, _deserializeSortingParam.default)(stringToDeserialize);
    assert.ok(result);
    assert.ok(Ember.isArray(result));
    assert.equal(result.length, 2);
    assert.equal(result[0].propName, 'type.name');
    assert.equal(result[0].direction, 'asc');
    assert.equal(result[1].propName, 'moderated');
    assert.equal(result[1].direction, 'desc');
  });

  (0, _qunit.test)('empty param string', function (assert) {
    var stringToDeserialize = '';
    var result = (0, _deserializeSortingParam.default)(stringToDeserialize);
    assert.ok(result);
    assert.ok(Ember.isArray(result));
    assert.equal(result.length, 0);
  });
});
define('dummy/tests/unit/utils/get-attr-locale-key-test', ['dummy/utils/get-attr-locale-key', 'qunit'], function (_getAttrLocaleKey, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | get attr locale key');

  (0, _qunit.test)('get key', function (assert) {
    var mainModelName = 'ember-flexberry-dummy-suggestion';
    var projectionName = 'SuggestionE';
    var bindingPath = 'address';
    var result = (0, _getAttrLocaleKey.default)(mainModelName, projectionName, bindingPath);
    assert.equal(result, 'models.' + mainModelName + '.projections.' + projectionName + '.' + bindingPath + '.__caption__');
  });

  (0, _qunit.test)('get key with relationship', function (assert) {
    var mainModelName = 'ember-flexberry-dummy-suggestion';
    var projectionName = 'SuggestionE';
    var bindingPath = 'address';
    var relationship = 'type';
    var result = (0, _getAttrLocaleKey.default)(mainModelName, projectionName, bindingPath, relationship);
    assert.equal(result, 'models.' + mainModelName + '.projections.' + projectionName + '.' + relationship + '.' + bindingPath + '.__caption__');
  });
});
define('dummy/tests/unit/utils/get-current-agregator-test', ['qunit', 'dummy/tests/helpers/start-app', 'dummy/utils/get-current-agregator'], function (_qunit, _startApp, _getCurrentAgregator) {
  'use strict';

  var App = void 0;

  (0, _qunit.module)('Unit | Utility | get current agregator', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)();
    },
    afterEach: function afterEach() {
      Ember.run(App, 'destroy');
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var detailInteractionService = App.__container__.lookup('service:detail-interaction');
    var agregator = void 0;
    Ember.run(function () {
      agregator = App.__container__.lookup('service:store').createRecord('ember-flexberry-dummy-localization', { name: 'Localization' });
    });

    var agregatorsArray = Ember.A();
    detailInteractionService.pushValue('modelCurrentAgregators', agregatorsArray, agregator);
    var result = _getCurrentAgregator.default.call(agregator);
    assert.ok(result);
  });
});
define('dummy/tests/unit/utils/get-projection-by-name-test', ['dummy/utils/get-projection-by-name', 'qunit'], function (_getProjectionByName, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | get projection by name');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var store = {};
    store.modelFor = function () {
      return { projections: { testProjection: { success: true } } };
    };

    var result = (0, _getProjectionByName.default)('testProjection', 'testModel', store);
    assert.ok(result && result.success);
  });
});
define('dummy/tests/unit/utils/need-save-current-agregator-test', ['qunit', 'dummy/tests/helpers/start-app', 'dummy/utils/need-save-current-agregator'], function (_qunit, _startApp, _needSaveCurrentAgregator) {
  'use strict';

  var App = void 0;

  (0, _qunit.module)('Unit | Utility | need save current agregator', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)();
      var offlineGlobals = App.__container__.lookup('service:offline-globals');
      offlineGlobals.setOnlineAvailable(false);
    },
    afterEach: function afterEach() {
      Ember.run(App, 'destroy');
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var agregator = void 0;
    Ember.run(function () {
      agregator = App.__container__.lookup('service:store').createRecord('ember-flexberry-dummy-localization', { name: 'Localization' });
    });

    var resultOk = _needSaveCurrentAgregator.default.call(agregator, agregator);
    assert.ok(resultOk);

    var resultNotOk = _needSaveCurrentAgregator.default.call(agregator);
    assert.notOk(resultNotOk);
  });
});
define('dummy/tests/unit/utils/serialize-sorting-param-test', ['dummy/utils/serialize-sorting-param', 'qunit'], function (_serializeSortingParam, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | serialize sorting param');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var sortingObject = [{ propName: 'type.name', direction: 'asc' }, { propName: 'moderated', direction: 'desc' }];

    var result = (0, _serializeSortingParam.default)(sortingObject);
    assert.ok(result);
    assert.equal(result, '+type.name-moderated');
  });

  (0, _qunit.test)('empty array', function (assert) {
    var sortingObject = [];

    var result = (0, _serializeSortingParam.default)(sortingObject, null);
    assert.equal(result, null);
  });
});
define('dummy/tests/unit/utils/string-test', ['qunit', 'ember-flexberry/utils/string'], function (_qunit, _string) {
  'use strict';

  (0, _qunit.module)('Unit | Util | render-string');

  (0, _qunit.test)('Util is function', function (assert) {
    assert.expect(1);

    assert.strictEqual(Ember.typeOf(_string.render) === 'function', true, 'Imported \'render-string\' util is function');
  });

  (0, _qunit.test)('Util returns null for calls with unexpected arguments', function (assert) {
    assert.expect(9);

    assert.strictEqual((0, _string.render)(), null, 'Returns null for calls without arguments');

    Ember.A([null, 1, true, false, {}, [], function () {}, new Date()]).forEach(function (wrongFirstArgument) {
      assert.strictEqual((0, _string.render)(wrongFirstArgument), null, 'Returns null for calls with first argument not of string type');
    });
  });

  (0, _qunit.test)('Util returns same string for calls with unexpected render arguments', function (assert) {
    assert.expect(4);

    var stringWithTemplates = 'I have {{ one }} dollar in my wallet, {{ two }} apples in my bag, and {{ three }} hours of free time';
    assert.strictEqual((0, _string.render)(stringWithTemplates), stringWithTemplates, 'Returns same string for calls without render options');

    assert.strictEqual((0, _string.render)(stringWithTemplates, { context: null }), stringWithTemplates, 'Returns same string for calls without render context');

    assert.strictEqual((0, _string.render)(stringWithTemplates, { context: { 'ONE': 1, 'TWO': 2, 'THREE': 3 } }), stringWithTemplates, 'Returns same string for calls with context without templates-related keys');

    assert.strictEqual((0, _string.render)(stringWithTemplates, { context: { 'one': 1, 'two': 2, 'three': 3 }, delimiters: ['<<', '>>'] }), stringWithTemplates, 'Returns same string for calls with unexpected delimiters');
  });

  (0, _qunit.test)('Util returns rendered string for calls with expected render arguments', function (assert) {
    assert.expect(2);

    var stringWithTemplatesAndDefaultDelimiters = 'I have {{ one }} dollar in my wallet, {{ two }} apples in my bag, and {{ three }} hours of free time';
    assert.strictEqual((0, _string.render)(stringWithTemplatesAndDefaultDelimiters, { context: { 'one': 1, 'two': 2, 'three': 3 } }), 'I have 1 dollar in my wallet, 2 apples in my bag, and 3 hours of free time', 'Returns rendered string for calls with default delimiters');

    var stringWithTemplatesAndCustomDelimiters = 'I have {% one %} dollar in my wallet, {% two %} apples in my bag, and {% three %} hours of free time';
    assert.strictEqual((0, _string.render)(stringWithTemplatesAndCustomDelimiters, { context: { 'one': 1, 'two': 2, 'three': 3 }, delimiters: ['{%', '%}'] }), 'I have 1 dollar in my wallet, 2 apples in my bag, and 3 hours of free time', 'Returns rendered string for calls with custom delimiters');
  });
});
define('dummy/config/environment', [], function() {
  var prefix = 'dummy';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
