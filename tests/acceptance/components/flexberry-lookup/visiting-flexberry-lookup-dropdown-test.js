import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('visiting flexberry-lookup dropdown', (store, assert, app) => {
  assert.expect(13);

  visit('components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

  andThen(function() {

    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

    // Retrieve component, it's inner <input>.
    let $lookupSearch = Ember.$('.lookup-field');
    let $lookupButtonChoose = Ember.$('.ui-change');
    let $lookupButtonClear = Ember.$('.lookup-remove-button');

    assert.strictEqual($lookupSearch.length === 0, true, 'Component has n\'t flexberry-lookup');
    assert.strictEqual($lookupButtonChoose.length === 0, true, 'Component has n\'t button choose');
    assert.strictEqual($lookupButtonClear.length === 0, true, 'Component has n\'t button remove');

    // Retrieve component, it's inner <input>.
    let $dropdown = Ember.$('.flexberry-dropdown.search.selection');
    let $dropdownSearch = $dropdown.children('.search');
    let $dropdownIcon = $dropdown.children('.dropdown.icon');
    let $dropdownMenu = $dropdown.children('.menu');
    let $deopdownText = $dropdown.children('.text');

    assert.strictEqual($dropdown.length === 1, true, 'Component has class flexberry-dropdown');
    assert.strictEqual($dropdown.hasClass('search'), true, 'Component\'s wrapper has \'search\' css-class');
    assert.strictEqual($dropdown.hasClass('selection'), true, 'Component\'s wrapper has \'selection\' css-class');
    assert.strictEqual($dropdown.hasClass('ember-view'), true, 'Component\'s wrapper has \'ember-view\' css-class');
    assert.strictEqual($dropdown.hasClass('dropdown'), true, 'Component\'s wrapper has \'dropdown\' css-class');

    assert.strictEqual($dropdownSearch.length === 1, true, 'Component has class search');

    assert.strictEqual($dropdownIcon.length === 1, true, 'Component has class dropdown and icon');

    assert.strictEqual($deopdownText.length === 1, true, 'Component has class text');

    assert.strictEqual($dropdownMenu.length === 1, true, 'Component has class menu');

  });
});
