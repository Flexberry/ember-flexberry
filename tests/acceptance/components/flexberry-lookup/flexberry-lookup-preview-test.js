import $ from 'jquery';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup preview in modal test', async (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
  await visit(path);

  assert.equal(currentPath(), path);

  let controller = app.__container__.lookup('controller:' + currentRouteName());
  let testName = controller.testName;
  let $inModal = $('.in-modal');

  await click('.ui-preview', $inModal);
  
  let $modal = $('.modal');
  let $form = $('.form', $modal);
  let $field = $('.flexberry-field .flexberry-textbox', $form);
  let value = $field.children('input').val();
  assert.equal(value, testName);
});

executeTest('flexberry-lookup preview in separate route test', async (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
  await visit(path);

  assert.equal(currentPath(), path);

  let controller = app.__container__.lookup('controller:' + currentRouteName());
  let testName = controller.testName;
  let $inSeparateRoute = $('.in-separate-route');

  await click('.ui-preview', $inSeparateRoute);
  
  let $form = $('.form');
  let $field = $('.flexberry-field .flexberry-textbox', $form);
  let value = $field.children('input').val();
  assert.equal(value, testName);
});

executeTest('flexberry-lookup preview in groupedit test', async (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-preview';
  await visit(path);

  assert.equal(currentPath(), path);

  let controller = app.__container__.lookup('controller:' + currentRouteName());
  let testName = controller.testName;
  let $inGroupedit = $('.in-groupedit');

  await click('.ui-preview', $inGroupedit);
  
  let $form = $('.form');
  let $field = $('.flexberry-field .flexberry-textbox', $form);
  let value = $field.children('input').val();
  assert.equal(value, testName);
});
