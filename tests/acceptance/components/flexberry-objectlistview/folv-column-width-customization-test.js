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
                
                for (let i=0; i<14; i++){

                  // If column is hidden, editing its width should be disabled              
                  if ($columnsTable[i].cells[0].children[0].className === 'large hide icon'){
                    assert.equal($columnsTable[i].cells[5].className, 'disabled', 'Column is disabled');
                  }

                  // If column is visible, editing its wide is enabled
                  if ($columnsTable[i].cells[0].children[0].className === 'large unhide icon'){
                    assert.equal($columnsTable[i].cells[5].className, '', 'Column is not disabled');
                    Ember.$('input.columnWidth')[0].value=50;
                  }
                }            

                // Apply settings
                let $useBtn = Ember.$('.ui.button#columnConfigurtionButtonUse');
                loadingList($useBtn[0], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
                  assert.ok($list);
                  setTimeout(function() {    

                    //Open config window second time
                  loadingList($configButton[1], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
                  assert.ok($list);
                
                    let columns = Ember.$('.dt-head-left.me.class');
                    for (let j=0; j<columns.length; j++){
                      assert.equal(columns[0].offsetWidth, 70, 'Width is right');
                    }

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
                    loadingList($useBtn[0], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
                      assert.ok($list);
                      
                      setTimeout(function() {    
                        columns = Ember.$('.dt-head-left.me.class');
                        for (let j=0; j<columns.length; j++){
                          assert.equal(columns[0].offsetWidth, 170, 'Width is default');
                        }
                      }, 16000);
                      
                    }).catch((reason) => {
                      throw new Error(reason);
                     
                    }).finally(() => {              
                      done();
                  });                  
                    }, 16000);                        
                      }).catch((reason) => {
                    throw new Error(reason);
                }).finally(() => {
                  
                });

                  }, 16000);
                  
                }).catch((reason) => {
                  throw new Error(reason);
                 
                }).finally(() => {              
                
                });            
                  }, 500);

                  }).catch((reason) => {
                throw new Error(reason);
            }).finally(() => {
              
            });
          }).catch((reason) => {
            throw new Error(reason);
          }).finally(() => {
 
        });
      });      
    });  
});
