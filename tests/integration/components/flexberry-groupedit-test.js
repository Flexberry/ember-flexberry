import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import AggregatorModel from '../../../models/components-examples/flexberry-groupedit/shared/aggregator';
import UserSettingsService from 'ember-flexberry/services/user-settings';

let App;

moduleForComponent('flexberry-groupedit', 'Integration | Component | Flexberry groupedit', {
  integration: true,

  beforeEach: function () {
    App = startApp();
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n'),
      userSettingsService: Ember.inject.service('user-settings')
    });

    UserSettingsService.reopen({
      isUserSettingsServiceEnabled: false
    });
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  let store = App.__container__.lookup('service:store');

  Ember.run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.render(hbs`{{flexberry-groupedit modelProjection=proj content=model.details componentName='my-group-edit'}}`);
    assert.ok(true);
  });
});

test('it properly rerenders', function(assert) {
  let store = App.__container__.lookup('service:store');

  Ember.run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    let testComponentName = 'my-test-component-to-count-rerender';

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.set('componentName', testComponentName);
    this.set('searchForContentChange', true);
    this.render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          searchForContentChange=searchForContentChange
        }}`);
    assert.equal(this.$('.object-list-view').find('tr').length, 2);

    // Add record.
    let detailModel = this.get('model.details');
    detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '1' }));
    detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '2' }));

    wait().then(() => {
      assert.equal(this.$('.object-list-view').find('tr').length, 3);

      // Add record.
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '3' }));
      wait().then(() => {
        assert.equal(this.$('.object-list-view').find('tr').length, 4);

        // Delete record.
        this.get('model.details').get('firstObject').deleteRecord();
        wait().then(() => {
          assert.equal(this.$('.object-list-view').find('tr').length, 3);

          // Disable search for changes flag and add record.
          this.set('searchForContentChange', false);
          detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '4' }));
          wait().then(() => {
            assert.equal(this.$('.object-list-view').find('tr').length, 3);
          });
        });
      });
    });
  });
});

test('it properly rerenders by default', function(assert) {
  let store = App.__container__.lookup('service:store');

  Ember.run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    let testComponentName = 'my-test-component-to-count-rerender';

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.set('componentName', testComponentName);
    this.set('searchForContentChange', true);
    this.render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          searchForContentChange=searchForContentChange
        }}`);
    assert.equal(this.$('.object-list-view').find('tr').length, 2);

    let $detailsAtributes = this.get('proj.attributes.details.attributes');
    let $detailsAtributesArray = Object.keys($detailsAtributes);

    let $component = this.$().children();
    let $componentGroupEditToolbar = $component.children('.groupedit-toolbar');
    //let $componentGroupEditToolbarCall = $componentGroupEditToolbar.attr('length');

    // Check groupedit-toolbar <div>.
    assert.strictEqual($componentGroupEditToolbar.length === 1, true, 'Component has inner groupedit-toolbar block');
    assert.strictEqual($componentGroupEditToolbar.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
    assert.strictEqual($componentGroupEditToolbar.hasClass('ember-view'), true, 'Component\'s inner groupedit-toolbar block has \'ember-view\' css-class');
    assert.strictEqual($componentGroupEditToolbar.hasClass('groupedit-toolbar'), true, 'Component\'s inner groupedit-toolbar block has \'groupedit-toolbar\' css-class');

    let $componentButtons = $componentGroupEditToolbar.children('.ui.button');

    // Check title's <div>.
    assert.strictEqual($componentButtons.length === 2, true, 'Component has inner two button blocks');

    let $componentButtonAdd = $($componentButtons[0]);

    // Check buttonAdd <button>.
    assert.strictEqual($componentButtonAdd.length === 1, true, 'Component has inner button block');
    assert.strictEqual($componentButtonAdd.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
    assert.strictEqual($componentButtonAdd.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
    assert.strictEqual($componentButtonAdd.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');

    let $componentButtonRemove = $componentGroupEditToolbar.children('.disabled');

    // Check buttonRemove <button>.
    assert.strictEqual($componentButtonRemove.length === 1, true, 'Component has inner button block');
    assert.strictEqual($componentButtonRemove.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
    assert.strictEqual($componentButtonRemove.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');
    assert.strictEqual($componentButtonRemove.hasClass('disabled'), true, 'Component\'s inner groupedit block has \'disabled\' css-class');
    

    let $componentListViewContainer = $component.children('.object-list-view-container');

    // Check list-view-container <div>.
    assert.strictEqual($componentListViewContainer.length === 1, true, 'Component has inner list-view-container block');
    assert.strictEqual($componentListViewContainer.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
    assert.strictEqual($componentListViewContainer.hasClass('ember-view'), true, 'Component\'s inner list-view-container block has \'ember-view\' css-class');
    assert.strictEqual($componentListViewContainer.hasClass('object-list-view-container'), true, 'Component\'s inner list-view-container block has \'object-list-view-container\' css-class');

    let $componentJCLRgrips = $componentListViewContainer.children('.JCLRgrips');

    // Check JCLRgrips <div>.
    assert.strictEqual($componentJCLRgrips.length === 1, true, 'Component has inner JCLRgrips blocks');
    assert.strictEqual($componentJCLRgrips.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
    assert.strictEqual($componentJCLRgrips.hasClass('JCLRgrips'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');

    let $componentJCLRgrip = $componentJCLRgrips.children('.JCLRgrip');

    // Check JCLRgrip <div>.
    assert.strictEqual($componentJCLRgrip.length === 7, true, 'Component has inner JCLRgrip blocks');

    let $componentObjectListView = $componentListViewContainer.children('.object-list-view');

    // Check object-list-view <div>.
    assert.strictEqual($componentObjectListView.length === 1, true, 'Component has inner object-list-view blocks');
    assert.strictEqual($componentObjectListView.prop('tagName'), 'TABLE', 'Component\'s inner component block is a <table>');
    assert.strictEqual($componentObjectListView.hasClass('object-list-view'), true, 'Component\'s inner object-list-view block has \'object-list-view\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('ui'), true, 'Component\'s inner object-list-view block has \'ui\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('unstackable'), true, 'Component\'s inner object-list-view block has \'unstackable\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('celled'), true, 'Component\'s inner object-list-view block has \'celled\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('striped'), true, 'Component\'s inner object-list-view block has \'striped\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('table'), true, 'Component\'s inner object-list-view block has \'table\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('fixed'), true, 'Component\'s inner object-list-view block has \'fixed\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('JColResizer'), true, 'Component\'s inner object-list-view block has \'JColResizer\' css-class');

    let $componentObjectListViewThead = $componentObjectListView.children('thead');
    let $componentObjectListViewTr = $componentObjectListViewThead.children('tr');
    let $componentObjectListViewThFirstCell = $componentObjectListViewTr.children('.object-list-view-operations');

    // Check object-list-view <th>.
    assert.strictEqual($componentObjectListViewThFirstCell.length === 1, true, 'Component has inner object-list-view-operations blocks');
    assert.strictEqual($componentObjectListViewThFirstCell.prop('tagName'), 'TH', 'Component\'s inner component block is a <th>');
    assert.strictEqual($componentObjectListViewThFirstCell.hasClass('object-list-view-operations'), true, 'Component\'s object-list-view-operations has \'object-list-view-operations\' css-class');
    assert.strictEqual($componentObjectListViewThFirstCell.hasClass('collapsing'), true, 'Component\'s inner object-list-view-operations has \'collapsing\' css-class');

    let $componentObjectListViewThs = $componentObjectListViewTr.children('.dt-head-left');

    // Check object-list-view <th>.
    assert.strictEqual($componentObjectListViewThs.length === 6, true, 'Component has inner object-list-view-operations blocks');

    let $componentObjectListViewTh = $($componentObjectListViewThs[0]);

    // Check object-list-view <th>.
    assert.strictEqual($componentObjectListViewTh.length === 1, true, 'Component has inner object-list-view-operations blocks');
    assert.strictEqual($componentObjectListViewTh.prop('tagName'), 'TH', 'Component\'s inner component block is a <th>');
    assert.strictEqual($componentObjectListViewTh.hasClass('dt-head-left'), true, 'Component\'s object-list-view-operations has \'object-list-view-operations\' css-class');
    assert.strictEqual($componentObjectListViewTh.hasClass('me'), true, 'Component\'s inner object-list-view-operations has \'collapsing\' css-class');
    assert.strictEqual($componentObjectListViewTh.hasClass('class'), true, 'Component\'s inner object-list-view-operations has \'collapsing\' css-class');
    assert.strictEqual($componentObjectListViewTh.text().trim(), 'Flag', 'Component\'s inner component block is a <th>');

    for (index = 0; index < 6; ++index) {
      assert.strictEqual($componentObjectListViewThs[index].innerText.trim().toLowerCase(), $detailsAtributesArray[index], 'title ok');
    }

    let $componentObjectListViewBody = $componentObjectListView.children('tbody');
    $componentObjectListViewTr = $componentObjectListViewBody.children('tr');
    let $componentObjectListViewTd = $componentObjectListViewTr.children('td');

    // Check object-list-view <th>.
    assert.strictEqual($componentObjectListViewTd.length === 1, true, 'Component has inner object-list-view-operations blocks');
    assert.strictEqual($componentObjectListViewTd.prop('tagName'), 'TD', 'Component\'s inner component block is a <th>');
    assert.strictEqual($componentObjectListViewTd.text().trim(), 'There is no data', 'Component\'s inner component block is a <th>');

  });
});
