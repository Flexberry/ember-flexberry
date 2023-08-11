import $ from 'jquery';
import { executeTest } from './execute-folv-test';
import { run } from '@ember/runloop';
import wait from 'ember-test-helpers/wait';

executeTest('check toolbar custom components', (store, assert) => {
  assert.expect(8);
  const path = 'components-examples/flexberry-objectlistview/toolbar-custom-components-example';

  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path, 'Path is correct');

    let $toolbar = $('.flexberry-olv-toolbar');
    let $dropdown = $toolbar.children('.flexberry-dropdown');
    let $text = $dropdown.children('.text');
    let $menu = $dropdown.children('div.menu');
    let $items = $menu.children();

    assert.equal($dropdown.length, 1, 'Dropdown is render');
    assert.equal($text[0].innerText, 'Enum value №1', 'Dropdown is render');

    andThen(() => {
      run(() => $dropdown.click());

      assert.equal($items[0].innerText, 'Enum value №1', 'Dropdown list menu is rendered');
      assert.equal($($items[0]).hasClass('active selected'), true, 'Selected dropdown list item has the css-class \'active\'');

      run(() => $($items[5]).click());

      wait().then(() => {
        $dropdown = $toolbar.children('.flexberry-dropdown');
        $text = $dropdown.children('.text');

        assert.equal($text[0].innerText, 'Enum value №6', 'Text in the dropdown list has changed');
      
        run(() => $dropdown.click());

        wait().then(() => {
          $menu = $dropdown.children('div.menu');
          $items = $menu.children();

          assert.equal($items[5].innerText, 'Enum value №6', 'Dropdown list menu is rendered');
          assert.equal($($items[5]).hasClass('active selected'), true, 'Selected dropdown list item has the css-class \'active\'');
        });
      });
    });
  });
});
