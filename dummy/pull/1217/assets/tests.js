define('dummy/tests/acceptance/components/flexberry-dropdown/flexberry-dropdown-conditional-render-test', ['exports', 'ember', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _ember, _qunit, _dummyTestsHelpersStartApp) {

  var app = undefined;
  var path = 'components-examples/flexberry-dropdown/conditional-render-example';
  var testName = 'conditional render test';

  (0, _qunit.module)('Acceptance | flexberry-dropdown | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _dummyTestsHelpersStartApp['default'])();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach: function afterEach() {
      _ember['default'].run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {
    assert.expect(4);

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path, 'Path is correctly');

      var $dropdown = _ember['default'].$('.flexberry-dropdown');
      assert.equal($dropdown.length, 1, 'Dropdown is render');

      // Select dropdown item.
      $dropdown.dropdown('set selected', 'Enum value №1');

      var done = assert.async();
      var timeout = 100;
      _ember['default'].run.later(function () {
        var $dropdown = _ember['default'].$('.flexberry-dropdown');
        assert.equal($dropdown.length, 0, 'Dropdown isn\'t render');

        var $span = _ember['default'].$('div.field span');
        assert.equal($span.text(), 'Enum value №1', 'Span is render');
        done();
      }, timeout);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-dropdown/flexberry-dropdown-empty-value-test', ['exports', 'ember', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _ember, _qunit, _dummyTestsHelpersStartApp) {

  var app = undefined;
  var path = 'components-examples/flexberry-dropdown/empty-value-example';
  var testName = 'empty value test';

  (0, _qunit.module)('Acceptance | flexberry-dropdown | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _dummyTestsHelpersStartApp['default'])();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach: function afterEach() {
      _ember['default'].run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {
    assert.expect(3);

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path, 'Path is correctly');

      var $dropdown = _ember['default'].$('.flexberry-dropdown');
      assert.equal($dropdown.length, 1, 'Dropdown is render');
      assert.equal($dropdown[0].innerText, 'Enum value №2', 'Dropdown value is "Enum value №2"');
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-groupedit/flexberry-groupedit-check-all-at-page-test', ['exports', 'ember', 'qunit', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'dummy/tests/helpers/start-app'], function (exports, _ember, _qunit, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _dummyTestsHelpersStartApp) {

  var app = undefined;
  var path = 'components-examples/flexberry-groupedit/configurate-row-example';
  var testName = 'check all at page';
  var olvContainerClass = '.object-list-view-container';
  var trTableClass = 'table.object-list-view tbody tr';

  (0, _qunit.module)('Acceptance | flexberry-groupedit | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _dummyTestsHelpersStartApp['default'])();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach: function afterEach() {
      _ember['default'].run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {
    assert.expect(4);

    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $olv = _ember['default'].$('.object-list-view ');
      var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];

      _ember['default'].run(function () {
        var done = assert.async();
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingList)($thead, olvContainerClass, trTableClass).then(function ($list) {
          assert.ok($list);
          var $rows = _ember['default'].$('.object-list-view-helper-column', $list);

          click('.ui.check-all-at-page-button');
          andThen(function () {
            var $checkCheckBox = _ember['default'].$('.flexberry-checkbox.checked', $rows);
            assert.equal($checkCheckBox.length, $rows.length, 'All checkBox in row are select');

            click('.ui.check-all-at-page-button');
            andThen(function () {
              $checkCheckBox = _ember['default'].$('.flexberry-checkbox.checked', $rows);
              assert.equal($checkCheckBox.length, 0, 'All checkBox in row are unselect');
            });
          });

          done();
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-groupedit/flexberry-groupedit-configurate-row-test', ['exports', 'ember', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _ember, _qunit, _dummyTestsHelpersStartApp) {

  var app = undefined;
  var path = 'components-examples/flexberry-groupedit/configurate-row-example';
  var testName = 'configurate row';

  (0, _qunit.module)('Acceptance | flexberry-groupedit | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _dummyTestsHelpersStartApp['default'])();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach: function afterEach() {
      _ember['default'].run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {
    assert.expect(58);

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path, 'Path is correctly');
      var $folvRows = _ember['default'].$('.object-list-view-container tbody tr');

      for (var i = 0; i < $folvRows.length; i++) {
        var $row = $folvRows[i];
        var $deleteButton = _ember['default'].$('.object-list-view-row-delete-button', $row);
        var $flagField = _ember['default'].$('.field .flexberry-checkbox', $row);

        if (i % 2 === 0) {
          assert.equal($deleteButton.hasClass('disabled'), true, 'Delete button in an even row is disabled');
          assert.equal($flagField.hasClass('checked'), true, 'CheckBox in an even row is checked');
        } else {
          assert.equal($deleteButton.hasClass('disabled'), false, 'Delete button in a non-even row isn\'t disabled');
          assert.equal($flagField.hasClass('checked'), false, 'CheckBox in an even row isn\'t checked');
        }

        var $textField = _ember['default'].$('.field .flexberry-textbox input', $row);
        assert.equal($textField[0].value, i + 1 + 'test', 'TextBox have currect text');
      }
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-groupedit/flexberry-groupedit-user-button-test', ['exports', 'ember', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _ember, _qunit, _dummyTestsHelpersStartApp) {

  var app = undefined;
  var testName = 'user button test';

  (0, _qunit.module)('Acceptance | flexberry-groupedit | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _dummyTestsHelpersStartApp['default'])();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach: function afterEach() {
      _ember['default'].run(app, 'destroy');
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
define('dummy/tests/acceptance/components/flexberry-lookup/change-component-lookup-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest) {

  var openLookupDialog = function openLookupDialog($lookup) {
    return new _ember['default'].RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = undefined;
      var checkIntervalSucceed = false;
      var checkInterval = 500;

      var timeout = 4000;

      var $lookupChooseButton = _ember['default'].$('.ui-change', $lookup);

      // Try to open lookup dialog.
      _ember['default'].run(function () {
        $lookupChooseButton.click();
      });

      // Wait for lookup dialog to be opened & data loaded.
      _ember['default'].run(function () {
        checkIntervalId = window.setInterval(function () {
          var $lookupDialog = _ember['default'].$('.flexberry-modal');
          var $records = _ember['default'].$('.content table.object-list-view tbody tr', $lookupDialog);
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
      _ember['default'].run(function () {
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
    return new _ember['default'].RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = undefined;
      var checkIntervalSucceed = false;
      var checkInterval = 500;

      var timeout = 4000;

      var $records = _ember['default'].$('.content table.object-list-view tbody tr', $lookupDialog);
      var $choosedRecord = _ember['default'].$($records[recordIndex]);

      // Try to choose record in the lookup dialog.
      _ember['default'].run(function () {
        // Inside object-list-views component click actions are available only if cell in row has been clicked.
        // Click on whole row wont take an effect.
        var $choosedRecordFirstCell = _ember['default'].$(_ember['default'].$('td', $choosedRecord)[1]);
        $choosedRecordFirstCell.click();

        // Click on modal-dialog close icon.
        // Сrutch correcting irregular bug
        var $modelDilogClose = _ember['default'].$('.close.icon');
        $modelDilogClose.click();
      });

      // Wait for lookup dialog to be closed.
      _ember['default'].run(function () {
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
      _ember['default'].run(function () {
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

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('changes in component\'s value causes changes in related model\'s specified \'belongsTo\' relation', function (store, assert, app, latestReceivedRecords) {
    assert.expect(4);
    visit('components-acceptance-tests/flexberry-lookup/base-operations');

    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var model = _ember['default'].get(controller, 'model');
      var relationName = _ember['default'].get(controller, 'relationName');
      var displayAttributeName = _ember['default'].get(controller, 'displayAttributeName');

      var $lookup = _ember['default'].$('.flexberry-lookup');
      var $lookupInput = _ember['default'].$('input', $lookup);
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
      })['catch'](function (reason) {
        throw new Error(reason);
      })['finally'](function () {
        asyncOperationsCompleted();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/change-model-lookup-test', ['exports', 'ember', 'ember-flexberry-data', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (exports, _ember, _emberFlexberryData, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('changes in model\'s value causes changes in component\'s specified \'belongsTo\' model', function (store, assert, app) {
    assert.expect(2);
    visit('components-acceptance-tests/flexberry-lookup/base-operations');
    andThen(function () {

      var $lookup = _ember['default'].$('.flexberry-lookup');
      var $lookupInput = _ember['default'].$('input', $lookup);
      assert.strictEqual($lookupInput.val() === '', true, 'lookup display value is empty by default');

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var model = _ember['default'].get(controller, 'model');
      var store = app.__container__.lookup('service:store');
      var suggestionType = undefined;

      // Create limit for query.
      var query = new _emberFlexberryData.Query.Builder(store).from('ember-flexberry-dummy-suggestion-type').selectByProjection('SettingLookupExampleView');

      // Load olv data.
      store.query('ember-flexberry-dummy-suggestion-type', query.build()).then(function (suggestionTypes) {

        var suggestionTypesArr = suggestionTypes.toArray();

        suggestionType = suggestionTypesArr.objectAt(0);
      }).then(function () {

        // Change data in the model.
        model.set('type', suggestionType);

        var done = assert.async();

        setTimeout(function () {
          $lookupInput = _ember['default'].$('input', $lookup);
          assert.strictEqual($lookupInput.val() === suggestionType.get('name'), true, 'lookup display value isn\'t empty');
          done();
        }, 100);
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', ['exports', 'ember', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _ember, _qunit, _dummyTestsHelpersStartApp) {
  exports.executeTest = executeTest;

  function executeTest(testName, callback) {
    var app = undefined;
    var store = undefined;
    var latestReceivedRecords = _ember['default'].A();

    (0, _qunit.module)('Acceptance | flexberry-lookup-base |' + testName, {
      beforeEach: function beforeEach() {

        // Start application.
        app = (0, _dummyTestsHelpersStartApp['default'])();

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
        _ember['default'].$('body .ui.dimmer.modals').remove();

        // Destroy application.
        _ember['default'].run(app, 'destroy');
      }
    });

    (0, _qunit.test)(testName, function (assert) {
      return callback(store, assert, app, latestReceivedRecords);
    });
  }
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-actions-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup actions test', function (store, assert, app) {
    assert.expect(5);

    var controller = app.__container__.lookup('controller:components-acceptance-tests/flexberry-lookup/settings-example-actions');

    // Remap remove action.
    var $onRemoveData = undefined;
    _ember['default'].set(controller, 'actions.externalRemoveAction', function (actual) {
      $onRemoveData = actual;
      assert.notEqual($onRemoveData, undefined, 'Component sends \'remove\' action after first click');
      assert.strictEqual($onRemoveData.relationName, 'type', 'Component sends \'remove\' with actual relationName');
    });

    // Remap chose action.
    var $onChooseData = undefined;
    _ember['default'].set(controller, 'actions.externalChooseAction', function (actual) {
      $onChooseData = actual;
      assert.notEqual($onChooseData, undefined, 'Component sends \'choose\' action after first click');
      assert.strictEqual($onChooseData.componentName, 'flexberry-lookup', 'Component sends \'choose\' with actual componentName');
      assert.strictEqual($onChooseData.projection, 'SettingLookupExampleView', 'Component sends \'choose\' with actual projection');
    });

    visit('components-acceptance-tests/flexberry-lookup/settings-example-actions');
    andThen(function () {
      var $lookupButtouChoose = _ember['default'].$('.ui-change');
      var $lookupButtouRemove = _ember['default'].$('.ui-clear');

      _ember['default'].run(function () {
        $lookupButtouChoose.click();
        $lookupButtouRemove.click();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-autocomplete-en-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', 'dummy/tests/acceptance/components/flexberry-lookup/lookup-test-functions'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest, _dummyTestsAcceptanceComponentsFlexberryLookupLookupTestFunctions) {

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup autocomplete message en', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      (0, _dummyTestsAcceptanceComponentsFlexberryLookupLookupTestFunctions.loadingLocales)('en', app).then(function () {
        var textbox = _ember['default'].$('.ember-text-field');
        fillIn(textbox, 'gfhfkjglkhlh');
      });

      var asyncOperationsCompleted = assert.async();
      _ember['default'].run.later(function () {
        asyncOperationsCompleted();

        var $message = _ember['default'].$('.message');
        assert.strictEqual($message.hasClass('empty'), true, 'Component\'s wrapper has message');

        var $messageHeader = $message.children('.header');
        assert.equal($messageHeader.text(), 'No results', 'Message\'s header is properly');

        var $messageDescription = $message.children('.description');
        assert.equal($messageDescription.text(), 'No results found', 'Message\'s description is properly');
      }, 5000);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-autocomplete-ru-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', 'dummy/tests/acceptance/components/flexberry-lookup/lookup-test-functions'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest, _dummyTestsAcceptanceComponentsFlexberryLookupLookupTestFunctions) {

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup autocomplete message ru', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      (0, _dummyTestsAcceptanceComponentsFlexberryLookupLookupTestFunctions.loadingLocales)('ru', app).then(function () {
        var textbox = _ember['default'].$('.ember-text-field');
        fillIn(textbox, 'gfhfkjglkhlh');
      });

      var asyncOperationsCompleted = assert.async();
      _ember['default'].run.later(function () {
        asyncOperationsCompleted();

        var $message = _ember['default'].$('.message');
        assert.strictEqual($message.hasClass('empty'), true, 'Component\'s wrapper has message');

        var $messageHeader = $message.children('.header');
        assert.equal($messageHeader.text(), 'Нет данных', 'Message\'s header is properly');

        var $messageDescription = $message.children('.description');
        assert.equal($messageDescription.text(), 'Значения не найдены', 'Message\'s description is properly');
      }, 5000);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-autofill-by-limit-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup autofillByLimit in readonly test', function (store, assert, app) {
    assert.expect(1);
    visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
    andThen(function () {
      var $lookupField = _ember['default'].$('.isreadonly .lookup-field');
      var value = $lookupField.val();
      assert.ok(_ember['default'].isBlank(value), 'Value was changed');
    });
  });

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup autofillByLimit is clean test', function (store, assert, app) {
    assert.expect(2);
    visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
    andThen(function () {
      var $lookupField = _ember['default'].$('.isclean .lookup-field');
      var value = $lookupField.val();
      assert.notOk(_ember['default'].isBlank(value), 'Value wasn\'t changed');

      _ember['default'].run(function () {
        click('.isclean .ui-clear');
        andThen(function () {
          var $lookupFieldUpdate = _ember['default'].$('.isclean .lookup-field');
          var valueUpdate = $lookupFieldUpdate.val();
          assert.ok(_ember['default'].isBlank(valueUpdate), 'Value isn\'t empty');
        });
      });
    });
  });

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup autofillByLimit changes select value test', function (store, assert, app) {
    assert.expect(1);
    visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var defaultValue = _ember['default'].get(controller, 'defaultValue.name');

      var $lookupField = _ember['default'].$('.exist .lookup-field');
      var value = $lookupField.val();

      assert.notEqual(defaultValue, value, 'DefaultValue: \'' + defaultValue + '\' didn\'t change');
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-limit-function-test', ['exports', 'ember', 'ember-flexberry-data', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (exports, _ember, _emberFlexberryData, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest) {
  var StringPredicate = _emberFlexberryData.Query.StringPredicate;

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup limit function test', function (store, assert, app) {
    visit('components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

    andThen(function () {
      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

      var $limitFunctionButton = _ember['default'].$('.limitFunction');
      var $lookupChouseButton = _ember['default'].$('.ui-change');

      _ember['default'].run(function () {
        $limitFunctionButton.click();
        $lookupChouseButton.click();
      });

      var store = app.__container__.lookup('service:store');
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var limitType = controller.limitType;
      var queryPredicate = new StringPredicate('name').contains(limitType);

      // Create limit for query.
      var query = new _emberFlexberryData.Query.Builder(store).from('ember-flexberry-dummy-suggestion-type').selectByProjection('SettingLookupExampleView').where(queryPredicate);

      // Load olv data.
      store.query('ember-flexberry-dummy-suggestion-type', query.build()).then(function (suggestionTypes) {

        var suggestionTypesArr = suggestionTypes.toArray();
        var suggestionModelLength = suggestionTypesArr.length;

        var done = assert.async();

        _ember['default'].run(function () {
          setTimeout(function () {
            var $lookupSearch = _ember['default'].$('.content table.object-list-view');
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

              var $cell = $($lookupRows[3 * i + 1]);
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
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-preview-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup preview in modal test', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var testName = controller.testName;
      var $inModal = _ember['default'].$('.in-modal');

      click('.ui-preview', $inModal).then(function () {
        var $modal = _ember['default'].$('.modal');
        var $form = _ember['default'].$('.form', $modal);
        var $field = _ember['default'].$('.flexberry-field .flexberry-textbox', $form);
        var value = $field.children('input').val();
        assert.equal(value, testName);
      });
    });
  });

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup preview in separate route test', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var testName = controller.testName;
      var $inSeparateRoute = _ember['default'].$('.in-separate-route');

      click('.ui-preview', $inSeparateRoute).then(function () {
        var $form = _ember['default'].$('.form');
        var $field = _ember['default'].$('.flexberry-field .flexberry-textbox', $form);
        var value = $field.children('input').val();
        assert.equal(value, testName);
      });
    });
  });

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup preview in groupedit test', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var testName = controller.testName;
      var $inGroupedit = _ember['default'].$('.in-groupedit');

      click('.ui-preview', $inGroupedit).then(function () {
        var $form = _ember['default'].$('.form');
        var $field = _ember['default'].$('.flexberry-field .flexberry-textbox', $form);
        var value = $field.children('input').val();
        assert.equal(value, testName);
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-projection-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup projection test', function (store, assert, app) {
    assert.expect(2);

    visit('components-acceptance-tests/flexberry-lookup/settings-example-projection');

    andThen(function () {
      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-projection');

      var $lookupButtouChoose = _ember['default'].$('.ui-change');

      // Click choose button.
      _ember['default'].run(function () {
        $lookupButtouChoose.click();
      });

      _ember['default'].run(function () {
        var done = assert.async();
        setTimeout(function () {

          var $lookupSearch = _ember['default'].$('.content table.object-list-view');
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
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-relation-name-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('flexberry-lookup relation name test', function (store, assert, app) {
    assert.expect(1);
    visit('components-acceptance-tests/flexberry-lookup/settings-example-relation-name');
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var relationName = _ember['default'].get(controller, 'relationName');
      assert.strictEqual(relationName, 'Temp relation name', 'relationName: \'' + relationName + '\' as expected');
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/lookup-test-functions', ['exports', 'ember'], function (exports, _ember) {
  exports.loadingList = loadingList;
  exports.loadingLocales = loadingLocales;

  // Function for waiting list loading.

  function loadingList($ctrlForClick, list, records) {
    return new _ember['default'].RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = undefined;
      var checkIntervalSucceed = false;
      var checkInterval = 500;
      var timeout = 10000;

      _ember['default'].run(function () {
        $ctrlForClick.click();
      });

      _ember['default'].run(function () {
        checkIntervalId = window.setInterval(function () {
          var $list = _ember['default'].$(list);
          var $records = _ember['default'].$(records, $list);
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
      _ember['default'].run(function () {
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
    return new _ember['default'].RSVP.Promise(function (resolve) {
      var i18n = app.__container__.lookup('service:i18n');

      _ember['default'].run(function () {
        i18n.set('locale', locale);
      });

      var timeout = 500;
      _ember['default'].run.later(function () {
        resolve({ msg: 'ok' });
      }, timeout);
    });
  }
});
define('dummy/tests/acceptance/components/flexberry-lookup/visiting-flexberry-lookup-autocomplete-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('visiting flexberry-lookup autocomplete', function (store, assert, app) {
    assert.expect(5);

    visit('components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

    andThen(function () {

      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

      var $lookup = _ember['default'].$('.flexberry-lookup');

      assert.strictEqual($lookup.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
      assert.strictEqual($lookup.hasClass('search'), true, 'Component\'s wrapper has \'search\' css-class');

      var $lookupField = _ember['default'].$('.lookup-field');

      assert.strictEqual($lookupField.hasClass('prompt'), true, 'Component\'s wrapper has \'prompt\' css-class');

      var $result = _ember['default'].$('.result');

      assert.strictEqual($result.length === 1, true, 'Component has inner class \'result\'');
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/visiting-flexberry-lookup-dropdown-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryLookupExecuteFlexberryLookupTest.executeTest)('visiting flexberry-lookup dropdown', function (store, assert, app) {
    assert.expect(13);

    visit('components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

    andThen(function () {

      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

      // Retrieve component, it's inner <input>.
      var $lookupSearch = _ember['default'].$('.lookup-field');
      var $lookupButtonChoose = _ember['default'].$('.ui-change');
      var $lookupButtonClear = _ember['default'].$('.lookup-remove-button');

      assert.strictEqual($lookupSearch.length === 0, true, 'Component has n\'t flexberry-lookup');
      assert.strictEqual($lookupButtonChoose.length === 0, true, 'Component has n\'t button choose');
      assert.strictEqual($lookupButtonClear.length === 0, true, 'Component has n\'t button remove');

      // Retrieve component, it's inner <input>.
      var $dropdown = _ember['default'].$('.flexberry-dropdown.search.selection');
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/checkbox-at-editform-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check checkbox at editform', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox';
    visit(path);
    andThen(function () {

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $folvContainer = _ember['default'].$('.object-list-view-container');
      var $trTableBody = _ember['default'].$('table.object-list-view tbody tr', $folvContainer);
      var $cell = $trTableBody[0].children[1];

      $cell.click();

      var timeout = 500;
      _ember['default'].run.later(function () {
        controller.set('rowClickable', true);
        _ember['default'].run.later(function () {
          var asyncOperationsCompleted = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingList)($cell, 'form.flexberry-vertical-form', '.field').then(function ($editForm) {
            var checkbox = _ember['default'].$('.flexberry-checkbox');

            assert.ok($editForm, 'edit form open');
            assert.equal(checkbox.hasClass('checked'), true, 'checkbox is check');
          })['catch'](function (reason) {
            throw new Error(reason);
          })['finally'](function () {
            asyncOperationsCompleted();
          });
        }, timeout);
      }, timeout);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', ['exports', 'ember', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _ember, _qunit, _dummyTestsHelpersStartApp) {
  exports.executeTest = executeTest;
  exports.addDataForDestroy = addDataForDestroy;

  var dataForDestroy = _ember['default'].A();
  var app = undefined;

  function executeTest(testName, callback) {
    var store = undefined;
    var userSettingsService = undefined;

    (0, _qunit.module)('Acceptance | flexberry-objectlistview | ' + testName, {
      beforeEach: function beforeEach() {

        // Start application.
        app = (0, _dummyTestsHelpersStartApp['default'])();

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

      afterEach: function afterEach(assert) {
        _ember['default'].run(function () {
          if (dataForDestroy.length !== 0) {
            recursionDelete(0);
          } else {
            _ember['default'].run(app, 'destroy');
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
    if (_ember['default'].isArray(data)) {
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
      _ember['default'].run(app, 'destroy');
    }
  }
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-empty-filter-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check empty filter', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/custom-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'empty';
    var filtreInsertParametr = '';
    var user = undefined;
    var type = undefined;
    var suggestion = undefined;
    _ember['default'].run(function () {
      var newRecords = _ember['default'].A();
      user = newRecords.pushObject(store.createRecord('ember-flexberry-dummy-application-user', { name: 'Random name fot empty filther test',
        eMail: 'Random eMail fot empty filther test' }));
      type = newRecords.pushObject(store.createRecord('ember-flexberry-dummy-suggestion-type', { name: 'Random name fot empty filther test' }));

      type.save().then(function () {
        user.save().then(function () {
          _ember['default'].run(function () {
            suggestion = newRecords.pushObject(store.createRecord(modelName, { type: type, author: user, editor1: user }));
            suggestion.save();
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(suggestion);
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(type);
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(user);
          });
        });
      });

      visit(path + '?perPage=500');
      andThen(function () {
        assert.equal(currentPath(), path);
        var $filterButtonDiv = _ember['default'].$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = _ember['default'].$('.object-list-view');

        // Activate filtre row.
        $filterButton.click();

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = _ember['default'].$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var filtherResult = controller.model.content;
            var successful = true;
            for (var i = 0; i < filtherResult.length; i++) {
              var address = filtherResult[i]._data.address;
              if (!_ember['default'].isNone(address)) {
                successful = false;
              }
            }

            assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
            assert.equal(successful, true, 'Filter not successfully worked');
          })['finally'](function () {
            newRecords[2].destroyRecord().then(function () {
              _ember['default'].run(function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-filter-by-enther-click-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryData) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check filter by enter click', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'eq';
    var filtreInsertParametr = undefined;

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', _emberFlexberryData.Query.FilterOperator.Neq, '').top(1);
      store.query(modelName, builder.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('address');
        if (!filtreInsertParametr) {
          assert.ok(false, 'Empty data');
        }
      }).then(function () {
        var $filterButtonDiv = _ember['default'].$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = _ember['default'].$('.object-list-view');

        // Activate filtre row.
        $filterButton.click();

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter by enter click function.
          var refreshFunction = function refreshFunction() {
            var input = _ember['default'].$('.ember-text-field')[0];
            input.focus();
            keyEvent(input, 'keydown', 13);
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-filter-render-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check filter renders', function (store, assert, app) {
    assert.expect(34);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';

    _ember['default'].run(function () {
      visit(path);
      andThen(function () {
        assert.equal(currentPath(), path);

        var $filterButtonDiv = _ember['default'].$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $filterRemoveButton = $filterButtonDiv.children('.removeFilter-button');
        var $filterButtonIcon = $filterButton.children('i');

        var $table = _ember['default'].$('.object-list-view');
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

        var $objectListView = _ember['default'].$('.object-list-view');

        // Activate filtre row.
        $filterButton.click();

        $tableRows = $tableTbody.children('tr');

        // Check filtre row afther filter active.
        assert.strictEqual($tableRows.length === 7, true, 'Filtre row aren\'t active');

        var filtreInsertOperation = 'ge';
        var filtreInsertParametr = 'A value that will never be told';

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = _ember['default'].$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            $filterButtonDiv = _ember['default'].$('.buttons.filter-active');
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
            $filterButton.click();

            // Apply filter.
            var done2 = assert.async();
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-filter-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryData) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check filter', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperationArr = ['eq', undefined, 'eq', 'eq', 'eq', 'eq'];
    var filtreInsertValueArr = undefined;

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', _emberFlexberryData.Query.FilterOperator.Neq, '').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertValueArr = [arr.objectAt(0).get('address'), undefined, arr.objectAt(0).get('votes'), arr.objectAt(0).get('moderated'), arr.objectAt(0).get('type.name'), arr.objectAt(0).get('author.name')];
      }).then(function () {
        var $filterButtonDiv = _ember['default'].$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = _ember['default'].$('.object-list-view');

        // Activate filtre row.
        $filterButton.click();

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.filterObjectListView)($objectListView, filtreInsertOperationArr, filtreInsertValueArr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = _ember['default'].$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
            var filtherResult = controller.model.content;
            assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
            done1();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-ge-filter-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryData) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check ge filter', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'ge';
    var filtreInsertParametr = undefined;

    visit(path + '?perPage=500');
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionL').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('votes') - 1;
      }).then(function () {
        var $filterButtonDiv = _ember['default'].$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = _ember['default'].$('.object-list-view');

        // Activate filtre row.
        $filterButton.click();

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.filterCollumn)($objectListView, 2, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = _ember['default'].$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-le-filter-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryData) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check le filter', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'le';
    var filtreInsertParametr = undefined;

    visit(path + '?perPage=500');
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionL').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('votes') + 1;
      }).then(function () {
        var $filterButtonDiv = _ember['default'].$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = _ember['default'].$('.object-list-view');

        // Activate filtre row.
        $filterButton.click();

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.filterCollumn)($objectListView, 2, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = _ember['default'].$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-like-filter-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryData) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check like filter', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'like';
    var filtreInsertParametr = undefined;

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', _emberFlexberryData.Query.FilterOperator.Neq, '').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('address');
        filtreInsertParametr = filtreInsertParametr.slice(1, filtreInsertParametr.length);
        if (!filtreInsertParametr) {
          assert.ok(false, 'Empty data');
        }
      }).then(function () {
        var $filterButtonDiv = _ember['default'].$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = _ember['default'].$('.object-list-view');

        // Activate filtre row.
        $filterButton.click();

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = _ember['default'].$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-neq-filter-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryData) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check neq filter', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = 'neq';
    var filtreInsertParametr = undefined;

    visit(path + '?perPage=500');
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', _emberFlexberryData.Query.FilterOperator.Neq, '').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('address');
        if (!filtreInsertParametr) {
          assert.ok(false, 'Empty data');
        }
      }).then(function () {
        var $filterButtonDiv = _ember['default'].$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = _ember['default'].$('.object-list-view');

        // Activate filtre row.
        $filterButton.click();

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = _ember['default'].$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-without-operation-filter-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryData) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check without operation filter', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var filtreInsertOperation = '';
    var filtreInsertParametr = undefined;

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder2 = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', _emberFlexberryData.Query.FilterOperator.Neq, '').top(1);
      store.query(modelName, builder2.build()).then(function (result) {
        var arr = result.toArray();
        filtreInsertParametr = arr.objectAt(0).get('address');
        filtreInsertParametr = filtreInsertParametr.slice(1, filtreInsertParametr.length);
        if (!filtreInsertParametr) {
          assert.ok(false, 'Empty data');
        }
      }).then(function () {
        var $filterButtonDiv = _ember['default'].$('.buttons.filter-active');
        var $filterButton = $filterButtonDiv.children('button');
        var $objectListView = _ember['default'].$('.object-list-view');

        // Activate filtre row.
        $filterButton.click();

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.filterCollumn)($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = _ember['default'].$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-check-all-at-all-page-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions) {

  var olvContainerClass = '.object-list-view-container';
  var trTableClass = 'table.object-list-view tbody tr';

  // Need to add sort by multiple columns.
  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check select all at all page', function (store, assert, app) {
    assert.expect(10);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var projectionName = _ember['default'].get(controller, 'modelProjection');

      var orderByClause = null;

      var $olv = _ember['default'].$('.object-list-view ');
      var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];

      var currentSorting = controller.get('computedSorting');
      if (!$.isEmptyObject(currentSorting)) {
        orderByClause = (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.getOrderByClause)(currentSorting);
      }

      _ember['default'].run(function () {
        var done = assert.async();

        // Check sortihg in the first column. Sorting is not append.
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('ru', app).then(function () {
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.checkSortingList)(store, projectionName, $olv, orderByClause).then(function (isTrue) {
            assert.ok(isTrue, 'sorting is not applied');

            // Check sortihg icon in the first column. Sorting icon is not added.
            assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');
            var done1 = assert.async();
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingList)($thead, olvContainerClass, trTableClass).then(function ($list) {

              assert.ok($list);

              var $checkAllButton = _ember['default'].$('.check-all-button');
              $checkAllButton.click();
              var $checkAllAtPageButton = _ember['default'].$('.check-all-at-page-button');
              var $checkCheckBox = _ember['default'].$('.flexberry-checkbox.checked.read-only');
              var $deleteButton = _ember['default'].$('.delete-button');

              // Check afther select all.
              assert.equal($checkAllAtPageButton.hasClass('disabled'), true, 'select all at page aren\'t available');
              assert.equal($checkCheckBox.length, 5, 'all checkBox in row are select and readOnly');
              assert.equal($deleteButton.hasClass('disabled'), false, 'delete are available');

              $checkAllButton.click();
              $checkAllAtPageButton = _ember['default'].$('.check-all-at-page-button');
              $checkCheckBox = _ember['default'].$('.flexberry-checkbox.checked.read-only');
              $deleteButton = _ember['default'].$('.delete-button');

              // Check afther unselect all.
              assert.equal($checkAllAtPageButton.hasClass('disabled'), false, 'select all at page are available');
              assert.equal($checkCheckBox.length, 0, 'all checkBox in row are select and readOnly');
              assert.equal($deleteButton.hasClass('disabled'), true, 'delete aren\'t available');

              done1();
            });
            done();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-check-all-at-page-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions) {

  var olvContainerClass = '.object-list-view-container';
  var trTableClass = 'table.object-list-view tbody tr';

  // Need to add sort by multiple columns.
  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check select all at page', function (store, assert, app) {
    assert.expect(8);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var projectionName = _ember['default'].get(controller, 'modelProjection');

      var orderByClause = null;

      var $olv = _ember['default'].$('.object-list-view ');
      var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];

      var currentSorting = controller.get('computedSorting');
      if (!$.isEmptyObject(currentSorting)) {
        orderByClause = (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.getOrderByClause)(currentSorting);
      }

      _ember['default'].run(function () {
        var done = assert.async();

        // Check sortihg in the first column. Sorting is not append.
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('ru', app).then(function () {
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.checkSortingList)(store, projectionName, $olv, orderByClause).then(function (isTrue) {
            assert.ok(isTrue, 'sorting is not applied');

            // Check sortihg icon in the first column. Sorting icon is not added.
            assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');
            var done1 = assert.async();
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingList)($thead, olvContainerClass, trTableClass).then(function ($list) {

              assert.ok($list);

              var $checkAllAtPageButton = _ember['default'].$('.check-all-at-page-button');
              $checkAllAtPageButton.click();
              var $deleteButton = _ember['default'].$('.delete-button');
              var $checkCheckBox = _ember['default'].$('.flexberry-checkbox.checked');

              // Check afther select all at page.
              assert.equal($checkCheckBox.length, 5, 'all checkBox in row are select');
              assert.equal($deleteButton.hasClass('disabled'), false, 'delete are available');

              $checkAllAtPageButton.click();
              $checkCheckBox = _ember['default'].$('.flexberry-checkbox.checked');
              $deleteButton = _ember['default'].$('.delete-button');

              // Check afther unselect all at page.
              assert.equal($checkCheckBox.length, 0, 'all checkBox in row are unselect');
              assert.equal($deleteButton.hasClass('disabled'), true, 'delete aren\'t available');

              done1();
            });
            done();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-check-config-test', ['exports', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check folv config', function (store, assert, app) {
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {
      var config = ['createNewButton', 'deleteButton', 'refreshButton', 'showCheckBoxInRow', 'showDeleteMenuItemInRow'];
      checkOlvConfig('[data-test-olv]', null, assert, config);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-checked-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('test checking', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var $folvContainer = _ember['default'].$('.object-list-view-container');
      var $row = _ember['default'].$('table.object-list-view tbody tr', $folvContainer).first();

      // Мark first record.
      var $firstCell = _ember['default'].$('.object-list-view-helper-column-cell', $row);
      var $checkboxInRow = _ember['default'].$('.flexberry-checkbox', $firstCell);

      $checkboxInRow.click();
      andThen(function () {
        var recordIsChecked = $checkboxInRow[0].className.indexOf('checked') >= 0;
        assert.ok(recordIsChecked, 'First row is checked');
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-close-from-edit-form-test', ['exports', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check close button from edit form', function (store, assert, app) {
    assert.expect(1);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    visit(path);
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);

      checkCloseEditForm('[data-test-olv]', null, assert, path);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-column-config-save-button-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check column config save button test', function (store, assert, app) {
    assert.expect(3);
    var path = 'ember-flexberry-dummy-suggestion-list';
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $configButton = _ember['default'].$('button.config-button');
      click($configButton);

      andThen(function () {
        var $field = _ember['default'].$('div.ui.action.input');
        var $fieldInput = $field.children('input');

        assert.equal($field.children('.cols-config-save.disabled').length === 1, true, 'button disabled');
        fillIn($fieldInput, 'aaayyyeee leemaauuuu');
      });

      andThen(function () {
        var $field = _ember['default'].$('div.ui.action.input');
        assert.equal($field.children('.cols-config-save.disabled').length === 0, true, 'button active');
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-configurate-row-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check configurate row test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/configurate-rows';

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $folvContainer = _ember['default'].$('.object-list-view-container');

      // Get all positive row.
      var $positivRow = _ember['default'].$('.positive', $folvContainer);
      assert.equal($positivRow.length, 2, 'One positive row at component');

      // Check positive row at folv.
      var $folvRow = $positivRow[0];
      var $cell = _ember['default'].$('.oveflow-text', $folvRow);
      assert.equal($cell[0].innerText, controller.configurateRowByAddress, '');

      // Check positive row at GroupEdit.
      var $geRow = $positivRow[1];
      $cell = _ember['default'].$('.oveflow-text', $geRow);
      assert.equal($cell[0].innerText, controller.configurateRowByAddress, '');

      // Get all negative row.
      var $negativRow = _ember['default'].$('.negative', $folvContainer);
      assert.equal($negativRow.length, 8, 'Four negative row at component');
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-date-format-moment-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryLocalesRuTranslations) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('date format moment L', function (store, assert, app) {
    assert.expect(5);
    var done = assert.async();
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('ru', app).then(function () {

        var olvContainerClass = '.object-list-view-container';

        var $toolBar = _ember['default'].$('.ui.secondary.menu')[0];
        var $toolBarButtons = $toolBar.children;
        var $refreshButton = $toolBarButtons[0];
        assert.equal($refreshButton.innerText.trim(), _ember['default'].get(_emberFlexberryLocalesRuTranslations['default'], 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');

        var controller = app.__container__.lookup('controller:' + currentRouteName());
        var refreshFunction = function refreshFunction() {
          var refreshButton = _ember['default'].$('.refresh-button')[0];
          refreshButton.click();
        };

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
          var moment = app.__container__.lookup('service:moment');
          var momentValue = _ember['default'].get(moment, 'defaultFormat');

          assert.equal(momentValue, 'L', 'moment value is \'L\' ');

          var $folvContainer = _ember['default'].$(olvContainerClass);
          var $table = _ember['default'].$('table.object-list-view', $folvContainer);
          var $headRow = _ember['default'].$('thead tr', $table)[0].children;

          var indexDate = function indexDate() {
            var toReturn = undefined;
            Object.keys($headRow).forEach(function (element, index, array) {
              if (_ember['default'].$.trim($headRow[element].innerText) === 'Date') {
                toReturn = index;
                return false;
              }
            });

            return toReturn;
          };

          var $dateCell = function $dateCell() {
            return _ember['default'].$.trim(_ember['default'].$('tbody tr', $table)[0].children[indexDate()].innerText);
          };

          // Date format most be DD.MM.YYYY
          var dateFormatRuRe = /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d/;
          var findDateRu = dateFormatRuRe.exec($dateCell());

          assert.ok(findDateRu, 'date format is \'DD.MM.YYYY\' ');

          var done2 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('en', app).then(function () {

            var done1 = assert.async();
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              // Date format most be MM/DD/YYYY:
              var dateFormatEnRe = /(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/;
              var dataCellStr = $dateCell();

              var findDateEn = dateFormatEnRe.exec(dataCellStr);

              assert.ok(findDateEn, 'date format is \'MM/DD/YYYY\' ');
            })['catch'](function (reason) {
              throw new Error(reason);
            })['finally'](function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-data-cancel-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _emberFlexberryDataUtilsGenerateUniqueId, _emberFlexberryData) {
  var Builder = _emberFlexberryData.Query.Builder;

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check delete before record data cancel test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-cancel';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _emberFlexberryDataUtilsGenerateUniqueId['default'])();

    // Add records for deliting.
    _ember['default'].run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(newRecord);
        var builder = new Builder(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = _ember['default'].$(olvContainerClass);
            var $rows = function $rows() {
              return _ember['default'].$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            $rows().forEach(function (element, i, arr) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = _ember['default'].$('.object-list-view-row-delete-button', element);
                $deleteBtnInRow.click();
              }
            });

            // Check that the records wasn't remove in beforeDeleteRecord.
            var controller = app.__container__.lookup('controller:' + currentRouteName());
            assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

            // Check that the records have been removed.
            var recordsIsDeleteBtnInRow = $rows().every(function (element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              return nameRecord.indexOf(uuid) < 0;
            });

            assert.notOk(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

            // Check that the records have been removed into store.
            var builder2 = new Builder(store, modelName).where('name', _emberFlexberryData.Query.FilterOperator.Eq, uuid).count();
            var timeout = 500;
            _ember['default'].run.later(function () {
              var done2 = assert.async();
              store.query(modelName, builder2.build()).then(function (result) {
                assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
                done2();
              })['finally'](function () {
                newRecord.destroyRecord();
              });
            }, timeout);
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-data-immediately-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _emberFlexberryDataUtilsGenerateUniqueId, _emberFlexberryData) {
  var Builder = _emberFlexberryData.Query.Builder;

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check delete before record data immediately test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-immediately';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _emberFlexberryDataUtilsGenerateUniqueId['default'])();

    // Add records for deliting.
    _ember['default'].run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(newRecord);
        var builder = new Builder(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = _ember['default'].$(olvContainerClass);
            var $rows = function $rows() {
              return _ember['default'].$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            $rows().forEach(function (element, i, arr) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = _ember['default'].$('.object-list-view-row-delete-button', element);
                $deleteBtnInRow.click();
              }
            });

            // Check that the records wasn't remove in beforeDeleteRecord.
            var controller = app.__container__.lookup('controller:' + currentRouteName());
            assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

            // Check that the records haven't been removed.
            var recordsIsDeleteBtnInRow = $rows().every(function (element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              return nameRecord.indexOf(uuid) < 0;
            });

            assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

            // Check that the records have been removed into store.
            var builder2 = new Builder(store, modelName).where('name', _emberFlexberryData.Query.FilterOperator.Eq, uuid).count();
            var timeout = 500;
            _ember['default'].run.later(function () {
              var done2 = assert.async();
              store.query(modelName, builder2.build()).then(function (result) {
                assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
                done2();
              })['finally'](function () {
                newRecord.destroyRecord();
              });
            }, timeout);
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _emberFlexberryDataUtilsGenerateUniqueId, _emberFlexberryData) {
  var Builder = _emberFlexberryData.Query.Builder;

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check delete before record test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _emberFlexberryDataUtilsGenerateUniqueId['default'])();

    // Add records for deliting.
    _ember['default'].run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(newRecord);
        var builder = new Builder(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = _ember['default'].$(olvContainerClass);
            var $rows = function $rows() {
              return _ember['default'].$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            $rows().forEach(function (element, i, arr) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = _ember['default'].$('.object-list-view-row-delete-button', element);
                $deleteBtnInRow.click();
              }
            });

            // Check that the records wasn't remove in beforeDeleteRecord.
            var controller = app.__container__.lookup('controller:' + currentRouteName());
            assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

            // Check that the records have been removed.
            var recordsIsDeleteBtnInRow = $rows().every(function (element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              return nameRecord.indexOf(uuid) < 0;
            });

            assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

            // Check that the records have been removed into store.
            var builder2 = new Builder(store, modelName).where('name', _emberFlexberryData.Query.FilterOperator.Eq, uuid).count();
            var timeout = 500;
            _ember['default'].run.later(function () {
              var done2 = assert.async();
              store.query(modelName, builder2.build()).then(function (result) {
                assert.notOk(result.meta.count, 'record \'' + uuid + '\'not found in store');
                done2();
              });
            }, timeout);
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-data-cancel-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _emberFlexberryDataUtilsGenerateUniqueId, _emberFlexberryData) {
  var Builder = _emberFlexberryData.Query.Builder;

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check delete before record with promise data cancel test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-cancel';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _emberFlexberryDataUtilsGenerateUniqueId['default'])();

    // Add records for deliting.
    _ember['default'].run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(newRecord);
        var builder = new Builder(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = _ember['default'].$(olvContainerClass);
            var $rows = function $rows() {
              return _ember['default'].$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            $rows().forEach(function (element, i, arr) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = _ember['default'].$('.object-list-view-row-delete-button', element);
                $deleteBtnInRow.click();
              }
            });

            // Check that the records wasn't remove in beforeDeleteRecord.
            var controller = app.__container__.lookup('controller:' + currentRouteName());
            assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

            // Check that the records haven't been removed.
            var recordsIsDeleteBtnInRow = $rows().every(function (element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              return nameRecord.indexOf(uuid) < 0;
            });

            assert.notOk(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

            // Check that the records haven't been removed into store.
            var builder2 = new Builder(store, modelName).where('name', _emberFlexberryData.Query.FilterOperator.Eq, uuid).count();
            var timeout = 500;
            _ember['default'].run.later(function () {
              var done2 = assert.async();
              store.query(modelName, builder2.build()).then(function (result) {
                assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
                done2();
              })['finally'](function () {
                newRecord.destroyRecord();
              });
            }, timeout);
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-data-immediately-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _emberFlexberryDataUtilsGenerateUniqueId, _emberFlexberryData) {
  var Builder = _emberFlexberryData.Query.Builder;

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check delete before record with promise data immediately test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-immediately';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _emberFlexberryDataUtilsGenerateUniqueId['default'])();

    // Add records for deliting.
    _ember['default'].run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(newRecord);
        var builder = new Builder(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = _ember['default'].$(olvContainerClass);
            var $rows = function $rows() {
              return _ember['default'].$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            $rows().forEach(function (element, i, arr) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = _ember['default'].$('.object-list-view-row-delete-button', element);
                $deleteBtnInRow.click();
              }
            });

            // Check that the records wasn't remove in beforeDeleteRecord.
            var controller = app.__container__.lookup('controller:' + currentRouteName());
            assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

            // Check that the records haven't been removed.
            var recordsIsDeleteBtnInRow = $rows().every(function (element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              return nameRecord.indexOf(uuid) < 0;
            });

            assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

            // Check that the records have been removed into store.
            var builder2 = new Builder(store, modelName).where('name', _emberFlexberryData.Query.FilterOperator.Eq, uuid).count();
            var timeout = 500;
            _ember['default'].run.later(function () {
              var done2 = assert.async();
              store.query(modelName, builder2.build()).then(function (result) {
                assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
                done2();
              })['finally'](function () {
                newRecord.destroyRecord();
              });
            }, timeout);
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-before-recoed-with-promise-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _emberFlexberryDataUtilsGenerateUniqueId, _emberFlexberryData) {
  var Builder = _emberFlexberryData.Query.Builder;

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check delete before record with promise test', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _emberFlexberryDataUtilsGenerateUniqueId['default'])();

    // Add records for deliting.
    _ember['default'].run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(newRecord);
        var builder = new Builder(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = _ember['default'].$(olvContainerClass);
            var $rows = function $rows() {
              return _ember['default'].$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

            $rows().forEach(function (element, i, arr) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = _ember['default'].$('.object-list-view-row-delete-button', element);
                $deleteBtnInRow.click();
              }
            });

            // Check that the records wasn't remove in beforeDeleteRecord.
            var controller = app.__container__.lookup('controller:' + currentRouteName());
            assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

            // Check that the records haven't been removed.
            var recordsIsDeleteBtnInRow = $rows().every(function (element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              return nameRecord.indexOf(uuid) < 0;
            });

            assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

            // Check that the records haven't been removed into store.
            var builder2 = new Builder(store, modelName).where('name', _emberFlexberryData.Query.FilterOperator.Eq, uuid).count();
            var timeout = 500;
            _ember['default'].run.later(function () {
              var done2 = assert.async();
              store.query(modelName, builder2.build()).then(function (result) {
                assert.notOk(result.meta.count, 'record \'' + uuid + '\'not found in store');
                done2();
              });
            }, timeout);
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-button-in-row-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _emberFlexberryDataUtilsGenerateUniqueId, _emberFlexberryData) {
  var Builder = _emberFlexberryData.Query.Builder;

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check delete button in row', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 1;
    var uuid = '0' + (0, _emberFlexberryDataUtilsGenerateUniqueId['default'])();

    // Add records for deliting.
    _ember['default'].run(function () {
      var newRecord = store.createRecord(modelName, { name: uuid });
      var done1 = assert.async();

      newRecord.save().then(function () {
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(newRecord);
        var builder = new Builder(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = _ember['default'].$(olvContainerClass);
            var $rows = function $rows() {
              return _ember['default'].$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting, howAddRec, howAddRec + ' record added');

            $rows().forEach(function (element, i, arr) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              if (nameRecord.indexOf(uuid) >= 0) {
                var $deleteBtnInRow = _ember['default'].$('.object-list-view-row-delete-button', element);
                $deleteBtnInRow.click();
              }
            });

            // Check that the records have been removed.
            var recordsIsDeleteBtnInRow = $rows().every(function (element) {
              var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
              return nameRecord.indexOf(uuid) < 0;
            });

            assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

            // Check that the records have been removed into store.
            var builder2 = new Builder(store, modelName).where('name', _emberFlexberryData.Query.FilterOperator.Eq, uuid).count();
            var timeout = 500;
            _ember['default'].run.later(function () {
              var done2 = assert.async();
              store.query(modelName, builder2.build()).then(function (result) {
                assert.notOk(result.meta.count, 'record \'' + uuid + '\'not found in store');
                done2();
              });
            }, timeout);
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-button-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryDataUtilsGenerateUniqueId, _emberFlexberryData) {
  var Builder = _emberFlexberryData.Query.Builder;

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check delete using button on toolbar', function (store, assert, app) {
    assert.expect(6);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';

    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var howAddRec = 2;
    var uuid = '0' + (0, _emberFlexberryDataUtilsGenerateUniqueId['default'])();

    // Add records for deliting.
    _ember['default'].run(function () {
      var newRecords = _ember['default'].A();

      for (var i = 0; i < howAddRec; i++) {
        newRecords.pushObject(store.createRecord('ember-flexberry-dummy-suggestion-type', { name: uuid }));
      }

      var done2 = assert.async();
      var promises = _ember['default'].A();
      newRecords.forEach(function (item) {
        promises.push(item.save());
      });

      (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.addDataForDestroy)(newRecords);

      _ember['default'].RSVP.Promise.all(promises).then(function (resolvedPromises) {
        assert.ok(resolvedPromises, 'All records saved.');

        var builder = new Builder(store).from(modelName).count();
        var done1 = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);
            var olvContainerClass = '.object-list-view-container';
            var trTableClass = 'table.object-list-view tbody tr';

            var $folvContainer = _ember['default'].$(olvContainerClass);
            var $rows = function $rows() {
              return _ember['default'].$(trTableClass, $folvContainer).toArray();
            };

            // Check that the records have been added.
            var recordIsForDeleting = $rows().reduce(function (sum, current) {
              var nameRecord = _ember['default'].$.trim(current.children[1].innerText);
              var flag = nameRecord.indexOf(uuid) >= 0;
              return sum + flag;
            }, 0);

            assert.equal(recordIsForDeleting, howAddRec, howAddRec + ' records added');

            // Мark records.
            var recordIsChecked = $rows().reduce(function (sum, current) {
              var nameRecord = _ember['default'].$.trim(current.children[1].innerText);
              var $firstCell = _ember['default'].$('.object-list-view-helper-column-cell', current);
              var checkboxInRow = _ember['default'].$('.flexberry-checkbox', $firstCell);
              var checked = true;
              if (nameRecord.indexOf(uuid) >= 0) {
                checkboxInRow.click();
                checked = checkboxInRow[0].className.indexOf('checked') >= 0;
              }

              return sum && checked;
            }, true);

            assert.ok(recordIsChecked, 'Each entry begins with \'' + uuid + '\' is checked');

            // Apply filter function.
            var refreshFunction = function refreshFunction() {
              var deleteButton = _ember['default'].$('.delete-button')[0];
              click(deleteButton);
              var refreshButton = _ember['default'].$('.refresh-button')[0];
              click(refreshButton);
            };

            var done = assert.async();
            var controller = app.__container__.lookup('controller:' + currentRouteName());

            var timeout = 500;
            _ember['default'].run.later(function () {

              // Delete the marked records.
              (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {

                var recordsIsDelete = $rows().every(function (element) {
                  var nameRecord = _ember['default'].$.trim(element.children[1].innerText);
                  return nameRecord.indexOf(uuid) < 0;
                });

                assert.ok(recordsIsDelete, 'Each entry begins with \'' + uuid + '\' is delete with button in toolbar button');

                // Check that the records have been removed into store.
                var builder2 = new Builder(store).from(modelName).where('name', _emberFlexberryData.Query.FilterOperator.Eq, uuid).count();
                var done3 = assert.async();
                store.query(modelName, builder2.build()).then(function (result) {
                  assert.notOk(result.meta.count, 'records \'' + uuid + '\'not found in store');
                  done3();
                });
                done();
              });
            }, timeout);
          });
          done1();
        });
        done2();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-record-from-e-form-test', ['exports', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  // Need to add sort by multiple columns.
  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check delete record from edit form', function (store, assert, app) {
    assert.expect(1);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    visit(path);
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);

      var model = 'ember-flexberry-dummy-suggestion-type';
      var prop = 'name';
      checkDeleteRecordFromEditForm('[data-test-olv]', null, assert, store, model, prop);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-record-from-olv-test', ['exports', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check delete record from olv', function (store, assert, app) {
    assert.expect(1);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var model = 'ember-flexberry-dummy-suggestion-type';
      var prop = 'name';
      checkDeleteRecordFromOlv('[data-test-olv]', null, assert, store, model, prop);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-edit-button-in-row-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions) {

  // Need to add sort by multiple columns.
  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check edit button in row', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    visit(path);
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);

      var $editButtonInRow = _ember['default'].$('.object-list-view-row-edit-button');

      assert.equal($editButtonInRow.length, 5, 'All row have editButton');

      // Apply filter function.
      var openEditFormFunction = function openEditFormFunction() {
        var editButtonInRow = _ember['default'].$('.object-list-view-row-edit-button')[0];
        editButtonInRow.click();
      };

      // Open editform.
      var done1 = assert.async();
      (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.openEditFormByFunction)(openEditFormFunction).then(function () {
        assert.ok(true, 'edit form open');
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-from-edit-form-with-queryparams-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check return from editForm with queryParam', function (store, assert, app) {
    assert.expect(2);
    var path = 'components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list?perPage=5';
    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());

      // Open editFirn function.
      var openEditFormFunction = function openEditFormFunction() {
        var editButtonInRow = _ember['default'].$('.object-list-view-row-edit-button')[0];
        editButtonInRow.click();
      };

      // Return to listform  function.
      var returnToListFormFunction = function returnToListFormFunction() {
        var returnToListFormButton = _ember['default'].$('.return-to-list-form')[0];
        returnToListFormButton.click();
      };

      // Open editform.
      var done = assert.async();
      (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.openEditFormByFunction)(openEditFormFunction).then(function () {
        assert.ok(true, 'edit form open');

        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(returnToListFormFunction, controller).then(function () {
          assert.equal(controller.model.content.length, 1, 'QueryParams applied successfully');
          done();
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-getCellComponent-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/en/translations'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryLocalesEnTranslations) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check getCellComponent', function (store, assert, app) {
    assert.expect(7);
    var path = 'components-acceptance-tests/flexberry-objectlistview/date-format';
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      // Set 'en' as current locale.
      (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('en', app).then(function () {

        var olvContainerClass = '.object-list-view-container';

        var controller = app.__container__.lookup('controller:' + currentRouteName());

        var $folvContainer = _ember['default'].$('.object-list-view-container');
        var $table = _ember['default'].$('table.object-list-view', $folvContainer);

        var $headRow = _ember['default'].$('thead tr', $table)[0].children;

        var indexDate = function indexDate() {
          var toReturn = undefined;
          Object.keys($headRow).forEach(function (element, index, array) {
            if (_ember['default'].$.trim($headRow[element].innerText) === 'Date') {
              toReturn = index;
              return false;
            }
          });
          return toReturn;
        };

        var $dateCell = function $dateCell() {
          return _ember['default'].$.trim(_ember['default'].$('tbody tr', $table)[0].children[indexDate()].innerText);
        };

        var myRe = /[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])/;

        // Date format most be YYYY-MM-DD.
        var myArray = myRe.exec($dateCell());

        var result = myArray ? myArray[0] : null;
        assert.ok(result, 'date format is \'YYYY-MM-DD\' ');

        controller.set('dateFormat', '2');
        var $toolBar = _ember['default'].$('.ui.secondary.menu')[0];
        var $toolBarButtons = $toolBar.children;
        var $refreshButton = $toolBarButtons[0];
        assert.equal($refreshButton.innerText.trim(), _ember['default'].get(_emberFlexberryLocalesEnTranslations['default'], 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');

        var timeout = 500;
        _ember['default'].run.later(function () {
          // Apply filter function.
          var refreshFunction = function refreshFunction() {
            var refreshButton = _ember['default'].$('.refresh-button')[0];
            refreshButton.click();
          };

          // Apply filter.
          var done = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var $list = _ember['default'].$(olvContainerClass);
            assert.ok($list, 'list loaded');

            // Date format most be DD.MM.YYYY, hh:mm:ss.
            var reDateTime = /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d\, ([0-1]\d|2[0-3])(:[0-5]\d){2}$/;
            var arrayDateTime = reDateTime.exec($dateCell());

            var resultDateTime = arrayDateTime ? arrayDateTime[0] : null;
            assert.ok(resultDateTime, 'date format is \'DD.MM.YYYY, hh:mm:ss\' ');
            controller.set('dateFormat', '3');

            var done2 = assert.async();
            _ember['default'].run.later(function () {
              var done1 = assert.async();
              (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                var $list = _ember['default'].$(olvContainerClass);
                assert.ok($list, 'list loaded');

                // Date format most be II (example Sep 4 1986).
                var reDateString = /[a-zA-Z]{3} ([1-9]|[12][0-9]|3[01])\, (19|20)\d\d/;
                var arrayDateString = reDateString.exec($dateCell());

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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-goto-editform-test', ['exports', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check goto editform', function (store, assert, app) {
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);

    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var editFormRoute = controller.get('editFormRoute');
      openEditform('[data-test-olv]', null, assert, editFormRoute);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-limit-function-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryData) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check limit function', function (store, assert, app) {
    assert.expect(6);
    var path = 'components-examples/flexberry-objectlistview/limit-function-example?perPage=500';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var result1 = undefined;
    var result2 = undefined;
    var count = undefined;

    visit(path);
    andThen(function () {
      var builder1 = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionL');
      store.query(modelName, builder1.build()).then(function (result) {
        var arr = result.toArray();
        count = arr.length;
      }).then(function () {
        var builder2 = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', _emberFlexberryData.Query.FilterOperator.Neq, '');
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
            var refreshButton = _ember['default'].$('.refresh-button')[0];
            refreshButton.click();
          };

          assert.equal(controller.model.content.length, count, 'Folv load with current object count');

          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
            var resultText = _ember['default'].$('.oveflow-text')[0];
            assert.notEqual(controller.model.content.length, count, 'Folv load with object current count');
            assert.equal(resultText.innerText, result1, 'Correct result afther apply limitFunction');

            controller.set('limitFunction', result2);

            var done2 = assert.async();
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
              var resultText = _ember['default'].$('.oveflow-text')[0];
              assert.notEqual(controller.model.content.length, count, 'Folv load with current object count');
              assert.equal(resultText.innerText, result2, 'Correct result afther apply limitFunction');

              controller.set('limitFunction', undefined);

              var done3 = assert.async();
              (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
                assert.equal(controller.model.content.length, count, 'Folv load with current object count');
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
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-locales-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryLocalesRuTranslations, _emberFlexberryLocalesEnTranslations) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check locale change', function (store, assert, app) {
    assert.expect(11);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      function toolbarBtnTextAssert(currentLocale) {
        assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
        assert.equal($toolBarButtons[0].innerText.trim(), _ember['default'].get(currentLocale, 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');
        assert.equal($toolBarButtons[1].innerText.trim(), _ember['default'].get(currentLocale, 'components.olv-toolbar.add-button-text'), 'button create exist');
        assert.equal($toolBarButtons[2].innerText.trim(), _ember['default'].get(currentLocale, 'components.olv-toolbar.delete-button-text'), 'button delete exist');
        assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');
      }

      var $toolBar = _ember['default'].$('.ui.secondary.menu')[0];
      var $toolBarButtons = $toolBar.children;

      // Set 'ru' as current locale.
      (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('ru', app).then(function () {
        toolbarBtnTextAssert(_emberFlexberryLocalesRuTranslations['default']);
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('en', app).then(function () {
          toolbarBtnTextAssert(_emberFlexberryLocalesEnTranslations['default']);
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-lock-edit-form-test', ['exports', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check lock edit form', function (store, assert, app) {
    assert.expect(1);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var model = 'ember-flexberry-dummy-suggestion-type';
      var prop = 'name';
      checkLockEditForm('[data-test-olv]', null, assert, store, model, prop, path);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-open-newform-test', ['exports', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check goto new form', function (store, assert, app) {
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var newFormRoute = controller.get('editFormRoute') + '.new';
      goToNewForm('[data-test-olv]', null, assert, newFormRoute);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-paging-dropdown-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/utils/generate-unique-id'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryDataUtilsGenerateUniqueId) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check paging dropdown', function (store, assert, app) {
    assert.expect(6);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var uuid = (0, _emberFlexberryDataUtilsGenerateUniqueId['default'])();

    // Add records for paging.
    _ember['default'].run(function () {

      (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.addRecords)(store, modelName, uuid).then(function (resolvedPromises) {
        assert.ok(resolvedPromises, 'All records saved.');

        visit(path);
        andThen(function () {
          assert.equal(currentPath(), path);

          var $choosedIthem = undefined;
          var trTableBody = undefined;
          var activeItem = undefined;

          // Refresh function.
          var refreshFunction = function refreshFunction() {
            var $folvPerPageButton = _ember['default'].$('.flexberry-dropdown.compact');
            var $menu = _ember['default'].$('.menu', $folvPerPageButton);
            trTableBody = function () {
              return $(_ember['default'].$('table.object-list-view tbody tr')).length.toString();
            };

            activeItem = function () {
              return $(_ember['default'].$('.item.active.selected', $menu)).attr('data-value');
            };

            // The list should be more than 5 items.
            assert.equal(activeItem(), trTableBody(), 'equal perPage and visible element count');
            $folvPerPageButton.click();
            var timeout = 500;
            _ember['default'].run.later(function () {
              var menuIsVisible = $menu.hasClass('visible');
              assert.strictEqual(menuIsVisible, true, 'menu is visible');
              $choosedIthem = _ember['default'].$('.item', $menu);
              $choosedIthem[1].click();
            }, timeout);
          };

          var controller = app.__container__.lookup('controller:' + currentRouteName());
          var done = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            assert.equal(activeItem(), $($choosedIthem[1]).attr('data-value'), 'equal');

            // The list should be more than 10 items
            assert.equal(activeItem(), trTableBody(), 'equal perPage and visible element count');
          })['catch'](function (reason) {
            throw new Error(reason);
          })['finally'](function () {
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
            done();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-paging-navigation-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data', 'ember-flexberry-data/utils/generate-unique-id'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryData, _emberFlexberryDataUtilsGenerateUniqueId) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check paging nav', function (store, assert, app) {
    assert.expect(29);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var uuid = (0, _emberFlexberryDataUtilsGenerateUniqueId['default'])();
    var arr = undefined;
    var last = undefined;

    // Add records for paging.
    _ember['default'].run(function () {
      (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.addRecords)(store, modelName, uuid).then(function (resolvedPromises) {
        assert.ok(resolvedPromises, 'All records saved.');
        var done = assert.async();
        var builder = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionTypeE');
        store.query(modelName, builder.build()).then(function (result) {
          arr = result.toArray();
        }).then(function () {
          visit(path + '?perPage=1');
          andThen(function () {
            assert.equal(currentPath(), path);
            var controller = app.__container__.lookup('controller:' + currentRouteName());

            // check paging.
            var $basicButtons = _ember['default'].$('.ui.button', '.ui.basic.buttons');
            last = arr.length;

            assert.equal($($basicButtons[0]).hasClass('disabled'), true, 'button prev is disabled');
            assert.equal($($basicButtons[1]).hasClass('active'), true, 'page 1 is active');
            assert.equal($($basicButtons[1])[0].innerText, 1, '1st page is depicted');
            assert.equal($($basicButtons[2])[0].innerText, 2, '2nd page is depicted');
            assert.equal($($basicButtons[3])[0].innerText, 3, '3rd page is depicted');
            assert.equal($($basicButtons[4])[0].innerText, 4, '4th page is depicted');
            assert.equal($($basicButtons[5])[0].innerText, '...', '... page is depicted');
            assert.equal($($basicButtons[6])[0].innerText, last, 'last page is depicted');

            var done1 = assert.async();
            var refreshFunction = function refreshFunction() {
              var refreshButton = $basicButtons[4];
              refreshButton.click();
            };

            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              var $basicButtons = _ember['default'].$('.ui.button', '.ui.basic.buttons');
              assert.equal($($basicButtons[1]).hasClass('active'), false, 'page 1 is not active');
              assert.equal($($basicButtons[4]).hasClass('active'), true, 'page 4 is active');
              assert.equal($($basicButtons[1])[0].innerText, 1, '1st page is depicted');
              assert.equal($($basicButtons[2])[0].innerText, '...', '... page is depicted');
              assert.equal($($basicButtons[3])[0].innerText, 3, '3rd page is depicted');
              assert.equal($($basicButtons[4])[0].innerText, 4, '4th page is depicted');
              assert.equal($($basicButtons[5])[0].innerText, 5, '5th page is depicted');
              assert.equal($($basicButtons[6])[0].innerText, '...', '... page is depicted');
              assert.equal($($basicButtons[7])[0].innerText, last, 'last page is depicted');

              var done2 = assert.async();
              var refreshFunction = function refreshFunction() {
                var refreshButton = $basicButtons[7];
                refreshButton.click();
              };

              (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                var $basicButtons = _ember['default'].$('.ui.button', '.ui.basic.buttons');
                assert.equal($($basicButtons[4]).hasClass('active'), false, 'page 4 is not active');
                assert.equal($($basicButtons[6]).hasClass('active'), true, 'last page is active');
                assert.equal($($basicButtons[7]).hasClass('disabled'), true, 'button next is disabled');
                assert.equal($($basicButtons[6])[0].innerText, last, 'last page is depicted');
                assert.equal($($basicButtons[1])[0].innerText, 1, '1st page is depicted');
                assert.equal($($basicButtons[2])[0].innerText, '...', '... page is depicted');
                assert.equal($($basicButtons[3])[0].innerText, last - 3, 'n-3 page is depicted');
                assert.equal($($basicButtons[4])[0].innerText, last - 2, 'n-2 page is depicted');
                assert.equal($($basicButtons[5])[0].innerText, last - 1, 'n-1 page is depicted');
                assert.equal($($basicButtons[6])[0].innerText, last, 'last page is depicted');
              })['catch'](function (reason) {
                throw new Error(reason);
              })['finally'](function () {
                (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
                done2();
                done();
              });
            })['catch'](function (reason) {
              throw new Error(reason);
            })['finally'](function () {
              (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
              done1();
            });
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-select-record-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _emberFlexberryData) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check configurate selected rows', function (store, assert, app) {
    assert.expect(8);
    var path = 'components-examples/flexberry-objectlistview/selected-rows';
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var count = undefined;

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var builder = new _emberFlexberryData.Query.Builder(store).from(modelName);
      store.query(modelName, builder.build()).then(function (result) {
        var arr = result.toArray();
        count = arr.length;
      }).then(function () {
        var $folvContainer = _ember['default'].$('.object-list-view-container');
        var $checkAllButtton = _ember['default'].$('.check-all-button', $folvContainer).first();
        var $checkAllAtPageButton = _ember['default'].$('.check-all-at-page-button', $folvContainer).first();
        var $row = _ember['default'].$('table.object-list-view tbody tr', $folvContainer);
        var controller = app.__container__.lookup('controller:' + currentRouteName());

        var $firstCell = _ember['default'].$('.flexberry-checkbox', $row[0]);
        var $secondCell = _ember['default'].$('.flexberry-checkbox', $row[1]);

        // Сheck first record.
        $firstCell.click();
        assert.equal(controller.countSelectedRows, 1, 'First row is checked');

        // Сheck second record.
        $secondCell.click();
        assert.equal(controller.countSelectedRows, 2, 'Second row is checked');

        // Uncheck second record.
        $firstCell.click();
        assert.equal(controller.countSelectedRows, 1, 'First row is checked');

        // Сheck all record at page.
        $checkAllAtPageButton.click();
        assert.equal(controller.countSelectedRows, 5, 'First row is checked');

        // Uncheck all record at page.
        $checkAllAtPageButton.click();
        assert.equal(controller.countSelectedRows, 0, 'First row is checked');

        // Сheck fist reccord and all record.
        $firstCell.click();
        $checkAllButtton.click();
        assert.equal(controller.countSelectedRows, count, 'First row is checked');

        // Uncheck all record.
        $checkAllButtton.click();
        assert.equal(controller.countSelectedRows, 0, 'First row is checked');
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-by-computable-field-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryData) {

  // Need to add sort by multiple columns.
  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check sorting by computable field', function (store, assert, app) {
    assert.expect(6);
    var path = 'components-acceptance-tests/flexberry-objectlistview/computable-field';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var minValue = undefined;
    var maxValue = undefined;

    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {
      assert.equal(currentPath(), path);
      var builder = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionL').orderBy('commentsCount');
      store.query(modelName, builder.build()).then(function (result) {
        var arr = result.toArray();
        minValue = arr.objectAt(0).get('commentsCount');
        maxValue = arr.objectAt(arr.length - 1).get('commentsCount');
      }).then(function () {

        var $olv = _ember['default'].$('.object-list-view ');
        var $thead = _ember['default'].$('th.dt-head-left', $olv)[9];
        var controller = app.__container__.lookup('controller:' + currentRouteName());

        // Refresh function.
        var refreshFunction = function refreshFunction() {
          $thead.click();
        };

        var done1 = assert.async();
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
          var $cellText = _ember['default'].$('div.oveflow-text')[9];
          assert.equal(controller.sort, '+commentsCount', 'sorting symbol added');
          assert.equal($cellText.innerText, minValue, 'sorting symbol added');
          var done2 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var $cellText = _ember['default'].$('div.oveflow-text')[9];
            assert.equal(controller.sort, '-commentsCount', 'sorting symbol added');
            assert.equal($cellText.innerText, maxValue, 'sorting symbol added');
            var done3 = assert.async();
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-clear-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryLocalesRuTranslations) {

  // Need to add sort by multiple columns.
  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check sorting clear', function (store, assert, app) {
    assert.expect(8);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var projectionName = _ember['default'].get(controller, 'modelProjection');

      var orderByClause = null;

      var $olv = _ember['default'].$('.object-list-view ');
      var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];

      var currentSorting = controller.get('computedSorting');
      if (!$.isEmptyObject(currentSorting)) {
        orderByClause = (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.getOrderByClause)(currentSorting);
      }

      _ember['default'].run(function () {
        var done = assert.async();

        // Check sortihg in the first column. Sorting is not append.
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('ru', app).then(function () {
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.checkSortingList)(store, projectionName, $olv, orderByClause).then(function (isTrue) {
            assert.ok(isTrue, 'sorting is not applied');

            // Check sortihg icon in the first column. Sorting icon is not added.
            assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');

            // Refresh function.
            var refreshFunction1 = function refreshFunction1() {
              $thead.click();
            };

            var done1 = assert.async();
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction1, controller).then(function () {
              var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];
              var $ord = _ember['default'].$('.object-list-view-order-icon', $thead);
              var $divOrd = _ember['default'].$('div', $ord);

              assert.equal($divOrd.attr('title'), _ember['default'].get(_emberFlexberryLocalesRuTranslations['default'], 'components.object-list-view.sort-ascending'), 'title is Order ascending');
              assert.equal(_ember['default'].$.trim($divOrd.text()), String.fromCharCode('9650') + '1', 'sorting symbol added');

              var done2 = assert.async();
              (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.checkSortingList)(store, projectionName, $olv, 'address asc').then(function (isTrue) {
                assert.ok(isTrue, 'sorting applied');

                var done3 = assert.async();
                var refreshFunction2 = function refreshFunction2() {
                  var $clearButton = _ember['default'].$('.clear-sorting-button');
                  $clearButton.click();
                };

                (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction2, controller).then(function () {
                  var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];
                  var $ord = _ember['default'].$('.object-list-view-order-icon', $thead);
                  var $divOrd = _ember['default'].$('div', $ord);

                  assert.equal($divOrd.attr('title'), undefined, 'sorting are clear');
                  assert.equal(_ember['default'].$.trim($divOrd.text()), '', 'sorting symbol delete');

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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-for-each-column-test', ['exports', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check sorting for each column', function (store, assert, app) {
    assert.expect(1);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);

      checkOlvSortForEachColumn('[data-test-olv]', null, assert);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-on-all-columns-test', ['exports', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check sorting on all column', function (store, assert, app) {
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);

      checkOlvSortOnAllColumns('[data-test-olv]', null, assert);
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryLocalesRuTranslations) {

  // Need to add sort by multiple columns.
  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check sorting', function (store, assert, app) {
    assert.expect(14);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var projectionName = _ember['default'].get(controller, 'modelProjection');

      var orderByClause = null;

      var $olv = _ember['default'].$('.object-list-view ');
      var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];

      var currentSorting = controller.get('computedSorting');
      if (!$.isEmptyObject(currentSorting)) {
        orderByClause = (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.getOrderByClause)(currentSorting);
      }

      _ember['default'].run(function () {
        var done = assert.async();

        // Check sortihg in the first column. Sorting is not append.
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('ru', app).then(function () {
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.checkSortingList)(store, projectionName, $olv, orderByClause).then(function (isTrue) {
            assert.ok(isTrue, 'sorting is not applied');

            // Check sortihg icon in the first column. Sorting icon is not added.
            assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');
            assert.equal(controller.sort, undefined, 'no sorting in URL');

            // Refresh function.
            var refreshFunction = function refreshFunction() {
              $thead.click();
            };

            var done1 = assert.async();
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];
              var $ord = _ember['default'].$('.object-list-view-order-icon', $thead);
              var $divOrd = _ember['default'].$('div', $ord);

              assert.equal($divOrd.attr('title'), _ember['default'].get(_emberFlexberryLocalesRuTranslations['default'], 'components.object-list-view.sort-ascending'), 'title is Order ascending');
              assert.equal(_ember['default'].$.trim($divOrd.text()), String.fromCharCode('9650') + '1', 'sorting symbol added');
              assert.equal(controller.sort, '+address', 'up sorting in URL');

              var done2 = assert.async();
              (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.checkSortingList)(store, projectionName, $olv, 'address asc').then(function (isTrue) {
                assert.ok(isTrue, 'sorting applied');
                var done3 = assert.async();
                (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                  var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];
                  var $ord = _ember['default'].$('.object-list-view-order-icon', $thead);
                  var $divOrd = _ember['default'].$('div', $ord);

                  assert.equal($divOrd.attr('title'), _ember['default'].get(_emberFlexberryLocalesRuTranslations['default'], 'components.object-list-view.sort-descending'), 'title is Order descending');
                  assert.equal(_ember['default'].$.trim($divOrd.text()), String.fromCharCode('9660') + '1', 'sorting symbol changed');
                  assert.equal(controller.sort, '-address', 'down sorting in URL');

                  var done4 = assert.async();
                  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.checkSortingList)(store, projectionName, $olv, 'address desc').then(function (isTrue) {
                    assert.ok(isTrue, 'sorting applied');

                    var done5 = assert.async();
                    (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                      assert.equal(controller.sort, null, 'no sorting in URL');
                      var done6 = assert.async();
                      (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                        assert.equal(controller.sort, '+address', 'up sorting in URL');
                        done6();
                      });
                      done5();
                    });
                    done4();
                  });
                })['finally'](function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-with-default-setting-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions, _emberFlexberryLocalesRuTranslations) {

  // Need to add sort by multiple columns.
  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check sorting with default setting', function (store, assert, app) {
    assert.expect(9);
    var path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);
      var controller = app.__container__.lookup('controller:' + currentRouteName());

      var $olv = _ember['default'].$('.object-list-view ');

      _ember['default'].run(function () {
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('ru', app).then(function () {
          // Refresh function.
          var refreshFunction = function refreshFunction() {
            $thead.click();
          };

          var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];
          var $ord = _ember['default'].$('.object-list-view-order-icon', $thead);
          var $divOrd = _ember['default'].$('div', $ord);

          assert.equal($divOrd.attr('title'), _ember['default'].get(_emberFlexberryLocalesRuTranslations['default'], 'components.object-list-view.sort-ascending'), 'title is Order ascending');
          assert.equal(_ember['default'].$.trim($divOrd.text()), String.fromCharCode('9650') + '1', 'sorting symbol added');
          assert.equal(controller.sort, '+name', 'up sorting in URL');

          var done1 = assert.async();
          (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
            var $thead = _ember['default'].$('th.dt-head-left', $olv)[0];
            var $ord = _ember['default'].$('.object-list-view-order-icon', $thead);
            var $divOrd = _ember['default'].$('div', $ord);

            assert.equal($divOrd.attr('title'), _ember['default'].get(_emberFlexberryLocalesRuTranslations['default'], 'components.object-list-view.sort-descending'), 'title is Order descending');
            assert.equal(_ember['default'].$.trim($divOrd.text()), String.fromCharCode('9660') + '1', 'sorting symbol changed');
            assert.equal(controller.sort, '-name', 'down sorting in URL');

            var done2 = assert.async();
            (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
              assert.equal(controller.sort, null, 'no sorting in URL');
              var done3 = assert.async();
              (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function () {
                assert.equal(controller.sort, '+name', 'up sorting in URL');
                done3();
              });
              done2();
            });
          })['finally'](function () {
            done1();
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', ['exports', 'ember', 'ember-flexberry-data'], function (exports, _ember, _emberFlexberryData) {
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
    return new _ember['default'].RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = undefined;
      var checkIntervalSucceed = false;
      var checkInterval = 500;
      var timeout = 10000;

      _ember['default'].run(function () {
        $ctrlForClick.click();
      });

      _ember['default'].run(function () {
        checkIntervalId = window.setInterval(function () {
          var $list = _ember['default'].$(list);
          var $records = _ember['default'].$(records, $list);
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
      _ember['default'].run(function () {
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
    return new _ember['default'].RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = undefined;
      var checkIntervalSucceed = false;
      var checkInterval = 500;
      var timeout = 10000;

      openEditFormFunction();

      _ember['default'].run(function () {
        checkIntervalId = window.setInterval(function () {
          if (_ember['default'].$('.ui.button.close-button').length === 0) {

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
      _ember['default'].run(function () {
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
    return new _ember['default'].RSVP.Promise(function (resolve, reject) {
      var checkIntervalId = undefined;
      var checkIntervalSucceed = false;
      var checkInterval = 500;
      var renderInterval = 100;
      var timeout = 10000;
      var timeiutForLongTimeLoad = checkInterval + 500;

      var $lastLoadCount = controller.loadCount;
      refreshFunction();
      _ember['default'].run(function () {
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
      _ember['default'].run(function () {
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
    return new _ember['default'].RSVP.Promise(function (resolve) {
      _ember['default'].run(function () {
        var modelName = projection.modelName;
        var builder = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection(projection.projectionName).skip(0);
        builder = !ordr ? builder : builder.orderBy(ordr);
        store.query(modelName, builder.build()).then(function (records) {
          var recordsArr = records.toArray();
          var $tr = _ember['default'].$('table.object-list-view tbody tr').toArray();

          var isTrue = $tr.reduce(function (sum, current, i) {
            var expectVal = !recordsArr[i].get('address') ? '' : recordsArr[i].get('address');
            return sum && _ember['default'].$.trim(current.children[1].innerText) === expectVal;
          }, true);

          resolve(isTrue);
        });
      });
    });
  }

  // Function for addition records.

  function addRecords(store, modelName, uuid) {
    var promises = _ember['default'].A();
    var listCount = 55;
    _ember['default'].run(function () {

      var builder = new _emberFlexberryData.Query.Builder(store).from(modelName).count();
      store.query(modelName, builder.build()).then(function (result) {
        var howAddRec = listCount - result.meta.count;
        var newRecords = _ember['default'].A();

        for (var i = 0; i < howAddRec; i++) {
          newRecords.pushObject(store.createRecord(modelName, { name: uuid }));
        }

        newRecords.forEach(function (item) {
          promises.push(item.save());
        });
      });
    });
    return _ember['default'].RSVP.Promise.all(promises);
  }

  // Function for deleting records.

  function deleteRecords(store, modelName, uuid, assert) {
    _ember['default'].run(function () {
      var done = assert.async();
      var builder = new _emberFlexberryData.Query.Builder(store, modelName).where('name', _emberFlexberryData.Query.FilterOperator.Eq, uuid);
      store.query(modelName, builder.build()).then(function (results) {
        results.content.forEach(function (item) {
          item.deleteRecord();
          item.save();
        });
        done();
      });
    });
  }

  // Function for waiting loading list.

  function loadingLocales(locale, app) {
    return new _ember['default'].RSVP.Promise(function (resolve) {
      var i18n = app.__container__.lookup('service:i18n');

      _ember['default'].run(function () {
        i18n.set('locale', locale);
      });

      var timeout = 500;
      _ember['default'].run.later(function () {
        resolve({ msg: 'ok' });
      }, timeout);
    });
  }

  // Function for filter object-list-view by list of operations and values.

  function filterObjectListView(objectListView, operations, filterValues) {
    var tableBody = objectListView.children('tbody');
    var tableRow = _ember['default'].$(tableBody.children('tr'));
    var tableColumns = _ember['default'].$(tableRow[0]).children('td');

    var promises = _ember['default'].A();

    for (var i = 0; i < tableColumns.length; i++) {
      if (operations[i]) {
        promises.push(filterCollumn(objectListView, i, operations[i], filterValues[i]));
      }
    }

    return _ember['default'].RSVP.Promise.all(promises);
  }

  // Function for filter object-list-view at one column by operations and values.

  function filterCollumn(objectListView, columnNumber, operation, filterValue) {
    return new _ember['default'].RSVP.Promise(function (resolve) {
      var tableBody = objectListView.children('tbody');
      var tableRow = tableBody.children('tr');

      var filterOperation = _ember['default'].$(tableRow[0]).find('.flexberry-dropdown')[columnNumber];
      var filterValueCell = _ember['default'].$(tableRow[1]).children('td')[columnNumber];

      // Select an existing item.
      _ember['default'].$(filterOperation).dropdown('set selected', operation);

      var dropdown = _ember['default'].$(filterValueCell).find('.flexberry-dropdown');
      var textbox = _ember['default'].$(filterValueCell).find('.ember-text-field');

      var fillPromise = undefined;
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
        _ember['default'].run.later(function () {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-user-button-test', ['exports', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (exports, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('user button test', function (store, assert, app) {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-wrapper-projection-test', ['exports', 'ember', 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (exports, _ember, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions) {

  (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewExecuteFolvTest.executeTest)('check wrapper and projection', function (store, assert, app) {
    assert.expect(6);
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    click('.ui.clear-sorting-button');
    andThen(function () {
      assert.equal(currentPath(), path);

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var projectionName = function projectionName() {
        return _ember['default'].get(controller, 'modelProjection');
      };

      var $olv = _ember['default'].$('.object-list-view ');
      var $folvContainer = _ember['default'].$('.object-list-view-container');
      var $tableInFolvContainer = _ember['default'].$('table', $folvContainer);
      assert.equal($tableInFolvContainer.length, 1, 'folv table in container exist');

      var $tableBody = _ember['default'].$('tbody', '.object-list-view-container');
      assert.equal($tableBody.length, 1, 'tbody in table exist');

      var dtHeadTable = _ember['default'].$('.dt-head-left.me.class', 'thead', $tableInFolvContainer);

      var orderByClause = null;

      var currentSorting = controller.get('computedSorting');
      if (!$.isEmptyObject(currentSorting)) {
        orderByClause = (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.getOrderByClause)(currentSorting);
      }

      var done = assert.async();
      (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.checkSortingList)(store, projectionName(), $olv, orderByClause).then(function (isTrue) {
        assert.ok(isTrue, 'records are displayed correctly');
        done();
      }).then(function () {
        (0, _dummyTestsAcceptanceComponentsFlexberryObjectlistviewFolvTestsFunctions.loadingLocales)('en', app).then(function () {

          // Check projectionName.
          var attrs = projectionName().attributes;
          var flag = true;

          Object.keys(attrs).forEach(function (element, index, array) {
            if (attrs[element].kind !== 'hasMany') {
              flag = flag && _ember['default'].$.trim(dtHeadTable[index].innerText) === attrs[element].caption;
            }
          });
          assert.ok(flag, 'projection = columns names');

          var newProjectionName = 'SettingLookupExampleView';
          controller.set('modelProjection', newProjectionName);

          // Ember.get(controller, 'modelProjection') returns only the name of the projection when it replaced.
          assert.equal(projectionName(), newProjectionName, 'projection name is changed');
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/readonly-test/edit-form-readonly-test', ['exports', 'ember', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _ember, _qunit, _dummyTestsHelpersStartApp) {
  var _this = this;

  var app = undefined;
  var path = 'components-acceptance-tests/edit-form-readonly';

  (0, _qunit.module)('Acceptance | edit-form | readonly-mode ', {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _dummyTestsHelpersStartApp['default'])();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach: function afterEach() {
      _ember['default'].run(app, 'destroy');
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
      _ember['default'].run.scheduleOnce('afterRender', function () {
        assert.strictEqual($checkbox.hasClass('read-only'), false, 'Checkbox don\'t readonly');
        assert.strictEqual($checkboxFge.hasClass('read-only'), false, 'Groupedit\'s checkbox don\'t readonly');
      });
    });
  });

  (0, _qunit.test)('flexbery-textbox on readonly editform', function (assert) {
    assert.expect(4);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $textboxInput = find('[data-test-textbox] input');
      assert.strictEqual(_ember['default'].$.trim($textboxInput.attr('readonly')), 'readonly', 'Textbox is readonly');

      var $textboxFgeInput = find('[data-test-groupedit] .flexberry-textbox input');
      assert.strictEqual(_ember['default'].$.trim($textboxFgeInput.attr('readonly')), 'readonly', 'Groupedit\'s textbox is readonly');

      controller.set('readonly', false);
      _ember['default'].run.scheduleOnce('afterRender', function () {
        assert.strictEqual($(_this).is('readonly'), false, 'Textbox don\'t readonly');
        assert.strictEqual($(_this).is('readonly'), false, 'Groupedit\'s textbox don\'t readonly');
      });
    });
  });

  (0, _qunit.test)('flexberry-textarea on readonly editform', function (assert) {
    assert.expect(4);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $textareaInput = find('[data-test-textarea] textarea');
      assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('readonly')), 'readonly', 'Textarea is readonly');

      var $textareaInputFGE = find('[data-test-groupedit] .flexberry-textarea textarea');
      assert.strictEqual(_ember['default'].$.trim($textareaInputFGE.attr('readonly')), 'readonly', 'Groupedit\'s textarea is readonly');

      controller.set('readonly', false);
      _ember['default'].run.scheduleOnce('afterRender', function () {
        assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('readonly')), '', 'Textarea don\'t readonly');
        assert.strictEqual(_ember['default'].$.trim($textareaInputFGE.attr('readonly')), '', 'Groupedit\'s textarea don\'t readonly');
      });
    });
  });

  (0, _qunit.test)('flexberry-datepicker on readonly editform', function (assert) {
    assert.expect(8);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $datepicker = find('[data-test-datepicker]');
      var $datepickerInput = $datepicker.children('input');
      assert.strictEqual(_ember['default'].$.trim($datepickerInput.attr('readonly')), 'readonly', 'Time is readonly');
      var $button = $datepicker.children('.calendar');
      assert.strictEqual($button.hasClass('link'), false, 'Datepicker hasn\'t link');

      var $datepickerFge = find('[data-test-groupedit] .flexberry-datepicker');
      var $datepickerFgeInput = $datepickerFge.children('input');
      assert.strictEqual(_ember['default'].$.trim($datepickerFgeInput.attr('readonly')), 'readonly', 'Groupedit\'s datepicker is readonly');
      var $buttonFge = $datepickerFge.children('.calendar');
      assert.strictEqual($buttonFge.hasClass('link'), false, 'Groupedit\'s datepicker hasn\'t link');

      controller.set('readonly', false);
      _ember['default'].run.scheduleOnce('afterRender', function () {
        assert.strictEqual(_ember['default'].$.trim($datepickerInput.attr('readonly')), '', 'Time don\'t readonly');
        assert.strictEqual($button.hasClass('link'), true, 'Datepicker has link');

        assert.strictEqual(_ember['default'].$.trim($datepickerFgeInput.attr('readonly')), '', 'Groupedit\'s datepicker don\'t readonly');
        assert.strictEqual($buttonFge.hasClass('link'), true, 'Groupedit\'s datepicker has link');
      });
    });
  });

  (0, _qunit.test)('flexberry-simpledatetime on readonly editform', function (assert) {
    assert.expect(2);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $simpledatetime = find('[data-test-simpledatetime] .custom-flatpickr');

      assert.strictEqual(_ember['default'].$.trim($simpledatetime.attr('readonly')), 'readonly', 'Time is readonly');

      controller.set('readonly', false);
      _ember['default'].run.scheduleOnce('afterRender', function () {
        assert.strictEqual(_ember['default'].$.trim($simpledatetime.attr('readonly')), '', 'Time don\'t readonly');
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
      _ember['default'].run.scheduleOnce('afterRender', function () {
        assert.strictEqual($dropdown.hasClass('disabled'), false, 'Dropdown don\'t readonly');
        assert.strictEqual($dropdownFge.hasClass('disabled'), false, 'Groupedit\'s dropdown don\'t readonly');
      });
    });
  });

  (0, _qunit.test)('flexberry-file on readonly edit form', function (assert) {
    assert.expect(14);

    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var $file = find('[data-test-file] input.flexberry-file-filename-input');
      assert.strictEqual(_ember['default'].$.trim($file.attr('readonly')), 'readonly', 'Flexberry-file is readonly');
      var $downloadButton = find('[data-test-file] label.flexberry-file-download-button');
      assert.strictEqual($downloadButton.hasClass('disabled'), true, 'Flexberry-file\'s button \'Download\' is readonly');

      var $fileFge = find('[data-test-groupedit] input.flexberry-file-filename-input');
      assert.strictEqual(_ember['default'].$.trim($fileFge.attr('readonly')), 'readonly', 'Groupedit\'s flexberry-file is readonly');
      var $downloadButtonFge = find('[data-test-groupedit] label.flexberry-file-download-button');
      assert.strictEqual($downloadButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file\'s button \'Download\' is readonly');

      controller.set('readonly', false);
      _ember['default'].run.scheduleOnce('afterRender', function () {
        assert.strictEqual($(_this).is('readonly'), false, 'Flexberry-file don\'t readonly');
        var $addButton = find('[data-test-file] label.flexberry-file-add-button');
        assert.strictEqual($addButton.hasClass('disabled'), false, 'Flexberry-file\'s button \'Add\' don\'t readonly');
        var $removeButton = find('[data-test-file] label.flexberry-file-remove-button');
        assert.strictEqual($removeButton.hasClass('disabled'), true, 'Flexberry-file has button \'Remove\'');
        var $uploadButton = find('[data-test-file] label.flexberry-file-upload-button');
        assert.strictEqual($uploadButton.hasClass('disabled'), true, 'Flexberry-file has button \'Upload\'');
        assert.strictEqual($downloadButton.hasClass('disabled'), true, 'Flexberry-file has button \'Download\'');

        assert.strictEqual($(_this).is('readonly'), false, 'Groupedit\'s flexberry-file don\'t readonly');
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
      assert.strictEqual(_ember['default'].$.trim($lookup.attr('readonly')), 'readonly', 'Lookup is readonly');
      var $chooseButton = find('[data-test-lookup] button.ui-change');
      assert.strictEqual($chooseButton.hasClass('disabled'), true, 'Flexberry-lookup\'s button \'Choose\' is readonly');
      var $removeButton = find('[data-test-lookup] button.ui-clear');
      assert.strictEqual($removeButton.hasClass('disabled'), true, 'Flexberry-lookup\'s button \'Remove\' is readonly');

      var $lookupFge = find('[data-test-groupedit] input.lookup-field');
      assert.strictEqual(_ember['default'].$.trim($lookupFge.attr('readonly')), 'readonly', 'Groupedit\'s lookup is readonly');
      var $chooseButtonFge = find('[data-test-groupedit] button.ui-change');
      assert.strictEqual($chooseButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-lookup\'s button \'Choose\' is readonly');
      var $removeButtonFge = find('[data-test-groupedit] button.ui-clear');
      assert.strictEqual($removeButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-lookup\'s button \'Remove\' is readonly');

      controller.set('readonly', false);
      _ember['default'].run.scheduleOnce('afterRender', function () {
        $removeButton = find('[data-test-lookup] button.ui-clear');
        $removeButtonFge = find('[data-test-groupedit] button.ui-clear');
        assert.strictEqual($(_this).is('readonly'), false, 'Lookup don\'t readonly');
        assert.strictEqual($chooseButton.hasClass('disabled'), false, 'Flexberry-lookup\'s button \'Choose\' don\'t readonly');
        assert.strictEqual($removeButton.hasClass('disabled'), false, 'Flexberry-lookup\'s button \'Remove\' don\'t readonly');

        assert.strictEqual($(_this).is('readonly'), false, 'Groupedit\'s lookup don\'t readonly');
        assert.strictEqual($chooseButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-lookup\'s button \'Choose\' don\'t readonly');
        assert.strictEqual($removeButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-lookup\'s button \'Remove\' don\'t readonly');
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
      _ember['default'].run.scheduleOnce('afterRender', function () {
        assert.strictEqual($dropdown.hasClass('disabled'), false, 'Lookup as dropdown don\'t readonly');
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
      _ember['default'].run.scheduleOnce('afterRender', function () {
        assert.strictEqual($groupedit.hasClass('readonly'), false, 'Groupedit don\'t readonly');
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

      assert.strictEqual(_ember['default'].$.trim($addButton.attr('disabled')), 'disabled', 'Flexberry-groupedit\'s button \'Add\' is readonly');
      assert.strictEqual(_ember['default'].$.trim($removeButton.attr('disabled')), 'disabled', 'Flexberry-groupedit\'s button \'Remove\' is readonly');
      assert.strictEqual($checkbox.hasClass('read-only'), true, 'Flexberry-groupedit\'s checkbox helper is readonly');
      assert.strictEqual($removeButtonRow.hasClass('disabled'), true, 'Flexberry-groupedit\'s button \'Remove in row\' is readonly');
      assert.strictEqual($itemEditMenu.hasClass('disabled'), true, 'Flexberry-groupedit\'s item \'Edit\' in left menu is readonly');
      assert.strictEqual($itemDeconsteMenu.hasClass('disabled'), true, 'Flexberry-groupedit\'s item \'Deconste\' in left menu is readonly');

      var controller = app.__container__.lookup('controller:' + currentRouteName());
      controller.set('readonly', false);
      _ember['default'].run.scheduleOnce('afterRender', function () {
        $checkbox = find('[data-test-groupedit] .flexberry-checkbox');
        $itemEditMenu = find('[data-test-groupedit] .edit-menu');
        $itemDeconsteMenu = find('[data-test-groupedit] .delete-menu');
        $removeButtonRow = find('[data-test-groupedit] .object-list-view-row-delete-button');

        assert.strictEqual($(_this).is('disabled'), false, 'Flexberry-groupedit\'s button \'Add\' don\'t readonly');
        assert.strictEqual($(_this).is('disabled'), false, 'Flexberry-groupedit\'s button \'Remove\' don\'t readonly');
        assert.strictEqual($checkbox.hasClass('read-only'), false, 'Flexberry-groupedit\'s checkbox helper don\'t readonly');
        assert.strictEqual($removeButtonRow.hasClass('disabled'), false, 'Flexberry-groupedit\'s button \'Remove in row\' don\'t readonly');
        assert.strictEqual($itemEditMenu.hasClass('disabled'), false, 'Flexberry-groupedit\'s item \'Edit\' in left menu don\'t readonly');
        assert.strictEqual($itemDeconsteMenu.hasClass('disabled'), false, 'Flexberry-groupedit\'s item \'Deconste\' in left menu don\'t readonly');
      });
    });
  });
});
define('dummy/tests/acceptance/edit-form-validation-test/execute-validation-test', ['exports', 'ember', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _ember, _qunit, _dummyTestsHelpersStartApp) {
  exports.executeTest = executeTest;

  function executeTest(testName, callback) {
    var app = undefined;
    var store = undefined;
    var userSettingsService = undefined;

    (0, _qunit.module)('Acceptance | flexberry-validation | ' + testName, {
      beforeEach: function beforeEach() {

        // Start application.
        app = (0, _dummyTestsHelpersStartApp['default'])();

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
        _ember['default'].run(app, 'destroy');
        var daterangepicker = _ember['default'].$('.daterangepicker');
        daterangepicker.remove();
      }
    });

    (0, _qunit.test)(testName, function (assert) {
      return callback(store, assert, app);
    });
  }
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-base-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check default value', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationLablesContainer = _ember['default'].$('.ember-view.ui.basic.label');
      var $validationSixteenWide = _ember['default'].$('.list');
      var $validationLi = $validationSixteenWide.children('li');

      // Сounting the number of validationmessage.
      assert.equal($validationLablesContainer.length, 11, 'All components have default value');
      assert.equal($validationLi.length, 17, 'All components have default value in sixteenWide');
    });
  });
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-checkbox-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check operation checkbox', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = _ember['default'].$(_ember['default'].$('.field.error')[0]);
      var $validationFlexberryCheckbox = $validationField.children('.flexberry-checkbox');
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Flag is required,Flag must be \'true\' only', 'Checkbox\'s label have default value by default');

      _ember['default'].run(function () {
        $validationFlexberryCheckbox.click();
      });

      // Check validationmessage text afther first click.
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Checkbox\'s label havn\'t value after first click');

      _ember['default'].run(function () {
        $validationFlexberryCheckbox.click();
      });

      // Check validationmessage text = 'Flag must be 'true' only' afther first click.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Flag must be \'true\' only', 'Checkbox\'s label have value after second click');
    });
  });
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-datepicker-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check operation datepicker', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = _ember['default'].$(_ember['default'].$('.field.error')[4]);
      $validationField = $validationField.children('.inline');
      var $validationFlexberryErrorLable = $validationField.children('.label');
      var $validationDateField = _ember['default'].$('.calendar.link.icon');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Date is required', 'Datepicker have default value');

      _ember['default'].run(function () {

        // Open datepicker calendar.
        $validationDateField.click();
        var $validationDateButton = _ember['default'].$('.available:not(.active)');
        $validationDateButton = _ember['default'].$($validationDateButton[18]);

        // Select date.
        $validationDateButton.click();
      });

      // Check validationmessage text.
      $validationFlexberryErrorLable = $validationField.children('.label');

      // Waiting for completion _setProperOffsetToCalendar().
      var done = assert.async();
      setTimeout(function () {
        assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Datepicker have value');
        done();
      }, 2000);
    });
  });
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-detail-delete-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check detail delete', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      // Сounting the number of validationmessage.
      var $validationLablesContainer = _ember['default'].$('.ember-view.ui.basic.label');
      assert.equal($validationLablesContainer.length, 11, 'All components have default value');

      var $validationFlexberryCheckboxs = _ember['default'].$('.flexberry-checkbox');
      var $validationFlexberryCheckbox = _ember['default'].$($validationFlexberryCheckboxs[1]);
      var $validationFlexberryOLVDeleteButton = _ember['default'].$(_ember['default'].$('.ui.disabled.button')[1]);

      // Delete detail.
      _ember['default'].run($validationFlexberryCheckbox, $validationFlexberryCheckbox.click);
      _ember['default'].run($validationFlexberryOLVDeleteButton, $validationFlexberryOLVDeleteButton.click);

      // Сounting the number of validationmessage = 8 afther detail delete.
      $validationLablesContainer = _ember['default'].$('.ember-view.ui.basic.label');
      assert.equal($validationLablesContainer.length, 8, 'Detail was deleted without errors');
    });
  });
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-detail-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check detail\'s components', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      // Сounting the number of validationmessage.
      var $validationLablesContainer = _ember['default'].$('.ember-view.ui.basic.label');
      assert.equal($validationLablesContainer.length, 11, 'All components have default value');

      var $validationFlexberryCheckboxs = _ember['default'].$('.flexberry-checkbox');
      var $validationFlexberryOLVCheckbox = _ember['default'].$($validationFlexberryCheckboxs[2]);

      var $validationFlexberryTextboxs = _ember['default'].$('.flexberry-textbox');
      var $validationFlexberryOLVTextbox1 = _ember['default'].$($validationFlexberryTextboxs[2]);
      var $validationFlexberryOLVTextbox2 = _ember['default'].$($validationFlexberryTextboxs[3]);

      // Selct textbox inner.
      var $validationFlexberryTextboxInner1 = $validationFlexberryOLVTextbox1.children('input');
      var $validationFlexberryTextboxInner2 = $validationFlexberryOLVTextbox2.children('input');

      // Select deteil's validationmessages.
      var $validationField1 = _ember['default'].$($validationLablesContainer[8]);
      var $validationField2 = _ember['default'].$($validationLablesContainer[9]);
      var $validationField3 = _ember['default'].$($validationLablesContainer[10]);

      // Data insertion.
      _ember['default'].run(function () {
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
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-dropdown-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check operation dropdown', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = _ember['default'].$(_ember['default'].$('.field.error')[5]);
      var $validationFlexberryDropdown = $validationField.children('.flexberry-dropdown');
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Enumeration is required', 'Dropdown have default value');

      _ember['default'].run(function () {

        // Open dropdown.
        $validationFlexberryDropdown.click();
        var $validationFlexberryDropdownMenu = $validationFlexberryDropdown.children('.menu');
        var $validationFlexberryDropdownItems = $validationFlexberryDropdownMenu.children('.item');
        var $validationFlexberryDropdownItem = _ember['default'].$($validationFlexberryDropdownItems[0]);

        // Select item
        $validationFlexberryDropdownItem.click();
      });

      // Validationmessage must be empty.
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Dropdown have value');
    });
  });
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-file-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check operation file', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationFieldFile = _ember['default'].$(_ember['default'].$('.field.error')[6]);
      var $validationFlexberryErrorLable = $validationFieldFile.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'File is required', 'Flexberry file have default value');

      var $validationFlexberryLookupButtons = _ember['default'].$('.ui.button');
      var $validationFlexberryLookupButton = _ember['default'].$($validationFlexberryLookupButtons[2]);

      // Click lookup button.
      _ember['default'].run(function () {
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
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-lookup-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check operation lookup', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = _ember['default'].$(_ember['default'].$('.field.error')[7]);
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Master is required', 'Lookup have default value');

      var $validationFlexberryLookupButtons = _ember['default'].$('.ui.button');
      var $validationFlexberryLookupButton = _ember['default'].$($validationFlexberryLookupButtons[2]);

      // Click lookup button.
      _ember['default'].run(function () {
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
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check complete all tests', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationDataField = _ember['default'].$('.calendar.link.icon');

      _ember['default'].run(function () {
        // Open datepicker calendar.
        $validationDataField.click();
        var $validationDateButton = _ember['default'].$('.available');

        // Select date.
        _ember['default'].$($validationDateButton[15]).click();
        _ember['default'].$($validationDateButton[16]).click();
      });

      var $validationFlexberryLookupButtons = _ember['default'].$('.ui.button');
      var $validationFlexberryLookupButton = _ember['default'].$($validationFlexberryLookupButtons[2]);

      // Click lookup button.
      _ember['default'].run(function () {
        $validationFlexberryLookupButton.click();
      });

      var $validationFlexberryCheckboxs = _ember['default'].$('.flexberry-checkbox');
      var $validationFlexberryCheckbox = _ember['default'].$($validationFlexberryCheckboxs[0]);
      var $validationFlexberryOLVCheckbox = _ember['default'].$($validationFlexberryCheckboxs[2]);

      _ember['default'].run(function () {
        $validationFlexberryCheckbox.click();
        $validationFlexberryOLVCheckbox.click();
      });

      var $validationFlexberryDropdown = _ember['default'].$('.flexberry-dropdown');

      _ember['default'].run(function () {

        // Open dropdown.
        $validationFlexberryDropdown.click();
        var $validationFlexberryDropdownMenu = $validationFlexberryDropdown.children('.menu');
        var $validationFlexberryDropdownItems = $validationFlexberryDropdownMenu.children('.item');
        var $validationFlexberryDropdownItem = _ember['default'].$($validationFlexberryDropdownItems[0]);

        // Select item
        $validationFlexberryDropdownItem.click();
      });

      var $validationFlexberryTextboxs = _ember['default'].$('.flexberry-textbox');
      var $validationFlexberryTextbox1 = _ember['default'].$($validationFlexberryTextboxs[0]);
      var $validationFlexberryTextbox2 = _ember['default'].$($validationFlexberryTextboxs[1]);
      var $validationFlexberryOLVTextbox1 = _ember['default'].$($validationFlexberryTextboxs[2]);
      var $validationFlexberryOLVTextbox2 = _ember['default'].$($validationFlexberryTextboxs[3]);
      var $validationFlexberryTextarea = _ember['default'].$('.flexberry-textarea');

      var $validationFlexberryTextboxInner1 = $validationFlexberryTextbox1.children('input');
      var $validationFlexberryTextboxInner2 = $validationFlexberryTextbox2.children('input');
      var $validationFlexberryOLVTextboxInner1 = $validationFlexberryOLVTextbox1.children('input');
      var $validationFlexberryOLVTextboxInner2 = $validationFlexberryOLVTextbox2.children('input');
      var $validationFlexberryTextAreaInner = $validationFlexberryTextarea.children('textarea');

      // Insert text in textbox and textarea.
      _ember['default'].run(function () {
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

      var $validationFlexberryFileAddButton = _ember['default'].$('.add.outline');

      _ember['default'].run(function () {
        $validationFlexberryFileAddButton.click();
      });

      var done = assert.async();

      // Сounting the number of validationmessage.
      setTimeout(function () {
        var $validationLablesContainer = _ember['default'].$('.ember-view.ui.basic.label');
        var $validationMessage = true;

        for (var i = 0; i < 10; i++) {
          if ($validationLablesContainer[i].textContent.trim() !== '') {
            $validationMessage = false;
          }
        }

        var $validationSixteenWide = _ember['default'].$('.list');
        var $validationLi = $validationSixteenWide.children('li');

        // Сounting the number of validationmessage.
        assert.equal($validationLi.length, 0, 'All components have default value in sixteenWide');

        assert.ok($validationMessage, 'All components have correct value, All validationmessage disabled');
        done();
      }, 5000);
    });
  });
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-textarea-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check operation textarea', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = _ember['default'].$(_ember['default'].$('.field.error')[3]);
      var $validationFlexberryTextarea = _ember['default'].$('.flexberry-textarea');
      var $validationFlexberryTextboxInner = $validationFlexberryTextarea.children('textarea');
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Long text is required', 'Textarea have default value');

      // Insert text in textarea.
      _ember['default'].run(function () {
        $validationFlexberryTextboxInner.val('1');
        $validationFlexberryTextboxInner.change();
      });

      // Validationmessage must be empty.
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Textarea have default value');
    });
  });
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-textbox-letter-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check operation letter textbox', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = _ember['default'].$(_ember['default'].$('.field.error')[2]);
      var $validationFlexberryTextbox = $validationField.children('.flexberry-textbox');
      var $validationFlexberryTextboxInner = $validationFlexberryTextbox.children('input');
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Text is required,Text length must be >= 5', 'letter textbox have default value');

      // Insert text in textbox.
      _ember['default'].run(function () {
        $validationFlexberryTextboxInner[0].value = '1';
        $validationFlexberryTextboxInner.change();
      });

      // Check default validationmessage for text length <5 letter.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Text length must be >= 5', 'letter textbox have < 5 letter');

      // Insert text in textbox.
      _ember['default'].run(function () {
        $validationFlexberryTextboxInner[0].value = '12345';
        $validationFlexberryTextboxInner.change();
      });

      // Check default validationmessage for text length >5 letter.
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'letter textbox have >= 5 letter');
    });
  });
});
define('dummy/tests/acceptance/edit-form-validation-test/validation-textbox-numeric-test', ['exports', 'ember', 'dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (exports, _ember, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest) {

  (0, _dummyTestsAcceptanceEditFormValidationTestExecuteValidationTest.executeTest)('check operation numeric textbox', function (store, assert, app) {
    assert.expect(4);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationField = _ember['default'].$(_ember['default'].$('.field.error')[1]);
      var $validationFlexberryTextbox = $validationField.children('.flexberry-textbox');
      var $validationFlexberryTextboxInner = $validationFlexberryTextbox.children('input');
      var $validationFlexberryErrorLable = $validationField.children('.label');

      // Check default validationmessage text.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Number is required,Number is invalid', 'Numeric textbox have default value');

      // Insert text in textbox.
      _ember['default'].run(function () {
        $validationFlexberryTextboxInner[0].value = '2';
        $validationFlexberryTextboxInner.change();
      });

      // Check default validationmessage text for even numbers.
      assert.equal($validationFlexberryErrorLable.text().trim(), 'Number must be an odd', 'Numeric textbox have even value');

      // Insert text in textbox.
      _ember['default'].run(function () {
        $validationFlexberryTextboxInner[0].value = '1';
        $validationFlexberryTextboxInner.change();
      });

      // Check default validationmessage text for odd numbers.
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Numeric textbox have odd value');
    });
  });
});
define('dummy/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('dummy/tests/helpers/ember-i18n/test-helpers', ['exports', 'ember'], function (exports, _ember) {

  // example usage: find(`.header:contains(${t('welcome_message')})`)
  _ember['default'].Test.registerHelper('t', function (app, key, interpolations) {
    var i18n = app.__container__.lookup('service:i18n');
    return i18n.t(key, interpolations);
  });

  // example usage: expectTranslation('.header', 'welcome_message');
  _ember['default'].Test.registerHelper('expectTranslation', function (app, element, key, interpolations) {
    var text = app.testHelpers.t(key, interpolations);

    assertTranslation(element, key, text);
  });

  var assertTranslation = (function () {
    if (typeof QUnit !== 'undefined' && typeof ok === 'function') {
      return function (element, key, text) {
        ok(find(element + ':contains(' + text + ')').length, 'Found translation key ' + key + ' in ' + element);
      };
    } else if (typeof expect === 'function') {
      return function (element, key, text) {
        var found = !!find(element + ':contains(' + text + ')').length;
        expect(found).to.equal(true);
      };
    } else {
      return function () {
        throw new Error("ember-i18n could not find a compatible test framework");
      };
    }
  })();
});
define('dummy/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (exports, _qunit, _dummyTestsHelpersStartApp, _dummyTestsHelpersDestroyApp) {
  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _dummyTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        if (options.afterEach) {
          options.afterEach.apply(this, arguments);
        }

        (0, _dummyTestsHelpersDestroyApp['default'])(this.application);
      }
    });
  };
});
define('dummy/tests/helpers/resolver', ['exports', 'dummy/resolver', 'dummy/config/environment'], function (exports, _dummyResolver, _dummyConfigEnvironment) {

  var resolver = _dummyResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _dummyConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _dummyConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('dummy/tests/helpers/start-app', ['exports', 'ember', 'dummy/app', 'dummy/config/environment', 'ember-flexberry/test-support'], function (exports, _ember, _dummyApp, _dummyConfigEnvironment, _emberFlexberryTestSupport) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _dummyConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _dummyApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('dummy/tests/helpers/validate-properties', ['exports', 'ember', 'ember-qunit'], function (exports, _ember, _emberQunit) {
  exports.testValidPropertyValues = testValidPropertyValues;
  exports.testInvalidPropertyValues = testInvalidPropertyValues;

  var run = _ember['default'].run;

  function validateValues(object, propertyName, values, isTestForValid) {
    var promise = null;
    var validatedValues = [];

    values.forEach(function (value) {
      function handleValidation(errors) {
        var hasErrors = object.get('errors.' + propertyName + '.firstObject');
        if (hasErrors && !isTestForValid || !hasErrors && isTestForValid) {
          validatedValues.push(value);
        }
      }

      run(object, 'set', propertyName, value);

      var objectPromise = null;
      run(function () {
        objectPromise = object.validate().then(handleValidation, handleValidation);
      });

      // Since we are setting the values in a different run loop as we are validating them,
      // we need to chain the promises so that they run sequentially. The wrong value will
      // be validated if the promises execute concurrently
      promise = promise ? promise.then(objectPromise) : objectPromise;
    });

    return promise.then(function () {
      return validatedValues;
    });
  }

  function testPropertyValues(propertyName, values, isTestForValid, context) {
    var validOrInvalid = isTestForValid ? 'Valid' : 'Invalid';
    var testName = validOrInvalid + ' ' + propertyName;

    (0, _emberQunit.test)(testName, function (assert) {
      var object = this.subject();

      if (context && typeof context === 'function') {
        context(object);
      }

      // Use QUnit.dump.parse so null and undefined can be printed as literal 'null' and
      // 'undefined' strings in the assert message.
      var valuesString = QUnit.dump.parse(values).replace(/\n(\s+)?/g, '').replace(/,/g, ', ');
      var assertMessage = 'Expected ' + propertyName + ' to have ' + validOrInvalid.toLowerCase() + ' values: ' + valuesString;

      return validateValues(object, propertyName, values, isTestForValid).then(function (validatedValues) {
        assert.deepEqual(validatedValues, values, assertMessage);
      });
    });
  }

  function testValidPropertyValues(propertyName, values, context) {
    testPropertyValues(propertyName, values, true, context);
  }

  function testInvalidPropertyValues(propertyName, values, context) {
    testPropertyValues(propertyName, values, false, context);
  }
});
define('dummy/tests/integration/components/flexberry-checkbox-test', ['exports', 'ember', 'ember-qunit'], function (exports, _ember, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('flexberry-checkbox', 'Integration | Component | flexberry-checkbox', {
    integration: true
  });

  (0, _emberQunit.test)('Component renders properly', function (assert) {
    assert.expect(15);

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 50
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-checkbox', [], ['caption', ['subexpr', '@mut', [['get', 'caption', ['loc', [null, [1, 29], [1, 36]]]]], [], []], 'class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [1, 43], [1, 48]]]]], [], []]], ['loc', [null, [1, 0], [1, 50]]]]],
        locals: [],
        templates: []
      };
    })()));

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

    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });

    this.set('class', '');
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
  });

  (0, _emberQunit.test)('Component renders it\'s label properly', function (assert) {
    assert.expect(5);

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 34
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-checkbox', [], ['label', ['subexpr', '@mut', [['get', 'label', ['loc', [null, [1, 27], [1, 32]]]]], [], []]], ['loc', [null, [1, 0], [1, 34]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component, it's inner <label>.
    var $component = this.$().children();
    var $checkboxLabel = $component.children('label');

    // Check <label>'s text.
    assert.strictEqual($checkboxLabel.length === 1, true, 'Component has inner <label>');
    assert.strictEqual($checkboxLabel.hasClass('flexberry-checkbox-label'), true, 'Component\'s inner <label> has flexberry-checkbox-label css-class');
    assert.strictEqual(_ember['default'].$.trim($checkboxLabel.text()).length === 0, true, 'Component\'s inner <label> is empty by default');

    // Define some label & check <label>'s text again.
    var label = 'This is checkbox';
    this.set('label', label);
    assert.strictEqual(_ember['default'].$.trim($checkboxLabel.text()) === label, true, 'Component\'s inner <label> has text defined in component\'s \'label\' property: \'' + label + '\'');

    // Clean up defined label & check <label>'s text again.
    label = null;
    this.set('label', label);
    assert.strictEqual(_ember['default'].$.trim($checkboxLabel.text()).length === 0, true, 'Component\'s inner <label> is empty if component\'s \'label\' property is cleaned up');
  });

  (0, _emberQunit.test)('Changes in checkbox causes changes in binded value', function (assert) {
    var _this = this;

    assert.expect(9);

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 33
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-checkbox', [], ['value', ['subexpr', '@mut', [['get', 'flag', ['loc', [null, [1, 27], [1, 31]]]]], [], []]], ['loc', [null, [1, 0], [1, 33]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' before first click');
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before first click');
    assert.strictEqual(_ember['default'].typeOf(this.get('flag')), 'undefined', 'Component\'s binded value is \'undefined\' before first click');

    // Imitate click on component (change it's state to checked) & check it's state again.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into Ember.run.
    _ember['default'].run(function () {
      $component.click();
      assert.strictEqual($component.hasClass('checked'), true, 'Component has css-class \'checked\' after click');
      assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after click');
      assert.strictEqual(_this.get('flag'), true, 'Component\'s binded value is \'true\' after click');
    });

    // Imitate click on component again (change it's state to unchecked) & check it's state again.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into Ember.run.
    _ember['default'].run(function () {
      $component.click();
      assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' after second click');
      assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after second click');
      assert.strictEqual(_this.get('flag'), false, 'Component\'s binded value is \'false\' after second click');
    });
  });

  (0, _emberQunit.test)('Changes in in binded value causes changes in checkbox', function (assert) {
    assert.expect(7);

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 33
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-checkbox', [], ['value', ['subexpr', '@mut', [['get', 'flag', ['loc', [null, [1, 27], [1, 31]]]]], [], []]], ['loc', [null, [1, 0], [1, 33]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' by default');
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked by default');
    assert.strictEqual(_ember['default'].typeOf(this.get('flag')), 'undefined', 'Component\'s binded value is \'undefined\' by default');

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

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 70
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-checkbox', [], ['value', ['subexpr', '@mut', [['get', 'flag', ['loc', [null, [1, 27], [1, 31]]]]], [], []], 'onChange', ['subexpr', 'action', ['onCheckboxChange'], [], ['loc', [null, [1, 41], [1, 68]]]]], ['loc', [null, [1, 0], [1, 70]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();

    // Imitate click on component (change it's state to checked) & check action's event object.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into Ember.run.
    _ember['default'].run(function () {
      $component.click();
      assert.strictEqual(_ember['default'].get(onCheckboxChangeEventObject, 'checked'), true, 'Component sends \'onChange\' action with \'checked\' property equals to \'true\' after first click');
    });

    // Imitate click on component again (change it's state to unchecked) & check action's event object again.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into Ember.run.
    _ember['default'].run(function () {
      $component.click();
      assert.strictEqual(_ember['default'].get(onCheckboxChangeEventObject, 'checked'), false, 'Component sends \'onChange\' action with \'checked\' property equals to \'false\' after second click');
    });
  });

  (0, _emberQunit.test)('Component works properly in readonly mode', function (assert) {
    var _this2 = this;

    assert.expect(11);

    var onCheckboxChangeEventObject = null;
    this.set('actions.onCheckboxChange', function (e) {
      onCheckboxChangeEventObject = e;
    });

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 88
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-checkbox', [], ['readonly', ['subexpr', '@mut', [['get', 'readonly', ['loc', [null, [1, 30], [1, 38]]]]], [], []], 'value', ['subexpr', '@mut', [['get', 'flag', ['loc', [null, [1, 45], [1, 49]]]]], [], []], 'onChange', ['subexpr', 'action', ['onCheckboxChange'], [], ['loc', [null, [1, 59], [1, 86]]]]], ['loc', [null, [1, 0], [1, 88]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    assert.strictEqual($component.hasClass('read-only'), false, 'Component hasn\'t css-class \'read-only\' by default');

    // Enable readonly mode & check component's state again.
    this.set('readonly', true);
    assert.strictEqual($component.hasClass('read-only'), true, 'Component has css-class \'read-only\' when readonly mode is enabled');

    // Imitate click on component (try to change it's state to checked) & check it's state & action's event object.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into Ember.run.
    _ember['default'].run(function () {
      $component.click();
      assert.strictEqual(onCheckboxChangeEventObject, null, 'Component doesn\'t send \'onChange\' action in readonly mode');
      assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' after click in readonly mode');
      assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after click in readonly mode');
      assert.strictEqual(_ember['default'].typeOf(_this2.get('flag')), 'undefined', 'Component\'s binded value is still \'undefined\' after click in readonly mode');
    });

    // Disable readonly mode & check component's state again.
    this.set('readonly', false);
    assert.strictEqual($component.hasClass('read-only'), false, 'Component hasn\'t css-class \'read-only\' when readonly mode is disabled');

    // Imitate click on component (try to change it's state to checked) & check it's state & action's event object.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into Ember.run.
    _ember['default'].run(function () {
      $component.click();
      assert.strictEqual(_ember['default'].isNone(onCheckboxChangeEventObject), false, 'Component sends \'onChange\' action when readonly mode is disabled');
      assert.strictEqual($component.hasClass('checked'), true, 'Component has css-class \'checked\' after first click when readonly mode is disabled');
      assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after first click when readonly mode is disabled');
      assert.strictEqual(_this2.get('flag'), true, 'Component\'s binded value is equals to \'true\' after first click when readonly mode is disabled');
    });
  });

  (0, _emberQunit.test)('Setting up classes in checkbox', function (assert) {
    assert.expect(6);

    var checkClass = 'radio slider toggle';
    this.set('class', checkClass);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 45
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-checkbox', [], ['value', ['subexpr', '@mut', [['get', 'flag', ['loc', [null, [1, 27], [1, 31]]]]], [], []], 'class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [1, 38], [1, 43]]]]], [], []]], ['loc', [null, [1, 0], [1, 45]]]]],
        locals: [],
        templates: []
      };
    })()));

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
define('dummy/tests/integration/components/flexberry-datetime-picker-test', ['exports', 'ember', 'ember-qunit'], function (exports, _ember, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('flexberry-datepicker', 'Integration | Component | Flexberry datepicker', {
    integration: true,

    beforeEach: function beforeEach() {
      _ember['default'].Component.reopen({
        i18n: _ember['default'].inject.service('i18n')
      });
    }
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 24
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'flexberry-datepicker', ['loc', [null, [1, 0], [1, 24]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'flexberry-datepicker', [], [], 0, null, ['loc', [null, [2, 4], [4, 29]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    //Component does not support template block usage.
    assert.equal(this.$().text().trim(), '');
  });
});
define('dummy/tests/integration/components/flexberry-ddau-checkbox-test', ['exports', 'ember', 'ember-flexberry/components/flexberry-ddau-checkbox', 'ember-flexberry/mixins/flexberry-ddau-checkbox-actions-handler', 'ember-qunit'], function (exports, _ember, _emberFlexberryComponentsFlexberryDdauCheckbox, _emberFlexberryMixinsFlexberryDdauCheckboxActionsHandler, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('flexberry-ddau-checkbox', 'Integration | Component | flexberry-ddau-checkbox', {
    integration: true
  });

  (0, _emberQunit.test)('Component renders properly', function (assert) {
    assert.expect(17);

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 55
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-ddau-checkbox', [], ['caption', ['subexpr', '@mut', [['get', 'caption', ['loc', [null, [1, 34], [1, 41]]]]], [], []], 'class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [1, 48], [1, 53]]]]], [], []]], ['loc', [null, [1, 0], [1, 55]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component, it's inner <input> & <label>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');
    var $checkboxCaption = $component.children('label');

    var flexberryClassNames = _emberFlexberryComponentsFlexberryDdauCheckbox['default'].flexberryClassNames;

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
    assert.strictEqual(_ember['default'].$.trim($checkboxCaption.text()).length === 0, true, 'Component\'s inner <label> is empty by default');

    var checkboxCaptionText = 'Checkbox caption';
    this.set('caption', checkboxCaptionText);
    assert.strictEqual(_ember['default'].$.trim($checkboxCaption.text()), checkboxCaptionText, 'Component\'s inner <label> text changes when component\'s \'caption\' property changes');

    // Check wrapper's additional CSS-classes.
    var additioanlCssClasses = 'additional-css-class-name and-another-one';
    this.set('class', additioanlCssClasses);

    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });

    this.set('class', '');
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 58
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-ddau-checkbox', [], ['change', ['subexpr', 'action', ['onFlagChange'], [], ['loc', [null, [1, 33], [1, 56]]]]], ['loc', [null, [1, 0], [1, 58]]]]],
        locals: [],
        templates: []
      };
    })()));

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

  (0, _emberQunit.test)('Component doesn\'t change binded value (without \'change\' action handler)', function (assert) {
    // Mock Ember.assert method.
    var thrownExceptions = _ember['default'].A();
    var originalEmberAssert = _ember['default'].assert;
    _ember['default'].assert = function () {
      try {
        originalEmberAssert.apply(undefined, arguments);
      } catch (ex) {
        thrownExceptions.pushObject(ex);
      }
    };

    assert.expect(4);

    this.set('flag', false);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 38
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-ddau-checkbox', [], ['value', ['subexpr', '@mut', [['get', 'flag', ['loc', [null, [1, 32], [1, 36]]]]], [], []]], ['loc', [null, [1, 0], [1, 38]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component & it's inner <input>.
    var $component = this.$().children();
    var $checkboxInput = $component.children('input');

    // Check component's initial state.
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before click');

    // Imitate click on component & check for exception.
    $component.click();

    // Check component's state after click (it should be changed).
    assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> isn\'t checked after click (without \'change\' action handler)');

    // Check binded value state after click (it should be unchanged, because 'change' action handler is not defined).
    assert.strictEqual(this.get('flag'), false, 'Component doesn\'t change binded value (without \'change\' action handler)');

    assert.strictEqual(thrownExceptions.length === 1 && /.*required.*change.*action.*not.*defined.*/gi.test(thrownExceptions[0].message), true, 'Component throws single exception if \'change\' action handler is not defined');

    // Clean up after mock Ember.assert.
    _ember['default'].assert = originalEmberAssert;
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

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 69
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-ddau-checkbox', [], ['value', ['subexpr', '@mut', [['get', 'flag', ['loc', [null, [1, 32], [1, 36]]]]], [], []], 'change', ['subexpr', 'action', ['onFlagChange'], [], ['loc', [null, [1, 44], [1, 67]]]]], ['loc', [null, [1, 0], [1, 69]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    this.set('actions.onCheckboxChange', _emberFlexberryMixinsFlexberryDdauCheckboxActionsHandler['default'].mixins[0].properties.actions.onCheckboxChange);

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 80
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-ddau-checkbox', [], ['value', ['subexpr', '@mut', [['get', 'flag', ['loc', [null, [1, 32], [1, 36]]]]], [], []], 'change', ['subexpr', 'action', ['onCheckboxChange', 'flag'], [], ['loc', [null, [1, 44], [1, 78]]]]], ['loc', [null, [1, 0], [1, 80]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 87
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-ddau-checkbox', [], ['value', ['subexpr', '@mut', [['get', 'flag', ['loc', [null, [1, 32], [1, 36]]]]], [], []], 'readonly', ['subexpr', '@mut', [['get', 'readonly', ['loc', [null, [1, 46], [1, 54]]]]], [], []], 'change', ['subexpr', 'action', ['onFlagChange'], [], ['loc', [null, [1, 62], [1, 85]]]]], ['loc', [null, [1, 0], [1, 87]]]]],
        locals: [],
        templates: []
      };
    })()));

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
define('dummy/tests/integration/components/flexberry-dropdown-test', ['exports', 'ember', 'ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit'], function (exports, _ember, _emberI18nServicesI18n, _emberFlexberryLocalesRuTranslations, _emberFlexberryLocalesEnTranslations, _emberQunit) {

  var animationDuration = _ember['default'].$.fn.dropdown.settings.duration + 100;

  (0, _emberQunit.moduleForComponent)('flexberry-dropdown', 'Integration | Component | flexberry dropdown', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _emberFlexberryLocalesRuTranslations['default']);
      this.register('locale:en/translations', _emberFlexberryLocalesEnTranslations['default']);
      this.register('service:i18n', _emberI18nServicesI18n['default']);

      this.inject.service('i18n', { as: 'i18n' });
      _ember['default'].Component.reopen({
        i18n: _ember['default'].inject.service('i18n')
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

    var callbacks = _ember['default'].A(options.callbacks || []);

    return new _ember['default'].RSVP.Promise(function (resolve, reject) {

      // Click on component to trigger expand animation.
      _ember['default'].run(function () {
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
    var callbacks = _ember['default'].A(options.callbacks || []);

    return new _ember['default'].RSVP.Promise(function (resolve, reject) {

      // To select some item, menu must be expanded.
      if (!($component.hasClass('active') && $component.hasClass('visible') && $menu.hasClass('visible'))) {
        reject(new Error('flexberry-dropdown\'s menu isn\'t expanded'));
      }

      // To select some item, menu must contain such item (with the specified caption).
      var $item = $('.item:contains(' + itemCaption + ')', $menu);
      if ($item.length === 0) {
        reject(new Error('flexberry-dropdown\'s menu doesn\'t contain item with caption \'' + itemCaption + '\''));
      }

      // Click on item to select it & trigger collapse animation.
      _ember['default'].run(function () {
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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-dropdown', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });

    // Clean up wrapper's additional CSS-classes.
    this.set('class', '');
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
  });

  (0, _emberQunit.test)('it renders i18n-ed placeholder', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 22
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'flexberry-dropdown', ['loc', [null, [1, 0], [1, 22]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownText = $component.children('div.default.text');

    // Check <dropdown>'s placeholder.
    assert.strictEqual(_ember['default'].$.trim($dropdownText.text()), _ember['default'].get(_emberFlexberryLocalesRuTranslations['default'], 'components.flexberry-dropdown.placeholder'), 'Component\'s inner <dropdown>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

    // Change current locale to 'en' & check <dropdown>'s placeholder again.
    this.set('i18n.locale', 'en');
    assert.strictEqual(_ember['default'].$.trim($dropdownText.text()), _ember['default'].get(_emberFlexberryLocalesEnTranslations['default'], 'components.flexberry-dropdown.placeholder'), 'Component\'s inner <dropdown>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
  });

  (0, _emberQunit.test)('it renders manually defined placeholder', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-dropdown', [], ['placeholder', ['subexpr', '@mut', [['get', 'placeholder', ['loc', [null, [2, 16], [2, 27]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Set <dropdown>'s placeholder' & render component.
    var placeholder = 'please type some text';
    this.set('placeholder', placeholder);

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownText = $component.children('div.default.text');

    // Check <dropdown>'s placeholder.
    assert.strictEqual(_ember['default'].$.trim($dropdownText.text()), placeholder);

    // Change placeholder's value & check <dropdown>'s placeholder again.
    placeholder = 'dropdown has no value';
    this.set('placeholder', placeholder);
    assert.strictEqual(_ember['default'].$.trim($dropdownText.text()), placeholder);
  });

  (0, _emberQunit.test)('readonly mode works properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-dropdown', [], ['readonly', true], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownMenu = $component.children('div.menu');

    // Activate readonly mode & check that readonly (disabled) attribute exists now & has value equals to 'readonly'.
    assert.strictEqual($component.hasClass('disabled'), true, 'Component\'s has readonly');

    // Check that component is disabled.
    new _ember['default'].RSVP.Promise(function (resolve, reject) {
      _ember['default'].run(function () {
        $component.click();
      });

      _ember['default'].run(function () {
        var animation = assert.async();
        setTimeout(function () {
          assert.strictEqual($dropdownMenu.hasClass('animating'), false, 'Component is not active');

          animation();
        }, animationDuration / 2);
      });
    });
  });

  (0, _emberQunit.test)('needChecksOnValue mode properly', function (assert) {
    assert.expect(2);

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-dropdown', [], ['value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'items', ['subexpr', '@mut', [['get', 'itemsArray', ['loc', [null, [3, 10], [3, 20]]]]], [], []], 'needChecksOnValue', ['subexpr', '@mut', [['get', 'needChecksOnValue', ['loc', [null, [4, 22], [4, 39]]]]], [], []]], ['loc', [null, [1, 0], [5, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Stub Ember.onerror method.
    var originalOnError = _ember['default'].onerror;

    // Change property binded to 'value' & check them.
    this.set('needChecksOnValue', true);
    var newValue = 'Caption4';
    var latestLoggerErrorMessage = undefined;
    _ember['default'].onerror = function (error) {
      latestLoggerErrorMessage = error.message;
    };

    // Check that errors handled properly.
    this.set('value', newValue);
    assert.strictEqual(_ember['default'].typeOf(latestLoggerErrorMessage) === 'string', true, 'Check message exists');
    assert.strictEqual(latestLoggerErrorMessage.indexOf(newValue) > 0, true, 'Invalid value exists');

    // Restore original method in the and of the test.
    _ember['default'].onerror = originalOnError;
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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-dropdown', [], ['items', ['subexpr', '@mut', [['get', 'itemsObject', ['loc', [null, [2, 10], [2, 21]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownMenu = $component.children('div.menu');
    var $dropdownItem = $dropdownMenu.children('div.item');

    // Check component's captions and objects.
    var itemsObjectKeys = Object.keys(itemsObject);
    $dropdownItem.each(function (i) {
      var $item = _ember['default'].$(this);
      var itemKey = itemsObjectKeys[i];
      var itemCaption = itemsObject[itemKey];

      // Check that the captions matches the objects.
      assert.strictEqual($item.attr('data-value'), itemCaption, 'Component\'s item\'s сaptions matches the objects');
    });
  });

  (0, _emberQunit.test)('dropdown with items represented by array renders properly', function (assert) {
    assert.expect(3);

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-dropdown', [], ['items', ['subexpr', '@mut', [['get', 'itemsArray', ['loc', [null, [2, 10], [2, 20]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $dropdownMenu = $component.children('div.menu');
    var $dropdownItem = $dropdownMenu.children('div.item');

    // Check component's captions and array.
    $dropdownItem.each(function (i) {
      var $item = _ember['default'].$(this);
      var itemCaption = itemsArray[i];

      // Check that the captions matches the array.
      assert.strictEqual($item.attr('data-value'), itemCaption, 'Component\'s item\'s сaptions matches the array');
    });
  });

  (0, _emberQunit.test)('expand animation works properly', function (assert) {
    assert.expect(9);

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-dropdown', [], ['items', ['subexpr', '@mut', [['get', 'itemsArray', ['loc', [null, [2, 10], [2, 20]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    })['catch'](function (e) {
      throw e;
    })['finally'](function () {
      asyncAnimationsCompleted();
    });
  });

  (0, _emberQunit.test)('collapse animation works properly', function (assert) {
    assert.expect(9);

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-dropdown', [], ['items', ['subexpr', '@mut', [['get', 'itemsArray', ['loc', [null, [2, 10], [2, 20]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    })['catch'](function (e) {
      throw e;
    })['finally'](function () {
      asyncAnimationsCompleted();
    });
  });

  (0, _emberQunit.test)('changes in inner <dropdown> causes changes in property binded to \'value\'', function (assert) {
    var _this = this;

    assert.expect(5);

    // Create array for testing.
    var itemsArray = ['Caption1', 'Caption2', 'Caption3'];
    this.set('itemsArray', itemsArray);
    this.set('value', null);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-dropdown', [], ['items', ['subexpr', '@mut', [['get', 'itemsArray', ['loc', [null, [2, 10], [2, 20]]]]], [], []], 'value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [3, 10], [3, 15]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
      var $selectedItem = _ember['default'].$($selectedItems[0]);
      var $dropdownText = $component.children('div.text');

      // Check that specified item is selected now & it is the only one selected item.
      assert.strictEqual($selectedItems.length, 1, 'Only one component\'s item is active');
      assert.strictEqual(_ember['default'].$.trim($selectedItem.text()), itemCaption, 'Selected item\'s caption is \'' + itemCaption + '\'');

      // Check that dropdown's text <div> has text equals to selected item's caption.
      assert.strictEqual($dropdownText.hasClass('default'), false, 'Component\'s text <div> hasn\'t class \'default\'');
      assert.strictEqual(_ember['default'].$.trim($dropdownText.text()), itemCaption, 'Component\'s text <div> has content equals to selected item \'' + itemCaption + '\'');

      // Check that related model's value binded to dropdown is equals to selected item's caption.
      assert.strictEqual(_this.get('value'), itemCaption, 'Related model\'s value binded to dropdown is \'' + itemCaption + '\'');
    })['catch'](function (e) {
      throw e;
    })['finally'](function () {
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
    var onChangeArgument = undefined;
    this.set('actions.onDropdownChange', function (e) {
      onChangeHasBeenCalled = true;
      onChangeArgument = e;
    });

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-dropdown', [], ['value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'items', ['subexpr', '@mut', [['get', 'itemsArray', ['loc', [null, [3, 10], [3, 20]]]]], [], []], 'onChange', ['subexpr', 'action', ['onDropdownChange'], [], ['loc', [null, [4, 15], [4, 42]]]]], ['loc', [null, [1, 0], [5, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    })['catch'](function (e) {
      throw e;
    })['finally'](function () {
      asyncAnimationsCompleted();
    });
  });
});
define('dummy/tests/integration/components/flexberry-error-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('flexberry-error', 'Integration | Component | flexberry error', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 31
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-error', [], ['error', ['subexpr', '@mut', [['get', 'error', ['loc', [null, [1, 24], [1, 29]]]]], [], []]], ['loc', [null, [1, 0], [1, 31]]]]],
        locals: [],
        templates: []
      };
    })()));
    this.set('error', new Error('Error, error, error...'));
    assert.ok(/Error, error, error.../.test(this.$().text()));
  });
});
define('dummy/tests/integration/components/flexberry-field-test', ['exports', 'ember', 'ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit'], function (exports, _ember, _emberI18nServicesI18n, _emberFlexberryLocalesRuTranslations, _emberFlexberryLocalesEnTranslations, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('flexberry-field', 'Integration | Component | flexberry field', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _emberFlexberryLocalesRuTranslations['default']);
      this.register('locale:en/translations', _emberFlexberryLocalesEnTranslations['default']);
      this.register('service:i18n', _emberI18nServicesI18n['default']);

      this.inject.service('i18n', { as: 'i18n' });
      _ember['default'].Component.reopen({
        i18n: _ember['default'].inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    }
  });

  (0, _emberQunit.test)('it renders properly', function (assert) {
    assert.expect(13);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });

    // Clean up wrapper's additional CSS-classes.
    this.set('class', '');
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
  });

  (0, _emberQunit.test)('label mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'label', ['subexpr', '@mut', [['get', 'label', ['loc', [null, [3, 10], [3, 15]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'readonly', ['subexpr', '@mut', [['get', 'readonly', ['loc', [null, [3, 13], [3, 21]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);

    // Check that <input>'s readonly attribute doesn't exist yet.
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('readonly')), '', 'Component\'s inner <input> hasn\'t readonly attribute by default');

    // Activate readonly mode & check that <input>'s readonly attribute exists now & has value equals to 'readonly'.
    this.set('readonly', true);

    $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('readonly')), 'readonly', 'Component\'s inner <input> has readonly attribute with value equals to \'readonly\'');

    // Check that <input>'s readonly attribute doesn't exist now.
    this.set('readonly', false);

    $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('readonly')), '', 'Component\'s inner <input> hasn\'t readonly attribute');
  });

  (0, _emberQunit.test)('readonly mode works properly with value', function (assert) {
    var _this = this;

    assert.expect(2);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.set('readonly', true);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['readonly', ['subexpr', '@mut', [['get', 'readonly', ['loc', [null, [2, 13], [2, 21]]]]], [], []], 'value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [3, 10], [3, 15]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);

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
    assert.strictEqual(_ember['default'].$.trim($fieldInput.val()), '', 'Component\'s inner <input>\'s value not changed');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to unchanged \'value\'');
  });

  (0, _emberQunit.test)('click on field in readonly mode doesn\'t change value & it\'s type', function (assert) {
    assert.expect(3);

    // Set <input>'s value' & render component.
    var value = 123;
    this.set('value', value);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['readonly', true, 'value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [3, 10], [3, 15]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);

    $fieldInput.click();
    $fieldInput.change();

    // Check <input>'s value not changed.
    assert.strictEqual(_ember['default'].$.trim($fieldInput.val()), '' + value, 'Component\'s inner <input>\'s value not changed');
    assert.strictEqual(this.get('value'), value, 'Value binded to component\'s \'value\' property is unchanged');
    assert.strictEqual(_ember['default'].typeOf(this.get('value')), 'number', 'Value binded to component\'s \'value\' property is still number');
  });

  (0, _emberQunit.test)('it renders i18n-ed placeholder', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 19
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'flexberry-field', ['loc', [null, [1, 0], [1, 19]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);

    // Check <input>'s placeholder.
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('placeholder')), _ember['default'].get(_emberFlexberryLocalesRuTranslations['default'], 'components.flexberry-field.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

    // Change current locale to 'en' & check <input>'s placeholder again.
    this.set('i18n.locale', 'en');
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('placeholder')), _ember['default'].get(_emberFlexberryLocalesEnTranslations['default'], 'components.flexberry-field.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
  });

  (0, _emberQunit.test)('it renders manually defined placeholder', function (assert) {
    assert.expect(2);

    // Set <input>'s placeholder' & render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['placeholder', ['subexpr', '@mut', [['get', 'placeholder', ['loc', [null, [2, 16], [2, 27]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);

    var placeholder = 'input is empty, please type some text';
    this.set('placeholder', placeholder);

    // Check <input>'s placeholder.
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

    // Change placeholder's value & check <input>'s placeholder again.
    placeholder = 'input has no value';
    this.set('placeholder', placeholder);
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');
  });

  (0, _emberQunit.test)('type mode works properly', function (assert) {
    assert.expect(7);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'type', ['subexpr', '@mut', [['get', 'type', ['loc', [null, [3, 9], [3, 13]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);

    // Check that <input>'s type attribute doesn't exist yet.
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('type')), '', 'Component\'s inner <input> hasn\'t type attribute');

    // Check that <input>'s type attribute 'text'.
    this.set('type', 'text');
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('type')), 'text', 'Component\'s inner <input> type attribute \'text\'');

    // Check that <input>'s type attribute 'number'.
    this.set('type', 'number');
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('type')), 'number', 'Component\'s inner <input> type attribute \'number\'');

    // Check that <input>'s type attribute 'password'.
    this.set('type', 'password');
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('type')), 'password', 'Component\'s inner <input> type attribute \'password\'');

    // Check that <input>'s type attribute 'color'.
    this.set('type', 'color');
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('type')), 'color', 'Component\'s inner <input> type attribute \'color\'');

    // Check that <input>'s type attribute 'button'.
    this.set('type', 'button');
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('type')), 'button', 'Component\'s inner <input> type attribute \'button\'');

    // Check that <input>'s type attribute 'hidden'.
    this.set('type', 'hidden');
    assert.strictEqual(_ember['default'].$.trim($fieldInput.attr('type')), 'hidden', 'Component\'s inner <input> type attribute \'hidden\'');
  });

  (0, _emberQunit.test)('changes in inner <input> causes changes in property binded to \'value\'', function (assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(_ember['default'].$.trim($fieldInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change <input>'s value (imitate situation when user typed something into component's <input>)
    // & check them again ('change' event is needed to force bindings work).
    var newValue = 'Some text typed into field\'s inner input';
    $fieldInput.val(newValue);
    $fieldInput.change();

    assert.strictEqual(_ember['default'].$.trim($fieldInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });

  (0, _emberQunit.test)('attribute maxlength rendered in html', function (assert) {
    assert.expect(1);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['maxlength', 5], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);

    // Check <input>'s maxlength attribute.
    assert.strictEqual($fieldInput.attr('maxlength'), '5', 'Component\'s inner <input>\'s attribute maxlength rendered');
  });

  (0, _emberQunit.test)('changes in property binded to \'value\' causes changes in inner <input>', function (assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(_ember['default'].$.trim($fieldInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change property binded to 'value' & check them again.
    var newValue = 'Some text typed into field\'s inner input';
    this.set('value', newValue);

    assert.strictEqual(_ember['default'].$.trim($fieldInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });
});
define('dummy/tests/integration/components/flexberry-groupedit-test', ['exports', 'ember', 'ember-qunit', 'dummy/tests/helpers/start-app', 'ember-flexberry/services/user-settings', 'dummy/models/components-examples/flexberry-groupedit/shared/aggregator', 'dummy/models/ember-flexberry-dummy-suggestion', 'ember-flexberry/components/flexberry-base-component'], function (exports, _ember, _emberQunit, _dummyTestsHelpersStartApp, _emberFlexberryServicesUserSettings, _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator, _dummyModelsEmberFlexberryDummySuggestion, _emberFlexberryComponentsFlexberryBaseComponent) {

  var App = undefined;

  (0, _emberQunit.moduleForComponent)('flexberry-groupedit', 'Integration | Component | Flexberry groupedit', {
    integration: true,

    beforeEach: function beforeEach() {
      App = (0, _dummyTestsHelpersStartApp['default'])();
      _ember['default'].Component.reopen({
        i18n: _ember['default'].inject.service('i18n'),
        userSettingsService: _ember['default'].inject.service('user-settings')
      });

      _emberFlexberryServicesUserSettings['default'].reopen({
        isUserSettingsServiceEnabled: false
      });
    },

    afterEach: function afterEach() {
      // Restore base component's reference to current controller to its initial state.
      _emberFlexberryComponentsFlexberryBaseComponent['default'].prototype.currentController = null;

      _ember['default'].run(App, 'destroy');
    }
  });

  (0, _emberQunit.test)('ember-grupedit element by default test', function (assert) {
    var _this = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this.set('model', model);
      _this.set('componentName', testComponentName);
      _this.set('searchForContentChange', true);
      _this.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 7,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []]], ['loc', [null, [2, 8], [7, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      // Add record.
      var $component = _this.$().children();
      var $componentGroupEditToolbar = $component.children('.groupedit-toolbar');
      var $componentButtons = $componentGroupEditToolbar.children('.ui.button');
      var $componentButtonAdd = $($componentButtons[0]);

      _ember['default'].run(function () {
        $componentButtonAdd.click();
      });

      wait().then(function () {
        var $componentObjectListViewFirstCellAsterisk = _ember['default'].$('.asterisk', $component);

        // Check object-list-view <i>.
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.length === 1, true, 'Component has inner object-list-view-operations blocks');
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('asterisk'), true, 'Component\'s inner object-list-view has \'asterisk\' css-class');
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('small'), true, 'Component\'s inner object-list-view has \'small\' css-class');
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('red'), true, 'Component\'s inner oobject-list-view has \'red\' css-class');
        assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

        var $componentObjectListViewFirstCell = _ember['default'].$('.object-list-view-helper-column', $component);
        var $flexberryCheckbox = _ember['default'].$('.flexberry-checkbox', $componentObjectListViewFirstCell);

        assert.ok($flexberryCheckbox, 'Component has flexberry-checkbox in first cell blocks');

        var $minusButton = _ember['default'].$('.minus', $componentObjectListViewFirstCell);

        assert.strictEqual($minusButton.length === 0, true, 'Component hasn\'t delete button in first cell');

        var $editMenuButton = _ember['default'].$('.button.right', $component);

        assert.strictEqual($editMenuButton.length === 0, true, 'Component hasn\'t edit menu in last cell');
      });
    });
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    var _this2 = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');

      _this2.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this2.set('model', model);
      _this2.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 96
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['modelProjection', ['subexpr', '@mut', [['get', 'proj', ['loc', [null, [1, 38], [1, 42]]]]], [], []], 'content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [1, 51], [1, 64]]]]], [], []], 'componentName', 'my-group-edit'], ['loc', [null, [1, 0], [1, 96]]]]],
          locals: [],
          templates: []
        };
      })()));
      assert.ok(true);
    });
  });

  (0, _emberQunit.test)('it properly rerenders', function (assert) {
    var _this3 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this3.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this3.set('model', model);
      _this3.set('componentName', testComponentName);
      _this3.set('searchForContentChange', true);
      _this3.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 7,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []]], ['loc', [null, [2, 8], [7, 10]]]]],
          locals: [],
          templates: []
        };
      })()));
      assert.equal(_this3.$('.object-list-view').find('tr').length, 2);

      // Add record.
      var detailModel = _this3.get('model.details');
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '1' }));
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '2' }));

      wait().then(function () {
        assert.equal(_this3.$('.object-list-view').find('tr').length, 3);

        // Add record.
        detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '3' }));
        wait().then(function () {
          assert.equal(_this3.$('.object-list-view').find('tr').length, 4);

          // Delete record.
          _this3.get('model.details').get('firstObject').deleteRecord();
          wait().then(function () {
            assert.equal(_this3.$('.object-list-view').find('tr').length, 3);

            // Disable search for changes flag and add record.
            _this3.set('searchForContentChange', false);
            detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '4' }));
            wait().then(function () {
              assert.equal(_this3.$('.object-list-view').find('tr').length, 3);
            });
          });
        });
      });
    });
  });

  (0, _emberQunit.test)('it properly rerenders', function (assert) {
    var _this4 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this4.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this4.set('model', model);
      _this4.set('componentName', testComponentName);
      _this4.set('searchForContentChange', true);
      _this4.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 7,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []]], ['loc', [null, [2, 8], [7, 10]]]]],
          locals: [],
          templates: []
        };
      })()));
      assert.equal(_this4.$('.object-list-view').find('tr').length, 2);

      // Add record.
      var detailModel = _this4.get('model.details');
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail'));
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail'));

      wait().then(function () {
        assert.equal(_this4.$('.object-list-view').find('tr').length, 3);

        var $component = _this4.$().children();
        var $componentGroupEditToolbar = $component.children('.groupedit-toolbar');
        var $componentButtons = $componentGroupEditToolbar.children('.ui.button');
        var $componentButtonAdd = $($componentButtons[0]);

        _ember['default'].run(function () {
          $componentButtonAdd.click();
        });

        wait().then(function () {
          assert.equal(_this4.$('.object-list-view').find('tr').length, 4, 'details add properly');

          var $componentCheckBoxs = _ember['default'].$('.flexberry-checkbox', $component);
          var $componentFirstCheckBox = $($componentCheckBoxs[0]);
          var $componentFirstCheckBoxInput = $componentFirstCheckBox.children('.flexberry-checkbox-input');

          _ember['default'].run(function () {
            $componentFirstCheckBox.click();
            $componentFirstCheckBoxInput.click();
          });

          wait().then(function () {
            var $componentButtonRemove = $($componentButtons[1]);

            _ember['default'].run(function () {
              $componentButtonRemove.click();
            });

            assert.equal(_this4.$('.object-list-view').find('tr').length, 3, 'details remove properly');
          });
        });
      });
    });
  });

  (0, _emberQunit.test)('it properly rerenders by default', function (assert) {
    var _this5 = this;

    assert.expect(72);

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this5.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this5.set('model', model);
      _this5.set('componentName', testComponentName);
      _this5.set('searchForContentChange', true);
      _this5.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 7,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []]], ['loc', [null, [2, 8], [7, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      assert.equal(_this5.$('.object-list-view').find('tr').length, 2);

      var $detailsAtributes = _this5.get('proj.attributes.details.attributes');
      var $detailsAtributesArray = Object.keys($detailsAtributes);

      var $component = _this5.$().children();
      var $componentGroupEditToolbar = $component.children('.groupedit-toolbar');

      // Check groupedit-toolbar <div>.
      assert.strictEqual($componentGroupEditToolbar.length === 1, true, 'Component has inner groupedit-toolbar block');
      assert.strictEqual($componentGroupEditToolbar.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
      assert.strictEqual($componentGroupEditToolbar.hasClass('ember-view'), true, 'Component\'s inner groupedit-toolbar block has \'ember-view\' css-class');
      assert.strictEqual($componentGroupEditToolbar.hasClass('groupedit-toolbar'), true, 'Component inner has \'groupedit-toolbar\' css-class');

      var $componentButtons = $componentGroupEditToolbar.children('.ui.button');

      // Check button count.
      assert.strictEqual($componentButtons.length === 3, true, 'Component has inner two button blocks');

      var $componentButtonAdd = $($componentButtons[0]);

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

      var $componentButtonRemove = $($componentButtons[1]);

      // Check buttonRemove <button>.
      assert.strictEqual($componentButtonRemove.length === 1, true, 'Component has inner button block');
      assert.strictEqual($componentButtonRemove.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
      assert.strictEqual($componentButtonRemove.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
      assert.strictEqual($componentButtonRemove.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');
      assert.strictEqual($componentButtonRemove.hasClass('disabled'), true, 'Component\'s inner groupedit block has \'disabled\' css-class');

      var $componentButtonDefauldSetting = $($componentButtons[2]);

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

      var $componentJCLRgripFirst = $($componentJCLRgrip[0]);

      // Check first JCLRgrip <div>.
      assert.strictEqual($componentJCLRgripFirst.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
      assert.strictEqual($componentJCLRgripFirst.hasClass('JCLRgrip'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');

      var $componentJCLRgripLast = $($componentJCLRgrip[6]);

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
      assert.strictEqual($componentObjectListView.hasClass('striped'), true, 'Component\'s inner object-list-view block has \'striped\' css-class');
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

      var $componentObjectListViewTh = $($componentObjectListViewThs[0]);

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
    var _this6 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this6.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this6.set('model', model);
      _this6.set('componentName', testComponentName);

      var tempText = 'Temp text.';

      _this6.set('placeholder', tempText);
      _this6.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 7,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'placeholder', ['subexpr', '@mut', [['get', 'placeholder', ['loc', [null, [6, 22], [6, 33]]]]], [], []]], ['loc', [null, [2, 8], [7, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $componentObjectListView = _ember['default'].$('.object-list-view');
      var $componentObjectListViewBody = $componentObjectListView.children('tbody');

      assert.strictEqual($componentObjectListViewBody.text().trim(), tempText, 'Component has placeholder: ' + tempText);
    });
  });

  (0, _emberQunit.test)('ember-grupedit striped test', function (assert) {
    var _this7 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this7.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this7.set('model', model);
      _this7.set('componentName', testComponentName);
      _this7.set('searchForContentChange', true);
      _this7.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 8,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []], 'tableStriped', false], ['loc', [null, [2, 8], [8, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $componentObjectListView = _ember['default'].$('.object-list-view');

      // Check object-list-view <div>.
      assert.strictEqual($componentObjectListView.hasClass('striped'), false, 'Component\'s inner object-list-view block has \'striped\' css-class');
    });
  });

  (0, _emberQunit.test)('ember-grupedit off defaultSettingsButton, createNewButton and deleteButton test', function (assert) {
    var _this8 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this8.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this8.set('model', model);
      _this8.set('componentName', testComponentName);
      _this8.set('searchForContentChange', true);
      _this8.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 12,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []], 'createNewButton', false, 'deleteButton', false, 'showCheckBoxInRow', false, 'showAsteriskInRow', false, 'defaultSettingsButton', false], ['loc', [null, [2, 8], [12, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $component = _this8.$().children();
      var $componentButtons = _ember['default'].$('.ui.button', $component);

      assert.strictEqual($componentButtons.length === 0, true, 'Component hasn\'t inner two button blocks');
    });
  });

  (0, _emberQunit.test)('ember-grupedit allowColumnResize test', function (assert) {
    var _this9 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this9.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this9.set('model', model);
      _this9.set('componentName', testComponentName);
      _this9.set('searchForContentChange', true);
      _this9.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 9,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []], 'showEditMenuItemInRow', true, 'allowColumnResize', false], ['loc', [null, [2, 8], [9, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $componentJCLRgrips = $(_ember['default'].$('.JCLRgrips')[0]);

      // Check JCLRgrips <div>.
      assert.strictEqual($componentJCLRgrips.length === 0, true, 'Component hasn\'t inner JCLRgrips blocks');

      var $componentObjectListView = $(_ember['default'].$('.object-list-view')[0]);

      // Check object-list-view <div>.
      assert.strictEqual($componentObjectListView.hasClass('JColResizer'), false, 'Component\'s inner object-list-view block hasn\'t \'JColResizer\' css-class');
    });
  });

  (0, _emberQunit.test)('ember-grupedit showAsteriskInRow test', function (assert) {
    var _this10 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this10.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this10.set('model', model);
      _this10.set('componentName', testComponentName);
      _this10.set('searchForContentChange', true);
      _this10.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 8,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []], 'showAsteriskInRow', false], ['loc', [null, [2, 8], [8, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      // Add record.
      var $componentButtonAdd = $(_ember['default'].$('.ui.button')[0]);

      _ember['default'].run(function () {
        $componentButtonAdd.click();
      });

      wait().then(function () {
        var $componentObjectListViewFirstCell = _ember['default'].$('.asterisk');

        // Check object-list-view <i>.
        assert.strictEqual($componentObjectListViewFirstCell.length === 0, true, 'Component has small red asterisk blocks');
      });
    });
  });

  (0, _emberQunit.test)('ember-grupedit showCheckBoxInRow test', function (assert) {
    var _this11 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this11.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this11.set('model', model);
      _this11.set('componentName', testComponentName);
      _this11.set('searchForContentChange', true);
      _this11.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 8,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []], 'showCheckBoxInRow', false], ['loc', [null, [2, 8], [8, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      // Add record.
      var $componentButtonAdd = $(_ember['default'].$('.ui.button')[0]);

      _ember['default'].run(function () {
        $componentButtonAdd.click();
      });

      wait().then(function () {
        var $flexberryCheckbox = _ember['default'].$('.flexberry-checkbox');

        assert.ok($flexberryCheckbox, false, 'Component hasn\'t flexberry-checkbox in first cell');

        var $componentObjectListViewEditMenu = _ember['default'].$('.button.right.pointing');

        assert.strictEqual($componentObjectListViewEditMenu.length === 0, true, 'Component hasn\'t edit menu in last cell');
      });
    });
  });

  (0, _emberQunit.test)('ember-grupedit showDeleteButtonInRow test', function (assert) {
    var _this12 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this12.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this12.set('model', model);
      _this12.set('componentName', testComponentName);
      _this12.set('searchForContentChange', true);
      _this12.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 8,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []], 'showDeleteButtonInRow', true], ['loc', [null, [2, 8], [8, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $componentButtonAdd = $(_ember['default'].$('.ui.button')[0]);

      _ember['default'].run(function () {
        $componentButtonAdd.click();
      });

      wait().then(function () {
        var $componentObjectListViewFirstCell = _ember['default'].$('.object-list-view-helper-column');
        var $minusButton = _ember['default'].$('.minus', $componentObjectListViewFirstCell);

        assert.strictEqual($minusButton.length === 1, true, 'Component has delete button in first cell');
      });
    });
  });

  (0, _emberQunit.test)('ember-grupedit showEditMenuItemInRow test', function (assert) {
    var _this13 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this13.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this13.set('model', model);
      _this13.set('componentName', testComponentName);
      _this13.set('searchForContentChange', true);
      _this13.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 8,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []], 'showEditMenuItemInRow', true], ['loc', [null, [2, 8], [8, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $component = _this13.$().children();
      var $componentButtonAdd = $(_ember['default'].$('.ui.button')[0]);

      _ember['default'].run(function () {
        $componentButtonAdd.click();
      });

      wait().then(function () {
        var $editMenuButton = _ember['default'].$('.button.right', $component);
        var $editMenuItem = _ember['default'].$('.item', $editMenuButton);

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
    var _this14 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this14.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this14.set('model', model);
      _this14.set('componentName', testComponentName);
      _this14.set('searchForContentChange', true);
      _this14.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 8,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []], 'showDeleteMenuItemInRow', true], ['loc', [null, [2, 8], [8, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $component = _this14.$().children();
      var $componentButtonAdd = $(_ember['default'].$('.ui.button')[0]);

      _ember['default'].run(function () {
        $componentButtonAdd.click();
      });

      wait().then(function () {
        var $editMenuButton = _ember['default'].$('.button.right', $component);
        var $editMenuItem = _ember['default'].$('.item', $editMenuButton);

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
    var _this15 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this15.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this15.set('model', model);
      _this15.set('componentName', testComponentName);
      _this15.set('searchForContentChange', true);
      _this15.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 9,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []], 'showEditMenuItemInRow', true, 'showDeleteMenuItemInRow', true], ['loc', [null, [2, 8], [9, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $component = _this15.$().children();
      var $componentButtonAdd = $(_ember['default'].$('.ui.button')[0]);

      _ember['default'].run(function () {
        $componentButtonAdd.click();
      });

      wait().then(function () {
        var $editMenuButton = _ember['default'].$('.button.right', $component);
        var $editMenuItem = _ember['default'].$('.item', $editMenuButton);

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
    var _this16 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this16.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this16.set('model', model);
      _this16.set('componentName', testComponentName);
      _this16.set('searchForContentChange', true);
      _this16.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 8,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'searchForContentChange', ['subexpr', '@mut', [['get', 'searchForContentChange', ['loc', [null, [6, 33], [6, 55]]]]], [], []], 'rowClickable', true], ['loc', [null, [2, 8], [8, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $componentObjectListView = _ember['default'].$('.object-list-view');

      // Check object-list-view <div>.
      assert.strictEqual($componentObjectListView.hasClass('selectable'), true, 'Component\'s inner object-list-view block has \'selectable\' css-class');
    });
  });

  (0, _emberQunit.test)('ember-grupedit buttonClass test', function (assert) {
    var _this17 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';
      var tempButtonClass = 'temp button class';

      _this17.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this17.set('model', model);
      _this17.set('componentName', testComponentName);
      _this17.set('buttonClass', tempButtonClass);
      _this17.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 8,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'rowClickable', true, 'buttonClass', ['subexpr', '@mut', [['get', 'buttonClass', ['loc', [null, [7, 22], [7, 33]]]]], [], []]], ['loc', [null, [2, 8], [8, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $componentButtonAdd = $(_ember['default'].$('.ui.button')[0]);

      assert.strictEqual($componentButtonAdd.hasClass(tempButtonClass), true, 'Button has class ' + tempButtonClass);
    });
  });

  (0, _emberQunit.test)('ember-grupedit customTableClass test', function (assert) {
    var _this18 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';
      var myCustomTableClass = 'tempcustomTableClass';

      _this18.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this18.set('model', model);
      _this18.set('componentName', testComponentName);
      _this18.set('customTableClass', myCustomTableClass);
      _this18.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 8,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'rowClickable', true, 'customTableClass', ['subexpr', '@mut', [['get', 'customTableClass', ['loc', [null, [7, 27], [7, 43]]]]], [], []]], ['loc', [null, [2, 8], [8, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $componentObjectListView = _ember['default'].$('.object-list-view');

      assert.strictEqual($componentObjectListView.hasClass(myCustomTableClass), true, 'Table has class ' + myCustomTableClass);
    });
  });

  (0, _emberQunit.test)('ember-grupedit orderable test', function (assert) {
    var _this19 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this19.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this19.set('model', model);
      _this19.set('componentName', testComponentName);
      _this19.set('orderable', true);
      _this19.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 7,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'orderable', ['subexpr', '@mut', [['get', 'orderable', ['loc', [null, [6, 20], [6, 29]]]]], [], []]], ['loc', [null, [2, 8], [7, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $componentObjectListView = _ember['default'].$('.object-list-view');
      var $componentObjectListViewTh = $componentObjectListView.children('thead').children('tr').children('th');
      var $componentOlvFirstHead = $($componentObjectListViewTh[1]);

      _ember['default'].run(function () {
        $componentOlvFirstHead.click();
      });

      var $componentOlvFirstDiv = $componentOlvFirstHead.children('div');
      var $orderIcon = $componentOlvFirstDiv.children('div');

      assert.strictEqual($orderIcon.length === 1, true, 'Table has order');
    });
  });

  (0, _emberQunit.test)('ember-grupedit menuInRowAdditionalItems without standart element test', function (assert) {
    var _this20 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';
      var tempMenuInRowAdditionalItems = [{
        icon: 'remove icon',
        title: 'Temp menu item',
        actionName: 'tempAction'
      }];

      _this20.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this20.set('model', model);
      _this20.set('componentName', testComponentName);
      _this20.set('menuInRowAdditionalItems', tempMenuInRowAdditionalItems);
      _this20.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 7,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'menuInRowAdditionalItems', ['subexpr', '@mut', [['get', 'menuInRowAdditionalItems', ['loc', [null, [6, 35], [6, 59]]]]], [], []]], ['loc', [null, [2, 8], [7, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $addButton = $(_ember['default'].$('.ui.button')[0]);

      _ember['default'].run(function () {
        $addButton.click();
      });

      var componentOLVMenu = _ember['default'].$('.button.right');
      var componentOLVMenuItem = componentOLVMenu.children('div').children('.item');

      assert.strictEqual(componentOLVMenuItem.length === 1, true, 'Component OLVMenuItem has only adding item');
      assert.strictEqual(componentOLVMenuItem.text().trim() === 'Temp menu item', true, 'Component OLVMenuItem text is \'Temp menu item\'');

      var componentOLVMenuItemIcon = componentOLVMenuItem.children('.icon');

      assert.strictEqual(componentOLVMenuItemIcon.hasClass('icon'), true, 'Component OLVMenuItemIcon has class icon');
      assert.strictEqual(componentOLVMenuItemIcon.hasClass('remove'), true, 'Component OLVMenuItemIcon has class remove');
    });
  });

  (0, _emberQunit.test)('ember-grupedit menuInRowAdditionalItems with standart element test', function (assert) {
    var _this21 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';
      var tempMenuInRowAdditionalItems = [{
        icon: 'remove icon',
        title: 'Temp menu item',
        actionName: 'tempAction'
      }];

      _this21.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this21.set('model', model);
      _this21.set('componentName', testComponentName);
      _this21.set('menuInRowAdditionalItems', tempMenuInRowAdditionalItems);
      _this21.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 9,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []], 'menuInRowAdditionalItems', ['subexpr', '@mut', [['get', 'menuInRowAdditionalItems', ['loc', [null, [6, 35], [6, 59]]]]], [], []], 'showEditMenuItemInRow', true, 'showDeleteMenuItemInRow', true], ['loc', [null, [2, 8], [9, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $addButton = $(_ember['default'].$('.ui.button')[0]);

      _ember['default'].run(function () {
        $addButton.click();
      });

      var componentOLVMenu = _ember['default'].$('.button.right');
      var componentOLVMenuItem = componentOLVMenu.children('div').children('.item');

      assert.strictEqual(componentOLVMenuItem.length === 3, true, 'Component OLVMenuItem has standart and adding items');
    });
  });

  (0, _emberQunit.test)('ember-grupedit model projection test', function (assert) {
    var _this22 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this22.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('ConfigurateRowView'));
      _this22.set('model', model);
      _this22.set('componentName', testComponentName);
      _this22.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 6,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [3, 18], [3, 31]]]]], [], []], 'componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [4, 24], [4, 37]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.details', ['loc', [null, [5, 26], [5, 49]]]]], [], []]], ['loc', [null, [2, 8], [6, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var componentOLV = _ember['default'].$('.object-list-view');
      var componentOLVThead = componentOLV.children('thead').children('tr').children('th');

      assert.strictEqual(componentOLVThead.length === 3, true, 'Component has \'ConfigurateRowView\' projection');
    });
  });

  (0, _emberQunit.test)('ember-grupedit main model projection test', function (assert) {
    var _this23 = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('ember-flexberry-dummy-suggestion');
      var testComponentName = 'my-test-component-to-count-rerender';

      _this23.set('proj', _dummyModelsEmberFlexberryDummySuggestion['default'].projections.get('SuggestionMainModelProjectionTest'));
      _this23.set('model', model);
      _this23.set('componentName', testComponentName);
      _this23.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 7,
                'column': 10
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('\n        ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-groupedit', [], ['componentName', ['subexpr', '@mut', [['get', 'componentName', ['loc', [null, [3, 24], [3, 37]]]]], [], []], 'content', ['subexpr', '@mut', [['get', 'model.userVotes', ['loc', [null, [4, 18], [4, 33]]]]], [], []], 'modelProjection', ['subexpr', '@mut', [['get', 'proj.attributes.userVotes', ['loc', [null, [5, 26], [5, 51]]]]], [], []], 'mainModelProjection', ['subexpr', '@mut', [['get', 'proj', ['loc', [null, [6, 30], [6, 34]]]]], [], []]], ['loc', [null, [2, 8], [7, 10]]]]],
          locals: [],
          templates: []
        };
      })()));

      var $componentObjectListView = _ember['default'].$('.object-list-view');
      var $componentObjectListViewTh = $componentObjectListView.children('thead').children('tr').children('th');
      var $componentOlvFirstHead = $componentObjectListViewTh[1];

      assert.strictEqual($componentOlvFirstHead.innerText === 'Vote type', true, 'Header has text \'Vote type\'');
    });
  });
});
define('dummy/tests/integration/components/flexberry-lookup-test', ['exports', 'ember', 'ember-flexberry-data', 'ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (exports, _ember, _emberFlexberryData, _emberI18nServicesI18n, _emberFlexberryLocalesRuTranslations, _emberFlexberryLocalesEnTranslations, _emberQunit, _dummyTestsHelpersStartApp, _dummyTestsHelpersDestroyApp) {

  var app = undefined;

  (0, _emberQunit.moduleForComponent)('flexberry-lookup', 'Integration | Component | flexberry lookup', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _emberFlexberryLocalesRuTranslations['default']);
      this.register('locale:en/translations', _emberFlexberryLocalesEnTranslations['default']);
      this.register('service:i18n', _emberI18nServicesI18n['default']);

      this.inject.service('i18n', { as: 'i18n' });
      _ember['default'].Component.reopen({
        i18n: _ember['default'].inject.service('i18n')
      });

      this.set('i18n.locale', 'ru');
      app = (0, _dummyTestsHelpersStartApp['default'])();
    },
    afterEach: function afterEach() {
      (0, _dummyTestsHelpersDestroyApp['default'])(app);
    }
  });

  (0, _emberQunit.test)('component renders properly', function (assert) {
    assert.expect(31);

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-lookup', [], ['placeholder', '(тестовое значение)'], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-lookup', [], ['readonly', true], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-lookup', [], ['chooseText', ['subexpr', '@mut', [['get', 'tempTextChoose', ['loc', [null, [2, 15], [2, 29]]]]], [], []], 'removeText', ['subexpr', '@mut', [['get', 'tempTextRemove', ['loc', [null, [3, 15], [3, 29]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    var $component = this.$().children();
    var $lookupFluid = $component.children('.fluid');
    var $lookupButtonChoose = $lookupFluid.children('.ui-change');
    var $lookupButtonClear = $lookupFluid.children('.ui-clear');

    // Check <choose button>.
    assert.equal($lookupButtonChoose.text().trim(), 'TempText1');

    // Check <clear button>.
    assert.equal($lookupButtonClear.text().trim(), 'TempText2');
  });

  (0, _emberQunit.test)('component mode consistency', function (assert) {
    var _this = this;

    var checkErrMsg = function checkErrMsg(err, str) {
      var msg = _ember['default'].isNone(err.message) ? '' : err.message;
      return msg.includes(str);
    };

    assert.expect(3);

    // Check if both 'autocomplete' and 'dropdown' flags enabled cause an error.
    assert.throws(function () {
      _this.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 4,
                'column': 8
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-lookup', [], ['autocomplete', true, 'dropdown', true], ['loc', [null, [1, 0], [4, 8]]]]],
          locals: [],
          templates: []
        };
      })()));
    }, function (err) {
      return checkErrMsg(err, 'flags \'autocomplete\' and \'dropdown\' enabled');
    }, 'Both \'autocomplete\' and \'dropdown\' flags enabled cause an error.');

    // Check if both 'dropdown' flag enabled and the block form definition cause an error.
    assert.throws(function () {
      _this.render(_ember['default'].HTMLBars.template((function () {
        var child0 = (function () {
          return {
            meta: {
              'fragmentReason': {
                'name': 'missing-wrapper',
                'problems': ['empty-body']
              },
              'revision': 'Ember@2.4.6',
              'loc': {
                'source': null,
                'start': {
                  'line': 1,
                  'column': 0
                },
                'end': {
                  'line': 4,
                  'column': 6
                }
              }
            },
            isEmpty: true,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();

        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 4,
                'column': 27
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['block', 'flexberry-lookup', [], ['dropdown', true], 0, null, ['loc', [null, [1, 0], [4, 27]]]]],
          locals: [],
          templates: [child0]
        };
      })()));
    }, function (err) {
      return checkErrMsg(err, 'flag \'dropdown\' enabled and the block form definition');
    }, 'Both \'dropdown\' flag enabled and the block form definition cause an error.');

    // Check if both 'autocomplete' flag enabled and the block form definition cause an error.
    assert.throws(function () {
      _this.render(_ember['default'].HTMLBars.template((function () {
        var child0 = (function () {
          return {
            meta: {
              'fragmentReason': {
                'name': 'missing-wrapper',
                'problems': ['empty-body']
              },
              'revision': 'Ember@2.4.6',
              'loc': {
                'source': null,
                'start': {
                  'line': 1,
                  'column': 0
                },
                'end': {
                  'line': 4,
                  'column': 6
                }
              }
            },
            isEmpty: true,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();

        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 4,
                'column': 27
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['block', 'flexberry-lookup', [], ['autocomplete', true], 0, null, ['loc', [null, [1, 0], [4, 27]]]]],
          locals: [],
          templates: [child0]
        };
      })()));
    }, function (err) {
      return checkErrMsg(err, 'flag \'autocomplete\' enabled and the block form definition');
    }, 'Both \'autocomplete\' flag enabled and the block form definition cause an error.');
  });

  (0, _emberQunit.test)('autocomplete doesn\'t send data-requests in readonly mode', function (assert) {
    var _this2 = this;

    assert.expect(1);

    var store = app.__container__.lookup('service:store');

    // Override store.query method.
    var ajaxMethodHasBeenCalled = false;
    var originalAjaxMethod = _ember['default'].$.ajax;
    _ember['default'].$.ajax = function () {
      ajaxMethodHasBeenCalled = true;

      return originalAjaxMethod.apply(this, arguments);
    };

    // First, load model with existing master.
    var modelName = 'ember-flexberry-dummy-suggestion-type';
    var query = new _emberFlexberryData.Query.Builder(store).from(modelName).selectByProjection('SuggestionTypeE').where('parent', _emberFlexberryData.Query.FilterOperator.Neq, null).top(1);

    var asyncOperationsCompleted = assert.async();
    store.query(modelName, query.build()).then(function (suggestionTypes) {
      suggestionTypes = suggestionTypes.toArray();
      _ember['default'].assert('One or more \'' + modelName + '\' must exist', suggestionTypes.length > 0);

      // Remember model & render component.
      _this2.set('model', suggestionTypes[0]);

      _this2.set('actions.showLookupDialog', function () {});
      _this2.set('actions.removeLookupValue', function () {});

      _this2.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 12,
                'column': 6
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-lookup', [], ['value', ['subexpr', '@mut', [['get', 'model.parent', ['loc', [null, [2, 12], [2, 24]]]]], [], []], 'relatedModel', ['subexpr', '@mut', [['get', 'model', ['loc', [null, [3, 19], [3, 24]]]]], [], []], 'relationName', 'parent', 'projection', 'SuggestionTypeL', 'displayAttributeName', 'name', 'title', 'Parent', 'choose', ['subexpr', 'action', ['showLookupDialog'], [], ['loc', [null, [8, 13], [8, 40]]]], 'remove', ['subexpr', 'action', ['removeLookupValue'], [], ['loc', [null, [9, 13], [9, 41]]]], 'readonly', true, 'autocomplete', true], ['loc', [null, [1, 0], [12, 6]]]]],
          locals: [],
          templates: []
        };
      })()));

      // Retrieve component.
      var $component = _this2.$();
      var $componentInput = _ember['default'].$('input', $component);

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        _ember['default'].run(function () {
          ajaxMethodHasBeenCalled = false;

          // Imitate focus on component, which can cause async data-requests.
          $componentInput.focusin();

          // Wait for some time which can pass after focus, before possible async data-request will be sent.
          _ember['default'].run.later(function () {
            resolve();
          }, 300);
        });
      });
    }).then(function () {
      // Check that store.query hasn\'t been called after focus.
      assert.strictEqual(ajaxMethodHasBeenCalled, false, '$.ajax hasn\'t been called after click on autocomplete lookup in readonly mode');
    })['catch'](function (e) {
      throw e;
    })['finally'](function () {
      // Restore original method.
      _ember['default'].$.ajax = originalAjaxMethod;

      asyncOperationsCompleted();
    });
  });

  (0, _emberQunit.test)('preview button renders properly', function (assert) {
    var _this3 = this;

    assert.expect(11);

    var store = app.__container__.lookup('service:store');

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 9,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-lookup', [], ['value', ['subexpr', '@mut', [['get', 'model', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'relationName', 'parent', 'projection', 'SuggestionTypeL', 'displayAttributeName', 'name', 'title', 'Parent', 'showPreviewButton', true, 'previewFormRoute', 'ember-flexberry-dummy-suggestion-type-edit'], ['loc', [null, [1, 0], [9, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $lookupFluid = $component.children('.fluid');

    assert.strictEqual($lookupFluid.children('.ui-preview').length === 0, true, 'Component has inner title block');

    _ember['default'].run(function () {
      _this3.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
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
    var _this4 = this;

    assert.expect(3);

    var store = app.__container__.lookup('service:store');

    _ember['default'].run(function () {
      _this4.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'TestTypeName'
      }));

      _this4.set('previewButtonClass', 'previewButtonClassTest');
      _this4.set('previewText', 'previewTextTest');

      _this4.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 11,
                'column': 6
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-lookup', [], ['value', ['subexpr', '@mut', [['get', 'model', ['loc', [null, [2, 12], [2, 17]]]]], [], []], 'relationName', 'parent', 'projection', 'SuggestionTypeL', 'displayAttributeName', 'name', 'title', 'Parent', 'showPreviewButton', true, 'previewFormRoute', 'ember-flexberry-dummy-suggestion-type-edit', 'previewButtonClass', ['subexpr', '@mut', [['get', 'previewButtonClass', ['loc', [null, [9, 25], [9, 43]]]]], [], []], 'previewText', ['subexpr', '@mut', [['get', 'previewText', ['loc', [null, [10, 18], [10, 29]]]]], [], []]], ['loc', [null, [1, 0], [11, 6]]]]],
          locals: [],
          templates: []
        };
      })()));

      // Retrieve component.
      var $component = _this4.$().children();
      var $lookupFluid = $component.children('.fluid');
      var $lookupButtonPreview = $lookupFluid.children('.ui-preview');

      assert.strictEqual($lookupButtonPreview.length === 1, true, 'Component has inner title block');
      assert.strictEqual($lookupButtonPreview.hasClass('previewButtonClassTest'), true, 'Component\'s container has \'previewButtonClassTest\' css-class');
      assert.equal($lookupButtonPreview.text().trim(), 'previewTextTest');
    });
  });

  (0, _emberQunit.test)('preview with readonly renders properly', function (assert) {
    var _this5 = this;

    assert.expect(1);

    var store = app.__container__.lookup('service:store');

    _ember['default'].run(function () {
      _this5.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'TestTypeName'
      }));

      _this5.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 10,
                'column': 6
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-lookup', [], ['value', ['subexpr', '@mut', [['get', 'model', ['loc', [null, [2, 12], [2, 17]]]]], [], []], 'relationName', 'parent', 'projection', 'SuggestionTypeL', 'displayAttributeName', 'name', 'title', 'Parent', 'showPreviewButton', true, 'previewFormRoute', 'ember-flexberry-dummy-suggestion-type-edit', 'readonly', true], ['loc', [null, [1, 0], [10, 6]]]]],
          locals: [],
          templates: []
        };
      })()));

      // Retrieve component.
      var $component = _this5.$().children();
      var $lookupFluid = $component.children('.fluid');
      var $lookupButtonPreview = $lookupFluid.children('.ui-preview');

      assert.strictEqual($lookupButtonPreview.hasClass('disabled'), false, 'Component\'s container has not \'disabled\' css-class');
    });
  });
});
define('dummy/tests/integration/components/flexberry-simpledatetime-test', ['exports', 'ember-qunit', 'ember', 'ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations'], function (exports, _emberQunit, _ember, _emberI18nServicesI18n, _emberFlexberryLocalesRuTranslations, _emberFlexberryLocalesEnTranslations) {

  (0, _emberQunit.moduleForComponent)('flexberry-simpledatetime', 'Integration | Component | flexberry simpledatetime', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _emberFlexberryLocalesRuTranslations['default']);
      this.register('locale:en/translations', _emberFlexberryLocalesEnTranslations['default']);
      this.register('service:i18n', _emberI18nServicesI18n['default']);

      this.inject.service('i18n', { as: 'i18n' });
      _ember['default'].Component.reopen({
        i18n: _ember['default'].inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    }
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 28
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'flexberry-simpledatetime', ['loc', [null, [1, 0], [1, 28]]]]],
        locals: [],
        templates: []
      };
    })()));
    assert.ok(true);
  });

  (0, _emberQunit.test)('check locale at month scroll hint', function (assert) {
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 28
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'flexberry-simpledatetime', ['loc', [null, [1, 0], [1, 28]]]]],
        locals: [],
        templates: []
      };
    })()));
    this.set('i18n.locale', 'ru');
    assert.equal(_ember['default'].$('.flatpickr-current-month .cur-month')[0].title, this.get('i18n').t('components.flexberry-simpledatetime.scroll-caption-text'), 'Locale ru is correct');
    this.set('i18n.locale', 'en');
    assert.equal(_ember['default'].$('.flatpickr-current-month .cur-month')[0].title, this.get('i18n').t('components.flexberry-simpledatetime.scroll-caption-text'), 'Locale en is correct');
  });

  (0, _emberQunit.test)('render with type before value', function (assert) {
    assert.expect(1);
    var typeName = 'date';
    this.set('type', typeName);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 6
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-simpledatetime', [], ['type', ['subexpr', '@mut', [['get', 'type', ['loc', [null, [2, 11], [2, 15]]]]], [], []], 'value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [3, 12], [3, 17]]]]], [], []]], ['loc', [null, [1, 0], [4, 6]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$();
    var $componentInput = _ember['default'].$('.flatpickr-input.custom-flatpickr', $component);

    // Click on component to open calendar.
    $componentInput.click();

    var $calendar = _ember['default'].$('.flatpickr-calendar');

    // Check calendar.
    assert.strictEqual($calendar.hasClass('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');
  });

  (0, _emberQunit.test)('render with type afther value', function (assert) {
    assert.expect(1);
    var typeName = 'date';
    this.set('type', typeName);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 6
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-simpledatetime', [], ['value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [2, 12], [2, 17]]]]], [], []], 'type', ['subexpr', '@mut', [['get', 'type', ['loc', [null, [3, 11], [3, 15]]]]], [], []]], ['loc', [null, [1, 0], [4, 6]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$();
    var $componentInput = _ember['default'].$('.flatpickr-input.custom-flatpickr', $component);

    // Click on component to open calendar.
    $componentInput.click();

    var $calendar = _ember['default'].$('.flatpickr-calendar');

    // Check calendar.
    assert.strictEqual($calendar.hasClass('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');
  });
});
define('dummy/tests/integration/components/flexberry-textarea-test', ['exports', 'ember', 'ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit'], function (exports, _ember, _emberI18nServicesI18n, _emberFlexberryLocalesRuTranslations, _emberFlexberryLocalesEnTranslations, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('flexberry-textarea', 'Integration | Component | flexberry-textarea', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _emberFlexberryLocalesRuTranslations['default']);
      this.register('locale:en/translations', _emberFlexberryLocalesEnTranslations['default']);
      this.register('service:i18n', _emberI18nServicesI18n['default']);

      this.inject.service('i18n', { as: 'i18n' });
      _ember['default'].Component.reopen({
        i18n: _ember['default'].inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    }
  });

  (0, _emberQunit.test)('it renders properly', function (assert) {
    assert.expect(10);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });

    // Clean up wrapper's additional CSS-classes.
    this.set('class', '');
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
  });

  (0, _emberQunit.test)('readonly mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'readonly', ['subexpr', '@mut', [['get', 'readonly', ['loc', [null, [3, 13], [3, 21]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s readonly attribute doesn't exist yet.
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('readonly')), '', 'Component\'s inner <textarea> hasn\'t readonly attribute');

    // Activate readonly mode & check that <textarea>'s readonly attribute exists now & has value equals to 'readonly'.
    this.set('readonly', true);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('readonly')), 'readonly', 'Component\'s inner <textarea> has readonly attribute with value equals to \'readonly\'');

    // Check that <textarea>'s readonly attribute doesn't exist now.
    this.set('readonly', false);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('readonly')), '', 'Component\'s inner <textarea> hasn\'t readonly attribute');
  });

  (0, _emberQunit.test)('readonly mode works properly with value', function (assert) {
    var _this = this;

    assert.expect(2);

    // Set <textarea>'s value' & render component.
    this.set('value', null);
    this.set('readonly', true);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['readonly', ['subexpr', '@mut', [['get', 'readonly', ['loc', [null, [2, 13], [2, 21]]]]], [], []], 'value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [3, 10], [3, 15]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    assert.strictEqual(_ember['default'].$.trim($textareaInput.val()), '', 'Component\'s inner <textarea>\'s value not changed');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to unchanged \'value\'');
  });

  (0, _emberQunit.test)('it renders i18n-ed placeholder', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 22
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'flexberry-textarea', ['loc', [null, [1, 0], [1, 22]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check <textarea>'s placeholder.
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('placeholder')), _ember['default'].get(_emberFlexberryLocalesRuTranslations['default'], 'components.flexberry-textarea.placeholder'), 'Component\'s inner <textarea>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

    // Change current locale to 'en' & check <textarea>'s placeholder again.
    this.set('i18n.locale', 'en');
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('placeholder')), _ember['default'].get(_emberFlexberryLocalesEnTranslations['default'], 'components.flexberry-textarea.placeholder'), 'Component\'s inner <textarea>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
  });

  (0, _emberQunit.test)('it renders manually defined placeholder', function (assert) {
    assert.expect(2);

    // Set <textarea>'s placeholder' & render component.
    var placeholder = 'textarea is empty, please type some text';
    this.set('placeholder', placeholder);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['placeholder', ['subexpr', '@mut', [['get', 'placeholder', ['loc', [null, [2, 16], [2, 27]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check <textarea>'s placeholder.
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('placeholder')), placeholder, 'Component\'s inner <textarea>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

    // Change placeholder's value & check <textarea>'s placeholder again.
    placeholder = 'textarea has no value';
    this.set('placeholder', placeholder);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('placeholder')), placeholder, 'Component\'s inner <textarea>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');
  });

  (0, _emberQunit.test)('required mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'required', ['subexpr', '@mut', [['get', 'required', ['loc', [null, [3, 13], [3, 21]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s required attribute doesn't exist yet.
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('required')), '', 'Component\'s inner <textarea> hasn\'t required attribute');

    // Activate required mode & check that <textarea>'s required attribute exists now & has value equals to 'required'.
    this.set('required', true);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('required')), 'required', 'Component\'s inner <textarea> has required attribute with value equals to \'required\'');

    // Check that <textarea>'s required attribute doesn't exist now.
    this.set('required', false);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('required')), '', 'Component\'s inner <textarea> hasn\'t required attribute');
  });

  (0, _emberQunit.test)('disabled mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'disabled', ['subexpr', '@mut', [['get', 'disabled', ['loc', [null, [3, 13], [3, 21]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s disabled attribute doesn't exist yet.
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('disabled')), '', 'Component\'s inner <textarea> hasn\'t disabled attribute');

    // Activate disabled mode & check that <textarea>'s disabled attribute exists now & has value equals to 'disabled'.
    this.set('disabled', true);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('disabled')), 'disabled', 'Component\'s inner <textarea> has disabled attribute with value equals to \'disabled\'');

    // Check that <textarea>'s disabled attribute doesn't exist now.
    this.set('disabled', false);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('disabled')), '', 'Component\'s inner <textarea> hasn\'t disabled attribute');
  });

  (0, _emberQunit.test)('autofocus mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'autofocus', ['subexpr', '@mut', [['get', 'autofocus', ['loc', [null, [3, 14], [3, 23]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s autofocus attribute doesn't exist yet.
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('autofocus')), '', 'Component\'s inner <textarea> hasn\'t autofocus attribute');

    // Activate autofocus mode & check that <textarea>'s autofocus attribute exists now & has value equals to 'autofocus'.
    this.set('autofocus', true);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('autofocus')), 'autofocus', 'Component\'s inner <textarea> has autofocus attribute with value equals to \'autofocus\'');

    // Check that <textarea>'s autofocus attribute doesn't exist now.
    this.set('autofocus', false);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('autofocus')), '', 'Component\'s inner <textarea> hasn\'t autofocus attribute');
  });

  (0, _emberQunit.test)('spellcheck mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'spellcheck', ['subexpr', '@mut', [['get', 'spellcheck', ['loc', [null, [3, 15], [3, 25]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s spellcheck attribute doesn't exist yet.
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('spellcheck')), '', 'Component\'s inner <textarea> hasn\'t spellcheck attribute');

    // Activate spellcheck mode & check that <textarea>'s spellcheck attribute exists now & has value equals to 'spellcheck'.
    this.set('spellcheck', true);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('spellcheck')), 'true', 'Component\'s inner <textarea> has spellcheck attribute with value equals to \'spellcheck\'');

    // Check that <textarea>'s spellcheck attribute doesn't exist now.
    this.set('spellcheck', false);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('spellcheck')), 'false', 'Component\'s inner <textarea> hasn\'t spellcheck attribute');
  });

  (0, _emberQunit.test)('wrap mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'wrap', ['subexpr', '@mut', [['get', 'wrap', ['loc', [null, [3, 9], [3, 13]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check that <textarea>'s wrap attribute 'hard'.
    this.set('wrap', 'hard');
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('wrap')), 'hard', 'Component\'s inner <textarea> wrap attribute \'hard\'');

    // Check that <textarea>'s wrap attribute 'soft'.
    this.set('wrap', 'soft');
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('wrap')), 'soft', 'Component\'s inner <textarea> wrap attribute \'soft\'');

    // Check that <textarea>'s wrap attribute 'off'.
    this.set('wrap', 'off');
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('wrap')), 'off', 'Component\'s inner <textarea> wrap attribute \'off\'');
  });

  (0, _emberQunit.test)('rows mode works properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'rows', ['subexpr', '@mut', [['get', 'rows', ['loc', [null, [3, 9], [3, 13]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'cols', ['subexpr', '@mut', [['get', 'cols', ['loc', [null, [3, 9], [3, 13]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'maxlength', ['subexpr', '@mut', [['get', 'maxlength', ['loc', [null, [3, 14], [3, 23]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    //Generate a random value 'maxlength' and convert to a string.
    var maxlengthValue = '' + Math.floor(Math.random() * 10);

    // Check that <textarea>'s maxlength attribute.
    this.set('maxlength', maxlengthValue);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('maxlength')), maxlengthValue, 'Component\'s inner <textarea>\'s value \'maxlength\' is equals to \'' + maxlengthValue + '\'');

    // Check that <textarea>'s hasn\'t value maxlength attribute.
    this.set('maxlength', null);
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('maxlength')), '', 'Component\'s inner <textarea> hasn\'t value maxlength attribute');
  });

  (0, _emberQunit.test)('selectionStart mode works properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'selectionStart', ['subexpr', '@mut', [['get', 'selectionStart', ['loc', [null, [3, 19], [3, 33]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
      assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('selectionStart')), '', 'Component\'s inner <textarea> hasn\'t value selectionStart attribute');
      done();
    }, 10);
  });

  (0, _emberQunit.test)('selectionEnd mode works properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'selectionEnd', ['subexpr', '@mut', [['get', 'selectionEnd', ['loc', [null, [3, 17], [3, 29]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    assert.strictEqual(_ember['default'].$.trim($textareaInput.attr('selectionEnd')), '', 'Component\'s inner <textarea> hasn\'t value selectionEnd attribute');
  });

  (0, _emberQunit.test)('selectionDirection mode works properly', function (assert) {
    assert.expect(1);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'selectionDirection', ['subexpr', '@mut', [['get', 'selectionDirection', ['loc', [null, [3, 23], [3, 41]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check <textarea>'s value & binded value for initial emptyness.
    assert.strictEqual(_ember['default'].$.trim($textareaInput.val()), '', 'Component\'s inner <textarea>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
    // & check them again ('change' event is needed to force bindings work).
    var newValue = 'Some text typed into textareas inner <textarea>';
    $textareaInput.val(newValue);
    $textareaInput.change();

    assert.strictEqual(_ember['default'].$.trim($textareaInput.val()), newValue, 'Component\'s inner <textarea>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });

  (0, _emberQunit.test)('changes in property binded to \'value\' causes changes in inner <textarea>', function (assert) {
    assert.expect(4);

    // Set <textarea>'s value' & render component.
    this.set('value', null);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textarea', [], ['value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textareaInput = $component.children('textarea');

    // Check <textarea>'s value & binded value for initial emptyness.
    assert.strictEqual(_ember['default'].$.trim($textareaInput.val()), '', 'Component\'s inner <textarea>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change property binded to 'value' & check them again.
    var newValue = 'Some text typed into textareas inner <textarea>';
    this.set('value', newValue);

    assert.strictEqual(_ember['default'].$.trim($textareaInput.val()), newValue, 'Component\'s inner <textarea>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });
});
define('dummy/tests/integration/components/flexberry-textbox-test', ['exports', 'ember', 'ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit'], function (exports, _ember, _emberI18nServicesI18n, _emberFlexberryLocalesRuTranslations, _emberFlexberryLocalesEnTranslations, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('flexberry-textbox', 'Integration | Component | flexberry-textbox', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('locale:ru/translations', _emberFlexberryLocalesRuTranslations['default']);
      this.register('locale:en/translations', _emberFlexberryLocalesEnTranslations['default']);
      this.register('service:i18n', _emberI18nServicesI18n['default']);

      this.inject.service('i18n', { as: 'i18n' });
      _ember['default'].Component.reopen({
        i18n: _ember['default'].inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    }
  });

  (0, _emberQunit.test)('it renders properly', function (assert) {
    assert.expect(16);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textbox', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });

    // Clean up wrapper's additional CSS-classes.
    this.set('class', '');
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
  });

  (0, _emberQunit.test)('class changes through base-component\'s dynamic properties works properly', function (assert) {
    assert.expect(6);

    var initialClass = 'class1 class2';
    var anotherClass = 'firstClass secondClass';
    var dynamicProperties = {
      'class': initialClass
    };

    this.set('dynamicProperties', dynamicProperties);

    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n    ');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('\n  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['inline', 'flexberry-textbox', [], ['dynamicProperties', ['subexpr', '@mut', [['get', 'dynamicProperties', ['loc', [null, [3, 24], [3, 41]]]]], [], []]], ['loc', [null, [2, 4], [4, 6]]]]],
        locals: [],
        templates: []
      };
    })()));

    var $component = this.$().children();

    assert.strictEqual($component.hasClass('class1'), true, 'Component\'s container has \'class1\' css-class');
    assert.strictEqual($component.hasClass('class2'), true, 'Component\'s container has \'class2\' css-class');

    _ember['default'].set(dynamicProperties, 'class', anotherClass);
    assert.strictEqual($component.hasClass('class1'), false, 'Component\'s container hasn\'t \'class1\' css-class');
    assert.strictEqual($component.hasClass('class2'), false, 'Component\'s container hasn\'t \'class2\' css-class');
    assert.strictEqual($component.hasClass('firstClass'), true, 'Component\'s container has \'firstClass\' css-class');
    assert.strictEqual($component.hasClass('secondClass'), true, 'Component\'s container has \'secondClass\' css-class');
  });

  (0, _emberQunit.test)('readonly mode works properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textbox', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [2, 10], [2, 15]]]]], [], []], 'readonly', ['subexpr', '@mut', [['get', 'readonly', ['loc', [null, [3, 13], [3, 21]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check that <input>'s readonly attribute doesn't exist yet.
    assert.strictEqual(_ember['default'].$.trim($textboxInput.attr('readonly')), '', 'Component\'s inner <input> hasn\'t readonly attribute');

    // Activate readonly mode & check that <input>'s readonly attribute exists now & has value equals to 'readonly'.
    this.set('readonly', true);

    $textboxInput = $component.children('input');
    assert.strictEqual(_ember['default'].$.trim($textboxInput.attr('readonly')), 'readonly', 'Component\'s inner <input> has readonly attribute with value equals to \'readonly\'');

    // Check that <input>'s readonly attribute doesn't exist now.
    this.set('readonly', false);

    $textboxInput = $component.children('input');
    assert.strictEqual(_ember['default'].$.trim($textboxInput.attr('readonly')), '', 'Component\'s inner <input> hasn\'t readonly attribute');
  });

  (0, _emberQunit.test)('readonly mode works properly with value', function (assert) {
    var _this = this;

    assert.expect(2);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.set('readonly', true);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textbox', [], ['readonly', ['subexpr', '@mut', [['get', 'readonly', ['loc', [null, [2, 13], [2, 21]]]]], [], []], 'value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [3, 10], [3, 15]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    assert.strictEqual(_ember['default'].$.trim($textboxInput.val()), '', 'Component\'s inner <input>\'s value not changed');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to unchanged \'value\'');
  });

  (0, _emberQunit.test)('click on textbox in readonly mode doesn\'t change value & it\'s type', function (assert) {
    assert.expect(3);

    // Set <input>'s value' & render component.
    var value = 123;
    this.set('value', value);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textbox', [], ['readonly', true, 'value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [3, 10], [3, 15]]]]], [], []]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    $textboxInput.click();
    $textboxInput.change();

    // Check <input>'s value not changed.
    assert.strictEqual(_ember['default'].$.trim($textboxInput.val()), '' + value, 'Component\'s inner <input>\'s value not changed');
    assert.strictEqual(this.get('value'), value, 'Value binded to component\'s \'value\' property is unchanged');
    assert.strictEqual(_ember['default'].typeOf(this.get('value')), 'number', 'Value binded to component\'s \'value\' property is still number');
  });

  (0, _emberQunit.test)('it renders i18n-ed placeholder', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 21
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'flexberry-textbox', ['loc', [null, [1, 0], [1, 21]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check <input>'s placeholder.
    assert.strictEqual(_ember['default'].$.trim($textboxInput.attr('placeholder')), _ember['default'].get(_emberFlexberryLocalesRuTranslations['default'], 'components.flexberry-textbox.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

    // Change current locale to 'en' & check <input>'s placeholder again.
    this.set('i18n.locale', 'en');
    assert.strictEqual(_ember['default'].$.trim($textboxInput.attr('placeholder')), _ember['default'].get(_emberFlexberryLocalesEnTranslations['default'], 'components.flexberry-textbox.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
  });

  (0, _emberQunit.test)('it renders manually defined placeholder', function (assert) {
    assert.expect(2);

    // Set <input>'s placeholder' & render component.
    var placeholder = 'Input is empty, please type some text';
    this.set('placeholder', placeholder);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textbox', [], ['placeholder', ['subexpr', '@mut', [['get', 'placeholder', ['loc', [null, [2, 16], [2, 27]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check <input>'s placeholder.
    assert.strictEqual(_ember['default'].$.trim($textboxInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

    // Change placeholder's value & check <input>'s placeholder again.
    placeholder = 'Input has no value';
    this.set('placeholder', placeholder);
    assert.strictEqual(_ember['default'].$.trim($textboxInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');
  });

  (0, _emberQunit.test)('changes in inner <input> causes changes in property binded to \'value\'', function (assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textbox', [], ['value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(_ember['default'].$.trim($textboxInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change <input>'s value (imitate situation when user typed something into component's <input>)
    // & check them again ('change' event is needed to force bindings work).
    var newValue = 'Some text typed into textboxes inner <input>';
    $textboxInput.val(newValue);
    $textboxInput.change();

    assert.strictEqual(_ember['default'].$.trim($textboxInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });

  (0, _emberQunit.test)('attribute maxlength rendered in html', function (assert) {
    assert.expect(1);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-field', [], ['maxlength', 5], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $fieldInput = _ember['default'].$('.flexberry-textbox input', $component);

    // Check <input>'s maxlength attribute.
    assert.strictEqual($fieldInput.attr('maxlength'), '5', 'Component\'s inner <input>\'s attribute maxlength rendered');
  });

  (0, _emberQunit.test)('changes in property binded to \'value\' causes changes in inner <input>', function (assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-textbox', [], ['value', ['subexpr', '@mut', [['get', 'value', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $textboxInput = $component.children('input');

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(_ember['default'].$.trim($textboxInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

    // Change property binded to 'value' & check them again.
    var newValue = 'Some text typed into textboxes inner <input>';
    this.set('value', newValue);

    assert.strictEqual(_ember['default'].$.trim($textboxInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });
});
define('dummy/tests/integration/components/flexberry-toggler-test', ['exports', 'ember', 'ember-qunit'], function (exports, _ember, _emberQunit) {

  var animationDuration = _ember['default'].$.fn.accordion.settings.duration + 100;

  (0, _emberQunit.moduleForComponent)('flexberry-toggler', 'Integration | Component | flexberry toggler', {
    integration: true
  });

  // Common expand/collapse test method.
  var expandCollapseTogglerWithStateChecks = function expandCollapseTogglerWithStateChecks(assert, captions) {
    assert.expect(10);

    var content = 'Toggler\'s content';

    captions = captions || {};
    var caption = captions.caption || '';
    var expandedCaption = captions.expandedCaption || caption;
    var collapsedCaption = captions.collapsedCaption || caption;

    this.set('content', content);
    this.set('caption', caption);
    this.set('expandedCaption', expandedCaption);
    this.set('collapsedCaption', collapsedCaption);

    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 8,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode('\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [['content', 'content', ['loc', [null, [7, 6], [7, 17]]]]],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 8,
              'column': 26
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['block', 'flexberry-toggler', [], ['caption', ['subexpr', '@mut', [['get', 'caption', ['loc', [null, [3, 14], [3, 21]]]]], [], []], 'expandedCaption', ['subexpr', '@mut', [['get', 'expandedCaption', ['loc', [null, [4, 22], [4, 37]]]]], [], []], 'collapsedCaption', ['subexpr', '@mut', [['get', 'collapsedCaption', ['loc', [null, [5, 23], [5, 39]]]]], [], []]], 0, null, ['loc', [null, [2, 4], [8, 26]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    // Retrieve component, it's inner <input>.
    var $component = this.$().children();
    var $componentTitle = $component.children('div .title');
    var $componentCaption = $componentTitle.children('span');
    var $componentContent = $component.children('div .content');

    // Check that component is collapsed by default.
    assert.strictEqual($componentTitle.hasClass('active'), false);
    assert.strictEqual($componentContent.hasClass('active'), false);
    assert.strictEqual(_ember['default'].$.trim($componentCaption.text()), collapsedCaption);

    var expandAnimationCompleted = new _ember['default'].RSVP.Promise(function (resolve, reject) {
      // Try to expand component.
      // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
      _ember['default'].run(function () {
        $componentTitle.click();
      });

      // Check that component is animating now.
      assert.strictEqual($componentContent.hasClass('animating'), true);

      // Wait for expand animation to be completed & check component's state.
      _ember['default'].run(function () {
        var animationCompleted = assert.async();
        setTimeout(function () {
          // Check that component is expanded now.
          assert.strictEqual($componentTitle.hasClass('active'), true);
          assert.strictEqual($componentContent.hasClass('active'), true);
          assert.strictEqual(_ember['default'].$.trim($componentCaption.text()), expandedCaption);

          // Tell to test method that asynchronous operation completed.
          animationCompleted();

          // Resolve 'expandAnimationCompleted' promise.
          resolve();
        }, animationDuration);
      });
    });

    // Wait for expand animation to be completed (when resolve will be called inside previous timeout).
    // Then try to collapse component.
    expandAnimationCompleted.then(function () {
      // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
      _ember['default'].run(function () {
        $componentTitle.click();
      });

      // Wait for collapse animation to be completed & check component's state.
      _ember['default'].run(function () {
        var animationCompleted = assert.async();
        setTimeout(function () {
          // Check that component is expanded now.
          assert.strictEqual($componentTitle.hasClass('active'), false);
          assert.strictEqual($componentContent.hasClass('active'), false);
          assert.strictEqual(_ember['default'].$.trim($componentCaption.text()), collapsedCaption);

          animationCompleted();
        }, animationDuration);
      });
    });
  };

  (0, _emberQunit.test)('component renders properly', function (assert) {
    assert.expect(22);

    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 5,
                'column': 4
              }
            }
          },
          isEmpty: true,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 26
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['block', 'flexberry-toggler', [], ['class', ['subexpr', '@mut', [['get', 'class', ['loc', [null, [3, 12], [3, 17]]]]], [], []]], 0, null, ['loc', [null, [2, 4], [5, 26]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

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

    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), true, 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });

    this.set('class', '');
    _ember['default'].A(additioanlCssClasses.split(' ')).forEach(function (cssClassName, index) {
      assert.strictEqual($component.hasClass(cssClassName), false, 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
  });

  (0, _emberQunit.test)('component\'s icon can be customized', function (assert) {
    assert.expect(2);

    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 5,
                'column': 4
              }
            }
          },
          isEmpty: true,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 26
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['block', 'flexberry-toggler', [], ['iconClass', ['subexpr', '@mut', [['get', 'iconClass', ['loc', [null, [3, 16], [3, 25]]]]], [], []]], 0, null, ['loc', [null, [2, 4], [5, 26]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

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

    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 8,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      ');
            dom.appendChild(el0, el1);
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode('\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [['content', 'content', ['loc', [null, [7, 6], [7, 17]]]]],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 8,
              'column': 26
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['block', 'flexberry-toggler', [], ['expanded', ['subexpr', '@mut', [['get', 'expanded', ['loc', [null, [3, 15], [3, 23]]]]], [], []], 'collapsedCaption', ['subexpr', '@mut', [['get', 'collapsedCaption', ['loc', [null, [4, 23], [4, 39]]]]], [], []], 'expandedCaption', ['subexpr', '@mut', [['get', 'expandedCaption', ['loc', [null, [5, 22], [5, 37]]]]], [], []]], 0, null, ['loc', [null, [2, 4], [8, 26]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    // Retrieve component, it's inner <input>.
    var $component = this.$().children();
    var $togglerTitle = $component.children('.title');
    var $togglerCaption = $togglerTitle.children('span');
    var $togglerContent = $component.children('.content');

    // Check that component is collapsed by default.
    assert.strictEqual($togglerTitle.hasClass('active'), false);
    assert.strictEqual($togglerContent.hasClass('active'), false);
    assert.strictEqual(_ember['default'].$.trim($togglerCaption.text()), collapsedCaption);

    // Expand & check that component is expanded.
    this.set('expanded', true);
    assert.strictEqual($togglerTitle.hasClass('active'), true);
    assert.strictEqual($togglerContent.hasClass('active'), true);
    assert.strictEqual(_ember['default'].$.trim($togglerCaption.text()), expandedCaption);

    // Collapse & check that component is collapsed.
    this.set('expanded', false);
    assert.strictEqual($togglerTitle.hasClass('active'), false);
    assert.strictEqual($togglerContent.hasClass('active'), false);
    assert.strictEqual(_ember['default'].$.trim($togglerCaption.text()), collapsedCaption);
  });

  (0, _emberQunit.test)('disabled animation', function (assert) {
    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 6,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      Hello!\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 6,
              'column': 26
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['block', 'flexberry-toggler', [], ['caption', 'Click me!', 'duration', 0], 0, null, ['loc', [null, [2, 4], [6, 26]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.notOk(this.$('.flexberry-toggler .content').hasClass('active'));

    this.$('.flexberry-toggler .title').click();

    assert.ok(this.$('.flexberry-toggler .content').hasClass('active'));
  });

  (0, _emberQunit.test)('loong animation speed', function (assert) {
    var _this = this;

    assert.expect(3);
    var done = assert.async();

    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 6,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      Hello!\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 6,
              'column': 26
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['block', 'flexberry-toggler', [], ['caption', 'Click me!', 'duration', 750], 0, null, ['loc', [null, [2, 4], [6, 26]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    this.$('.flexberry-toggler .title').click();

    assert.ok(this.$('.flexberry-toggler .content').hasClass('animating'));
    _ember['default'].run.later(function () {
      assert.ok(_this.$('.flexberry-toggler .content').hasClass('animating'));
    }, 400);
    _ember['default'].run.later(function () {
      assert.notOk(_this.$('.flexberry-toggler .content').hasClass('animating'));
      done();
    }, 1000);
  });

  (0, _emberQunit.test)('Components property hasShadow works properly', function (assert) {
    this.set('hasShadow', true);
    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 2
              },
              'end': {
                'line': 7,
                'column': 2
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('    Hello!\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 7,
              'column': 24
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['block', 'flexberry-toggler', [], ['caption', 'Click me!', 'hasShadow', ['subexpr', '@mut', [['get', 'hasShadow', ['loc', [null, [4, 14], [4, 23]]]]], [], []]], 0, null, ['loc', [null, [2, 2], [7, 24]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.ok(this.$('.flexberry-toggler').hasClass('has-shadow'));
    this.set('hasShadow', false);
    assert.notOk(this.$('.flexberry-toggler').hasClass('has-shadow'));
  });

  (0, _emberQunit.test)('Components property hasBorder works properly', function (assert) {
    this.set('hasBorder', true);
    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 2
              },
              'end': {
                'line': 7,
                'column': 2
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('    Hello!\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 7,
              'column': 24
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['block', 'flexberry-toggler', [], ['caption', 'Click me!', 'hasBorder', ['subexpr', '@mut', [['get', 'hasBorder', ['loc', [null, [4, 14], [4, 23]]]]], [], []]], 0, null, ['loc', [null, [2, 2], [7, 24]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.ok(this.$('.flexberry-toggler').hasClass('has-border'));
    this.set('hasBorder', false);
    assert.notOk(this.$('.flexberry-toggler').hasClass('has-border'));
  });
});
define('dummy/tests/integration/components/flexberry-validationmessage-test', ['exports', 'ember-qunit', 'ember-data'], function (exports, _emberQunit, _emberData) {

  (0, _emberQunit.moduleForComponent)('flexberry-validationmessage', 'Integration | Component | flexberry validationmessage', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 52
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-validationmessage', [], ['error', 'error sample'], ['loc', [null, [1, 0], [1, 52]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), 'error sample');

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 31
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'flexberry-validationmessage', ['loc', [null, [1, 0], [1, 31]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');
  });

  (0, _emberQunit.test)('it color property should pass to classes', function (assert) {

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 49
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-validationmessage', [], ['color', 'someColor'], ['loc', [null, [1, 0], [1, 49]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$(':first-child').hasClass('someColor'), true);
  });

  (0, _emberQunit.test)('it pointing property should pass to classes', function (assert) {

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 56
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-validationmessage', [], ['pointing', 'left pointing'], ['loc', [null, [1, 0], [1, 56]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$(':first-child').hasClass('left pointing'), true);
  });

  (0, _emberQunit.test)('it should throw exception on unknown pointing property', function (assert) {
    var _this = this;

    assert.throws(function () {
      _this.render(Ember.HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 64
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'flexberry-validationmessage', [], ['pointing', 'some unknown pointing'], ['loc', [null, [1, 0], [1, 64]]]]],
          locals: [],
          templates: []
        };
      })()));
    });
  });

  (0, _emberQunit.test)('it should change visibility based on array error value', function (assert) {

    var errors = _emberData['default'].Errors.create();
    this.set('error', errors.get('somefield'));
    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 43
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-validationmessage', [], ['error', ['subexpr', '@mut', [['get', 'error', ['loc', [null, [1, 36], [1, 41]]]]], [], []]], ['loc', [null, [1, 0], [1, 43]]]]],
        locals: [],
        templates: []
      };
    })()));

    // FIXME: On 06.06.2016 this test started to lead to error.
    // assert.equal(this.$(':first-child').is(':visible'), false);

    errors.add('somefield', 'somefield is invalid');
    this.set('error', errors.get('somefield'));

    assert.equal(this.$(':first-child').is(':visible'), true);
  });

  (0, _emberQunit.test)('it should change visibility based on string error value', function (assert) {

    this.set('error', '');
    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 43
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-validationmessage', [], ['error', ['subexpr', '@mut', [['get', 'error', ['loc', [null, [1, 36], [1, 41]]]]], [], []]], ['loc', [null, [1, 0], [1, 43]]]]],
        locals: [],
        templates: []
      };
    })()));

    // FIXME: On 06.06.2016 this test started to lead to error.
    // assert.equal(this.$(':first-child').is(':visible'), false);

    this.set('error', 'alarma there is error here');

    assert.equal(this.$(':first-child').is(':visible'), true);
  });
});
define('dummy/tests/integration/components/flexberry-validationsummary-test', ['exports', 'ember-qunit', 'ember-validations/errors'], function (exports, _emberQunit, _emberValidationsErrors) {

  (0, _emberQunit.moduleForComponent)('flexberry-validationsummary', 'Integration | Component | flexberry validationsummary', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('errors', _emberValidationsErrors['default'].create());

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 45
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-validationsummary', [], ['errors', ['subexpr', '@mut', [['get', 'errors', ['loc', [null, [1, 37], [1, 43]]]]], [], []]], ['loc', [null, [1, 0], [1, 45]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');
  });

  (0, _emberQunit.test)('it render error message', function (assert) {
    var errors = _emberValidationsErrors['default'].create();
    errors.set('test', ['some validation error message']);
    this.set('errors', errors);

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 45
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-validationsummary', [], ['errors', ['subexpr', '@mut', [['get', 'errors', ['loc', [null, [1, 37], [1, 43]]]]], [], []]], ['loc', [null, [1, 0], [1, 45]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), 'some validation error message');
  });

  (0, _emberQunit.test)('it color property should pass to classes', function (assert) {
    this.set('errors', _emberValidationsErrors['default'].create());

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 63
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-validationsummary', [], ['errors', ['subexpr', '@mut', [['get', 'errors', ['loc', [null, [1, 37], [1, 43]]]]], [], []], 'color', 'someColor'], ['loc', [null, [1, 0], [1, 63]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$(':first-child').hasClass('someColor'), true);
  });

  (0, _emberQunit.test)('it should throw exception on unset errors property', function (assert) {
    var _this = this;

    assert.throws(function () {
      _this.render(Ember.HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 31
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['content', 'flexberry-validationsummary', ['loc', [null, [1, 0], [1, 31]]]]],
          locals: [],
          templates: []
        };
      })()));
    });
  });

  (0, _emberQunit.test)('it should be invisible if no errors', function (assert) {
    this.set('errors', _emberValidationsErrors['default'].create());

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 45
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-validationsummary', [], ['errors', ['subexpr', '@mut', [['get', 'errors', ['loc', [null, [1, 37], [1, 43]]]]], [], []]], ['loc', [null, [1, 0], [1, 45]]]]],
        locals: [],
        templates: []
      };
    })()));

    // FIXME: On 06.06.2016 this test started to lead to error.
    // assert.equal(this.$(':first-child').is(':visible'), false);
    assert.equal(false, false);
  });

  (0, _emberQunit.test)('it should be visible if errors presence', function (assert) {
    var errors = _emberValidationsErrors['default'].create();
    errors.set('testProperty', ['validation error message']);
    this.set('errors', errors);

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 45
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'flexberry-validationsummary', [], ['errors', ['subexpr', '@mut', [['get', 'errors', ['loc', [null, [1, 37], [1, 43]]]]], [], []]], ['loc', [null, [1, 0], [1, 45]]]]],
        locals: [],
        templates: []
      };
    })()));
    assert.equal(this.$(':first-child').is(':visible'), true);
  });
});
define('dummy/tests/integration/components/form-load-time-tracker-test', ['exports', 'ember', 'ember-i18n/services/i18n', 'ember-qunit'], function (exports, _ember, _emberI18nServicesI18n, _emberQunit) {

  var formLoadTimeTracker = _ember['default'].Service.extend({
    loadTime: 1.0000,
    renderTime: 2.0000
  });

  (0, _emberQunit.moduleForComponent)('form-load-time-tracker', 'Integration | Component | form load time tracker', {
    integration: true,

    beforeEach: function beforeEach() {
      this.register('service:form-load-time-tracker', formLoadTimeTracker);
      this.register('service:i18n', _emberI18nServicesI18n['default']);

      this.inject.service('i18n', { as: 'i18n' });
      _ember['default'].Component.reopen({
        i18n: _ember['default'].inject.service('i18n')
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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 26
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'form-load-time-tracker', ['loc', [null, [1, 0], [1, 26]]]]],
        locals: [],
        templates: []
      };
    })()));
    assert.equal(this.$().text().trim(), loadTimeText + ': 1\n' + renderTimeText + ': 2');

    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 38
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('Yield here!');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 65
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['block', 'form-load-time-tracker', [], [], 0, null, ['loc', [null, [1, 0], [1, 65]]]]],
        locals: [],
        templates: [child0]
      };
    })()));
    assert.equal(this.$().text().trim(), loadTimeText + ': 1\n' + renderTimeText + ': 2\nYield here!');
  });
});
define('dummy/tests/integration/components/groupedit-toolbar-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('groupedit-toolbar', 'Integration | Component | groupedit toolbar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 48
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'groupedit-toolbar', [], ['componentName', 'someName'], ['loc', [null, [1, 0], [1, 48]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'groupedit-toolbar', [], ['componentName', 'someName'], 0, null, ['loc', [null, [2, 4], [4, 26]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    //Component does not support template block usage.
    assert.equal(this.$().text().trim(), '');
  });
});
define('dummy/tests/integration/components/modal-dialog-test', ['exports', 'ember-qunit', 'ember-test-helpers/wait', 'ember'], function (exports, _emberQunit, _emberTestHelpersWait, _ember) {

  (0, _emberQunit.moduleForComponent)('modal-dialog', 'Integration | Component | modal dialog', {
    integration: true,

    setup: function setup() {
      var _this = this;

      // detachable need for jquery can do select child components
      this.set('settings', {
        detachable: false
      });

      this.set('created', false);
      this.set('createdConsumer', function () {
        _this.set('created', true);
      });

      _ember['default'].Test.registerWaiter(this, function () {
        return _this.get('created');
      });
    },

    teardown: function teardown() {
      this.$().modal('hide dimmer');
    }
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    var _this2 = this;

    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'modal-dialog', [], ['settings', ['subexpr', '@mut', [['get', 'settings', ['loc', [null, [2, 29], [2, 37]]]]], [], []], 'created', ['subexpr', '@mut', [['get', 'createdConsumer', ['loc', [null, [2, 46], [2, 61]]]]], [], []]], 0, null, ['loc', [null, [2, 4], [4, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    return (0, _emberTestHelpersWait['default'])().then(function () {
      assert.equal(_this2.$('.description').text().trim(), 'template block text');
    });
  });

  (0, _emberQunit.test)('it should not show actions div if no buttons visible', function (assert) {
    var _this3 = this;

    this.render(_ember['default'].HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'fragmentReason': false,
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'modal-dialog', [], ['settings', ['subexpr', '@mut', [['get', 'settings', ['loc', [null, [2, 29], [2, 37]]]]], [], []], 'created', ['subexpr', '@mut', [['get', 'createdConsumer', ['loc', [null, [2, 46], [2, 61]]]]], [], []], 'useOkButton', false, 'useCloseButton', false], 0, null, ['loc', [null, [2, 4], [4, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    return (0, _emberTestHelpersWait['default'])().then(function () {
      assert.equal(_this3.$('.actions').length, 0);
    });
  });
});
define('dummy/tests/integration/components/object-list-view-test', ['exports', 'ember', 'ember-qunit', 'dummy/tests/helpers/start-app', 'dummy/models/components-examples/flexberry-groupedit/shared/aggregator', 'ember-flexberry/services/user-settings'], function (exports, _ember, _emberQunit, _dummyTestsHelpersStartApp, _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator, _emberFlexberryServicesUserSettings) {

  var App = undefined;

  (0, _emberQunit.moduleForComponent)('object-list-view', 'Integration | Component | object list view', {
    integration: true,

    beforeEach: function beforeEach() {
      App = (0, _dummyTestsHelpersStartApp['default'])();
      _ember['default'].Component.reopen({
        i18n: _ember['default'].inject.service('i18n'),
        userSettingsService: _ember['default'].inject.service('user-settings')
      });

      _emberFlexberryServicesUserSettings['default'].reopen({
        isUserSettingsServiceEnabled: false
      });
    }
  });

  (0, _emberQunit.test)('columns renders', function (assert) {
    var _this = this;

    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
      var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');

      _this.set('proj', _dummyModelsComponentsExamplesFlexberryGroupeditSharedAggregator['default'].projections.get('AggregatorE'));
      _this.set('model', model);
      _this.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.4.6',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 88
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'object-list-view', [], ['modelProjection', ['subexpr', '@mut', [['get', 'proj', ['loc', [null, [1, 35], [1, 39]]]]], [], []], 'content', ['subexpr', '@mut', [['get', 'model.details', ['loc', [null, [1, 48], [1, 61]]]]], [], []], 'componentName', 'someName'], ['loc', [null, [1, 0], [1, 88]]]]],
          locals: [],
          templates: []
        };
      })()));
      assert.notEqual(_this.$().text().trim(), '');
    });
  });
});
define('dummy/tests/integration/components/olv-filter-interval-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('olv-filter-interval', 'Integration | Component | olv filter interval', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 23
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'olv-filter-interval', ['loc', [null, [1, 0], [1, 23]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');
  });
});
define('dummy/tests/integration/components/ui-message-test', ['exports', 'ember', 'ember-qunit'], function (exports, _ember, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('ui-message', 'Integration | Component | ui-message', {
    integration: true
  });

  (0, _emberQunit.test)('it renders properly', function (assert) {
    assert.expect(2);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 14
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'ui-message', ['loc', [null, [1, 0], [1, 14]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['size', ['subexpr', '@mut', [['get', 'size', ['loc', [null, [2, 9], [2, 13]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();

    // Check component's syze's types.
    var sizeTypes = _ember['default'].A(['small', 'large', 'huge', 'massive']);
    sizeTypes.forEach(function (sizeCssClassName, index) {
      _this.set('size', sizeCssClassName);
      assert.strictEqual($component.hasClass(sizeCssClassName), true, 'Component\'s wrapper has size css-class \'' + sizeCssClassName + '\'');
    });

    this.set('size', '');
    sizeTypes.forEach(function (sizeCssClassName, index) {
      assert.strictEqual($component.hasClass(sizeCssClassName), false, 'Component\'s wrapper hasn\'t size css-class \'' + sizeCssClassName + '\'');
    });
  });

  (0, _emberQunit.test)('type renders properly', function (assert) {
    var _this2 = this;

    assert.expect(12);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['type', ['subexpr', '@mut', [['get', 'type', ['loc', [null, [2, 9], [2, 13]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();

    // Check component's type's CSS-classes.
    var typeCssClasses = _ember['default'].A(['warning', 'info', 'positive', 'success', 'negative', 'error']);
    typeCssClasses.forEach(function (typeCssClassName, index) {
      _this2.set('type', typeCssClassName);
      assert.strictEqual($component.hasClass(typeCssClassName), true, 'Component\'s wrapper has type css-class \'' + typeCssClassName + '\'');
    });

    this.set('type', '');
    typeCssClasses.forEach(function (typeCssClassName, index) {
      assert.strictEqual($component.hasClass(typeCssClassName), false, 'Component\'s wrapper hasn\'t type css-class \'' + typeCssClassName + '\'');
    });
  });

  (0, _emberQunit.test)('color renders properly', function (assert) {
    var _this3 = this;

    assert.expect(24);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['color', ['subexpr', '@mut', [['get', 'color', ['loc', [null, [2, 10], [2, 15]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();

    // Check component's color's CSS-classes.
    var colorCssClasses = _ember['default'].A(['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'black']);
    colorCssClasses.forEach(function (colorCssClassName, index) {
      _this3.set('color', colorCssClassName);
      assert.strictEqual($component.hasClass(colorCssClassName), true, 'Component\'s wrapper has color css-class \'' + colorCssClassName + '\'');
    });

    this.set('color', '');
    colorCssClasses.forEach(function (colorCssClassName, index) {
      assert.strictEqual($component.hasClass(colorCssClassName), false, 'Component\'s wrapper hasn\'t color css-class \'' + colorCssClassName + '\'');
    });
  });

  (0, _emberQunit.test)('floating renders properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['floating', ['subexpr', '@mut', [['get', 'floating', ['loc', [null, [2, 13], [2, 21]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['attached', ['subexpr', '@mut', [['get', 'attached', ['loc', [null, [2, 13], [2, 21]]]]], [], []]], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['visible', ['subexpr', '@mut', [['get', 'visible', ['loc', [null, [2, 12], [2, 19]]]]], [], []], 'closeable', true], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $closeableIcon = $component.children('i');

    // Component is visible.
    assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css-class \'hidden\'');

    // The component is hidden by the Close button.
    _ember['default'].run(function () {
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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 3,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['closeable', true], ['loc', [null, [1, 0], [3, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $closeableIcon = $component.children('i');

    assert.strictEqual($closeableIcon.hasClass('close'), true, 'Component\'s close icon has css-class \'close\'');
    assert.strictEqual($closeableIcon.hasClass('icon'), true, 'Component\'s wrapper has css-class \'icon\'');
  });

  (0, _emberQunit.test)('caption & massage renders properly', function (assert) {
    assert.expect(3);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['caption', 'My caption', 'message', 'My message'], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $captionText = $component.children('div');
    var $massageText = $component.children('p');

    assert.strictEqual($captionText.hasClass('header'), true, 'Component\'s caption block has \'header\' css-class');
    assert.strictEqual(_ember['default'].$.trim($captionText.text()), 'My caption', 'Component\'s caption is right');
    assert.strictEqual(_ember['default'].$.trim($massageText.text()), 'My message', 'Component\'s message is right');
  });

  (0, _emberQunit.test)('icon renders properly', function (assert) {
    assert.expect(7);

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['icon', 'icon paw', 'caption', 'My caption', 'message', 'My message'], ['loc', [null, [1, 0], [5, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
    assert.strictEqual(_ember['default'].$.trim($captionText.text()), 'My caption', 'Component\'s caption is right');
    assert.strictEqual(_ember['default'].$.trim($massageText.text()), 'My message', 'Component\'s message is right');
  });

  (0, _emberQunit.test)('component sends \'onHide\' action', function (assert) {
    assert.expect(3);

    var messageClose = false;
    this.set('actions.onClose', function () {
      messageClose = true;
    });

    // Render component.
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 4,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['closeable', true, 'onHide', ['subexpr', 'action', ['onClose'], [], ['loc', [null, [3, 11], [3, 29]]]]], ['loc', [null, [1, 0], [4, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

    // Retrieve component.
    var $component = this.$().children();
    var $closeableIcon = $component.children('i');

    // The component is visible.
    assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper has\'t css-class \'hidden\'');

    // The component is hidden by the Close button.
    _ember['default'].run(function () {
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
    this.render(_ember['default'].HTMLBars.template((function () {
      return {
        meta: {
          'fragmentReason': {
            'name': 'missing-wrapper',
            'problems': ['wrong-type']
          },
          'revision': 'Ember@2.4.6',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 4
            }
          }
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['inline', 'ui-message', [], ['closeable', true, 'visible', ['subexpr', '@mut', [['get', 'visible', ['loc', [null, [3, 12], [3, 19]]]]], [], []], 'onShow', ['subexpr', 'action', ['onVisible'], [], ['loc', [null, [4, 11], [4, 31]]]]], ['loc', [null, [1, 0], [5, 4]]]]],
        locals: [],
        templates: []
      };
    })()));

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
define('dummy/tests/test-helper', ['exports', 'dummy/tests/helpers/resolver', 'ember-qunit'], function (exports, _dummyTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_dummyTestsHelpersResolver['default']);
});
define('dummy/tests/unit/adapters/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

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
define('dummy/tests/unit/controllers/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('dummy/tests/unit/controllers/detail-edit-form-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:detail-edit-form', 'Unit | Controller | detail edit form', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('dummy/tests/unit/controllers/edit-form-test', ['exports', 'ember', 'ember-data', 'ember-qunit', 'dummy/tests/helpers/start-app'], function (exports, _ember, _emberData, _emberQunit, _dummyTestsHelpersStartApp) {

  var App;

  (0, _emberQunit.moduleFor)('controller:edit-form', 'Unit | Controller | edit form', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
    beforeEach: function beforeEach() {
      App = (0, _dummyTestsHelpersStartApp['default'])();
    },
    afterEach: function afterEach() {
      _ember['default'].run(App, 'destroy');
      _ember['default'].$.mockjax.clear();
    }
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  (0, _emberQunit.test)('save hasMany relationships recursively', function (assert) {
    var savedRecords = [];

    var TestModel = _emberData['default'].Model.extend({
      save: function save() {
        var _this = this;

        return new _ember['default'].RSVP.Promise(function (resolve) {
          savedRecords.push(_this);
          resolve(_this);
        });
      }
    });

    var Model1 = TestModel.extend({
      hasManyModel2: _emberData['default'].hasMany('model2')
    });

    var Model2 = TestModel.extend({
      hasManyModel3: _emberData['default'].hasMany('model3')
    });

    var Model3 = TestModel.extend({});

    App.register('model:model1', Model1);
    App.register('model:model2', Model2);
    App.register('model:model3', Model3);

    var controller = this.subject();
    var store = App.__container__.lookup('service:store');

    _ember['default'].run(function () {
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

      wait();
    });
  });
});
define('dummy/tests/unit/controllers/flexberry-file-view-dialog-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

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
define('dummy/tests/unit/controllers/list-form-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:list-form', 'Unit | Controller | list form', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('dummy/tests/unit/controllers/lookup-dialog-test', ['exports', 'ember-qunit', 'ember', 'sinon'], function (exports, _emberQunit, _ember, _sinon) {

  (0, _emberQunit.moduleFor)('controller:lookup-dialog', 'Unit | Controller | lookup dialog', {
    // Specify the other units that are required for this test.
    needs: ['service:lookup-events']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  (0, _emberQunit.test)('it shold set selected record to saveTo.propName of saveTo.model', function (assert) {
    var model = _ember['default'].Object.extend({ makeDirty: function makeDirty() {} }).create();
    var saveTo = {
      model: model,
      propName: 'testProperty'
    };

    var controller = this.subject();
    controller.set('saveTo', saveTo);

    _sinon['default'].stub(model, 'makeDirty');
    _sinon['default'].stub(controller, '_closeModalDialog');
    var master = _ember['default'].Object.create();

    controller.send('objectListViewRowClick', master);

    assert.equal(model.get('testProperty'), master);
  });
});
define('dummy/tests/unit/controllers/new-platform-flexberry-services-lock-list-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:new-platform-flexberry-services-lock-list', 'Unit | Controller | new-platform-flexberry-services-lock-list');

  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('dummy/tests/unit/helpers/readonly-cell-test', ['exports', 'ember', 'dummy/helpers/readonly-cell', 'qunit'], function (exports, _ember, _dummyHelpersReadonlyCell, _qunit) {

  (0, _qunit.module)('Unit | Helper | readonly cell');

  (0, _qunit.test)('it works', function (assert) {
    _ember['default'].run(function () {
      var result = (0, _dummyHelpersReadonlyCell.readonlyCell)([['test'], 'test', false]);
      assert.ok(result);
    });
  });
});
define('dummy/tests/unit/initializers/i18n-test', ['exports', 'ember', 'dummy/initializers/i18n', 'qunit'], function (exports, _ember, _dummyInitializersI18n, _qunit) {

  var application = undefined;

  (0, _qunit.module)('Unit | Initializer | i18n', {
    beforeEach: function beforeEach() {
      _ember['default'].run(function () {
        application = _ember['default'].Application.create();
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    _dummyInitializersI18n['default'].initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('dummy/tests/unit/initializers/render-perf-logger-test', ['exports', 'ember', 'dummy/initializers/render-perf-logger', 'qunit'], function (exports, _ember, _dummyInitializersRenderPerfLogger, _qunit) {

  var application = undefined;

  (0, _qunit.module)('Unit | Initializer | render perf logger', {
    beforeEach: function beforeEach() {
      _ember['default'].run(function () {
        application = _ember['default'].Application.create();
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    _dummyInitializersRenderPerfLogger['default'].initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('dummy/tests/unit/instance-initializers/i18n-test', ['exports', 'ember', 'ember-flexberry/instance-initializers/i18n', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (exports, _ember, _emberFlexberryInstanceInitializersI18n, _qunit, _dummyTestsHelpersStartApp, _dummyTestsHelpersDestroyApp) {

  var application = undefined;
  var appInstance = undefined;
  var fakeLocale = undefined;

  (0, _qunit.module)('Unit | Instance Initializer | i18n', {
    beforeEach: function beforeEach() {
      application = (0, _dummyTestsHelpersStartApp['default'])();
      appInstance = application.buildInstance();

      // Set 'fake-locale' as default i18n-service locale.
      var i18n = appInstance.lookup('service:i18n');
      fakeLocale = 'fake-locale';
      i18n.set('locale', fakeLocale);
    },
    afterEach: function afterEach() {
      (0, _dummyTestsHelpersDestroyApp['default'])(appInstance);
      (0, _dummyTestsHelpersDestroyApp['default'])(application);
    }
  });

  (0, _qunit.test)('Configures i18n service for locale', function (assert) {
    assert.expect(2);

    var i18n = appInstance.lookup('service:i18n');
    var ENV = appInstance._lookupFactory('config:environment');
    var defaultLocale = (ENV.i18n || {}).defaultLocale;

    assert.strictEqual(i18n.get('locale'), fakeLocale, 'Default i18n-service locale is \'' + fakeLocale + '\'');

    var currentLocale = defaultLocale ? defaultLocale : window.navigator.languages ? window.navigator.languages[0] : window.navigator.language || window.navigator.userLanguage;

    var locales = appInstance.lookup('controller:application').get('locales');
    if (!locales || _ember['default'].typeOf(locales) !== 'array' || locales.indexOf(currentLocale) === -1 || _ember['default'].isBlank(currentLocale)) {
      currentLocale = 'en';
    }

    _emberFlexberryInstanceInitializersI18n['default'].initialize(appInstance);

    assert.strictEqual(i18n.get('locale'), currentLocale, 'Current i18n-service locale is \'' + currentLocale + '\'');
  });
});
define('dummy/tests/unit/instance-initializers/lock-test', ['exports', 'ember', 'dummy/instance-initializers/lock', 'qunit', 'dummy/tests/helpers/destroy-app'], function (exports, _ember, _dummyInstanceInitializersLock, _qunit, _dummyTestsHelpersDestroyApp) {

  (0, _qunit.module)('Unit | Instance Initializer | lock', {
    beforeEach: function beforeEach() {
      var _this = this;

      _ember['default'].run(function () {
        _this.application = _ember['default'].Application.create();
        _this.appInstance = _this.application.buildInstance();
      });
    },

    afterEach: function afterEach() {
      _ember['default'].run(this.appInstance, 'destroy');
      (0, _dummyTestsHelpersDestroyApp['default'])(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _dummyInstanceInitializersLock.initialize)(this.appInstance);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('dummy/tests/unit/instance-initializers/moment-test', ['exports', 'ember-flexberry/instance-initializers/moment', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (exports, _emberFlexberryInstanceInitializersMoment, _qunit, _dummyTestsHelpersStartApp, _dummyTestsHelpersDestroyApp) {

  var application = undefined;
  var appInstance = undefined;
  var defaultLocale = undefined;
  var defaultFormat = undefined;

  (0, _qunit.module)('Unit | Instance Initializer | moment', {
    beforeEach: function beforeEach() {
      application = (0, _dummyTestsHelpersStartApp['default'])();
      appInstance = application.buildInstance();

      // Run instance-initializer.
      _emberFlexberryInstanceInitializersMoment['default'].initialize(appInstance);

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
      (0, _dummyTestsHelpersDestroyApp['default'])(appInstance);
      (0, _dummyTestsHelpersDestroyApp['default'])(application);
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
define('dummy/tests/unit/mixins/dynamic-actions-test', ['exports', 'ember', 'ember-flexberry/mixins/dynamic-actions', 'ember-flexberry/objects/dynamic-action', 'qunit'], function (exports, _ember, _emberFlexberryMixinsDynamicActions, _emberFlexberryObjectsDynamicAction, _qunit) {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  var ClassWithDynamicActionsMixin = _ember['default'].Object.extend(_emberFlexberryMixinsDynamicActions['default'], {});
  var ComponentWithDynamicActionsMixin = _ember['default'].Component.extend(_emberFlexberryMixinsDynamicActions['default'], {});

  (0, _qunit.module)('Unit | Mixin | dynamic-actions mixin');

  (0, _qunit.test)('Mixin throws assertion failed exception if it\'s owner hasn\'t \'sendAction\' method', function (assert) {
    assert.expect(1);

    try {
      ClassWithDynamicActionsMixin.create({ dynamicActions: [] });
    } catch (ex) {
      assert.strictEqual(/wrong\s*type\s*of\s*.*sendAction.*/gi.test(ex.message), true, 'Throws assertion failed exception if owner hasn\'t \'sendAction\' method');
    }
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if specified \'dynamicActions\' is not array', function (assert) {
    var wrongDynamicActionsArray = _ember['default'].A([1, true, false, 'some string', {}, function () {}, new Date(), new RegExp()]);

    assert.expect(wrongDynamicActionsArray.length);

    wrongDynamicActionsArray.forEach(function (wrongDynamicActions) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: wrongDynamicActions
      });

      try {
        component.sendAction('someAction');
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*dynamicActions.*/gi.test(ex.message), true, 'Throws assertion failed exception if specified \'dynamicActions\' property is \'' + _ember['default'].typeOf(wrongDynamicActions) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'on\' property', function (assert) {
    var wrongOnPropertiesArray = _ember['default'].A([1, true, false, {}, [], function () {}, new Date(), new RegExp()]);

    assert.expect(wrongOnPropertiesArray.length);

    wrongOnPropertiesArray.forEach(function (wrongOnProperty) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: _ember['default'].A([_emberFlexberryObjectsDynamicAction['default'].create({
          on: wrongOnProperty,
          actionHandler: null,
          actionName: null,
          actionContext: null,
          actionArguments: null
        })])
      });

      try {
        component.sendAction('someAction');
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*on.*/gi.test(ex.message), true, 'Throws assertion failed exception if one of specified \'dynamicActions\' has \'on\' property of wrong type \'' + _ember['default'].typeOf(wrongOnProperty) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'actionHandler\' property', function (assert) {
    var wrongActionHandlersArray = _ember['default'].A([1, true, false, 'some string', {}, [], new Date(), new RegExp()]);

    assert.expect(wrongActionHandlersArray.length);

    wrongActionHandlersArray.forEach(function (wrongActionHandler) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: _ember['default'].A([_emberFlexberryObjectsDynamicAction['default'].create({
          on: 'someAction',
          actionHandler: wrongActionHandler,
          actionName: null,
          actionContext: null,
          actionArguments: null
        })])
      });

      try {
        component.sendAction('someAction');
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*actionHandler.*/gi.test(ex.message), true, 'Throws assertion failed exception if one of specified \'dynamicActions\' has \'actionHandler\' property of wrong type \'' + _ember['default'].typeOf(wrongActionHandler) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'actionName\' property', function (assert) {
    var wrongActionNamesArray = _ember['default'].A([1, true, false, {}, [], function () {}, new Date(), new RegExp()]);

    assert.expect(wrongActionNamesArray.length);

    wrongActionNamesArray.forEach(function (wrongActionName) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: _ember['default'].A([_emberFlexberryObjectsDynamicAction['default'].create({
          on: 'someAction',
          actionHandler: null,
          actionName: wrongActionName,
          actionContext: null,
          actionArguments: null
        })])
      });

      try {
        component.sendAction('someAction');
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*actionName.*/gi.test(ex.message), true, 'Throws assertion failed exception if one of specified \'dynamicActions\' has \'actionName\' property of wrong type \'' + _ember['default'].typeOf(wrongActionName) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if one of specified \'dynamicActions\' has defined \'actionName\', but' + ' wrong \'actionContext\' property (without \'send\' method)', function (assert) {
    var wrongActionContextsArray = _ember['default'].A([null, 1, true, false, {}, [], function () {}, new Date(), new RegExp(), { send: function send() {} }]);

    // Assertion shouldn't be send for last object containing 'send' method,
    // that's why length - 1.
    assert.expect(wrongActionContextsArray.length - 1);

    wrongActionContextsArray.forEach(function (wrongActionContext) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: _ember['default'].A([_emberFlexberryObjectsDynamicAction['default'].create({
          on: 'someAction',
          actionHandler: null,
          actionName: 'onSomeAction',
          actionContext: wrongActionContext,
          actionArguments: null
        })])
      });

      try {
        component.sendAction('someAction');
      } catch (ex) {
        assert.strictEqual(/method\s*.*send.*\s*.*actionContext.*/gi.test(ex.message), true, 'Throws assertion failed exception if one of specified \'dynamicActions\' has defined \'actionName\', ' + 'but wrong \'actionContext\' property (without \'send\' method)');
      }
    });
  });

  (0, _qunit.test)('Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'actionArguments\' property', function (assert) {
    var wrongActionArgumentsArray = _ember['default'].A([1, true, false, 'some string', {}, function () {}, new Date(), new RegExp()]);

    assert.expect(wrongActionArgumentsArray.length);

    wrongActionArgumentsArray.forEach(function (wrongActionArguments) {
      var component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: _ember['default'].A([_emberFlexberryObjectsDynamicAction['default'].create({
          on: 'someAction',
          actionHandler: null,
          actionName: null,
          actionContext: null,
          actionArguments: wrongActionArguments
        })])
      });

      try {
        component.sendAction('someAction');
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*actionArguments.*/gi.test(ex.message), true, 'Throws assertion failed exception if one of specified \'dynamicActions\' has \'actionArguments\' property of wrong type \'' + _ember['default'].typeOf(wrongActionArguments) + '\'');
      }
    });
  });

  (0, _qunit.test)('Mixin does\'t break it\'s owner\'s standard \'sendAction\' logic', function (assert) {
    assert.expect(1);

    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: _ember['default'].A([_emberFlexberryObjectsDynamicAction['default'].create({
        on: 'someAction',
        actionHandler: null,
        actionName: null,
        actionContext: null,
        actionArguments: null
      })])
    });

    var someActionHandlerHasBeenCalled = false;
    component.attrs.someAction = function () {
      someActionHandlerHasBeenCalled = true;
    };

    component.sendAction('someAction');

    assert.strictEqual(someActionHandlerHasBeenCalled, true, 'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
  });

  (0, _qunit.test)('Mixin triggers specified \'dynamicActions\' handlers (\'actionHandler\' callbacks only) ' + 'if \'actionContext\' isn\'t specified', function (assert) {
    assert.expect(10);

    var someActionDynamicHandlerHasBeenCalled = false;
    var someAnotherActionDynamicHandlerHasBeenCalled = false;
    var someActionAgainDynamicHandlerHasBeenCalled = false;

    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: _ember['default'].A([_emberFlexberryObjectsDynamicAction['default'].create({
        on: 'someAction',
        actionHandler: function actionHandler() {
          someActionDynamicHandlerHasBeenCalled = true;
        },
        actionName: null,
        actionContext: null,
        actionArguments: null
      }), _emberFlexberryObjectsDynamicAction['default'].create({
        on: 'someAnotherAction',
        actionHandler: function actionHandler() {
          someAnotherActionDynamicHandlerHasBeenCalled = true;
        },
        actionName: null,
        actionContext: null,
        actionArguments: null
      }), _emberFlexberryObjectsDynamicAction['default'].create({
        on: 'someAction',
        actionHandler: function actionHandler() {
          someActionAgainDynamicHandlerHasBeenCalled = true;
        },
        actionName: null,
        actionContext: null,
        actionArguments: null
      })])
    });

    var someActionHandlerHasBeenCalled = false;
    component.attrs.someAction = function () {
      someActionHandlerHasBeenCalled = true;
    };

    var someAnotherActionHandlerHasBeenCalled = false;
    component.attrs.someAnotherAction = function () {
      someAnotherActionHandlerHasBeenCalled = true;
    };

    component.sendAction('someAction');
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

    component.sendAction('someAnotherAction');
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

    var controller = _ember['default'].Controller.extend({
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
      dynamicActions: _ember['default'].A([_emberFlexberryObjectsDynamicAction['default'].create({
        on: 'someAction',
        actionHandler: function actionHandler() {
          someActionDynamicHandlerHasBeenCalled = true;
          someActionDynamicHandlerContext = this;
        },
        actionName: 'onSomeAction',
        actionContext: controller,
        actionArguments: null
      }), _emberFlexberryObjectsDynamicAction['default'].create({
        on: 'someAnotherAction',
        actionHandler: function actionHandler() {
          someAnotherActionDynamicHandlerHasBeenCalled = true;
          someAnotherActionDynamicHandlerContext = this;
        },
        actionName: 'onSomeAnotherAction',
        actionContext: controller,
        actionArguments: null
      }), _emberFlexberryObjectsDynamicAction['default'].create({
        on: 'someAction',
        actionHandler: function actionHandler() {
          someActionAgainDynamicHandlerHasBeenCalled = true;
          someActionAgainDynamicHandlerContext = this;
        },
        actionName: 'onSomeActionAgain',
        actionContext: controller,
        actionArguments: null
      })])
    });

    var someActionHandlerHasBeenCalled = false;
    component.attrs.someAction = function () {
      someActionHandlerHasBeenCalled = true;
    };

    var someAnotherActionHandlerHasBeenCalled = false;
    component.attrs.someAnotherAction = function () {
      someAnotherActionHandlerHasBeenCalled = true;
    };

    component.sendAction('someAction');
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

    component.sendAction('someAnotherAction');
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
    var dynamicActions = _ember['default'].A();
    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: dynamicActions
    });

    // Define controller.
    var someActionControllersHandlerHasBeenCalled = false;
    var someActionControllersHandlerContext = null;
    var controller = _ember['default'].Controller.extend({
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
    var someDynamicAction = _emberFlexberryObjectsDynamicAction['default'].create({
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
    component.sendAction('someAction');
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
    component.sendAction('someAction');
    assert.strictEqual(someActionHandlerHasBeenCalled, true, 'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
    assert.strictEqual(someActionDynamicHandlerHasBeenCalled, false, 'Component doesn\'t trigger specified in removed dynamic action \'actionHandler\' for component\'s \'someAction\'');
    assert.strictEqual(someActionControllersHandlerHasBeenCalled, false, 'Component doesn\'t trigger on removed dynamic action\'s \'actionContext\' action with specified \'actionName\' for ' + 'component\'s \'someAction\'');
  });

  (0, _qunit.test)('Mixin adds specified in \'dynamicActions\' \'actionArguments\' to the beginning of handler\'s arguments array', function (assert) {
    assert.expect(3);

    var dynamicActionArguments = _ember['default'].A(['firstDynamicArgument', 'secondDynamicArgument']);

    var someActionHandlerArguments = null;
    var someActionDynamicHandlerArguments = null;
    var someActionDynamicControllersHandlerArguments = null;

    var controller = _ember['default'].Controller.extend({
      actions: {
        onSomeAction: function onSomeAction() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          someActionDynamicControllersHandlerArguments = _ember['default'].A(args);
        }
      }
    }).create();

    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: _ember['default'].A([_emberFlexberryObjectsDynamicAction['default'].create({
        on: 'someAction',
        actionHandler: function actionHandler() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          someActionDynamicHandlerArguments = _ember['default'].A(args);
        },
        actionName: 'onSomeAction',
        actionContext: controller,
        actionArguments: dynamicActionArguments
      })])
    });

    component.attrs.someAction = function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      someActionHandlerArguments = _ember['default'].A(args);
    };

    // Check that all handlers were called with expected arguments.
    var originalActionArguments = _ember['default'].A(['firstOriginalArgument', 'secondOriginalArgument']);
    component.sendAction.apply(component, ['someAction'].concat(_toConsumableArray(originalActionArguments)));
    assert.strictEqual(someActionHandlerArguments[0] === originalActionArguments[0] && someActionHandlerArguments[1] === originalActionArguments[1], true, 'Component\'s original action handler doesn\'t contain additional \'actionArguments\' from \'dynamicActions\' (only original arguments)');
    assert.strictEqual(someActionDynamicHandlerArguments[0] === dynamicActionArguments[0] && someActionDynamicHandlerArguments[1] === dynamicActionArguments[1] && someActionDynamicHandlerArguments[2] === originalActionArguments[0] && someActionDynamicHandlerArguments[3] === originalActionArguments[1], true, 'Component\'s dynamic action handler contains additional \'actionArguments\' from \'dynamicActions\'');
    assert.strictEqual(someActionDynamicControllersHandlerArguments[0] === dynamicActionArguments[0] && someActionDynamicControllersHandlerArguments[1] === dynamicActionArguments[1] && someActionDynamicControllersHandlerArguments[2] === originalActionArguments[0] && someActionDynamicControllersHandlerArguments[3] === originalActionArguments[1], true, 'Action handler with specified \'actionName\' contains additional \'actionArguments\' from \'dynamicActions\'');
  });

  (0, _qunit.test)('Mixin doesn\'t trigger component\'s inner method if outer action handler is not defined', function (assert) {
    assert.expect(2);

    var component = ComponentWithDynamicActionsMixin.create({
      attrs: {}
    });

    var innerSomeActionHasBeenCalled = false;
    component.someAction = function () {
      innerSomeActionHasBeenCalled = true;
    };

    component.sendAction('someAction');
    assert.strictEqual(innerSomeActionHasBeenCalled, false, 'Component doesn\'t trigger inner \'someAction\' method');

    var outerSomeActionHasBeenCalled = false;
    component.attrs.someAction = function () {
      outerSomeActionHasBeenCalled = true;
    };

    component.sendAction('someAction');
    assert.strictEqual(outerSomeActionHasBeenCalled && !innerSomeActionHasBeenCalled, true, 'Component trigger\'s outer \'someAction\' handler');
  });
});
define('dummy/tests/unit/mixins/dynamic-properties-test', ['exports', 'ember', 'ember-flexberry/mixins/dynamic-properties', 'qunit'], function (exports, _ember, _emberFlexberryMixinsDynamicProperties, _qunit) {

  var ClassWithDynamicPropertiesMixin = _ember['default'].Object.extend(_emberFlexberryMixinsDynamicProperties['default'], {});

  (0, _qunit.module)('Unit | Mixin | dynamic-properties mixin');

  (0, _qunit.test)('Mixin throws assertion failed exception if specified \'dynamicProperties\' property is not an \'object\' or an \'instance\'', function (assert) {
    var wrongDynamicPropertiesArray = _ember['default'].A([1, true, false, 'some string', [], function () {}, new Date(), new RegExp()]);

    assert.expect(wrongDynamicPropertiesArray.length);

    wrongDynamicPropertiesArray.forEach(function (wrongDynamicProperties) {
      try {
        ClassWithDynamicPropertiesMixin.create({ dynamicProperties: wrongDynamicProperties });
      } catch (ex) {
        assert.strictEqual(/wrong\s*type\s*of\s*.*dynamicProperties.*/gi.test(ex.message), true, 'Throws assertion failed exception if specified \'dynamicProperties\' property is \'' + _ember['default'].typeOf(wrongDynamicProperties) + '\'');
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
    _ember['default'].set(dynamicProperties, 'property', propertyChangedValue);

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

    var ownerPropertiesNames = _ember['default'].A(Object.keys(mixinOwner));
    assert.strictEqual(ownerPropertiesNames.contains('usualProperty'), true, 'Owner\'s properties keys contains \'usualProperty\'');
    assert.strictEqual(ownerPropertiesNames.contains('property'), true, 'Owner\'s properties keys contains \'property\'');
    assert.strictEqual(ownerPropertiesNames.contains('anotherProperty'), true, 'Owner\'s properties keys contains \'anotherProperty\'');

    var newPropertyValue = 'MyNewProperty';
    var newAnotherPropertyValue = 'MyNewAnotherProperty';
    var newDynamicProperties = { newProperty: newPropertyValue, newAnotherProperty: newAnotherPropertyValue };
    mixinOwner.set('dynamicProperties', newDynamicProperties);

    assert.strictEqual(mixinOwner.get('usualProperty'), usualPropertyValue, 'Owner\'s \'usualProperty\' is equals to it\'s initially defined value (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(_ember['default'].typeOf(mixinOwner.get('property')), 'undefined', 'Owner\'s \'property\' is undefined (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(_ember['default'].typeOf(mixinOwner.get('anotherProperty')), 'undefined', 'Owner\'s \'anotherProperty\' is undefined (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(mixinOwner.get('newProperty'), newPropertyValue, 'Owner\'s \'newProperty\' is equals to related dynamicProperty (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(mixinOwner.get('newAnotherProperty'), newAnotherPropertyValue, 'Owner\'s \'newAnotherProperty\' is equals to related dynamicProperty (after change of whole \'dynamicProperties\' object)');

    ownerPropertiesNames = _ember['default'].A(Object.keys(mixinOwner));
    assert.strictEqual(ownerPropertiesNames.contains('usualProperty'), true, 'Owner\'s properties keys contains \'usualProperty\' (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(ownerPropertiesNames.contains('property'), false, 'Owner\'s properties keys doesn\'t contains \'property\' (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(ownerPropertiesNames.contains('anotherProperty'), false, 'Owner\'s properties keys doesn\'t contains \'anotherProperty\' (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(ownerPropertiesNames.contains('newProperty'), true, 'Owner\'s properties keys contains \'newProperty\' (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(ownerPropertiesNames.contains('newAnotherProperty'), true, 'Owner\'s properties keys contains \'newAnotherProperty\' (after change of whole \'dynamicProperties\' object)');

    mixinOwner.set('dynamicProperties', null);
    assert.strictEqual(mixinOwner.get('usualProperty'), usualPropertyValue, 'Owner\'s \'usualProperty\' is equals to it\'s initially defined value (after change of whole \'dynamicProperties\' object to null)');
    assert.strictEqual(_ember['default'].typeOf(mixinOwner.get('newProperty')), 'undefined', 'Owner\'s \'newProperty\' is undefined (after change of whole \'dynamicProperties\' object to null)');
    assert.strictEqual(_ember['default'].typeOf(mixinOwner.get('newAnotherProperty')), 'undefined', 'Owner\'s \'newAnotherProperty\' is undefined (after change of whole \'dynamicProperties\' object to null)');

    ownerPropertiesNames = _ember['default'].A(Object.keys(mixinOwner));
    assert.strictEqual(ownerPropertiesNames.contains('usualProperty'), true, 'Owner\'s properties keys contains \'usualProperty\' (after change of whole \'dynamicProperties\' object to null)');
    assert.strictEqual(ownerPropertiesNames.contains('newProperty'), false, 'Owner\'s properties keys doesn\'t contains \'newProperty\' (after change of whole \'dynamicProperties\' object to null)');
    assert.strictEqual(ownerPropertiesNames.contains('newAnotherProperty'), false, 'Owner\'s properties keys doesn\'t contains \'newAnotherProperty\' (after change of whole \'dynamicProperties\' object to null)');
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

    var ownerPropertiesNames = _ember['default'].A(Object.keys(mixinOwner));
    assert.strictEqual(ownerPropertiesNames.contains('usualProperty'), true, 'Owner\'s properties keys contains \'usualProperty\'');
    assert.strictEqual(ownerPropertiesNames.contains('property'), true, 'Owner\'s properties keys contains \'property\'');
    assert.strictEqual(ownerPropertiesNames.contains('anotherProperty'), true, 'Owner\'s properties keys contains \'anotherProperty\'');

    mixinOwner.willDestroy();

    assert.strictEqual(mixinOwner.get('usualProperty'), usualPropertyValue, 'Owner\'s \'usualProperty\' is equals to it\'s initially defined value (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(_ember['default'].typeOf(mixinOwner.get('property')), 'undefined', 'Owner\'s \'property\' is undefined (after change of whole \'dynamicProperties\' object)');
    assert.strictEqual(_ember['default'].typeOf(mixinOwner.get('anotherProperty')), 'undefined', 'Owner\'s \'anotherProperty\' is undefined (after change of whole \'dynamicProperties\' object)');

    ownerPropertiesNames = _ember['default'].A(Object.keys(mixinOwner));
    assert.strictEqual(ownerPropertiesNames.contains('usualProperty'), true, 'Owner\'s properties keys contains \'usualProperty\'');
    assert.strictEqual(ownerPropertiesNames.contains('property'), false, 'Owner\'s properties keys doesn\'t contains \'property\'');
    assert.strictEqual(ownerPropertiesNames.contains('anotherProperty'), false, 'Owner\'s properties keys doesn\'t contains \'anotherProperty\'');
  });
});
define('dummy/tests/unit/mixins/errorable-route-test', ['exports', 'ember', 'ember-flexberry/mixins/errorable-route', 'qunit'], function (exports, _ember, _emberFlexberryMixinsErrorableRoute, _qunit) {

  (0, _qunit.module)('Unit | Mixin | errorable route');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var ErrorableRouteObject = _ember['default'].Object.extend(_emberFlexberryMixinsErrorableRoute['default']);
    var subject = ErrorableRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/flexberry-file-controller-test', ['exports', 'ember', 'ember-flexberry/mixins/flexberry-file-controller', 'qunit'], function (exports, _ember, _emberFlexberryMixinsFlexberryFileController, _qunit) {

  (0, _qunit.module)('Unit | Mixin | flexberry file controller');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var FlexberryFileControllerObject = _ember['default'].Object.extend(_emberFlexberryMixinsFlexberryFileController['default']);
    var subject = FlexberryFileControllerObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/flexberry-groupedit-route-test', ['exports', 'ember', 'ember-flexberry/mixins/flexberry-groupedit-route', 'qunit'], function (exports, _ember, _emberFlexberryMixinsFlexberryGroupeditRoute, _qunit) {

  (0, _qunit.module)('Unit | Mixin | flexberry groupedit route');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var FlexberryGroupeditRouteObject = _ember['default'].Object.extend(_emberFlexberryMixinsFlexberryGroupeditRoute['default']);
    var subject = FlexberryGroupeditRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/lock-route-test', ['exports', 'ember', 'ember-flexberry/mixins/lock-route', 'qunit'], function (exports, _ember, _emberFlexberryMixinsLockRoute, _qunit) {

  (0, _qunit.module)('Unit | Mixin | lock-route');

  (0, _qunit.test)('it works', function (assert) {
    assert.expect(3);
    var done = assert.async();
    var EditFormRoute = _ember['default'].Route.extend(_emberFlexberryMixinsLockRoute['default']);
    var route = EditFormRoute.create();
    _ember['default'].run(function () {
      assert.ok(route, 'Route created.');
      _ember['default'].RSVP.all([route.openReadOnly().then(function (answer) {
        assert.ok(answer, 'Default \'openReadOnly\' === \'true\'.');
      }), route.unlockObject().then(function (answer) {
        assert.ok(answer, 'Default \'unlockObject\' === \'true\'.');
      })]).then(done);
    });
  });
});
define('dummy/tests/unit/mixins/modal-application-route-test', ['exports', 'ember', 'ember-flexberry/mixins/modal-application-route', 'qunit'], function (exports, _ember, _emberFlexberryMixinsModalApplicationRoute, _qunit) {

  (0, _qunit.module)('ModalApplicationRouteMixin');

  (0, _qunit.test)('it works', function (assert) {
    var ModalApplicationRouteObject = _ember['default'].Object.extend(_emberFlexberryMixinsModalApplicationRoute['default']);
    var subject = ModalApplicationRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/multi-list-controller-test', ['exports', 'ember', 'ember-flexberry/mixins/multi-list-controller', 'qunit'], function (exports, _ember, _emberFlexberryMixinsMultiListController, _qunit) {

  (0, _qunit.module)('Unit | Mixin | multi list controller');

  (0, _qunit.test)('it works', function (assert) {
    var MultiListControllerObject = _ember['default'].Object.extend(_emberFlexberryMixinsMultiListController['default']);
    var subject = MultiListControllerObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/multi-list-model-edit-test', ['exports', 'ember', 'ember-flexberry/mixins/multi-list-model-edit', 'qunit'], function (exports, _ember, _emberFlexberryMixinsMultiListModelEdit, _qunit) {

  (0, _qunit.module)('Unit | Mixin | multi list model edit');

  (0, _qunit.test)('it works', function (assert) {
    var MultiListModelEditObject = _ember['default'].Object.extend(_emberFlexberryMixinsMultiListModelEdit['default']);
    var subject = MultiListModelEditObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/multi-list-model-test', ['exports', 'ember', 'ember-flexberry/mixins/multi-list-model', 'qunit'], function (exports, _ember, _emberFlexberryMixinsMultiListModel, _qunit) {

  (0, _qunit.module)('Unit | Mixin | multi list model');

  (0, _qunit.test)('it works', function (assert) {
    var MultiListModelObject = _ember['default'].Object.extend(_emberFlexberryMixinsMultiListModel['default']);
    var subject = MultiListModelObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/multi-list-route-test', ['exports', 'ember', 'ember-flexberry/mixins/multi-list-route', 'qunit'], function (exports, _ember, _emberFlexberryMixinsMultiListRoute, _qunit) {

  (0, _qunit.module)('Unit | Mixin | multi list route');

  (0, _qunit.test)('it works', function (assert) {
    var MultiListRouteObject = _ember['default'].Object.extend(_emberFlexberryMixinsMultiListRoute['default']);
    var subject = MultiListRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/paginated-controller-test', ['exports', 'ember', 'ember-flexberry/mixins/paginated-controller', 'qunit'], function (exports, _ember, _emberFlexberryMixinsPaginatedController, _qunit) {

  (0, _qunit.module)('PaginatedControllerMixin');

  (0, _qunit.test)('it works', function (assert) {
    var PaginatedControllerObject = _ember['default'].Object.extend(_emberFlexberryMixinsPaginatedController['default']);
    var subject = PaginatedControllerObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/paginated-route-test', ['exports', 'ember', 'ember-flexberry/mixins/paginated-route', 'qunit'], function (exports, _ember, _emberFlexberryMixinsPaginatedRoute, _qunit) {

  (0, _qunit.module)('PaginatedRouteMixin');

  (0, _qunit.test)('it works', function (assert) {
    var PaginatedRouteObject = _ember['default'].Object.extend(_emberFlexberryMixinsPaginatedRoute['default']);
    var subject = PaginatedRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/predicate-from-filters-test', ['exports', 'ember', 'ember-flexberry/mixins/predicate-from-filters', 'qunit'], function (exports, _ember, _emberFlexberryMixinsPredicateFromFilters, _qunit) {

  (0, _qunit.module)('Unit | Mixin | predicate from filters');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var PredicateFromFiltersObject = _ember['default'].Object.extend(_emberFlexberryMixinsPredicateFromFilters['default']);
    var subject = PredicateFromFiltersObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/reload-list-mixin-test', ['exports', 'ember', 'ember-flexberry/mixins/reload-list-mixin', 'qunit', 'dummy/tests/helpers/start-app', 'ember-flexberry-data'], function (exports, _ember, _emberFlexberryMixinsReloadListMixin, _qunit, _dummyTestsHelpersStartApp, _emberFlexberryData) {
  var SimplePredicate = _emberFlexberryData.Query.SimplePredicate;
  var StringPredicate = _emberFlexberryData.Query.StringPredicate;
  var ComplexPredicate = _emberFlexberryData.Query.ComplexPredicate;

  (0, _qunit.module)('Unit | Mixin | reload list mixin');

  (0, _qunit.test)('it works', function (assert) {
    var ReloadListMixinObject = _ember['default'].Object.extend(_emberFlexberryMixinsReloadListMixin['default']);
    var subject = ReloadListMixinObject.create();
    assert.ok(subject);
  });

  (0, _qunit.test)('it properly generates simple filter predicate', function (assert) {
    var Model = _emberFlexberryData.Projection.Model.extend({
      firstName: DS.attr('string')
    });

    Model.defineProjection('EmployeeE', 'employeeTest', {
      firstName: _emberFlexberryData.Projection.attr()
    });

    var modelSerializer = _emberFlexberryData.Serializer.Odata.extend({});
    var projection = _ember['default'].get(Model, 'projections').EmployeeE;

    var app = (0, _dummyTestsHelpersStartApp['default'])();

    app.register('model:employeeTest', Model);
    app.register('serializer:employeeTest', modelSerializer);
    var store = app.__container__.lookup('service:store');

    var ReloadListMixinObject = _ember['default'].Object.extend(_emberFlexberryMixinsReloadListMixin['default']);
    var objectInstance = ReloadListMixinObject.create();
    objectInstance.store = store;

    var result = objectInstance._getFilterPredicate(projection, { filter: 'test' });
    var resultUndefined = objectInstance._getFilterPredicate(projection, { filter: undefined });
    var resultEmpty = objectInstance._getFilterPredicate(projection, { filter: '' });
    _ember['default'].run(app, 'destroy');

    assert.equal(typeof result, 'object');
    assert.equal(result.constructor, StringPredicate);
    assert.equal(result.attributePath, 'firstName');
    assert.equal(result.containsValue, 'test');

    assert.equal(resultUndefined, null);
    assert.equal(resultEmpty, null);
  });

  (0, _qunit.test)('it properly generates complex filter predicate', function (assert) {
    var Model0 = _emberFlexberryData.Projection.Model.extend({
      firstName: DS.attr('string'),
      lastName: DS.attr('string'),
      dateField: DS.attr('date'),
      numberField: DS.attr('number')
    });

    var app = (0, _dummyTestsHelpersStartApp['default'])();
    app.register('model:employeeTest2', Model0);

    var Model = _emberFlexberryData.Projection.Model.extend({
      firstName: DS.attr('string'),
      lastName: DS.attr('string'),
      dateField: DS.attr('date'),
      numberField: DS.attr('number'),
      masterField: DS.belongsTo('employeeTest2', { inverse: null, async: false })
    });

    app.register('model:employeeTest', Model);

    Model.defineProjection('EmployeeE', 'employeeTest', {
      firstName: _emberFlexberryData.Projection.attr(),
      lastName: _emberFlexberryData.Projection.attr(),
      dateField: _emberFlexberryData.Projection.attr(),
      numberField: _emberFlexberryData.Projection.attr(),
      reportsTo: _emberFlexberryData.Projection.belongsTo('employeeTest2', 'Reports To', {
        firstName: _emberFlexberryData.Projection.attr('Reports To - First Name', {
          hidden: true
        })
      }, {
        displayMemberPath: 'firstName'
      })
    });

    var modelSerializer = _emberFlexberryData.Serializer.Odata.extend({});
    var modelSerializer0 = _emberFlexberryData.Serializer.Odata.extend({});
    var projection = _ember['default'].get(Model, 'projections').EmployeeE;

    app.register('serializer:employeeTest2', modelSerializer0);
    app.register('serializer:employeeTest', modelSerializer);
    var store = app.__container__.lookup('service:store');

    var ReloadListMixinObject = _ember['default'].Object.extend(_emberFlexberryMixinsReloadListMixin['default']);
    var objectInstance = ReloadListMixinObject.create();
    objectInstance.store = store;
    var result = objectInstance._getFilterPredicate(projection, { filter: '123' });
    _ember['default'].run(app, 'destroy');

    assert.equal(typeof result, 'object');
    assert.equal(result.constructor, ComplexPredicate);
    assert.equal(result.condition, 'or');

    // It counts only string fields.
    assert.equal(result.predicates.length, 4);
    assert.equal(result.predicates[0].constructor, StringPredicate);
    assert.equal(result.predicates[0].attributePath, 'firstName');
    assert.equal(result.predicates[0].containsValue, '123');
    assert.equal(result.predicates[2].constructor, SimplePredicate);
    assert.equal(result.predicates[2].attributePath, 'numberField');
    assert.equal(result.predicates[2].operator, 'eq');
    assert.equal(result.predicates[2].value, '123');
    assert.equal(result.predicates[3].constructor, StringPredicate);
    assert.equal(result.predicates[3].attributePath, 'reportsTo.firstName');
    assert.equal(result.predicates[3].containsValue, '123');
  });
});
define('dummy/tests/unit/mixins/sortable-controller-test', ['exports', 'ember', 'ember-flexberry/mixins/sortable-controller', 'qunit'], function (exports, _ember, _emberFlexberryMixinsSortableController, _qunit) {

  (0, _qunit.module)('SortableControllerMixin');

  (0, _qunit.test)('it works', function (assert) {
    var SortableControllerObject = _ember['default'].Object.extend(_emberFlexberryMixinsSortableController['default']);
    var subject = SortableControllerObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/mixins/sortable-route-test', ['exports', 'ember', 'ember-flexberry/mixins/sortable-route', 'qunit'], function (exports, _ember, _emberFlexberryMixinsSortableRoute, _qunit) {

  (0, _qunit.module)('SortableRouteMixin');

  (0, _qunit.test)('it works', function (assert) {
    var SortableRouteObject = _ember['default'].Object.extend(_emberFlexberryMixinsSortableRoute['default']);
    var subject = SortableRouteObject.create();
    assert.ok(subject);
  });
});
define('dummy/tests/unit/models/new-platform-flexberry-flexberry-user-setting-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('new-platform-flexberry-flexberry-user-setting', 'Unit | Model | new-platform-flexberry-flexberry-user-setting', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    assert.ok(!!model);
  });
});
define('dummy/tests/unit/models/new-platform-flexberry-services-lock-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('new-platform-flexberry-services-lock', 'Unit | Model | new-platform-flexberry-services-lock');

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    assert.ok(!!model);
  });
});
define('dummy/tests/unit/routes/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:application', {
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('dummy/tests/unit/routes/edit-form-new-test', ['exports', 'ember-qunit', 'ember-flexberry/routes/edit-form-new'], function (exports, _emberQunit, _emberFlexberryRoutesEditFormNew) {

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = _emberFlexberryRoutesEditFormNew['default'].create();
    assert.ok(route);
  });
});
define('dummy/tests/unit/routes/edit-form-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:edit-form', 'Unit | Route | edit form', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('dummy/tests/unit/routes/list-form-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:list-form', 'Unit | Route | list form', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('dummy/tests/unit/routes/new-platform-flexberry-services-lock-list-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:new-platform-flexberry-services-lock-list', 'Unit | Route | new-platform-flexberry-services-lock-list');

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('dummy/tests/unit/routes/projected-model-form-test', ['exports', 'qunit', 'ember-flexberry/routes/projected-model-form'], function (exports, _qunit, _emberFlexberryRoutesProjectedModelForm) {

  (0, _qunit.module)('route:projected-model-form');

  (0, _qunit.test)('it exists', function (assert) {
    var route = _emberFlexberryRoutesProjectedModelForm['default'].create();
    assert.ok(route);
  });
});
define('dummy/tests/unit/serializers/new-platform-flexberry-services-lock-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

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
define('dummy/tests/unit/services/app-state-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

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
define('dummy/tests/unit/services/detail-interaction-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

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
define('dummy/tests/unit/services/device-test', ['exports', 'ember-qunit', 'sinon'], function (exports, _emberQunit, _sinon) {

  (0, _emberQunit.moduleFor)('service:device', 'Unit | Service | device', {});

  (0, _emberQunit.test)('device service isMobile work', function (assert) {
    var service = this.subject();
    var fakeMobile = _sinon['default'].fake.returns(false); // No mobile by diveice width.
    service.mobile = fakeMobile;

    assert.ok(!service.isMobile());
    assert.ok(fakeMobile.called);
  });

  (0, _emberQunit.test)('device service isDesktop work', function (assert) {
    var service = this.subject();
    var fakeDecktop = _sinon['default'].fake.returns(true);
    service.desktop = fakeDecktop;

    assert.ok(service.isDesktop());
    assert.ok(fakeDecktop.called);
  });
});
define('dummy/tests/unit/services/form-load-time-tracker-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

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
define('dummy/tests/unit/services/log-test', ['exports', 'ember', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app', 'dummy/config/environment'], function (exports, _ember, _qunit, _dummyTestsHelpersStartApp, _dummyTestsHelpersDestroyApp, _dummyConfigEnvironment) {

  var app = undefined;

  (0, _qunit.module)('Unit | Service | log', {
    beforeEach: function beforeEach() {
      app = (0, _dummyTestsHelpersStartApp['default'])();
    },
    afterEach: function afterEach() {
      (0, _dummyTestsHelpersDestroyApp['default'])(app);
    }
  });

  (0, _qunit.test)('error works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('category')), 'ERROR');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('priority')), '1');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('machineName')), errorMachineName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('appDomainName')), errorAppDomainName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processId')), errorProcessId);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('threadName')), _dummyConfigEnvironment['default'].modulePrefix);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('message')), errorMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.Logger.error.
    _ember['default'].run(function () {
      _ember['default'].Logger.error(errorMessage);
    });
  });
  (0, _qunit.test)('logService works properly when storeErrorMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = false;
    var errorMessage = 'The system generated an error';

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.Logger.error.
    _ember['default'].run(function () {
      _ember['default'].Logger.error(errorMessage);
    });
  });

  (0, _qunit.test)('logService for error works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.Logger.error.
    _ember['default'].run(function () {
      _ember['default'].Logger.error(errorMessage);
    });
  });

  (0, _qunit.test)('warn works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('category')), 'WARN');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('priority')), '2');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('machineName')), warnMachineName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('appDomainName')), warnAppDomainName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processId')), warnProcessId);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('threadName')), _dummyConfigEnvironment['default'].modulePrefix);
      var savedMessageContainsWarnMessage = savedLogRecord.get('message').indexOf(warnMessage) > -1;
      assert.ok(savedMessageContainsWarnMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.warn.
    _ember['default'].run(function () {
      _ember['default'].warn(warnMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storeWarnMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeWarnMessages = false;
    var warnMessage = 'The system generated an warn';

    logService.on('warn', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.warn.
    _ember['default'].run(function () {
      _ember['default'].warn(warnMessage);
    });
  });

  (0, _qunit.test)('logService for warn works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.warn.
    _ember['default'].run(function () {
      _ember['default'].warn(warnMessage);
    });
  });

  (0, _qunit.test)('log works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('category')), 'LOG');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('priority')), '3');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('machineName')), logMachineName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('appDomainName')), logAppDomainName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processId')), logProcessId);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('threadName')), _dummyConfigEnvironment['default'].modulePrefix);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('message')), logMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.Logger.log.
    _ember['default'].run(function () {
      _ember['default'].Logger.log(logMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storeLogMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeLogMessages = false;
    var logMessage = 'Logging log message';

    logService.on('log', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.Logger.log.
    _ember['default'].run(function () {
      _ember['default'].Logger.log(logMessage);
    });
  });

  (0, _qunit.test)('logService for log works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.Logger.log.
    _ember['default'].run(function () {
      _ember['default'].Logger.log(logMessage);
    });
  });

  (0, _qunit.test)('info works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('category')), 'INFO');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('priority')), '4');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('machineName')), infoMachineName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('appDomainName')), infoAppDomainName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processId')), infoProcessId);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('threadName')), _dummyConfigEnvironment['default'].modulePrefix);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('message')), infoMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.Logger.info.
    _ember['default'].run(function () {
      _ember['default'].Logger.info(infoMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storeInfoMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeInfoMessages = false;
    var infoMessage = 'Logging info message';

    logService.on('info', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.Logger.info.
    _ember['default'].run(function () {
      _ember['default'].Logger.info(infoMessage);
    });
  });

  (0, _qunit.test)('logService for info works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.Logger.info.
    _ember['default'].run(function () {
      _ember['default'].Logger.info(infoMessage);
    });
  });

  (0, _qunit.test)('debug works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('category')), 'DEBUG');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('priority')), '5');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('machineName')), debugMachineName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('appDomainName')), debugAppDomainName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processId')), debugProcessId);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('threadName')), _dummyConfigEnvironment['default'].modulePrefix);
      var savedMessageContainsDebugMessage = savedLogRecord.get('message').indexOf(debugMessage) > -1;
      assert.ok(savedMessageContainsDebugMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.debug.
    _ember['default'].run(function () {
      _ember['default'].debug(debugMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storeDebugMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeDebugMessages = false;
    var debugMessage = 'Logging debug message';

    logService.on('debug', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.debug.
    _ember['default'].run(function () {
      _ember['default'].debug(debugMessage);
    });
  });

  (0, _qunit.test)('logService for debug works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.debug.
    _ember['default'].run(function () {
      _ember['default'].debug(debugMessage);
    });
  });

  (0, _qunit.test)('deprecate works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('category')), 'DEPRECATION');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('priority')), '6');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('machineName')), deprecationMachineName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('appDomainName')), deprecationAppDomainName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processId')), deprecationProcessId);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('threadName')), _dummyConfigEnvironment['default'].modulePrefix);
      var savedMessageContainsDeprecationMessage = savedLogRecord.get('message').indexOf(deprecationMessage) > -1;
      assert.ok(savedMessageContainsDeprecationMessage);
      var formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.deprecate.
    _ember['default'].run(function () {
      _ember['default'].deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
    });
  });

  (0, _qunit.test)('logService works properly when storeDeprecationMessages disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeDeprecationMessages = false;
    var deprecationMessage = 'The system generated an deprecation';

    logService.on('deprecation', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.deprecate.
    _ember['default'].run(function () {
      _ember['default'].deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
    });
  });

  (0, _qunit.test)('logService for deprecate works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.deprecate.
    _ember['default'].run(function () {
      _ember['default'].deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
    });
  });

  (0, _qunit.test)('assert works properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('category')), 'ERROR');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('priority')), '1');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('machineName')), assertMachineName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('appDomainName')), assertAppDomainName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processId')), assertProcessId);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('threadName')), _dummyConfigEnvironment['default'].modulePrefix);
      var savedMessageContainsAssertMessage = savedLogRecord.get('message').indexOf(assertMessage) > -1;
      assert.ok(savedMessageContainsAssertMessage);
      var formattedMessageContainsAssertMessage = savedLogRecord.get('formattedMessage').indexOf(assertMessage) > -1;
      assert.ok(formattedMessageContainsAssertMessage);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.assert.
    _ember['default'].run(function () {
      _ember['default'].assert(assertMessage, false);
    });
  });

  (0, _qunit.test)('logService works properly when storeErrorMessages for assert disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = false;
    var assertMessage = 'The system generated an error';

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.assert.
    _ember['default'].run(function () {
      _ember['default'].assert(assertMessage, false);
    });
  });

  (0, _qunit.test)('logService for assert works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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
        assert.ok(true, 'Check log call, DB isn\'t changed');
      }

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Call to Ember.assert.
    _ember['default'].run(function () {
      _ember['default'].assert(assertMessage, false);
    });
  });

  (0, _qunit.test)('throwing exceptions logs properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('category')), 'ERROR');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('priority')), '1');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('machineName')), errorMachineName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('appDomainName')), errorAppDomainName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processId')), errorProcessId);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('threadName')), _dummyConfigEnvironment['default'].modulePrefix);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('message')), errorMessage);
      var formattedMessageContainsErrorMessage = savedLogRecord.get('formattedMessage').indexOf(errorMessage) > -1;
      assert.ok(formattedMessageContainsErrorMessage);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Throwing an exception.
    _ember['default'].run(function () {
      throw new Error(errorMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storeErrorMessages for throw disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = false;
    var errorMessage = 'The system thrown an exception';

    logService.on('error', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Throwing an exception.
    _ember['default'].run(function () {
      throw new Error(errorMessage);
    });
  });

  (0, _qunit.test)('logService for throw works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Throwing an exception.
    _ember['default'].run(function () {
      throw new Error(errorMessage);
    });
  });

  (0, _qunit.test)('promise errors logs properly', function (assert) {
    var done = assert.async();
    assert.expect(10);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

    // Override default QUnitAdapter.exception method to avoid calling additional assertion when rejecting promise.
    var oldTestAdapterException = _ember['default'].Test.adapter.exception;
    _ember['default'].Test.adapter.exception = function () {};

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
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('category')), 'PROMISE');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('priority')), '7');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('machineName')), promiseMachineName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('appDomainName')), promiseAppDomainName);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processId')), promiseProcessId);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('threadName')), _dummyConfigEnvironment['default'].modulePrefix);
      assert.strictEqual(_ember['default'].$.trim(savedLogRecord.get('message')), promiseErrorMessage);

      var formattedMessageContainsPromiseErrorMessage = savedLogRecord.get('formattedMessage').indexOf(promiseErrorMessage) > -1;
      assert.ok(formattedMessageContainsPromiseErrorMessage);

      //Restore default QUnitAdapter.exception method
      _ember['default'].Test.adapter.exception = oldTestAdapterException;

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Throwing an exception.
    _ember['default'].run(function () {
      _ember['default'].RSVP.reject(promiseErrorMessage);
    });
  });

  (0, _qunit.test)('logService works properly when storePromiseErrors disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

    // Override default QUnitAdapter.exception method to avoid calling additional assertion when rejecting promise.
    var oldTestAdapterException = _ember['default'].Test.adapter.exception;
    _ember['default'].Test.adapter.exception = function () {};

    // Get log-service instance & enable errors logging.
    var logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storePromiseErrors = false;
    logService.showPromiseErrors = false;
    var promiseErrorMessage = 'Promise error';

    logService.on('promise', this, function (savedLogRecord) {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      //Restore default QUnitAdapter.exception method
      _ember['default'].Test.adapter.exception = oldTestAdapterException;

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Throwing an exception.
    _ember['default'].run(function () {
      _ember['default'].RSVP.reject(promiseErrorMessage);
    });
  });

  (0, _qunit.test)('logService for promise works properly when it\'s disabled', function (assert) {
    var done = assert.async();
    assert.expect(1);

    // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
    var originalSaveMethod = DS.Model.prototype.save;

    var savedLogRecord = undefined;
    DS.Model.prototype.save = function () {
      savedLogRecord = this;
      return _ember['default'].RSVP.resolve(savedLogRecord);
    };

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

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    });

    // Throwing an exception.
    _ember['default'].run(function () {
      _ember['default'].RSVP.reject(promiseErrorMessage);
    });
  });
});
define('dummy/tests/unit/services/objectlistview-events-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:objectlistview-events', 'Unit | Service | objectlistview events', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('dummy/tests/unit/utils/cut-string-by-length-test', ['exports', 'dummy/utils/cut-string-by-length', 'qunit'], function (exports, _dummyUtilsCutStringByLength, _qunit) {

  (0, _qunit.module)('Unit | Utility | cut string by length');

  (0, _qunit.test)('cut by length', function (assert) {
    var result = (0, _dummyUtilsCutStringByLength['default'])('test string', 6);
    assert.equal(result, 'test s...');

    result = (0, _dummyUtilsCutStringByLength['default'])('test string', 20);
    assert.equal(result, 'test string');

    result = (0, _dummyUtilsCutStringByLength['default'])('test string', 0);
    assert.equal(result, 'test string');

    result = (0, _dummyUtilsCutStringByLength['default'])('test string', 3);
    assert.equal(result, 'tes...');
  });

  (0, _qunit.test)('cut by spaces', function (assert) {
    var result = (0, _dummyUtilsCutStringByLength['default'])('test string with spaces', 6, true);
    assert.equal(result, 'test...');

    result = (0, _dummyUtilsCutStringByLength['default'])('test string with spaces', 50, true);
    assert.equal(result, 'test string with spaces');

    result = (0, _dummyUtilsCutStringByLength['default'])('test string with spaces', 0, true);
    assert.equal(result, 'test string with spaces');

    result = (0, _dummyUtilsCutStringByLength['default'])('test string with spaces', 3, true);
    assert.equal(result, 'tes...');

    result = (0, _dummyUtilsCutStringByLength['default'])('test string with spaces', 18, true);
    assert.equal(result, 'test string with...');

    result = (0, _dummyUtilsCutStringByLength['default'])('test string with spaces', 12, true);
    assert.equal(result, 'test string...');
  });
});
define('dummy/tests/unit/utils/deserialize-sorting-param-test', ['exports', 'ember', 'dummy/utils/deserialize-sorting-param', 'qunit'], function (exports, _ember, _dummyUtilsDeserializeSortingParam, _qunit) {

  (0, _qunit.module)('Unit | Utility | deserialize sorting param');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var stringToDeserialize = '+type.name-moderated';
    var result = (0, _dummyUtilsDeserializeSortingParam['default'])(stringToDeserialize);
    assert.ok(result);
    assert.ok(_ember['default'].isArray(result));
    assert.equal(result.length, 2);
    assert.equal(result[0].propName, 'type.name');
    assert.equal(result[0].direction, 'asc');
    assert.equal(result[1].propName, 'moderated');
    assert.equal(result[1].direction, 'desc');
  });

  (0, _qunit.test)('empty param string', function (assert) {
    var stringToDeserialize = '';
    var result = (0, _dummyUtilsDeserializeSortingParam['default'])(stringToDeserialize);
    assert.ok(result);
    assert.ok(_ember['default'].isArray(result));
    assert.equal(result.length, 0);
  });
});
define('dummy/tests/unit/utils/get-attr-locale-key-test', ['exports', 'dummy/utils/get-attr-locale-key', 'qunit'], function (exports, _dummyUtilsGetAttrLocaleKey, _qunit) {

  (0, _qunit.module)('Unit | Utility | get attr locale key');

  (0, _qunit.test)('get key', function (assert) {
    var mainModelName = 'ember-flexberry-dummy-suggestion';
    var projectionName = 'SuggestionE';
    var bindingPath = 'address';
    var result = (0, _dummyUtilsGetAttrLocaleKey['default'])(mainModelName, projectionName, bindingPath);
    assert.equal(result, 'models.' + mainModelName + '.projections.' + projectionName + '.' + bindingPath + '.__caption__');
  });

  (0, _qunit.test)('get key with relationship', function (assert) {
    var mainModelName = 'ember-flexberry-dummy-suggestion';
    var projectionName = 'SuggestionE';
    var bindingPath = 'address';
    var relationship = 'type';
    var result = (0, _dummyUtilsGetAttrLocaleKey['default'])(mainModelName, projectionName, bindingPath, relationship);
    assert.equal(result, 'models.' + mainModelName + '.projections.' + projectionName + '.' + relationship + '.' + bindingPath + '.__caption__');
  });
});
define('dummy/tests/unit/utils/get-current-agregator-test', ['exports', 'dummy/utils/get-current-agregator', 'qunit', 'dummy/tests/helpers/start-app', 'ember'], function (exports, _dummyUtilsGetCurrentAgregator, _qunit, _dummyTestsHelpersStartApp, _ember) {

  var App = undefined;

  (0, _qunit.module)('Unit | Utility | get current agregator', {
    setup: function setup() {
      App = (0, _dummyTestsHelpersStartApp['default'])();
    },
    teardown: function teardown() {
      _ember['default'].run(App, 'destroy');
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var detailInteractionService = App.__container__.lookup('service:detail-interaction');
    var agregator = undefined;
    _ember['default'].run(function () {
      agregator = App.__container__.lookup('service:store').createRecord('ember-flexberry-dummy-localization', { name: 'Localization' });
    });

    var agregatorsArray = _ember['default'].A();
    detailInteractionService.pushValue('modelCurrentAgregators', agregatorsArray, agregator);
    var result = _dummyUtilsGetCurrentAgregator['default'].call(agregator);
    assert.ok(result);
  });
});
define('dummy/tests/unit/utils/get-projection-by-name-test', ['exports', 'dummy/utils/get-projection-by-name', 'qunit'], function (exports, _dummyUtilsGetProjectionByName, _qunit) {

  (0, _qunit.module)('Unit | Utility | get projection by name');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var store = {};
    store.modelFor = function (modelName) {
      return { projections: { testProjection: { success: true } } };
    };

    var result = (0, _dummyUtilsGetProjectionByName['default'])('testProjection', 'testModel', store);
    assert.ok(result && result.success);
  });
});
define('dummy/tests/unit/utils/need-save-current-agregator-test', ['exports', 'dummy/utils/need-save-current-agregator', 'qunit', 'dummy/tests/helpers/start-app', 'ember'], function (exports, _dummyUtilsNeedSaveCurrentAgregator, _qunit, _dummyTestsHelpersStartApp, _ember) {

  var App = undefined;

  (0, _qunit.module)('Unit | Utility | need save current agregator', {
    setup: function setup() {
      App = (0, _dummyTestsHelpersStartApp['default'])();
      var offlineGlobals = App.__container__.lookup('service:offline-globals');
      offlineGlobals.setOnlineAvailable(false);
    },
    teardown: function teardown() {
      _ember['default'].run(App, 'destroy');
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var agregator = undefined;
    _ember['default'].run(function () {
      agregator = App.__container__.lookup('service:store').createRecord('ember-flexberry-dummy-localization', { name: 'Localization' });
    });

    var resultOk = _dummyUtilsNeedSaveCurrentAgregator['default'].call(agregator, agregator);
    assert.ok(resultOk);

    var resultNotOk = _dummyUtilsNeedSaveCurrentAgregator['default'].call(agregator);
    assert.notOk(resultNotOk);
  });
});
define('dummy/tests/unit/utils/run-after-test', ['exports', 'ember', 'qunit', 'ember-flexberry/utils/run-after'], function (exports, _ember, _qunit, _emberFlexberryUtilsRunAfter) {

  (0, _qunit.module)('Unit | Utility | run-after');

  (0, _qunit.test)('possible condition', function (assert) {
    var done = assert.async();

    var counter = 0;
    var condition = function condition() {
      return ++counter === 5;
    };

    (0, _emberFlexberryUtilsRunAfter['default'])(null, condition, function () {
      assert.strictEqual(counter, 5, 'The \'condition\' is called five times.');
      done();
    });
  });

  (0, _qunit.test)('impossible condition', function (assert) {
    var onerror = _ember['default'].onerror;
    var done = assert.async();

    var error = undefined;
    var counter = 0;
    var conditionCalled = false;
    _ember['default'].onerror = function (e) {
      error = e;
    };

    (0, _emberFlexberryUtilsRunAfter['default'])(null, function () {
      conditionCalled = true;
      throw new Error('Impossible condition.');
    }, function () {
      return ++counter;
    });

    (0, _emberFlexberryUtilsRunAfter['default'])(null, function () {
      return conditionCalled;
    }, function () {
      _ember['default'].onerror = onerror;

      assert.strictEqual(counter, 0, 'The \'handler\' is not called.');
      assert.strictEqual(error.message, 'Impossible condition.', 'Condition complete.');

      done();
    });
  });

  (0, _qunit.test)('validate context', function (assert) {
    var done = assert.async();

    var context = {};

    var condition = function condition() {
      assert.ok(this === context, 'The \'condition\' is called with correct context.');
      return true;
    };

    var handler = function handler() {
      assert.ok(this === context, 'The \'handler\' is called with correct context.');
      done();
    };

    (0, _emberFlexberryUtilsRunAfter['default'])(context, condition, handler);
  });
});
define('dummy/tests/unit/utils/serialize-sorting-param-test', ['exports', 'dummy/utils/serialize-sorting-param', 'qunit'], function (exports, _dummyUtilsSerializeSortingParam, _qunit) {

  (0, _qunit.module)('Unit | Utility | serialize sorting param');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var sortingObject = [{ propName: 'type.name', direction: 'asc' }, { propName: 'moderated', direction: 'desc' }];

    var result = (0, _dummyUtilsSerializeSortingParam['default'])(sortingObject);
    assert.ok(result);
    assert.equal(result, '+type.name-moderated');
  });

  (0, _qunit.test)('empty array', function (assert) {
    var sortingObject = [];

    var result = (0, _dummyUtilsSerializeSortingParam['default'])(sortingObject, null);
    assert.equal(result, null);
  });
});
define('dummy/tests/unit/utils/string-test', ['exports', 'ember', 'qunit', 'ember-flexberry/utils/string'], function (exports, _ember, _qunit, _emberFlexberryUtilsString) {

  (0, _qunit.module)('Unit | Util | render-string');

  (0, _qunit.test)('Util is function', function (assert) {
    assert.expect(1);

    assert.strictEqual(_ember['default'].typeOf(_emberFlexberryUtilsString.render) === 'function', true, 'Imported \'render-string\' util is function');
  });

  (0, _qunit.test)('Util returns null for calls with unexpected arguments', function (assert) {
    assert.expect(9);

    assert.strictEqual((0, _emberFlexberryUtilsString.render)(), null, 'Returns null for calls without arguments');

    _ember['default'].A([null, 1, true, false, {}, [], function () {}, new Date()]).forEach(function (wrongFirstArgument) {
      assert.strictEqual((0, _emberFlexberryUtilsString.render)(wrongFirstArgument), null, 'Returns null for calls with first argument not of string type');
    });
  });

  (0, _qunit.test)('Util returns same string for calls with unexpected render arguments', function (assert) {
    assert.expect(4);

    var stringWithTemplates = 'I have {{ one }} dollar in my wallet, {{ two }} apples in my bag, and {{ three }} hours of free time';
    assert.strictEqual((0, _emberFlexberryUtilsString.render)(stringWithTemplates), stringWithTemplates, 'Returns same string for calls without render options');

    assert.strictEqual((0, _emberFlexberryUtilsString.render)(stringWithTemplates, { context: null }), stringWithTemplates, 'Returns same string for calls without render context');

    assert.strictEqual((0, _emberFlexberryUtilsString.render)(stringWithTemplates, { context: { 'ONE': 1, 'TWO': 2, 'THREE': 3 } }), stringWithTemplates, 'Returns same string for calls with context without templates-related keys');

    assert.strictEqual((0, _emberFlexberryUtilsString.render)(stringWithTemplates, { context: { 'one': 1, 'two': 2, 'three': 3 }, delimiters: ['<<', '>>'] }), stringWithTemplates, 'Returns same string for calls with unexpected delimiters');
  });

  (0, _qunit.test)('Util returns rendered string for calls with expected render arguments', function (assert) {
    assert.expect(2);

    var stringWithTemplatesAndDefaultDelimiters = 'I have {{ one }} dollar in my wallet, {{ two }} apples in my bag, and {{ three }} hours of free time';
    assert.strictEqual((0, _emberFlexberryUtilsString.render)(stringWithTemplatesAndDefaultDelimiters, { context: { 'one': 1, 'two': 2, 'three': 3 } }), 'I have 1 dollar in my wallet, 2 apples in my bag, and 3 hours of free time', 'Returns rendered string for calls with default delimiters');

    var stringWithTemplatesAndCustomDelimiters = 'I have {% one %} dollar in my wallet, {% two %} apples in my bag, and {% three %} hours of free time';
    assert.strictEqual((0, _emberFlexberryUtilsString.render)(stringWithTemplatesAndCustomDelimiters, { context: { 'one': 1, 'two': 2, 'three': 3 }, delimiters: ['{%', '%}'] }), 'I have 1 dollar in my wallet, 2 apples in my bag, and 3 hours of free time', 'Returns rendered string for calls with custom delimiters');
  });
});
/* jshint ignore:start */

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map
