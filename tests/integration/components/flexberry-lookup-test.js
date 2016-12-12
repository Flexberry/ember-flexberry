import Ember from 'ember';
import { Query } from 'ember-flexberry-data';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let app;

moduleForComponent('flexberry-lookup', 'Integration | Component | flexberry-lookup', {
  integration: true,
  beforeEach: function () {
    this.register('locale:ru/translations', I18nRuLocale);
    this.register('locale:en/translations', I18nEnLocale);
    this.register('service:i18n', I18nService);

    this.inject.service('i18n', { as: 'i18n' });
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });

    // Set 'ru' as initial locale.
    this.set('i18n.locale', 'ru');

    app = startApp();
  },
  afterEach: function() {
    destroyApp(app);
  }
});

test('autocomplete doesn\'t send data-requests in readonly mode', function(assert) {
  assert.expect(1);

  let store = app.__container__.lookup('service:store');

  // Override store.query method.
  let ajaxMethodHasBeenCalled = false;
  let originalAjaxMethod = Ember.$.ajax;
  Ember.$.ajax = function() {
    ajaxMethodHasBeenCalled = true;

    return originalAjaxMethod.apply(this, arguments);
  };

  // First, load model with existing master.
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let query = new Query.Builder(store)
    .from(modelName)
    .selectByProjection('SuggestionTypeE')
    .where('parent', Query.FilterOperator.Neq, null)
    .top(1);

  let asyncOperationsCompleted = assert.async();
  store.query(modelName, query.build()).then(suggestionTypes => {
    suggestionTypes = suggestionTypes.toArray();
    Ember.assert('One or more \'' + modelName + '\' must exist', suggestionTypes.length > 0);

    // Remember model & render component.
    this.set('model', suggestionTypes[0]);

    this.set('actions.showLookupDialog', () => {});
    this.set('actions.removeLookupValue', () => {});

    this.render(hbs`{{flexberry-lookup
      value=model.parent
      relatedModel=model
      relationName="parent"
      projection="SuggestionTypeL"
      displayAttributeName="name"
      title="Parent"
      choose=(action "showLookupDialog")
      remove=(action "removeLookupValue")
      readonly=true
      autocomplete=true
    }}`);

    // Retrieve component.
    let $component = this.$();
    let $componentInput = Ember.$('input', $component);

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.run(() => {
        ajaxMethodHasBeenCalled = false;

        // Imitate focus on component, which can cause async data-requests.
        $componentInput.focusin();

        // Wait for some time which can pass after focus, before possible async data-request will be sent.
        Ember.run.later(() => {
          resolve();
        }, 300);
      });
    });
  }).then(() => {
    // Check that store.query hasn\'t been called after focus.
    assert.strictEqual(ajaxMethodHasBeenCalled, false, '$.ajax hasn\'t been called after click on autocomplete lookup in readonly mode');
  }).catch((e) => {
    throw e;
  }).finally(() => {
    // Restore original method.
    Ember.$.ajax = originalAjaxMethod;

    asyncOperationsCompleted();
  });
});
