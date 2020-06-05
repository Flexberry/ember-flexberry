import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

import $ from 'jquery';

import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import startApp from 'dummy/tests/helpers/start-app';
import { moduleForComponent, test } from 'ember-qunit';

import UserSettingsService from 'ember-flexberry/services/user-settings';
import AggregatorModel from 'dummy/models/components-examples/flexberry-groupedit/shared/aggregator';
import AggregatorModelMainModelProjection from '../../../models/ember-flexberry-dummy-suggestion';
import FlexberryBaseComponent from 'ember-flexberry/components/flexberry-base-component';

let App;

moduleForComponent('flexberry-groupedit', 'Integration | Component | Flexberry groupedit', {
  integration: true,

  beforeEach: function () {
    App = startApp();
    Component.reopen({
      i18n: service('i18n'),
      userSettingsService: service('user-settings')
    });

    UserSettingsService.reopen({
      isUserSettingsServiceEnabled: false
    });

    // Just take it and turn it off...
    App.__container__.lookup('service:log').set('enabled', false);
  },

  afterEach: function() {
    // Restore base component's reference to current controller to its initial state.
    FlexberryBaseComponent.prototype.currentController = null;

    run(App, 'destroy');
  }
});

test('ember-grupedit element by default test', function(assert) {
  assert.expect(9);
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          showAsteriskInRow=true
        }}`);

    // Add record.
    let $component = this.$().children();
    let $componentGroupEditToolbar = $component.children('.groupedit-toolbar');
    let $componentButtons = $componentGroupEditToolbar.children('.ui.button');
    let $componentButtonAdd = $($componentButtons[0]);

    run(() => {
      $componentButtonAdd.click();
    });

    andThen(function() {
      let $componentObjectListViewFirstCellAsterisk = $('.asterisk', $component);

      // Check object-list-view <i>.
      assert.strictEqual($componentObjectListViewFirstCellAsterisk.length === 1, true, 'Component has inner object-list-view-operations blocks');
      assert.strictEqual($componentObjectListViewFirstCellAsterisk.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
      assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('asterisk'),
        true, 'Component\'s inner object-list-view has \'asterisk\' css-class');
      assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('small'), true, 'Component\'s inner object-list-view has \'small\' css-class');
      assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('red'), true, 'Component\'s inner oobject-list-view has \'red\' css-class');
      assert.strictEqual($componentObjectListViewFirstCellAsterisk.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

      let $componentObjectListViewFirstCell = $('.object-list-view-helper-column', $component);
      let $flexberryCheckbox = $('.flexberry-checkbox', $componentObjectListViewFirstCell);

      assert.ok($flexberryCheckbox, 'Component has flexberry-checkbox in first cell blocks');

      let $minusButton = $('.minus', $componentObjectListViewFirstCell);

      assert.strictEqual($minusButton.length === 0, true, 'Component hasn\'t delete button in first cell');

      let $editMenuButton = $('.button.right', $component);

      assert.strictEqual($editMenuButton.length === 0, true, 'Component hasn\'t edit menu in last cell');
    });
  });
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  let store = App.__container__.lookup('service:store');

  run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.render(hbs`{{flexberry-groupedit modelProjection=proj content=model.details componentName='my-group-edit'}}`);
    assert.ok(true);
  });
});

test('it properly rerenders', function(assert) {
  assert.expect(5);
  let done = assert.async();
  let store = App.__container__.lookup('service:store');

  run(() => {
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
            done();
          });
        });
      });
    });
  });
});

test('it properly rerenders by default', function(assert) {
  assert.expect(72);

  let store = App.__container__.lookup('service:store');

  run(() => {
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
          showAsteriskInRow = true
        }}`);

    assert.equal(this.$('.object-list-view').find('tr').length, 2);

    let $detailsAtributes = this.get('proj.attributes.details.attributes');
    let $detailsAtributesArray = Object.keys($detailsAtributes);

    let $component = this.$().children();
    let $componentGroupEditToolbar = $component.children('.groupedit-toolbar');

    // Check groupedit-toolbar <div>.
    assert.strictEqual($componentGroupEditToolbar.length === 1, true, 'Component has inner groupedit-toolbar block');
    assert.strictEqual($componentGroupEditToolbar.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
    assert.strictEqual($componentGroupEditToolbar.hasClass('ember-view'), true, 'Component\'s inner groupedit-toolbar block has \'ember-view\' css-class');
    assert.strictEqual($componentGroupEditToolbar.hasClass('groupedit-toolbar'), true, 'Component inner has \'groupedit-toolbar\' css-class');

    let $componentButtons = $componentGroupEditToolbar.children('.ui.button');

    // Check button count.
    assert.strictEqual($componentButtons.length === 3, true, 'Component has inner two button blocks');

    let $componentButtonAdd = $($componentButtons[0]);

    // Check buttonAdd <button>.
    assert.strictEqual($componentButtonAdd.length === 1, true, 'Component has inner button block');
    assert.strictEqual($componentButtonAdd.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
    assert.strictEqual($componentButtonAdd.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
    assert.strictEqual($componentButtonAdd.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');

    let $componentButtonAddIcon = $componentButtonAdd.children('i');

    // Check buttonAddIcon <i>.
    assert.strictEqual($componentButtonAddIcon.length === 1, true, 'Component has inner button block');
    assert.strictEqual($componentButtonAddIcon.prop('tagName'), 'I', 'Component\'s inner groupedit block is a <i>');
    assert.strictEqual($componentButtonAddIcon.hasClass('plus'), true, 'Component\'s inner groupedit block has \'plus\' css-class');
    assert.strictEqual($componentButtonAddIcon.hasClass('icon'), true, 'Component\'s inner groupedit block has \'icon\' css-class');

    let $componentButtonRemove = $($componentButtons[1]);

    // Check buttonRemove <button>.
    assert.strictEqual($componentButtonRemove.length === 1, true, 'Component has inner button block');
    assert.strictEqual($componentButtonRemove.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
    assert.strictEqual($componentButtonRemove.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
    assert.strictEqual($componentButtonRemove.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');
    assert.strictEqual($componentButtonRemove.hasClass('disabled'), true, 'Component\'s inner groupedit block has \'disabled\' css-class');

    let $componentButtonDefauldSetting = $($componentButtons[2]);

    // Check buttonRemove <button>.
    assert.strictEqual($componentButtonDefauldSetting.length === 1, true, 'Component has inner button block');
    assert.strictEqual($componentButtonDefauldSetting.prop('tagName'), 'BUTTON', 'Component\'s inner groupedit block is a <button>');
    assert.strictEqual($componentButtonDefauldSetting.hasClass('ui'), true, 'Component\'s inner groupedit block has \'ui\' css-class');
    assert.strictEqual($componentButtonDefauldSetting.hasClass('button'), true, 'Component\'s inner groupedit block has \'button\' css-class');

    let $componentButtonRemoveIcon = $componentButtonRemove.children('i');

    // Check componentButtonRemove <i>.
    assert.strictEqual($componentButtonRemoveIcon.length === 1, true, 'Component has inner button block');
    assert.strictEqual($componentButtonRemoveIcon.prop('tagName'), 'I', 'Component\'s inner groupedit block is a <i>');
    assert.strictEqual($componentButtonRemoveIcon.hasClass('minus'), true, 'Component\'s inner groupedit block has \'minus\' css-class');
    assert.strictEqual($componentButtonRemoveIcon.hasClass('icon'), true, 'Component\'s inner groupedit block has \'icon\' css-class');

    let $componentListViewContainer = $component.children('.object-list-view-container');

    // Check list-view-container <div>.
    assert.strictEqual($componentListViewContainer.length === 1, true, 'Component has inner list-view-container block');
    assert.strictEqual($componentListViewContainer.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
    assert.strictEqual($componentListViewContainer.hasClass('ember-view'), true, 'Component\'s inner list-view-container block has \'ember-view\' css-class');
    assert.strictEqual($componentListViewContainer.hasClass('object-list-view-container'), true, 'Component has \'object-list-view-container\' css-class');

    let $componentJCLRgrips = $componentListViewContainer.children('.JCLRgrips');

    // Check JCLRgrips <div>.
    assert.strictEqual($componentJCLRgrips.length === 1, true, 'Component has inner JCLRgrips blocks');
    assert.strictEqual($componentJCLRgrips.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
    assert.strictEqual($componentJCLRgrips.hasClass('JCLRgrips'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');

    let $componentJCLRgrip = $componentJCLRgrips.children('.JCLRgrip');

    // Check JCLRgrip <div>.
    assert.strictEqual($componentJCLRgrip.length === 7, true, 'Component has inner JCLRgrip blocks');

    let $componentJCLRgripFirst = $($componentJCLRgrip[0]);

    // Check first JCLRgrip <div>.
    assert.strictEqual($componentJCLRgripFirst.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
    assert.strictEqual($componentJCLRgripFirst.hasClass('JCLRgrip'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');

    let $componentJCLRgripLast = $($componentJCLRgrip[6]);

    // Check last JCLRgrip <div>.
    assert.strictEqual($componentJCLRgripLast.length === 1, true, 'Component has inner JCLRgrips blocks');
    assert.strictEqual($componentJCLRgripLast.prop('tagName'), 'DIV', 'Component\'s inner component block is a <div>');
    assert.strictEqual($componentJCLRgripLast.hasClass('JCLRgrip'), true, 'Component\'s inner list-view-container block has \'JCLRgrios\' css-class');
    assert.strictEqual($componentJCLRgripLast.hasClass('JCLRLastGrip'), true, 'Component\'s inner list-view-container block has \'JCLRLastGrip\' css-class');

    let $componentObjectListView = $componentListViewContainer.children('.object-list-view');

    // Check object-list-view <div>.
    assert.strictEqual($componentObjectListView.length === 1, true, 'Component has inner object-list-view blocks');
    assert.strictEqual($componentObjectListView.prop('tagName'), 'TABLE', 'Component\'s inner component block is a <table>');
    assert.strictEqual($componentObjectListView.hasClass('object-list-view'), true, 'Component has \'object-list-view\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('ui'), true, 'Component\'s inner object-list-view block has \'ui\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('unstackable'), true, 'Component\'s inner object-list-view block has \'unstackable\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('celled'), true, 'Component\'s inner object-list-view block has \'celled\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('striped'), false, 'Component\'s inner object-list-view block has \'striped\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('table'), true, 'Component\'s inner object-list-view block has \'table\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('fixed'), true, 'Component\'s inner object-list-view block has \'fixed\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('JColResizer'), true, 'Component\'s inner object-list-view block has \'JColResizer\' css-class');
    assert.strictEqual($componentObjectListView.hasClass('rowClickable'), false, 'Component\'s inner object-list-view block has \'striped\' css-class');

    let $componentObjectListViewThead = $componentObjectListView.children('thead');
    let $componentObjectListViewTr = $componentObjectListViewThead.children('tr');
    let $componentObjectListViewThFirstCell = $componentObjectListViewTr.children('.object-list-view-operations');

    // Check object-list-view <th>.
    assert.strictEqual($componentObjectListViewThFirstCell.length === 1, true, 'Component has inner object-list-view-operations blocks');
    assert.strictEqual($componentObjectListViewThFirstCell.prop('tagName'), 'TH', 'Component\'s inner component block is a <th>');
    assert.strictEqual($componentObjectListViewThFirstCell.hasClass('object-list-view-operations'),
      true, 'Component has \'object-list-view-operations\' css-class');
    assert.strictEqual($componentObjectListViewThFirstCell.hasClass('collapsing'), true, 'Component has \'collapsing\' css-class');

    let $componentObjectListViewThs = $componentObjectListViewTr.children('.dt-head-left');

    // Check object-list-view <th>.
    assert.strictEqual($componentObjectListViewThs.length === 6, true, 'Component has inner object-list-view-operations blocks');

    let $componentObjectListViewTh = $($componentObjectListViewThs[0]);

    // Check object-list-view <th>.
    assert.strictEqual($componentObjectListViewTh.length === 1, true, 'Component has inner object-list-view-operations blocks');
    assert.strictEqual($componentObjectListViewTh.prop('tagName'), 'TH', 'Component\'s inner component block is a <th>');
    assert.strictEqual($componentObjectListViewTh.hasClass('dt-head-left'), true, 'Component has \'object-list-view-operations\' css-class');
    assert.strictEqual($componentObjectListViewTh.hasClass('me'), true, 'Component\'s inner object-list-view-operations has \'collapsing\' css-class');
    assert.strictEqual($componentObjectListViewTh.hasClass('class'), true, 'Component\'s inner object-list-view-operations has \'collapsing\' css-class');

    for (let index = 0; index < 6; ++index) {
      assert.strictEqual($componentObjectListViewThs[index].innerText.trim().toLowerCase(), $detailsAtributesArray[index], 'title ok');
    }

    let $componentObjectListViewThDiv = $componentObjectListViewTh.children('div');
    let $componentObjectListViewThDivSpan = $componentObjectListViewThDiv.children('span');

    // Check object-list-view <span>.
    assert.strictEqual($componentObjectListViewThDivSpan.length === 1, true, 'Component has inner <span> blocks');

    let $componentObjectListViewBody = $componentObjectListView.children('tbody');
    $componentObjectListViewTr = $componentObjectListViewBody.children('tr');
    let $componentObjectListViewTd = $componentObjectListViewTr.children('td');
    let $componentObjectListViewTdInner = $componentObjectListViewTd[0];

    // Check object-list-view <td>.
    assert.strictEqual($componentObjectListViewTd.length === 1, true, 'Component has inner object-list-view-operations blocks');
    assert.strictEqual($componentObjectListViewTd.prop('tagName'), 'TD', 'Component\'s inner component block is a <th>');
    assert.strictEqual($componentObjectListViewTdInner.innerText, 'Нет данных', 'Component\'s inner component block is a <th>');

  });
});

test('ember-grupedit placeholder test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    let testComponentName = 'my-test-component-to-count-rerender';

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.set('componentName', testComponentName);

    let tempText = 'Temp text.';

    this.set('placeholder', tempText);
    this.render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          placeholder=placeholder
        }}`);

    let $componentObjectListView = $('.object-list-view');
    let $componentObjectListViewBody = $componentObjectListView.children('tbody');

    assert.strictEqual($componentObjectListViewBody.text().trim(), tempText, 'Component has placeholder: ' + tempText);
  });
});

test('ember-grupedit striped test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          tableStriped=false
        }}`);

    let $componentObjectListView = $('.object-list-view');

    // Check object-list-view <div>.
    assert.strictEqual($componentObjectListView.hasClass('striped'), false, 'Component\'s inner object-list-view block has \'striped\' css-class');

  });
});

test('ember-grupedit off defaultSettingsButton, createNewButton and deleteButton test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          createNewButton=false
          deleteButton=false
          showCheckBoxInRow=false
          showAsteriskInRow=false
          defaultSettingsButton=false
        }}`);

    let $component = this.$().children();
    let $componentButtons = $('.ui.button', $component);

    assert.strictEqual($componentButtons.length === 0, true, 'Component hasn\'t inner two button blocks');
  });
});

test('ember-grupedit allowColumnResize test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          showEditMenuItemInRow=true
          allowColumnResize=false
        }}`);

    let $componentJCLRgrips = $($('.JCLRgrips')[0]);

    // Check JCLRgrips <div>.
    assert.strictEqual($componentJCLRgrips.length === 0, true, 'Component hasn\'t inner JCLRgrips blocks');

    let $componentObjectListView = $($('.object-list-view')[0]);

    // Check object-list-view <div>.
    assert.strictEqual($componentObjectListView.hasClass('JColResizer'), false, 'Component\'s inner object-list-view block hasn\'t \'JColResizer\' css-class');
  });
});

test('ember-grupedit showAsteriskInRow test', function(assert) {
  assert.expect(1);
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          showAsteriskInRow=false
        }}`);

    // Add record.
    let $componentButtonAdd = $($('.ui.button')[0]);

    run(() => {
      $componentButtonAdd.click();
    });

    andThen(function() {
      let $componentObjectListViewFirstCell = $('.asterisk');

      // Check object-list-view <i>.
      assert.strictEqual($componentObjectListViewFirstCell.length === 0, true, 'Component has small red asterisk blocks');
    });
  });
});

test('ember-grupedit showCheckBoxInRow test', function(assert) {
  assert.expect(2);
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          showCheckBoxInRow=false
        }}`);

    // Add record.
    let $componentButtonAdd = $($('.ui.button')[0]);

    run(() => {
      $componentButtonAdd.click();
    });

    andThen(function() {
      let $flexberryCheckbox = $('.flexberry-checkbox');

      assert.ok($flexberryCheckbox, false, 'Component hasn\'t flexberry-checkbox in first cell');

      let $componentObjectListViewEditMenu = $('.button.right.pointing');

      assert.strictEqual($componentObjectListViewEditMenu.length === 0, true, 'Component hasn\'t edit menu in last cell');
    });
  });
});

test('ember-grupedit showDeleteButtonInRow test', function(assert) {
  assert.expect(1);
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          showDeleteButtonInRow=true
        }}`);

    let $componentButtonAdd = $($('.ui.button')[0]);

    run(() => {
      $componentButtonAdd.click();
    });

    andThen(function() {
      let $componentObjectListViewFirstCell = $('.object-list-view-helper-column');
      let $minusButton = $('.minus', $componentObjectListViewFirstCell);

      assert.strictEqual($minusButton.length === 1, true, 'Component has delete button in first cell');

    });
  });
});

test('ember-grupedit showEditMenuItemInRow test', function(assert) {
  assert.expect(6);
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          showEditMenuItemInRow=true
        }}`);

    let $component = this.$().children();
    let $componentButtonAdd = $($('.ui.button')[0]);

    run(() => {
      $componentButtonAdd.click();
    });

    andThen(function() {
      let $editMenuButton = $('.button.right', $component);
      let $editMenuItem = $('.item', $editMenuButton);

      assert.strictEqual($editMenuItem.length === 1, true, 'Component has edit menu item in last cell');

      let $editMenuItemIcon = $editMenuItem.children('.edit');

      assert.strictEqual($editMenuItemIcon.length === 1, true, 'Component has only edit menu item in last cell');
      assert.strictEqual($editMenuItemIcon.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
      assert.strictEqual($editMenuItemIcon.hasClass('edit'),
        true, 'Component\'s inner object-list-view has \'edit\' css-class');
      assert.strictEqual($editMenuItemIcon.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

      let $editMenuItemSpan = $editMenuItem.children('span');
      assert.strictEqual($editMenuItemSpan.text().trim(), 'Редактировать запись', 'Component has edit menu item in last cell');

    });
  });
});

test('ember-grupedit showDeleteMenuItemInRow test', function(assert) {
  assert.expect(6);
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          showDeleteMenuItemInRow=true
        }}`);

    let $component = this.$().children();
    let $componentButtonAdd = $($('.ui.button')[0]);

    run(() => {
      $componentButtonAdd.click();
    });

    andThen(function() {
      let $editMenuButton = $('.button.right', $component);
      let $editMenuItem = $('.item', $editMenuButton);

      assert.strictEqual($editMenuItem.length === 1, true, 'Component has delete menu item in last cell');

      let $editMenuItemIcon = $editMenuItem.children('.trash');

      assert.strictEqual($editMenuItemIcon.length === 1, true, 'Component has only edit menu item in last cell');
      assert.strictEqual($editMenuItemIcon.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
      assert.strictEqual($editMenuItemIcon.hasClass('trash'),
        true, 'Component\'s inner object-list-view has \'edit\' css-class');
      assert.strictEqual($editMenuItemIcon.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

      let $editMenuItemSpan = $editMenuItem.children('span');
      assert.strictEqual($editMenuItemSpan.text().trim(), 'Удалить запись', 'Component has delete menu item in last cell');

    });
  });
});

test('ember-grupedit showEditMenuItemInRow and showDeleteMenuItemInRow test', function(assert) {
  assert.expect(10);
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          showEditMenuItemInRow=true
          showDeleteMenuItemInRow=true
        }}`);

    let $component = this.$().children();
    let $componentButtonAdd = $($('.ui.button')[0]);

    run(() => {
      $componentButtonAdd.click();
    });

    andThen(function() {
      let $editMenuButton = $('.button.right', $component);
      let $editMenuItem = $('.item', $editMenuButton);

      assert.strictEqual($editMenuItem.length === 2, true, 'Component has edit menu and delete menu item in last cell');

      let $editMenuItemIcon = $editMenuItem.children('.edit');

      assert.strictEqual($editMenuItemIcon.length === 1, true, 'Component has edit menu item in last cell');
      assert.strictEqual($editMenuItemIcon.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
      assert.strictEqual($editMenuItemIcon.hasClass('edit'),
        true, 'Component\'s inner object-list-view has \'edit\' css-class');
      assert.strictEqual($editMenuItemIcon.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

      $editMenuItemIcon = $editMenuItem.children('.trash');

      assert.strictEqual($editMenuItemIcon.length === 1, true, 'Component has edit menu item in last cell');
      assert.strictEqual($editMenuItemIcon.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
      assert.strictEqual($editMenuItemIcon.hasClass('trash'),
        true, 'Component\'s inner object-list-view has \'edit\' css-class');
      assert.strictEqual($editMenuItemIcon.hasClass('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

      let $editMenuItemSpan = $editMenuItem.children('span');
      assert.strictEqual($editMenuItemSpan.text().trim(), 'Редактировать записьУдалить запись', 'Component has edit menu and delete menu item in last cell');

    });
  });
});

test('ember-grupedit rowClickable test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
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
          rowClickable=true
        }}`);

    let $componentObjectListView = $('.object-list-view');

    // Check object-list-view <div>.
    assert.strictEqual($componentObjectListView.hasClass('selectable'), true, 'Component\'s inner object-list-view block has \'selectable\' css-class');
  });
});

test('ember-grupedit buttonClass test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    let testComponentName = 'my-test-component-to-count-rerender';
    let tempButtonClass = 'temp button class';

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.set('componentName', testComponentName);
    this.set('buttonClass', tempButtonClass);
    this.render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          rowClickable=true
          buttonClass=buttonClass
        }}`);

    let $componentButtonAdd = $($('.ui.button')[0]);

    assert.strictEqual($componentButtonAdd.hasClass(tempButtonClass), true, 'Button has class ' + tempButtonClass);
  });
});

test('ember-grupedit customTableClass test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    let testComponentName = 'my-test-component-to-count-rerender';
    let myCustomTableClass = 'tempcustomTableClass';

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.set('componentName', testComponentName);
    this.set('customTableClass', myCustomTableClass);
    this.render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          rowClickable=true
          customTableClass=customTableClass
        }}`);

    let $componentObjectListView = $('.object-list-view');

    assert.strictEqual($componentObjectListView.hasClass(myCustomTableClass), true, 'Table has class ' + myCustomTableClass);
  });
});

test('ember-grupedit orderable test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    let testComponentName = 'my-test-component-to-count-rerender';

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.set('componentName', testComponentName);
    this.set('orderable', true);
    this.render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          orderable=orderable
        }}`);

    let $componentObjectListView = $('.object-list-view');
    let $componentObjectListViewTh = $componentObjectListView.children('thead').children('tr').children('th');
    let $componentOlvFirstHead = $($componentObjectListViewTh[1]);

    run(() => {
      $componentOlvFirstHead.click();
    });

    let $componentOlvFirstDiv = $componentOlvFirstHead.children('div');
    let $orderIcon = $componentOlvFirstDiv.children('div');

    assert.strictEqual($orderIcon.length === 1, true, 'Table has order');
  });
});

test('ember-grupedit menuInRowAdditionalItems without standart element test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    let testComponentName = 'my-test-component-to-count-rerender';
    let tempMenuInRowAdditionalItems = [{
      icon: 'remove icon',
      title: 'Temp menu item',
      actionName: 'tempAction',
    }];

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.set('componentName', testComponentName);
    this.set('menuInRowAdditionalItems', tempMenuInRowAdditionalItems);
    this.render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          menuInRowAdditionalItems=menuInRowAdditionalItems
        }}`);

    let $addButton = $($('.ui.button')[0]);

    run(() => {
      $addButton.click();
    });

    let componentOLVMenu =  $('.button.right');
    let componentOLVMenuItem = componentOLVMenu.children('div').children('.item');

    assert.strictEqual(componentOLVMenuItem.length === 1, true, 'Component OLVMenuItem has only adding item');
    assert.strictEqual(componentOLVMenuItem.text().trim() === 'Temp menu item', true, 'Component OLVMenuItem text is \'Temp menu item\'');

    let componentOLVMenuItemIcon = componentOLVMenuItem.children('.icon');

    assert.strictEqual(componentOLVMenuItemIcon.hasClass('icon'), true, 'Component OLVMenuItemIcon has class icon');
    assert.strictEqual(componentOLVMenuItemIcon.hasClass('remove'), true, 'Component OLVMenuItemIcon has class remove');
  });
});

test('ember-grupedit menuInRowAdditionalItems with standart element test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    let testComponentName = 'my-test-component-to-count-rerender';
    let tempMenuInRowAdditionalItems = [{
      icon: 'remove icon',
      title: 'Temp menu item',
      actionName: 'tempAction',
    }];

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.set('componentName', testComponentName);
    this.set('menuInRowAdditionalItems', tempMenuInRowAdditionalItems);
    this.render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          menuInRowAdditionalItems=menuInRowAdditionalItems
          showEditMenuItemInRow=true
          showDeleteMenuItemInRow=true
        }}`);

    let $addButton = $($('.ui.button')[0]);

    run(() => {
      $addButton.click();
    });

    let componentOLVMenu =  $('.button.right');
    let componentOLVMenuItem = componentOLVMenu.children('div').children('.item');

    assert.strictEqual(componentOLVMenuItem.length === 3, true, 'Component OLVMenuItem has standart and adding items');
  });
});

test('ember-grupedit model projection test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
    let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    let testComponentName = 'my-test-component-to-count-rerender';

    this.set('proj', AggregatorModel.projections.get('ConfigurateRowView'));
    this.set('model', model);
    this.set('componentName', testComponentName);
    this.render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
        }}`);

    let componentOLV = $('.object-list-view');
    let componentOLVThead = componentOLV.children('thead').children('tr').children('th');

    assert.strictEqual(componentOLVThead.length === 3, true, 'Component has \'ConfigurateRowView\' projection');
  });
});

test('ember-grupedit main model projection test', function(assert) {
  let store = App.__container__.lookup('service:store');

  run(() => {
    let model = store.createRecord('ember-flexberry-dummy-suggestion');
    let testComponentName = 'my-test-component-to-count-rerender';
    let valueMainModelProjection = model.get('i18n').t('models.ember-flexberry-dummy-suggestion.projections.SuggestionMainModelProjectionTest.userVotes.voteType.__caption__');

    this.set('proj', AggregatorModelMainModelProjection.projections.get('SuggestionMainModelProjectionTest'));
    this.set('model', model);
    this.set('componentName', testComponentName);
    this.render(
      hbs`
        {{flexberry-groupedit
          componentName=componentName
          content=model.userVotes
          modelProjection=proj.attributes.userVotes
          mainModelProjection=proj
        }}`);

    let $componentObjectListView = $('.object-list-view');
    let $componentObjectListViewTh = $componentObjectListView.children('thead').children('tr').children('th');
    let $componentOlvFirstHead = $componentObjectListViewTh[1];

    assert.strictEqual($componentOlvFirstHead.innerText === valueMainModelProjection.toString(), true, 'Header has text \'Vote type\'');
  });
});
