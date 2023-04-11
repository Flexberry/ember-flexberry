import { typeOf } from '@ember/utils';
import { A } from '@ember/array';
import { module, test } from 'qunit';
import { render } from 'ember-flexberry/utils/string';

module('Unit | Util | render-string', function() {
  test('Util is function', function(assert) {
    assert.expect(1);

    assert.strictEqual(typeOf(render) === 'function', true, 'Imported \'render-string\' util is function');
  });

  test('Util returns null for calls with unexpected arguments', function(assert) {
    assert.expect(9);

    assert.strictEqual(render(), null, 'Returns null for calls without arguments');

    A([null, 1, true, false, {}, [], function() {}, new Date()]).forEach((wrongFirstArgument) => {
      assert.strictEqual(
        render(wrongFirstArgument),
        null,
        'Returns null for calls with first argument not of string type');
    });
  });

  test('Util returns same string for calls with unexpected render arguments', function(assert) {
    assert.expect(4);

    let stringWithTemplates = 'I have {{ one }} dollar in my wallet, {{ two }} apples in my bag, and {{ three }} hours of free time';
    assert.strictEqual(
      render(stringWithTemplates),
      stringWithTemplates,
      'Returns same string for calls without render options');

    assert.strictEqual(
      render(stringWithTemplates, { context: null }),
      stringWithTemplates,
      'Returns same string for calls without render context');

    assert.strictEqual(
      render(stringWithTemplates, { context: { 'ONE': 1, 'TWO': 2, 'THREE': 3 } }),
      stringWithTemplates,
      'Returns same string for calls with context without templates-related keys');

    assert.strictEqual(
      render(stringWithTemplates, { context: { 'one': 1, 'two': 2, 'three': 3 }, delimiters: ['<<', '>>'] }),
      stringWithTemplates,
      'Returns same string for calls with unexpected delimiters');
  });

  test('Util returns rendered string for calls with expected render arguments', function(assert) {
    assert.expect(2);

    let stringWithTemplatesAndDefaultDelimiters = 'I have {{ one }} dollar in my wallet, {{ two }} apples in my bag, and {{ three }} hours of free time';
    assert.strictEqual(
      render(stringWithTemplatesAndDefaultDelimiters, { context: { 'one': 1, 'two': 2, 'three': 3 } }),
      'I have 1 dollar in my wallet, 2 apples in my bag, and 3 hours of free time',
      'Returns rendered string for calls with default delimiters');

    let stringWithTemplatesAndCustomDelimiters = 'I have {% one %} dollar in my wallet, {% two %} apples in my bag, and {% three %} hours of free time';
    assert.strictEqual(
      render(stringWithTemplatesAndCustomDelimiters, { context: { 'one': 1, 'two': 2, 'three': 3 }, delimiters: ['{%', '%}'] }),
      'I have 1 dollar in my wallet, 2 apples in my bag, and 3 hours of free time',
      'Returns rendered string for calls with custom delimiters');
  });
});
