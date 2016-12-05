import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | flexberry groupedit');

test('visiting flexberry-groupedit', function(assert) {
  assert.expect(1);

  visit('components-acceptance-tests/flexberry-groupedit/settings-example');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-groupedit/settings-example');
  });
});
