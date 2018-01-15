import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import EditFormController from 'ember-flexberry/controllers/edit-form';

moduleForAcceptance('Acceptance | flexberry groupedit');

test('flexberry-grupedit editOnSeparateRoute test', function(assert) {
  let path = 'components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-on-separete-route';
  visit(path);
  andThen(function() {
    assert.equal(currentURL(), path);

    let done = assert.async();
    setTimeout(function() {

      let $field = Ember.$('.field');
      let $firstFild = $($field[0]);
      let $firstFildComponent = $firstFild.children('.flexberry-textbox');

      // Сheck availability of component in the field.
      assert.strictEqual($firstFildComponent.length === 1, true, 'Component editOnSeparateRoute currently work');
      done();
    }, 1000);
  });
});

test('flexberry-grupedit saveBeforeRouteLeave on test', function(assert) {
  assert.expect(2);

  EditFormController.reopen({
    save: function(e) {
      assert.ok(true, 'Component stored data when opening the editing form.');
    }
  });

  let path = 'components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-save-before-route-on';
  visit(path);
  andThen(function() {
    assert.equal(currentURL(), path);

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

  let path = 'components-acceptance-tests/flexberry-groupedit/flexberry-groupedit-test-save-before-route-off';
  visit(path);
  andThen(function() {
    assert.equal(currentURL(), path);

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
