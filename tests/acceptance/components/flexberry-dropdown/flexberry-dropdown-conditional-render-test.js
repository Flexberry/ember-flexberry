import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, currentURL, find, click, settled } from '@ember/test-helpers';

const path = 'components-examples/flexberry-dropdown/conditional-render-example';
const testName = 'conditional render test';

module('Acceptance | flexberry-dropdown | ' + testName, function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    // Enable acceptance test mode in application controller.
    let applicationController = this.owner.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);
  });

  test(testName, async function (assert) {
    assert.expect(5);

    await visit(path);
    assert.equal(currentURL(), path, 'Path is correctly');

    // Проверяем наличие выпадающего списка
    let $dropdown = find('.flexberry-dropdown');
    assert.ok($dropdown, 'Dropdown is rendered');

    // Ждем, пока все асинхронные операции завершатся
    await settled();

    await click($dropdown); // Кликаем по кнопке для открытия выпадающего списка

    // Ждем, пока элементы выпадающего списка отобразятся
    await settled();

    // Проверяем наличие элемента в выпадающем списке
    let dropdownItem = find('.flexberry-dropdown .item');
    assert.equal(dropdownItem.textContent, 'Enum value №1', 'Dropdown item "Enum value №1" is rendered');

    await click(dropdownItem); // Кликаем по элементу выпадающего списка

    // Ждем, пока выпадающий список исчезнет
    await settled();

    $dropdown = find('.flexberry-dropdown');
    assert.notOk($dropdown, 'Dropdown isn\'t rendered');

    let $span = find('div.field span');
    assert.equal($span.textContent.trim(), 'Enum value №1', 'Span is rendered');
  });
});
