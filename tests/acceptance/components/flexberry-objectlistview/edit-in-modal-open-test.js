import { executeTest } from './execute-folv-test';
import $ from 'jquery';
import { get } from '@ember/object';
import RuLocale from 'dummy/locales/ru/translations';

executeTest('check edit in modal open', (store, assert) => { 
  assert.expect(3);
  const path = 'ember-flexberry-dummy-suggestion-type-list';
  visit(path);
  andThen(() => { 
    assert.equal(currentPath(), path);
    const row =  $('.field')[0];
    click(row);
    andThen(() => {
      let $editForm = $('.flexberry-modal');

      assert.ok($editForm, 'edit form open');
      assert.strictEqual($('.flexberry-modal .ui.header')[0].innerText, get(RuLocale, 'forms.ember-flexberry-dummy-suggestion-type-edit.caption'), 'check header');

      click('.close.icon');
    });
  });
});
