import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingList} from './folv-tests-functions';

executeTest('column width custom', (store, assert, app) => {

  let path = 'i-i-s-caseberry-logging-objects-application-log-l';
  Ember.run(() => {
        let done = assert.async();
        visit(path);
        andThen(function() {
          assert.equal(currentPath(), path);
          let $defaultConfig = Ember.$('.remove.circle.icon');
          loadingList($defaultConfig[0], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
            assert.ok($list);
            let $configButton = Ember.$('.ui.button');
            let done1 = assert.async();

            // Loading config window
            loadingList($configButton[1], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
              assert.ok($list);

              // Retrieve component & it's inner <input>.
              let $component = Ember.$('.flexberry-checkbox.ui.checkbox');
              let $checkboxInput = $component.children('input');
              
              assert.equal($($component).hasClass('checked'), false, 'Width config is OFF');

              // In case, width config is OFF
              assert.equal($($component).hasClass('checked'), false, 'checkbox is not checked');
              $component.click();
              setTimeout(function() {
                assert.equal($($component).hasClass('checked'), true, 'Width config is ON');
                assert.equal($($component).hasClass('disabled'), false, 'Width values is ON');
                assert.equal($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after click');
                let $columnsTable = Ember.$('.ui.unstackable.fixed.selectable.celled.table').children('tbody#colsConfigtableRows').children();

                for (let i = 0; i < 14; i++) {

                  // If column is hidden, editing its width should be disabled
                  if ($columnsTable[i].cells[0].children[0].className === 'large hide icon') {
                    assert.equal($columnsTable[i].cells[5].className, 'disabled', 'Column is disabled');
                  }

                  Ember.$('input.columnWidth')[0].value = 50;
                }

                let done2 = assert.async();

                // Apply settings
                let $useBtn = Ember.$('.ui.button#columnConfigurtionButtonUse');
                loadingList($useBtn[0], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
                  assert.ok($list);
                  setTimeout(function() {
                    let done3 = assert.async();

                    //Open config window second time
                    loadingList($configButton[1], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
                    assert.ok($list);
                
                    let columns = Ember.$('.dt-head-left.me.class');
                    assert.equal(columns[0].offsetWidth, 70, 'Width is right');

                    // Retrieve component & it's inner <input>.
                    let $component = Ember.$('.flexberry-checkbox.ui.checkbox');
                    let $checkboxInput = $component.children('input');
                  
                    assert.equal($($component).hasClass('checked'), true, 'Width config is ON');

                    // In case, width config is ON
                    assert.equal($($component).hasClass('checked'), true, 'checkbox is checked');
                    $component.click();
                    setTimeout(function() {
                      assert.equal($($component).hasClass('checked'), false, 'Width config is OFF');
                      assert.equal($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> is not checked after click');                               

                      // Apply settings
                      let $useBtn = Ember.$('.ui.button#columnConfigurtionButtonUse');
                      let done4 = assert.async();
                      loadingList($useBtn[0], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
                        assert.ok($list);

                        setTimeout(function() {}, 17000);

                      }).catch((reason) => {
                        throw new Error(reason);

                      }).finally(() => {
                        done4();

                     });
                    }, 17000);     
                  }).catch((reason) => {
                    throw new Error(reason);
                  }).finally(() => {
                   done3();
                  });

                }, 17000);

                }).catch((reason) => {
                  throw new Error(reason);                 
                }).finally(() => {
                  done2();
                });
                  }, 500);

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
            assert.equal(columns[0].offsetWidth, 170, 'Width is default');
        });
      });
    });
});
