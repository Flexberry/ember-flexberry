import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | flexberry groupedit');

test('visiting flexberry-groupedit', function(assert) {

  visit('components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test');

    wait().then(() => {

      let $button = Ember.$('.button');
      $button = $($button[0]);

      let field = Ember.$('.field');

      Ember.run(() => {
        $(field[0]).click();
      });

      let done = assert.async();
      setTimeout(function() {
        let tempTextHeader = Ember.$('.tempText');
        assert.strictEqual(tempTextHeader.text().trim(), 'Temp text for test', 'Component open current edit form route');
        done();
      }, 1000);
    });
  });
});

// Проверка изменение значение при входе в дочерний детейл
// Проверка создания дочерних детейлов

/*test('visiting flexberry-groupedit', function(assert) {

  visit('components-acceptance-tests/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit');

    wait().then(() => {

      let $button = Ember.$('.button');
      $button = $($button[0]);

      Ember.run(() => {
        $button.click();
      });

      wait().then(() => {

        $button = Ember.$('.button');
        $button = $($button[5]);

        Ember.run(() => {
          $button.click();
        });

        wait().then(() => {
          assert.ok(true);
        });
    });
    });
  });
});*/