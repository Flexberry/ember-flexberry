import $ from 'jquery';
import { get } from '@ember/object';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { executeTest } from './execute-flexberry-lookup-test';
import { run } from '@ember/runloop';
import { settled } from '@ember/test-helpers';

executeTest('changes in model\'s value causes changes in component\'s specified \'belongsTo\' model', async (store, assert, app) => {
  assert.expect(2);
  await visit('components-acceptance-tests/flexberry-lookup/base-operations');

  let $lookup = $('.flexberry-lookup');
  let $lookupInput = $('input', $lookup);
  assert.strictEqual($lookupInput.val(), '', 'lookup display value is empty by default');

  let controller = app.__container__.lookup('controller:' + currentRouteName());
    let model = get(controller, 'model');

  // Создаем запрос
  let query = new QueryBuilder(store)
    .from('ember-flexberry-dummy-suggestion-type')
    .selectByProjection('SettingLookupExampleView');

  // Загружаем данные
  let suggestionTypes = await store.query('ember-flexberry-dummy-suggestion-type', query.build());
  let suggestionType = suggestionTypes.get('firstObject');

  run(() => {
    model.set('type', suggestionType);
  });


  await settled(); // Убедитесь, что все асинхронные операции завершены

  // Проверяем значение после обновления модели
  $lookupInput = $('input', $lookup);
  assert.strictEqual($lookupInput.val(), suggestionType.get('name'), 'lookup display value isn\'t empty');
});
