import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import EditFormController from 'ember-flexberry/controllers/edit-form';

moduleForAcceptance('Acceptance | flexberry groupedit');

/*test('flexberry-grupedit editFormRoute test', function(assert) {

  visit('components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-form-route');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-form-route');

    wait().then(() => {

      let field = Ember.$('.field');

      // Opening edit form route.
      Ember.run(() => {
        $(field[0]).click();
      });

      let done = assert.async();
      setTimeout(function() {
        let tempTextHeader = Ember.$('.tempText');

        // Check correct opening edit form route.
        assert.strictEqual(tempTextHeader.text().trim(), 'Temp text for test', 'Component open current edit form route');
        done();
      }, 1000);
    });
  });
});

test('flexberry-grupedit editOnSeparateRoute test', function(assert) {

  visit('components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-on-separete-route');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-on-separete-route');

    wait().then(() => {

      let $field = Ember.$('.field');
      let $firstFild = $($field[0]);
      let $firstFildComponent = $firstFild.children('.flexberry-textbox');

      // Сheck availability of component in the field.
      assert.strictEqual($firstFildComponent.length === 1, true, 'Component editOnSeparateRoute currently work');
    });
  });
});*/

test('flexberry-grupedit saveBeforeRouteLeave on test', function(assert) {
  assert.expect(2);

    EditFormController.reopen({
      save: function(e) {
        assert.ok(true, 'Component stored data when opening the editing form.');
      }
    });

  visit('components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-save-before-route-on');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-save-before-route-on');

    wait().then(() => {

      let field = Ember.$('.field');

      // Opening edit form route.
      Ember.run(() => {
        $(field[0]).click();
      });

      let done = assert.async();
      setTimeout(function() {
        done();
      }, 100);
    });
  });
});

test('flexberry-grupedit saveBeforeRouteLeave off test', function(assert) {
  assert.expect(1);

    EditFormController.reopen({
      save: function(e) {
        assert.ok(false, 'Component stored data when opening the editing form, although it should not.');
      }
    });

  visit('components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-save-before-route-off');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-save-before-route-off');

    wait().then(() => {

      let field = Ember.$('.field');

      // Opening edit form route.
      Ember.run(() => {
        $(field[0]).click();
      });

      let done = assert.async();
      setTimeout(function() {
        done();
      }, 100);
    });
  });
});

/*test('flexberry-grupedit editOnSeparateRoute test', function(assert) {

  visit('components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-on-separete-route');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-on-separete-route');

    wait().then(() => {

      let $field = Ember.$('.field');
      let $firstFild = $($field[0]);
      let $firstFildComponent = $firstFild.children('.flexberry-textbox');

      // Сheck availability of component in the field.
      assert.strictEqual($firstFildComponent.length === 1, true, 'Component editOnSeparateRoute currently work');

      let done = assert.async();
      setTimeout(function() {
        let tempTextHeader = Ember.$('.tempText');

        // Check correct opening edit form route.
        assert.strictEqual(tempTextHeader.text().trim(), 'Temp text for test', 'Component open current edit form route');

        visit('components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-save-before-route');

        visit('components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-on-separete-route');

        let done1 = assert.async();
        setTimeout(function() {
          let tempTextHeader = Ember.$('.tempText');

          // Check correct opening edit form route.
          assert.strictEqual(tempTextHeader.text().trim(), 'Temp text for test', 'Component open current edit form route');

          done1();
        }, 1000);
        done();
      }, 1000);
    });
  });
});*/

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