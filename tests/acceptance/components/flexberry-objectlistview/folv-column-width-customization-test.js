import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingList} from './folv-tests-functions';

executeTest('column width custom', (store, assert, app) => {

  let path = 'ember-flexberry-dummy-suggestion-list';
  Ember.run(() => {
    let done = assert.async();
    visit(path);
    andThen(function() {
      assert.equal(currentPath(), path);
      let $defaultConfig = Ember.$('.remove.circle.icon');
      loadingList($defaultConfig[0], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
        assert.ok($list);
        let $configButton = Ember.$('.ui.button')[6];
        let done1 = assert.async();

        // Loading config window
        loadingList($configButton, '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
          assert.ok($list);

          // Retrieve component & it's inner <input>.
          let $component = Ember.$('.flexberry-checkbox.ui.checkbox');

          assert.ok($($component).hasClass('checked'), true, 'Width config is ON');
          assert.notOk($($component).hasClass('disabled'), true, 'Width values is ON');

          let $columnsTable = Ember.$('.ui.unstackable.fixed.selectable.celled.table').children('tbody#colsConfigtableRows').children();
          for (let i = 0; i < 10; i++) {

            // If column is hidden, editing its width should be disabled
            if ($columnsTable[i].children[0].children[0].className === 'large hide icon') {
              assert.equal($columnsTable[i].cells[5].children[0].className, 'ui input disabled', 'Column is disabled');
            }

            if ($columnsTable[i].children[0].children[0].className === 'large unhide icon') {
              assert.equal($columnsTable[i].cells[5].children[0].className, 'ui input ', 'Column is not disabled');
            }
          }

          Ember.$('input.columnWidth')[0].value = 50;
          let done2 = assert.async();

          // Apply settings
          let $useBtn = Ember.$('.ui.button#columnConfigurtionButtonUse');
          loadingList($useBtn[0], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
            assert.ok($list);
            setTimeout(function() {
              let done3 = assert.async();

              //Open config window second time
              loadingList($configButton, '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
                assert.ok($list);

                let columns = Ember.$('.dt-head-left.me.class');
                assert.equal(columns[0].offsetWidth, 70, 'Width is right');

                // Retrieve component & it's inner <input>.
                let $component = Ember.$('.flexberry-checkbox.ui.checkbox');
                let $checkboxInput = Ember.$('.flexberry-checkbox.ui.checkbox').children('input');

                assert.equal($($component).hasClass('checked'), true, 'Width config is ON');

                // In case, width config is ON
                assert.equal($($component).hasClass('checked'), true, 'checkbox is checked');
                click($component[5]);
                setTimeout(function() {
                  assert.equal($component[5].className === 'toggle ember-view flexberry-checkbox ui checkbox', true, 'Width config is OFF');
                  assert.equal($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> is not checked after click');

                  // Apply settings
                  let $useBtn = Ember.$('.ui.button#columnConfigurtionButtonUse');
                  done3();
                  let done4 = assert.async();
                  setTimeout(function() {
                    loadingList($useBtn[0], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
                      assert.ok($list);
                    }).catch((reason) => {
                      throw new Error(reason);
                    }).finally(() => {
                      done4();
                    });
                  }, 500);
                }, 500);
              }).catch((reason) => {
                throw new Error(reason);
              }).finally(() => {
                done2();
              });
            }, 500);
          }).catch((reason) => {
            throw new Error(reason);
          }).finally(() => {
          });
        }).catch((reason) => {
          throw new Error(reason);
        }).finally(() => {
          done1();
        });
      }).catch((reason) => {
        throw new Error(reason);
      }).finally(() => {
        done();
        let columns = Ember.$('.dt-head-left.me.class');
        assert.equal(columns[0].offsetWidth, 180, 'Width is default');
      });
    });
  });
});
