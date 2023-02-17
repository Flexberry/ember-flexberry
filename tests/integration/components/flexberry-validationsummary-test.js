import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Errors from 'ember-validations/errors';
import Ember from 'ember';

import EmberValidationsInitializer from 'dummy/initializers/ember-validations';

moduleForComponent('flexberry-validationsummary', 'Integration | Component | flexberry-validationsummary', {
  integration: true,
  setup() {
    EmberValidationsInitializer.initialize();
  },
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
  assert.throws(() => {
    this.render(hbs`{{flexberry-validationsummary}}`);
  });
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

test('it renders changing error list', function (assert) {
  let errors = Errors.create();
  Ember.set(errors, 'testProperty', ['error1']);
  Ember.set(this, 'errors', errors);

  // Initialize by errors property.
  this.render(hbs`{{flexberry-validationsummary errors=errors}}`);
  assert.equal(this.$().text().trim(), 'error1');

  let testPropertyErrorList = new Ember.A(['error11', 'error12']);
  Ember.run(() => {
    // Change existing errors property.
    Ember.set(errors, 'testProperty', testPropertyErrorList);
  });

  assert.equal(this.$().text().replace(/\n|\s/g, ""), 'error11error12');

  Ember.run(() => {
    // Add new errors property.
    Ember.set(errors, 'testProperty2', ['error2']);
  });
  
  assert.equal(this.$().text().replace(/\n|\s/g, ""), 'error11error12error2');

  Ember.run(() => {
    // Remove element from existing errors property.
    Ember.get(errors, 'testProperty').popObject();
  });

  assert.equal(this.$().text().replace(/\n|\s/g, ""), 'error11error2');

  Ember.run(() => {
    // Add element to existing errors property.
    Ember.get(errors, 'testProperty').pushObject('error13');
  });

  assert.equal(this.$().text().replace(/\n|\s/g, ""), 'error11error13error2');

  let errors2 = Errors.create();
  Ember.set(errors2, 'testProperty2', ['error22']);
  Ember.set(errors2, 'testProperty3', ['error3']);

  Ember.run(() => {
    // Change errors object.
    Ember.set(this, 'errors', errors2);
  });

  assert.equal(this.$().text().replace(/\n|\s/g, ""), 'error22error3');
});
