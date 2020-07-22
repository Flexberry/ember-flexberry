import getAttrLocaleKey from 'dummy/utils/get-attr-locale-key';
import { module, test } from 'qunit';

module('Unit | Utility | get attr locale key');

test('get key', function(assert) {
  let mainModelName = 'ember-flexberry-dummy-suggestion';
  let projectionName = 'SuggestionE';
  let bindingPath = 'address';
  let result = getAttrLocaleKey(mainModelName, projectionName, bindingPath);
  assert.equal(result, `models.${mainModelName}.projections.${projectionName}.${bindingPath}.__caption__`);
});

test('get key with relationship', function(assert) {
  let mainModelName = 'ember-flexberry-dummy-suggestion';
  let projectionName = 'SuggestionE';
  let bindingPath = 'address';
  let relationship = 'type';
  let result = getAttrLocaleKey(mainModelName, projectionName, bindingPath, relationship);
  assert.equal(result, `models.${mainModelName}.projections.${projectionName}.${relationship}.${bindingPath}.__caption__`);
});
