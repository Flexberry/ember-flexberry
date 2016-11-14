import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | flexberry lookup');

test('visiting /flexberry-lookup', function(assert) {
  visit('acceptance-tests/flexberry-lookup/settings-example');

  andThen(function() {
    assert.equal(currentURL(), 'acceptance-tests/flexberry-lookup/settings-example');
  });
});
