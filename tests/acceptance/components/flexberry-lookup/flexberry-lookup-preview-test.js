import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup preview in modal test', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
  visit(path);

  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let testName = controller.testName;
    let $inModal = Ember.$('.in-modal');

    click('.preview-button', $inModal).then(() => {
      let $modal = Ember.$('.modal');
      let $form = Ember.$('.form', $modal);
      let $field = Ember.$('.flexberry-field .flexberry-textbox', $form);
      let value = $field.children('input').val();
      assert.equal(value, testName);
    });

  });
});

executeTest('flexberry-lookup preview in separate route test', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
  visit(path);

  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let testName = controller.testName;
    let $inSeparateRoute = Ember.$('.in-separate-route');

    click('.preview-button', $inSeparateRoute).then(() => {
      let $form = Ember.$('.form');
      let $field = Ember.$('.flexberry-field .flexberry-textbox', $form);
      let value = $field.children('input').val();
      assert.equal(value, testName);
    });
  });
});

executeTest('flexberry-lookup preview in groupedit test', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
  visit(path);

  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let testName = controller.testName;
    let $inGroupedit = Ember.$('.in-groupedit');

    click('.preview-button', $inGroupedit).then(() => {
      let $form = Ember.$('.form');
      let $field = Ember.$('.flexberry-field .flexberry-textbox', $form);
      let value = $field.children('input').val();
      assert.equal(value, testName);
    });
  });
});
