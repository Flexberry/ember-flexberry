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
define('dummy/tests/acceptance/components/flexberry-dropdown/flexberry-dropdown-conditional-render-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var path = 'components-examples/flexberry-dropdown/conditional-render-example';
  var testName = 'conditional render test';

  (0, _qunit.module)('Acceptance | flexberry-dropdown | ' + testName, function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);

    hooks.beforeEach(function () {
      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = this.owner.lookup('controller:application');
      Ember.set(applicationController, 'isInAcceptanceTestMode', true);
    });

    (0, _qunit.test)(testName, function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $dropdown, done, timeout;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(4);

                _context.next = 3;
                return (0, _testHelpers.visit)(path);

              case 3:
                assert.equal((0, _testHelpers.currentURL)(), path, 'Path is correctly');

                $dropdown = Ember.$('.flexberry-dropdown');

                assert.equal($dropdown.length, 1, 'Dropdown is rendered');

                // Select dropdown item.
                Ember.run(function () {
                  $dropdown.dropdown('set selected', 'Enum value №1');
                });

                done = assert.async();
                timeout = 100;

                Ember.run.later(function () {
                  var $dropdown = Ember.$('.flexberry-dropdown');
                  assert.equal($dropdown.length, 0, 'Dropdown isn\'t rendered');

                  var $span = Ember.$('div.field span');
                  assert.equal($span.text(), 'Enum value №1', 'Span is rendered');
                  done();
                }, timeout);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/acceptance/components/flexberry-dropdown/flexberry-dropdown-empty-value-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var path = 'components-examples/flexberry-dropdown/empty-value-example';
  var testName = 'empty value test';

  (0, _qunit.module)('Acceptance | flexberry-dropdown | ' + testName, function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);

    hooks.beforeEach(function () {
      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = this.owner.lookup('controller:application');
      Ember.set(applicationController, 'isInAcceptanceTestMode', true);
    });

    hooks.afterEach(function () {
      Ember.run(this.owner, 'destroy');
    });

    (0, _qunit.test)(testName, function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $dropdown;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(3);

                _context.next = 3;
                return (0, _testHelpers.visit)(path);

              case 3:
                assert.equal((0, _testHelpers.currentURL)(), path, 'Path is correctly');

                $dropdown = Ember.$('.flexberry-dropdown');

                assert.equal($dropdown.length, 1, 'Dropdown is rendered');
                assert.equal($dropdown[0].innerText.trim(), 'Enum value №2', 'Dropdown value is "Enum value №2"');

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
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
      Ember.set(applicationController, 'isInAcceptanceTestMode', true);
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

      var detailModel = Ember.get(controller, 'model.details');
      var store = Ember.get(controller, 'store');

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
define('dummy/tests/acceptance/components/flexberry-groupedit/flexberry-groupedit-default-sort-test', ['qunit', 'dummy/tests/helpers/start-app'], function (_qunit, _startApp) {
  'use strict';

  var app = void 0;
  var testName = 'default sort test';

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
    assert.expect(9);
    var path = 'ember-flexberry-dummy-suggestion-edit/2e98a54d-7146-4e61-bb2d-a278796c861e';
    visit(path);
    andThen(function () {
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      assert.equal(controller.model.id, '2e98a54d-7146-4e61-bb2d-a278796c861e');

      var currentSorting = controller.get('sorting')[0];
      var defaultSorting = controller.developerUserSettings.suggestionUserVotesGroupEdit.DEFAULT.sorting;

      var $usersVotesTable = Ember.$('.object-list-view')[1];

      click($usersVotesTable.tHead.rows[0].children[1]);
      andThen(function () {
        currentSorting = controller.get('sorting')[0];
        assert.ok(currentSorting.propName === 'voteType', currentSorting.direction === 'asc', 'sorting changed');

        var $defaultSortingButton = Ember.$('.object-list-view .clear-sorting-button')[0];

        click($defaultSortingButton);
        andThen(function () {
          currentSorting = controller.get('sorting')[0];
          assert.ok(currentSorting.propName === defaultSorting[0].propName, currentSorting.direction === defaultSorting[0].direction, 'default sorting');
          click($usersVotesTable.tHead.rows[0].children[1]);

          andThen(function () {
            currentSorting = controller.get('sorting')[0];
            assert.ok(currentSorting.propName === 'voteType', currentSorting.direction === 'asc', 'sorting changed');
            var $clearSettingsButton = Ember.$('.ui-clear-settings')[0];

            click($clearSettingsButton);
            andThen(function () {
              currentSorting = controller.get('sorting')[0];
              assert.ok(currentSorting.propName === defaultSorting[0].propName, currentSorting.direction === defaultSorting[0].direction);

              var press = Ember.$.Event('click');
              press.ctrlKey = true;
              press.which = 17;
              Ember.$('body').trigger(press);

              andThen(function () {
                Ember.$($usersVotesTable.tHead.rows[0].children[1]).trigger(press);
                Ember.run.later(function () {
                  currentSorting = controller.get('sorting');
                  assert.ok(currentSorting[0].propName === 'author', currentSorting.direction === 'asc', currentSorting[1].propName === 'voteType', currentSorting.direction === 'asc');

                  click($defaultSortingButton);
                  andThen(function () {
                    currentSorting = controller.get('sorting')[0];
                    assert.ok(currentSorting.propName === defaultSorting[0].propName, currentSorting.direction === defaultSorting[0].direction);

                    Ember.$('body').trigger(press);
                    andThen(function () {
                      Ember.$($usersVotesTable.tHead.rows[0].children[1]).trigger(press);
                      Ember.run.later(function () {
                        currentSorting = controller.get('sorting');
                        assert.ok(currentSorting[0].propName === 'author', currentSorting.direction === 'asc', currentSorting[1].propName === 'voteType', currentSorting.direction === 'asc');

                        click($clearSettingsButton);
                        andThen(function () {
                          currentSorting = controller.get('sorting')[0];
                          assert.ok(currentSorting.propName === defaultSorting[0].propName, currentSorting.direction === defaultSorting[0].direction);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-groupedit/flexberry-groupedit-delete-with-details-test', ['ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data/query/builder', 'ember-flexberry-data/query/predicate', 'qunit', 'dummy/tests/helpers/start-app'], function (_generateUniqueId, _builder, _predicate, _qunit, _startApp) {
  'use strict';

  var app = void 0;
  var store = void 0;
  var path = 'components-acceptance-tests/flexberry-groupedit/delete-with-details';
  var modelName = 'ember-flexberry-dummy-suggestion';
  var commentModelName = 'ember-flexberry-dummy-comment';
  var commentVoteModelName = 'ember-flexberry-dummy-comment-vote';

  (0, _qunit.module)('Acceptance | flexberry-groupedit | delete with details', {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
      store = app.__container__.lookup('service:store');
    },
    afterEach: function afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)('delete with details', function (assert) {
    var mainSuggestionRecord = void 0;
    var mainSuggestionTypeRecord = void 0;
    var mainApplicationUserRecord = void 0;
    var initTestData = function initTestData(createdRecordsPrefix) {
      // Add records for deleting.
      return Ember.RSVP.Promise.all([store.createRecord('ember-flexberry-dummy-suggestion-type', { name: createdRecordsPrefix + "0" }).save(), store.createRecord('ember-flexberry-dummy-application-user', {
        name: createdRecordsPrefix + "1",
        eMail: "1",
        phone1: "1"
      }).save()]).then(function (createdCustomRecords) {
        mainSuggestionTypeRecord = createdCustomRecords[0];
        mainApplicationUserRecord = createdCustomRecords[1];

        return Ember.RSVP.Promise.all([store.createRecord(modelName, { text: createdRecordsPrefix + "0", type: createdCustomRecords[0], author: createdCustomRecords[1], editor1: createdCustomRecords[1] }).save()]).then(function (suggestions) {
          mainSuggestionRecord = suggestions[0];
          return Ember.RSVP.Promise.all([store.createRecord(commentModelName, { text: createdRecordsPrefix + "0", suggestion: suggestions[0], author: createdCustomRecords[1] }).save(), store.createRecord(commentModelName, { text: createdRecordsPrefix + "1", suggestion: suggestions[0], author: createdCustomRecords[1] }).save(), store.createRecord(commentModelName, { text: createdRecordsPrefix + "2", suggestion: suggestions[0], author: createdCustomRecords[1] }).save()]).then(function (comments) {
            return Ember.RSVP.Promise.all([store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "0", comment: comments[0], applicationUser: createdCustomRecords[1] }).save(), store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "1", comment: comments[0], applicationUser: createdCustomRecords[1] }).save(), store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "2", comment: comments[1], applicationUser: createdCustomRecords[1] }).save()]);
          });
        });
      });
    };

    var getRows = function getRows() {
      var olvContainerClass = '.object-list-view-container';
      var trTableClass = 'table.object-list-view tbody tr';

      var $folvContainer = Ember.$(olvContainerClass);
      var $rows = function $rows() {
        return Ember.$(trTableClass, $folvContainer).toArray();
      };
      return $rows;
    };

    var checkRecordsWereAdded = function checkRecordsWereAdded(searchedRecord) {
      var $rows = getRows();

      // Check that the records have been added.
      var recordIsForDeleting = $rows().reduce(function (sum, element) {
        var nameRecord = Ember.$.trim(element.children[1].children[0].children[0].value);
        var flag = nameRecord.indexOf(searchedRecord) >= 0;
        return sum + flag;
      }, 0);

      return recordIsForDeleting;
    };

    var getDeleteButton = function getDeleteButton(searchedRecord) {
      var $rows = getRows();
      var $deleteBtnInRow = undefined;
      $rows().forEach(function (element) {
        var nameRecord = Ember.$.trim(element.children[1].children[0].children[0].value);
        if (nameRecord.indexOf(searchedRecord) >= 0) {
          $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element);
        }
      });

      return $deleteBtnInRow;
    };

    var lookAtLocalStore = function lookAtLocalStore(modelName, searchedField, searchedValue) {
      var currentLoadedData = store.peekAll(modelName);
      for (var i = 0; i < currentLoadedData.content.length; i++) {
        var record = currentLoadedData.objectAt(i);
        if (record.get(searchedField) == searchedValue) {
          return !record.isDeleted;
        }
      }

      return false;
    };

    Ember.run(function () {
      var done1 = assert.async();
      var createdRecordsPrefix = 'fge-delete-with-details-test' + (0, _generateUniqueId.default)();
      initTestData(createdRecordsPrefix).then(function () {
        visit(path + '?createdRecordsPrefix=' + createdRecordsPrefix);
        andThen(function () {
          assert.equal(currentPath(), path, createdRecordsPrefix);

          // Check records added.
          assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "0") > 0, true, 1 + ' record added');
          assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "1") > 0, true, 2 + ' record added');
          assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2") > 0, true, 3 + ' record added');

          var $deleteButton1 = getDeleteButton(createdRecordsPrefix + "0");
          var done2 = assert.async();
          Ember.run(function () {
            // An exception can be thrown to console due to observer on detail's count.
            $deleteButton1.click();
          });

          wait().then(function () {
            assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "0"), 0, 1 + ' record deleted');
            assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "1") > 0, true, 2 + ' still on OLV');
            assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2") > 0, true, 3 + ' still on OLV');

            assert.notOk(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "0"), "1 comment deleted");
            assert.ok(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "1"), "2 comment still on store");
            assert.ok(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "2"), "3 comment still on store");

            assert.notOk(lookAtLocalStore(commentVoteModelName, 'comment.text', createdRecordsPrefix + "0"), "Comment votes for 1 deleted");
            assert.ok(lookAtLocalStore(commentVoteModelName, 'comment.text', createdRecordsPrefix + "1"), "Comment votes for 2 still on store");

            var builder = new _builder.default(store, commentModelName).where(new _predicate.SimplePredicate('text', "==", createdRecordsPrefix + "0"));
            var done3 = assert.async();
            store.query(commentModelName, builder.build()).then(function (data) {
              assert.equal(data.get('length'), 1, '1 comment is not deleted on backend');

              var builder = new _builder.default(store, commentVoteModelName).where(new _predicate.SimplePredicate('comment.text', "==", createdRecordsPrefix + "0"));
              var done4 = assert.async();
              store.query(commentVoteModelName, builder.build()).then(function (data) {
                assert.equal(data.get('length'), 2, 'Comment votes for comment 1 not deleted on backend');
                var done5 = assert.async();

                // An exception can be thrown to console due to observer on detail's count.
                mainSuggestionRecord.rollbackAll();
                mainSuggestionRecord.destroyRecord().then(function () {
                  return Ember.RSVP.Promise.all([mainSuggestionTypeRecord.destroyRecord(), mainApplicationUserRecord.destroyRecord()]);
                }).then(function () {
                  return done5();
                });

                done4();
              });
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
define('dummy/tests/acceptance/components/flexberry-groupedit/flexberry-groupedit-sort-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Acceptance | flexberry-groupedit | sort test', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);

    (0, _qunit.test)('sort test', function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var _this = this;

        var recordArray, flexberryGroupeditComponent, sortResult;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(78);
                recordArray = Ember.A();

                // Создание тестовых данных

                Ember.run(function () {
                  recordArray.pushObject(_this.owner.lookup('service:store').createRecord('ember-flexberry-dummy-suggestion', {
                    id: 1,
                    address: 'Alphabeth5',
                    text: 'Beatrith5',
                    date: new Date(2021, 10, 6, 12, 45, 0),
                    moderated: false
                  }));

                  recordArray.pushObject(_this.owner.lookup('service:store').createRecord('ember-flexberry-dummy-suggestion', {
                    id: 2,
                    address: 'Alphabeth4',
                    text: 'Beatrith4',
                    date: new Date(2020, 10, 6, 12, 45, 0),
                    moderated: true
                  }));

                  recordArray.pushObject(_this.owner.lookup('service:store').createRecord('ember-flexberry-dummy-suggestion', {
                    id: 3,
                    address: 'Alphabeth3',
                    text: 'Beatrith1',
                    date: new Date(2022, 10, 6, 12, 45, 0),
                    moderated: true
                  }));

                  recordArray.pushObject(_this.owner.lookup('service:store').createRecord('ember-flexberry-dummy-suggestion', {
                    id: 4,
                    address: 'Alphabeth2',
                    text: 'Beatrith2',
                    date: new Date(2021, 11, 6, 12, 45, 0),
                    moderated: true
                  }));

                  recordArray.pushObject(_this.owner.lookup('service:store').createRecord('ember-flexberry-dummy-suggestion', {
                    id: 5,
                    address: 'Alphabeth1',
                    text: 'Beatrith3',
                    date: new Date(2021, 9, 6, 12, 45, 0),
                    moderated: true
                  }));
                });

                flexberryGroupeditComponent = this.owner.lookup('component:flexberry-groupedit');


                try {
                  sortResult = void 0;


                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'address', direction: 'asc' }, 0, 4);
                  specialArrayCompare(sortResult, [5, 4, 3, 2, 1], assert, 'sortRecords | address | asc');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'address', direction: 'desc' }, 0, 4);
                  specialArrayCompare(sortResult, [1, 2, 3, 4, 5], assert, 'sortRecords | address | desc');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'address', direction: 'none' }, 0, 4);
                  specialArrayCompare(sortResult, [1, 2, 3, 4, 5], assert, 'sortRecords | address | none');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'date', direction: 'asc' }, 0, 4);
                  specialArrayCompare(sortResult, [2, 5, 1, 4, 3], assert, 'sortRecords | date | asc');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'date', direction: 'desc' }, 0, 4);
                  specialArrayCompare(sortResult, [3, 4, 1, 5, 2], assert, 'sortRecords | date | desc');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'date', direction: 'none' }, 0, 4);
                  specialArrayCompare(sortResult, [3, 4, 1, 5, 2], assert, 'sortRecords | date | none');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'moderated', direction: 'asc' }, 0, 4);
                  specialArrayCompare(sortResult, [1, 4, 3, 5, 2], assert, 'sortRecords | boolean | asc');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'moderated', direction: 'desc' }, 0, 4);
                  specialArrayCompare(sortResult, [4, 3, 5, 2, 1], assert, 'sortRecords | boolean | desc');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'moderated', direction: 'none' }, 0, 4);
                  specialArrayCompare(sortResult, [4, 3, 5, 2, 1], assert, 'sortRecords | boolean | none');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'id', direction: 'asc' }, 0, 4);
                  specialArrayCompare(sortResult, [1, 2, 3, 4, 5], assert, 'sortRecords | id | asc');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'address', direction: 'asc' }, 1, 3);
                  specialArrayCompare(sortResult, [1, 4, 3, 2, 5], assert, 'sortRecords | partial sort | asc');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'address', direction: 'asc' }, 1, 4);
                  specialArrayCompare(sortResult, [1, 5, 4, 3, 2], assert, 'sortRecords | partial sort | asc');

                  sortResult = flexberryGroupeditComponent.sortRecords(recordArray, { propName: 'address', direction: 'desc' }, 0, 3);
                  specialArrayCompare(sortResult, [1, 3, 4, 5, 2], assert, 'sortRecords | partial sort | desc');
                } finally {
                  Ember.run(function () {
                    recordArray.forEach(function (currentRecord) {
                      _this.owner.lookup('service:store').deleteRecord(currentRecord);
                    });
                  });
                }

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  });

  function specialArrayCompare(resultArray, compareArray, assert, message) {
    assert.equal(compareArray.length, resultArray.length, message + ' | Length');
    for (var i = 0; i < compareArray.length; i++) {
      assert.equal(compareArray[i], resultArray.objectAt(i).id, message + ' | Data ' + i);
    }
  }
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

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var openLookupDialog = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee($lookup) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', new Ember.RSVP.Promise(function (resolve, reject) {
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
                      return; // Data isn't loaded yet.
                    }

                    // Data is loaded.
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
                    window.clearInterval(checkIntervalId);
                    reject('flexberry-lookup load data operation is timed out');
                  }, timeout);
                });
              }));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function openLookupDialog(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var chooseRecordInLookupDialog = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2($lookupDialog, recordIndex) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', new Ember.RSVP.Promise(function (resolve, reject) {
                var checkIntervalId = void 0;
                var checkIntervalSucceed = false;
                var checkInterval = 500;
                var timeout = 4000;

                var $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
                var $choosedRecord = Ember.$($records[recordIndex]);

                // Try to choose record in the lookup dialog.
                Ember.run(function () {
                  var $choosedRecordFirstCell = Ember.$(Ember.$('td', $choosedRecord)[1]);
                  $choosedRecordFirstCell.click();

                  // Click on modal-dialog close icon.
                  var $modelDilogClose = Ember.$('.close.icon');
                  $modelDilogClose.click();
                });

                // Wait for lookup dialog to be closed.
                Ember.run(function () {
                  checkIntervalId = window.setInterval(function () {
                    if (!$lookupDialog.hasClass('hidden')) {
                      return; // Dialog is still opened.
                    }
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
                    window.clearInterval(checkIntervalId);
                    reject('flexberry-lookup choose record operation is timed out');
                  }, timeout);
                });
              }));

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function chooseRecordInLookupDialog(_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  (0, _executeFlexberryLookupTest.executeTest)('changes in component\'s value causes changes in related model\'s specified \'belongsTo\' relation', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(store, assert, app, latestReceivedRecords) {
      var controller, model, relationName, displayAttributeName, updateLookupValueTest, $lookup, $lookupInput, $lookupDialog, chosenRecord, expectedRecord, chosenRecordDisplayAttribute, updateLookupValueTestUpdated;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              assert.expect(6);
              _context3.next = 3;
              return visit('components-acceptance-tests/flexberry-lookup/base-operations');

            case 3:
              controller = app.__container__.lookup('controller:' + currentRouteName());
              model = Ember.get(controller, 'model');
              relationName = Ember.get(controller, 'relationName');
              displayAttributeName = Ember.get(controller, 'displayAttributeName');
              updateLookupValueTest = Ember.get(controller, 'updateLookupValueTest');

              assert.strictEqual(updateLookupValueTest, 'base', 'updateLookupValueTest has default value');

              $lookup = Ember.$('.flexberry-lookup');
              $lookupInput = Ember.$('input', $lookup);

              assert.strictEqual($lookupInput.val(), '', 'lookup display value is empty by default');

              // Open lookup dialog and choose first record.
              _context3.next = 14;
              return openLookupDialog($lookup);

            case 14:
              $lookupDialog = _context3.sent;

              assert.ok($lookupDialog, 'Lookup dialog opened successfully');

              // Choose first loaded record.
              _context3.next = 18;
              return chooseRecordInLookupDialog($lookupDialog, 0);

            case 18:

              // Check that chosen record is set to related model's 'belongsTo' relation.
              chosenRecord = model.get(relationName);
              expectedRecord = latestReceivedRecords[0];

              assert.strictEqual(chosenRecord, expectedRecord, 'Chosen record is set to model\'s \'' + relationName + '\' relation as expected');

              chosenRecordDisplayAttribute = chosenRecord.get(displayAttributeName);

              assert.strictEqual($lookupInput.val(), chosenRecordDisplayAttribute, 'Lookup display value equals to chosen record\'s \'' + displayAttributeName + '\' attribute');

              updateLookupValueTestUpdated = Ember.get(controller, 'updateLookupValueTest');

              assert.strictEqual(updateLookupValueTestUpdated, 'updated', 'updateLookupValue action was called');

            case 25:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function (_x4, _x5, _x6, _x7) {
      return _ref3.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/change-model-lookup-test', ['ember-flexberry-data/query/builder', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', '@ember/test-helpers'], function (_builder, _executeFlexberryLookupTest, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('changes in model\'s value causes changes in component\'s specified \'belongsTo\' model', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var $lookup, $lookupInput, controller, model, query, suggestionTypes, suggestionType;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(2);
              _context.next = 3;
              return visit('components-acceptance-tests/flexberry-lookup/base-operations');

            case 3:
              $lookup = Ember.$('.flexberry-lookup');
              $lookupInput = Ember.$('input', $lookup);

              assert.strictEqual($lookupInput.val(), '', 'lookup display value is empty by default');

              controller = app.__container__.lookup('controller:' + currentRouteName());
              model = Ember.get(controller, 'model');

              // Создаем запрос

              query = new _builder.default(store).from('ember-flexberry-dummy-suggestion-type').selectByProjection('SettingLookupExampleView');

              // Загружаем данные

              _context.next = 11;
              return store.query('ember-flexberry-dummy-suggestion-type', query.build());

            case 11:
              suggestionTypes = _context.sent;
              suggestionType = suggestionTypes.get('firstObject');


              Ember.run(function () {
                model.set('type', suggestionType);
              });

              _context.next = 16;
              return (0, _testHelpers.settled)();

            case 16:
              // Убедитесь, что все асинхронные операции завершены

              // Проверяем значение после обновления модели
              $lookupInput = Ember.$('input', $lookup);
              assert.strictEqual($lookupInput.val(), suggestionType.get('name'), 'lookup display value isn\'t empty');

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', ['exports', 'qunit', 'dummy/tests/helpers/start-app'], function (exports, _qunit, _startApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.executeTest = executeTest;

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  function executeTest(testName, callback, additionalBeforeEachSettings) {
    var app = void 0;
    var store = void 0;
    var latestReceivedRecords = Ember.A();

    (0, _qunit.module)('Acceptance | flexberry-lookup-base | ' + testName, {
      beforeEach: function beforeEach() {
        // Start application.
        app = (0, _startApp.default)();

        // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
        var applicationController = app.__container__.lookup('controller:application');
        applicationController.set('isInAcceptanceTestMode', true);

        // Override store.query method to receive & remember records which will be requested by lookup dialog.
        store = app.__container__.lookup('service:store');
        var originalQueryMethod = store.query;
        store.query = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return originalQueryMethod.apply(this, args).then(function (records) {
            latestReceivedRecords.clear();
            latestReceivedRecords.addObjects(records.toArray());
            return records;
          });
        };

        if (!Ember.isNone(additionalBeforeEachSettings) && typeof additionalBeforeEachSettings === 'function') {
          additionalBeforeEachSettings(app, store);
        }
      },
      afterEach: function afterEach() {
        // Remove semantic ui modal dialog's dimmer.
        Ember.$('body .ui.dimmer.modals').remove();

        // Destroy application.
        Ember.run(app, 'destroy');
      }
    });

    (0, _qunit.test)(testName, function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return callback(store, assert, app, latestReceivedRecords);

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-actions-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', '@ember/test-helpers'], function (_executeFlexberryLookupTest, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup actions test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var controller, $onRemoveData, $onChooseData, $lookupButtonChoose, $lookupButtonRemove;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(5);

              controller = app.__container__.lookup('controller:components-acceptance-tests/flexberry-lookup/settings-example-actions');

              // Remap remove action.

              $onRemoveData = void 0;

              Ember.set(controller, 'actions.externalRemoveAction', function (actual) {
                $onRemoveData = actual;
                assert.notEqual($onRemoveData, undefined, 'Component sends \'remove\' action after first click');
                assert.strictEqual($onRemoveData.relationName, 'type', 'Component sends \'remove\' with actual relationName');
              });

              // Remap choose action.
              $onChooseData = void 0;

              Ember.set(controller, 'actions.externalChooseAction', function (actual) {
                $onChooseData = actual;
                assert.notEqual($onChooseData, undefined, 'Component sends \'choose\' action after first click');
                assert.strictEqual($onChooseData.componentName, 'flexberry-lookup', 'Component sends \'choose\' with actual componentName');
                assert.strictEqual($onChooseData.projection, 'SettingLookupExampleView', 'Component sends \'choose\' with actual projection');
              });

              _context.next = 8;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-actions');

            case 8:
              _context.next = 10;
              return (0, _testHelpers.settled)();

            case 10:
              $lookupButtonChoose = Ember.$('.ui-change');
              $lookupButtonRemove = Ember.$('.ui-clear');

              // Simulate clicks on the buttons

              Ember.run(function () {
                $lookupButtonChoose.click();
                $lookupButtonRemove.click();
              });

              // Wait for any asynchronous operations to complete
              _context.next = 15;
              return (0, _testHelpers.settled)();

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-autocomplete-en-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', 'dummy/tests/acceptance/components/flexberry-lookup/lookup-test-functions', '@ember/test-helpers'], function (_executeFlexberryLookupTest, _lookupTestFunctions, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup autocomplete message en', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, textbox, $message, $messageHeader, $messageDescription;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(4);
              path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
              _context.next = 4;
              return visit(path);

            case 4:
              assert.equal(currentPath(), path, 'Navigated to the correct path');

              _context.next = 7;
              return (0, _lookupTestFunctions.loadingLocales)('en', app);

            case 7:
              textbox = Ember.$('.ember-text-field')[0];
              _context.next = 10;
              return fillIn(textbox, 'gfhfkjglkhlh');

            case 10:
              _context.next = 12;
              return (0, _testHelpers.settled)();

            case 12:
              _context.next = 14;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 6000);
              });

            case 14:

              // Check for the message
              $message = Ember.$('.message');

              assert.strictEqual($message.hasClass('empty'), true, 'Component\'s wrapper has message');

              $messageHeader = $message.children('.header');

              assert.equal($messageHeader.text(), 'No results', 'Message\'s header is properly');

              $messageDescription = $message.children('.description');

              assert.equal($messageDescription.text(), 'No results found', 'Message\'s description is properly');

            case 20:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-autocomplete-ru-test', ['@ember/test-helpers', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', 'dummy/tests/acceptance/components/flexberry-lookup/lookup-test-functions'], function (_testHelpers, _executeFlexberryLookupTest, _lookupTestFunctions) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup autocomplete message ru', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, textbox, $message, $messageHeader, $messageDescription;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(4);
              path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
              _context.next = 4;
              return visit(path);

            case 4:
              assert.equal(currentPath(), path, 'The current URL is correct');

              _context.next = 7;
              return (0, _lookupTestFunctions.loadingLocales)('ru', app);

            case 7:
              textbox = Ember.$('.ember-text-field')[0];
              _context.next = 10;
              return fillIn(textbox, 'gfhfkjglkhlh');

            case 10:
              _context.next = 12;
              return (0, _testHelpers.settled)();

            case 12:
              _context.next = 14;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 6000);
              });

            case 14:
              $message = Ember.$('.message');

              assert.ok($message.hasClass('empty'), 'Component\'s wrapper has message');

              $messageHeader = $message.children('.header');

              assert.equal($messageHeader.text(), 'Нет данных', 'Message\'s header is properly');

              $messageDescription = $message.children('.description');

              assert.equal($messageDescription.text(), 'Значения не найдены', 'Message\'s description is properly');

            case 20:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-autofill-by-limit-test', ['@ember/test-helpers', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_testHelpers, _executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup autofillByLimit in readonly test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert) {
      var $lookupField, value;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(1);
              _context.next = 3;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');

            case 3:
              $lookupField = document.querySelector('.isreadonly .lookup-field');
              value = $lookupField.value;

              assert.ok(Ember.isBlank(value), 'Value was changed');

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup autofillByLimit is clean test', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(store, assert) {
      var $lookupField, value, $clearButton, valueUpdate;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              assert.expect(2);
              _context2.next = 3;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');

            case 3:
              _context2.next = 5;
              return (0, _testHelpers.settled)();

            case 5:
              $lookupField = document.querySelector('.isclean .lookup-field');
              value = $lookupField.value;

              assert.notOk(Ember.isBlank(value), 'Value wasn\'t changed');

              $clearButton = document.querySelector('.isclean .ui-clear');
              _context2.next = 11;
              return (0, _testHelpers.click)($clearButton);

            case 11:
              _context2.next = 13;
              return (0, _testHelpers.settled)();

            case 13:
              valueUpdate = $lookupField.value;

              assert.ok(Ember.isBlank(valueUpdate), 'Value isn\'t empty');

            case 15:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup autofillByLimit changes select value test', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(store, assert, app) {
      var controller, defaultValue, $lookupField, value;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              assert.expect(1);
              _context3.next = 3;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');

            case 3:
              controller = app.__container__.lookup('controller:' + currentRouteName());
              defaultValue = controller.defaultValue.id;
              $lookupField = document.querySelector('.exist .lookup-field');
              value = $lookupField.value;


              assert.notEqual(defaultValue, value, 'DefaultValue: \'' + defaultValue + '\' didn\'t change');

            case 8:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function (_x5, _x6, _x7) {
      return _ref3.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-custom-window-test', ['ember-flexberry-data/query/builder', 'ember-flexberry-data/query/condition', 'ember-flexberry-data/query/filter-operator', 'ember-flexberry-data/query/predicate', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_builder, _condition, _filterOperator, _predicate, _executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup custom window test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var modelName, waitTime, nameEtalone, eMailEtalone, sp1, sp2, cp, storeInstance, builder, result, arr, $lookupChooseButton, $filterElementOnToolbar, $filterInput, $filterApplyButton, lookupController, currentModel, filteredByCommonProjectionCountN, $closeIcon, testController, filteredByFilterProjectionCount, filteredByFilterProjectionCount2, filteredInAnotherLookup;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-custom-window');

            case 2:
              modelName = 'ember-flexberry-dummy-application-user';
              waitTime = 2000;
              nameEtalone = void 0;
              eMailEtalone = void 0;


              assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-custom-window');

              sp1 = new _predicate.SimplePredicate('name', _filterOperator.default.Neq, '');
              sp2 = new _predicate.SimplePredicate('eMail', _filterOperator.default.Neq, '');
              cp = new _predicate.ComplexPredicate(_condition.default.And, sp1, sp2);
              storeInstance = app.__container__.lookup('service:store');
              builder = new _builder.default(storeInstance).from(modelName).selectByProjection('ApplicationUserL').where(cp).top(1);
              _context.next = 14;
              return storeInstance.query(modelName, builder.build());

            case 14:
              result = _context.sent;
              arr = result.toArray();

              nameEtalone = arr.objectAt(0).get('name');
              eMailEtalone = arr.objectAt(0).get('eMail');

              assert.notEqual(nameEtalone, eMailEtalone);

              $lookupChooseButton = Ember.$('.ui-change');

              assert.equal($lookupChooseButton.length, 4);

              Ember.run(function () {
                $lookupChooseButton[0].click();
              });

              _context.next = 24;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 24:
              $filterElementOnToolbar = Ember.$('div.olv-search');

              assert.equal($filterElementOnToolbar.length, 1, 'Lookup window has filter element on toolbar.');

              $filterInput = Ember.$('div.olv-search input');
              $filterApplyButton = Ember.$('div.olv-search button.search-button');
              lookupController = app.__container__.lookup('controller:lookup-dialog');

              // 1) Filter by name as nameEtalone by common projection and get N records.

              Ember.run(function () {
                fillIn($filterInput, nameEtalone);
              });

              $filterApplyButton.click();
              _context.next = 33;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 33:
              currentModel = Ember.get(lookupController, 'model');
              filteredByCommonProjectionCountN = Ember.get(currentModel, 'meta.count');

              assert.ok(filteredByCommonProjectionCountN >= 1, 'Found ' + filteredByCommonProjectionCountN + ' records by common projection filtered by "' + nameEtalone + '".');

              // Close for proper initiation of filter projection name.
              $closeIcon = Ember.$('i.close');

              Ember.run(function () {
                $closeIcon.click();
              });

              _context.next = 40;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 40:

              // 2) Filter by eMail as eMailEtalone by filter projection containing only eMail property and get at least 1 record.
              testController = app.__container__.lookup('controller:' + currentRouteName());

              Ember.run(function () {
                Ember.set(testController, 'filterProjectionName', 'TestLookupCustomWindow');
                Ember.set(testController, 'projectionName', 'ApplicationUserE');
              });

              Ember.run(function () {
                $lookupChooseButton[0].click();
              });

              _context.next = 45;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 45:

              $filterElementOnToolbar = Ember.$('div.olv-search');
              assert.equal($filterElementOnToolbar.length, 1, 'Lookup window has filter element on toolbar.');
              $filterInput = Ember.$('div.olv-search input');
              $filterApplyButton = Ember.$('div.olv-search button.search-button');
              Ember.run(function () {
                fillIn($filterInput, eMailEtalone);
              });
              $filterApplyButton.click();

              _context.next = 53;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 53:

              currentModel = Ember.get(lookupController, 'model');
              filteredByFilterProjectionCount = Ember.get(currentModel, 'meta.count');

              assert.ok(filteredByFilterProjectionCount >= 1, 'Found ' + filteredByFilterProjectionCount + ' records by filter projection filtered by "' + eMailEtalone + '".');

              // 3) Filter by name as nameEtalone by filter projection containing only eMail property and get less than N records.
              $filterElementOnToolbar = Ember.$('div.olv-search');
              assert.equal($filterElementOnToolbar.length, 1, 'Lookup window has filter element on toolbar.');
              $filterInput = Ember.$('div.olv-search input');
              $filterApplyButton = Ember.$('div.olv-search button.search-button');
              Ember.run(function () {
                fillIn($filterInput, nameEtalone);
              });
              $filterApplyButton.click();

              _context.next = 64;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 64:

              currentModel = Ember.get(lookupController, 'model');
              filteredByFilterProjectionCount2 = Ember.get(currentModel, 'meta.count');

              assert.ok(filteredByCommonProjectionCountN > filteredByFilterProjectionCount2, 'Found ' + filteredByFilterProjectionCount2 + ' records by filter projection filtered by "' + nameEtalone + '".');

              // 4) Open another lookup and check that filter projection name is not used and controller is clear from old options.
              $closeIcon = Ember.$('i.close');
              Ember.run(function () {
                $closeIcon.click();
              });

              _context.next = 71;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 71:

              Ember.run(function () {
                $lookupChooseButton[1].click();
              });

              _context.next = 74;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 74:

              $filterElementOnToolbar = Ember.$('div.olv-search');
              assert.equal($filterElementOnToolbar.length, 1, 'Another lookup window has filter element on toolbar.');
              $filterInput = Ember.$('div.olv-search input');
              $filterApplyButton = Ember.$('div.olv-search button.search-button');
              Ember.run(function () {
                fillIn($filterInput, nameEtalone);
              });
              $filterApplyButton.click();

              _context.next = 82;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 82:

              currentModel = Ember.get(lookupController, 'model');
              filteredInAnotherLookup = Ember.get(currentModel, 'meta.count');

              assert.equal(filteredInAnotherLookup, filteredByCommonProjectionCountN, 'Found ' + filteredInAnotherLookup + ' records in another lookup filtered by "' + nameEtalone + '".');

            case 85:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup on groupedit custom window test', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(store, assert, app) {
      var modelName, waitTime, nameEtalone, eMailEtalone, sp1, sp2, cp, storeInstance, builder, result, arr, $lookupChooseButton, $filterElementOnToolbar, $filterInput, $filterApplyButton, lookupController, currentModel, filteredByCommonProjectionCountN, $closeIcon, filteredByFilterProjectionCount, filteredByFilterProjectionCount2, filteredInAnotherLookup;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-custom-window');

            case 2:
              modelName = 'ember-flexberry-dummy-application-user';
              waitTime = 2000;
              nameEtalone = void 0;
              eMailEtalone = void 0;


              assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-custom-window');

              sp1 = new _predicate.SimplePredicate('name', _filterOperator.default.Neq, '');
              sp2 = new _predicate.SimplePredicate('eMail', _filterOperator.default.Neq, '');
              cp = new _predicate.ComplexPredicate(_condition.default.And, sp1, sp2);
              storeInstance = app.__container__.lookup('service:store');
              builder = new _builder.default(storeInstance).from(modelName).selectByProjection('ApplicationUserL').where(cp).top(1);
              _context2.next = 14;
              return storeInstance.query(modelName, builder.build());

            case 14:
              result = _context2.sent;
              arr = result.toArray();

              nameEtalone = arr.objectAt(0).get('name');
              eMailEtalone = arr.objectAt(0).get('eMail');

              assert.notEqual(nameEtalone, eMailEtalone);

              $lookupChooseButton = Ember.$('.ui-change');

              assert.equal($lookupChooseButton.length, 4);

              Ember.run(function () {
                $lookupChooseButton[2].click();
              });

              _context2.next = 24;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 24:
              $filterElementOnToolbar = Ember.$('div.olv-search');

              assert.equal($filterElementOnToolbar.length, 1, 'Lookup window from groupedit has filter element on toolbar.');

              $filterInput = Ember.$('div.olv-search input');
              $filterApplyButton = Ember.$('div.olv-search button.search-button');
              lookupController = app.__container__.lookup('controller:lookup-dialog');

              // 1) Filter by name as nameEtalone by common projection and get N records.

              Ember.run(function () {
                fillIn($filterInput, nameEtalone);
              });

              $filterApplyButton.click();
              _context2.next = 33;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 33:
              currentModel = Ember.get(lookupController, 'model');
              filteredByCommonProjectionCountN = Ember.get(currentModel, 'meta.count');

              assert.ok(filteredByCommonProjectionCountN >= 1, 'Found ' + filteredByCommonProjectionCountN + ' records by common projection filtered by "' + nameEtalone + '".');

              $closeIcon = Ember.$('i.close');

              Ember.run(function () {
                $closeIcon.click();
              });

              _context2.next = 40;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 40:

              // 2) Filter by eMail as eMailEtalone by filter projection containing only eMail property and get at least 1 record.
              Ember.run(function () {
                $lookupChooseButton[3].click();
              });

              _context2.next = 43;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 43:

              $filterElementOnToolbar = Ember.$('div.olv-search');
              assert.equal($filterElementOnToolbar.length, 1, 'Lookup window from groupedit has filter element on toolbar.');
              $filterInput = Ember.$('div.olv-search input');
              $filterApplyButton = Ember.$('div.olv-search button.search-button');
              Ember.run(function () {
                fillIn($filterInput, eMailEtalone);
              });
              $filterApplyButton.click();

              _context2.next = 51;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 51:

              currentModel = Ember.get(lookupController, 'model');
              filteredByFilterProjectionCount = Ember.get(currentModel, 'meta.count');

              assert.ok(filteredByFilterProjectionCount >= 1, 'Found ' + filteredByFilterProjectionCount + ' records by filter projection filtered by "' + eMailEtalone + '".');

              // 3) Filter by name as nameEtalone by filter projection containing only eMail property and get less than N records.
              $filterElementOnToolbar = Ember.$('div.olv-search');
              assert.equal($filterElementOnToolbar.length, 1, 'Lookup window has filter element on toolbar.');
              $filterInput = Ember.$('div.olv-search input');
              $filterApplyButton = Ember.$('div.olv-search button.search-button');
              Ember.run(function () {
                fillIn($filterInput, nameEtalone);
              });
              $filterApplyButton.click();

              _context2.next = 62;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 62:

              currentModel = Ember.get(lookupController, 'model');
              filteredByFilterProjectionCount2 = Ember.get(currentModel, 'meta.count');

              assert.ok(filteredByCommonProjectionCountN > filteredByFilterProjectionCount2, 'Found ' + filteredByFilterProjectionCount2 + ' records by filter projection filtered by "' + nameEtalone + '".');

              // 4) Open another lookup and check that filter projection name is not used and controller is clear from old options.
              $closeIcon = Ember.$('i.close');
              Ember.run(function () {
                $closeIcon.click();
              });

              _context2.next = 69;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 69:

              Ember.run(function () {
                $lookupChooseButton[2].click();
              });

              _context2.next = 72;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 72:

              $filterElementOnToolbar = Ember.$('div.olv-search');
              assert.equal($filterElementOnToolbar.length, 1, 'Another lookup window from groupedit has filter element on toolbar.');
              $filterInput = Ember.$('div.olv-search input');
              $filterApplyButton = Ember.$('div.olv-search button.search-button');
              Ember.run(function () {
                fillIn($filterInput, nameEtalone);
              });
              $filterApplyButton.click();

              _context2.next = 80;
              return new Promise(function (resolve) {
                return setTimeout(resolve, waitTime);
              });

            case 80:

              currentModel = Ember.get(lookupController, 'model');
              filteredInAnotherLookup = Ember.get(currentModel, 'meta.count');

              assert.equal(filteredInAnotherLookup, filteredByCommonProjectionCountN, 'Found ' + filteredInAnotherLookup + ' records in another lookup filtered by "' + nameEtalone + '".');

            case 83:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-default-ordering-test', ['@ember/test-helpers', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_testHelpers, _executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup default ordering test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, checkHeaderOrder, $lookupChooseButton, $menuNextPageButton, $menuCloseButton, $defaultSortingButton;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              checkHeaderOrder = function checkHeaderOrder() {
                var defaultSorting = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                var $menuTableHeaders = Ember.$('.content table.object-list-view thead tr th');
                $menuTableHeaders.each(function () {
                  var $header = $(this).children('div');
                  var $headerName = $header.attr('data-olv-header-property-name');
                  var $headerOrder = $header.children('.object-list-view-order-icon');
                  var $headerOrderTitle = $headerOrder.children('div').attr('title');

                  var columnIsName = $headerName === 'name';

                  if (columnIsName && !defaultSorting) {
                    assert.equal($headerOrder.length === 0, true, $headerName + ' has no sorting');
                    return;
                  }

                  assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);

                  if (!columnIsName && defaultSorting) {
                    click($header);
                  }
                });
              };

              assert.expect(9);
              path = 'components-examples/flexberry-lookup/default-ordering-example';
              _context.next = 5;
              return visit(path);

            case 5:
              _context.next = 7;
              return (0, _testHelpers.settled)();

            case 7:
              assert.equal(currentPath(), path);

              $lookupChooseButton = Ember.$('.flexberry-lookup .ui-change')[0];

              // Default sorting

              _context.next = 11;
              return click($lookupChooseButton);

            case 11:
              _context.next = 13;
              return (0, _testHelpers.settled)();

            case 13:
              checkHeaderOrder(true);

              // Changed sorting check
              _context.next = 16;
              return (0, _testHelpers.settled)();

            case 16:
              checkHeaderOrder();
              $menuNextPageButton = Ember.$('.ui.basic.buttons').children('.next-page-button');
              _context.next = 20;
              return click($menuNextPageButton);

            case 20:
              _context.next = 22;
              return (0, _testHelpers.settled)();

            case 22:
              checkHeaderOrder();
              $menuCloseButton = Ember.$('.close.icon');
              _context.next = 26;
              return click($menuCloseButton);

            case 26:
              _context.next = 28;
              return (0, _testHelpers.settled)();

            case 28:
              _context.next = 30;
              return click($lookupChooseButton);

            case 30:
              _context.next = 32;
              return (0, _testHelpers.settled)();

            case 32:
              checkHeaderOrder();
              $defaultSortingButton = Ember.$('.ui.button.default-sort');
              _context.next = 36;
              return click($defaultSortingButton);

            case 36:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-default-user-setting-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup render olv with default user setting test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var $lookupChooseButton, $lookupSearch, $lookupSearchThead, $lookupSearchTr, $lookupHeaders;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(2);

              _context.next = 3;
              return visit('components-examples/flexberry-lookup/user-settings-example');

            case 3:

              assert.equal(currentURL(), 'components-examples/flexberry-lookup/user-settings-example');

              $lookupChooseButton = Ember.$('.ui-change');

              // Click choose button.

              _context.next = 7;
              return click($lookupChooseButton);

            case 7:
              $lookupSearch = Ember.$('.content table.object-list-view');
              $lookupSearchThead = $lookupSearch.children('thead');
              $lookupSearchTr = $lookupSearchThead.children('tr');
              $lookupHeaders = $lookupSearchTr.children('th');

              // Check count at table header.

              assert.strictEqual($lookupHeaders.length, 2, 'Component render olv with default user setting');

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }(), function (app) {
    var service = app.__container__.lookup('service:user-settings');
    service.getCurrentUserSetting = function () {
      return Ember.Object.create({});
    };
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-events-test', ['sinon', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', 'dummy/tests/acceptance/components/flexberry-lookup/lookup-test-functions'], function (_sinon, _executeFlexberryLookupTest, _lookupTestFunctions) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup events test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var lookupEventsService, spy, $lookupChooseButton, compareLookupModalWindowData, $lookupDialog, $header;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-events');

            case 2:

              assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-events');
              lookupEventsService = app.__container__.lookup('service:lookup-events');

              assert.notEqual(lookupEventsService, null);

              // Spy on event triggering.
              spy = _sinon.default.spy(lookupEventsService, "lookupDialogOnDataLoadedTrigger");
              $lookupChooseButton = Ember.$('.ui-change');

              assert.ok(spy.notCalled);

              compareLookupModalWindowData = function compareLookupModalWindowData(spyCallCountExpected, isInitialCallExpected) {
                assert.equal(spy.callCount, spyCallCountExpected);
                if (spy.callCount !== spyCallCountExpected) {
                  return;
                }

                var callArgs = spy.args[spy.callCount - 1];
                assert.equal(callArgs.length, 3);
                var dataLoaded = callArgs[1];
                var isInitialCall = callArgs[2];
                assert.equal(isInitialCall, isInitialCallExpected);

                var $lookupDialog = Ember.$('.flexberry-modal');
                var $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
                var lookupRecordCount = $records.length;
                assert.equal(dataLoaded.content.length, lookupRecordCount);

                // Comparison data from spy and olv table.
                for (var i = 0; i < lookupRecordCount; i++) {
                  var suggestionTypeName = Ember.get(dataLoaded.content[i]._record, 'name');
                  var $cellText = Ember.$($records[i]).children('td').eq(1).text().trim();
                  assert.strictEqual($cellText, suggestionTypeName);
                }
              };

              // Wait for lookup dialog to be opened.


              _context.next = 11;
              return (0, _lookupTestFunctions.loadingList)($lookupChooseButton, '.flexberry-modal', '.content table.object-list-view tbody tr');

            case 11:
              compareLookupModalWindowData(1, true);

              // Call reload on modal window without closing it.
              $lookupDialog = Ember.$('.flexberry-modal');
              $header = Ember.$('.content table.object-list-view thead tr th', $lookupDialog).eq(1);

              assert.equal(spy.callCount, 1);

              // Lookup dialog successfully opened & data is loaded.
              // Try to change sorting.
              _context.next = 17;
              return (0, _lookupTestFunctions.loadingList)($header, '.flexberry-modal', '.content table.object-list-view tbody tr');

            case 17:
              compareLookupModalWindowData(2, false);

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-limit-function-test', ['ember-flexberry-data/query/builder', 'ember-flexberry-data/query/predicate', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_builder, _predicate, _executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup limit function test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var $limitFunctionButton, $lookupChooseButton, controller, limitType, queryPredicate, query, suggestionTypes, suggestionTypesArr, suggestionModelLength, $lookupSearch, $lookupSearchTr, $suggestionTableLength, i, suggestionType, suggestionTypeName, $cell, $cellText;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

            case 2:

              assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

              $limitFunctionButton = Ember.$('.limitFunction');
              $lookupChooseButton = Ember.$('.ui-change');


              Ember.run(function () {
                click($limitFunctionButton);
                click($lookupChooseButton);
              });

              controller = app.__container__.lookup('controller:' + currentRouteName());
              limitType = controller.limitType;
              queryPredicate = new _predicate.StringPredicate('name').contains(limitType);

              // Create limit for query.

              query = new _builder.default(store).from('ember-flexberry-dummy-suggestion-type').selectByProjection('SettingLookupExampleView').where(queryPredicate);

              // Load olv data.

              _context.next = 12;
              return store.query('ember-flexberry-dummy-suggestion-type', query.build());

            case 12:
              suggestionTypes = _context.sent;
              suggestionTypesArr = suggestionTypes.toArray();
              suggestionModelLength = suggestionTypesArr.length;
              $lookupSearch = Ember.$('.content table.object-list-view');
              $lookupSearchTr = $lookupSearch.children('tbody').children('tr');
              $suggestionTableLength = $lookupSearchTr.length;


              assert.expect(2 + $suggestionTableLength);

              assert.strictEqual(suggestionModelLength >= $suggestionTableLength, true, 'Correct number of values restrictions limiting function');

              // Comparison data in the model and olv table.
              for (i = 0; i < $suggestionTableLength; i++) {
                suggestionType = suggestionTypesArr.objectAt(i);
                suggestionTypeName = suggestionType.get('name');
                $cell = Ember.$($lookupSearchTr[i]).children('td').eq(1); // Assuming name is in the second column

                $cellText = $cell.children('div').text().trim();


                assert.strictEqual(suggestionTypeName, $cellText, 'Correct data at lookup\'s olv');
              }

            case 21:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-prefer-developer-to-default-user-setting-test', ['@ember/test-helpers', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_testHelpers, _executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup prefer developer to default user setting test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert) {
      var $lookupButtonChoose, $lookupSearch, $lookupSearchThead, $lookupSearchTr, $lookupHeaders;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(2);

              _context.next = 3;
              return visit('components-examples/flexberry-lookup/user-settings-example');

            case 3:
              assert.equal(currentURL(), 'components-examples/flexberry-lookup/user-settings-example');

              $lookupButtonChoose = Ember.$('.ui-change');

              // Click choose button.

              Ember.run(function () {
                click($lookupButtonChoose);
              });

              // Wait for the table to be updated.
              _context.next = 8;
              return (0, _testHelpers.settled)();

            case 8:
              $lookupSearch = Ember.$('.content table.object-list-view');
              $lookupSearchThead = $lookupSearch.children('thead');
              $lookupSearchTr = $lookupSearchThead.children('tr');
              $lookupHeaders = $lookupSearchTr.children('th');

              // Check count at table header.

              assert.strictEqual($lookupHeaders.length === 1, true, 'Component renders OLV with developer user setting');

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-prefer-stored-to-default-user-setting-test', ['@ember/test-helpers', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_testHelpers, _executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup prefer stored to default user setting test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert) {
      var $lookupButtonChoose, $lookupSearch, $lookupSearchThead, $lookupSearchTr, $lookupHeaders;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(2);

              _context.next = 3;
              return visit('components-examples/flexberry-lookup/user-settings-example');

            case 3:
              assert.equal(currentURL(), 'components-examples/flexberry-lookup/user-settings-example');

              $lookupButtonChoose = Ember.$('.ui-change');

              // Click choose button.

              Ember.run(function () {
                click($lookupButtonChoose);
              });

              // Wait for the table to be updated.
              _context.next = 8;
              return (0, _testHelpers.settled)();

            case 8:
              $lookupSearch = Ember.$('.content table.object-list-view');
              $lookupSearchThead = $lookupSearch.children('thead');
              $lookupSearchTr = $lookupSearchThead.children('tr');
              $lookupHeaders = $lookupSearchTr.children('th');

              // Check count at table header.

              assert.strictEqual($lookupHeaders.length === 1, true, 'Component renders OLV with user setting');

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }(), function (app) {
    var service = app.__container__.lookup('service:user-settings');
    service.getCurrentUserSetting = function () {
      return Ember.Object.create({
        colsOrder: [{
          propName: 'name'
        }]
      });
    };
  });
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-preview-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup preview in modal test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, controller, testName, $inModal, $modal, $form, $field, value;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(2);
              path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
              _context.next = 4;
              return visit(path);

            case 4:

              assert.equal(currentPath(), path);

              controller = app.__container__.lookup('controller:' + currentRouteName());
              testName = controller.testName;
              $inModal = Ember.$('.in-modal');
              _context.next = 10;
              return click('.ui-preview', $inModal);

            case 10:
              $modal = Ember.$('.modal');
              $form = Ember.$('.form', $modal);
              $field = Ember.$('.flexberry-field .flexberry-textbox', $form);
              value = $field.children('input').val();

              assert.equal(value, testName);

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup preview in separate route test', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(store, assert, app) {
      var path, controller, testName, $inSeparateRoute, $form, $field, value;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              assert.expect(2);
              path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
              _context2.next = 4;
              return visit(path);

            case 4:

              assert.equal(currentPath(), path);

              controller = app.__container__.lookup('controller:' + currentRouteName());
              testName = controller.testName;
              $inSeparateRoute = Ember.$('.in-separate-route');
              _context2.next = 10;
              return click('.ui-preview', $inSeparateRoute);

            case 10:
              $form = Ember.$('.form');
              $field = Ember.$('.flexberry-field .flexberry-textbox', $form);
              value = $field.children('input').val();

              assert.equal(value, testName);

            case 14:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }());

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup preview in groupedit test', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(store, assert, app) {
      var path, controller, testName, $inGroupedit, $form, $field, value;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              assert.expect(2);
              path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
              _context3.next = 4;
              return visit(path);

            case 4:

              assert.equal(currentPath(), path);

              controller = app.__container__.lookup('controller:' + currentRouteName());
              testName = controller.testName;
              $inGroupedit = Ember.$('.in-groupedit');
              _context3.next = 10;
              return click('.ui-preview', $inGroupedit);

            case 10:
              $form = Ember.$('.form');
              $field = Ember.$('.flexberry-field .flexberry-textbox', $form);
              value = $field.children('input').val();

              assert.equal(value, testName);

            case 14:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function (_x7, _x8, _x9) {
      return _ref3.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-projection-test', ['@ember/test-helpers', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_testHelpers, _executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup projection test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var $lookupButtonChoose, $lookupSearch, $lookupSearchThead, $lookupSearchTr, $lookupHeaders;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(2);

              _context.next = 3;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-projection');

            case 3:

              assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-projection');

              $lookupButtonChoose = Ember.$('.ui-change');

              // Click choose button.

              _context.next = 7;
              return click($lookupButtonChoose);

            case 7:
              _context.next = 9;
              return (0, _testHelpers.settled)();

            case 9:
              $lookupSearch = Ember.$('.content table.object-list-view');
              $lookupSearchThead = $lookupSearch.children('thead');
              $lookupSearchTr = $lookupSearchThead.children('tr');
              $lookupHeaders = $lookupSearchTr.children('th');

              // Check count at table header.

              assert.strictEqual($lookupHeaders.length, 3, 'Component has SuggestionTypeE projection');

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-relation-name-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test', '@ember/test-helpers'], function (_executeFlexberryLookupTest, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup relation name test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var controller, relationName;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(1);

              _context.next = 3;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-relation-name');

            case 3:
              _context.next = 5;
              return (0, _testHelpers.settled)();

            case 5:
              // Дождаться завершения всех асинхронных операций

              controller = app.__container__.lookup('controller:' + currentRouteName());
              relationName = Ember.get(controller, 'relationName');


              assert.strictEqual(relationName, 'Temp relation name', 'relationName: \'' + relationName + '\' as expected');

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/flexberry-lookup-window-search-test', ['@ember/test-helpers', 'dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_testHelpers, _executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFlexberryLookupTest.executeTest)('flexberry-lookup window search test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, $lookupChooseButton, $windowSearchField, $lookupTable, $lookupTableBody, $lookupTableRow, $lookupTableRowText, sampleText, $windowSearchButton, $lookupTableRowTextAfterSearch;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(3);
              path = 'components-examples/flexberry-lookup/customizing-window-example';
              _context.next = 4;
              return visit(path);

            case 4:
              assert.equal(currentPath(), path);

              $lookupChooseButton = Ember.$('button.ui-change');
              _context.next = 8;
              return click($lookupChooseButton);

            case 8:
              _context.next = 10;
              return (0, _testHelpers.settled)();

            case 10:
              $windowSearchField = Ember.$('div.block-action-input').children('input');
              $lookupTable = Ember.$('.content table.object-list-view');
              $lookupTableBody = $lookupTable.children('tbody');
              $lookupTableRow = $lookupTableBody.children('tr');
              $lookupTableRowText = $lookupTableRow.find('div.oveflow-text').eq(2);


              assert.equal($windowSearchField.length, 1, 'search exists');

              sampleText = Ember.$.trim($lookupTableRowText.text());
              _context.next = 19;
              return fillIn($windowSearchField, sampleText);

            case 19:
              $windowSearchButton = Ember.$('button.search-button');
              _context.next = 22;
              return click($windowSearchButton);

            case 22:
              _context.next = 24;
              return (0, _testHelpers.settled)();

            case 24:
              $lookupTable = Ember.$('.content table.object-list-view');
              $lookupTableBody = $lookupTable.children('tbody');
              $lookupTableRow = $lookupTableBody.children('tr');
              $lookupTableRowTextAfterSearch = $lookupTableRow.find('div.oveflow-text').first();


              assert.equal(sampleText === Ember.$.trim($lookupTableRowTextAfterSearch.text()), true, 'search works');

            case 29:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/lookup-test-functions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var loadingList = exports.loadingList = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee($ctrlForClick, list, records) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', new Promise(function (resolve, reject) {
                var checkIntervalId = void 0;
                var checkIntervalSucceed = false;
                var checkInterval = 500;
                var timeout = 10000;

                // Клик по контроллеру.
                click($ctrlForClick);

                checkIntervalId = window.setInterval(function () {
                  var $list = Ember.$(list);
                  var $records = Ember.$(records, $list);
                  if ($records.length === 0) {
                    // Данные еще не загружены.
                    return;
                  }

                  // Данные загружены.
                  // Остановить интервал и разрешить промис.
                  window.clearInterval(checkIntervalId);
                  checkIntervalSucceed = true;
                  resolve($list);
                }, checkInterval);

                // Установить тайм-аут ожидания.
                window.setTimeout(function () {
                  if (checkIntervalSucceed) {
                    return;
                  }

                  // Время вышло.
                  // Остановить интервалы и отклонить промис.
                  window.clearInterval(checkIntervalId);
                  reject('editForm load operation is timed out');
                }, timeout);
              }));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function loadingList(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  var loadingLocales = exports.loadingLocales = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(locale, app) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', new Promise(function (resolve) {
                var i18n = app.__container__.lookup('service:i18n');

                i18n.set('locale', locale);

                var timeout = 500;
                setTimeout(function () {
                  resolve({ msg: 'ok' });
                }, timeout);
              }));

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function loadingLocales(_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();
});
define('dummy/tests/acceptance/components/flexberry-lookup/visiting-flexberry-lookup-autocomplete-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  /* eslint-disable no-unused-vars */
  (0, _executeFlexberryLookupTest.executeTest)('visiting flexberry-lookup autocomplete', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var $lookup, $lookupField, $result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              /* eslint-enable no-unused-vars */
              assert.expect(5);

              _context.next = 3;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

            case 3:

              assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

              $lookup = Ember.$('.flexberry-lookup');


              assert.strictEqual($lookup.hasClass('ui'), true, "Component's wrapper has 'ui' css-class");
              assert.strictEqual($lookup.hasClass('search'), true, "Component's wrapper has 'search' css-class");

              $lookupField = Ember.$('.lookup-field');


              assert.strictEqual($lookupField.hasClass('prompt'), true, "Component's wrapper has 'prompt' css-class");

              $result = Ember.$('.result');


              assert.strictEqual($result.length === 1, true, "Component has inner class 'result'");

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-lookup/visiting-flexberry-lookup-dropdown-test', ['dummy/tests/acceptance/components/flexberry-lookup/execute-flexberry-lookup-test'], function (_executeFlexberryLookupTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  /* eslint-disable no-unused-vars */
  (0, _executeFlexberryLookupTest.executeTest)('visiting flexberry-lookup dropdown', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var $lookupSearch, $lookupButtonChoose, $lookupButtonClear, $dropdown, $dropdownSearch, $dropdownIcon, $dropdownMenu, $dropdownText;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              /* eslint-enable no-unused-vars */
              assert.expect(13);

              _context.next = 3;
              return visit('components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

            case 3:

              assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

              // Получение компонентов и их внутренних элементов.
              $lookupSearch = Ember.$('.lookup-field');
              $lookupButtonChoose = Ember.$('.ui-change');
              $lookupButtonClear = Ember.$('.lookup-remove-button');


              assert.strictEqual($lookupSearch.length === 0, true, "Component hasn't flexberry-lookup");
              assert.strictEqual($lookupButtonChoose.length === 0, true, "Component hasn't button choose");
              assert.strictEqual($lookupButtonClear.length === 0, true, "Component hasn't button remove");

              // Получение компонентов и их внутренних элементов.
              $dropdown = Ember.$('.flexberry-dropdown.search.selection');
              $dropdownSearch = $dropdown.children('.search');
              $dropdownIcon = $dropdown.children('.dropdown.icon');
              $dropdownMenu = $dropdown.children('.menu');
              $dropdownText = $dropdown.children('.text');


              assert.strictEqual($dropdown.length === 1, true, 'Component has class flexberry-dropdown');
              assert.strictEqual($dropdown.hasClass('search'), true, "Component's wrapper has 'search' css-class");
              assert.strictEqual($dropdown.hasClass('selection'), true, "Component's wrapper has 'selection' css-class");
              assert.strictEqual($dropdown.hasClass('ember-view'), true, "Component's wrapper has 'ember-view' css-class");
              assert.strictEqual($dropdown.hasClass('dropdown'), true, "Component's wrapper has 'dropdown' css-class");

              assert.strictEqual($dropdownSearch.length === 1, true, 'Component has class search');
              assert.strictEqual($dropdownIcon.length === 1, true, 'Component has class dropdown and icon');
              assert.strictEqual($dropdownText.length === 1, true, 'Component has class text');
              assert.strictEqual($dropdownMenu.length === 1, true, 'Component has class menu');

            case 24:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-multiple-lookup/flexberry-multiple-lookup-configurate-tags-test', ['qunit', 'dummy/tests/helpers/start-app'], function (_qunit, _startApp) {
  'use strict';

  var app = void 0;
  var path = 'components-examples/flexberry-multiple-lookup/configurate-tags';
  var testName = 'configurate tags test';

  (0, _qunit.module)('Acceptance | flexberry-multiple-lookup | ' + testName, {
    beforeEach: function beforeEach() {
      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      Ember.set(applicationController, 'isInAcceptanceTestMode', true);
    },
    afterEach: function afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {
    assert.expect(7);

    visit(path);

    wait().then(function () {
      assert.equal(currentPath(), path, 'Path is correct');

      var $lookup = Ember.$('.flexberry-lookup');
      var $lookupButtouChoose = $lookup.find('.ui-change');

      Ember.run(function () {
        return $lookupButtouChoose.click();
      });

      wait().then(function () {
        var $olv = Ember.$('.object-list-view');
        var $tbody = $olv.find('td');

        Ember.run(function () {
          return $tbody[1].click();
        });

        wait().then(function () {
          var $tags = Ember.$('div a.ui.label');

          assert.strictEqual($tags.length, 1, 'Tag is rendered');

          var $deleteIcon = Ember.$($tags[0]).children('i.delete.icon');
          var username = $tags[0].innerText.split(' ').join('');

          assert.strictEqual($deleteIcon.length, 1, 'Delete icon is rendered');

          Ember.run(function () {
            return $deleteIcon.click();
          });

          wait().then(function () {
            $tags = Ember.$('div a.ui.label');

            assert.strictEqual($tags.length, 0, 'Tag removed');

            var $table = Ember.$('table.ui.celled.table.flexberry-word-break');
            var $fields = $table.find('.ember-text-field');
            var $checkboxes = $table.find('.ember-checkbox');

            fillIn($fields[0], username);
            fillIn($fields[1], 'red');

            Ember.run(function () {
              return $checkboxes[0].click();
            });
            Ember.run(function () {
              return $checkboxes[1].click();
            });
            Ember.run(function () {
              return $lookupButtouChoose.click();
            });

            wait().then(function () {
              $olv = Ember.$('.object-list-view');
              $tbody = $olv.find('td');

              Ember.run(function () {
                return $tbody[1].click();
              });

              wait().then(function () {
                $tags = Ember.$('div a.ui.label');

                assert.strictEqual($tags.length, 1, 'Tag is rendered');

                assert.strictEqual(Ember.$($tags[0]).hasClass('red'), true, 'Component\'s wrapper has \'red\' css-class');

                $deleteIcon = Ember.$($tags[0]).children('i.delete.icon');

                assert.strictEqual($deleteIcon.length, 0, 'Delete icon is not rendered');
              });
            });
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/checkbox-at-editform-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _folvTestsFunctions) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check checkbox at editform', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, controller, $folvContainer, $trTableBody, $cell, $editForm, checkbox;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(2);
              path = 'components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox';
              _context.next = 4;
              return visit(path);

            case 4:
              controller = app.__container__.lookup('controller:' + currentRouteName());
              $folvContainer = Ember.$('.object-list-view-container');
              $trTableBody = Ember.$('table.object-list-view tbody tr', $folvContainer);
              $cell = $trTableBody.length > 0 ? $trTableBody[0].children[1] : null;

              controller.set('rowClickable', true);

              // Загружаем форму редактирования
              _context.prev = 9;
              _context.next = 12;
              return (0, _folvTestsFunctions.loadingList)($cell, 'form.flexberry-vertical-form', '.field');

            case 12:
              $editForm = _context.sent;
              checkbox = Ember.$('.flexberry-checkbox');


              assert.ok($editForm, 'edit form open');
              assert.equal(checkbox.hasClass('checked'), true, 'checkbox is checked');
              _context.next = 21;
              break;

            case 18:
              _context.prev = 18;
              _context.t0 = _context['catch'](9);

              // Выводим ошибку
              assert.ok(false, _context.t0);

            case 21:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[9, 18]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/edit-in-modal-open-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/locales/ru/translations', '@ember/test-helpers'], function (_executeFolvTest, _translations, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check edit in modal open', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert) {
      var path, row, $editForm, closeButton;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(3);
              path = 'ember-flexberry-dummy-suggestion-type-list';
              _context.next = 4;
              return visit(path);

            case 4:
              assert.equal(currentURL(), path, 'Visited the correct path');

              row = document.querySelector('.field');
              _context.next = 8;
              return click(row);

            case 8:
              _context.next = 10;
              return (0, _testHelpers.settled)();

            case 10:
              // Wait for any pending promises

              $editForm = document.querySelector('.flexberry-modal');

              assert.ok($editForm, 'edit form open');
              assert.strictEqual($editForm.querySelector('.ui.header').innerText, Ember.get(_translations.default, 'forms.ember-flexberry-dummy-suggestion-type-edit.caption'), 'check header');

              closeButton = document.querySelector('.close-button');
              _context.next = 16;
              return click(closeButton);

            case 16:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/filther/folv-filter-on-toolbar-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/query/builder', 'ember-flexberry-data/query/condition', 'ember-flexberry-data/query/filter-operator', 'ember-flexberry-data/query/predicate', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _builder, _condition, _filterOperator, _predicate, _folvTestsFunctions) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check filter on toolbar with filter projection', function (store, assert, app) {
    assert.expect(5);
    var path = 'components-acceptance-tests/flexberry-objectlistview/custom-filter';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var adressEtalone = void 0;
    var typeNameEtalone = void 0;

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path);
      var sp1 = new _predicate.SimplePredicate('address', _filterOperator.default.Neq, '');
      var sp2 = new _predicate.SimplePredicate('type.name', _filterOperator.default.Neq, '');
      var cp = new _predicate.ComplexPredicate(_condition.default.And, sp1, sp2);

      var builder = new _builder.default(store).from(modelName).selectByProjection('SuggestionL').where(cp).top(1);
      store.query(modelName, builder.build()).then(function (result) {
        var arr = result.toArray();
        adressEtalone = arr.objectAt(0).get('address');
        typeNameEtalone = arr.objectAt(0).get('type.name');

        // TODO: add proper predicate on query that "address != type.name" when it will be availible.
        assert.notEqual(adressEtalone, typeNameEtalone);
      }).then(function () {
        var $filterInput = Ember.$('div.olv-search input');
        var $filterApplyButton = Ember.$('div.olv-search button.search-button');

        // 1) Filter by address as adressEtalone by common projection and get N records.
        fillIn($filterInput, adressEtalone);

        andThen(function () {
          var refreshFunction = function refreshFunction() {
            $filterApplyButton.click();
          };

          var controller = app.__container__.lookup('controller:' + currentRouteName());

          // Apply filter.
          var done1 = assert.async();
          (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
            var currentModel = Ember.get(controller, 'model');
            var filteredByCommonProjectionCountN = Ember.get(currentModel, 'meta.count');
            assert.ok(filteredByCommonProjectionCountN >= 1, 'Found ' + filteredByCommonProjectionCountN + ' records by common projection filtered by "' + adressEtalone + '".');

            // 2) Filter by type.name as typeNameEtalone by filter projection containing only type.name property and get at least 1 record.
            Ember.run(function () {
              Ember.set(controller, 'filterProjectionName', 'TestFilterOnToolbarView');
            });

            Ember.run(function () {
              fillIn($filterInput, typeNameEtalone);
            });

            var done2 = assert.async();
            (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
              var currentModel = Ember.get(controller, 'model');
              var filteredByFilterProjectionCount = Ember.get(currentModel, 'meta.count');
              assert.ok(filteredByFilterProjectionCount >= 1, 'Found ' + filteredByFilterProjectionCount + ' records by filter projection filtered by "' + typeNameEtalone + '".');

              // 3) Filter by address as adressEtalone by filter projection containing only type.name property and get less than N records.
              Ember.run(function () {
                fillIn($filterInput, adressEtalone);
              });

              var done3 = assert.async();
              (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller).then(function ($list) {
                var currentModel = Ember.get(controller, 'model');
                var filteredByFilterProjectionCount2 = Ember.get(currentModel, 'meta.count');
                assert.ok(filteredByCommonProjectionCountN > filteredByFilterProjectionCount2, 'Found ' + filteredByFilterProjectionCount2 + ' records by filter projection filtered by "' + adressEtalone + '".');

                Ember.run(function () {
                  Ember.set(controller, 'filterProjectionName', undefined);
                });
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
        filtreInsertValueArr = [arr.objectAt(0).get('address'), undefined, arr.objectAt(0).get('votes'), arr.objectAt(0).get('moderated').toString(), arr.objectAt(0).get('type.name'), arr.objectAt(0).get('author.name')];
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
            assert.equal(filtherResult.length >= 1, true, 'Filtered list is not empty');
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-check-config-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', '@ember/test-helpers'], function (_executeFolvTest, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check folv config', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert) {
      var path, config;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
              _context.next = 3;
              return visit(path);

            case 3:
              _context.next = 5;
              return (0, _testHelpers.settled)();

            case 5:
              // Ждем завершения всех асинхронных действий

              config = ['createNewButton', 'deleteButton', 'refreshButton', 'showDeleteMenuItemInRow'];


              checkOlvConfig('[data-test-olv]', null, assert, config);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-checked-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', '@ember/test-helpers'], function (_executeFolvTest, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('test checking', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert) {
      var path, $folvContainer, $row, $firstCell, $checkboxInRow, recordIsChecked;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(2);
              path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
              _context.next = 4;
              return visit(path);

            case 4:
              assert.equal(currentPath(), path, 'Visited the correct path');

              $folvContainer = document.querySelector('.object-list-view-container');
              $row = $folvContainer.querySelector('table.object-list-view tbody tr');

              // Mark first record.

              $firstCell = $row.querySelector('.object-list-view-helper-column-cell');
              $checkboxInRow = $firstCell.querySelector('.flexberry-checkbox');
              _context.next = 11;
              return click($checkboxInRow);

            case 11:
              _context.next = 13;
              return (0, _testHelpers.settled)();

            case 13:
              // Ждем завершения всех асинхронных действий

              recordIsChecked = $checkboxInRow.classList.contains('checked');

              assert.ok(recordIsChecked, 'First row is checked');

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-close-from-edit-form-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', '@ember/test-helpers'], function (_executeFolvTest, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check close button from edit form', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert) {
      var path;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(1);
              path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
              _context.next = 4;
              return visit(path);

            case 4:
              assert.equal(currentPath(), path, 'Visited the correct path');

              _context.next = 7;
              return (0, _testHelpers.settled)();

            case 7:
              // Ждем завершения всех асинхронных действий
              checkCloseEditForm('[data-test-olv]', null, assert, path);

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-colsconfig-column-localization-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'dummy/locales/ru/translations', 'dummy/locales/en/translations', '@ember/test-helpers'], function (_executeFolvTest, _folvTestsFunctions, _translations, _translations2, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check colsconfig column localization test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(store, assert, app) {
      var path, checkLocalization;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              assert.expect(21);
              path = 'ember-flexberry-dummy-suggestion-list';
              _context2.next = 4;
              return visit(path);

            case 4:
              assert.equal(currentPath(), path, 'Visited the correct path');

              checkLocalization = function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(currentLocale, locale) {
                  var columnsLocalization, $columns;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          columnsLocalization = Ember.get(currentLocale, 'models.ember-flexberry-dummy-suggestion.projections.SuggestionL');
                          _context.next = 3;
                          return click('.config-button');

                        case 3:
                          _context.next = 5;
                          return (0, _testHelpers.settled)();

                        case 5:
                          // Ждем завершения всех асинхронных действий

                          $columns = Ember.$('.flexberry-colsconfig tbody tr');

                          $columns.each(function (i, column) {
                            var cellText = column.cells[2].innerText;
                            var propname = column.getAttribute('propname').replace('.name', '');
                            var assertionMessage = locale + ' locale ' + propname + ' ok';
                            var caption = Ember.get(columnsLocalization, propname + '.__caption__');
                            assert.equal(caption, cellText, assertionMessage);
                          });

                          _context.next = 9;
                          return click('.close.icon');

                        case 9:
                          _context.next = 11;
                          return (0, _testHelpers.settled)();

                        case 11:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined);
                }));

                return function checkLocalization(_x4, _x5) {
                  return _ref2.apply(this, arguments);
                };
              }();

              _context2.next = 8;
              return (0, _folvTestsFunctions.loadingLocales)('en', app);

            case 8:
              _context2.next = 10;
              return checkLocalization(_translations2.default, 'En');

            case 10:
              _context2.next = 12;
              return (0, _folvTestsFunctions.loadingLocales)('ru', app);

            case 12:
              _context2.next = 14;
              return checkLocalization(_translations.default, 'Ru');

            case 14:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-column-config-save-button-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', '@ember/test-helpers'], function (_executeFolvTest, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check column config save button test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert) {
      var path, $field, $fieldInput;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(3);
              path = 'ember-flexberry-dummy-suggestion-list';
              _context.next = 4;
              return visit(path);

            case 4:
              assert.equal(currentPath(), path, 'Visited the correct path');

              _context.next = 7;
              return click('button.config-button');

            case 7:
              _context.next = 9;
              return (0, _testHelpers.settled)();

            case 9:
              // Ждем завершения всех асинхронных действий

              $field = document.querySelector('div.ui.action.input');
              $fieldInput = $field.querySelector('input');


              assert.equal($field.querySelectorAll('.cols-config-save.disabled').length === 1, true, 'button disabled');
              _context.next = 14;
              return fillIn($fieldInput, 'aaayyyeee leemaauuuu');

            case 14:
              _context.next = 16;
              return (0, _testHelpers.settled)();

            case 16:
              // Ждем завершения всех асинхронных действий

              assert.equal($field.querySelectorAll('.cols-config-save.disabled').length === 0, true, 'button active');

            case 17:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-configurate-row-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', '@ember/test-helpers'], function (_executeFolvTest, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check configurate row test', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, controller, $folvContainer, $positiveRows, $folvRow, $cell, $geRow;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(3);
              path = 'components-examples/flexberry-objectlistview/configurate-rows';
              _context.next = 4;
              return visit(path);

            case 4:
              _context.next = 6;
              return (0, _testHelpers.settled)();

            case 6:
              assert.equal(currentPath(), path, 'Visited the correct path');

              controller = app.__container__.lookup('controller:' + currentRouteName());
              $folvContainer = document.querySelectorAll('.object-list-view-container');
              $positiveRows = $folvContainer[0].querySelector('.positive');

              // Check positive row at folv.

              $folvRow = $positiveRows;
              $cell = $folvRow.querySelector('.oveflow-text');

              assert.equal($cell.innerText, controller.configurateRowByAddress || '', 'Positive row text matches');

              // Check positive row at GroupEdit.
              $geRow = $folvContainer[1].querySelector('.positive');

              $cell = $geRow.querySelector('.oveflow-text');
              assert.equal($cell.innerText, controller.configurateRowByAddress || '', 'Positive row text matches for GroupEdit');

            case 16:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-date-format-moment-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry/locales/ru/translations'], function (_executeFolvTest, _folvTestsFunctions, _translations) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('date format moment L', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, olvContainerClass, $toolBar, $refreshButton, controller, refreshFunction, moment, momentValue, $folvContainer, $table, $headRow, indexDate, $dateCell, dateFormatRuRe, findDateRu, dateFormatEnRe, dataCellStr, findDateEn;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(5);
              path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
              _context.next = 4;
              return visit(path);

            case 4:
              assert.equal(currentPath(), path, 'Correct path is visited');

              _context.next = 7;
              return (0, _folvTestsFunctions.loadingLocales)('ru', app);

            case 7:
              olvContainerClass = '.object-list-view-container';
              $toolBar = Ember.$('.ui.secondary.menu')[0];
              $refreshButton = $toolBar.children[0];


              assert.equal($refreshButton.innerText.trim(), Ember.get(_translations.default, 'components.olv-toolbar.refresh-button-text'), 'Button refresh exists');

              controller = app.__container__.lookup('controller:' + currentRouteName());

              refreshFunction = function refreshFunction() {
                var refreshButton = Ember.$('.refresh-button')[0];
                refreshButton.click();
              };

              _context.next = 15;
              return (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller);

            case 15:
              moment = app.__container__.lookup('service:moment');
              momentValue = Ember.get(moment, 'defaultFormat');

              assert.equal(momentValue, 'L', 'Moment value is \'L\'');

              $folvContainer = Ember.$(olvContainerClass);
              $table = Ember.$('table.object-list-view', $folvContainer);
              $headRow = Ember.$('thead tr', $table)[0].children;

              indexDate = function indexDate() {
                for (var index = 0; index < $headRow.length; index++) {
                  var $dateAttribute = Ember.$($headRow[index]).children('div');
                  if ($dateAttribute.length !== 0 && Ember.$.trim($dateAttribute[0].getAttribute('data-olv-header-property-name')) === 'date') {
                    return index;
                  }
                }
                return -1; // Если не найдено
              };

              $dateCell = function $dateCell() {
                return Ember.$.trim(Ember.$('tbody tr', $table)[0].children[indexDate()].innerText);
              };

              // Date format must be DD.MM.YYYY


              dateFormatRuRe = /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d/;
              findDateRu = dateFormatRuRe.exec($dateCell());


              assert.ok(findDateRu, 'Date format is \'DD.MM.YYYY\'');

              _context.next = 28;
              return (0, _folvTestsFunctions.loadingLocales)('en', app);

            case 28:
              _context.next = 30;
              return (0, _folvTestsFunctions.refreshListByFunction)(refreshFunction, controller);

            case 30:

              // Date format must be MM/DD/YYYY
              dateFormatEnRe = /(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/;
              dataCellStr = $dateCell();
              findDateEn = dateFormatEnRe.exec(dataCellStr);


              assert.ok(findDateEn, 'Date format is \'MM/DD/YYYY\'');

            case 34:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-record-from-e-form-test', ['qunit'], function (_qunit) {
  'use strict';

  // Need to add sort by multiple columns.
  (0, _qunit.skip)('check delete record from edit form', function (store, assert) {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-record-from-olv-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test'], function (_executeFolvTest) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check delete record from olv', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert) {
      var path, model, prop;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(1);

              path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
              _context.next = 4;
              return visit(path);

            case 4:

              assert.equal(currentPath(), path, 'Correct path is visited');

              model = 'ember-flexberry-dummy-suggestion-type';
              prop = 'name';
              _context.next = 9;
              return checkDeleteRecordFromOlv('[data-test-olv]', null, assert, store, model, prop);

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-delete-with-details-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-flexberry-data/utils/generate-unique-id', 'ember-flexberry-data/query/builder', 'ember-flexberry-data/query/predicate'], function (_executeFolvTest, _generateUniqueId, _builder, _predicate) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check delete with details', function (store, assert, app) {
    assert.expect(25);
    var path = 'components-acceptance-tests/flexberry-objectlistview/delete-with-details';
    var modelName = 'ember-flexberry-dummy-suggestion';
    var commentModelName = 'ember-flexberry-dummy-comment';
    var commentVoteModelName = 'ember-flexberry-dummy-comment-vote';
    var mainSuggestionTypeRecord = void 0;
    var mainApplicationUserRecord = void 0;
    var initTestData = function initTestData(createdRecordsPrefix) {
      // Add records for deleting.
      return Ember.RSVP.Promise.all([store.createRecord('ember-flexberry-dummy-suggestion-type', { name: createdRecordsPrefix + "0" }).save(), store.createRecord('ember-flexberry-dummy-application-user', {
        name: createdRecordsPrefix + "1",
        eMail: "1",
        phone1: "1"
      }).save()]).then(function (createdCustomRecords) {
        mainSuggestionTypeRecord = createdCustomRecords[0];
        mainApplicationUserRecord = createdCustomRecords[1];

        return Ember.RSVP.Promise.all([store.createRecord(modelName, { text: createdRecordsPrefix + "0", type: createdCustomRecords[0], author: createdCustomRecords[1], editor1: createdCustomRecords[1] }).save(), store.createRecord(modelName, { text: createdRecordsPrefix + "1", type: createdCustomRecords[0], author: createdCustomRecords[1], editor1: createdCustomRecords[1] }).save(), store.createRecord(modelName, { text: createdRecordsPrefix + "2", type: createdCustomRecords[0], author: createdCustomRecords[1], editor1: createdCustomRecords[1] }).save()]).then(function (suggestions) {
          return Ember.RSVP.Promise.all([store.createRecord(commentModelName, { text: createdRecordsPrefix + "0", suggestion: suggestions[0], author: createdCustomRecords[1] }).save(), store.createRecord(commentModelName, { text: createdRecordsPrefix + "1", suggestion: suggestions[0], author: createdCustomRecords[1] }).save(), store.createRecord(commentModelName, { text: createdRecordsPrefix + "2", suggestion: suggestions[1], author: createdCustomRecords[1] }).save(), store.createRecord(commentModelName, { text: createdRecordsPrefix + "3", suggestion: suggestions[1], author: createdCustomRecords[1] }).save()]).then(function (comments) {
            return Ember.RSVP.Promise.all([store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "0", comment: comments[0], applicationUser: createdCustomRecords[1] }).save(), store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "1", comment: comments[0], applicationUser: createdCustomRecords[1] }).save(), store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "2", comment: comments[1], applicationUser: createdCustomRecords[1] }).save()]);
          });
        });
      });
    };

    var getRows = function getRows() {
      var olvContainerClass = '.object-list-view-container';
      var trTableClass = 'table.object-list-view tbody tr';

      var $folvContainer = Ember.$(olvContainerClass);
      var $rows = function $rows() {
        return Ember.$(trTableClass, $folvContainer).toArray();
      };
      return $rows;
    };

    var checkRecordsWereAdded = function checkRecordsWereAdded(searchedRecord) {
      var $rows = getRows();

      // Check that the records have been added.
      var recordIsForDeleting = $rows().reduce(function (sum, element) {
        var nameRecord = Ember.$.trim(element.children[2].innerText);
        var flag = nameRecord.indexOf(searchedRecord) >= 0;
        return sum + flag;
      }, 0);

      return recordIsForDeleting;
    };

    var getDeleteButton = function getDeleteButton(searchedRecord) {
      var $rows = getRows();
      var $deleteBtnInRow = undefined;
      $rows().forEach(function (element) {
        var nameRecord = Ember.$.trim(element.children[2].innerText);
        if (nameRecord.indexOf(searchedRecord) >= 0) {
          $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element);
        }
      });

      return $deleteBtnInRow;
    };

    var lookAtLocalStore = function lookAtLocalStore(modelName, searchedField, searchedValue) {
      var currentLoadedData = store.peekAll(modelName);
      for (var i = 0; i < currentLoadedData.content.length; i++) {
        if (currentLoadedData.objectAt(i).get(searchedField) == searchedValue) {
          return true;
        }
      }

      return false;
    };

    // Add records for deleting.
    Ember.run(function () {
      var done1 = assert.async();
      var createdRecordsPrefix = 'folv-delete-with-details-test' + (0, _generateUniqueId.default)();
      initTestData(createdRecordsPrefix).then(function () {
        var builder = new _builder.default(store).from(modelName).count();
        var done = assert.async();
        store.query(modelName, builder.build()).then(function (result) {
          visit(path + '?perPage=' + result.meta.count);
          andThen(function () {
            assert.equal(currentPath(), path);

            // Check records added.
            assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "0") > 0, true, 1 + ' record added');
            assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "1") > 0, true, 2 + ' record added');
            assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2") > 0, true, 3 + ' record added');

            var $deleteButton1 = getDeleteButton(createdRecordsPrefix + "0");
            var done2 = assert.async();
            Ember.run(function () {
              // An exception can be thrown to console due to observer on detail's count.
              $deleteButton1.click();
            });
            wait().then(function () {
              assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "0"), 0, 1 + ' record deleted');
              assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "1") > 0, true, 2 + ' still on OLV');
              assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2") > 0, true, 3 + ' still on OLV');

              // Check local storage.
              assert.notOk(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "0"), "1 suggestion deleted on store");
              assert.ok(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "1"), "2 suggestion still on store");
              assert.ok(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "2"), "3 suggestion still on store");

              assert.notOk(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "0"), "1 comment deleted");
              assert.notOk(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "1"), "2 comment deleted");
              assert.ok(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "2"), "3 comment still on store");
              assert.ok(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "3"), "4 comment still on store");

              assert.notOk(lookAtLocalStore(commentVoteModelName, 'comment.text', createdRecordsPrefix + "0"), "Comment vote deleted");
              assert.notOk(lookAtLocalStore(commentVoteModelName, 'comment.text', createdRecordsPrefix + "1"), "Comment vote deleted");

              var builder = new _builder.default(store, modelName).where(new _predicate.SimplePredicate('text', "==", createdRecordsPrefix + "0"));
              var done3 = assert.async();
              store.query(modelName, builder.build()).then(function (data) {
                assert.equal(data.get('length'), 0, '1 suggestion deleted on backend');

                var $deleteButton2 = getDeleteButton(createdRecordsPrefix + "1");
                var done4 = assert.async();
                Ember.run(function () {
                  // An exception can be thrown to console due to observer on detail's count.
                  $deleteButton2.click();
                });
                wait().then(function () {
                  assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "1"), 0, 2 + ' record deleted');
                  assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2") > 0, true, 3 + ' still on OLV');

                  // Check local storage.
                  assert.notOk(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "1"), "2 suggestion deleted on store");
                  assert.ok(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "2"), "3 suggestion still on store");

                  assert.notOk(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "2"), "3 comment deleted");
                  assert.notOk(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "3"), "4 comment deleted");

                  var $deleteButton3 = getDeleteButton(createdRecordsPrefix + "2");
                  var done5 = assert.async();
                  Ember.run(function () {
                    // An exception can be thrown to console due to observer on detail's count.
                    $deleteButton3.click();
                  });
                  wait().then(function () {
                    assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2"), 0, 3 + ' record deleted');

                    // Check local storage.
                    assert.notOk(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "2"), "3 suggestion deleted on store");

                    Ember.RSVP.Promise.all([mainSuggestionTypeRecord.destroyRecord(), mainApplicationUserRecord.destroyRecord()]).then(function () {
                      return done5();
                    });
                  });
                  done4();
                });
                done3();
              });
              done2();
            });
          });
          done();
        });
        done1();
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-dropdown-filter-for-directories-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', '@ember/test-helpers'], function (_executeFolvTest, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check dropdown in the filter for directories', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, filterButtonDiv, filterButton, olv, thead, index, objectListViewFiltersColumns, objectListViewFiltersRows, dropdownForDirectories, menu, items, controller, filterResult, isFiltered, refreshButton;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(7);

              path = 'components-examples/flexberry-objectlistview/custom-filter';
              _context.next = 4;
              return visit(path);

            case 4:
              assert.equal(currentPath(), path, 'Path is correct');

              filterButtonDiv = document.querySelector('.buttons.filter-active');
              filterButton = filterButtonDiv.querySelector('button');
              olv = document.querySelector('.object-list-view');
              thead = olv.querySelectorAll('th');
              index = Array.from(thead).findIndex(function (item) {
                return item.innerText === 'Тип предложения' || item.innerText === 'Type';
              });
              _context.next = 12;
              return click(filterButton);

            case 12:
              objectListViewFiltersColumns = document.querySelectorAll('.object-list-view-filters');
              objectListViewFiltersRows = objectListViewFiltersColumns[1].children;


              assert.strictEqual(objectListViewFiltersColumns.length === 2, true, 'Filter columns are rendered');
              assert.strictEqual(objectListViewFiltersRows.length > 0, true, 'Filter rows are rendered');

              dropdownForDirectories = objectListViewFiltersRows[index].querySelector('.flexberry-dropdown');
              menu = dropdownForDirectories.querySelector('div.menu');
              items = menu.children;


              assert.strictEqual(dropdownForDirectories !== null, true, 'Dropdown in the filter for directories is rendered');

              _context.next = 22;
              return click(dropdownForDirectories);

            case 22:
              assert.strictEqual(dropdownForDirectories.classList.contains('active'), true, 'Dropdown menu is rendered');

              controller = app.__container__.lookup('controller:' + currentRouteName());
              filterResult = controller.model.toArray();
              isFiltered = true;


              filterResult.forEach(function (element) {
                if (element.type.name !== items[0].innerText) {
                  isFiltered = false;
                }
              });

              assert.strictEqual(isFiltered, false, 'Is not filtered');

              _context.next = 30;
              return click(items[0]);

            case 30:
              _context.next = 32;
              return (0, _testHelpers.settled)();

            case 32:
              // Wait for the click to process

              refreshButton = document.querySelector('.refresh-button');
              _context.next = 35;
              return click(refreshButton);

            case 35:
              _context.next = 37;
              return (0, _testHelpers.settled)();

            case 37:
              // Wait for the refresh to process

              filterResult = controller.model.toArray();
              isFiltered = true;

              filterResult.forEach(function (element) {
                if (element.type.name !== items[0].innerText) {
                  isFiltered = false;
                }
              });

              assert.strictEqual(isFiltered, true, 'Is filtered');

            case 41:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-edit-button-in-row-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _folvTestsFunctions) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check edit button in row', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert) {
      var path, editButtonsInRow, openEditFormFunction;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(3);
              path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
              _context.next = 4;
              return visit(path);

            case 4:

              // Check page path.
              assert.equal(currentPath(), path, 'Path is correct');

              editButtonsInRow = document.querySelectorAll('.object-list-view-row-edit-button');

              assert.equal(editButtonsInRow.length, 5, 'All rows have edit buttons');

              // Apply filter function.

              openEditFormFunction = function openEditFormFunction() {
                var editButtonInRow = editButtonsInRow[0];
                return click(editButtonInRow);
              };

              // Open edit form.


              _context.next = 10;
              return (0, _folvTestsFunctions.openEditFormByFunction)(openEditFormFunction);

            case 10:
              assert.ok(true, 'Edit form opened');

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-from-edit-form-with-queryparams-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions'], function (_executeFolvTest, _folvTestsFunctions) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check return from editForm with queryParam', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, controller, openEditFormFunction, returnToListFormFunction;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(2);
              path = 'components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list?perPage=5';
              _context.next = 4;
              return visit(path);

            case 4:
              controller = app.__container__.lookup('controller:' + currentRouteName());

              // Open edit form function.

              openEditFormFunction = function openEditFormFunction() {
                var editButtonInRow = document.querySelector('.object-list-view-row-edit-button');
                return click(editButtonInRow);
              };

              // Return to list form function.


              returnToListFormFunction = function returnToListFormFunction() {
                var returnToListFormButton = document.querySelector('.return-to-list-form');
                return click(returnToListFormButton);
              };

              // Open edit form.


              _context.next = 9;
              return (0, _folvTestsFunctions.openEditFormByFunction)(openEditFormFunction);

            case 9:
              assert.ok(true, 'Edit form opened');

              _context.next = 12;
              return (0, _folvTestsFunctions.refreshListByFunction)(returnToListFormFunction, controller);

            case 12:
              assert.equal(controller.model.content.length, 1, 'QueryParams applied successfully');

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-goto-editform-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', '@ember/test-helpers'], function (_executeFolvTest, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _executeFolvTest.executeTest)('check goto editform', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, assert, app) {
      var path, controller, editFormRoute, olvElement, helpers, olv, rows, timeout;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
              _context.next = 3;
              return visit(path);

            case 3:
              _context.next = 5;
              return (0, _testHelpers.settled)();

            case 5:
              controller = app.__container__.lookup('controller:' + currentRouteName());
              editFormRoute = controller.get('editFormRoute');

              // Проверяем, что editFormRoute существует

              assert.ok(editFormRoute, 'editFormRoute is defined');

              // Проверяем, что элемент для открытия формы редактирования существует
              olvElement = document.querySelector('[data-test-olv]');

              assert.ok(olvElement, 'Object List View element is present');

              if (!Ember.isBlank(editFormRoute)) {
                _context.next = 12;
                break;
              }

              throw new Error('editFormRoute can\'t be undefined');

            case 12:
              helpers = app.testHelpers;
              olv = helpers.findWithAssert(olvElement);
              rows = helpers.findWithAssert('.object-list-view-container table.object-list-view tbody tr', olv);


              controller.set('rowClickable', true);

              timeout = 1000;

              // Ждем, чтобы убедиться, что все асинхронные операции завершены

              _context.next = 19;
              return (0, _testHelpers.settled)();

            case 19:
              _context.next = 21;
              return click(rows[1].children[1]);

            case 21:
              _context.next = 23;
              return (0, _testHelpers.settled)();

            case 23:

              // Проверяем, что мы находимся на нужном маршруте
              assert.equal(helpers.currentRouteName(), editFormRoute, 'on edit route');

            case 24:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-lock-edit-form-test', ['qunit'], function (_qunit) {
  'use strict';

  (0, _qunit.skip)('check lock edit form', function (store, assert) {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-for-each-column-test', ['qunit'], function (_qunit) {
  'use strict';

  (0, _qunit.skip)('check sorting for each column', function (store, assert) {
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-sorting-on-all-columns-test', ['qunit'], function (_qunit) {
  'use strict';

  (0, _qunit.skip)('check sorting on all column', function (store, assert) {
    var path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
    visit(path);
    andThen(function () {

      // Check page path.
      assert.equal(currentPath(), path);

      checkOlvSortOnAllColumns('[data-test-olv]', null, assert);
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
          newRecords.pushObject(store.createRecord(modelName, modelName == 'ember-flexberry-dummy-application-user' ? { name: uuid, eMail: uuid, phone1: uuid } : { name: uuid }));
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-toolbar-custom-components-test', ['dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test', 'ember-test-helpers/wait'], function (_executeFolvTest, _wait) {
  'use strict';

  (0, _executeFolvTest.executeTest)('check toolbar custom components', function (store, assert) {
    assert.expect(8);
    var path = 'components-examples/flexberry-objectlistview/toolbar-custom-components-example';

    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path, 'Path is correct');

      var $toolbar = Ember.$('.flexberry-olv-toolbar');
      var $dropdown = $toolbar.children('.flexberry-dropdown');
      var $text = $dropdown.children('.text');
      var $menu = $dropdown.children('div.menu');
      var $items = $menu.children();

      assert.equal($dropdown.length, 1, 'Dropdown is render');
      assert.equal($text[0].innerText, 'Enum value №1', 'Dropdown is render');

      andThen(function () {
        Ember.run(function () {
          return $dropdown.click();
        });

        assert.equal($items[0].innerText, 'Enum value №1', 'Dropdown list menu is rendered');
        assert.equal(Ember.$($items[0]).hasClass('active selected'), true, 'Selected dropdown list item has the css-class \'active\'');

        Ember.run(function () {
          return Ember.$($items[5]).click();
        });

        (0, _wait.default)().then(function () {
          $dropdown = $toolbar.children('.flexberry-dropdown');
          $text = $dropdown.children('.text');

          assert.equal($text[0].innerText, 'Enum value №6', 'Text in the dropdown list has changed');

          Ember.run(function () {
            return $dropdown.click();
          });

          (0, _wait.default)().then(function () {
            $menu = $dropdown.children('div.menu');
            $items = $menu.children();

            assert.equal($items[5].innerText, 'Enum value №6', 'Dropdown list menu is rendered');
            assert.equal(Ember.$($items[5]).hasClass('active selected'), true, 'Selected dropdown list item has the css-class \'active\'');
          });
        });
      });
    });
  });
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
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-user-settings-on-multi-list-test', ['qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/utils/generate-unique-id'], function (_qunit, _startApp, _folvTestsFunctions, _generateUniqueId) {
  'use strict';

  var app = void 0;
  var store = void 0;
  var route = void 0;
  var path = 'components-acceptance-tests/flexberry-objectlistview/ember-flexberry-dummy-multi-list';
  var pathHelp = 'components-examples/flexberry-lookup/user-settings-example';
  var userService = void 0;

  (0, _qunit.module)('Acceptance | flexberry-objectlistview | per page user settings on multi list', {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
      store = app.__container__.lookup('service:store');
      userService = app.__container__.lookup('service:user-settings');
      Ember.set(userService, 'isUserSettingsServiceEnabled', true);
    },
    afterEach: function afterEach() {
      // Destroy application.
      Ember.set(userService, 'isUserSettingsServiceEnabled', true);
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)('check perPage developerUserSetting in multi list', function (assert) {
    assert.expect(28);
    var modelInfos = [{ modelName: 'ember-flexberry-dummy-application-user', uuid: (0, _generateUniqueId.default)(), componentName: 'MultiUserList', perPage: [9, 12, 9, 15] }, { modelName: 'ember-flexberry-dummy-application-user', uuid: (0, _generateUniqueId.default)(), componentName: 'MultiUserList2', perPage: [10, 13, 13, 16] }, { modelName: 'ember-flexberry-dummy-suggestion-type', uuid: (0, _generateUniqueId.default)(), componentName: 'MultiSuggestionList', perPage: [11, 14, 11, 17] }];

    // Add records for paging.
    Ember.run(function () {
      initTestData(store, modelInfos).then(function (resolvedPromises) {
        assert.ok(resolvedPromises, 'All records saved.');
        var done = assert.async();

        visit(path);
        andThen(function () {
          try {
            assert.equal(currentPath(), path);
            var currentUrl = currentURL();
            assert.ok(true, "Текущий адрес: " + currentUrl);
            checkPaging(assert, modelInfos, 0);

            // There is an error on test if try to get this route earlier.
            route = app.__container__.lookup('route:components-acceptance-tests/flexberry-objectlistview/ember-flexberry-dummy-multi-list');
            Ember.set(route, 'developerUserSettings', {
              'MultiUserList': { DEFAULT: { perPage: modelInfos[0].perPage[1] } },
              'MultiUserList2': { DEFAULT: { perPage: modelInfos[1].perPage[1] } },
              'MultiSuggestionList': { DEFAULT: { perPage: modelInfos[2].perPage[1] } }
            });

            var doneHelp = assert.async();
            visit(pathHelp);
            andThen(function () {
              assert.equal(currentPath(), pathHelp);
              var done1 = assert.async();
              visit(path);
              andThen(function () {
                try {
                  assert.equal(currentPath(), path);
                  checkPaging(assert, modelInfos, 0);

                  var done2 = assert.async();
                  click("div.folv-for-changing div.cols-config i.dropdown");
                  andThen(function () {
                    try {
                      var done3 = assert.async();
                      click("div.folv-for-changing div.cols-config i.remove");
                      andThen(function () {
                        try {
                          assert.ok(true, 'Произведён сброс настроек пользователя до developerUserSettings.');
                          checkPaging(assert, modelInfos, 2);
                          var done4 = assert.async();
                          checkWithDisabledUserSettings(assert, done4, modelInfos);
                        } catch (error) {
                          clearAllData(assert, store, modelInfos);
                          throw error;
                        } finally {
                          done3();
                        }
                      });
                    } catch (error) {
                      clearAllData(assert, store, modelInfos);
                      throw error;
                    } finally {
                      done2();
                    }
                  });
                } catch (error) {
                  clearAllData(assert, store, modelInfos);
                  throw error;
                } finally {
                  done1();
                }
              });
              doneHelp();
            });
          } catch (error) {
            clearAllData(assert, store, modelInfos);
            throw error;
          } finally {
            done();
          }
        });
      });
    });
  });

  function checkWithDisabledUserSettings(assert, asyncDone, modelInfos) {
    try {
      var doneHelp = assert.async();
      visit(pathHelp);
      andThen(function () {
        assert.equal(currentPath(), pathHelp);
        Ember.set(route, 'developerUserSettings', {
          'MultiUserList': { DEFAULT: { perPage: modelInfos[0].perPage[3] } },
          'MultiUserList2': { DEFAULT: { perPage: modelInfos[1].perPage[3] } },
          'MultiSuggestionList': { DEFAULT: { perPage: modelInfos[2].perPage[3] } }
        });
        Ember.set(userService, 'isUserSettingsServiceEnabled', false);

        // Remove current saved not in Database settings.
        Ember.set(userService, 'currentUserSettings', {});

        var done1 = assert.async();
        visit(path);
        andThen(function () {
          try {
            assert.equal(currentPath(), path);
            checkPaging(assert, modelInfos, 3);
          } catch (error) {
            throw error;
          } finally {
            clearAllData(assert, store, modelInfos);
            done1();
          }
        });
        doneHelp();
      });
    } catch (error) {
      clearAllData(assert, store, modelInfos);
      throw error;
    } finally {
      asyncDone();
    }
  }

  // Function to check current perPage value on page.
  function checkPaging(assert, modelInfos, expectedIndex) {
    // check paging.
    var $perPageElement = Ember.$('div.flexberry-dropdown div.text');
    assert.equal($perPageElement.length, 3, "Элементы количества записей на странице найдены.");
    assert.equal($perPageElement.eq(0).text(), modelInfos[0].perPage[expectedIndex], modelInfos[0].componentName + ': \u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u0440\u0430\u0432\u043D\u043E \u0437\u0430\u0434\u0430\u043D\u043D\u043E\u043C\u0443: ' + modelInfos[0].perPage[expectedIndex] + '.');
    assert.equal($perPageElement.eq(1).text(), modelInfos[1].perPage[expectedIndex], modelInfos[1].componentName + ': \u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u0440\u0430\u0432\u043D\u043E \u0437\u0430\u0434\u0430\u043D\u043D\u043E\u043C\u0443: ' + modelInfos[1].perPage[expectedIndex] + '.');
    assert.equal($perPageElement.eq(2).text(), modelInfos[2].perPage[expectedIndex], modelInfos[2].componentName + ': \u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u0440\u0430\u0432\u043D\u043E \u0437\u0430\u0434\u0430\u043D\u043D\u043E\u043C\u0443: ' + modelInfos[2].perPage[expectedIndex] + '.');
  }

  function initTestData(store, modelInfos) {
    return Ember.RSVP.Promise.all([(0, _folvTestsFunctions.addRecords)(store, modelInfos[0].modelName, modelInfos[0].uuid), (0, _folvTestsFunctions.addRecords)(store, modelInfos[1].modelName, modelInfos[1].uuid), (0, _folvTestsFunctions.addRecords)(store, modelInfos[2].modelName, modelInfos[2].uuid)]);
  }

  function clearAllData(assert, store, modelInfos) {
    Ember.set(userService, 'isUserSettingsServiceEnabled', true);
    var done = assert.async();
    removeTestData(assert, store, modelInfos).then(function () {
      var done1 = assert.async();
      deleteAllUserSettings(assert, modelInfos).then(function () {
        done1();
      });
      done();
    });
  }

  function removeTestData(assert, store, modelInfos) {
    return Ember.RSVP.Promise.all([(0, _folvTestsFunctions.deleteRecords)(store, modelInfos[0].modelName, modelInfos[0].uuid, assert), (0, _folvTestsFunctions.deleteRecords)(store, modelInfos[1].modelName, modelInfos[1].uuid, assert), (0, _folvTestsFunctions.deleteRecords)(store, modelInfos[2].modelName, modelInfos[2].uuid, assert)]);
  }

  function deleteAllUserSettings(assert, modelInfos) {
    return Ember.RSVP.Promise.all([deleteUserSetting(assert, modelInfos[0].componentName), deleteUserSetting(assert, modelInfos[1].componentName), deleteUserSetting(assert, modelInfos[2].componentName)]);
  }

  // Function for deleting user settings from database.
  function deleteUserSetting(assert, componentName) {
    Ember.run(function () {
      var done = assert.async();
      userService._getExistingSettings(componentName, "DEFAULT").then(function (foundRecords) {
        if (foundRecords && foundRecords.length > 0) {
          assert.equal(foundRecords.length, 1, componentName + ": Найдена настройка пользователя.");
          foundRecords[0].deleteRecord();
          foundRecords[0].save().then(function () {
            assert.ok(true, componentName + ": Настройки пользователя удалены из БД.");
            done();
          });
        } else {
          assert.ok(true, componentName + ": Настройки пользователя не найдены в БД.");
          done();
        }
      });
    });
  }
});
define('dummy/tests/acceptance/components/flexberry-objectlistview/folv-user-settings-test', ['qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions', 'ember-flexberry-data/utils/generate-unique-id'], function (_qunit, _startApp, _folvTestsFunctions, _generateUniqueId) {
  'use strict';

  var app = void 0;
  var store = void 0;
  var route = void 0;
  var path = 'components-acceptance-tests/flexberry-objectlistview/folv-user-settings';
  var pathHelp = 'components-examples/flexberry-lookup/user-settings-example';
  var modelName = 'ember-flexberry-dummy-suggestion-type';
  var userService = void 0;

  /* There is some problem with TransitionAborted on server, so for server there is variant without redirect.*/
  var skip = true;

  (0, _qunit.module)('Acceptance | flexberry-objectlistview | per page user settings', {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
      store = app.__container__.lookup('service:store');
      route = app.__container__.lookup('route:components-acceptance-tests/flexberry-objectlistview/folv-user-settings');
      userService = app.__container__.lookup('service:user-settings');
      Ember.set(userService, 'isUserSettingsServiceEnabled', true);
    },
    afterEach: function afterEach() {
      // Destroy application.
      Ember.set(userService, 'isUserSettingsServiceEnabled', true);
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)('check saving of user settings', function (assert) {
    if (skip) {
      assert.ok(true);
      return;
    }

    assert.expect(21);
    var uuid = (0, _generateUniqueId.default)();

    route.set('developerUserSettings', { FOLVPagingObjectListView: { DEFAULT: { colsOrder: [{ propName: 'name' }], perPage: 28 } } });

    // Add records for paging.
    Ember.run(function () {
      (0, _folvTestsFunctions.addRecords)(store, modelName, uuid).then(function (resolvedPromises) {
        assert.ok(resolvedPromises, 'All records saved.');
        var done = assert.async();
        visit(path);
        andThen(function () {
          try {
            assert.equal(currentPath(), path);
            var currentUrl = currentURL();
            assert.ok(currentUrl.contains("perPage=28"), "Переадресация выполнена успешно (настройка взята из developerUserSettings).");
            checkPaging(assert, '28');
            route.set('developerUserSettings', { FOLVPagingObjectListView: { DEFAULT: { colsOrder: [{ propName: 'name' }], perPage: 17 } } });

            var doneHelp = assert.async();
            visit(pathHelp);
            andThen(function () {
              assert.equal(currentPath(), pathHelp);
              var done1 = assert.async();
              visit(path);
              andThen(function () {
                try {
                  assert.equal(currentPath(), path);
                  var _currentUrl = currentURL();
                  assert.ok(_currentUrl.contains("perPage=28"), "Переадресация выполнена успешно (настройка взята из БД).");
                  checkPaging(assert, '28');

                  var done2 = assert.async();
                  click("div.cols-config i.dropdown");
                  andThen(function () {
                    try {
                      var done3 = assert.async();
                      click("div.cols-config i.remove");
                      andThen(function () {
                        try {
                          assert.ok(true, 'Произведён сброс настроек пользователя до developerUserSettings.');
                          var _currentUrl2 = currentURL();
                          assert.ok(_currentUrl2.contains("perPage=17"), "Переадресация выполнена успешно (настройка взята из developerUserSettings).");
                          checkPaging(assert, '17');

                          var done4 = assert.async();
                          checkWithDisabledUserSettings(assert, done4);
                        } catch (error) {
                          (0, _folvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
                          deleteUserSetting(assert);
                          throw error;
                        } finally {
                          done3();
                        }
                      });
                    } catch (error) {
                      (0, _folvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
                      deleteUserSetting(assert);
                      throw error;
                    } finally {
                      done2();
                    }
                  });
                } catch (error) {
                  (0, _folvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
                  deleteUserSetting(assert);
                  throw error;
                } finally {
                  done1();
                }
              });
              doneHelp();
            });
          } catch (error) {
            (0, _folvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
            deleteUserSetting(assert);
            throw error;
          } finally {
            done();
          }
        });
      });
    });
  });

  function checkWithDisabledUserSettings(assert, asyncDone, uuid) {
    try {
      var doneHelp = assert.async();
      visit(pathHelp);
      andThen(function () {
        assert.equal(currentPath(), pathHelp);
        route.set('developerUserSettings', { FOLVPagingObjectListView: { DEFAULT: { colsOrder: [{ propName: 'name' }], perPage: 11 } } });
        Ember.set(userService, 'isUserSettingsServiceEnabled', false);

        // Remove current saved not in Database settings.
        Ember.set(userService, 'currentUserSettings', {});

        var done1 = assert.async();
        visit(path);
        andThen(function () {
          try {
            assert.equal(currentPath(), path);
            var currentUrl = currentURL();
            assert.ok(currentUrl.contains("perPage=11"), "Переадресация выполнена успешно (настройка взята из developerUserSettings).");
            checkPaging(assert, '11');
          } catch (error) {
            throw error;
          } finally {
            Ember.set(userService, 'isUserSettingsServiceEnabled', true);
            (0, _folvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
            deleteUserSetting(assert);
            done1();
          }
        });
        doneHelp();
      });
    } catch (error) {
      (0, _folvTestsFunctions.deleteRecords)(store, modelName, uuid, assert);
      deleteUserSetting(assert);
      throw error;
    } finally {
      asyncDone();
    }
  }

  // Function to check current perPage value on page.
  function checkPaging(assert, expectedCount) {
    // check paging.
    var $perPageElement = Ember.$('div.flexberry-dropdown div.text');
    assert.equal($perPageElement.length, 1, "Элемент количества записей на странице найден.");
    assert.equal($perPageElement.text(), expectedCount, '\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u0440\u0430\u0432\u043D\u043E \u0437\u0430\u0434\u0430\u043D\u043D\u043E\u043C\u0443: ' + expectedCount + '.');
  }

  // Function for deleting user settings from database.
  function deleteUserSetting(assert) {
    Ember.run(function () {
      var done = assert.async();
      userService._getExistingSettings("FOLVPagingObjectListView", "DEFAULT").then(function (foundRecords) {
        if (foundRecords && foundRecords.length > 0) {
          assert.equal(foundRecords.length, 1, "Найдена настройка пользователя.");
          foundRecords[0].deleteRecord();
          foundRecords[0].save().then(function () {
            assert.ok(true, "Настройки пользователя удалены из БД.");
            done();
          });
        } else {
          assert.ok(true, "Настройки пользователя не найдены в БД.");
          done();
        }
      });
    });
  }
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
define('dummy/tests/acceptance/components/flexberry-simpledatetime/flexberry-simpledatetime-manual-enter-test', ['qunit', 'dummy/tests/helpers/start-app'], function (_qunit, _startApp) {
  'use strict';

  var app = void 0;
  var path = 'components-acceptance-tests/flexberry-simpledatetime/manual-enter';

  (0, _qunit.module)('Acceptance | flexberry-simpledatetime | manual enter on groupedit', {
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

  (0, _qunit.test)('manual enter on groupedit', function (assert) {
    assert.expect(5);
    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path, 'Path is correct.');
      var controller = app.__container__.lookup('controller:' + currentRouteName());
      var detailModels = Ember.get(controller, 'model.details');
      assert.equal(detailModels.length, 2, 'Data contains two details as expected');

      var $datePickers = Ember.$('.custom-flatpickr');
      assert.equal($datePickers.length, 2, 'There are two rows on groupedit.');
      fillIn($datePickers[0], '01.01.2022');
      andThen(function () {
        assert.equal('2022-01-01', Ember.get(detailModels.objectAt(0), 'date').toISOString().split('T')[0], 'Properly initiated by custom date');
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        var todayForGE = dd + '.' + mm + '.' + yyyy;
        fillIn($datePickers[1], todayForGE);
        andThen(function () {
          assert.equal(today.toISOString().split('T')[0], Ember.get(detailModels.objectAt(1), 'date').toISOString().split('T')[0], 'Properly initiated by current date');
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/flexberry-toggler/flexberry-toggler-with-inner-toggler-test', ['qunit', 'dummy/tests/helpers/start-app'], function (_qunit, _startApp) {
  'use strict';

  var app = void 0;
  var path = 'components-examples/flexberry-toggler/settings-example-inner';
  var testName = 'flexberry-toggler with inner toggler test';

  (0, _qunit.module)('Acceptance | flexberry-toggler | ' + testName, {
    beforeEach: function beforeEach() {

      // Start application.
      app = (0, _startApp.default)();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      var applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);

      var controller = app.__container__.lookup('controller:components-examples/flexberry-toggler/settings-example-inner');
      controller.set('duration', 0);
    },
    afterEach: function afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)(testName, function (assert) {

    visit(path);
    andThen(function () {
      assert.equal(currentPath(), path, 'Path is correct');

      var rows = Ember.$('table.flexberry-word-break tbody tr');
      var caption = Ember.$('.ember-text-field', rows[0]);
      fillIn(caption, 'Caption text example');

      andThen(function () {
        var title1 = Ember.$('.title')[0].innerText;
        assert.equal(caption[0].value, title1, 'Caption is correct');

        var expandedInnerCaption = Ember.$('.ember-text-field', rows[5]);
        var collapsedInnerCaption = Ember.$('.ember-text-field', rows[6]);
        fillIn(expandedInnerCaption, 'Expanded inner caption text example');
        fillIn(collapsedInnerCaption, 'Collapsed inner caption text example');

        var expandedCaption = Ember.$('.ember-text-field', rows[1]);
        var collapsedCaption = Ember.$('.ember-text-field', rows[2]);
        fillIn(expandedCaption, 'Expanded caption text example');
        fillIn(collapsedCaption, 'Collapsed caption text example');

        andThen(function () {
          var toggler = Ember.$('.flexberry-toggler .title');
          assert.equal(collapsedInnerCaption[0].value, toggler[1].innerText, 'Collapsed inner caption is correct');

          click(toggler[1]);
          andThen(function () {
            assert.equal(expandedInnerCaption[0].value, toggler[1].innerText, 'Expanded inner caption is correct');
            assert.equal(expandedCaption[0].value, toggler[0].innerText, 'Expanded caption is correct');
            var expandedCheckbox = rows[3].children[0].children[0];
            assert.equal(expandedCheckbox.checked, true, 'expanded=true');

            click(toggler[0]);
            andThen(function () {
              assert.equal(collapsedCaption[0].value, toggler[0].innerText, 'Collapsed caption is correct');
              assert.equal(expandedCheckbox.checked, false, 'expanded=false');
              click(expandedCheckbox);
              andThen(function () {
                assert.equal(expandedCheckbox.checked, true, 'expanded=true');
                var expandedInnerCheckbox = rows[7].children[0].children[0];
                assert.equal(expandedInnerCheckbox.checked, true, 'inner expanded=true');
                click(expandedInnerCheckbox);
                andThen(function () {
                  assert.equal(expandedInnerCheckbox.checked, false, 'inner expanded=false');
                  assert.equal(expandedCheckbox.checked, true, 'expanded=true');
                  var icon = Ember.$('.flexberry-toggler .title .icon')[0];
                  assert.equal(icon.className, 'dropdown icon', 'dropdown icon');
                  var collapsedCaption = Ember.$('.ember-text-field', rows[8]);
                  fillIn(collapsedCaption, 'paw icon');
                  andThen(function () {
                    assert.equal(icon.className, 'paw icon', 'paw icon');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
define('dummy/tests/acceptance/components/highload-edit-form-menu-test', ['qunit', 'dummy/tests/helpers/start-app', 'ember-test-helpers/wait'], function (_qunit, _startApp, _wait) {
  'use strict';

  var app = void 0;

  (0, _qunit.module)('Acceptance | high-edit-form-menu', {
    beforeEach: function beforeEach() {
      app = (0, _startApp.default)();
    },
    afterEach: function afterEach() {
      // Destroy application.
      Ember.run(app, 'destroy');
    }
  });

  (0, _qunit.test)('it properly renders', function (assert) {
    assert.expect(7);
    var done = assert.async();

    var path = 'components-examples/highload-edit-form-menu/index';
    visit(path);
    andThen(function () {
      assert.equal(currentURL(), path);
      Ember.$('.object-list-view').find('tr')[1].children[1].click();

      andThen(function () {
        (0, _wait.default)().then(function () {
          assert.equal(Ember.$('.gruppaPolejVvoda').length, 4, 'all tabs are here');
          assert.equal(Ember.$('.gruppaPolejVvoda.active').length, 1, 'only one tab is active');
          assert.equal(Ember.$('.gruppaPolejVvoda')[0].classList.contains('active'), true, 'first tab is active');

          Ember.run(function () {
            Ember.$('.tabsNavigation')[0].click();
          });

          (0, _wait.default)().then(function () {
            assert.equal(Ember.$('.gruppaPolejVvoda')[1].classList.contains('active'), true, 'next tab is active');

            Ember.run(function () {
              Ember.$('.tabsNavigation')[1].click();
            });

            (0, _wait.default)().then(function () {
              assert.equal(Ember.$('.gruppaPolejVvoda')[0].classList.contains('active'), true, 'previous tab is active');

              Ember.run(function () {
                Ember.$('.showAllFormsButton').click();
              });

              (0, _wait.default)().then(function () {
                assert.equal(Ember.$('.gruppaPolejVvoda.active').length, 4, 'all tabs are active');
                done();
              });
            });
          });
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

      Ember.run.next(function () {
        // Validationmessage must be empty.
        assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Dropdown have value');
      });
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

      var $validationFlexberryLookupButton = Ember.$('.ui.button.ui-change')[0];

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

      var $validationFlexberryLookupButton = Ember.$('.ui.button.ui-change')[0];

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
define('dummy/tests/acceptance/edit-form-validation-test/validation-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test'], function (_executeValidationTest) {
  'use strict';

  /* eslint-disable no-unused-vars */
  (0, _executeValidationTest.executeTest)('check complete all tests', function (store, assert, app) {
    assert.expect(3);
    var path = 'components-acceptance-tests/edit-form-validation/validation';

    // Open validation page.
    visit(path);

    andThen(function () {
      assert.equal(currentPath(), path);

      var $validationFlexberryLookupButton = Ember.$('.ui.button.ui-change')[0];

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
define('dummy/tests/acceptance/edit-form-validation-test/validation-textbox-unique-date-test', ['dummy/tests/acceptance/edit-form-validation-test/execute-validation-test', 'ember-flexberry-data/utils/generate-unique-id'], function (_executeValidationTest, _generateUniqueId) {
    'use strict';

    (0, _executeValidationTest.executeTest)('check operation text+date unique', function (store, assert, _app) {
        assert.expect(3);

        var dateToSet = new Date(2012, 1, 12);

        dateToSet.setHours(13);
        dateToSet.setUTCHours(11);
        dateToSet.setUTCMinutes(0);
        dateToSet.setUTCSeconds(0);
        dateToSet.setUTCMilliseconds(0);

        var initTestData = function initTestData(createdRecordsPrefix) {
            // Add records for deleting.
            return Ember.RSVP.Promise.all([store.createRecord('ember-flexberry-dummy-suggestion-type', { name: createdRecordsPrefix + "0" }).save(), store.createRecord('ember-flexberry-dummy-application-user', {
                name: createdRecordsPrefix + "1",
                eMail: "1",
                phone1: "1"
            }).save()]).then(function (createdCustomRecords) {
                return store.createRecord('ember-flexberry-dummy-suggestion', {
                    id: '75434dbd-f00c-4fd9-8483-c35aa59a18c3',
                    text: '12345',
                    date: dateToSet,
                    type: createdCustomRecords[0],
                    author: createdCustomRecords[1],
                    editor1: createdCustomRecords[1]
                }).save();
            });
        };

        Ember.run(function () {
            var path = 'components-acceptance-tests/edit-form-validation/validation';
            var done1 = assert.async();

            initTestData('uniqueTest' + (0, _generateUniqueId.default)()).then(function (suggestion) {
                // Open validation page.
                visit(path);

                andThen(function () {
                    assert.equal(currentPath(), path);

                    // text
                    var $validationField = Ember.$(Ember.$('.field')[3]);
                    var $validationFlexberryTextbox = $validationField.children('.flexberry-textbox');
                    var $validationFlexberryTextboxInner = $validationFlexberryTextbox.children('input');
                    var $validationFlexberryErrorLabel = $validationField.children('.label');

                    // data
                    var $validationDateField = Ember.$(Ember.$('.field')[5]);
                    var $validationDate = Ember.$('.flexberry-simpledatetime', $validationDateField);
                    var $validationDateFlatpickr = Ember.$('.flatpickr > input', $validationDate);
                    var $validationDateFlatpickrCustom = Ember.$('input.custom-flatpickr', $validationDate);

                    var done2 = assert.async();
                    // Insert text and date in textbox.
                    Ember.run(function () {
                        $validationDateFlatpickr[0]._flatpickr.open();
                        $validationDateFlatpickr[0]._flatpickr.setDate(new Date(2012, 1, 12));
                        $validationDateFlatpickr[0]._flatpickr.close();
                        $validationDateFlatpickrCustom.change();

                        $validationFlexberryTextboxInner[0].value = '12345';
                        $validationFlexberryTextboxInner.change();
                    });

                    wait().then(function () {
                        // Check validationmessage for non-unique combination text+date.
                        assert.equal($validationFlexberryErrorLabel.text().trim(), 'Combination of attributes (Text, Date) are not unique', 'Text+date combination must be non-unique');

                        // Change date value.
                        Ember.run(function () {
                            $validationDateFlatpickr[0]._flatpickr.open();
                            $validationDateFlatpickr[0]._flatpickr.setDate(new Date(2012, 1, 13));
                            $validationDateFlatpickr[0]._flatpickr.close();
                            $validationDateFlatpickrCustom.change();

                            $validationFlexberryTextboxInner[0].value = '123456';
                            $validationFlexberryTextboxInner.change();
                        });

                        var done3 = assert.async();

                        wait().then(function () {
                            // Check default validationmessage for text+date combination is unique.
                            assert.equal($validationFlexberryErrorLabel.text().trim(), '', 'Text+date combination must be unique');

                            var done5 = assert.async();

                            suggestion.destroyRecord().then(function () {
                                return done5();
                            });

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
define('dummy/tests/helpers/validate-properties', ['exports', 'ember-qunit'], function (exports, _emberQunit) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.testValidPropertyValues = testValidPropertyValues;
  exports.testInvalidPropertyValues = testInvalidPropertyValues;


  var run = Ember.run;

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
define('dummy/tests/integration/components/flexberry-checkbox-test', ['qunit', '@ember/test-helpers', 'ember-qunit'], function (_qunit, _testHelpers, _emberQunit) {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('flexberry-checkbox', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('Component renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $component, $checkboxInput, additioanlCssClasses;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:

                assert.expect(15);

                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "tLdNS8JB",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"caption\",\"class\"],[[22,[\"caption\"]],[22,[\"class\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component, it's inner <input>.
                $component = Ember.$(this.element).children();
                $checkboxInput = $component.children('input');

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
                additioanlCssClasses = 'radio slider toggle';

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

              case 19:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Component renders it\'s label properly', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var $component, $checkboxLabel, label;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(5);

                _context2.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "5uyuK0Iw",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"label\"],[[22,[\"label\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component, it's inner <label>.
                $component = Ember.$(this.element).children();
                $checkboxLabel = $component.children('label');

                // Check <label>'s text.

                assert.strictEqual($checkboxLabel.length === 1, true, 'Component has inner <label>');
                assert.strictEqual($checkboxLabel.hasClass('flexberry-checkbox-label'), true, 'Component\'s inner <label> has flexberry-checkbox-label css-class');
                assert.strictEqual(Ember.$.trim($checkboxLabel.text()).length === 0, true, 'Component\'s inner <label> is empty by default');

                // Define some label & check <label>'s text again.
                label = 'This is checkbox';

                this.set('label', label);
                assert.strictEqual(Ember.$.trim($checkboxLabel.text()) === label, true, 'Component\'s inner <label> has text defined in component\'s \'label\' property: \'' + label + '\'');

                // Clean up defined label & check <label>'s text again.
                label = null;
                this.set('label', label);
                assert.strictEqual(Ember.$.trim($checkboxLabel.text()).length === 0, true, 'Component\'s inner <label> is empty if component\'s \'label\' property is cleaned up');

              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Changes in checkbox causes changes in binded value', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var _this = this;

        var $component, $checkboxInput;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(9);

                _context3.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "rdFET5ht",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"value\"],[[22,[\"flag\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component & it's inner <input>.
                $component = Ember.$(this.element).children();
                $checkboxInput = $component.children('input');

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

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Changes in in binded value causes changes in checkbox', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
        var $component, $checkboxInput;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                assert.expect(7);

                _context4.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "rdFET5ht",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"value\"],[[22,[\"flag\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component & it's inner <input>.
                $component = this.$().children();
                $checkboxInput = $component.children('input');

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

              case 14:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Component sends \'onChange\' action', function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
        var onCheckboxChangeEventObject, $component;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                assert.expect(2);

                onCheckboxChangeEventObject = null;

                this.set('onCheckboxChange', function (e) {
                  onCheckboxChangeEventObject = e;
                });

                _context5.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Edl1IfMJ",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"value\",\"onChange\"],[[22,[\"flag\"]],[21,0,[\"onCheckboxChange\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = this.element.querySelector('.flexberry-checkbox');

                // Imitate click on component (change its state to checked) & check action's event object.

                _context5.next = 8;
                return (0, _testHelpers.click)($component);

              case 8:
                assert.strictEqual(onCheckboxChangeEventObject.checked, true, 'Component sends \'onChange\' action with \'checked\' property equals to \'true\' after first click');

                // Imitate click on component again (change its state to unchecked) & check action's event object again.
                _context5.next = 11;
                return (0, _testHelpers.click)($component);

              case 11:
                assert.strictEqual(onCheckboxChangeEventObject.checked, false, 'Component sends \'onChange\' action with \'checked\' property equals to \'false\' after second click');

              case 12:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x5) {
        return _ref6.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Component works properly in readonly mode', function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
        var onCheckboxChangeEventObject, $component, $checkboxInput;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                assert.expect(11);

                onCheckboxChangeEventObject = null;

                this.set('onCheckboxChange', function (e) {
                  onCheckboxChangeEventObject = e;
                });

                this.set('readonly', false);
                this.set('flag', undefined);

                _context6.next = 7;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "R6l0lwEM",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"readonly\",\"value\",\"onChange\"],[[21,0,[\"readonly\"]],[21,0,[\"flag\"]],[21,0,[\"onCheckboxChange\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 7:

                // Retrieve component & its inner <input>.
                $component = this.element.querySelector(' .flexberry-checkbox');
                $checkboxInput = $component.querySelector('input');

                // Check component's initial state.

                assert.strictEqual($component.classList.contains('read-only'), false, 'Component hasn\'t css-class \'read-only\' by default');

                // Enable readonly mode & check component's state again.
                this.set('readonly', true);
                assert.strictEqual($component.classList.contains('read-only'), true, 'Component has css-class \'read-only\' when readonly mode is enabled');

                // Imitate click on component (try to change its state to checked) & check its state & action's event object.
                _context6.next = 14;
                return (0, _testHelpers.click)($component);

              case 14:
                assert.strictEqual(onCheckboxChangeEventObject, null, 'Component doesn\'t send \'onChange\' action in readonly mode');
                assert.strictEqual($component.classList.contains('checked'), false, 'Component hasn\'t css-class \'checked\' after click in readonly mode');
                assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked after click in readonly mode');
                assert.strictEqual(_typeof(this.get('flag')), 'undefined', 'Component\'s binded value is still \'undefined\' after click in readonly mode');

                // Disable readonly mode & check component's state again.
                this.set('readonly', false);
                assert.strictEqual($component.classList.contains('read-only'), false, 'Component hasn\'t css-class \'read-only\' when readonly mode is disabled');

                // Imitate click on component (try to change its state to checked) & check its state & action's event object.
                _context6.next = 22;
                return (0, _testHelpers.click)($component);

              case 22:
                assert.strictEqual(Ember.isNone(onCheckboxChangeEventObject), false, 'Component sends \'onChange\' action when readonly mode is disabled');
                assert.strictEqual($component.classList.contains('checked'), true, 'Component has css-class \'checked\' after first click when readonly mode is disabled');
                assert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after first click when readonly mode is disabled');
                assert.strictEqual(this.get('flag'), true, 'Component\'s binded value is equals to \'true\' after first click when readonly mode is disabled');

              case 26:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x6) {
        return _ref7.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Setting up classes in checkbox', function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
        var checkClass, $component;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                assert.expect(6);

                checkClass = 'radio slider toggle';

                this.set('class', checkClass);
                _context7.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "aF1xW7AU",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-checkbox\",null,[[\"value\",\"class\"],[[22,[\"flag\"]],[22,[\"class\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();

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

              case 13:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x7) {
        return _ref8.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-ddau-checkbox-test', ['ember-flexberry/components/flexberry-ddau-checkbox', 'ember-flexberry/mixins/flexberry-ddau-checkbox-actions-handler', 'qunit', 'ember-qunit', '@ember/test-helpers'], function (_flexberryDdauCheckbox, _flexberryDdauCheckboxActionsHandler, _qunit, _emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-ddau-checkbox', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('Component renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $component, $checkboxInput, $checkboxCaption, flexberryClassNames, checkboxCaptionText, additionalCssClasses;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(17);

                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "bedsM4UF",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"caption\",\"class\"],[[22,[\"caption\"]],[22,[\"class\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component, it's inner <input> & <label>.
                $component = this.element.children[0];
                $checkboxInput = $component.querySelector('input');
                $checkboxCaption = $component.querySelector('label');
                flexberryClassNames = _flexberryDdauCheckbox.default.flexberryClassNames;

                // Check wrapper <div>.

                assert.strictEqual($component.tagName, 'DIV', 'Component\'s wrapper is a <div>');
                assert.ok($component.classList.contains(flexberryClassNames.wrapper), 'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');
                assert.ok($component.classList.contains('ui'), 'Component\'s wrapper has \'ui\' css-class');
                assert.ok($component.classList.contains('checkbox'), 'Component\'s wrapper has \'checkbox\' css-class');

                // Check <input>.
                assert.strictEqual($checkboxInput !== null, true, 'Component has inner <input>');
                assert.strictEqual($checkboxInput.type, 'checkbox', 'Component\'s inner <input> is of checkbox type');
                assert.ok($checkboxInput.classList.contains(flexberryClassNames.checkboxInput), 'Component\'s inner checkbox <input> has \'' + flexberryClassNames.checkboxInput + '\' css-class');
                assert.ok($checkboxInput.classList.contains('hidden'), 'Component\'s inner checkbox <input> has \'hidden\' css-class');
                assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked');

                // Check caption's <label>.
                assert.strictEqual($checkboxCaption !== null, true, 'Component has inner <label>');
                assert.ok($checkboxCaption.classList.contains(flexberryClassNames.checkboxCaption), 'Component\'s inner <label> has \'' + flexberryClassNames.checkboxCaption + '\' css-class');
                assert.strictEqual(Ember.$.trim($checkboxCaption.textContent).length === 0, true, 'Component\'s inner <label> is empty by default');

                checkboxCaptionText = 'Checkbox caption';

                this.set('caption', checkboxCaptionText);
                assert.strictEqual(Ember.$.trim($checkboxCaption.textContent), checkboxCaptionText, 'Component\'s inner <label> text changes when component\'s \'caption\' property changes');

                // Check wrapper's additional CSS-classes.
                additionalCssClasses = 'additional-css-class-name and-another-one';

                this.set('class', additionalCssClasses);

                Ember.A(additionalCssClasses.split(' ')).forEach(function (cssClassName) {
                  assert.ok($component.classList.contains(cssClassName), 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
                });

                this.set('class', '');
                Ember.A(additionalCssClasses.split(' ')).forEach(function (cssClassName) {
                  assert.notOk($component.classList.contains(cssClassName), 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
                });

              case 27:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Component invokes actions', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var latestEventObjects, $component;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(3);

                latestEventObjects = {
                  change: null
                };

                // Bind component's action handlers.

                this.set('actions', {
                  onFlagChange: function onFlagChange(e) {
                    latestEventObjects.change = e;
                  }
                });

                _context2.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "rgT1ZVdB",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"change\"],[[26,\"action\",[[21,0,[]],\"onFlagChange\"],null]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = this.element.children[0];


                assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

                // Imitate first click on component.
                _context2.next = 9;
                return (0, _testHelpers.click)($component);

              case 9:
                assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after first click');

                // Imitate second click on component.
                latestEventObjects.change = null;
                _context2.next = 13;
                return (0, _testHelpers.click)($component);

              case 13:
                assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');

              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Component changes binded value (without \'change\' action handler)', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(testAssert) {
        var thrownExceptions, originalEmberAssert, $component, $checkboxInput;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // Mock Ember.assert method.
                thrownExceptions = Ember.A();
                originalEmberAssert = Ember.assert;

                Ember.assert = function () {
                  try {
                    originalEmberAssert.apply(undefined, arguments);
                  } catch (ex) {
                    thrownExceptions.pushObject(ex);
                  }
                };

                testAssert.expect(4);

                this.set('flag', false);
                _context3.next = 7;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "RkoVMjZ5",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"value\"],[[22,[\"flag\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 7:

                // Retrieve component & it's inner <input>.
                $component = this.element.children[0];
                $checkboxInput = $component.querySelector('input');

                // Check component's initial state.

                testAssert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked before click');

                // Imitate click on component & check for exception.
                _context3.next = 12;
                return (0, _testHelpers.click)($component);

              case 12:

                // Check component's state after click (it should be changed).
                testAssert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after click (without \'change\' action handler)');

                // Check binded value state after click (it should be unchanged, because 'change' action handler is not defined).
                testAssert.strictEqual(this.get('flag'), true, 'Component\'s binded value changed (without \'change\' action handler)');

                testAssert.strictEqual(thrownExceptions.length === 1 && /.*required.*change.*action.*not.*defined.*/gi.test(thrownExceptions[0].message), true, 'Component throws single exception if \'change\' action handler is not defined');

                // Clean up after mock Ember.assert.
                Ember.assert = originalEmberAssert;

              case 16:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Component changes binded value (with \'change\' action handler)', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
        var _this = this;

        var $component, $checkboxInput;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                assert.expect(7);

                this.set('flag', false);

                // Bind component's 'change' action handler.
                this.set('actions', {
                  onFlagChange: function onFlagChange(e) {
                    assert.strictEqual(e.originalEvent.target.id, _this.element.querySelector('input').id);
                    _this.set('flag', e.newValue);
                  }
                });

                _context4.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "WVc54MPf",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"value\",\"change\"],[[22,[\"flag\"]],[26,\"action\",[[21,0,[]],\"onFlagChange\"],null]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component & it's inner <input>.
                $component = this.element.children[0];
                $checkboxInput = $component.querySelector('input');

                // Check component's initial state.

                assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked before click');

                // Make component checked.
                _context4.next = 10;
                return (0, _testHelpers.click)($component);

              case 10:
                assert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after click (with \'change\' action handler)');
                assert.strictEqual(this.get('flag'), true, 'Component\'s binded value changed (with \'change\' action handler)');

                // Make component unchecked.
                _context4.next = 14;
                return (0, _testHelpers.click)($component);

              case 14:
                assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> is unchecked after second click (with \'change\' action handler)');
                assert.strictEqual(this.get('flag'), false, 'Component\' binded value changed after second click (with \'change\' action handler)');

              case 16:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Component changes binded value (with \'change\' action handler from special mixin)', function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
        var $component, $checkboxInput;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                assert.expect(5);

                this.set('flag', false);

                // Bind component's 'change' action handler from specialized mixin.
                this.set('actions', {
                  onCheckboxChange: _flexberryDdauCheckboxActionsHandler.default.mixins[0].properties.actions.onCheckboxChange
                });

                _context5.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "RrZKXti+",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"value\",\"change\"],[[22,[\"flag\"]],[26,\"action\",[[21,0,[]],\"onCheckboxChange\",\"flag\"],null]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component & it's inner <input>.
                $component = this.element.children[0];
                $checkboxInput = $component.querySelector('input');

                // Check component's initial state.

                assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked before click');

                // Make component checked.
                _context5.next = 10;
                return (0, _testHelpers.click)($component);

              case 10:
                assert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after click (with \'change\' action handler from special mixin)');
                assert.strictEqual(this.get('flag'), true, 'Component changed binded value (with \'change\' action handler from special mixin)');

                // Make component unchecked.
                _context5.next = 14;
                return (0, _testHelpers.click)($component);

              case 14:
                assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> is unchecked after second click (with \'change\' action handler from special mixin)');
                assert.strictEqual(this.get('flag'), false, 'Component changed binded value after second click (with \'change\' action handler from special mixin)');

              case 16:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x5) {
        return _ref6.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Component works properly in readonly mode', function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
        var latestEventObjects, $component, $checkboxInput;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                assert.expect(9);

                latestEventObjects = {
                  change: null
                };

                // Bind component's action handlers.

                this.set('actions', {
                  onFlagChange: function onFlagChange(e) {
                    latestEventObjects.change = e;
                  }
                });

                // Render component in readonly mode.
                this.set('flag', false);
                this.set('readonly', true);
                _context6.next = 7;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "67FR1zrZ",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-ddau-checkbox\",null,[[\"value\",\"readonly\",\"change\"],[[22,[\"flag\"]],[22,[\"readonly\"]],[26,\"action\",[[21,0,[]],\"onFlagChange\"],null]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 7:

                // Retrieve component & it's inner <input>.
                $component = this.element.children[0];
                $checkboxInput = $component.querySelector('input');

                // Check component's initial state.

                assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked before click');

                // Imitate click on component.
                _context6.next = 12;
                return (0, _testHelpers.click)($component);

              case 12:

                // Check after click state.
                assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked after click');
                assert.strictEqual(latestEventObjects.change, null, 'Component doesn\'t send \'change\' action in readonly mode');

                // Disable readonly mode.
                this.set('readonly', false);

                // Imitate click on component.
                _context6.next = 17;
                return (0, _testHelpers.click)($component);

              case 17:

                // Check after click state.
                assert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after click');
                assert.notStrictEqual(latestEventObjects.change, null, 'Component send \'change\' action after readonly mode disabling');

                latestEventObjects.change = null;

                // Imitate click on component.
                _context6.next = 22;
                return (0, _testHelpers.click)($component);

              case 22:

                // Check after click state.
                assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> is unchecked after click');
                assert.notStrictEqual(latestEventObjects.change, null, 'Component send \'change\' action after readonly mode disabling');

                latestEventObjects.change = null;

                // Enable readonly mode again.
                this.set('readonly', true);

                // Imitate click on component.
                _context6.next = 28;
                return (0, _testHelpers.click)($component);

              case 28:

                // Check after click state.
                assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked after click');
                assert.strictEqual(latestEventObjects.change, null, 'Component doesn\'t send \'change\' action in readonly mode');

              case 30:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x6) {
        return _ref7.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-dropdown-test', ['ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'ember-qunit', '@ember/test-helpers'], function (_translations, _translations2, _emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var animationDuration = Ember.$.fn.dropdown.settings.duration + 100;

  (0, _emberQunit.module)('Integration | Component | flexberry-dropdown', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

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

    (0, _emberQunit.test)('it renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $component, $dropdownIcon, $dropdownText, $dropdownMenu, additioanlCssClasses;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(14);

                // Render component.
                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "oYNzYx2F",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"class\"],[[22,[\"class\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $dropdownIcon = $component.children('i.icon');
                $dropdownText = $component.children('div.text');
                $dropdownMenu = $component.children('div.menu');

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
                additioanlCssClasses = 'scrolling compact fluid';

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

              case 20:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _emberQunit.test)('it renders i18n-ed placeholder', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var $component, $dropdownText;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(2);
                this.i18n = this.owner.lookup('service:i18n');

                // Render component.
                _context2.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "5bCPYce6",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-dropdown\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $dropdownText = $component.children('div.default.text');

                // Check <dropdown>'s placeholder.

                assert.strictEqual(Ember.$.trim($dropdownText.text()), Ember.get(_translations.default, 'components.flexberry-dropdown.placeholder'), 'Component\'s inner <dropdown>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

                // Change current locale to 'en' & check <dropdown>'s placeholder again.
                this.set('i18n.locale', 'en');
                assert.strictEqual(Ember.$.trim($dropdownText.text()), Ember.get(_translations2.default, 'components.flexberry-dropdown.placeholder'), 'Component\'s inner <dropdown>\'s placeholder is equals to it\'s value from i18n locales/en/translations');

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _emberQunit.test)('it renders manually defined placeholder', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var placeholder, $component, $dropdownText;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context3.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "F/Gved3Y",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"placeholder\"],[[22,[\"placeholder\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Set <dropdown>'s placeholder' & render component.
                placeholder = 'please type some text';

                this.set('placeholder', placeholder);

                // Retrieve component.
                $component = this.$().children();
                $dropdownText = $component.children('div.default.text');

                // Check <dropdown>'s placeholder.

                assert.strictEqual(Ember.$.trim($dropdownText.text()), placeholder);

                // Change placeholder's value & check <dropdown>'s placeholder again.
                placeholder = 'dropdown has no value';
                this.set('placeholder', placeholder);
                assert.strictEqual(Ember.$.trim($dropdownText.text()), placeholder);

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _emberQunit.test)('readonly mode works properly', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
        var $component, $dropdownMenu;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context4.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "2NTwYzij",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"readonly\"],[true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $dropdownMenu = $component.children('div.menu');

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

              case 7:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());

    (0, _emberQunit.skip)('needChecksOnValue mode properly', function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
        var _this = this;

        var exceptionHandler, itemsArray, newValue;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                exceptionHandler = Ember.Test.Adapter.exception;

                Ember.Test.Adapter.exception = function (error) {
                  throw error;
                };

                // Create array for testing.
                itemsArray = ['Caption1', 'Caption2', 'Caption3'];

                this.set('itemsArray', itemsArray);

                // Render component.
                _context5.next = 6;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Qnk53n/N",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"value\",\"items\",\"needChecksOnValue\"],[[22,[\"value\"]],[22,[\"itemsArray\"]],[22,[\"needChecksOnValue\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 6:

                // Change property binded to 'value' & check them.
                this.set('needChecksOnValue', true);
                newValue = 'Caption4';

                // Check that errors handled properly by catching the exception.
                // assert.throws(() => { this.set('value', newValue); }, new RegExp(newValue));

                _context5.next = 10;
                return assert.rejects(function () {
                  _this.set('value', newValue);
                });

              case 10:

                Ember.Test.Adapter.exception = exceptionHandler;

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x5) {
        return _ref6.apply(this, arguments);
      };
    }());

    (0, _emberQunit.test)('dropdown with items represented by object renders properly', function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
        var itemsObject, $component, $dropdownMenu, $dropdownItem, itemsObjectKeys;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                assert.expect(3);

                // Create objects for testing.
                itemsObject = {
                  item1: 'Caption1',
                  item2: 'Caption2',
                  item3: 'Caption3'
                };

                this.set('itemsObject', itemsObject);

                // Render component.
                _context6.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Ry1dXV6N",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"items\"],[[22,[\"itemsObject\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $dropdownMenu = $component.children('div.menu');
                $dropdownItem = $dropdownMenu.children('div.item');

                // Check component's captions and objects.

                itemsObjectKeys = Object.keys(itemsObject);

                $dropdownItem.each(function (i) {
                  var $item = Ember.$(this);
                  var itemKey = itemsObjectKeys[i];

                  // Check that the captions matches the objects.
                  assert.strictEqual($item.attr('data-value'), itemKey, 'Component\'s item\'s сaptions matches the objects');
                });

              case 10:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x6) {
        return _ref7.apply(this, arguments);
      };
    }());

    (0, _emberQunit.test)('dropdown with items represented by array renders properly', function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
        var itemsArray, $component, $dropdownMenu, $dropdownItem;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                assert.expect(3);

                // Create array for testing.
                itemsArray = ['Caption1', 'Caption2', 'Caption3'];

                this.set('itemsArray', itemsArray);

                // Render component.
                _context7.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "1OcXHyQc",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"items\"],[[22,[\"itemsArray\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $dropdownMenu = $component.children('div.menu');
                $dropdownItem = $dropdownMenu.children('div.item');

                // Check component's captions and array.

                $dropdownItem.each(function (i) {
                  var $item = Ember.$(this);

                  // Check that the captions matches the array.
                  assert.strictEqual($item.attr('data-value'), String(i), 'Component\'s item\'s сaptions matches the array');
                });

              case 9:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x7) {
        return _ref8.apply(this, arguments);
      };
    }());

    (0, _emberQunit.test)('expand animation works properly', function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(assert) {
        var itemsArray, $component, $dropdownMenu, asyncAnimationsCompleted;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                assert.expect(9);

                // Create array for testing.
                itemsArray = ['Caption1', 'Caption2', 'Caption3'];

                this.set('itemsArray', itemsArray);

                // Render component.
                _context8.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "1OcXHyQc",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"items\"],[[22,[\"itemsArray\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $dropdownMenu = $component.children('div.menu');

                // Check that component is collapsed by default.

                assert.strictEqual($component.hasClass('active'), false, 'Component hasn\'t class \'active\'');
                assert.strictEqual($component.hasClass('visible'), false, 'Component hasn\'t class \'visible\'');
                assert.strictEqual($dropdownMenu.hasClass('visible'), false, 'Component\'s menu hasn\'t class \'visible\'');
                assert.strictEqual($dropdownMenu.hasClass('hidden'), false, 'Component\'s menu hasn\'t class \'hidden\'');

                asyncAnimationsCompleted = assert.async();

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

              case 13:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function (_x8) {
        return _ref9.apply(this, arguments);
      };
    }());

    (0, _emberQunit.test)('collapse animation works properly', function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(assert) {
        var itemsArray, $component, $dropdownMenu, asyncAnimationsCompleted;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                assert.expect(9);

                // Create array for testing.
                itemsArray = ['Caption1', 'Caption2', 'Caption3'];

                this.set('itemsArray', itemsArray);

                // Render component.
                _context9.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "1OcXHyQc",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"items\"],[[22,[\"itemsArray\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $dropdownMenu = $component.children('div.menu');
                asyncAnimationsCompleted = assert.async();

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

              case 9:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function (_x9) {
        return _ref10.apply(this, arguments);
      };
    }());

    (0, _emberQunit.test)('changes in inner <dropdown> causes changes in property binded to \'value\'', function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(assert) {
        var _this2 = this;

        var itemsArray, $component, $dropdownMenu, itemCaption, asyncAnimationsCompleted;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                assert.expect(5);

                // Create array for testing.
                itemsArray = ['Caption1', 'Caption2', 'Caption3'];

                this.set('itemsArray', itemsArray);
                this.set('value', null);

                // Render component.
                _context10.next = 6;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "f+1idt22",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"items\",\"value\"],[[22,[\"itemsArray\"]],[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 6:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $dropdownMenu = $component.children('div.menu');

                // Caption of the item to be selected.

                itemCaption = itemsArray[2];

                // Select item & perform all necessary checks.

                asyncAnimationsCompleted = assert.async();

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

              case 11:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function (_x10) {
        return _ref11.apply(this, arguments);
      };
    }());

    (0, _emberQunit.test)('changes in inner <dropdown> causes call to \'onChange\' action', function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(assert) {
        var itemsArray, onChangeHasBeenCalled, onChangeArgument, $component, itemCaption, asyncAnimationsCompleted;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                assert.expect(2);

                // Create array for testing.
                itemsArray = ['Caption1', 'Caption2', 'Caption3'];

                this.set('itemsArray', itemsArray);
                this.set('value', null);

                onChangeHasBeenCalled = false;
                onChangeArgument = void 0;

                this.set('onDropdownChange', function (e) {
                  onChangeHasBeenCalled = true;
                  onChangeArgument = e;
                });

                // Render component.
                _context11.next = 9;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "d++hPR9O",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-dropdown\",null,[[\"value\",\"items\",\"onChange\"],[[22,[\"value\"]],[22,[\"itemsArray\"]],[21,0,[\"onDropdownChange\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 9:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Caption of the item to be selected.

                itemCaption = itemsArray[2];

                // Select item & perform all necessary checks.

                asyncAnimationsCompleted = assert.async();

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

              case 13:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function (_x11) {
        return _ref12.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-edit-panel-test', ['ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'qunit', '@ember/test-helpers', 'ember-qunit'], function (_i18n, _translations, _translations2, _qunit, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry edit panel', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      // Register translations
      this.owner.register('locale:ru/translations', _translations.default);
      this.owner.register('locale:en/translations', _translations2.default);
      this.owner.register('service:i18n', _i18n.default);

      // Inject i18n service into all components
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      // Set language to English for tests
      this.owner.lookup('service:i18n').set('locale', 'en');
    });

    // Helper method to check panel buttons.
    var checkPanelButtons = function checkPanelButtons($panelButtons, panelButtons, assert) {
      var isCustomButtons = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      $panelButtons.each(function (i) {
        var $item = Ember.$(this);
        var expectButton = panelButtons[i];
        var buttonCaption = expectButton.text;
        if (!isCustomButtons) {
          buttonCaption = expectButton.text.string;
        }

        assert.strictEqual($item.prop('tagName'), 'BUTTON', 'Component\'s button wrapper is a <button>');
        assert.ok($item.hasClass('ui button'), 'Component\'s button has \'ui button\' class');
        assert.ok($item.hasClass(expectButton.class), 'Component\'s button class is a ' + expectButton.class);
        assert.strictEqual(Ember.$.trim($item.text()), buttonCaption, 'Component\'s button caption is a ' + buttonCaption);

        if (expectButton.class !== 'close-button') {
          assert.strictEqual($item.attr('type'), expectButton.type, 'Components type is a ' + expectButton.type);
        }
      });
    };

    var panelButtons = [{
      type: 'submit',
      class: 'button-one-class',
      disabled: false,
      text: 'buttonOneCaption',
      action: 'firstButtonClick'
    }, {
      type: 'submit',
      class: 'button-two-class',
      disabled: false,
      text: 'buttonTwoCaption',
      action: 'save'
    }, {
      type: 'submit',
      class: 'button-three-class',
      disabled: false,
      text: 'buttonThreeCaption',
      action: 'threeButtonClick'
    }, {
      type: 'submit',
      class: 'button-four-class',
      disabled: false,
      text: 'buttonFourCaption',
      action: 'save'
    }, {
      type: 'submit',
      class: 'button-five-class',
      disabled: true,
      text: 'buttonFive',
      action: 'save'
    }];

    (0, _qunit.test)('flexberry-edit-panel with default buttons renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var i18n, panelButtons, $component, $panelButtons;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(21);
                i18n = this.owner.lookup('service:i18n');

                // Create objects for testing.

                panelButtons = [{
                  type: 'submit',
                  class: 'save-button',
                  disabled: false,
                  text: i18n.t('forms.edit-form.save-button-text'),
                  action: 'save'
                }, {
                  type: 'submit',
                  class: 'save-close-button',
                  disabled: false,
                  text: i18n.t('forms.edit-form.saveAndClose-button-text'),
                  action: 'save'
                }, {
                  type: 'submit',
                  class: 'save-del-button',
                  disabled: false,
                  text: i18n.t('forms.edit-form.delete-button-text'),
                  action: 'save'
                }];

                this.set('panelButtons', panelButtons);

                // Render component.
                _context.next = 6;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "mg1CiAIO",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-edit-panel\",null,[[\"showCloseButton\",\"deepMount\",\"buttons\"],[true,true,[22,[\"panelButtons\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 6:

                panelButtons.push({
                  class: 'close-button',
                  text: i18n.t('forms.edit-form.close-button-text')
                });
                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Check wrapper <div>.

                assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
                assert.ok($component.hasClass('flexberry-edit-panel'), 'Component\'s wrapper has \'flexberry-edit-panel\' css-class');

                // Check component's buttons.
                $panelButtons = $component.children('button');

                checkPanelButtons($panelButtons, panelButtons, assert);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('flexberry-edit-panel with custom buttons renders properly', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var $component, $panelButtons, $menuButtons;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(24);

                // Create objects for testing.
                this.set('panelButtons', panelButtons);

                // Render component.
                _context2.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "nI2g1Tp+",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-edit-panel\",null,[[\"showCloseButton\",\"deepMount\",\"buttons\"],[false,true,[22,[\"panelButtons\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Check wrapper <div>.

                assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
                assert.ok($component.hasClass('flexberry-edit-panel'), 'Component\'s wrapper has \' flexberry-edit-panel\' css-class');

                // Check component's captions.
                $panelButtons = $component.children('button');
                $menuButtons = $component.children('ui dropdown.menu-buttons');

                assert.strictEqual($panelButtons.length, panelButtons.length - 1, 'Component\'s buttons');
                assert.strictEqual($menuButtons.length, 0, 'Component\'s dropdown');

                checkPanelButtons($panelButtons, panelButtons, assert, true);

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('flexberry-edit-panel with custom buttons and dropdown renders properly', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var $component, $panelButtons, $menuButtons, $menuItems, menuItems;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(20);

                // Create objects for testing.
                this.set('panelButtons', panelButtons);

                Ember.$('.ember-application').width(360);

                // Render component.
                _context3.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "nI2g1Tp+",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-edit-panel\",null,[[\"showCloseButton\",\"deepMount\",\"buttons\"],[false,true,[22,[\"panelButtons\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Check wrapper <div>.

                assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
                assert.ok($component.hasClass('flexberry-edit-panel'), 'Component\'s wrapper has \' flexberry-edit-panel\' css-class');

                // Check component's captions.
                $panelButtons = $component.children('button');
                $menuButtons = $component.children('.ui.dropdown.menu-buttons');


                assert.strictEqual($panelButtons.length, 2, 'Component\'s buttons');
                assert.strictEqual($menuButtons.length, 1, 'Component\'s dropdown');

                checkPanelButtons($panelButtons, panelButtons.slice(0, 2), assert, true);

                $menuItems = $menuButtons.children('.button-dropdown-menu').children('.item');
                menuItems = panelButtons.slice(2);

                $menuItems.each(function (i) {
                  var $item = Ember.$(this);
                  var expectButton = menuItems[i];

                  assert.strictEqual($item.prop('tagName'), 'DIV', 'Component\'s button wrapper is a <div>');
                  assert.ok($item.hasClass(expectButton.class), 'Component\'s dropdown item class is a ' + expectButton.class);
                  assert.strictEqual(Ember.$.trim($item.text()), expectButton.text, 'Component\'s dropdown item caption is a ' + expectButton.text);
                });

              case 16:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('flexberry-edit-panel with custom buttons and dropdown actions', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
        var $component, $panelButtons;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                assert.expect(1);

                this.set('actions', {
                  buttonClick: function buttonClick(className) {
                    Ember.$('.button-two-class').addClass(className);
                  }
                });

                panelButtons[0].action = 'firstButtonClick';
                panelButtons[2].action = 'threeButtonClick';

                // Create objects for testing.
                this.set('panelButtons', panelButtons);

                // Render component.
                _context4.next = 7;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "WsDqfyMd",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-edit-panel\",null,[[\"showCloseButton\",\"deepMount\",\"buttons\",\"firstButtonClick\"],[false,false,[22,[\"panelButtons\"]],[26,\"action\",[[21,0,[]],\"buttonClick\",\"first-button-clicked\"],null]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 7:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $panelButtons = $component.children('button');
                _context4.next = 11;
                return Ember.run(function () {
                  $panelButtons[0].click();
                });

              case 11:

                assert.ok(Ember.$('.button-two-class').hasClass('first-button-clicked'), 'Component has css-class \'first-button-clicked\' after click');

              case 12:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-error-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-error', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('Component renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.set('error', new Error('Error, error, error...'));
                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "jAayP0on",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-error\",null,[[\"error\",\"modalContext\"],[[22,[\"error\"]],\"body\"]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:
                assert.ok(/Error, error, error.../.test(this.element.textContent), 'Error message is displayed correctly');

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-field-test', ['ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'qunit', '@ember/test-helpers', 'ember-qunit'], function (_i18n, _translations, _translations2, _qunit, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-field', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.owner.register('locale:ru/translations', _translations.default);
      this.owner.register('locale:en/translations', _translations2.default);
      this.owner.register('service:i18n', _i18n.default);

      this.i18n = this.owner.lookup('service:i18n');
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    });

    (0, _qunit.test)('it renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $component, $fieldTextbox, additioanlCssClasses;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(13);

                // Render component.
                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "IwKP+my/",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"class\"],[[22,[\"class\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldTextbox = $component.children('div.flexberry-textbox');

                // Check wrapper <div>.

                assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
                assert.strictEqual($component.hasClass('flexberry-field'), true, 'Component\'s wrapper has \' flexberry-field\' css-class');
                assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
                assert.strictEqual($component.hasClass('field'), true, 'Component\'s wrapper has \'field\' css-class');
                assert.strictEqual($fieldTextbox.length === 1, true, 'Component has inner \'flexberry-textbox\'');

                // Check wrapper's additional CSS-classes.
                additioanlCssClasses = 'transparent mini huge error';

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

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('label mode works properly', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var labelText;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context2.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "/civMie0",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"class\",\"label\"],[[22,[\"class\"]],[22,[\"label\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Check that label attribute doesn't exist now.
                this.set('label', null);
                assert.strictEqual(this.get('label'), null, 'Component\'s hasn\'t inner <label>');

                // Add text for label & check that label attribute exist.
                labelText = 'Some text for label';

                this.set('label', labelText);

                assert.strictEqual(this.get('label'), labelText, 'Component has inner <label>');

                // Check that label attribute doesn't exist now.
                this.set('label', null);
                assert.strictEqual(this.get('label'), null, 'Component\'s hasn\'t inner <label>');

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('readonly mode works properly', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var $component, $fieldInput;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context3.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "6FeqLNId",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"class\",\"readonly\"],[[22,[\"class\"]],[22,[\"readonly\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldInput = Ember.$('.flexberry-textbox input', $component);

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

              case 12:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('readonly mode works properly with value', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
        var _this = this;

        var $component, $fieldInput, newValue;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                assert.expect(2);

                // Set <input>'s value' & render component.
                this.set('value', null);
                this.set('readonly', true);
                _context4.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "W9EvN/jF",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"readonly\",\"value\"],[[22,[\"readonly\"]],[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldInput = Ember.$('.flexberry-textbox input', $component);


                $fieldInput.on('change', function (e) {
                  if (_this.get('readonly')) {
                    e.stopPropagation();
                    $fieldInput.val(null);
                  }
                });

                newValue = 'New value';

                $fieldInput.val(newValue);
                $fieldInput.change();

                // Check <input>'s value not changed.
                assert.strictEqual(Ember.$.trim($fieldInput.val()), '', 'Component\'s inner <input>\'s value not changed');
                assert.strictEqual(this.get('value'), null, 'Component\'s property binded to unchanged \'value\'');

              case 13:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('click on field in readonly mode doesn\'t change value & it\'s type', function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
        var value, $component, $fieldInput;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                assert.expect(3);

                // Set <input>'s value' & render component.
                value = 123;

                this.set('value', value);
                _context5.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "kjfAAAZM",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"readonly\",\"value\"],[true,[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldInput = Ember.$('.flexberry-textbox input', $component);


                $fieldInput.click();
                $fieldInput.change();

                // Check <input>'s value not changed.
                assert.strictEqual(Ember.$.trim($fieldInput.val()), '' + value, 'Component\'s inner <input>\'s value not changed');
                assert.strictEqual(this.get('value'), value, 'Value binded to component\'s \'value\' property is unchanged');
                assert.strictEqual(Ember.typeOf(this.get('value')), 'number', 'Value binded to component\'s \'value\' property is still number');

              case 12:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x5) {
        return _ref6.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it renders i18n-ed placeholder', function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
        var $component, $fieldInput;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context6.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "SjI7NtQV",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-field\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldInput = Ember.$('.flexberry-textbox input', $component);

                // Check <input>'s placeholder.

                assert.strictEqual(Ember.$.trim($fieldInput.attr('placeholder')), Ember.get(_translations.default, 'components.flexberry-field.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

                // Change current locale to 'en' & check <input>'s placeholder again.
                _context6.next = 8;
                return this.set('i18n.locale', 'en');

              case 8:
                assert.strictEqual(Ember.$.trim($fieldInput.attr('placeholder')), Ember.get(_translations2.default, 'components.flexberry-field.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s value from i18n locales/en/translations');

              case 9:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x6) {
        return _ref7.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it renders manually defined placeholder', function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
        var $component, $fieldInput, placeholder;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                assert.expect(2);

                // Set <input>'s placeholder' & render component.
                _context7.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Qm8td5g4",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"placeholder\"],[[22,[\"placeholder\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldInput = Ember.$('.flexberry-textbox input', $component);
                placeholder = 'input is empty, please type some text';

                this.set('placeholder', placeholder);

                // Check <input>'s placeholder.
                assert.strictEqual(Ember.$.trim($fieldInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

                // Change placeholder's value & check <input>'s placeholder again.
                placeholder = 'input has no value';
                this.set('placeholder', placeholder);
                assert.strictEqual(Ember.$.trim($fieldInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');

              case 11:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x7) {
        return _ref8.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('type mode works properly', function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(assert) {
        var $component, $fieldInput;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "PemiHgzt",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"class\",\"type\"],[[22,[\"class\"]],[22,[\"type\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldInput = Ember.$('.flexberry-textbox input', $component);

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

              case 16:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function (_x8) {
        return _ref9.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('changes in inner <input> causes changes in property binded to \'value\'', function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(assert) {
        var $component, $fieldInput, newValue;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                assert.expect(4);

                // Set <input>'s value' & render component.
                this.set('value', null);
                _context9.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "VmTtyhIv",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldInput = Ember.$('.flexberry-textbox input', $component);

                // Check <input>'s value & binded value for initial emptyness.

                assert.strictEqual(Ember.$.trim($fieldInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
                assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

                // Change <input>'s value (imitate situation when user typed something into component's <input>)
                // & check them again ('change' event is needed to force bindings work).
                newValue = 'Some text typed into field\'s inner input';

                $fieldInput.val(newValue);
                $fieldInput.change();

                assert.strictEqual(Ember.$.trim($fieldInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
                assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');

              case 13:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function (_x9) {
        return _ref10.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('attribute maxlength rendered in html', function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(assert) {
        var $component, $fieldInput;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                assert.expect(1);

                // Render component.
                _context10.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "w2woXa5q",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"maxlength\"],[5]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldInput = Ember.$('.flexberry-textbox input', $component);

                // Check <input>'s maxlength attribute.

                assert.strictEqual($fieldInput.attr('maxlength'), '5', 'Component\'s inner <input>\'s attribute maxlength rendered');

              case 6:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function (_x10) {
        return _ref11.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('changes in property binded to \'value\' causes changes in inner <input>', function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(assert) {
        var $component, $fieldInput, newValue;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                assert.expect(4);

                // Set <input>'s value' & render component.
                this.set('value', null);
                _context11.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "VmTtyhIv",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldInput = Ember.$('.flexberry-textbox input', $component);

                // Check <input>'s value & binded value for initial emptyness.

                assert.strictEqual(Ember.$.trim($fieldInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
                assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

                // Change property binded to 'value' & check them again.
                newValue = 'Some text typed into field\'s inner input';

                this.set('value', newValue);

                assert.strictEqual(Ember.$.trim($fieldInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
                assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');

              case 12:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function (_x11) {
        return _ref12.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-groupedit-test', ['qunit', 'ember-qunit', '@ember/test-helpers', 'ember-flexberry/services/user-settings', 'dummy/models/components-examples/flexberry-groupedit/shared/aggregator', 'dummy/models/ember-flexberry-dummy-suggestion', 'ember-flexberry/components/flexberry-base-component'], function (_qunit, _emberQunit, _testHelpers, _userSettings, _aggregator, _emberFlexberryDummySuggestion, _flexberryBaseComponent) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-groupedit', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n'),
        userSettingsService: Ember.inject.service('user-settings')
      });
      _userSettings.default.reopen({
        isUserSettingsServiceEnabled: false
      });

      this.owner.lookup('service:log').set('enabled', false);
    });

    hooks.afterEach(function () {
      _flexberryBaseComponent.default.prototype.currentController = null;
    });

    (0, _qunit.test)('ember-groupedit element by default test', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var store, model, testComponentName, $component, $componentButtonAdd, $componentObjectListViewFirstCellAsterisk, $componentObjectListViewFirstCell, $flexberryCheckbox, $minusButton, $editMenuButton;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(9);
                store = this.owner.lookup('service:store');
                model = void 0;

                Ember.run(function () {
                  model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                });

                testComponentName = 'my-test-component-to-count-rerender';


                this.set('proj', _aggregator.default.projections.get('AggregatorE'));
                this.set('model', model);
                this.set('componentName', testComponentName);
                this.set('searchForContentChange', true);
                _context.next = 11;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "/LNc+cH4",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showAsteriskInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 11:

                // Add record.
                $component = this.element.querySelector('.groupedit-toolbar');
                $componentButtonAdd = $component.querySelector('.ui.button');
                _context.next = 15;
                return (0, _testHelpers.click)($componentButtonAdd);

              case 15:
                _context.next = 17;
                return (0, _testHelpers.settled)();

              case 17:
                $componentObjectListViewFirstCellAsterisk = Ember.$('.asterisk', this.element);

                // Check object-list-view <i>.

                assert.strictEqual($componentObjectListViewFirstCellAsterisk.length, 1, 'Component has inner object-list-view-operations blocks');
                assert.strictEqual($componentObjectListViewFirstCellAsterisk.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
                assert.ok($componentObjectListViewFirstCellAsterisk.hasClass('asterisk'), 'Component\'s inner object-list-view has \'asterisk\' css-class');
                assert.ok($componentObjectListViewFirstCellAsterisk.hasClass('small'), 'Component\'s inner object-list-view has \'small\' css-class');
                assert.ok($componentObjectListViewFirstCellAsterisk.hasClass('red'), 'Component\'s inner object-list-view has \'red\' css-class');
                assert.ok($componentObjectListViewFirstCellAsterisk.hasClass('icon'), 'Component\'s inner object-list-view has \'icon\' css-class');

                $componentObjectListViewFirstCell = Ember.$('.object-list-view-helper-column', this.element);
                $flexberryCheckbox = Ember.$('.flexberry-checkbox', $componentObjectListViewFirstCell);


                assert.ok($flexberryCheckbox.length, 'Component has flexberry-checkbox in first cell blocks');

                $minusButton = Ember.$('.minus', $componentObjectListViewFirstCell);


                assert.strictEqual($minusButton.length, 0, 'Component hasn\'t delete button in first cell');

                $editMenuButton = Ember.$('.button.right', this.element);


                assert.strictEqual($editMenuButton.length, 0, 'Component hasn\'t edit menu in last cell');

              case 31:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it renders', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var store, model;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // Set any properties with this.set('myProperty', 'value');
                // Handle any actions with this.on('myAction', function(val) { ... });
                assert.expect(1);

                store = this.owner.lookup('service:store');
                model = void 0;

                Ember.run(function () {
                  model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                });

                this.set('proj', _aggregator.default.projections.get('AggregatorE'));
                this.set('model', model);
                _context2.next = 8;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "wU3hDn7c",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-groupedit\",null,[[\"modelProjection\",\"content\",\"componentName\"],[[22,[\"proj\"]],[22,[\"model\",\"details\"]],\"my-group-edit\"]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 8:
                assert.ok(true);

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it properly rerenders', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var _this = this;

        var store;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(5);
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this.set('model', model);
                  _this.set('componentName', testComponentName);
                  _this.set('searchForContentChange', true);
                });

                _context3.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "I3iZcFDs",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                assert.equal(this.element.querySelectorAll('.object-list-view tr').length, 2);

                Ember.run(function () {
                  var detailModel = _this.get('model.details');
                  detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '1' }));
                  detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '2' }));
                });

                _context3.next = 9;
                return (0, _testHelpers.settled)();

              case 9:
                assert.equal(this.element.querySelectorAll('.object-list-view tr').length, 3);

                Ember.run(function () {
                  var detailModel = _this.get('model.details');
                  detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '3' }));
                });

                _context3.next = 13;
                return (0, _testHelpers.settled)();

              case 13:
                assert.equal(this.element.querySelectorAll('.object-list-view tr').length, 4);

                Ember.run(function () {
                  _this.get('model.details').get('firstObject').deleteRecord();
                });

                _context3.next = 17;
                return (0, _testHelpers.settled)();

              case 17:
                assert.equal(this.element.querySelectorAll('.object-list-view tr').length, 3);

                Ember.run(function () {
                  _this.set('searchForContentChange', false);

                  var detailModel = _this.get('model.details');
                  detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '4' }));
                });

                _context3.next = 21;
                return (0, _testHelpers.settled)();

              case 21:
                assert.equal(this.element.querySelectorAll('.object-list-view tr').length, 3);

              case 22:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it properly rerenders by default', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
        var _this2 = this;

        var store;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                assert.expect(72);

                store = this.owner.lookup('service:store');


                Ember.run(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                  var model, testComponentName, $detailsAtributes, $detailsAtributesArray, $component, $componentGroupEditToolbar, $componentButtons, $componentButtonAdd, $componentButtonAddIcon, $componentButtonRemove, $componentButtonDefauldSetting, $componentButtonRemoveIcon, $componentListViewContainer, $componentJCLRgrips, $componentJCLRgrip, $componentJCLRgripFirst, $componentJCLRgripLast, $componentObjectListView, $componentObjectListViewThead, $componentObjectListViewTr, $componentObjectListViewThFirstCell, $componentObjectListViewThs, $componentObjectListViewTh, index, $componentObjectListViewThDiv, $componentObjectListViewThDivSpan, $componentObjectListViewBody, $componentObjectListViewTd, $componentObjectListViewTdInner;
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                          testComponentName = 'my-test-component-to-count-rerender';


                          _this2.set('proj', _aggregator.default.projections.get('AggregatorE'));
                          _this2.set('model', model);
                          _this2.set('componentName', testComponentName);
                          _this2.set('searchForContentChange', true);
                          _context4.next = 8;
                          return (0, _testHelpers.render)(Ember.HTMLBars.template({
                            "id": "bVRz/YCl",
                            "block": "{\"symbols\":[],\"statements\":[[0,\"\\n          \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]]]]],false]],\"hasEval\":false}",
                            "meta": {}
                          }));

                        case 8:

                          assert.equal(Ember.$(_this2.element, '.object-list-view').find('tr').length, 2);

                          $detailsAtributes = _this2.get('proj.attributes.details.attributes');
                          $detailsAtributesArray = Object.keys($detailsAtributes);
                          $component = Ember.$(_this2.element).children();
                          $componentGroupEditToolbar = $component.children('.groupedit-toolbar');

                          // Check groupedit-toolbar <div>.

                          assert.strictEqual($componentGroupEditToolbar.length === 1, true, 'Component has inner groupedit-toolbar block');
                          assert.strictEqual($componentGroupEditToolbar.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
                          assert.strictEqual($componentGroupEditToolbar.hasClass('ember-view'), true, 'Component\'s inner groupedit-toolbar block has \'ember-view\' css-class');
                          assert.strictEqual($componentGroupEditToolbar.hasClass('groupedit-toolbar'), true, 'Component inner has \'groupedit-toolbar\' css-class');

                          $componentButtons = $componentGroupEditToolbar.children('.ui.button');

                          // Check button count.

                          assert.strictEqual($componentButtons.length === 3, true, 'Component has inner two button blocks');

                          $componentButtonAdd = Ember.$($componentButtons[0]);

                          // Check buttonAdd <button>.

                          assert.strictEqual($componentButtonAdd.length === 1, true, 'Component has inner button block');
                          assert.strictEqual($componentButtonAdd.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
                          assert.strictEqual($componentButtonAdd.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
                          assert.strictEqual($componentButtonAdd.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');

                          $componentButtonAddIcon = $componentButtonAdd.children('i');

                          // Check buttonAddIcon <i>.

                          assert.strictEqual($componentButtonAddIcon.length === 1, true, 'Component has inner button block');
                          assert.strictEqual($componentButtonAddIcon.prop('tagName'), 'I', 'Component\'s inner groupedit block is a <i>');
                          assert.strictEqual($componentButtonAddIcon.hasClass('plus'), true, 'Component\'s inner groupedit block has \'plus\' css-class');
                          assert.strictEqual($componentButtonAddIcon.hasClass('icon'), true, 'Component\'s inner groupedit block has \'icon\' css-class');

                          $componentButtonRemove = Ember.$($componentButtons[1]);

                          // Check buttonRemove <button>.

                          assert.strictEqual($componentButtonRemove.length === 1, true, 'Component has inner button block');
                          assert.strictEqual($componentButtonRemove.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
                          assert.strictEqual($componentButtonRemove.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
                          assert.strictEqual($componentButtonRemove.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');
                          assert.strictEqual($componentButtonRemove.hasClass('disabled'), true, 'Component\'s inner groupedit block has \'disabled\' css-class');

                          $componentButtonDefauldSetting = Ember.$($componentButtons[2]);

                          // Check buttonRemove <button>.

                          assert.strictEqual($componentButtonDefauldSetting.length === 1, true, 'Component has inner button block');
                          assert.strictEqual($componentButtonDefauldSetting.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
                          assert.strictEqual($componentButtonDefauldSetting.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
                          assert.strictEqual($componentButtonDefauldSetting.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');

                          $componentButtonRemoveIcon = $componentButtonRemove.children('i');

                          // Check componentButtonRemove <i>.

                          assert.strictEqual($componentButtonRemoveIcon.length === 1, true, 'Component has inner button block');
                          assert.strictEqual($componentButtonRemoveIcon.prop('tagName'), 'I', 'Component\'s inner groupedit block is a <i>');
                          assert.strictEqual($componentButtonRemoveIcon.hasClass('minus'), true, 'Component\'s inner groupedit block has \'minus\' css-class');
                          assert.strictEqual($componentButtonRemoveIcon.hasClass('icon'), true, 'Component\'s inner groupedit block has \'icon\' css-class');

                          $componentListViewContainer = $component.children('.object-list-view-container');

                          // Check list-view-container <div>.

                          assert.strictEqual($componentListViewContainer.length === 1, true, 'Component has inner list-view-container block');
                          assert.strictEqual($componentListViewContainer.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
                          assert.strictEqual($componentListViewContainer.hasClass('ember-view'), true, 'Component\'s inner list-view-container block has \'ember-view\' css-class');
                          assert.strictEqual($componentListViewContainer.hasClass('object-list-view-container'), true, 'Component has \'object-list-view-container\' css-class');

                          $componentJCLRgrips = $componentListViewContainer.children('.JCLRgrips');

                          // Check JCLRgrips <div>.

                          assert.strictEqual($componentJCLRgrips.length === 1, true, 'Component has inner JCLRgrips blocks');
                          assert.strictEqual($componentJCLRgrips.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
                          assert.strictEqual($componentJCLRgrips.hasClass('JCLRgrips'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');

                          $componentJCLRgrip = $componentJCLRgrips.children('.JCLRgrip');

                          // Check JCLRgrip <div>.

                          assert.strictEqual($componentJCLRgrip.length === 7, true, 'Component has inner JCLRgrip blocks');

                          $componentJCLRgripFirst = Ember.$($componentJCLRgrip[0]);

                          // Check first JCLRgrip <div>.

                          assert.strictEqual($componentJCLRgripFirst.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
                          assert.strictEqual($componentJCLRgripFirst.hasClass('JCLRgrip'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');

                          $componentJCLRgripLast = Ember.$($componentJCLRgrip[6]);

                          // Check last JCLRgrip <div>.

                          assert.strictEqual($componentJCLRgripLast.length === 1, true, 'Component has inner JCLRgrips blocks');
                          assert.strictEqual($componentJCLRgripLast.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
                          assert.strictEqual($componentJCLRgripLast.hasClass('JCLRgrip'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');
                          assert.strictEqual($componentJCLRgripLast.hasClass('JCLRLastGrip'), true, 'Component\'s inner list-view-container block has \'JCLRLastGrip\' css-class');

                          $componentObjectListView = $componentListViewContainer.children('.object-list-view');

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

                          $componentObjectListViewThead = $componentObjectListView.children('thead');
                          $componentObjectListViewTr = $componentObjectListViewThead.children('tr');
                          $componentObjectListViewThFirstCell = $componentObjectListViewTr.children('.object-list-view-operations');

                          // Check object-list-view <th>.

                          assert.strictEqual($componentObjectListViewThFirstCell.length === 1, true, 'Component has inner object-list-view-operations blocks');
                          assert.strictEqual($componentObjectListViewThFirstCell.prop('tagName'), 'TH', 'Component\'s inner component block is a <th>');
                          assert.strictEqual($componentObjectListViewThFirstCell.hasClass('object-list-view-operations'), true, 'Component has \'object-list-view-operations\' css-class');
                          assert.strictEqual($componentObjectListViewThFirstCell.hasClass('collapsing'), true, 'Component has \'collapsing\' css-class');

                          $componentObjectListViewThs = $componentObjectListViewTr.children('.dt-head-left');

                          // Check object-list-view <th>.

                          assert.strictEqual($componentObjectListViewThs.length === 6, true, 'Component has inner object-list-view-operations blocks');

                          $componentObjectListViewTh = Ember.$($componentObjectListViewThs[0]);

                          // Check object-list-view <th>.

                          assert.strictEqual($componentObjectListViewTh.length === 1, true, 'Component has inner object-list-view-operations blocks');
                          assert.strictEqual($componentObjectListViewTh.prop('tagName'), 'TH', 'Component\'s inner component block is a <th>');
                          assert.strictEqual($componentObjectListViewTh.hasClass('dt-head-left'), true, 'Component has \'object-list-view-operations\' css-class');
                          assert.strictEqual($componentObjectListViewTh.hasClass('me'), true, 'Component\'s inner object-list-view-operations has \'collapsing\' css-class');
                          assert.strictEqual($componentObjectListViewTh.hasClass('class'), true, 'Component\'s inner object-list-view-operations has \'collapsing\' css-class');

                          for (index = 0; index < 6; ++index) {
                            assert.strictEqual($componentObjectListViewThs[index].innerText.trim().toLowerCase(), $detailsAtributesArray[index], 'title ok');
                          }

                          $componentObjectListViewThDiv = $componentObjectListViewTh.children('div');
                          $componentObjectListViewThDivSpan = $componentObjectListViewThDiv.children('span');

                          // Check object-list-view <span>.

                          assert.strictEqual($componentObjectListViewThDivSpan.length === 1, true, 'Component has inner <span> blocks');

                          $componentObjectListViewBody = $componentObjectListView.children('tbody');

                          $componentObjectListViewTr = $componentObjectListViewBody.children('tr');
                          $componentObjectListViewTd = $componentObjectListViewTr.children('td');
                          $componentObjectListViewTdInner = $componentObjectListViewTd[0];

                          // Check object-list-view <td>.

                          assert.strictEqual($componentObjectListViewTd.length === 1, true, 'Component has inner object-list-view-operations blocks');
                          assert.strictEqual($componentObjectListViewTd.prop('tagName'), 'TD', 'Component\'s inner component block is a <th>');
                          assert.strictEqual($componentObjectListViewTdInner.innerText, 'Нет данных', 'Component\'s inner component block is a <th>');

                        case 102:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, _this2);
                })));

              case 3:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit placeholder test', function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
        var _this3 = this;

        var store;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                store = this.owner.lookup('service:store');


                Ember.run(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                  var model, testComponentName, tempText, $componentObjectListView, $componentObjectListViewBody;
                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                          testComponentName = 'my-test-component-to-count-rerender';


                          _this3.set('proj', _aggregator.default.projections.get('AggregatorE'));
                          _this3.set('model', model);
                          _this3.set('componentName', testComponentName);

                          tempText = 'Temp text.';


                          _this3.set('placeholder', tempText);
                          _context6.next = 9;
                          return (0, _testHelpers.render)(Ember.HTMLBars.template({
                            "id": "1e9e0md9",
                            "block": "{\"symbols\":[],\"statements\":[[0,\"\\n          \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"placeholder\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"placeholder\"]]]]],false]],\"hasEval\":false}",
                            "meta": {}
                          }));

                        case 9:
                          $componentObjectListView = Ember.$('.object-list-view');
                          $componentObjectListViewBody = $componentObjectListView.children('tbody');


                          assert.strictEqual($componentObjectListViewBody.text().trim(), tempText, 'Component has placeholder: ' + tempText);

                        case 12:
                        case 'end':
                          return _context6.stop();
                      }
                    }
                  }, _callee6, _this3);
                })));

              case 2:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x5) {
        return _ref7.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit striped test', function (assert) {
      var _this4 = this;

      var store = this.owner.lookup('service:store');

      Ember.run(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var model, testComponentName, $componentObjectListView;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                testComponentName = 'my-test-component-to-count-rerender';


                _this4.set('proj', _aggregator.default.projections.get('AggregatorE'));
                _this4.set('model', model);
                _this4.set('componentName', testComponentName);
                _this4.set('searchForContentChange', true);
                _context8.next = 8;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "AcclleE3",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n          \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"tableStriped\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],false]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 8:
                $componentObjectListView = Ember.$('.object-list-view');

                // Check object-list-view <div>.

                assert.strictEqual($componentObjectListView.hasClass('striped'), false, 'Component\'s inner object-list-view block has \'striped\' css-class');

              case 10:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, _this4);
      })));
    });

    (0, _qunit.test)('ember-grupedit off defaultSettingsButton, createNewButton and deleteButton test', function (assert) {
      var _this5 = this;

      var store = this.owner.lookup('service:store');

      Ember.run(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var model, testComponentName, $component, $componentButtons;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                testComponentName = 'my-test-component-to-count-rerender';


                _this5.set('proj', _aggregator.default.projections.get('AggregatorE'));
                _this5.set('model', model);
                _this5.set('componentName', testComponentName);
                _this5.set('searchForContentChange', true);
                _context9.next = 8;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "69IvK+4F",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n          \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"createNewButton\",\"deleteButton\",\"showCheckBoxInRow\",\"showAsteriskInRow\",\"defaultSettingsButton\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],false,false,false,false,false]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 8:
                $component = Ember.$(_this5.element).children();
                $componentButtons = Ember.$('.ui.button', $component);


                assert.strictEqual($componentButtons.length === 0, true, 'Component hasn\'t inner two button blocks');

              case 11:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, _this5);
      })));
    });

    (0, _qunit.test)('ember-grupedit allowColumnResize test', function (assert) {
      var _this6 = this;

      var store = this.owner.lookup('service:store');

      Ember.run(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var model, testComponentName, $componentJCLRgrips, $componentObjectListView;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                testComponentName = 'my-test-component-to-count-rerender';


                _this6.set('proj', _aggregator.default.projections.get('AggregatorE'));
                _this6.set('model', model);
                _this6.set('componentName', testComponentName);
                _this6.set('searchForContentChange', true);
                _context10.next = 8;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "pbY0rCnJ",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n          \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showEditMenuItemInRow\",\"allowColumnResize\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true,false]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 8:
                $componentJCLRgrips = Ember.$(Ember.$('.JCLRgrips')[0]);

                // Check JCLRgrips <div>.

                assert.strictEqual($componentJCLRgrips.length === 0, true, 'Component hasn\'t inner JCLRgrips blocks');

                $componentObjectListView = Ember.$(Ember.$('.object-list-view')[0]);

                // Check object-list-view <div>.

                assert.strictEqual($componentObjectListView.hasClass('JColResizer'), false, 'Component\'s inner object-list-view block hasn\'t \'JColResizer\' css-class');

              case 12:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, _this6);
      })));
    });

    (0, _qunit.test)('ember-grupedit showAsteriskInRow test', function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(assert) {
        var _this7 = this;

        var store, $componentButtonAdd, $componentObjectListViewFirstCell;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                assert.expect(1);
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this7.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this7.set('model', model);
                  _this7.set('componentName', testComponentName);
                  _this7.set('searchForContentChange', true);
                });

                _context11.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Z9XTQZNp",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showAsteriskInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],false]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Add record.
                $componentButtonAdd = this.element.querySelector('.ui.button');
                _context11.next = 8;
                return (0, _testHelpers.click)($componentButtonAdd);

              case 8:
                $componentObjectListViewFirstCell = this.element.querySelectorAll('.asterisk');

                // Check object-list-view <i>.

                assert.strictEqual($componentObjectListViewFirstCell.length === 0, true, 'Component has small red asterisk blocks');

              case 10:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function (_x6) {
        return _ref12.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit showCheckBoxInRow test', function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(assert) {
        var _this8 = this;

        var store, $componentButtonAdd, $flexberryCheckbox, $componentObjectListViewEditMenu;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                assert.expect(2);
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this8.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this8.set('model', model);
                  _this8.set('componentName', testComponentName);
                  _this8.set('searchForContentChange', true);
                });

                _context12.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "KKlXRzM7",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showCheckBoxInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],false]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Add record.
                $componentButtonAdd = this.element.querySelector('.ui.button');
                _context12.next = 8;
                return (0, _testHelpers.click)($componentButtonAdd);

              case 8:
                $flexberryCheckbox = this.element.querySelectorAll('.flexberry-checkbox');


                assert.strictEqual($flexberryCheckbox.length === 0, true, 'Component hasn\'t flexberry-checkbox in first cell');

                $componentObjectListViewEditMenu = this.element.querySelectorAll('.button.right.pointing');


                assert.strictEqual($componentObjectListViewEditMenu.length === 0, true, 'Component hasn\'t edit menu in last cell');

              case 12:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      return function (_x7) {
        return _ref13.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it renders and checks the delete button', function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(assert) {
        var _this9 = this;

        var store, $componentButtonAdd, $componentObjectListViewFirstCell, $minusButton;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                assert.expect(1);
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this9.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this9.set('model', model);
                  _this9.set('componentName', testComponentName);
                  _this9.set('searchForContentChange', true);
                });

                _context13.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Y9WWHMdO",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showDeleteButtonInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                $componentButtonAdd = this.element.querySelector('.ui.button');
                _context13.next = 8;
                return (0, _testHelpers.click)($componentButtonAdd);

              case 8:
                $componentObjectListViewFirstCell = this.element.querySelectorAll('.object-list-view-helper-column');
                $minusButton = $componentObjectListViewFirstCell[0].querySelectorAll('.minus');


                assert.strictEqual($minusButton.length === 1, true, 'Component has delete button in first cell');

              case 11:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      return function (_x8) {
        return _ref14.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit showEditMenuItemInRow test', function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(assert) {
        var _this10 = this;

        var store, $componentButtonAdd, $editMenuButton, $editMenuItem, $editMenuItemIcon, $editMenuItemSpan;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                assert.expect(6);
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this10.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this10.set('model', model);
                  _this10.set('componentName', testComponentName);
                  _this10.set('searchForContentChange', true);
                });

                _context14.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "seAsRGdp",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showEditMenuItemInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                $componentButtonAdd = this.element.querySelector('.ui.button');
                _context14.next = 8;
                return (0, _testHelpers.click)($componentButtonAdd);

              case 8:
                $editMenuButton = this.element.querySelector('.button.right.pointing');
                $editMenuItem = $editMenuButton.querySelectorAll('.item');


                assert.strictEqual($editMenuItem.length === 1, true, 'Component has edit menu item in last cell');

                $editMenuItemIcon = $editMenuItem[0].querySelector('.edit');


                assert.strictEqual($editMenuItemIcon !== null, true, 'Component has only edit menu item in last cell');
                assert.strictEqual($editMenuItemIcon.tagName, 'I', 'Component\'s inner component block is a <i>');
                assert.strictEqual($editMenuItemIcon.classList.contains('edit'), true, 'Component\'s inner object-list-view has \'edit\' css-class');
                assert.strictEqual($editMenuItemIcon.classList.contains('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

                $editMenuItemSpan = $editMenuItem[0].querySelector('span');

                assert.strictEqual($editMenuItemSpan.textContent.trim(), 'Редактировать запись', 'Component has edit menu item in last cell');

              case 18:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      return function (_x9) {
        return _ref15.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit showDeleteMenuItemInRow test', function () {
      var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(assert) {
        var _this11 = this;

        var store, $componentButtonAdd, $editMenuButton, $editMenuItem, $editMenuItemIcon, $editMenuItemSpan;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                assert.expect(6);
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this11.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this11.set('model', model);
                  _this11.set('componentName', testComponentName);
                  _this11.set('searchForContentChange', true);
                });

                _context15.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "GHq3vlJI",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showDeleteMenuItemInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                $componentButtonAdd = this.element.querySelector('.ui.button');
                _context15.next = 8;
                return (0, _testHelpers.click)($componentButtonAdd);

              case 8:
                $editMenuButton = this.element.querySelector('.button.right.pointing');
                $editMenuItem = $editMenuButton.querySelectorAll('.item');


                assert.strictEqual($editMenuItem.length === 1, true, 'Component has delete menu item in last cell');

                $editMenuItemIcon = $editMenuItem[0].querySelector('.trash');


                assert.strictEqual($editMenuItemIcon !== null, true, 'Component has only edit menu item in last cell');
                assert.strictEqual($editMenuItemIcon.tagName, 'I', 'Component\'s inner component block is a <i>');
                assert.strictEqual($editMenuItemIcon.classList.contains('trash'), true, 'Component\'s inner object-list-view has \'trash\' css-class');
                assert.strictEqual($editMenuItemIcon.classList.contains('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

                $editMenuItemSpan = $editMenuItem[0].querySelector('span');

                assert.strictEqual($editMenuItemSpan.textContent.trim(), 'Удалить запись', 'Component has delete menu item in last cell');

              case 18:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      return function (_x10) {
        return _ref16.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit showEditMenuItemInRow and showDeleteMenuItemInRow test', function () {
      var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(assert) {
        var _this12 = this;

        var store, $componentButtonAdd, $editMenuButton, $editMenuItem, $editMenuItemIcon;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                assert.expect(11);
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this12.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this12.set('model', model);
                  _this12.set('componentName', testComponentName);
                  _this12.set('searchForContentChange', true);
                });
                _context16.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "6/8KAsTI",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"showEditMenuItemInRow\",\"showDeleteMenuItemInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true,true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                $componentButtonAdd = this.element.querySelector('.ui.button');
                _context16.next = 8;
                return (0, _testHelpers.click)($componentButtonAdd);

              case 8:
                $editMenuButton = this.element.querySelectorAll('.button.right.pointing');
                $editMenuItem = this.element.querySelectorAll('.item', $editMenuButton);


                assert.strictEqual($editMenuItem.length === 2, true, 'Component has edit menu and delete menu item in last cell');

                $editMenuItemIcon = $editMenuItem[0].querySelector('.edit');

                assert.ok($editMenuItemIcon, 'Component has edit menu item in last cell');
                assert.strictEqual($editMenuItemIcon.tagName, 'I', 'Component\'s inner component block is a <i>');
                assert.ok($editMenuItemIcon.classList.contains('edit'), 'Component\'s inner object-list-view has \'edit\' css-class');
                assert.ok($editMenuItemIcon.classList.contains('icon'), 'Component\'s inner object-list-view has \'icon\' css-class');

                $editMenuItemIcon = $editMenuItem[1].querySelector('.trash');
                assert.ok($editMenuItemIcon, 'Component has delete menu item in last cell');
                assert.strictEqual($editMenuItemIcon.tagName, 'I', 'Component\'s inner component block is a <i>');
                assert.ok($editMenuItemIcon.classList.contains('trash'), 'Component\'s inner object-list-view has \'trash\' css-class');
                assert.ok($editMenuItemIcon.classList.contains('icon'), 'Component\'s inner object-list-view has \'icon\' css-class');

                assert.strictEqual($editMenuItem[0].querySelector('span').textContent.trim(), 'Редактировать запись', 'Component has edit menu item in last cell');
                assert.strictEqual($editMenuItem[1].querySelector('span').textContent.trim(), 'Удалить запись', 'Component has delete menu item in last cell');

              case 23:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      return function (_x11) {
        return _ref17.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit rowClickable test', function () {
      var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(assert) {
        var _this13 = this;

        var store, $componentObjectListView;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this13.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this13.set('model', model);
                  _this13.set('componentName', testComponentName);
                  _this13.set('searchForContentChange', true);
                });

                _context17.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "G/bwSCG0",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"searchForContentChange\",\"rowClickable\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"searchForContentChange\"]],true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:
                $componentObjectListView = Ember.$('.object-list-view');

                // Check object-list-view <div>.

                assert.strictEqual($componentObjectListView.hasClass('selectable'), true, 'Component\'s inner object-list-view block has \'selectable\' css-class');

              case 6:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      return function (_x12) {
        return _ref18.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit buttonClass test', function () {
      var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(assert) {
        var _this14 = this;

        var store, tempButtonClass, $componentButtonAdd;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                store = this.owner.lookup('service:store');
                tempButtonClass = 'temp button class';


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this14.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this14.set('model', model);
                  _this14.set('componentName', testComponentName);
                  _this14.set('buttonClass', tempButtonClass);
                });

                _context18.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "htLUA7Ap",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"rowClickable\",\"buttonClass\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],true,[22,[\"buttonClass\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                $componentButtonAdd = Ember.$(Ember.$('.ui.button')[0]);


                assert.strictEqual($componentButtonAdd.hasClass(tempButtonClass), true, 'Button has class ' + tempButtonClass);

              case 7:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      return function (_x13) {
        return _ref19.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit customTableClass test', function () {
      var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(assert) {
        var _this15 = this;

        var store, myCustomTableClass, $componentObjectListView;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                store = this.owner.lookup('service:store');
                myCustomTableClass = 'tempcustomTableClass';


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this15.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this15.set('model', model);
                  _this15.set('componentName', testComponentName);
                  _this15.set('customTableClass', myCustomTableClass);
                });

                _context19.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "i9Orxd/y",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"rowClickable\",\"customTableClass\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],true,[22,[\"customTableClass\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                $componentObjectListView = Ember.$('.object-list-view');


                assert.strictEqual($componentObjectListView.hasClass(myCustomTableClass), true, 'Table has class ' + myCustomTableClass);

              case 7:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      return function (_x14) {
        return _ref20.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit orderable test', function () {
      var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(assert) {
        var _this16 = this;

        var store, $componentObjectListView, $componentObjectListViewTh, $componentOlvFirstHead, $componentOlvFirstDiv, $orderIcon;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                assert.expect(1);
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this16.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this16.set('model', model);
                  _this16.set('componentName', testComponentName);
                  _this16.set('orderable', true);
                });

                _context20.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "HoxVG+Rh",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"orderable\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"orderable\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                $componentObjectListView = this.element.querySelector('.object-list-view');
                $componentObjectListViewTh = $componentObjectListView.querySelectorAll('thead tr th');
                $componentOlvFirstHead = $componentObjectListViewTh[1];
                _context20.next = 10;
                return (0, _testHelpers.click)($componentOlvFirstHead);

              case 10:
                $componentOlvFirstDiv = $componentOlvFirstHead.querySelector('div');
                $orderIcon = $componentOlvFirstDiv.querySelector('div');


                assert.strictEqual(!!$orderIcon, true, 'Table has order');

              case 13:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      return function (_x15) {
        return _ref21.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit menuInRowAdditionalItems without standart element test', function () {
      var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(assert) {
        var _this17 = this;

        var store, $addButton, componentOLVMenu, componentOLVMenuItem, componentOLVMenuItemIcon;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                assert.expect(4);
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';
                  var tempMenuInRowAdditionalItems = [{
                    icon: 'remove icon',
                    title: 'Temp menu item',
                    actionName: 'tempAction'
                  }];

                  _this17.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this17.set('model', model);
                  _this17.set('componentName', testComponentName);
                  _this17.set('menuInRowAdditionalItems', tempMenuInRowAdditionalItems);
                });

                _context21.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "M3K8nyz0",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"menuInRowAdditionalItems\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"menuInRowAdditionalItems\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Add record.
                $addButton = this.element.querySelector('.ui.button');
                _context21.next = 8;
                return (0, _testHelpers.click)($addButton);

              case 8:
                componentOLVMenu = this.element.querySelector('.button.right');
                componentOLVMenuItem = componentOLVMenu.querySelectorAll('.item');


                assert.strictEqual(componentOLVMenuItem.length === 1, true, 'Component OLVMenuItem has only adding item');
                assert.strictEqual(componentOLVMenuItem[0].textContent.trim(), 'Temp menu item', 'Component OLVMenuItem text is \'Temp menu item\'');

                componentOLVMenuItemIcon = componentOLVMenuItem[0].querySelector('.icon');


                assert.strictEqual(componentOLVMenuItemIcon.classList.contains('icon'), true, 'Component OLVMenuItemIcon has class icon');
                assert.strictEqual(componentOLVMenuItemIcon.classList.contains('remove'), true, 'Component OLVMenuItemIcon has class remove');

              case 15:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      return function (_x16) {
        return _ref22.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit menuInRowAdditionalItems with standart element test', function () {
      var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(assert) {
        var _this18 = this;

        var store, $addButton, componentOLVMenu, componentOLVMenuItem;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';
                  var tempMenuInRowAdditionalItems = [{
                    icon: 'remove icon',
                    title: 'Temp menu item',
                    actionName: 'tempAction'
                  }];

                  _this18.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this18.set('model', model);
                  _this18.set('componentName', testComponentName);
                  _this18.set('menuInRowAdditionalItems', tempMenuInRowAdditionalItems);
                });

                _context22.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "0gq0ZWUa",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\",\"menuInRowAdditionalItems\",\"showEditMenuItemInRow\",\"showDeleteMenuItemInRow\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]],[22,[\"menuInRowAdditionalItems\"]],true,true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:
                $addButton = this.element.querySelector('.ui.button');
                _context22.next = 7;
                return (0, _testHelpers.click)($addButton);

              case 7:
                componentOLVMenu = this.element.querySelector('.button.right');
                componentOLVMenuItem = componentOLVMenu.querySelectorAll('.item');


                assert.strictEqual(componentOLVMenuItem.length === 3, true, 'Component OLVMenuItem has standart and adding items');

              case 10:
              case 'end':
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      return function (_x17) {
        return _ref23.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit model projection test', function () {
      var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(assert) {
        var _this19 = this;

        var store, componentOLV, componentOLVThead;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
                  var testComponentName = 'my-test-component-to-count-rerender';

                  _this19.set('proj', _aggregator.default.projections.get('ConfigurateRowView'));
                  _this19.set('model', model);
                  _this19.set('componentName', testComponentName);
                });

                _context23.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "os+LRmZK",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"content\",\"componentName\",\"modelProjection\"],[[22,[\"model\",\"details\"]],[22,[\"componentName\"]],[22,[\"proj\",\"attributes\",\"details\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:
                componentOLV = Ember.$('.object-list-view');
                componentOLVThead = componentOLV.children('thead').children('tr').children('th');


                assert.strictEqual(componentOLVThead.length === 3, true, 'Component has \'ConfigurateRowView\' projection');

              case 7:
              case 'end':
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      return function (_x18) {
        return _ref24.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('ember-grupedit main model projection test', function () {
      var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(assert) {
        var _this20 = this;

        var store, valueMainModelProjection, $componentObjectListView, $componentObjectListViewTh, $componentOlvFirstHead;
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                store = this.owner.lookup('service:store');
                valueMainModelProjection = void 0;

                Ember.run(function () {
                  var model = store.createRecord('ember-flexberry-dummy-suggestion');
                  var testComponentName = 'my-test-component-to-count-rerender';
                  valueMainModelProjection = model.get('i18n').t('models.ember-flexberry-dummy-suggestion.projections.SuggestionMainModelProjectionTest.userVotes.voteType.__caption__');

                  _this20.set('proj', _emberFlexberryDummySuggestion.default.projections.get('SuggestionMainModelProjectionTest'));
                  _this20.set('model', model);
                  _this20.set('componentName', testComponentName);
                });

                _context24.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Fzime7cI",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n        \"],[1,[26,\"flexberry-groupedit\",null,[[\"componentName\",\"content\",\"modelProjection\",\"mainModelProjection\"],[[22,[\"componentName\"]],[22,[\"model\",\"userVotes\"]],[22,[\"proj\",\"attributes\",\"userVotes\"]],[22,[\"proj\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                $componentObjectListView = Ember.$('.object-list-view');
                $componentObjectListViewTh = $componentObjectListView.children('thead').children('tr').children('th');
                $componentOlvFirstHead = $componentObjectListViewTh[1];


                assert.strictEqual($componentOlvFirstHead.innerText === valueMainModelProjection.toString(), true, 'Header has text \'Vote type\'');

              case 9:
              case 'end':
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      return function (_x19) {
        return _ref25.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-lookup-test', ['qunit', '@ember/test-helpers', 'ember-qunit'], function (_qunit, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-lookup', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.owner.lookup('service:log').set('enabled', false);
    });

    (0, _qunit.test)('component renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $component, $lookupFluid, $lookupInput, $lookupButtonPreview, $lookupButtonChoose, $lookupButtonClear, $lookupButtonClearIcon;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(31);

                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "aeis502A",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"placeholder\"],[\"(тестовое значение)\"]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component, it's inner <input>.
                $component = this.$().children();
                $lookupFluid = $component.children('.fluid');
                $lookupInput = $lookupFluid.children('.lookup-field');
                $lookupButtonPreview = $lookupFluid.children('.ui-preview');
                $lookupButtonChoose = $lookupFluid.children('.ui-change');
                $lookupButtonClear = $lookupFluid.children('.ui-clear');
                $lookupButtonClearIcon = $lookupButtonClear.children('.remove');

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

              case 41:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component with readonly renders properly', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var $component, $lookupFluid, $lookupButtonChoose, $lookupButtonClear;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(2);

                _context2.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "NhaYr0BL",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"readonly\"],[true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component, it's inner <input>.
                $component = this.$().children();
                $lookupFluid = $component.children('.fluid');
                $lookupButtonChoose = $lookupFluid.children('.ui-change');
                $lookupButtonClear = $lookupFluid.children('.ui-clear');

                // Check <choose button>.

                assert.strictEqual($lookupButtonChoose.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');

                // Check <clear button>.
                assert.strictEqual($lookupButtonClear.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component with choose-text and remove-text properly', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var $component, $lookupFluid, $lookupButtonChoose, $lookupButtonClear;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(2);
                this.set('tempTextChoose', 'TempText1');
                this.set('tempTextRemove', 'TempText2');

                _context3.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "I6I6NEqZ",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"chooseText\",\"removeText\"],[[22,[\"tempTextChoose\"]],[22,[\"tempTextRemove\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                $component = this.$().children();
                $lookupFluid = $component.children('.fluid');
                $lookupButtonChoose = $lookupFluid.children('.ui-change');
                $lookupButtonClear = $lookupFluid.children('.ui-clear');

                // Check <choose button>.

                assert.equal($lookupButtonChoose.text().trim(), 'TempText1');

                // Check <clear button>.
                assert.equal($lookupButtonClear.text().trim(), 'TempText2');

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.skip)('component mode consistency', function (assert) {
      var _this = this;

      var checkErrMsg = function checkErrMsg(err, str) {
        var msg = Ember.isNone(err.message) ? '' : err.message;
        return msg.includes(str);
      };

      assert.expect(3);

      // Check if both 'autocomplete' and 'dropdown' flags enabled cause an error.
      assert.throws(function () {
        _this.render(Ember.HTMLBars.template({
          "id": "vD1UAARV",
          "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"autocomplete\",\"dropdown\"],[true,true]]],false]],\"hasEval\":false}",
          "meta": {}
        }));
      }, function (err) {
        return checkErrMsg(err, 'flags \'autocomplete\' and \'dropdown\' enabled');
      }, 'Both \'autocomplete\' and \'dropdown\' flags enabled cause an error.');

      // Check if both 'dropdown' flag enabled and the block form definition cause an error.
      assert.throws(function () {
        _this.render(Ember.HTMLBars.template({
          "id": "4F1JIEt3",
          "block": "{\"symbols\":[],\"statements\":[[4,\"flexberry-lookup\",null,[[\"dropdown\"],[true]],{\"statements\":[],\"parameters\":[]},null]],\"hasEval\":false}",
          "meta": {}
        }));
      }, function (err) {
        return checkErrMsg(err, 'flag \'dropdown\' enabled and the block form definition');
      }, 'Both \'dropdown\' flag enabled and the block form definition cause an error.');

      // Check if both 'autocomplete' flag enabled and the block form definition cause an error.
      assert.throws(function () {
        _this.render(Ember.HTMLBars.template({
          "id": "ITGiIAqK",
          "block": "{\"symbols\":[],\"statements\":[[4,\"flexberry-lookup\",null,[[\"autocomplete\"],[true]],{\"statements\":[],\"parameters\":[]},null]],\"hasEval\":false}",
          "meta": {}
        }));
      }, function (err) {
        return checkErrMsg(err, 'flag \'autocomplete\' enabled and the block form definition');
      }, 'Both \'autocomplete\' flag enabled and the block form definition cause an error.');
    });

    (0, _qunit.test)('autocomplete doesn\'t send data-requests in readonly mode', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
        var _this2 = this;

        var store, ajaxMethodHasBeenCalled, originalAjaxMethod, asyncOperationsCompleted, $component, $componentInput;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                assert.expect(1);

                store = this.owner.lookup('service:store');

                // Override store.query method.

                ajaxMethodHasBeenCalled = false;
                originalAjaxMethod = Ember.$.ajax;

                Ember.$.ajax = function () {
                  ajaxMethodHasBeenCalled = true;

                  return originalAjaxMethod.apply(this, arguments);
                };

                asyncOperationsCompleted = assert.async();


                this.set('actions.showLookupDialog', function () {});
                this.set('actions.removeLookupValue', function () {});

                _context5.next = 10;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "t6Fqi2rh",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relatedModel\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"choose\",\"remove\",\"readonly\",\"autocomplete\"],[[22,[\"model\",\"parent\"]],[22,[\"model\"]],\"parent\",\"SuggestionTypeL\",\"name\",\"Parent\",[26,\"action\",[[21,0,[]],\"showLookupDialog\"],null],[26,\"action\",[[21,0,[]],\"removeLookupValue\"],null],true,true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 10:

                // Retrieve component.
                $component = this.$();
                $componentInput = Ember.$('input', $component);


                Ember.run(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                  var testPromise;
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _this2.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
                            name: 'TestTypeName'
                          }));

                          testPromise = new Ember.RSVP.Promise(function (resolve) {
                            ajaxMethodHasBeenCalled = false;

                            // Imitate focus on component, which can cause async data-requests.
                            (0, _testHelpers.focus)($componentInput);

                            // Wait for some time which can pass after focus, before possible async data-request will be sent.
                            Ember.run.later(function () {
                              resolve();
                            }, 300);
                          });
                          _context4.next = 4;
                          return testPromise;

                        case 4:

                          // Check that store.query hasn't been called after focus.
                          assert.strictEqual(ajaxMethodHasBeenCalled, false, '$.ajax hasn\'t been called after click on autocomplete lookup in readonly mode');

                          // Restore original method.
                          Ember.$.ajax = originalAjaxMethod;

                          asyncOperationsCompleted();

                        case 7:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, _this2);
                })));

              case 13:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('preview button renders properly', function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
        var _this3 = this;

        var store, $component, $lookupFluid;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                assert.expect(11);

                store = this.owner.lookup('service:store');
                _context6.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "yfTeYiZT",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"showPreviewButton\",\"previewFormRoute\"],[[22,[\"model\"]],\"parent\",\"SuggestionTypeL\",\"name\",\"Parent\",true,\"ember-flexberry-dummy-suggestion-type-edit\"]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                // Retrieve component.
                $component = this.$().children();
                $lookupFluid = $component.children('.fluid');


                assert.strictEqual($lookupFluid.children('.ui-preview').length === 0, true, 'Component has inner title block');

                Ember.run(function () {
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

              case 8:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x5) {
        return _ref7.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('preview button view previewButtonClass and previewText properly', function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(assert) {
        var _this4 = this;

        var store;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                assert.expect(3);

                store = this.owner.lookup('service:store');


                Ember.run(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                  var $component, $lookupFluid, $lookupButtonPreview;
                  return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          _this4.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
                            name: 'TestTypeName'
                          }));

                          _this4.set('previewButtonClass', 'previewButtonClassTest');
                          _this4.set('previewText', 'previewTextTest');

                          _context7.next = 5;
                          return (0, _testHelpers.render)(Ember.HTMLBars.template({
                            "id": "qXjDh8Be",
                            "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"showPreviewButton\",\"previewFormRoute\",\"previewButtonClass\",\"previewText\"],[[22,[\"model\"]],\"parent\",\"SuggestionTypeL\",\"name\",\"Parent\",true,\"ember-flexberry-dummy-suggestion-type-edit\",[22,[\"previewButtonClass\"]],[22,[\"previewText\"]]]]],false]],\"hasEval\":false}",
                            "meta": {}
                          }));

                        case 5:

                          // Retrieve component.
                          $component = _this4.$().children();
                          $lookupFluid = $component.children('.fluid');
                          $lookupButtonPreview = $lookupFluid.children('.ui-preview');


                          assert.strictEqual($lookupButtonPreview.length === 1, true, 'Component has inner title block');
                          assert.strictEqual($lookupButtonPreview.hasClass('previewButtonClassTest'), true, 'Component\'s container has \'previewButtonClassTest\' css-class');
                          assert.equal($lookupButtonPreview.text().trim(), 'previewTextTest');

                        case 11:
                        case 'end':
                          return _context7.stop();
                      }
                    }
                  }, _callee7, _this4);
                })));

              case 3:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function (_x6) {
        return _ref8.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('preview with readonly renders properly', function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(assert) {
        var _this5 = this;

        var store;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                assert.expect(1);

                store = this.owner.lookup('service:store');


                Ember.run(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                  var $component, $lookupFluid, $lookupButtonPreview;
                  return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                      switch (_context9.prev = _context9.next) {
                        case 0:
                          _this5.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
                            name: 'TestTypeName'
                          }));

                          _context9.next = 3;
                          return (0, _testHelpers.render)(Ember.HTMLBars.template({
                            "id": "ASa0a1tB",
                            "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"showPreviewButton\",\"previewFormRoute\",\"readonly\"],[[22,[\"model\"]],\"parent\",\"SuggestionTypeL\",\"name\",\"Parent\",true,\"ember-flexberry-dummy-suggestion-type-edit\",true]]],false]],\"hasEval\":false}",
                            "meta": {}
                          }));

                        case 3:

                          // Retrieve component.
                          $component = _this5.$().children();
                          $lookupFluid = $component.children('.fluid');
                          $lookupButtonPreview = $lookupFluid.children('.ui-preview');


                          assert.strictEqual($lookupButtonPreview.hasClass('disabled'), false, 'Component\'s container has not \'disabled\' css-class');

                        case 7:
                        case 'end':
                          return _context9.stop();
                      }
                    }
                  }, _callee9, _this5);
                })));

              case 3:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function (_x7) {
        return _ref10.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('autocompleteDirection adds no css-class if autocompleteDirection is not defined', function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(assert) {
        var _this6 = this;

        var store, $resultAutocomplete, $lookupField, done;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  Ember.set(_this6, 'model', store.createRecord('ember-flexberry-dummy-suggestion', {
                    name: 'TestTypeName'
                  }));
                });

                _context11.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "uHHrrnWy",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"autocomplete\",\"relatedModel\",\"relationName\"],[[22,[\"model\",\"type\"]],\"parent\",\"SettingLookupExampleView\",\"name\",\"Parent\",true,[22,[\"model\"]],\"type\"]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:
                $resultAutocomplete = this.element.querySelector('div.results');

                assert.ok($resultAutocomplete, 'Component has autocomplete window.');
                assert.notOk($resultAutocomplete.classList.contains('visible'), 'Autocomplete window is not visible until we start typing.');

                $lookupField = this.element.querySelector('input.lookup-field');
                _context11.next = 10;
                return (0, _testHelpers.fillIn)($lookupField, 'g');

              case 10:
                done = assert.async();

                Ember.run.later(function () {
                  assert.ok($resultAutocomplete.classList.contains('visible'), 'Autocomplete window is now visible.');
                  assert.notOk($resultAutocomplete.classList.contains('upward'), 'Autocomplete window has no extra class.');
                  done();
                }, 5000);

              case 12:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function (_x8) {
        return _ref12.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('autocompleteDirection adds css-class if autocompleteDirection is defined as upward', function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(assert) {
        var _this7 = this;

        var store, $resultAutocomplete, $lookupField, asyncOperationsCompleted;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                store = this.owner.lookup('service:store');
                _context13.next = 3;
                return Ember.run(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                  return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          Ember.set(_this7, 'model', store.createRecord('ember-flexberry-dummy-suggestion', {
                            name: 'TestTypeName'
                          }));

                          Ember.set(_this7, 'autocompleteDirection', undefined);
                          _context12.next = 4;
                          return (0, _testHelpers.render)(Ember.HTMLBars.template({
                            "id": "ls1XENGr",
                            "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"autocomplete\",\"autocompleteDirection\",\"relatedModel\",\"relationName\"],[[22,[\"model\",\"type\"]],\"parent\",\"SettingLookupExampleView\",\"name\",\"Parent\",true,\"upward\",[22,[\"model\"]],\"type\"]]],false]],\"hasEval\":false}",
                            "meta": {}
                          }));

                        case 4:
                        case 'end':
                          return _context12.stop();
                      }
                    }
                  }, _callee12, _this7);
                })));

              case 3:
                $resultAutocomplete = this.element.querySelector('div.results');

                assert.equal($resultAutocomplete !== null, true, 'Component has autocomplete window.');
                assert.equal($resultAutocomplete.classList.contains('visible'), false, 'Autocomplete window is not visible until we start typing.');

                $lookupField = this.element.querySelector('input.lookup-field');
                _context13.next = 9;
                return (0, _testHelpers.fillIn)($lookupField, 'g');

              case 9:
                asyncOperationsCompleted = assert.async();

                Ember.run.later(function () {
                  asyncOperationsCompleted();
                  assert.equal($resultAutocomplete.classList.contains('visible'), true, 'Autocomplete window is now visible.');
                  assert.equal($resultAutocomplete.classList.contains('upward'), true, 'Autocomplete window has extra class.');
                }, 5000);

              case 11:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      return function (_x9) {
        return _ref13.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('autocompleteDirection adds no css-class if autocompleteDirection is defined as downward', function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(assert) {
        var _this8 = this;

        var store, $resultAutocomplete, $lookupField, asyncOperationsCompleted;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  Ember.set(_this8, 'model', store.createRecord('ember-flexberry-dummy-suggestion', {
                    name: 'TestTypeName'
                  }));
                });

                _context14.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "GkKVSGQ7",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-lookup\",null,[[\"value\",\"relationName\",\"projection\",\"displayAttributeName\",\"title\",\"autocomplete\",\"autocompleteDirection\",\"relatedModel\",\"relationName\"],[[22,[\"model\",\"type\"]],\"parent\",\"SettingLookupExampleView\",\"name\",\"Parent\",true,\"downward\",[22,[\"model\"]],\"type\"]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:
                $resultAutocomplete = this.element.querySelector('div.results');

                assert.equal($resultAutocomplete !== null, true, 'Component has autocomplete window.');
                assert.equal($resultAutocomplete.classList.contains('visible'), false, 'Autocomplete window is not visible until we start typing.');

                $lookupField = this.element.querySelector('input.lookup-field');

                (0, _testHelpers.fillIn)($lookupField, 'g');

                asyncOperationsCompleted = assert.async();

                Ember.run.later(function () {
                  asyncOperationsCompleted();
                  assert.equal($resultAutocomplete.classList.contains('visible'), true, 'Autocomplete window is now visible.');
                  assert.equal($resultAutocomplete.classList.contains('upward'), false, 'Autocomplete window has no extra class.');
                }, 5000);

              case 11:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      return function (_x10) {
        return _ref15.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-sidebar-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-sidebar', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "GqM6eeCw",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-sidebar\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:
                assert.equal(this.element.textContent.trim(), '', 'Component renders with no content');
                _context.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "36BhARa1",
                  "block": "{\"symbols\":[],\"statements\":[[0,\" \"],[4,\"flexberry-sidebar\",null,null,{\"statements\":[[0,\" text \"]],\"parameters\":[]},null]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                assert.equal(this.element.textContent.trim(), 'text', 'Component renders with content');

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-simpledatetime-test', ['qunit', 'ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', '@ember/test-helpers', 'ember-qunit'], function (_qunit, _i18n, _translations, _translations2, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-simpledatetime', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.owner.register('locale:ru/translations', _translations.default);
      this.owner.register('locale:en/translations', _translations2.default);
      this.owner.register('service:i18n', _i18n.default);

      // Injecting i18n service into the test context
      this.i18n = this.owner.lookup('service:i18n');

      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      // Set 'ru' as the initial locale
      this.i18n.set('locale', 'ru');
    });

    (0, _qunit.test)('it renders', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "W16NdrYS",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-simpledatetime\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:
                assert.ok(true);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('render with type before value', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var typeName, componentInput, calendar;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(1);
                typeName = 'date';

                this.set('type', typeName);

                // Render component.
                _context2.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "/FqBGfvC",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-simpledatetime\",null,[[\"type\",\"value\"],[[22,[\"type\"]],[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                componentInput = this.element.querySelector('.custom-flatpickr');

                // Click on component to open calendar.

                _context2.next = 8;
                return (0, _testHelpers.click)(componentInput);

              case 8:
                calendar = document.querySelector('.flatpickr-calendar');

                // Check calendar.

                assert.strictEqual(calendar.classList.contains('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('render with type afther value', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var typeName, $component, $componentInput, $calendar;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(1);
                typeName = 'date';

                this.set('type', typeName);

                // Render component.
                _context3.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "/qKq9/d4",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-simpledatetime\",null,[[\"value\",\"type\"],[[22,[\"value\"]],[22,[\"type\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element);
                $componentInput = Ember.$('.flatpickr-input.custom-flatpickr', $component);

                // Click on component to open calendar.

                $componentInput.click();

                $calendar = Ember.$('.flatpickr-calendar');

                // Check calendar.

                assert.strictEqual($calendar.hasClass('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('properly init value by input', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
        var _this = this;

        var typeName, $component, $componentInput;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                assert.expect(1);
                typeName = 'date';

                Ember.set(this, 'type', typeName);
                Ember.set(this, 'dateValue', undefined);

                // Render component.
                _context4.next = 6;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "+0TUL6Ps",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-simpledatetime\",null,[[\"type\",\"value\"],[[22,[\"type\"]],[22,[\"dateValue\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 6:

                // Retrieve component.
                $component = Ember.$(this.element);
                $componentInput = Ember.$('.custom-flatpickr', $component);


                Ember.run(function () {
                  $componentInput.val('01.01.2022');
                  $componentInput.change();
                  assert.equal(Ember.get(_this, 'dateValue').toISOString().split('T')[0], '2022-01-01');
                });

              case 9:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-sitemap-searchbar-test', ['qunit', 'ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', '@ember/test-helpers', 'ember-qunit'], function (_qunit, _i18n, _translations, _translations2, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var app = void 0;

  (0, _qunit.module)('Integration | Component | flexberry-sitemap-searchbar', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.owner.register('locale:ru/translations', _translations.default);
      this.owner.register('locale:en/translations', _translations2.default);
      this.owner.register('service:i18n', _i18n.default);

      this.i18n = this.owner.lookup('service:i18n');

      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });
      // Set 'ru' as initial locale.
      this.i18n.set('locale', 'ru');

      /**
        @description Application sitemap.
        @property sitemap
        @type Object
      */

      this._sitemap = function () {
        var i18n = this.get('i18n');

        return {
          nodes: [{
            link: 'index',
            caption: i18n.t('forms.application.sitemap.index.caption'),
            title: i18n.t(_translations.default, 'forms.application.sitemap.index.title'),
            children: null
          }, {
            link: null,
            caption: i18n.t('forms.application.sitemap.application.caption'),
            title: i18n.t('forms.application.sitemap.application.title'),
            children: [{
              link: 'ember-flexberry-dummy-application-user-list',
              caption: i18n.t('forms.application.sitemap.application.application-users.caption'),
              title: i18n.t('forms.application.sitemap.application.application-users.title'),
              children: null
            }, {
              link: 'ember-flexberry-dummy-localization-list',
              caption: i18n.t('forms.application.sitemap.application.localizations.caption'),
              title: i18n.t('forms.application.sitemap.application.localizations.title'),
              children: null
            }, {
              link: 'ember-flexberry-dummy-suggestion-list',
              caption: i18n.t('forms.application.sitemap.application.suggestions.caption'),
              title: i18n.t('forms.application.sitemap.application.suggestions.title'),
              children: null
            }, {
              link: 'ember-flexberry-dummy-suggestion-type-list',
              caption: i18n.t('forms.application.sitemap.application.suggestion-types.caption'),
              title: i18n.t('forms.application.sitemap.application.suggestion-types.title'),
              children: null
            }, {
              link: 'ember-flexberry-dummy-multi-list',
              caption: i18n.t('forms.application.sitemap.application.multi.caption'),
              title: i18n.t('forms.application.sitemap.application.multi.title'),
              children: null
            }, {
              link: 'ember-flexberry-dummy-suggestion-file-list',
              caption: i18n.t('forms.application.sitemap.application.suggestion-file.caption'),
              title: i18n.t('forms.application.sitemap.application.suggestion-file.title'),
              children: null
            }]
          }, {
            link: null,
            caption: i18n.t('forms.application.sitemap.log-service-examples.caption'),
            title: i18n.t('forms.application.sitemap.log-service-examples.title'),
            children: [{
              link: 'i-i-s-caseberry-logging-objects-application-log-l',
              caption: i18n.t('forms.application.sitemap.log-service-examples.application-log.caption'),
              title: i18n.t('forms.application.sitemap.log-service-examples.application-log.title'),
              children: null
            }, {
              link: 'log-service-examples/settings-example',
              caption: i18n.t('forms.application.sitemap.log-service-examples.settings-example.caption'),
              title: i18n.t('forms.application.sitemap.log-service-examples.settings-example.title'),
              children: null
            }, {
              link: 'log-service-examples/clear-log-form',
              caption: i18n.t('forms.application.sitemap.log-service-examples.clear-log-form.caption'),
              title: i18n.t('forms.application.sitemap.log-service-examples.clear-log-form.title'),
              children: null
            }]
          }, {
            link: null,
            caption: i18n.t('forms.application.sitemap.lock.caption'),
            title: i18n.t('forms.application.sitemap.lock.caption'),
            children: [{
              link: 'new-platform-flexberry-services-lock-list',
              caption: i18n.t('forms.application.sitemap.lock.title'),
              title: i18n.t('forms.application.sitemap.lock.title'),
              children: null
            }]
          }, {
            link: null,
            caption: i18n.t('forms.application.sitemap.components-examples.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.title'),
            children: [{
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-button.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-button.title'),
              children: [{
                link: 'components-examples/flexberry-button/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-button.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-button.settings-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.title'),
              children: [{
                link: 'components-examples/flexberry-checkbox/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.settings-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-checkbox/three-state-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.three-state-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.three-state-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-ddau-checkbox.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-ddau-checkbox.title'),
              children: [{
                link: 'components-examples/flexberry-ddau-checkbox/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-ddau-checkbox.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-ddau-checkbox.settings-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.title'),
              children: [{
                link: 'components-examples/flexberry-dropdown/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.settings-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-dropdown/conditional-render-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.conditional-render-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.conditional-render-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-dropdown/empty-value-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.empty-value-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.empty-value-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-dropdown/items-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.items-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.items-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-field.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-field.title'),
              children: [{
                link: 'components-examples/flexberry-field/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-field.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-field.settings-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-file.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-file.title'),
              children: [{
                link: 'components-examples/flexberry-file/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-file.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-file.settings-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-file/flexberry-file-in-modal',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-file.flexberry-file-in-modal.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-file.flexberry-file-in-modal.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.title'),
              children: [{
                link: 'components-examples/flexberry-groupedit/model-update-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.model-update-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.model-update-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-groupedit/custom-buttons-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.custom-buttons-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.custom-buttons-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-groupedit/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.settings-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-groupedit/configurate-row-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.configurate-row-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.configurate-row-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-groupedit-with-lookup-with-computed-atribute',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.groupedit-with-lookup-with-computed-atribute.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.groupedit-with-lookup-with-computed-atribute.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-readonly-columns-by-configurate-row-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.readonly-columns-by-configurate-row-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.readonly-columns-by-configurate-row-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-groupedit/field-readonly-status-depend-on-another-field-value',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.field-readonly-status-depend-on-another-field-value.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.field-readonly-status-depend-on-another-field-value.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.title'),
              children: [{
                link: 'components-examples/flexberry-lookup/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.settings-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/customizing-window-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.customizing-window-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.customizing-window-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/hierarchy-olv-in-lookup-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.hierarchy-olv-in-lookup-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.hierarchy-olv-in-lookup-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/limit-function-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.limit-function-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.limit-function-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/limit-function-through-dynamic-properties-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.limit-function-through-dynamic-properties-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.limit-function-through-dynamic-properties-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/lookup-block-form-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.lookup-block-form-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.lookup-block-form-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/lookup-in-modal',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.lookup-in-modal.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.lookup-in-modal.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/dropdown-mode-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.dropdown-mode-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.dropdown-mode-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/default-ordering-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.default-ordering-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.default-ordering-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/autocomplete-order-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.autocomplete-order-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.autocomplete-order-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-list',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.compute-autocomplete.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.compute-autocomplete.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/numeric-autocomplete',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.numeric-autocomplete.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.numeric-autocomplete.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/autofill-by-limit-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.autofill-by-limit-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.autofill-by-limit-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-lookup/user-settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.user-settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.user-settings-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-menu.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-menu.title'),
              children: [{
                link: 'components-examples/flexberry-menu/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-menu.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-menu.settings-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.title'),
              children: [{
                link: 'components-examples/flexberry-objectlistview/limit-function-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limit-function-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limit-function-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/inheritance-models',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.inheritance-models.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.inheritance-models.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.settings-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/toolbar-custom-buttons-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/on-edit-form',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.on-edit-form.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.on-edit-form.title')
              }, {
                link: 'components-examples/flexberry-objectlistview/list-on-editform',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.list-on-editform.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.list-on-editform.title')
              }, {
                link: 'components-examples/flexberry-objectlistview/custom-filter',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.custom-filter.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.custom-filter.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/edit-form-with-detail-list',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.edit-form-with-detail-list.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.edit-form-with-detail-list.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/hierarchy-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.hierarchy-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.hierarchy-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/hierarchy-paging-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.hierarchy-paging-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.hierarchy-paging-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/configurate-rows',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.configurate-rows.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.configurate-rows.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/downloading-files-from-olv-list',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.downloading-files-from-olv-list.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.downloading-files-from-olv-list.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/selected-rows',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.selected-rows.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.selected-rows.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/object-list-view-resize',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.object-list-view-resize.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.object-list-view-resize.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.return-from-ediform.title'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.return-from-ediform.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/lock-services-editor-view-list',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.lock-services-editor-view-list.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.lock-services-editor-view-list.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-objectlistview/limited-text-size-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limited-text-size-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limited-text-size-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: 'flexberry-simpleolv',
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.title'),
              children: [{
                link: 'components-examples/flexberry-simpleolv/limit-function-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limit-function-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limit-function-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-simpleolv/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.settings-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-simpleolv/toolbar-custom-buttons-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-simpleolv/on-edit-form',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.on-edit-form.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.on-edit-form.title')
              }, {
                link: 'components-examples/flexberry-simpleolv/custom-filter',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.custom-filter.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.custom-filter.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-simpleolv/configurate-rows',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.configurate-rows.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.configurate-rows.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-simpleolv/selected-rows',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.selected-rows.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.selected-rows.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-simpledatetime.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-simpledatetime.title'),
              children: [{
                link: 'components-examples/flexberry-simpledatetime/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-simpledatetime.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-simpledatetime.settings-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-text-cell.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-text-cell.title'),
              children: [{
                link: 'components-examples/flexberry-text-cell/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-text-cell.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-text-cell.settings-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-textarea.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-textarea.title'),
              children: [{
                link: 'components-examples/flexberry-textarea/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-textarea.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-textarea.settings-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-textbox.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-textbox.title'),
              children: [{
                link: 'components-examples/flexberry-textbox/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-textbox.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-textbox.settings-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.title'),
              children: [{
                link: 'components-examples/flexberry-toggler/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.settings-example.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-toggler/settings-example-inner',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.settings-example-inner.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.settings-example-inner.title'),
                children: null
              }, {
                link: 'components-examples/flexberry-toggler/ge-into-toggler-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.ge-into-toggler-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.ge-into-toggler-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-tree.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-tree.title'),
              children: [{
                link: 'components-examples/flexberry-tree/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.flexberry-tree.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.flexberry-tree.settings-example.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.components-examples.ui-message.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.ui-message.title'),
              children: [{
                link: 'components-examples/ui-message/settings-example',
                caption: i18n.t('forms.application.sitemap.components-examples.ui-message.settings-example.caption'),
                title: i18n.t('forms.application.sitemap.components-examples.ui-message.settings-example.title'),
                children: null
              }]
            }]
          }, {
            link: null,
            caption: i18n.t('forms.application.sitemap.integration-examples.caption'),
            title: i18n.t('forms.application.sitemap.integration-examples.title'),
            children: [{
              link: null,
              caption: i18n.t('forms.application.sitemap.integration-examples.edit-form.caption'),
              title: i18n.t('forms.application.sitemap.integration-examples.edit-form.title'),
              children: [{
                link: 'integration-examples/edit-form/readonly-mode',
                caption: i18n.t('forms.application.sitemap.integration-examples.edit-form.readonly-mode.caption'),
                title: i18n.t('forms.application.sitemap.integration-examples.edit-form.readonly-mode.title'),
                children: null
              }, {
                link: 'integration-examples/edit-form/validation',
                caption: i18n.t('forms.application.sitemap.integration-examples.edit-form.validation.caption'),
                title: i18n.t('forms.application.sitemap.integration-examples.edit-form.validation.title'),
                children: null
              }]
            }, {
              link: null,
              caption: i18n.t('forms.application.sitemap.integration-examples.odata-examples.caption'),
              title: i18n.t('forms.application.sitemap.integration-examples.odata-examples.title'),
              children: [{
                link: null,
                caption: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.caption'),
                title: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.title'),
                children: [{
                  link: 'integration-examples/odata-examples/get-masters/ember-flexberry-dummy-sotrudnik-l',
                  caption: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.sotrudnik.caption'),
                  title: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.sotrudnik.title'),
                  children: null
                }, {
                  link: 'integration-examples/odata-examples/get-masters/ember-flexberry-dummy-departament-l',
                  caption: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.departament.caption'),
                  title: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.departament.title'),
                  children: null
                }, {
                  link: 'integration-examples/odata-examples/get-masters/ember-flexberry-dummy-vid-departamenta-l',
                  caption: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.vid-departamenta.caption'),
                  title: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.vid-departamenta.title'),
                  children: null
                }]
              }]
            }]
          }, {
            link: null,
            caption: i18n.t('forms.application.sitemap.user-setting-forms.caption'),
            title: i18n.t('forms.application.sitemap.user-setting-forms.title'),
            children: [{
              link: 'user-setting-forms/user-setting-delete',
              caption: i18n.t('forms.application.sitemap.user-setting-forms.user-setting-delete.caption'),
              title: i18n.t('forms.application.sitemap.user-setting-forms.user-setting-delete.title'),
              children: null
            }]
          }]
        };
      },
      /**
        Array of search objects.
         @property sitemap
        @type Array
      */
      this.set('sitemap', []);
    });

    (0, _qunit.test)('it renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $component, results, value, $input, notFoundMsg;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.set('sitemap', this._sitemap().nodes);
                assert.expect(8);

                _context.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "GB+qPpQF",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-sitemap-searchbar\",null,[[\"sitemap\"],[[22,[\"sitemap\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                assert.equal(this.element.textContent.trim(), '');

                // Retrieve component.
                $component = this.element.querySelector('.sitemap-searchbar.ui.search');

                $component.firstElementChild.click();
                results = $component.querySelector('.sitemap-search-results-list');


                assert.notEqual(results.children.length, 0);

                value = this.get('i18n').t('forms.application.sitemap.lock.caption');
                $input = $component.querySelector('.ember-text-field');
                _context.next = 13;
                return (0, _testHelpers.fillIn)($input, value);

              case 13:
                _context.next = 15;
                return (0, _testHelpers.settled)();

              case 15:
                assert.equal($input.value, value);
                assert.equal(results.children.length, 1);
                assert.equal(results.querySelector('.flexberry-toggler-caption').innerHTML, value);

                value = 'sfnesjgbsnsrf';
                _context.next = 21;
                return (0, _testHelpers.fillIn)($input, value);

              case 21:
                _context.next = 23;
                return (0, _testHelpers.settled)();

              case 23:
                assert.equal($input.value, value);
                assert.equal(results.children.length, 1);
                notFoundMsg = this.get('i18n').t('components.flexberry-sitemap-searchbar.notFoundMsg');

                assert.equal(results.querySelector('.header').innerText, notFoundMsg);

              case 27:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-sitemap-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-sitemap', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders and works', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "P0xSfbWL",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-sitemap\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:
                assert.equal(Ember.$(this.element).text().trim(), '', 'Empty sitemap, empty result.');

                _context.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Mlx1ZH4t",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-sitemap\",null,null,{\"statements\":[[0,\"    template block text \\n\"]],\"parameters\":[]},null],[0,\" \"]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                assert.equal(Ember.$(this.element).text().trim(), '', 'Block params not used.');
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

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-tab-bar-test', ['qunit', '@ember/test-helpers', 'ember-qunit'], function (_qunit, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-tab-bar', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $component, $menu, $dropdown;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(5);

                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "7FcjR76m",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-tab-bar\",null,[[\"isOverflowedTabs\"],[true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $menu = $component.children('div.menu');
                $dropdown = $component.children('div.dropdown');

                // Check wrapper <div>.

                assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
                assert.strictEqual($component.hasClass('flexberry-tab-bar'), true, 'Component\'s wrapper has \' flexberry-tab-bar\' css-class');
                assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
                assert.strictEqual($menu.hasClass('menu'), true, 'Component\'s wrapper has \'menu\' css-class');
                assert.strictEqual($dropdown.hasClass('dropdown link item'), true, 'Component\'s wrapper has \'dropdown icon\' css-class');

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it renders items', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var items, $component, $menu, $dropdownMenu, $menuItems, $dropdownItems;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(10);

                items = [{ selector: 'tab1', caption: 'Tab №1', active: true }, { selector: 'tab2', caption: 'Tab №2' }, { selector: 'tab3', caption: 'Tab №3' }, { selector: 'tab4', caption: 'Tab №4' }, { selector: 'tab5', caption: 'Tab №5' }];

                this.set('items', items);

                _context2.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "0MHg8qRj",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-tab-bar\",null,[[\"items\",\"isOverflowedTabs\"],[[22,[\"items\"]],true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $menu = $component.children('div.menu');
                $dropdownMenu = $component.children('div.dropdown').children('div.menu');
                $menuItems = $menu.children('button.item');
                $dropdownItems = $dropdownMenu.children('button.item');

                // Check component's captions and array.

                $menuItems.each(function (i) {
                  var $item = Ember.$(this);

                  // Check that the captions matches the array.
                  assert.strictEqual($item.attr('data-tab'), 'tab' + (i + 1), 'Component\'s item\'s сaptions matches the array');
                });

                $dropdownItems.each(function (i) {
                  var $item = Ember.$(this);

                  // Check that the captions matches the array.
                  assert.strictEqual($item.attr('data-tab'), 'tab' + (i + 1), 'Component\'s item\'s сaptions matches the array');
                });

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('tabs are switched in menu and in dropdown list', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var items, $component, $menu, $dropdown, $itemMenu, $itemDropdown;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(4);

                items = [{ selector: 'tab1', caption: 'Tab №1', active: true }, { selector: 'tab2', caption: 'Tab №2' }, { selector: 'tab3', caption: 'Tab №3' }, { selector: 'tab4', caption: 'Tab №4' }, { selector: 'tab5', caption: 'Tab №5' }, { selector: 'tab6', caption: 'Tab №6' }, { selector: 'tab7', caption: 'Tab №7' }, { selector: 'tab8', caption: 'Tab №8' }, { selector: 'tab9', caption: 'Tab №9' }, { selector: 'tab10', caption: 'Tab №10' }, { selector: 'tab11', caption: 'Tab №11' }, { selector: 'tab12', caption: 'Tab №12' }, { selector: 'tab13', caption: 'Tab №13' }, { selector: 'tab14', caption: 'Tab №14' }, { selector: 'tab15', caption: 'Tab №15' }];

                this.set('items', items);

                _context3.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "qgP2Cmmi",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-tab-bar\",null,[[\"items\",\"isOverflowedTabs\"],[[22,[\"items\"]],true]]],false],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab active segment\"],[10,\"data-tab\",\"tab1\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №1\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab2\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №2\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab3\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №3\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab4\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №4\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab5\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №5\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab6\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №6\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab7\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №7\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab8\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №8\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab9\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №9\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab10\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №10\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab11\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №11\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab12\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №12\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab13\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №13\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab14\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №14\"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",\"ui bottom attached tab segment\"],[10,\"data-tab\",\"tab15\"],[8],[0,\"\\n        \"],[6,\"h4\"],[8],[0,\"Tab №15\"],[9],[0,\"\\n      \"],[9],[0,\"\\n    \"]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $menu = $component.children('div.menu');
                $dropdown = $component.children('div.dropdown');

                // To select some item, menu must contain such item (with the specified caption).

                $itemMenu = Ember.$('.item:contains(' + this.get('items')[1].caption + ')', $menu);
                $itemDropdown = Ember.$('.item:contains(' + this.get('items')[1].caption + ')', $dropdown);

                // Click on item to select it.

                Ember.run(function () {
                  $itemMenu.click();
                  assert.strictEqual($itemMenu.hasClass('active'), true, 'Component\'s tab has \'active\' css-class');
                  assert.strictEqual($itemDropdown.hasClass('active'), true, 'Component\'s tab has \'active\' css-class');
                });

                // To select some item, menu must contain such item (with the specified caption).
                $itemMenu = Ember.$('.item:contains(' + this.get('items')[2].caption + ')', $menu);
                $itemDropdown = Ember.$('.item:contains(' + this.get('items')[2].caption + ')', $dropdown);

                // Click on item to select it.
                Ember.run(function () {
                  $dropdown.click();
                  $itemDropdown.click();
                  assert.strictEqual($itemMenu.hasClass('active'), true, 'Component\'s tab has \'active\' css-class');
                  assert.strictEqual($itemDropdown.hasClass('active selected'), true, 'Component\'s tab has \'active\' css-class');
                });

              case 14:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-textarea-test', ['ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'qunit', '@ember/test-helpers', 'ember-qunit'], function (_i18n, _translations, _translations2, _qunit, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-textarea', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.owner.register('locale:ru/translations', _translations.default);
      this.owner.register('locale:en/translations', _translations2.default);
      this.owner.register('service:i18n', _i18n.default);

      this.i18n = this.owner.lookup('service:i18n');
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    });

    (0, _qunit.test)('it renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $component, additioanlCssClasses;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(10);

                // Render component.
                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Wgbr2/S5",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\"],[[22,[\"class\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Check wrapper <div>.

                assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
                assert.strictEqual($component.hasClass('flexberry-textarea'), true, 'Component\'s wrapper has \' flexberry-textarea\' css-class');
                assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
                assert.strictEqual($component.hasClass('input'), true, 'Component\'s wrapper has \'input\' css-class');

                // Check wrapper's additional CSS-classes.
                additioanlCssClasses = 'fluid mini huge';

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

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('readonly mode works properly', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var $component, $textareaInput;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context2.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "K2qcPsaA",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"readonly\"],[[22,[\"class\"]],[22,[\"readonly\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Check that <textarea>'s readonly attribute doesn't exist yet.

                assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), '', 'Component\'s inner <textarea> hasn\'t readonly attribute');

                // Activate readonly mode & check that <textarea>'s readonly attribute exists now & has value equals to 'readonly'.
                this.set('readonly', true);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), 'readonly', 'Component\'s inner <textarea> has readonly attribute with value equals to \'readonly\'');

                // Check that <textarea>'s readonly attribute doesn't exist now.
                this.set('readonly', false);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), '', 'Component\'s inner <textarea> hasn\'t readonly attribute');

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('readonly mode works properly with value', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var _this = this;

        var $component, $textareaInput, newValue;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(2);

                // Set <textarea>'s value' & render component.
                this.set('value', null);
                this.set('readonly', true);
                _context3.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "qq/ZSFhm",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"readonly\",\"value\"],[[22,[\"readonly\"]],[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');


                $textareaInput.on('change', function (e) {
                  if (_this.get('readonly')) {
                    e.stopPropagation();
                    $textareaInput.val(null);
                  }
                });

                newValue = 'New value';

                $textareaInput.val(newValue);
                $textareaInput.change();

                // Check <textarea>'s value not changed.
                assert.strictEqual(Ember.$.trim($textareaInput.val()), '', 'Component\'s inner <textarea>\'s value not changed');
                assert.strictEqual(this.get('value'), null, 'Component\'s property binded to unchanged \'value\'');

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it renders i18n-ed placeholder', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
        var $component, $textareaInput;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context4.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "tz1yXvrh",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-textarea\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Check <textarea>'s placeholder.

                assert.strictEqual(Ember.$.trim($textareaInput.attr('placeholder')), Ember.get(_translations.default, 'components.flexberry-textarea.placeholder'), 'Component\'s inner <textarea>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

                // Change current locale to 'en' & check <textarea>'s placeholder again.
                this.set('i18n.locale', 'en');
                assert.strictEqual(Ember.$.trim($textareaInput.attr('placeholder')), Ember.get(_translations2.default, 'components.flexberry-textarea.placeholder'), 'Component\'s inner <textarea>\'s placeholder is equals to it\'s value from i18n locales/en/translations');

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it renders manually defined placeholder', function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
        var placeholder, $component, $textareaInput;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                assert.expect(2);

                // Set <textarea>'s placeholder' & render component.
                placeholder = 'textarea is empty, please type some text';

                this.set('placeholder', placeholder);
                _context5.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "RweRkPSr",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"placeholder\"],[[22,[\"placeholder\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Check <textarea>'s placeholder.

                assert.strictEqual(Ember.$.trim($textareaInput.attr('placeholder')), placeholder, 'Component\'s inner <textarea>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

                // Change placeholder's value & check <textarea>'s placeholder again.
                placeholder = 'textarea has no value';
                this.set('placeholder', placeholder);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('placeholder')), placeholder, 'Component\'s inner <textarea>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x5) {
        return _ref6.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('required mode works properly', function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
        var $component, $textareaInput;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context6.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "P0+F1REW",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"required\"],[[22,[\"class\"]],[22,[\"required\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Check that <textarea>'s required attribute doesn't exist yet.

                assert.strictEqual(Ember.$.trim($textareaInput.attr('required')), '', 'Component\'s inner <textarea> hasn\'t required attribute');

                // Activate required mode & check that <textarea>'s required attribute exists now & has value equals to 'required'.
                this.set('required', true);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('required')), 'required', 'Component\'s inner <textarea> has required attribute with value equals to \'required\'');

                // Check that <textarea>'s required attribute doesn't exist now.
                this.set('required', false);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('required')), '', 'Component\'s inner <textarea> hasn\'t required attribute');

              case 10:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x6) {
        return _ref7.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('disabled mode works properly', function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
        var $component, $textareaInput;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context7.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "AOcMLYEP",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"disabled\"],[[22,[\"class\"]],[22,[\"disabled\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Check that <textarea>'s disabled attribute doesn't exist yet.

                assert.strictEqual(Ember.$.trim($textareaInput.attr('disabled')), '', 'Component\'s inner <textarea> hasn\'t disabled attribute');

                // Activate disabled mode & check that <textarea>'s disabled attribute exists now & has value equals to 'disabled'.
                this.set('disabled', true);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('disabled')), 'disabled', 'Component\'s inner <textarea> has disabled attribute with value equals to \'disabled\'');

                // Check that <textarea>'s disabled attribute doesn't exist now.
                this.set('disabled', false);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('disabled')), '', 'Component\'s inner <textarea> hasn\'t disabled attribute');

              case 10:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x7) {
        return _ref8.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('autofocus mode works properly', function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(assert) {
        var $component, $textareaInput;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context8.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "xLt1DUdr",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"autofocus\"],[[22,[\"class\"]],[22,[\"autofocus\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Check that <textarea>'s autofocus attribute doesn't exist yet.

                assert.strictEqual(Ember.$.trim($textareaInput.attr('autofocus')), '', 'Component\'s inner <textarea> hasn\'t autofocus attribute');

                // Activate autofocus mode & check that <textarea>'s autofocus attribute exists now & has value equals to 'autofocus'.
                this.set('autofocus', true);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('autofocus')), 'autofocus', 'Component\'s inner <textarea> has autofocus attribute with value equals to \'autofocus\'');

                // Check that <textarea>'s autofocus attribute doesn't exist now.
                this.set('autofocus', false);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('autofocus')), '', 'Component\'s inner <textarea> hasn\'t autofocus attribute');

              case 10:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function (_x8) {
        return _ref9.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('spellcheck mode works properly', function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(assert) {
        var $component, $textareaInput;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context9.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Vq4KEuUS",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"spellcheck\"],[[22,[\"class\"]],[22,[\"spellcheck\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Check that <textarea>'s spellcheck attribute doesn't exist yet.

                assert.strictEqual(Ember.$.trim($textareaInput.attr('spellcheck')), '', 'Component\'s inner <textarea> hasn\'t spellcheck attribute');

                // Activate spellcheck mode & check that <textarea>'s spellcheck attribute exists now & has value equals to 'spellcheck'.
                this.set('spellcheck', true);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('spellcheck')), 'true', 'Component\'s inner <textarea> has spellcheck attribute with value equals to \'spellcheck\'');

                // Check that <textarea>'s spellcheck attribute doesn't exist now.
                this.set('spellcheck', false);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('spellcheck')), 'false', 'Component\'s inner <textarea> hasn\'t spellcheck attribute');

              case 10:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function (_x9) {
        return _ref10.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('wrap mode works properly', function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(assert) {
        var $component, $textareaInput;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                assert.expect(4);

                // Render component.
                _context10.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "hhUAsNKD",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"wrap\"],[[22,[\"class\"]],[22,[\"wrap\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

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

              case 13:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function (_x10) {
        return _ref11.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('rows mode works properly', function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(assert) {
        var $component, $textareaInput, defaultRowsCount, rowsValue;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context11.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "py1xI1wP",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"rows\"],[[22,[\"class\"]],[22,[\"rows\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Retrieve default rows count for current browser.

                defaultRowsCount = $textareaInput.prop('rows');

                // Generate random rows count >= 2.

                rowsValue = Math.floor(Math.random() * 10) + 2;

                // Check that <textarea>'s rows attribute is equals to specified value.

                this.set('rows', rowsValue);
                assert.strictEqual($textareaInput.prop('rows'), rowsValue, 'Component\'s inner <textarea>\'s value \'rows\' is equals to ' + rowsValue);

                // Check that <textarea>'s rows count is switched to default value.
                this.set('rows', null);
                assert.strictEqual($textareaInput.prop('rows'), defaultRowsCount, 'Component\'s inner <textarea>\'s rows count is switched to default value');

              case 11:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function (_x11) {
        return _ref12.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('cols mode works properly', function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(assert) {
        var $component, $textareaInput, defaultColsCount, colsValue;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context12.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "CGpxkJex",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"cols\"],[[22,[\"class\"]],[22,[\"cols\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Retrieve default rows count for current browser.

                defaultColsCount = $textareaInput.prop('cols');

                // Generate random cols count >= 20.

                colsValue = Math.floor(Math.random() * 10) + 20;

                // Check that <textarea>'s cols attribute is equals to specified value.

                this.set('cols', colsValue);
                assert.strictEqual($textareaInput.prop('cols'), colsValue, 'Component\'s inner <textarea>\'s value \'cols\' is equals to ' + colsValue);

                // Check that <textarea>'s cols count is switched to default value.
                this.set('cols', null);
                assert.strictEqual($textareaInput.prop('cols'), defaultColsCount, 'Component\'s inner <textarea> hasn\'t value cols attribute');

              case 11:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      return function (_x12) {
        return _ref13.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('maxlength mode works properly', function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(assert) {
        var $component, $textareaInput, maxlengthValue;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context13.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "uGg5RJZ1",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"maxlength\"],[[22,[\"class\"]],[22,[\"maxlength\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                //Generate a random value 'maxlength' and convert to a string.

                maxlengthValue = '' + Math.floor(Math.random() * 10);

                // Check that <textarea>'s maxlength attribute.

                this.set('maxlength', maxlengthValue);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('maxlength')), maxlengthValue, 'Component\'s inner <textarea>\'s value \'maxlength\' is equals to \'' + maxlengthValue + '\'');

                // Check that <textarea>'s hasn\'t value maxlength attribute.
                this.set('maxlength', null);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('maxlength')), '', 'Component\'s inner <textarea> hasn\'t value maxlength attribute');

              case 10:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      return function (_x13) {
        return _ref14.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('selectionStart mode works properly', function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(assert) {
        var $component, $textareaInput, newValue, selectionStartValue, $this, done;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context14.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "l0ulxOle",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"selectionStart\"],[[22,[\"class\"]],[22,[\"selectionStart\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
                // & check them again ('change' event is needed to force bindings work).

                newValue = 'Some text typed into textarea';

                $textareaInput.val(newValue);
                $textareaInput.change();

                //Generate a random value 'selectionStart' and convert to a string.
                selectionStartValue = Math.floor(Math.random() * 10 + 1);
                $this = this;

                // This timeout  is correcting problem with selectionStart in Mozila Firefox.

                done = assert.async();

                setTimeout(function () {
                  $this.set('selectionStart', selectionStartValue);
                  assert.strictEqual($textareaInput.prop('selectionStart'), selectionStartValue, 'Component\'s inner <textarea>\'s value \'selectionStart\' is equals to \'' + selectionStartValue + '\'');

                  // Check that <textarea>'s hasn\'t value maxlength attribute.
                  $this.set('selectionStart', null);
                  assert.strictEqual(Ember.$.trim($textareaInput.attr('selectionStart')), '', 'Component\'s inner <textarea> hasn\'t value selectionStart attribute');
                  done();
                }, 10);

              case 12:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      return function (_x14) {
        return _ref15.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('selectionEnd mode works properly', function () {
      var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(assert) {
        var $component, $textareaInput, newValue, selectionEndValue;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context15.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "zCgy2lRV",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"selectionEnd\"],[[22,[\"class\"]],[22,[\"selectionEnd\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
                // & check them again ('change' event is needed to force bindings work).

                newValue = 'Some text typed into textarea';

                $textareaInput.val(newValue);
                $textareaInput.change();

                //Generate a random value 'selectionEnd' and convert to a string.
                selectionEndValue = Math.floor(Math.random() * 10 + 1);

                // Check that <textarea>'s selectionEnd attribute.

                this.set('selectionEnd', selectionEndValue);
                assert.strictEqual($textareaInput.prop('selectionEnd'), selectionEndValue, 'Component\'s inner <textarea>\'s value \'selectionEnd\' is equals to \'' + selectionEndValue + '\'');

                // Check that <textarea>'s hasn\'t value maxlength attribute.
                this.set('selectionEnd', null);
                assert.strictEqual(Ember.$.trim($textareaInput.attr('selectionEnd')), '', 'Component\'s inner <textarea> hasn\'t value selectionEnd attribute');

              case 13:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      return function (_x15) {
        return _ref16.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('selectionDirection mode works properly', function () {
      var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(assert) {
        var $component, $textareaInput;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                assert.expect(1);

                // Render component.
                _context16.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "hfB/KRiF",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"class\",\"selectionDirection\"],[[22,[\"class\"]],[22,[\"selectionDirection\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Check that <textarea>'s hasn\'t value selectionDirection attribute.

                this.set('selectionDirection', null);
                assert.strictEqual($textareaInput.attr('selectionDirection'), undefined, 'Component\'s inner <textarea> hasn\'t value selectionDirection attribute');

              case 7:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      return function (_x16) {
        return _ref17.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('changes in inner <textarea> causes changes in property binded to \'value\'', function () {
      var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(assert) {
        var $component, $textareaInput, newValue;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                assert.expect(4);

                // Set <textarea>'s value' & render component.
                this.set('value', null);
                _context17.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "tacx7sgL",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Check <textarea>'s value & binded value for initial emptyness.

                assert.strictEqual(Ember.$.trim($textareaInput.val()), '', 'Component\'s inner <textarea>\'s value is equals to \'\'');
                assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

                // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
                // & check them again ('change' event is needed to force bindings work).
                newValue = 'Some text typed into textareas inner <textarea>';

                $textareaInput.val(newValue);
                $textareaInput.change();

                assert.strictEqual(Ember.$.trim($textareaInput.val()), newValue, 'Component\'s inner <textarea>\'s value is equals to \'' + newValue + '\'');
                assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');

              case 13:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      return function (_x17) {
        return _ref18.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('changes in property binded to \'value\' causes changes in inner <textarea>', function () {
      var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(assert) {
        var $component, $textareaInput, newValue;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                assert.expect(4);

                // Set <textarea>'s value' & render component.
                this.set('value', null);
                _context18.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "tacx7sgL",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textarea\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textareaInput = $component.children('textarea');

                // Check <textarea>'s value & binded value for initial emptyness.

                assert.strictEqual(Ember.$.trim($textareaInput.val()), '', 'Component\'s inner <textarea>\'s value is equals to \'\'');
                assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

                // Change property binded to 'value' & check them again.
                newValue = 'Some text typed into textareas inner <textarea>';

                this.set('value', newValue);

                assert.strictEqual(Ember.$.trim($textareaInput.val()), newValue, 'Component\'s inner <textarea>\'s value is equals to \'' + newValue + '\'');
                assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');

              case 12:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      return function (_x18) {
        return _ref19.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-textbox-test', ['ember-i18n/services/i18n', 'ember-flexberry/locales/ru/translations', 'ember-flexberry/locales/en/translations', 'qunit', '@ember/test-helpers', 'ember-qunit'], function (_i18n, _translations, _translations2, _qunit, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-textbox', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.owner.register('locale:ru/translations', _translations.default);
      this.owner.register('locale:en/translations', _translations2.default);
      this.owner.register('service:i18n', _i18n.default);

      this.i18n = this.owner.lookup('service:i18n');
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      // Set 'ru' as initial locale.
      this.i18n.set('locale', 'ru');
    });

    (0, _qunit.test)('it renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $component, $textboxInput, additioanlCssClasses;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(16);

                // Render component.
                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Sid7vGdE",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"class\"],[[22,[\"class\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textboxInput = $component.children('input');

                // Check wrapper <div>.

                assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
                assert.strictEqual($component.hasClass('flexberry-textbox'), true, 'Component\'s wrapper has \' flexberry-textbox\' css-class');
                assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
                assert.strictEqual($component.hasClass('input'), true, 'Component\'s wrapper has \'input\' css-class');

                // Check <input>.
                assert.strictEqual($textboxInput.length === 1, true, 'Component has inner <input>');
                assert.strictEqual($textboxInput.attr('type'), 'text', 'Component\'s inner <input> is of text type');

                // Check wrapper's additional CSS-classes.
                additioanlCssClasses = 'fluid transparent mini huge error';

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

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('class changes through base-component\'s dynamic properties works properly', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var initialClass, anotherClass, dynamicProperties, $component;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(6);

                initialClass = 'class1 class2';
                anotherClass = 'firstClass secondClass';
                dynamicProperties = {
                  class: initialClass
                };


                this.set('dynamicProperties', dynamicProperties);

                _context2.next = 7;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "noJykwNh",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[1,[26,\"flexberry-textbox\",null,[[\"dynamicProperties\"],[[22,[\"dynamicProperties\"]]]]],false],[0,\"\\n    \"]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 7:
                $component = Ember.$(this.element).children();


                assert.strictEqual($component.hasClass('class1'), true, 'Component\'s container has \'class1\' css-class');
                assert.strictEqual($component.hasClass('class2'), true, 'Component\'s container has \'class2\' css-class');

                Ember.set(dynamicProperties, 'class', anotherClass);
                assert.strictEqual($component.hasClass('class1'), false, 'Component\'s container hasn\'t \'class1\' css-class');
                assert.strictEqual($component.hasClass('class2'), false, 'Component\'s container hasn\'t \'class2\' css-class');
                assert.strictEqual($component.hasClass('firstClass'), true, 'Component\'s container has \'firstClass\' css-class');
                assert.strictEqual($component.hasClass('secondClass'), true, 'Component\'s container has \'secondClass\' css-class');

              case 15:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('readonly mode works properly', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var $component, $textboxInput;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context3.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "z7/lVeUo",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"class\",\"readonly\"],[[22,[\"class\"]],[22,[\"readonly\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textboxInput = $component.children('input');

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

              case 12:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('readonly mode works properly with value', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
        var _this = this;

        var $component, $textboxInput, newValue;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                assert.expect(2);

                // Set <input>'s value' & render component.
                this.set('value', null);
                this.set('readonly', true);
                _context4.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "LPWkt6eT",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"readonly\",\"value\"],[[22,[\"readonly\"]],[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textboxInput = $component.children('input');


                $textboxInput.on('change', function (e) {
                  if (_this.get('readonly')) {
                    e.stopPropagation();
                    $textboxInput.val(null);
                  }
                });

                newValue = 'New value';

                $textboxInput.val(newValue);
                $textboxInput.change();

                // Check <input>'s value not changed.
                assert.strictEqual(Ember.$.trim($textboxInput.val()), '', 'Component\'s inner <input>\'s value not changed');
                assert.strictEqual(this.get('value'), null, 'Component\'s property binded to unchanged \'value\'');

              case 13:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('click on textbox in readonly mode doesn\'t change value & it\'s type', function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
        var value, $component, $textboxInput;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                assert.expect(3);

                // Set <input>'s value' & render component.
                value = 123;

                this.set('value', value);
                _context5.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "uEXOATyP",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"readonly\",\"value\"],[true,[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textboxInput = $component.children('input');


                $textboxInput.click();
                $textboxInput.change();

                // Check <input>'s value not changed.
                assert.strictEqual(Ember.$.trim($textboxInput.val()), '' + value, 'Component\'s inner <input>\'s value not changed');
                assert.strictEqual(this.get('value'), value, 'Value binded to component\'s \'value\' property is unchanged');
                assert.strictEqual(Ember.typeOf(this.get('value')), 'number', 'Value binded to component\'s \'value\' property is still number');

              case 12:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x5) {
        return _ref6.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it renders i18n-ed placeholder', function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
        var $component, $textboxInput;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context6.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "2FwbsAq3",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-textbox\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textboxInput = $component.children('input');

                // Check <input>'s placeholder.

                assert.strictEqual(Ember.$.trim($textboxInput.attr('placeholder')), Ember.get(_translations.default, 'components.flexberry-textbox.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

                // Change current locale to 'en' & check <input>'s placeholder again.
                this.set('i18n.locale', 'en');
                assert.strictEqual(Ember.$.trim($textboxInput.attr('placeholder')), Ember.get(_translations2.default, 'components.flexberry-textbox.placeholder'), 'Component\'s inner <input>\'s placeholder is equals to it\'s value from i18n locales/en/translations');

              case 8:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x6) {
        return _ref7.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it renders manually defined placeholder', function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
        var placeholder, $component, $textboxInput;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                assert.expect(2);

                // Set <input>'s placeholder' & render component.
                placeholder = 'Input is empty, please type some text';

                this.set('placeholder', placeholder);
                _context7.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "LO/PMoJH",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"placeholder\"],[[22,[\"placeholder\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textboxInput = $component.children('input');

                // Check <input>'s placeholder.

                assert.strictEqual(Ember.$.trim($textboxInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

                // Change placeholder's value & check <input>'s placeholder again.
                placeholder = 'Input has no value';
                this.set('placeholder', placeholder);
                assert.strictEqual(Ember.$.trim($textboxInput.attr('placeholder')), placeholder, 'Component\'s inner <input>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');

              case 11:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x7) {
        return _ref8.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('changes in inner <input> causes changes in property binded to \'value\'', function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(assert) {
        var $component, $textboxInput, newValue;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                assert.expect(4);

                // Set <input>'s value' & render component.
                this.set('value', null);
                _context8.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "dT+OH+YL",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textboxInput = $component.children('input');

                // Check <input>'s value & binded value for initial emptyness.

                assert.strictEqual(Ember.$.trim($textboxInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
                assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

                // Change <input>'s value (imitate situation when user typed something into component's <input>)
                // & check them again ('change' event is needed to force bindings work).
                newValue = 'Some text typed into textboxes inner <input>';

                $textboxInput.val(newValue);
                $textboxInput.change();

                assert.strictEqual(Ember.$.trim($textboxInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
                assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');

              case 13:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function (_x8) {
        return _ref9.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('attribute maxlength rendered in html', function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(assert) {
        var $component, $fieldInput;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                assert.expect(1);

                // Render component.
                _context9.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "w2woXa5q",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-field\",null,[[\"maxlength\"],[5]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $fieldInput = Ember.$('.flexberry-textbox input', $component);

                // Check <input>'s maxlength attribute.

                assert.strictEqual($fieldInput.attr('maxlength'), '5', 'Component\'s inner <input>\'s attribute maxlength rendered');

              case 6:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function (_x9) {
        return _ref10.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('changes in property binded to \'value\' causes changes in inner <input>', function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(assert) {
        var $component, $textboxInput, newValue;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                assert.expect(4);

                // Set <input>'s value' & render component.
                this.set('value', null);
                _context10.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "dT+OH+YL",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-textbox\",null,[[\"value\"],[[22,[\"value\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $textboxInput = $component.children('input');

                // Check <input>'s value & binded value for initial emptyness.

                assert.strictEqual(Ember.$.trim($textboxInput.val()), '', 'Component\'s inner <input>\'s value is equals to \'\'');
                assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

                // Change property binded to 'value' & check them again.
                newValue = 'Some text typed into textboxes inner <input>';

                this.set('value', newValue);

                assert.strictEqual(Ember.$.trim($textboxInput.val()), newValue, 'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
                assert.strictEqual(this.get('value'), newValue, 'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');

              case 12:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function (_x10) {
        return _ref11.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-toggler-test', ['qunit', '@ember/test-helpers', 'ember-qunit'], function (_qunit, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var animationDuration = Ember.$.fn.accordion.settings.duration + 100;

  (0, _qunit.module)('Integration | Component | flexberry toggler', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    // Common expand/collapse test method.
    var expandCollapseTogglerWithStateChecks = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert, captions) {
        var endFunction, content, caption, expandedCaption, collapsedCaption, $component, $componentTitle, $componentCaption, $componentContent, expandAnimationCompleted;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(10);
                endFunction = assert.async();
                content = 'Toggler\'s content';


                captions = captions || {};
                caption = captions.caption || '';
                expandedCaption = captions.expandedCaption || caption;
                collapsedCaption = captions.collapsedCaption || caption;


                this.set('content', content);
                this.set('caption', caption);
                this.set('expandedCaption', expandedCaption);
                this.set('collapsedCaption', collapsedCaption);

                _context.next = 13;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "fGEpwkOh",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"caption\",\"expandedCaption\",\"collapsedCaption\"],[[22,[\"caption\"]],[22,[\"expandedCaption\"]],[22,[\"collapsedCaption\"]]]],{\"statements\":[[0,\"        \"],[1,[20,\"content\"],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 13:

                // Retrieve component, it's inner <input>.
                $component = Ember.$(this.element).children();
                $componentTitle = $component.children('div .title');
                $componentCaption = $componentTitle.children('span');
                $componentContent = $component.children('div .content');

                // Check that component is collapsed by default.

                assert.strictEqual($componentTitle.hasClass('active'), false);
                assert.strictEqual($componentContent.hasClass('active'), false);
                assert.strictEqual(Ember.$.trim($componentCaption.text()), collapsedCaption);

                /* eslint-disable no-unused-vars */
                expandAnimationCompleted = new Ember.RSVP.Promise(function (resolve, reject) {
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

              case 22:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function expandCollapseTogglerWithStateChecks(_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    (0, _qunit.test)('component renders properly', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var $component, $togglerTitle, $togglerIcon, $togglerCaption, $togglerContent, additioanlCssClasses;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(22);

                _context2.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "6yrbjMAe",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"class\"],[[22,[\"class\"]]]],{\"statements\":[],\"parameters\":[]},null]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component, it's inner <input>.
                $component = Ember.$(this.element).children();
                $togglerTitle = $component.children('.title');
                $togglerIcon = $togglerTitle.children('i');
                $togglerCaption = $togglerTitle.children('span');
                $togglerContent = $component.children('.content');

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
                additioanlCssClasses = 'firstClass secondClass';

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

              case 31:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component\'s icon can be customized', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var $component, $togglerTitle, $togglerIcon, defaultIconClass, iconClass;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(2);

                _context3.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "NWQn5fLd",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"iconClass\"],[[22,[\"iconClass\"]]]],{\"statements\":[],\"parameters\":[]},null]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component, it's inner <input>.
                $component = Ember.$(this.element).children();
                $togglerTitle = $component.children('.title');
                $togglerIcon = $togglerTitle.children('i');

                // Change default icon class.

                defaultIconClass = 'dropdown icon';

                assert.strictEqual($togglerIcon.attr('class'), defaultIconClass, 'Component\'s icon is \'dropdown icon\' by default');

                // Change icon class & check again.
                iconClass = 'marker icon';

                this.set('iconClass', iconClass);
                assert.strictEqual($togglerIcon.attr('class'), iconClass, 'Component\'s icon is \'dropdown icon\' by default');

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component expands/collapses with defined \'expandedCaption\' & \'collapsedCaption\'', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                expandCollapseTogglerWithStateChecks.call(this, assert, {
                  expandedCaption: 'Toggler\'s expanded caption',
                  collapsedCaption: 'Toggler\'s collapsed caption'
                });

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component expands/collapses with defined \'caption\' & \'collapsedCaption\'', function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                expandCollapseTogglerWithStateChecks.call(this, assert, {
                  caption: 'Toggler\'s caption',
                  collapsedCaption: 'Toggler\'s collapsed caption'
                });

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x6) {
        return _ref6.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component expands/collapses with defined \'caption\' & \'expandedCaption\'', function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                expandCollapseTogglerWithStateChecks.call(this, assert, {
                  caption: 'Toggler\'s caption',
                  expandedCaption: 'Toggler\'s expanded caption'
                });

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x7) {
        return _ref7.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component expands/collapses with only \'caption\' defined', function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                expandCollapseTogglerWithStateChecks.call(this, assert, {
                  caption: 'Toggler\'s caption'
                });

              case 1:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x8) {
        return _ref8.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component expands/collapses with only \'expandedCaption\' defined', function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(assert) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                expandCollapseTogglerWithStateChecks.call(this, assert, {
                  expandedCaption: 'Toggler\'s expanded caption'
                });

              case 1:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function (_x9) {
        return _ref9.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component expands/collapses with only \'collapsedCaption\' defined', function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(assert) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                expandCollapseTogglerWithStateChecks.call(this, assert, {
                  collapsedCaption: 'Toggler\'s collapsed caption'
                });

              case 1:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function (_x10) {
        return _ref10.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component expands/collapses without defined captions', function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(assert) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                expandCollapseTogglerWithStateChecks.call(this, assert, {});

              case 1:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function (_x11) {
        return _ref11.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('changes in \'expanded\' property causes changing of component\'s expand/collapse state', function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(assert) {
        var content, collapsedCaption, expandedCaption, $component, $togglerTitle, $togglerCaption, $togglerContent;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                assert.expect(9);

                content = 'Toggler\'s content';
                collapsedCaption = 'Toggler\'s collapsed caption';
                expandedCaption = 'Toggler\'s expanded caption';


                this.set('content', content);
                this.set('collapsedCaption', collapsedCaption);
                this.set('expandedCaption', expandedCaption);

                _context11.next = 9;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "/TOWlvq6",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"expanded\",\"collapsedCaption\",\"expandedCaption\"],[[22,[\"expanded\"]],[22,[\"collapsedCaption\"]],[22,[\"expandedCaption\"]]]],{\"statements\":[[0,\"        \"],[1,[20,\"content\"],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 9:

                // Retrieve component, it's inner <input>.
                $component = Ember.$(this.element).children();
                $togglerTitle = $component.children('.title');
                $togglerCaption = $togglerTitle.children('span');
                $togglerContent = $component.children('.content');

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

              case 24:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function (_x12) {
        return _ref12.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('disabled animation', function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(assert) {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "avZqVM95",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"caption\",\"duration\"],[\"Click me!\",0]],{\"statements\":[[0,\"        Hello!\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:

                assert.notOk(Ember.$('.flexberry-toggler .content', this.element).hasClass('active'));

                Ember.$('.flexberry-toggler .title', this.element).click();

                assert.ok(Ember.$('.flexberry-toggler .content', this.element).hasClass('active'));

              case 5:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      return function (_x13) {
        return _ref13.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('loong animation speed', function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(assert) {
        var _this = this;

        var done;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                assert.expect(3);
                done = assert.async();
                _context13.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "ynPZAHdf",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"caption\",\"duration\"],[\"Click me!\",750]],{\"statements\":[[0,\"        Hello!\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:

                Ember.$('.flexberry-toggler .title', this.element).click();

                assert.ok(Ember.$('.flexberry-toggler .content', this.element).hasClass('animating'));
                Ember.run.later(function () {
                  assert.ok(Ember.$('.flexberry-toggler .content', _this.element).hasClass('animating'));
                }, 500);
                Ember.run.later(function () {
                  assert.notOk(Ember.$('.flexberry-toggler .content', _this.element).hasClass('animating'));
                  done();
                }, 1000);

              case 8:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      return function (_x14) {
        return _ref14.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Components property hasShadow works properly', function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(assert) {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                this.set('hasShadow', true);
                _context14.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "arWOV+qJ",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"caption\",\"hasShadow\"],[\"Click me!\",[22,[\"hasShadow\"]]]],{\"statements\":[[0,\"      Hello!\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                assert.ok(Ember.$('.flexberry-toggler', this.element).hasClass('has-shadow'));
                this.set('hasShadow', false);
                assert.notOk(Ember.$('.flexberry-toggler', this.element).hasClass('has-shadow'));

              case 6:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      return function (_x15) {
        return _ref15.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('Components property hasBorder works properly', function () {
      var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(assert) {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                this.set('hasBorder', true);
                _context15.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "fW21tvQd",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"flexberry-toggler\",null,[[\"caption\",\"hasBorder\"],[\"Click me!\",[22,[\"hasBorder\"]]]],{\"statements\":[[0,\"      Hello!\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                assert.ok(Ember.$('.flexberry-toggler', this.element).hasClass('has-border'));
                this.set('hasBorder', false);
                assert.notOk(Ember.$('.flexberry-toggler', this.element).hasClass('has-border'));

              case 6:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      return function (_x16) {
        return _ref16.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-validationmessage-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-validationmessage', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders and works', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "F4BP9WHG",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-validationmessage\",null,[[\"error\",\"color\",\"pointing\"],[[22,[\"error\"]],[22,[\"color\"]],[22,[\"pointing\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:

                [undefined, null, '', []].forEach(function (error) {
                  _this.set('error', error);
                  assert.ok(Ember.$('.ui.label', _this.element).is(':hidden'), 'Component is hidden if no error.');
                });

                this.set('error', 'This is error.');
                assert.ok(Ember.$('.ui.label', this.element).is(':visible'), 'Component is visible if there errors.');
                assert.equal(Ember.$(this.element).text().trim(), 'This is error.', 'Component shows error.');

                this.set('error', ['First error.', 'Second error.']);
                assert.equal(Ember.$(this.element).text().trim(), 'First error.,Second error.', 'Component shows all errors.');

                assert.notOk(Ember.$('.ui.label', this.element).hasClass('red'), 'Override default color with undefined value.');
                assert.notOk(Ember.$('.ui.label', this.element).hasClass('pointing'), 'Override default pointing with undefined value.');

                this.set('color', 'pink');
                this.set('pointing', 'left pointing');
                assert.ok(Ember.$('.ui.label', this.element).hasClass('pink'), 'Color works through CSS class.');
                assert.ok(Ember.$('.ui.label', this.element).hasClass('left'), 'Pointing works through CSS class.');

                _context.next = 16;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "dJ7ABynb",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-validationmessage\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 16:
                assert.ok(Ember.$('.ui.label', this.element).hasClass('red'), 'Default color \'red\'.');
                assert.ok(Ember.$('.ui.label', this.element).hasClass('pointing'), 'Default pointing \'pointing\'.');

              case 18:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry-validationsummary-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | flexberry-validationsummary', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders and works', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var errors;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "T3lhr2lq",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry-validationsummary\",null,[[\"errors\",\"color\",\"header\"],[[22,[\"errors\"]],[22,[\"color\"]],[22,[\"header\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:
                errors = this.set('errors', Ember.A());

                assert.ok(Ember.$('.ui.message', this.element).is(':hidden'), 'Component is hidden if no errors.');

                Ember.run(function () {
                  errors.pushObject('Validation error.');
                });
                assert.ok(Ember.$('.ui.message', this.element).is(':visible'), 'Component is visible if there errors.');
                assert.ok(Ember.$(this.element).text().trim(), 'Validation error.', 'Component shows errors at added.');

                this.set('header', 'Validation errors');
                assert.ok(/Validation errors\s*/.test(Ember.$(this.element).text().trim()), 'Component has a header.');

                assert.notOk(Ember.$('.ui.label', this.element).hasClass('red'), 'Override default color with undefined value.');

                this.set('color', 'blue');
                assert.ok(Ember.$('.ui.message', this.element).hasClass('blue'), 'Color works through CSS class.');

                _context.next = 14;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "B1HkP5Uq",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry-validationsummary\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 14:
                assert.ok(Ember.$('.ui.message', this.element).hasClass('red'), 'Default color \'red\'.');

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/flexberry/validation-summary-test', ['ember-qunit', '@ember/test-helpers'], function (_emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  // eslint-disable-next-line ember/no-test-module-for
  (0, _emberQunit.module)('Integration | Component | flexberry/validation-summary', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _emberQunit.test)('it renders and works', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var errors;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "3kxUpfxq",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"flexberry/validation-summary\",null,[[\"errors\",\"color\",\"header\"],[[22,[\"errors\"]],[22,[\"color\"]],[22,[\"header\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:
                errors = this.set('errors', Ember.A());

                assert.ok(Ember.$('.ui.message', this.element).is(':hidden'), 'Component is hidden if no errors.');

                Ember.run(function () {
                  errors.pushObject('Validation error.');
                });

                assert.ok(Ember.$('.ui.message', this.element).is(':visible'), 'Component is visible if there errors.');
                assert.ok(Ember.$(this.element).text().trim(), 'Validation error.', 'Component shows errors at added.');

                this.set('header', 'Validation errors');
                assert.ok(/Validation errors\s*/.test(Ember.$(this.element).text().trim()), 'Component has a header.');

                assert.notOk(Ember.$('.ui.label', this.element).hasClass('red'), 'Override default color with undefined value.');

                this.set('color', 'blue');
                assert.ok(Ember.$('.ui.message', this.element).hasClass('blue'), 'Color works through CSS class.');

                // eslint-disable-next-line ember/no-test-this-render, hbs/check-hbs-template-literals
                _context.next = 14;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "yfUE937g",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"flexberry/validation-summary\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 14:

                assert.ok(Ember.$('.ui.message', this.element).hasClass('red'), 'Default color \'red\'.');

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/form-load-time-tracker-test', ['ember-i18n/services/i18n', 'qunit', '@ember/test-helpers', 'ember-qunit'], function (_i18n, _qunit, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var formLoadTimeTracker = Ember.Service.extend({
    loadTime: 1.0000,
    renderTime: 2.0000
  });

  (0, _qunit.module)('Integration | Component | form load time tracker', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.owner.register('service:form-load-time-tracker', formLoadTimeTracker);
      this.owner.register('service:i18n', _i18n.default);

      this.i18n = this.owner.lookup('service:i18n');
      Ember.Component.reopen({
        i18n: Ember.inject.service('i18n')
      });

      this.formLoadTimeTracker = this.owner.lookup('service:form-load-time-tracker');

      // Set 'ru' as initial locale.
      this.set('i18n.locale', 'ru');
    });

    (0, _qunit.test)('it renders', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var i18n, loadTimeText, renderTimeText;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                i18n = this.get('i18n');
                loadTimeText = i18n.t('components.form-load-time-tracker.load-time');
                renderTimeText = i18n.t('components.form-load-time-tracker.render-time');
                _context.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "fiSH9ohk",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"form-load-time-tracker\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:
                assert.equal(Ember.$(this.element).text().trim(), loadTimeText + ': 1\n' + renderTimeText + ': 2');

                _context.next = 8;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "DtXIWqiD",
                  "block": "{\"symbols\":[],\"statements\":[[4,\"form-load-time-tracker\",null,null,{\"statements\":[[0,\"Yield here!\"]],\"parameters\":[]},null]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 8:
                assert.equal(Ember.$(this.element).text().trim(), loadTimeText + ': 1\n' + renderTimeText + ': 2\nYield here!');

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/groupedit-toolbar-test', ['qunit', '@ember/test-helpers', 'ember-qunit'], function (_qunit, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | groupedit toolbar', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(2);

                // Set any properties with this.set('myProperty', 'value');
                // Handle any actions with this.on('myAction', function(val) { ... });

                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "nz9cvBqP",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"groupedit-toolbar\",null,[[\"componentName\"],[\"someName\"]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                assert.equal(Ember.$(this.element).text().trim(), '');

                // Template block usage:
                _context.next = 6;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "ur+KOHkF",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"groupedit-toolbar\",null,[[\"componentName\"],[\"someName\"]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 6:

                //Component does not support template block usage.
                assert.equal(Ember.$(this.element).text().trim(), '');

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/modal-dialog-test', ['qunit', 'ember-qunit', '@ember/test-helpers', 'ember-test-helpers/wait'], function (_qunit, _emberQunit, _testHelpers, _wait) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | modal-dialog', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      var _this = this;

      this.set('settings', { detachable: false });
      this.set('created', false);
      this.set('createdConsumer', function () {
        _this.set('created', true);
      });
      Ember.Test.registerWaiter(this, function () {
        return _this.get('created');
      });
    });

    hooks.afterEach(function () {
      this.$('.flexberry-modal').modal('hide dimmer');
    });

    (0, _qunit.test)('it renders', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "XDcwlAZ9",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modal-dialog\",null,[[\"settings\",\"created\"],[[22,[\"settings\"]],[22,[\"createdConsumer\"]]]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:
                return _context.abrupt('return', (0, _wait.default)().then(function () {
                  assert.equal(_this2.$('.content').text().trim(), 'template block text');
                }));

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('it should not show actions div if no buttons visible', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "H61BBgsL",
                  "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modal-dialog\",null,[[\"settings\",\"created\",\"useOkButton\",\"useCloseButton\"],[[22,[\"settings\"]],[22,[\"createdConsumer\"]],false,false]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:
                return _context2.abrupt('return', (0, _wait.default)().then(function () {
                  assert.equal(_this3.$('.actions').length, 0);
                }));

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/object-list-view-test', ['qunit', 'ember-qunit', '@ember/test-helpers', 'dummy/tests/helpers/start-app', 'dummy/models/components-examples/flexberry-groupedit/shared/aggregator', 'ember-flexberry/services/user-settings'], function (_qunit, _emberQunit, _testHelpers, _startApp, _aggregator, _userSettings) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var App = void 0;

  (0, _qunit.module)('Integration | Component | object-list-view', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
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
    });

    (0, _qunit.test)('columns renders', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var _this = this;

        var store;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                store = this.owner.lookup('service:store');


                Ember.run(function () {
                  var model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');

                  _this.set('proj', _aggregator.default.projections.get('AggregatorE'));
                  _this.set('model', model);
                });

                _context.next = 4;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "+3YaJXBg",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"object-list-view\",null,[[\"modelProjection\",\"content\",\"componentName\"],[[21,0,[\"proj\"]],[21,0,[\"model\",\"details\"]],\"someName\"]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 4:
                assert.notEqual(this.element.textContent.trim(), '');

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/olv-filter-interval-test', ['ember-qunit', '@ember/test-helpers'], function (_emberQunit, _testHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _emberQunit.module)('Integration | Component | olv-filter-interval', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _emberQunit.test)('it renders', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "ZGoM5/ro",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"olv-filter-interval\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 2:
                assert.equal(Ember.$(this.element).text().trim(), '');

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/integration/components/ui-message-test', ['qunit', '@ember/test-helpers', 'ember-qunit'], function (_qunit, _testHelpers, _emberQunit) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  (0, _qunit.module)('Integration | Component | ui-message', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders properly', function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
        var $component;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "QST815LZ",
                  "block": "{\"symbols\":[],\"statements\":[[1,[20,\"ui-message\"],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Check wrapper <div>.

                assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
                assert.strictEqual($component.hasClass('message'), true, 'Component\'s wrapper has \' message\' css-class');

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('size renders properly', function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
        var _this = this;

        var $component, sizeTypes;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                assert.expect(8);

                // Render component.
                _context2.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "YtPrj2kZ",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"size\"],[[22,[\"size\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Check component's syze's types.

                sizeTypes = Ember.A(['small', 'large', 'huge', 'massive']);
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

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('type renders properly', function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
        var _this2 = this;

        var $component, typeCssClasses;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                assert.expect(12);

                // Render component.
                _context3.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "+dL3UPGt",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"type\"],[[22,[\"type\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Check component's type's CSS-classes.

                typeCssClasses = Ember.A(['warning', 'info', 'positive', 'success', 'negative', 'error']);
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

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('color renders properly', function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
        var _this3 = this;

        var $component, colorCssClasses;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                assert.expect(24);

                // Render component.
                _context4.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Gpe4jVFk",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"color\"],[[22,[\"color\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Check component's color's CSS-classes.

                colorCssClasses = Ember.A(['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'black']);
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

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('floating renders properly', function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
        var $component;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context5.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "D889f8Ys",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"floating\"],[[22,[\"floating\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Check wrapper <div>.

                assert.strictEqual($component.hasClass('floating'), false, 'Component\'s wrapper hasn\'t \'floating\' css-class');

                this.set('floating', true);
                assert.strictEqual($component.hasClass('floating'), true, 'Component\'s wrapper has \'floating\' css-class');

                this.set('floating', false);
                assert.strictEqual($component.hasClass('floating'), false, 'Component\'s wrapper hasn\'t \'floating\' css-class');

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x5) {
        return _ref6.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('attached renders properly', function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
        var $component;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context6.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "+iRwRmSZ",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"attached\"],[[22,[\"attached\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // Check wrapper <div>.

                assert.strictEqual($component.hasClass('attached'), false, 'Component\'s wrapper hasn\'t \'attached\' css-class');

                this.set('attached', true);
                assert.strictEqual($component.hasClass('attached'), true, 'Component\'s wrapper has \'attached\' css-class');

                this.set('attached', false);
                assert.strictEqual($component.hasClass('attached'), false, 'Component\'s wrapper hasn\'t \'attached\' css-class');

              case 9:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x6) {
        return _ref7.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('visible renders properly', function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
        var $component, $closeableIcon;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context7.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "ugsdBNVe",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"visible\",\"closeable\"],[[22,[\"visible\"]],true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $closeableIcon = $component.children('i');

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

              case 10:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x7) {
        return _ref8.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('closeable renders properly', function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(assert) {
        var $component, $closeableIcon;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                assert.expect(2);

                // Render component.
                _context8.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "UaYYereD",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"closeable\"],[true]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $closeableIcon = $component.children('i');


                assert.strictEqual($closeableIcon.hasClass('close'), true, 'Component\'s close icon has css-class \'close\'');
                assert.strictEqual($closeableIcon.hasClass('icon'), true, 'Component\'s wrapper has css-class \'icon\'');

              case 7:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function (_x8) {
        return _ref9.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('caption & massage renders properly', function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(assert) {
        var $component, $captionText, $massageText;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                assert.expect(3);

                // Render component.
                _context9.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "Frieyj9C",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"caption\",\"message\"],[\"My caption\",\"My message\"]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $captionText = $component.children('div');
                $massageText = $component.children('p');


                assert.strictEqual($captionText.hasClass('header'), true, 'Component\'s caption block has \'header\' css-class');
                assert.strictEqual(Ember.$.trim($captionText.text()), 'My caption', 'Component\'s caption is right');
                assert.strictEqual(Ember.$.trim($massageText.text()), 'My message', 'Component\'s message is right');

              case 9:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function (_x9) {
        return _ref10.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('icon renders properly', function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(assert) {
        var $component, $messageIcon, $captionDiv, $captionText, $massageText;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                assert.expect(7);

                // Render component.
                _context10.next = 3;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "5DlouAdb",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"icon\",\"caption\",\"message\"],[\"icon paw\",\"My caption\",\"My message\"]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 3:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $messageIcon = $component.children('i');
                $captionDiv = $component.children('div.content');
                $captionText = $captionDiv.children('div.header');
                $massageText = $captionDiv.children('p');


                assert.strictEqual($component.hasClass('icon'), true, 'Component\'s wrapper has \'icon\' css-class');
                assert.strictEqual($messageIcon.hasClass('paw'), true, 'Component\'s icon has \'paw\' css-class');
                assert.strictEqual($messageIcon.hasClass('icon'), true, 'Component\'s icon has \'icon\' css-class');
                assert.strictEqual($captionDiv.hasClass('content'), true, 'Component\'s content block has \'content\' css-class');
                assert.strictEqual($captionText.hasClass('header'), true, 'Component\'s caption block has \'header\' css-class');
                assert.strictEqual(Ember.$.trim($captionText.text()), 'My caption', 'Component\'s caption is right');
                assert.strictEqual(Ember.$.trim($massageText.text()), 'My message', 'Component\'s message is right');

              case 15:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function (_x10) {
        return _ref11.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component sends \'onHide\' action', function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(assert) {
        var messageClose, $component, $closeableIcon;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                assert.expect(3);

                messageClose = false;

                this.set('onClose', function () {
                  messageClose = true;
                });

                // Render component.
                _context11.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "sU3JXbyJ",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"closeable\",\"onHide\"],[true,[21,0,[\"onClose\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();
                $closeableIcon = $component.children('i');

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

              case 9:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function (_x11) {
        return _ref12.apply(this, arguments);
      };
    }());

    (0, _qunit.test)('component sends \'onShow\' action', function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(assert) {
        var messageVisible, $component;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                assert.expect(4);

                messageVisible = false;

                this.set('onVisible', function () {
                  messageVisible = true;
                });

                // Render component.
                _context12.next = 5;
                return (0, _testHelpers.render)(Ember.HTMLBars.template({
                  "id": "XuKSUvAZ",
                  "block": "{\"symbols\":[],\"statements\":[[1,[26,\"ui-message\",null,[[\"closeable\",\"visible\",\"onShow\"],[true,[22,[\"visible\"]],[21,0,[\"onVisible\"]]]]],false]],\"hasEval\":false}",
                  "meta": {}
                }));

              case 5:

                // Retrieve component.
                $component = Ember.$(this.element).children();

                // The component is hidden.

                this.set('visible', false);
                assert.strictEqual(messageVisible, false, 'Component is not visible');
                assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s wrapper has css-class \'hidden\'');

                // The component is visible.
                this.set('visible', true);
                assert.strictEqual(messageVisible, true, 'Component is visible');
                assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css-class \'hidden\'');

              case 12:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      return function (_x12) {
        return _ref13.apply(this, arguments);
      };
    }());
  });
});
define('dummy/tests/test-helper', ['dummy/app', 'dummy/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('dummy/tests/unit/adapters/application-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('ApplicationAdapter', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var adapter = this.owner.lookup('adapter:application');
      assert.ok(adapter);
    });
  });
});
define('dummy/tests/unit/controllers/application-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var controller = this.owner.lookup('controller:application');
      assert.ok(controller);
    });
  });
});
define('dummy/tests/unit/controllers/detail-edit-form-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | detail edit form', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var _this = this;

      var controller = void 0;
      Ember.run(function () {
        controller = _this.owner.lookup('controller:detail-edit-form');
      });

      assert.ok(controller);
    });
  });
});
define('dummy/tests/unit/controllers/edit-form-test', ['ember-data', 'qunit', 'ember-qunit', 'dummy/tests/helpers/start-app'], function (_emberData, _qunit, _emberQunit, _startApp) {
  'use strict';

  var App;

  (0, _qunit.module)('Unit | Controller | edit form', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    hooks.beforeEach(function () {
      App = (0, _startApp.default)();
    });

    hooks.afterEach(function () {
      Ember.run(App, 'destroy');
      Ember.$.mockjax.clear();
    });

    (0, _qunit.test)('it exists', function (assert) {
      var _this = this;

      var controller = void 0;
      Ember.run(function () {
        controller = _this.owner.lookup('controller:edit-form');
      });
      assert.ok(controller);
    });

    (0, _qunit.test)('save hasMany relationships recursively', function (assert) {
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
        controller = _this3.owner.lookup('controller:edit-form');
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
});
define('dummy/tests/unit/controllers/flexberry-file-view-dialog-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | edit form', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var controller = this.owner.lookup('controller:flexberry-file-view-dialog');
      assert.ok(controller);
    });
  });
});
define('dummy/tests/unit/controllers/list-form-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | list form', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var controller = this.owner.lookup('controller:list-form');
      assert.ok(controller);
    });
  });
});
define('dummy/tests/unit/controllers/lookup-dialog-test', ['qunit', 'ember-qunit', 'sinon'], function (_qunit, _emberQunit, _sinon) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | lookup dialog', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      var controller = this.owner.lookup('controller:lookup-dialog');
      assert.ok(controller);
    });

    (0, _qunit.test)('it shold set selected record to saveTo.propName of saveTo.model', function (assert) {
      var model = Ember.Object.extend({ makeDirty: function makeDirty() {} }).create();
      var reloadContext = {
        send: function send(name, options) {
          var modelToLookup = options.modelToLookup;
          var relationName = options.relationName;
          var newRelationValue = options.newRelationValue;

          modelToLookup.set(relationName, newRelationValue);
          modelToLookup.makeDirty();
        }
      };
      var saveTo = {
        model: model,
        propName: 'testProperty',
        updateLookupAction: 'updateLookupAction',
        componentContext: reloadContext
      };

      var controller = this.owner.lookup('controller:lookup-dialog');

      controller.set('saveTo', saveTo);

      _sinon.default.stub(model, 'makeDirty');
      _sinon.default.stub(controller, '_closeModalDialog');

      var master = Ember.Object.create();

      controller.send('objectListViewRowClick', master);

      assert.equal(model.get('testProperty'), master);
    });
  });
});
define('dummy/tests/unit/controllers/new-platform-flexberry-services-lock-list-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | new-platform-flexberry-services-lock-list', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var controller = this.owner.lookup('controller:new-platform-flexberry-services-lock-list');
      assert.ok(controller);
    });
  });
});
define('dummy/tests/unit/helpers/readonly-cell-test', ['dummy/helpers/readonly-cell', 'qunit'], function (_readonlyCell, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Helper | readonly cell', function () {
    (0, _qunit.test)('it works', function (assert) {
      Ember.run(function () {
        var result = (0, _readonlyCell.readonlyCell)([['test'], 'test', false]);
        assert.ok(result);
      });
    });
  });
});
define('dummy/tests/unit/initializers/i18n-test', ['dummy/initializers/i18n', 'qunit'], function (_i18n, _qunit) {
  'use strict';

  var application = void 0;

  (0, _qunit.module)('Unit | Initializer | i18n', function (hooks) {
    hooks.beforeEach(function () {
      Ember.run(function () {
        application = Ember.Application.create();
        application.deferReadiness();
      });
    });

    (0, _qunit.test)('it works', function (assert) {
      _i18n.default.initialize(application);

      // you would normally confirm the results of the initializer here
      assert.ok(true);
    });
  });
});
define('dummy/tests/unit/initializers/render-perf-logger-test', ['dummy/initializers/render-perf-logger', 'qunit'], function (_renderPerfLogger, _qunit) {
  'use strict';

  var application = void 0;

  (0, _qunit.module)('Unit | Initializer | render perf logger', function (hooks) {
    hooks.beforeEach(function () {
      Ember.run(function () {
        application = Ember.Application.create();
        application.deferReadiness();
      });
    });

    (0, _qunit.test)('it works', function (assert) {
      _renderPerfLogger.default.initialize(application);

      // you would normally confirm the results of the initializer here
      assert.ok(true);
    });
  });
});
define('dummy/tests/unit/instance-initializers/i18n-test', ['ember-flexberry/instance-initializers/i18n', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (_i18n, _qunit, _startApp, _destroyApp) {
  'use strict';

  var application = void 0;
  var appInstance = void 0;
  var fakeLocale = void 0;

  (0, _qunit.module)('Unit | Instance Initializer | i18n', function (hooks) {
    hooks.beforeEach(function () {
      application = (0, _startApp.default)();
      appInstance = application.buildInstance();

      // Just take it and turn it off...
      appInstance.lookup('service:log').set('enabled', false);

      // Set 'fake-locale' as default i18n-service locale.
      var i18n = appInstance.lookup('service:i18n');
      fakeLocale = 'fake-locale';
      i18n.set('locale', fakeLocale);
    });

    hooks.afterEach(function () {
      (0, _destroyApp.default)(appInstance);
      (0, _destroyApp.default)(application);
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
});
define('dummy/tests/unit/instance-initializers/lock-test', ['dummy/instance-initializers/lock', 'qunit', 'dummy/tests/helpers/destroy-app'], function (_lock, _qunit, _destroyApp) {
  'use strict';

  var application = void 0;
  var appInstance = void 0;

  (0, _qunit.module)('Unit | Instance Initializer | lock', function (hooks) {
    hooks.beforeEach(function () {
      Ember.run(function () {
        application = Ember.Application.create();
        appInstance = application.buildInstance();
      });
    });

    hooks.afterEach(function () {
      Ember.run(appInstance, 'destroy');
      (0, _destroyApp.default)(application);
    });

    (0, _qunit.test)('it works', function (assert) {
      (0, _lock.initialize)(appInstance);

      // you would normally confirm the results of the initializer here
      assert.ok(true);
    });
  });
});
define('dummy/tests/unit/instance-initializers/moment-test', ['ember-flexberry/instance-initializers/moment', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (_moment, _qunit, _startApp, _destroyApp) {
  'use strict';

  var application = void 0;
  var appInstance = void 0;
  var defaultLocale = void 0;
  var defaultFormat = void 0;

  (0, _qunit.module)('Unit | Instance Initializer | moment', function (hooks) {
    hooks.beforeEach(function () {
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
    });

    hooks.afterEach(function () {
      (0, _destroyApp.default)(appInstance);
      (0, _destroyApp.default)(application);
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

  (0, _qunit.module)('Unit | Mixin | dynamic-actions mixin', function () {
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
});
define('dummy/tests/unit/mixins/dynamic-properties-test', ['ember-flexberry/mixins/dynamic-properties', 'qunit'], function (_dynamicProperties, _qunit) {
  'use strict';

  var ClassWithDynamicPropertiesMixin = Ember.Object.extend(_dynamicProperties.default, {});

  (0, _qunit.module)('Unit | Mixin | dynamic-properties mixin', function () {
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
});
define('dummy/tests/unit/mixins/errorable-route-test', ['ember-flexberry/mixins/errorable-route', 'qunit'], function (_errorableRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | errorable route', function () {
    (0, _qunit.test)('it works', function (assert) {
      var ErrorableRouteObject = Ember.Object.extend(_errorableRoute.default);
      var subject = ErrorableRouteObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/flexberry-file-controller-test', ['ember-flexberry/mixins/flexberry-file-controller', 'qunit'], function (_flexberryFileController, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | flexberry file controller', function () {
    (0, _qunit.test)('it works', function (assert) {
      var FlexberryFileControllerObject = Ember.Object.extend(_flexberryFileController.default);
      var subject = FlexberryFileControllerObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/flexberry-groupedit-route-test', ['ember-flexberry/mixins/flexberry-groupedit-route', 'qunit'], function (_flexberryGroupeditRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | flexberry groupedit route', function () {
    (0, _qunit.test)('it works', function (assert) {
      var FlexberryGroupeditRouteObject = Ember.Object.extend(_flexberryGroupeditRoute.default);
      var subject = FlexberryGroupeditRouteObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/lock-route-test', ['ember-flexberry/mixins/lock-route', 'qunit'], function (_lockRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | lock-route', function () {
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
});
define('dummy/tests/unit/mixins/modal-application-route-test', ['ember-flexberry/mixins/modal-application-route', 'qunit'], function (_modalApplicationRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | modal application route mixin', function () {
    (0, _qunit.test)('it works', function (assert) {
      var ModalApplicationRouteObject = Ember.Object.extend(_modalApplicationRoute.default);
      var subject = ModalApplicationRouteObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/multi-list-controller-test', ['ember-flexberry/mixins/multi-list-controller', 'qunit'], function (_multiListController, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | multi list controller', function () {
    (0, _qunit.test)('it works', function (assert) {
      var MultiListControllerObject = Ember.Object.extend(_multiListController.default);
      var subject = MultiListControllerObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/multi-list-model-edit-test', ['ember-flexberry/mixins/multi-list-model-edit', 'qunit'], function (_multiListModelEdit, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | multi list model edit', function () {
    (0, _qunit.test)('it works', function (assert) {
      var MultiListModelEditObject = Ember.Object.extend(_multiListModelEdit.default);
      var subject = MultiListModelEditObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/multi-list-model-test', ['ember-flexberry/mixins/multi-list-model', 'qunit'], function (_multiListModel, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | multi list model', function () {
    (0, _qunit.test)('it works', function (assert) {
      var MultiListModelObject = Ember.Object.extend(_multiListModel.default);
      var subject = MultiListModelObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/multi-list-route-test', ['ember-flexberry/mixins/multi-list-route', 'qunit'], function (_multiListRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | multi list route', function () {
    (0, _qunit.test)('it works', function (assert) {
      var MultiListRouteObject = Ember.Object.extend(_multiListRoute.default);
      var subject = MultiListRouteObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/paginated-controller-test', ['ember-flexberry/mixins/paginated-controller', 'qunit'], function (_paginatedController, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | paginated controller mixin', function () {
    (0, _qunit.test)('it works', function (assert) {
      var PaginatedControllerObject = Ember.Object.extend(_paginatedController.default);
      var subject = PaginatedControllerObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/paginated-route-test', ['ember-flexberry/mixins/paginated-route', 'qunit'], function (_paginatedRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | paginated route mixin', function () {
    (0, _qunit.test)('it works', function (assert) {
      var PaginatedRouteObject = Ember.Object.extend(_paginatedRoute.default);
      var subject = PaginatedRouteObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/predicate-from-filters-test', ['ember-flexberry/mixins/predicate-from-filters', 'qunit'], function (_predicateFromFilters, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | predicate from filters', function () {
    (0, _qunit.test)('it works', function (assert) {
      var PredicateFromFiltersObject = Ember.Object.extend(_predicateFromFilters.default);
      var subject = PredicateFromFiltersObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/reload-list-mixin-test', ['ember-data', 'ember-flexberry/mixins/reload-list-mixin', 'qunit', 'dummy/tests/helpers/start-app', 'ember-flexberry-data/models/model', 'ember-flexberry-data/utils/attributes', 'ember-flexberry-data/serializers/odata', 'ember-flexberry-data/query/predicate'], function (_emberData, _reloadListMixin, _qunit, _startApp, _model, _attributes, _odata, _predicate) {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  (0, _qunit.module)('Unit | Mixin | reload list mixin', function () {
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
});
define('dummy/tests/unit/mixins/sortable-controller-test', ['ember-flexberry/mixins/sortable-controller', 'qunit'], function (_sortableController, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | sortable controller mixin', function () {
    (0, _qunit.test)('it works', function (assert) {
      var SortableControllerObject = Ember.Object.extend(_sortableController.default);
      var subject = SortableControllerObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/mixins/sortable-route-test', ['ember-flexberry/mixins/sortable-route', 'qunit'], function (_sortableRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | sortable route mixin', function () {
    (0, _qunit.test)('it works', function (assert) {
      var SortableRouteObject = Ember.Object.extend(_sortableRoute.default);
      var subject = SortableRouteObject.create();
      assert.ok(subject);
    });
  });
});
define('dummy/tests/unit/models/new-platform-flexberry-flexberry-user-setting-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | new-platform-flexberry-flexberry-user-setting', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var store = this.owner.lookup('service:store');
      var model = Ember.run(function () {
        return store.createRecord('new-platform-flexberry-flexberry-user-setting', {});
      });
      assert.ok(model);
    });
  });
});
define('dummy/tests/unit/models/new-platform-flexberry-services-lock-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | new-platform-flexberry-services-lock', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var store = this.owner.lookup('service:store');
      var model = Ember.run(function () {
        return store.createRecord('new-platform-flexberry-services-lock', {});
      });
      assert.ok(model);
    });
  });
});
define('dummy/tests/unit/routes/application-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:application');
      assert.ok(route);
    });
  });
});
define('dummy/tests/unit/routes/edit-form-new-test', ['ember-flexberry/routes/edit-form-new', 'ember-flexberry-data/models/model', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (_editFormNew, _model, _qunit, _startApp, _destroyApp) {
  'use strict';

  var app = void 0;
  var getConfiguredTestRoute = function getConfiguredTestRoute(modelCurrentNotSaved, modelSelectedDetail) {
    var route = _editFormNew.default.create();

    var model = _model.default;
    model.defineProjection('testProjection', 'test-model');
    var detailInteractionServiceMock = Ember.Object.create({
      modelCurrentNotSaved: !Ember.isNone(modelCurrentNotSaved) && modelCurrentNotSaved ? model : null,
      modelSelectedDetail: !Ember.isNone(modelSelectedDetail) && modelSelectedDetail ? model : null
    });

    var store = app.__container__.lookup('service:store');
    app.register('model:test-model', model);

    route.set('store', store);
    route.set('modelName', 'test-model');
    route.set('prototypeProjection', 'testProjection');
    route.set('flexberryDetailInteractionService', detailInteractionServiceMock);

    return route;
  };

  (0, _qunit.module)('Unit | Route | edit form new', function (hooks) {
    hooks.beforeEach(function () {
      app = (0, _startApp.default)();
    });

    hooks.afterEach(function () {
      (0, _destroyApp.default)(app);
    });

    (0, _qunit.test)('it exists', function (assert) {
      var route = _editFormNew.default.create();
      assert.ok(route);
    });

    (0, _qunit.test)('return model as Promise main', function (assert) {
      var route = getConfiguredTestRoute();

      assert.ok(route);
      Ember.run(function () {
        var record = route.model({}, { queryParams: {} });
        assert.equal(record instanceof Ember.RSVP.Promise, true);
      });
    });

    (0, _qunit.test)('return model as Promise modelCurrentNotSaved', function (assert) {
      var route = getConfiguredTestRoute(true);

      assert.ok(route);
      Ember.run(function () {
        var record = route.model({}, { queryParams: {} });
        assert.equal(record instanceof Ember.RSVP.Promise, true);
      });
    });

    (0, _qunit.test)('return model as Promise modelSelectedDetail', function (assert) {
      var route = getConfiguredTestRoute(false, true);

      assert.ok(route);
      Ember.run(function () {
        var record = route.model({}, { queryParams: {} });
        assert.equal(record instanceof Ember.RSVP.Promise, true);
      });
    });

    (0, _qunit.test)('return model as Promise prototypeId', function (assert) {
      var route = getConfiguredTestRoute();

      assert.ok(route);
      Ember.run(function () {
        var record = route.model({}, { queryParams: { prototypeId: 'test-id' } });
        assert.equal(record instanceof Ember.RSVP.Promise, true);
      });
    });
  });
});
define('dummy/tests/unit/routes/edit-form-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | edit form', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:edit-form');
      assert.ok(route);
    });
  });
});
define('dummy/tests/unit/routes/list-form-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | list form', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:list-form');
      assert.ok(route);
    });
  });
});
define('dummy/tests/unit/routes/new-platform-flexberry-services-lock-list-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | new-platform-flexberry-services-lock-list', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:new-platform-flexberry-services-lock-list');
      assert.ok(route);
    });
  });
});
define('dummy/tests/unit/routes/projected-model-form-test', ['qunit', 'ember-qunit', 'ember-flexberry/routes/projected-model-form'], function (_qunit, _emberQunit, _projectedModelForm) {
  'use strict';

  (0, _qunit.module)('Unit | Route | projected model form', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = _projectedModelForm.default.create();
      assert.ok(route);
    });
  });
});
define('dummy/tests/unit/serializers/new-platform-flexberry-services-lock-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Serializer | new-platform-flexberry-services-lock', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it serializes records', function (assert) {
      var store = this.owner.lookup('service:store');
      var record = Ember.run(function () {
        return store.createRecord('new-platform-flexberry-services-lock', {});
      });
      var serializedRecord = record.serialize();

      assert.ok(serializedRecord);
    });
  });
});
define('dummy/tests/unit/services/app-state-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | app-state', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists and works', function (assert) {
      var service = this.owner.lookup('service:app-state');

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
});
define('dummy/tests/unit/services/compatibility-validations-test', ['qunit', 'ember-validations/validators/local/absence', 'ember-validations/validators/local/acceptance', 'ember-validations/validators/local/confirmation', 'ember-validations/validators/local/exclusion', 'ember-validations/validators/local/format', 'ember-validations/validators/local/inclusion', 'ember-validations/validators/local/length', 'ember-validations/validators/local/numericality', 'ember-validations/validators/local/presence', 'ember-flexberry/services/compatibility-validations', 'dummy/tests/helpers/start-app'], function (_qunit, _absence, _acceptance, _confirmation, _exclusion, _format, _inclusion, _length, _numericality, _presence, _compatibilityValidations, _startApp) {
  'use strict';

  var get = Ember.get;


  (0, _qunit.module)('Unit | Service | compatibility-validations', function () {
    (0, _qunit.test)('it works', function (assert) {
      var app = (0, _startApp.default)();
      var service = _compatibilityValidations.default.create(app.__container__.ownerInjection());
      var cache = get(service, 'cache');

      assert.ok(cache.absence === _absence.default);
      assert.ok(cache.acceptance === _acceptance.default);
      assert.ok(cache.confirmation === _confirmation.default);
      assert.ok(cache.exclusion === _exclusion.default);
      assert.ok(cache.format === _format.default);
      assert.ok(cache.inclusion === _inclusion.default);
      assert.ok(cache.length === _length.default);
      assert.ok(cache.numericality === _numericality.default);
      assert.ok(cache.presence === _presence.default);
    });
  });
});
define('dummy/tests/unit/services/detail-interaction-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | detail interaction', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var service = this.owner.lookup('service:detail-interaction');
      assert.ok(service);
    });
  });
});
define('dummy/tests/unit/services/device-test', ['qunit', 'ember-qunit', 'sinon', 'ember-flexberry/services/device'], function (_qunit, _emberQunit, _sinon, _device) {
  'use strict';

  /* eslint-disable-next-line qunit/no-global-module-test */ // https://github.com/platinumazure/eslint-plugin-qunit/issues/75
  (0, _qunit.module)('Unit | Service | device', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    hooks.beforeEach(function () {
      _sinon.default.stub(Ember, 'getOwner').returns({ application: { deviceService: {} } });
    });

    hooks.afterEach(function () {
      // eslint-disable-next-line ember/new-module-imports
      Ember.getOwner.restore();
    });

    /* eslint-disable-next-line qunit/no-global-module-test */
    (0, _qunit.test)('device service isMobile work', function (assert) {
      var service = _device.default.create();
      var fakeMobile = _sinon.default.fake.returns(true);
      service.mobile = fakeMobile;

      assert.ok(service.isMobile());
      assert.ok(fakeMobile.called);
    });

    /* eslint-disable-next-line qunit/no-global-module-test */
    (0, _qunit.test)('device service isDesktop work', function (assert) {
      var service = _device.default.create();
      var fakeDesktop = _sinon.default.fake.returns(true);
      service.desktop = fakeDesktop;

      assert.ok(service.isDesktop());
      assert.ok(fakeDesktop.called);
    });

    /* eslint-disable-next-line qunit/no-global-module-test */
    (0, _qunit.test)('device service isTablet work', function (assert) {
      var service = _device.default.create();
      var fakeTablet = _sinon.default.fake.returns(true);
      service.tablet = fakeTablet;

      assert.ok(service.isTablet());
      assert.ok(fakeTablet.called);
    });

    /* eslint-disable-next-line qunit/no-global-module-test */
    (0, _qunit.test)('device service isTv work', function (assert) {
      var service = _device.default.create();
      var fakeTv = _sinon.default.fake.returns(true);
      service.television = fakeTv;

      assert.ok(service.isTv());
      assert.ok(fakeTv.called);
    });

    /* eslint-disable-next-line qunit/no-global-module-test */
    (0, _qunit.test)('device service pathPrefixes work Desktop', function (assert) {
      var service = _device.default.create();
      var fakeDesktop = _sinon.default.fake.returns(true);
      service.desktop = fakeDesktop;

      var pathPrefixes = service.pathPrefixes(false);

      assert.equal(pathPrefixes.length, 0);
      assert.ok(fakeDesktop.called);
    });

    /* eslint-disable-next-line qunit/no-global-module-test */
    (0, _qunit.test)('device service pathPrefixes work Mobile', function (assert) {
      var service = _device.default.create();
      var fakeDesktop = _sinon.default.fake.returns(false);
      var fakeMobile = _sinon.default.fake.returns(true);
      var fakeTablet = _sinon.default.fake.returns(false);
      var fakeTv = _sinon.default.fake.returns(false);
      service.desktop = fakeDesktop;
      service.mobile = fakeMobile;
      service.tablet = fakeTablet;
      service.tv = fakeTv;

      var pathPrefixes = service.pathPrefixes(false);

      assert.equal(pathPrefixes.length, 1);
      assert.equal(pathPrefixes[0], 'mobile');
      assert.ok(fakeDesktop.called);
      assert.ok(fakeMobile.called);
    });

    /* eslint-disable-next-line qunit/no-global-module-test */
    (0, _qunit.test)('device service pathPrefixes work Tablet', function (assert) {
      var service = _device.default.create();
      var fakeDesktop = _sinon.default.fake.returns(false);
      var fakeMobile = _sinon.default.fake.returns(false);
      var fakeTablet = _sinon.default.fake.returns(true);
      var fakeTv = _sinon.default.fake.returns(false);
      service.desktop = fakeDesktop;
      service.mobile = fakeMobile;
      service.tablet = fakeTablet;
      service.tv = fakeTv;

      var pathPrefixes = service.pathPrefixes(false);

      assert.equal(pathPrefixes.length, 1);
      assert.equal(pathPrefixes[0], 'mobile');
      assert.ok(fakeDesktop.called);
      assert.ok(fakeTablet.called);
    });
  });
});
define('dummy/tests/unit/services/form-load-time-tracker-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | form load time tracker', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var service = this.owner.lookup('service:form-load-time-tracker');
      assert.ok(service);
    });
  });
});
define('dummy/tests/unit/services/log-test', ['ember-data', 'qunit', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app', 'dummy/config/environment'], function (_emberData, _qunit, _startApp, _destroyApp, _environment) {
  'use strict';

  var app = void 0; //TODO Import Module. Replace Ember.Logger, Ember.testing = false;

  var adapter = void 0;
  var saveModel = void 0;

  (0, _qunit.module)('Unit | Service | log', function (hooks) {
    hooks.beforeEach(function () {
      app = (0, _startApp.default)();

      adapter = Ember.Test.adapter;
      Ember.Test.adapter = null;
      Ember.testing = false;

      saveModel = _emberData.default.Model.prototype.save;
      _emberData.default.Model.prototype.save = function () {
        return Ember.RSVP.resolve(this);
      };
    });

    hooks.afterEach(function () {
      Ember.Test.adapter = adapter;
      Ember.testing = true;

      _emberData.default.Model.prototype.save = saveModel;

      (0, _destroyApp.default)(app);
    });

    (0, _qunit.skip)('error works properly', function (assert) {
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

    (0, _qunit.skip)('logService works properly when storeErrorMessages disabled', function (assert) {
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

    (0, _qunit.skip)('logService for error works properly when it\'s disabled', function (assert) {
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

    (0, _qunit.skip)('warn works properly', function (assert) {
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

    (0, _qunit.skip)('logService works properly when storeWarnMessages disabled', function (assert) {
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

    (0, _qunit.skip)('logService for warn works properly when it\'s disabled', function (assert) {
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

    (0, _qunit.skip)('log works properly', function (assert) {
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

    (0, _qunit.skip)('logService works properly when storeLogMessages disabled', function (assert) {
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

    (0, _qunit.skip)('logService for log works properly when it\'s disabled', function (assert) {
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

    (0, _qunit.skip)('info works properly', function (assert) {
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

    (0, _qunit.skip)('logService works properly when storeInfoMessages disabled', function (assert) {
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

    (0, _qunit.skip)('logService for info works properly when it\'s disabled', function (assert) {
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

    (0, _qunit.skip)('debug works properly', function (assert) {
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

    (0, _qunit.skip)('logService works properly when storeDebugMessages disabled', function (assert) {
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

    (0, _qunit.skip)('logService for debug works properly when it\'s disabled', function (assert) {
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

    (0, _qunit.skip)('deprecate works properly', function (assert) {
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

    (0, _qunit.skip)('logService works properly when storeDeprecationMessages disabled', function (assert) {
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

    (0, _qunit.skip)('logService for deprecate works properly when it\'s disabled', function (assert) {
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

    (0, _qunit.skip)('assert works properly', function (testAssert) {
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

    (0, _qunit.skip)('logService works properly when storeErrorMessages for assert disabled', function (testAssert) {
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

    (0, _qunit.skip)('logService for assert works properly when it\'s disabled', function (testAssert) {
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

    (0, _qunit.skip)('throwing exceptions logs properly', function (assert) {
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

    (0, _qunit.skip)('logService works properly when storeErrorMessages for throw disabled', function (assert) {
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

    (0, _qunit.skip)('logService for throw works properly when it\'s disabled', function (assert) {
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

    (0, _qunit.skip)('promise errors logs properly', function (assert) {
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

    (0, _qunit.skip)('logService works properly when storePromiseErrors disabled', function (assert) {
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

    (0, _qunit.skip)('logService for promise works properly when it\'s disabled', function (assert) {
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
});
define('dummy/tests/unit/services/objectlistview-events-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | objectlistview events', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var service = this.owner.lookup('service:objectlistview-events');
      assert.ok(service);
    });
  });
});
define('dummy/tests/unit/services/user-settings-test', ['qunit', 'sinon', 'ember-flexberry/services/user-settings'], function (_qunit, _sinon, _userSettings) {
  'use strict';

  (0, _qunit.module)('Unit | Service | userSettings', function (hooks) {
    hooks.beforeEach(function () {
      _sinon.default.stub(Ember, 'getOwner').returns({
        resolveRegistration: function resolveRegistration() {
          return { APP: { components: { flexberryObjectlistview: { defaultPerPage: 5 } } } };
        },

        factoryFor: function factoryFor() {
          return { class: { APP: {} } };
        }
      });
    });

    hooks.afterEach(function () {
      Ember.getOwner.restore();
    });

    (0, _qunit.test)('get the set perPage', function (assert) {
      var service = _userSettings.default.create();
      var fakeDBconnection = _sinon.default.fake.returns({ perPage: 11 }); // simulate input value
      service.getCurrentUserSetting = fakeDBconnection; //mocking getCurrentUserSetting()

      assert.equal(service.getCurrentPerPage(), 11, 'input PerPage value is correct');
    });

    (0, _qunit.test)('get the default perPage from user-settings', function (assert) {
      var service = _userSettings.default.create();
      var fakeDBconnection = _sinon.default.fake.returns(undefined); //no input value
      service.getCurrentUserSetting = fakeDBconnection;

      assert.equal(service.getCurrentPerPage(), 5, 'undefined PerPage value replaced with default');
    });
  });
});
define('dummy/tests/unit/utils/cut-string-by-length-test', ['dummy/utils/cut-string-by-length', 'qunit'], function (_cutStringByLength, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | cut string by length', function () {
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
});
define('dummy/tests/unit/utils/deserialize-sorting-param-test', ['dummy/utils/deserialize-sorting-param', 'qunit'], function (_deserializeSortingParam, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | deserialize sorting param', function () {
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
});
define('dummy/tests/unit/utils/get-attr-locale-key-test', ['dummy/utils/get-attr-locale-key', 'qunit'], function (_getAttrLocaleKey, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | get attr locale key', function () {
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
});
define('dummy/tests/unit/utils/get-current-agregator-test', ['qunit', 'dummy/tests/helpers/start-app', 'dummy/utils/get-current-agregator'], function (_qunit, _startApp, _getCurrentAgregator) {
  'use strict';

  var App = void 0;

  (0, _qunit.module)('Unit | Utility | get current agregator', function (hooks) {
    hooks.beforeEach(function () {
      App = (0, _startApp.default)();
    });

    hooks.afterEach(function () {
      Ember.run(App, 'destroy');
    });

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
});
define('dummy/tests/unit/utils/get-projection-by-name-test', ['dummy/utils/get-projection-by-name', 'qunit'], function (_getProjectionByName, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | get projection by name', function (hooks) {
    (0, _qunit.test)('it works', function (assert) {
      var store = {};
      store.modelFor = function () {
        return { projections: { testProjection: { success: true } } };
      };

      var result = (0, _getProjectionByName.default)('testProjection', 'testModel', store);
      assert.ok(result && result.success);
    });
  });
});
define('dummy/tests/unit/utils/need-save-current-agregator-test', ['qunit', 'dummy/tests/helpers/start-app', 'dummy/utils/need-save-current-agregator'], function (_qunit, _startApp, _needSaveCurrentAgregator) {
  'use strict';

  var App = void 0;

  (0, _qunit.module)('Unit | Utility | need save current agregator', function (hooks) {
    hooks.beforeEach(function () {
      App = (0, _startApp.default)();
      var offlineGlobals = App.__container__.lookup('service:offline-globals');
      offlineGlobals.setOnlineAvailable(false);
    });

    hooks.afterEach(function () {
      Ember.run(App, 'destroy');
    });

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
});
define('dummy/tests/unit/utils/run-after-test', ['qunit', 'ember-flexberry/utils/run-after'], function (_qunit, _runAfter) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | run-after', function () {
    (0, _qunit.test)('possible condition', function (assert) {
      var done = assert.async();

      var counter = 0;
      var condition = function condition() {
        return ++counter === 5;
      };

      (0, _runAfter.default)(null, condition, function () {
        assert.strictEqual(counter, 5, 'The \'condition\' is called five times.');
        done();
      });
    });

    (0, _qunit.test)('impossible condition', function (assert) {
      var onerror = Ember.onerror;
      var done = assert.async();

      var error = void 0;
      var counter = 0;
      var conditionCalled = false;
      Ember.onerror = function (e) {
        error = e;
      };

      (0, _runAfter.default)(null, function () {
        conditionCalled = true;
        throw new Error('Impossible condition.');
      }, function () {
        return ++counter;
      });

      (0, _runAfter.default)(null, function () {
        return conditionCalled;
      }, function () {
        Ember.onerror = onerror;

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

      (0, _runAfter.default)(context, condition, handler);
    });
  });
});
define('dummy/tests/unit/utils/serialize-sorting-param-test', ['dummy/utils/serialize-sorting-param', 'qunit'], function (_serializeSortingParam, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | serialize sorting param', function () {
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
});
define('dummy/tests/unit/utils/string-test', ['qunit', 'ember-flexberry/utils/string'], function (_qunit, _string) {
  'use strict';

  (0, _qunit.module)('Unit | Util | render-string', function () {
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
