import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup autofillByLimit in readonly test', (store, assert, app) => {
  assert.expect(1);
  visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  andThen(function() {
    let $lookupFild = Ember.$('.isreadonly .lookup-field');
    let value = $lookupFild.val();
    assert.strictEqual(
      Ember.isBlank(value),
      true,
      'value is changes');
  });
});

executeTest('flexberry-lookup autofillByLimit is clean test', (store, assert, app) => {
  assert.expect(2);
  visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  andThen(function() {
    let $lookupFild = Ember.$('.isclean .lookup-field');
    let value = $lookupFild.val();
    assert.strictEqual(
      Ember.isBlank(value),
      false,
      'value is changes');


    Ember.run(() => {
      click('.isclean .ui-clear');
    });

    let $lookupFildUpdate = Ember.$('.isclean .lookup-field');
    let valueUpdate = $lookupFildUpdate.val();
    assert.strictEqual(
      Ember.isBlank(valueUpdate),
      true,
      'value is not clean');
  });
});

executeTest('flexberry-lookup autofillByLimit changes select value test', (store, assert, app) => {
  assert.expect(1);
  visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  andThen(function() {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let defaultValue = Ember.get(controller, 'defaultValue.name');

    let $lookupFild = Ember.$('.exist .lookup-field');
    let value = $lookupFild.val();

    assert.notEqual(
      defaultValue,
      value,
      'defaultValue: \'' + defaultValue + '\' don\'t change');
  });
});
