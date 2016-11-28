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

    let $component = this.$().children();
    let $componentGroupEditToolbar = $component.children('.groupedit-toolbar');

    // Check groupedit-toolbar <div>.
    assert.strictEqual($componentGroupEditToolbar.length === 1, true, 'Component has inner groupedit-toolbar block');
    assert.strictEqual($componentGroupEditToolbar.prop('tagName'), 'DIV', 'Component\'s inner title block is a <div>');
    assert.strictEqual($componentGroupEditToolbar.hasClass('ember-view'), true, 'Component\'s inner title block has \'ember-view\' css-class');
    assert.strictEqual($componentGroupEditToolbar.hasClass('groupedit-toolbar'), true, 'Component\'s inner title block has \'groupedit-toolbar\' css-class');

    let $componentButtons = $componentGroupEditToolbar.children('.ui.button');

    // Check title's <div>.
    assert.strictEqual($componentButtons.length === 2, true, 'Component has inner button blocks');
    assert.strictEqual($componentGroupEditToolbar.prop('tagName'), 'DIV', 'Component\'s inner title block is a <div>');
    assert.strictEqual($componentGroupEditToolbar.hasClass('title'), true, 'Component\'s inner title block has \'title\' css-class');
    /*let $componentCaption = $componentTitle.children('span');
    let $componentContent = $component.children('div .content');*/



    /*// Add record.
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
    });*/
  });
});
