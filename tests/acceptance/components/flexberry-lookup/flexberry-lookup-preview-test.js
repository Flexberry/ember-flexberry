import $ from 'jquery';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup preview in modal test', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
  visit(path);

  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let testName = controller.testName;
    let $inModal = $('.in-modal');

    click('.ui-preview', $inModal).then(() => {
      let $modal = $('.modal');
      let $form = $('.form', $modal);
      let $field = $('.flexberry-field .flexberry-textbox', $form);
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
    let $inSeparateRoute = $('.in-separate-route');

    click('.ui-preview', $inSeparateRoute).then(() => {
      let $form = $('.form');
      let $field = $('.flexberry-field .flexberry-textbox', $form);
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
    let $inGroupedit = $('.in-groupedit');

    click('.ui-preview', $inGroupedit).then(() => {
      let $form = $('.form');
      let $field = $('.flexberry-field .flexberry-textbox', $form);
      let value = $field.children('input').val();
      assert.equal(value, testName);
    });
  });
});
