import $ from 'jquery';
import { executeTest } from './execute-flexberry-lookup-test';

/* eslint-disable no-unused-vars */
executeTest('visiting flexberry-lookup dropdown', async (store, assert, app) => {
/* eslint-enable no-unused-vars */
  assert.expect(13);

  await visit('components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

  assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

  // Получение компонентов и их внутренних элементов.
  let $lookupSearch = $('.lookup-field');
  let $lookupButtonChoose = $('.ui-change');
  let $lookupButtonClear = $('.lookup-remove-button');

  assert.strictEqual($lookupSearch.length === 0, true, "Component hasn't flexberry-lookup");
  assert.strictEqual($lookupButtonChoose.length === 0, true, "Component hasn't button choose");
  assert.strictEqual($lookupButtonClear.length === 0, true, "Component hasn't button remove");

  // Получение компонентов и их внутренних элементов.
  let $dropdown = $('.flexberry-dropdown.search.selection');
  let $dropdownSearch = $dropdown.children('.search');
  let $dropdownIcon = $dropdown.children('.dropdown.icon');
  let $dropdownMenu = $dropdown.children('.menu');
  let $dropdownText = $dropdown.children('.text');

  assert.strictEqual($dropdown.length === 1, true, 'Component has class flexberry-dropdown');
  assert.strictEqual($dropdown.hasClass('search'), true, "Component's wrapper has 'search' css-class");
  assert.strictEqual($dropdown.hasClass('selection'), true, "Component's wrapper has 'selection' css-class");
  assert.strictEqual($dropdown.hasClass('ember-view'), true, "Component's wrapper has 'ember-view' css-class");
  assert.strictEqual($dropdown.hasClass('dropdown'), true, "Component's wrapper has 'dropdown' css-class");

  assert.strictEqual($dropdownSearch.length === 1, true, 'Component has class search');
  assert.strictEqual($dropdownIcon.length === 1, true, 'Component has class dropdown and icon');
  assert.strictEqual($dropdownText.length === 1, true, 'Component has class text');
  assert.strictEqual($dropdownMenu.length === 1, true, 'Component has class menu');
});
