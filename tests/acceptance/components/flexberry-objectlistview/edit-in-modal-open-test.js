import { executeTest } from './execute-folv-test';
import $ from 'jquery';

executeTest('check edit in modal open', (store, assert, app) => { 
  assert.expect(3);
  const path = 'ember-flexberry-dummy-suggestion-list';
  visit(path);
  andThen(() => { 
    assert.equal(currentPath(), path);
    const row =  $('.field')[0];
    click(row);
    andThen(() => {
      let $editForm = $('.flexberry-modal');

      assert.ok($editForm, 'edit form open');
      assert.strictEqual($('.flexberry-modal .ui.header')[0].innerText, 'Предложение', 'check header');

      click('.close.icon');      
    });
  });
});
