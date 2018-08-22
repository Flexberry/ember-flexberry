import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('changes in model\'s value causes changes in component\'s specified \'belongsTo\' model', (store, assert, app) => {
  assert.expect(2);
  visit('components-acceptance-tests/flexberry-lookup/base-operations');
  andThen(function() {

    let $lookup = Ember.$('.flexberry-lookup');
    let $lookupInput = Ember.$('input', $lookup);
    assert.strictEqual($lookupInput.val() === '', true, 'lookup display value is empty by default');

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let model = Ember.get(controller, 'model');
    let store = app.__container__.lookup('service:store');
    let suggestionType;

    // Create limit for query.
    let query = new Query.Builder(store)
      .from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('SettingLookupExampleView');

    // Load olv data.
    store.query('ember-flexberry-dummy-suggestion-type', query.build()).then((suggestionTypes) => {

      let suggestionTypesArr = suggestionTypes.toArray();

      suggestionType = suggestionTypesArr.objectAt(0);

    }).then(() => {

      // Change data in the model.
      model.set('type', suggestionType);

      let done = assert.async();

      setTimeout(function() {
        $lookupInput = Ember.$('input', $lookup);
        assert.strictEqual($lookupInput.val() === suggestionType.get('name'), true, 'lookup display value isn\'t empty');
        done();
      }, 100);

    });
  });
});
