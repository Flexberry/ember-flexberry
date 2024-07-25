import $ from 'jquery';
import { executeTest } from './execute-flexberry-lookup-test';

/* eslint-disable no-unused-vars */
executeTest('visiting flexberry-lookup autocomplete', async (store, assert, app) => {
/* eslint-enable no-unused-vars */
  assert.expect(5);

  await visit('components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

  assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

  let $lookup = $('.flexberry-lookup');

  assert.strictEqual($lookup.hasClass('ui'), true, "Component's wrapper has 'ui' css-class");
  assert.strictEqual($lookup.hasClass('search'), true, "Component's wrapper has 'search' css-class");

  let $lookupField = $('.lookup-field');

  assert.strictEqual($lookupField.hasClass('prompt'), true, "Component's wrapper has 'prompt' css-class");

  let $result = $('.result');

  assert.strictEqual($result.length === 1, true, "Component has inner class 'result'");
});
