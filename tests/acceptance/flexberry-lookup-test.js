import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | flexberry lookup');

test('visiting flexberry-lookup', function(assert) {
  visit('acceptance-tests/flexberry-lookup/settings-example');

  andThen(function() {
    assert.equal(currentURL(), 'acceptance-tests/flexberry-lookup/settings-example');
  });
});

test('visiting flexberry-lookup', function(assert) {
  visit('acceptance-tests/flexberry-lookup/settings-example');

  andThen(function() {

    /*let $component = this.$().children('div .ember-view.flexberry-lookup');
    let $lookupFluid = $component.children('.fluid');*/
    let $lookupButtouChoose = Ember.$('.lookup-choose-button');
    //let $lookupButtouClear = $lookupFluid.children('.lookup-clear-button');

    assert.equal(currentURL(), 'acceptance-tests/flexberry-lookup/settings-example');

    // Try to expand component.
    Ember.run(() => {
      $lookupButtouChoose.click();
    });

    // Wait for collapse animation to be completed & check component's state.
    var done = assert.async();
    Ember.run(() => {
      setTimeout(function() {
      	let $modal= Ember.$('.flexberry-modal');
        assert.strictEqual($modal.length === 1, true, 'Component has flexberry-modal block');
        done();
    }, 5000);

  });

  });
});


