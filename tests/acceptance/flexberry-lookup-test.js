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

    let $component = this.$().children();
    let $lookupFluid = $component.children('.fluid');
    let $lookupButtouChoose = $lookupFluid.children('.lookup-choose-button');
    let $lookupButtouClear = $lookupFluid.children('.lookup-clear-button');

    assert.equal(currentURL(), 'acceptance-tests/flexberry-lookup/settings-example');
  });
});


