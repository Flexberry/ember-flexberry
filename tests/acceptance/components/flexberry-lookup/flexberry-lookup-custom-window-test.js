import Ember from 'ember';
import Builder from 'ember-flexberry-data/query/builder';
import Condition from 'ember-flexberry-data/query/condition';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { SimplePredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup custom window test', async (store, assert, app) => {
  // Test that filter projection name is properly applied to flexberry-lookup window.
  await visit('components-acceptance-tests/flexberry-lookup/settings-example-custom-window');

  let modelName = 'ember-flexberry-dummy-application-user';
  let waitTime = 2000;
  let nameEtalone;
  let eMailEtalone;

  assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-custom-window');

  let sp1 = new SimplePredicate('name', FilterOperator.Neq, '');
  let sp2 = new SimplePredicate('eMail', FilterOperator.Neq, '');
  let cp = new ComplexPredicate(Condition.And, sp1, sp2);

  let storeInstance = app.__container__.lookup('service:store');
  let builder = new Builder(storeInstance).from(modelName).selectByProjection('ApplicationUserL').where(cp).top(1);
  let result = await storeInstance.query(modelName, builder.build());
  let arr = result.toArray();
  nameEtalone = arr.objectAt(0).get('name');
  eMailEtalone = arr.objectAt(0).get('eMail');

  assert.notEqual(nameEtalone, eMailEtalone);

  let $lookupChooseButton = Ember.$('.ui-change');
  assert.equal($lookupChooseButton.length, 4);

  Ember.run(() => {
    $lookupChooseButton[0].click();
  });

  await new Promise(resolve => setTimeout(resolve, waitTime));

  let $filterElementOnToolbar = Ember.$('div.olv-search');
  assert.equal($filterElementOnToolbar.length, 1, 'Lookup window has filter element on toolbar.');

  let $filterInput = Ember.$('div.olv-search input');
  let $filterApplyButton = Ember.$('div.olv-search button.search-button');
  let lookupController = app.__container__.lookup('controller:lookup-dialog');

  // 1) Filter by name as nameEtalone by common projection and get N records.
  Ember.run(() => {
    fillIn($filterInput, nameEtalone);
  });

  $filterApplyButton.click();
  await new Promise(resolve => setTimeout(resolve, waitTime));

  let currentModel = Ember.get(lookupController, 'model');
  let filteredByCommonProjectionCountN = Ember.get(currentModel, 'meta.count');
  assert.ok(filteredByCommonProjectionCountN >= 1, `Found ${filteredByCommonProjectionCountN} records by common projection filtered by "${nameEtalone}".`);

  // Close for proper initiation of filter projection name.
  let $closeIcon = Ember.$('i.close');
  Ember.run(() => {
    $closeIcon.click();
  });

  await new Promise(resolve => setTimeout(resolve, waitTime));

  // 2) Filter by eMail as eMailEtalone by filter projection containing only eMail property and get at least 1 record.
  let testController = app.__container__.lookup('controller:' + currentRouteName());
  Ember.run(() => {
    Ember.set(testController, 'filterProjectionName', 'TestLookupCustomWindow');
    Ember.set(testController, 'projectionName', 'ApplicationUserE');
  });

  Ember.run(() => {
    $lookupChooseButton[0].click();
  });

  await new Promise(resolve => setTimeout(resolve, waitTime));

  $filterElementOnToolbar = Ember.$('div.olv-search');
  assert.equal($filterElementOnToolbar.length, 1, 'Lookup window has filter element on toolbar.');
  $filterInput = Ember.$('div.olv-search input');
  $filterApplyButton = Ember.$('div.olv-search button.search-button');
  Ember.run(() => {
    fillIn($filterInput, eMailEtalone);
  });
  $filterApplyButton.click();

  await new Promise(resolve => setTimeout(resolve, waitTime));

  currentModel = Ember.get(lookupController, 'model');
  let filteredByFilterProjectionCount = Ember.get(currentModel, 'meta.count');
  assert.ok(filteredByFilterProjectionCount >= 1, `Found ${filteredByFilterProjectionCount} records by filter projection filtered by "${eMailEtalone}".`);

  // 3) Filter by name as nameEtalone by filter projection containing only eMail property and get less than N records.
  $filterElementOnToolbar = Ember.$('div.olv-search');
  assert.equal($filterElementOnToolbar.length, 1, 'Lookup window has filter element on toolbar.');
  $filterInput = Ember.$('div.olv-search input');
  $filterApplyButton = Ember.$('div.olv-search button.search-button');
  Ember.run(() => {
    fillIn($filterInput, nameEtalone);
  });
  $filterApplyButton.click();

  await new Promise(resolve => setTimeout(resolve, waitTime));

  currentModel = Ember.get(lookupController, 'model');
  let filteredByFilterProjectionCount2 = Ember.get(currentModel, 'meta.count');
  assert.ok(filteredByCommonProjectionCountN > filteredByFilterProjectionCount2, `Found ${filteredByFilterProjectionCount2} records by filter projection filtered by "${nameEtalone}".`);

  // 4) Open another lookup and check that filter projection name is not used and controller is clear from old options.
  $closeIcon = Ember.$('i.close');
  Ember.run(() => {
    $closeIcon.click();
  });

  await new Promise(resolve => setTimeout(resolve, waitTime));

  Ember.run(() => {
    $lookupChooseButton[1].click();
  });

  await new Promise(resolve => setTimeout(resolve, waitTime));

  $filterElementOnToolbar = Ember.$('div.olv-search');
  assert.equal($filterElementOnToolbar.length, 1, 'Another lookup window has filter element on toolbar.');
  $filterInput = Ember.$('div.olv-search input');
  $filterApplyButton = Ember.$('div.olv-search button.search-button');
  Ember.run(() => {
    fillIn($filterInput, nameEtalone);
  });
  $filterApplyButton.click();

  await new Promise(resolve => setTimeout(resolve, waitTime));

  currentModel = Ember.get(lookupController, 'model');
  let filteredInAnotherLookup = Ember.get(currentModel, 'meta.count');
  assert.equal(filteredInAnotherLookup, filteredByCommonProjectionCountN, `Found ${filteredInAnotherLookup} records in another lookup filtered by "${nameEtalone}".`);
});

executeTest('flexberry-lookup on groupedit custom window test', async (store, assert, app) => {
  // Test that filter projection name is properly applied to flexberry-lookup window if flexberry-lookup is placed on groupedit.
  await visit('components-acceptance-tests/flexberry-lookup/settings-example-custom-window');

  let modelName = 'ember-flexberry-dummy-application-user';
  let waitTime = 2000;
  let nameEtalone;
  let eMailEtalone;

  assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-custom-window');

  let sp1 = new SimplePredicate('name', FilterOperator.Neq, '');
  let sp2 = new SimplePredicate('eMail', FilterOperator.Neq, '');
  let cp = new ComplexPredicate(Condition.And, sp1, sp2);

  let storeInstance = app.__container__.lookup('service:store');
  let builder = new Builder(storeInstance).from(modelName).selectByProjection('ApplicationUserL').where(cp).top(1);
  let result = await storeInstance.query(modelName, builder.build());
  let arr = result.toArray();
  nameEtalone = arr.objectAt(0).get('name');
  eMailEtalone = arr.objectAt(0).get('eMail');

  assert.notEqual(nameEtalone, eMailEtalone);

  let $lookupChooseButton = Ember.$('.ui-change');
  assert.equal($lookupChooseButton.length, 4);

  Ember.run(() => {
    $lookupChooseButton[2].click();
  });

  await new Promise(resolve => setTimeout(resolve, waitTime));

  let $filterElementOnToolbar = Ember.$('div.olv-search');
  assert.equal($filterElementOnToolbar.length, 1, 'Lookup window from groupedit has filter element on toolbar.');

  let $filterInput = Ember.$('div.olv-search input');
  let $filterApplyButton = Ember.$('div.olv-search button.search-button');
  let lookupController = app.__container__.lookup('controller:lookup-dialog');

  // 1) Filter by name as nameEtalone by common projection and get N records.
  Ember.run(() => {
    fillIn($filterInput, nameEtalone);
  });

  $filterApplyButton.click();
  await new Promise(resolve => setTimeout(resolve, waitTime));

  let currentModel = Ember.get(lookupController, 'model');
  let filteredByCommonProjectionCountN = Ember.get(currentModel, 'meta.count');
  assert.ok(filteredByCommonProjectionCountN >= 1, `Found ${filteredByCommonProjectionCountN} records by common projection filtered by "${nameEtalone}".`);

  let $closeIcon = Ember.$('i.close');
  Ember.run(() => {
    $closeIcon.click();
  });

  await new Promise(resolve => setTimeout(resolve, waitTime));

  // 2) Filter by eMail as eMailEtalone by filter projection containing only eMail property and get at least 1 record.
  Ember.run(() => {
    $lookupChooseButton[3].click();
  });

  await new Promise(resolve => setTimeout(resolve, waitTime));

  $filterElementOnToolbar = Ember.$('div.olv-search');
  assert.equal($filterElementOnToolbar.length, 1, 'Lookup window from groupedit has filter element on toolbar.');
  $filterInput = Ember.$('div.olv-search input');
  $filterApplyButton = Ember.$('div.olv-search button.search-button');
  Ember.run(() => {
    fillIn($filterInput, eMailEtalone);
  });
  $filterApplyButton.click();

  await new Promise(resolve => setTimeout(resolve, waitTime));

  currentModel = Ember.get(lookupController, 'model');
  let filteredByFilterProjectionCount = Ember.get(currentModel, 'meta.count');
  assert.ok(filteredByFilterProjectionCount >= 1, `Found ${filteredByFilterProjectionCount} records by filter projection filtered by "${eMailEtalone}".`);

  // 3) Filter by name as nameEtalone by filter projection containing only eMail property and get less than N records.
  $filterElementOnToolbar = Ember.$('div.olv-search');
  assert.equal($filterElementOnToolbar.length, 1, 'Lookup window has filter element on toolbar.');
  $filterInput = Ember.$('div.olv-search input');
  $filterApplyButton = Ember.$('div.olv-search button.search-button');
  Ember.run(() => {
    fillIn($filterInput, nameEtalone);
  });
  $filterApplyButton.click();

  await new Promise(resolve => setTimeout(resolve, waitTime));

  currentModel = Ember.get(lookupController, 'model');
  let filteredByFilterProjectionCount2 = Ember.get(currentModel, 'meta.count');
  assert.ok(filteredByCommonProjectionCountN > filteredByFilterProjectionCount2, `Found ${filteredByFilterProjectionCount2} records by filter projection filtered by "${nameEtalone}".`);

  // 4) Open another lookup and check that filter projection name is not used and controller is clear from old options.
  $closeIcon = Ember.$('i.close');
  Ember.run(() => {
    $closeIcon.click();
  });

  await new Promise(resolve => setTimeout(resolve, waitTime));

  Ember.run(() => {
    $lookupChooseButton[2].click();
  });

  await new Promise(resolve => setTimeout(resolve, waitTime));

  $filterElementOnToolbar = Ember.$('div.olv-search');
  assert.equal($filterElementOnToolbar.length, 1, 'Another lookup window from groupedit has filter element on toolbar.');
  $filterInput = Ember.$('div.olv-search input');
  $filterApplyButton = Ember.$('div.olv-search button.search-button');
  Ember.run(() => {
    fillIn($filterInput, nameEtalone);
  });
  $filterApplyButton.click();

  await new Promise(resolve => setTimeout(resolve, waitTime));

  currentModel = Ember.get(lookupController, 'model');
  let filteredInAnotherLookup = Ember.get(currentModel, 'meta.count');
  assert.equal(filteredInAnotherLookup, filteredByCommonProjectionCountN, `Found ${filteredInAnotherLookup} records in another lookup filtered by "${nameEtalone}".`);
});
