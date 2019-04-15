import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup autofillByLimit in readonly test', (store, assert, app) => {
  assert.expect(1);
  visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  andThen(function() {
    let $lookupFeild = Ember.$('.isreadonly .lookup-field');
    let value = $lookupField.val();
    assert.ok(Ember.isBlank(value), 'Value was changed');
  });
});

executeTest('flexberry-lookup autofillByLimit is clean test', (store, assert, app) => {
  assert.expect(2);
  visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  andThen(function() {
    let $lookupField = Ember.$('.isclean .lookup-field');
    let value = $lookupField.val();
    assert.notOk(Ember.isBlank(value), 'Value wasn\'t changed');

    Ember.run(() => {
      click('.isclean .ui-clear');
    });

    let $lookupFieldUpdate = Ember.$('.isclean .lookup-field');
    let valueUpdate = $lookupFieldUpdate.val();
    assert.ok(Ember.isBlank(valueUpdate), 'Value isn\'t empty');
  });
});

executeTest('flexberry-lookup autofillByLimit changes select value test', (store, assert, app) => {
  assert.expect(1);
  visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  andThen(function() {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let defaultValue = Ember.get(controller, 'defaultValue.name');

    let $lookupField = Ember.$('.exist .lookup-field');
    let value = $lookupField.val();

    assert.notEqual(
      defaultValue,
      value,
      'DefaultValue: \'' + defaultValue + '\' didn\'t change');
  });
});
