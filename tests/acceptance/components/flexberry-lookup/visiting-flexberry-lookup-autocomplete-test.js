import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('visiting flexberry-lookup autocomplete', (store, assert, app) => {
  assert.expect(5);

  visit('components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

  andThen(function() {

    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');

    let $lookup = Ember.$('.flexberry-lookup');

    assert.strictEqual($lookup.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($lookup.hasClass('search'), true, 'Component\'s wrapper has \'search\' css-class');

    let $lookupField = Ember.$('.lookup-field');

    assert.strictEqual($lookupField.hasClass('prompt'), true, 'Component\'s wrapper has \'prompt\' css-class');

    let $result = Ember.$('.result');

    assert.strictEqual($result.length === 1, true, 'Component has inner class \'result\'');
  });
});
