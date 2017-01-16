import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | flexberry lookup ');

test('flexberry-lookup open flexberry-modal test', function(assert) {
  assert.expect(3);

  visit('components-acceptance-tests/flexberry-lookup/settings-example');

  andThen(function() {

    let expandAnimationCompleted = new Ember.RSVP.Promise((resolve, reject) => {

      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example');

      let $lookupButtouChoose = Ember.$('.lookup-choose-button');

      Ember.run(() => {
        $lookupButtouChoose.click();
      });

      Ember.run(() => {
        var done = assert.async();
        setTimeout(function() {

          let $modal = Ember.$('.flexberry-modal');
          let $modalHeader = Ember.$('.header');

          assert.strictEqual($modal.length === 1, true, 'Component open flexberry-modal block');
          assert.strictEqual($modalHeader.text().trim(), 'Temp title', 'Component flexberry-modal has title');

          //First record name
          //let $records = Ember.$('.content table.object-list-view tbody tr');
          //let $record = Ember.$($records[0]);
          //let $recordFirstCell = Ember.$(Ember.$('td', $record)[1]);
          //assert.strictEqual($recordFirstCell.text().trim(), 'per', 'LimitFunction works correctly');

          done();
          resolve();
        }, 1000);
      });
    });

    expandAnimationCompleted.then(() => {
      Ember.run(() => {
        let $modalCloseIcon = Ember.$('.close.icon');
        $modalCloseIcon.click();
      });

      Ember.run(() => {
        var endClose = assert.async();
        setTimeout(function() { endClose(); }, 1000);
      });
    });
  });
});

test('visiting flexberry-lookup autocomplete', function(assert) {
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

test('visiting flexberry-lookup dropdown', function(assert) {
  assert.expect(13);

  visit('components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

  andThen(function() {

    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-dropdown');

    // Retrieve component, it's inner <input>.
    let $lookupSearch = Ember.$('.lookup-field');
    let $lookupButtonChoose = Ember.$('.lookup-choose-button');
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
