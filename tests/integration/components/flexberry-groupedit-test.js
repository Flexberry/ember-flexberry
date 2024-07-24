import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

import $ from 'jquery';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';

import UserSettingsService from 'ember-flexberry/services/user-settings';
import AggregatorModel from 'dummy/models/components-examples/flexberry-groupedit/shared/aggregator';
import AggregatorModelMainModelProjection from '../../../models/ember-flexberry-dummy-suggestion';
import FlexberryBaseComponent from 'ember-flexberry/components/flexberry-base-component';

module('Integration | Component | flexberry-groupedit', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    Component.reopen({
      i18n: service('i18n'),
      userSettingsService: service('user-settings'),
    });
    UserSettingsService.reopen({
      isUserSettingsServiceEnabled: false
    });

    this.owner.lookup('service:log').set('enabled', false);
  });

  hooks.afterEach(function() {
    FlexberryBaseComponent.prototype.currentController = null;
  });

  test('ember-groupedit element by default test', async function(assert) {
    assert.expect(9);
    let store = this.owner.lookup('service:store');

    let model;
    run(() => {
      model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    });

    let testComponentName = 'my-test-component-to-count-rerender';

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    this.set('componentName', testComponentName);
    this.set('searchForContentChange', true);
    await render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          searchForContentChange=searchForContentChange
          showAsteriskInRow=true
        }}`);

    // Add record.
    let $component = this.element.querySelector('.groupedit-toolbar');
    let $componentButtonAdd = $component.querySelector('.ui.button');

    await click($componentButtonAdd);
    await settled();

    let $componentObjectListViewFirstCellAsterisk = $('.asterisk', this.element);

    // Check object-list-view <i>.
    assert.strictEqual($componentObjectListViewFirstCellAsterisk.length, 1, 'Component has inner object-list-view-operations blocks');
    assert.strictEqual($componentObjectListViewFirstCellAsterisk.prop('tagName'), 'I', 'Component\'s inner component block is a <i>');
    assert.ok($componentObjectListViewFirstCellAsterisk.hasClass('asterisk'), 'Component\'s inner object-list-view has \'asterisk\' css-class');
    assert.ok($componentObjectListViewFirstCellAsterisk.hasClass('small'), 'Component\'s inner object-list-view has \'small\' css-class');
    assert.ok($componentObjectListViewFirstCellAsterisk.hasClass('red'), 'Component\'s inner object-list-view has \'red\' css-class');
    assert.ok($componentObjectListViewFirstCellAsterisk.hasClass('icon'), 'Component\'s inner object-list-view has \'icon\' css-class');

    let $componentObjectListViewFirstCell = $('.object-list-view-helper-column', this.element);
    let $flexberryCheckbox = $('.flexberry-checkbox', $componentObjectListViewFirstCell);

    assert.ok($flexberryCheckbox.length, 'Component has flexberry-checkbox in first cell blocks');

    let $minusButton = $('.minus', $componentObjectListViewFirstCell);

    assert.strictEqual($minusButton.length, 0, 'Component hasn\'t delete button in first cell');

    let $editMenuButton = $('.button.right', this.element);

    assert.strictEqual($editMenuButton.length, 0, 'Component hasn\'t edit menu in last cell');
  });

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    assert.expect(1);

    let store = this.owner.lookup('service:store');

    let model;
    run(() => {
      model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
    });

    this.set('proj', AggregatorModel.projections.get('AggregatorE'));
    this.set('model', model);
    await render(hbs`{{flexberry-groupedit modelProjection=proj content=model.details componentName='my-group-edit'}}`);
    assert.ok(true);
  });

  test('it properly rerenders', async function(assert) {
    assert.expect(5);
    let store = this.owner.lookup('service:store');

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';

      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
    });

    await render(hbs`
      {{flexberry-groupedit
        content=model.details
        componentName=componentName
        modelProjection=proj.attributes.details
        searchForContentChange=searchForContentChange
      }}`);

    assert.equal(this.element.querySelectorAll('.object-list-view tr').length, 2);

    run(() => {
      let detailModel = this.get('model.details');
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '1' }));
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '2' }));
    });

    await settled();
    assert.equal(this.element.querySelectorAll('.object-list-view tr').length, 3);

    run(() => {
      let detailModel = this.get('model.details');
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '3' }));
    });

    await settled();
    assert.equal(this.element.querySelectorAll('.object-list-view tr').length, 4);

    run(() => {
      this.get('model.details').get('firstObject').deleteRecord();
    });

    await settled();
    assert.equal(this.element.querySelectorAll('.object-list-view tr').length, 3);

    run(() => {
      this.set('searchForContentChange', false);

      let detailModel = this.get('model.details');
      detailModel.addObject(store.createRecord('components-examples/flexberry-groupedit/shared/detail', { text: '4' }));
    });

    await settled();
    assert.equal(this.element.querySelectorAll('.object-list-view tr').length, 3);
  });

  test('it properly rerenders by default', async function(assert) {
    assert.expect(72);
  
    let store = this.owner.lookup('service:store');
  
    run(async () => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';
  
      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
      await render(
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

  test('ember-grupedit placeholder test', async function(assert) {
    let store = this.owner.lookup('service:store');
  
    run(async() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';
  
      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
  
      let tempText = 'Temp text.';
  
      this.set('placeholder', tempText);
      await render(
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
    let store = this.owner.lookup('service:store');
  
    run(async () => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';
  
      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
      await render(
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
    let store = this.owner.lookup('service:store');
  
    run(async () => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';
  
      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
      await render(
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
    let store = this.owner.lookup('service:store');
  
    run(async () => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';
  
      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
      await render(
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

  test('ember-grupedit showAsteriskInRow test', async function(assert) {
    assert.expect(1);
    let store = this.owner.lookup('service:store');

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';

      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
    });

    await render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          searchForContentChange=searchForContentChange
          showAsteriskInRow=false
        }}`);

    // Add record.
    let $componentButtonAdd = this.element.querySelector('.ui.button');

    await click($componentButtonAdd);

    let $componentObjectListViewFirstCell = this.element.querySelectorAll('.asterisk');

    // Check object-list-view <i>.
    assert.strictEqual($componentObjectListViewFirstCell.length === 0, true, 'Component has small red asterisk blocks');
  });

  test('ember-grupedit showCheckBoxInRow test', async function(assert) {
    assert.expect(2);
    let store = this.owner.lookup('service:store');

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';

      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
    });

    await render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          searchForContentChange=searchForContentChange
          showCheckBoxInRow=false
        }}`);

    // Add record.
    let $componentButtonAdd = this.element.querySelector('.ui.button');

    await click($componentButtonAdd);

    let $flexberryCheckbox = this.element.querySelectorAll('.flexberry-checkbox');

    assert.strictEqual($flexberryCheckbox.length === 0, true, 'Component hasn\'t flexberry-checkbox in first cell');

    let $componentObjectListViewEditMenu = this.element.querySelectorAll('.button.right.pointing');

    assert.strictEqual($componentObjectListViewEditMenu.length === 0, true, 'Component hasn\'t edit menu in last cell');
  });

  test('it renders and checks the delete button', async function(assert) {
    assert.expect(1);
    let store = this.owner.lookup('service:store');

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';

      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
    });

    await render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          searchForContentChange=searchForContentChange
          showDeleteButtonInRow=true
        }}`);

    let $componentButtonAdd = this.element.querySelector('.ui.button');

    await click($componentButtonAdd);

    let $componentObjectListViewFirstCell = this.element.querySelectorAll('.object-list-view-helper-column');
    let $minusButton = $componentObjectListViewFirstCell[0].querySelectorAll('.minus');

    assert.strictEqual($minusButton.length === 1, true, 'Component has delete button in first cell');
  });

  test('ember-grupedit showEditMenuItemInRow test', async function(assert) {
    assert.expect(6);
    let store = this.owner.lookup('service:store');

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';

      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
    });

    await render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          searchForContentChange=searchForContentChange
          showEditMenuItemInRow=true
        }}`);

    let $componentButtonAdd = this.element.querySelector('.ui.button');

    await click($componentButtonAdd);

    let $editMenuButton = this.element.querySelector('.button.right.pointing');
    let $editMenuItem = $editMenuButton.querySelectorAll('.item');

    assert.strictEqual($editMenuItem.length === 1, true, 'Component has edit menu item in last cell');

    let $editMenuItemIcon = $editMenuItem[0].querySelector('.edit');

    assert.strictEqual($editMenuItemIcon !== null, true, 'Component has only edit menu item in last cell');
    assert.strictEqual($editMenuItemIcon.tagName, 'I', 'Component\'s inner component block is a <i>');
    assert.strictEqual($editMenuItemIcon.classList.contains('edit'), true, 'Component\'s inner object-list-view has \'edit\' css-class');
    assert.strictEqual($editMenuItemIcon.classList.contains('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

    let $editMenuItemSpan = $editMenuItem[0].querySelector('span');
    assert.strictEqual($editMenuItemSpan.textContent.trim(), 'Редактировать запись', 'Component has edit menu item in last cell');
  });

  test('ember-grupedit showDeleteMenuItemInRow test', async function(assert) {
    assert.expect(6);
    let store = this.owner.lookup('service:store');

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';

      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
    });

    await render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          searchForContentChange=searchForContentChange
          showDeleteMenuItemInRow=true
        }}`);

    let $componentButtonAdd = this.element.querySelector('.ui.button');

    await click($componentButtonAdd);

    let $editMenuButton = this.element.querySelector('.button.right.pointing');
    let $editMenuItem = $editMenuButton.querySelectorAll('.item');

    assert.strictEqual($editMenuItem.length === 1, true, 'Component has delete menu item in last cell');

    let $editMenuItemIcon = $editMenuItem[0].querySelector('.trash');

    assert.strictEqual($editMenuItemIcon !== null, true, 'Component has only edit menu item in last cell');
    assert.strictEqual($editMenuItemIcon.tagName, 'I', 'Component\'s inner component block is a <i>');
    assert.strictEqual($editMenuItemIcon.classList.contains('trash'), true, 'Component\'s inner object-list-view has \'trash\' css-class');
    assert.strictEqual($editMenuItemIcon.classList.contains('icon'), true, 'Component\'s inner object-list-view has \'icon\' css-class');

    let $editMenuItemSpan = $editMenuItem[0].querySelector('span');
    assert.strictEqual($editMenuItemSpan.textContent.trim(), 'Удалить запись', 'Component has delete menu item in last cell');
  });

  test('ember-grupedit showEditMenuItemInRow and showDeleteMenuItemInRow test', async function(assert) {
    assert.expect(11);
    let store = this.owner.lookup('service:store');

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';

      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
    });
    await render(hbs`
      {{flexberry-groupedit
        content=model.details
        componentName=componentName
        modelProjection=proj.attributes.details
        searchForContentChange=searchForContentChange
        showEditMenuItemInRow=true
        showDeleteMenuItemInRow=true
      }}`);

    let $componentButtonAdd = this.element.querySelector('.ui.button');
    await click($componentButtonAdd);

    let $editMenuButton = this.element.querySelectorAll('.button.right.pointing');
    let $editMenuItem = this.element.querySelectorAll('.item', $editMenuButton);

    assert.strictEqual($editMenuItem.length === 2, true, 'Component has edit menu and delete menu item in last cell');

    let $editMenuItemIcon = $editMenuItem[0].querySelector('.edit');
    assert.ok($editMenuItemIcon, 'Component has edit menu item in last cell');
    assert.strictEqual($editMenuItemIcon.tagName, 'I', 'Component\'s inner component block is a <i>');
    assert.ok($editMenuItemIcon.classList.contains('edit'), 'Component\'s inner object-list-view has \'edit\' css-class');
    assert.ok($editMenuItemIcon.classList.contains('icon'), 'Component\'s inner object-list-view has \'icon\' css-class');

    $editMenuItemIcon = $editMenuItem[1].querySelector('.trash');
    assert.ok($editMenuItemIcon, 'Component has delete menu item in last cell');
    assert.strictEqual($editMenuItemIcon.tagName, 'I', 'Component\'s inner component block is a <i>');
    assert.ok($editMenuItemIcon.classList.contains('trash'), 'Component\'s inner object-list-view has \'trash\' css-class');
    assert.ok($editMenuItemIcon.classList.contains('icon'), 'Component\'s inner object-list-view has \'icon\' css-class');

    assert.strictEqual($editMenuItem[0].querySelector('span').textContent.trim(), 'Редактировать запись', 'Component has edit menu item in last cell');
    assert.strictEqual($editMenuItem[1].querySelector('span').textContent.trim(), 'Удалить запись', 'Component has delete menu item in last cell');
  });

  test('ember-grupedit rowClickable test', async function(assert) {
    let store = this.owner.lookup('service:store');
  
    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';
  
      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('searchForContentChange', true);
    });

    await render(
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

  test('ember-grupedit buttonClass test', async function(assert) {
    let store = this.owner.lookup('service:store');
    let tempButtonClass = 'temp button class';

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';
  
      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('buttonClass', tempButtonClass);
    });

    await render(
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
  
  test('ember-grupedit customTableClass test', async function(assert) {
    let store = this.owner.lookup('service:store');
    let myCustomTableClass = 'tempcustomTableClass';

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';
      
  
      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('customTableClass', myCustomTableClass);
    });

    await render(
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

  test('ember-grupedit orderable test', async function(assert) {
    assert.expect(1);
    let store = this.owner.lookup('service:store');

    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';

      this.set('proj', AggregatorModel.projections.get('AggregatorE'));
      this.set('model', model);
      this.set('componentName', testComponentName);
      this.set('orderable', true);
    });

    await render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          orderable=orderable
        }}`);

    let $componentObjectListView = this.element.querySelector('.object-list-view');
    let $componentObjectListViewTh = $componentObjectListView.querySelectorAll('thead tr th');
    let $componentOlvFirstHead = $componentObjectListViewTh[1];

    await click($componentOlvFirstHead);

    let $componentOlvFirstDiv = $componentOlvFirstHead.querySelector('div');
    let $orderIcon = $componentOlvFirstDiv.querySelector('div');

    assert.strictEqual(!!$orderIcon, true, 'Table has order');
  });
  
  test('ember-grupedit menuInRowAdditionalItems without standart element test', async function(assert) {
    assert.expect(4);
    let store = this.owner.lookup('service:store');

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
    });

    await render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          menuInRowAdditionalItems=menuInRowAdditionalItems
        }}`);

    // Add record.
    let $addButton = this.element.querySelector('.ui.button');

    await click($addButton);

    let componentOLVMenu = this.element.querySelector('.button.right');
    let componentOLVMenuItem = componentOLVMenu.querySelectorAll('.item');

    assert.strictEqual(componentOLVMenuItem.length === 1, true, 'Component OLVMenuItem has only adding item');
    assert.strictEqual(componentOLVMenuItem[0].textContent.trim(), 'Temp menu item', 'Component OLVMenuItem text is \'Temp menu item\'');

    let componentOLVMenuItemIcon = componentOLVMenuItem[0].querySelector('.icon');

    assert.strictEqual(componentOLVMenuItemIcon.classList.contains('icon'), true, 'Component OLVMenuItemIcon has class icon');
    assert.strictEqual(componentOLVMenuItemIcon.classList.contains('remove'), true, 'Component OLVMenuItemIcon has class remove');
  });

  test('ember-grupedit menuInRowAdditionalItems with standart element test', async function(assert) {
    let store = this.owner.lookup('service:store');

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
    });

    await render(
      hbs`
        {{flexberry-groupedit
          content=model.details
          componentName=componentName
          modelProjection=proj.attributes.details
          menuInRowAdditionalItems=menuInRowAdditionalItems
          showEditMenuItemInRow=true
          showDeleteMenuItemInRow=true
        }}`);

    let $addButton = this.element.querySelector('.ui.button');

    await click($addButton);

    let componentOLVMenu = this.element.querySelector('.button.right');
    let componentOLVMenuItem = componentOLVMenu.querySelectorAll('.item');

    assert.strictEqual(componentOLVMenuItem.length === 3, true, 'Component OLVMenuItem has standart and adding items');
  });

  test('ember-grupedit model projection test', async function(assert) {
    let store = this.owner.lookup('service:store');
  
    run(() => {
      let model = store.createRecord('components-examples/flexberry-groupedit/shared/aggregator');
      let testComponentName = 'my-test-component-to-count-rerender';
  
      this.set('proj', AggregatorModel.projections.get('ConfigurateRowView'));
      this.set('model', model);
      this.set('componentName', testComponentName);
    });

    await render(
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

  test('ember-grupedit main model projection test', async function(assert) {
    let store = this.owner.lookup('service:store');
    let valueMainModelProjection;
    run(() => {
      let model = store.createRecord('ember-flexberry-dummy-suggestion');
      let testComponentName = 'my-test-component-to-count-rerender';
      valueMainModelProjection = model.get('i18n').t('models.ember-flexberry-dummy-suggestion.projections.SuggestionMainModelProjectionTest.userVotes.voteType.__caption__');

      this.set('proj', AggregatorModelMainModelProjection.projections.get('SuggestionMainModelProjectionTest'));
      this.set('model', model);
      this.set('componentName', testComponentName);
    });

    await render(
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
