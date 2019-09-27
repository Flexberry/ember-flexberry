import $ from 'jquery';
import { isBlank } from '@ember/utils';
import { run } from '@ember/runloop';
import { get } from '@ember/object';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup autofillByLimit in readonly test', (store, assert) => {
  assert.expect(1);
  visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  andThen(function() {
    let $lookupField = $('.isreadonly .lookup-field');
    let value = $lookupField.val();
    assert.ok(isBlank(value), 'Value was changed');
  });
});

executeTest('flexberry-lookup autofillByLimit is clean test', (store, assert) => {
  assert.expect(2);
  visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  andThen(function() {
    let $lookupField = $('.isclean .lookup-field');
    let value = $lookupField.val();
    assert.notOk(isBlank(value), 'Value wasn\'t changed');

    run(() => {
      click('.isclean .ui-clear');
      andThen(function() {
        let $lookupFieldUpdate = $('.isclean .lookup-field');
        let valueUpdate = $lookupFieldUpdate.val();
        assert.ok(isBlank(valueUpdate), 'Value isn\'t empty');
      });
    });
  });
});

executeTest('flexberry-lookup autofillByLimit changes select value test', (store, assert, app) => {
  assert.expect(1);
  visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  andThen(function() {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let defaultValue = get(controller, 'defaultValue.id');

    let $lookupField = $('.exist .lookup-field');
    let value = $lookupField.val();

    assert.notEqual(
      defaultValue,
      value,
      'DefaultValue: \'' + defaultValue + '\' didn\'t change');
  });
});
