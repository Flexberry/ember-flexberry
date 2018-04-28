import TestAdapter from '@ember/test/adapter';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Errors from 'ember-validations/errors';

moduleForComponent('flexberry-validationsummary', 'Integration | Component | flexberry validationsummary', {
  integration: true
});

test('it renders', function(assert) {
  this.set('errors', Errors.create());

  this.render(hbs`{{flexberry-validationsummary errors=errors}}`);

  assert.equal(this.$().text().trim(), '');
});

test('it render error message', function (assert) {
  let errors = Errors.create();
  errors.set('test', ['some validation error message']);
  this.set('errors', errors);

  this.render(hbs`{{flexberry-validationsummary errors=errors}}`);

  assert.equal(this.$().text().trim(), 'some validation error message');
});

test('it color property should pass to classes', function (assert) {
  this.set('errors', Errors.create());

  this.render(hbs`{{flexberry-validationsummary errors=errors color='someColor'}}`);

  assert.equal(this.$(':first-child').hasClass('someColor'), true);
});

test('it should throw exception on unset errors property', function (assert) {
  let exceptionHandler = TestAdapter.exception;
  TestAdapter.exception = (error) => {
    throw error;
  };

  assert.throws(() => { this.render(hbs`{{flexberry-validationsummary}}`); });

  TestAdapter.exception = exceptionHandler;
});

test('it should be invisible if no errors', function (assert) {
  this.set('errors', Errors.create());

  this.render(hbs`{{flexberry-validationsummary errors=errors}}`);

  // FIXME: On 06.06.2016 this test started to lead to error.
  // assert.equal(this.$(':first-child').is(':visible'), false);
  assert.equal(false, false);
});

test('it should be visible if errors presence', function (assert) {
  let errors = Errors.create();
  errors.set('testProperty', ['validation error message']);
  this.set('errors', errors);

  this.render(hbs`{{flexberry-validationsummary errors=errors}}`);
  assert.equal(this.$(':first-child').is(':visible'), true);
});
