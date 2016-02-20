import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import DS from 'ember-data';

moduleForComponent(
  'flexberry-validationmessage',
  'Integration | Component | flexberry validationmessage',
  {
    integration: true
  });

test('it renders', function (assert) {

  this.render(hbs`{{flexberry-validationmessage error='error sample'}}`);

  assert.equal(this.$().text().trim(), 'error sample');

  this.render(hbs`{{flexberry-validationmessage}}`);

  assert.equal(this.$().text().trim(), '');

});

test('it color property should pass to classes', function (assert) {

  this.render(hbs`{{flexberry-validationmessage color='someColor'}}`);

  assert.equal(this.$(':first-child').hasClass('someColor'), true);

});

test('it pointing property should pass to classes', function (assert) {

  this.render(hbs`{{flexberry-validationmessage pointing='left pointing'}}`);

  assert.equal(this.$(':first-child').hasClass('left pointing'), true);

});

test('it should throw exception on unknown pointing property', function (assert) {

  assert.throws(() => {
    this.render(hbs`{{flexberry-validationmessage pointing='some unknown pointing'}}`);
  });

});

test('it should change visibility based on error value', function (assert) {

  let errors = DS.Errors.create();
  this.set('error', errors.get('somefield'));
  this.render(hbs`{{flexberry-validationmessage error=error}}`);

  assert.equal(this.$(':first-child').is(':visible'), false);

  errors.add('somefield', 'somefield is invalid');
  this.set('error', errors.get('somefield'));

  assert.equal(this.$(':first-child').is(':visible'), true);
  
});
