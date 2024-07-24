import { skip } from 'qunit';
import RSVP from 'rsvp';
import $ from 'jquery';
import { run, later } from '@ember/runloop';
import { set } from '@ember/object';
import { isNone } from '@ember/utils';
import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { render, fillIn, focus } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | flexberry-lookup', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.lookup('service:log').set('enabled', false);
  });
  
  test('component renders properly', async function(assert) {
    assert.expect(31);

    await render(hbs`{{flexberry-lookup
      placeholder='(тестовое значение)'
    }}`);

    // Retrieve component, it's inner <input>.
    let $component = this.$().children();
    let $lookupFluid = $component.children('.fluid');
    let $lookupInput = $lookupFluid.children('.lookup-field');
    let $lookupButtonPreview = $lookupFluid.children('.ui-preview');
    let $lookupButtonChoose = $lookupFluid.children('.ui-change');
    let $lookupButtonClear = $lookupFluid.children('.ui-clear');
    let $lookupButtonClearIcon = $lookupButtonClear.children('.remove');

    // Check wrapper <flexberry-lookup>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
    assert.strictEqual($component.hasClass('flexberry-lookup'), true, 'Component\'s container has \'flexberry-lookup\' css-class');
    assert.strictEqual($component.hasClass('ember-view'), true, 'Component\'s wrapper has \'ember-view\' css-class');

    // Check wrapper <fluid>.
    assert.strictEqual($lookupFluid.length === 1, true, 'Component has inner title block');
    assert.strictEqual($lookupFluid.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
    assert.strictEqual($lookupFluid.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($lookupFluid.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');
    assert.strictEqual($lookupFluid.hasClass('action'), true, 'Component\'s wrapper has \'action\' css-class');
    assert.strictEqual($lookupFluid.hasClass('input'), true, 'Component\'s container has \'input\' css-class');

    // Check <input>.
    assert.strictEqual($lookupInput.length === 1, true, 'Component has inner title block');
    assert.strictEqual($lookupInput.prop('tagName'), 'INPUT', 'Component\'s wrapper is a <input>');
    assert.strictEqual($lookupInput.hasClass('lookup-field'), true, 'Component\'s title block has \'lookup-field\' css-class');
    assert.strictEqual($lookupInput.hasClass('ember-view'), true, 'Component\'s title block has \'ember-view\' css-class');
    assert.strictEqual($lookupInput.hasClass('ember-text-field'), true, 'Component\'s title block has \'ember-text-field\' css-class');
    assert.equal($lookupInput.attr('placeholder'), '(тестовое значение)', 'Component\'s container has \'input\' css-class');

    // Check <preview button>.
    assert.strictEqual($lookupButtonPreview.length === 0, true, 'Component has inner title block');

    // Check <choose button>.
    assert.strictEqual($lookupButtonChoose.length === 1, true, 'Component has inner title block');
    assert.strictEqual($lookupButtonChoose.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
    assert.strictEqual($lookupButtonChoose.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
    assert.strictEqual($lookupButtonChoose.hasClass('ui-change'), true, 'Component\'s container has \'ui-change\' css-class');
    assert.strictEqual($lookupButtonChoose.hasClass('button'), true, 'Component\'s container has \'button\' css-class');
    assert.equal($lookupButtonChoose.attr('title'), 'Выбрать');

    // Check <clear button>.
    assert.strictEqual($lookupButtonClear.length === 1, true, 'Component has inner title block');
    assert.strictEqual($lookupButtonClear.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
    assert.strictEqual($lookupButtonClear.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
    assert.strictEqual($lookupButtonClear.hasClass('ui-clear'), true, 'Component\'s container has \'ui-clear\' css-class');
    assert.strictEqual($lookupButtonClear.hasClass('button'), true, 'Component\'s container has \'button\' css-class');

    // Check <clear button icon>
    assert.strictEqual($lookupButtonClearIcon.length === 1, true, 'Component has inner title block');
    assert.strictEqual($lookupButtonClearIcon.prop('tagName'), 'I', 'Component\'s title block is a <i>');
    assert.strictEqual($lookupButtonClearIcon.hasClass('remove'), true, 'Component\'s container has \'remove\' css-class');
    assert.strictEqual($lookupButtonClearIcon.hasClass('icon'), true, 'Component\'s container has \'icon\' css-class');
  });

  test('component with readonly renders properly', async function(assert) {
    assert.expect(2);

    await render(hbs`{{flexberry-lookup
      readonly=true
    }}`);

    // Retrieve component, it's inner <input>.
    let $component = this.$().children();
    let $lookupFluid = $component.children('.fluid');
    let $lookupButtonChoose = $lookupFluid.children('.ui-change');
    let $lookupButtonClear = $lookupFluid.children('.ui-clear');

    // Check <choose button>.
    assert.strictEqual($lookupButtonChoose.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');

    // Check <clear button>.
    assert.strictEqual($lookupButtonClear.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');
  });

  test('component with choose-text and remove-text properly', async function(assert) {
    assert.expect(2);
    this.set('tempTextChoose', 'TempText1');
    this.set('tempTextRemove', 'TempText2');

    await render(hbs`{{flexberry-lookup
      chooseText=tempTextChoose
      removeText=tempTextRemove
    }}`);

    let $component = this.$().children();
    let $lookupFluid = $component.children('.fluid');
    let $lookupButtonChoose = $lookupFluid.children('.ui-change');
    let $lookupButtonClear = $lookupFluid.children('.ui-clear');

    // Check <choose button>.
    assert.equal($lookupButtonChoose.text().trim(), 'TempText1');

    // Check <clear button>.
    assert.equal($lookupButtonClear.text().trim(), 'TempText2');
  });

  skip('component mode consistency', function(assert) {
    const checkErrMsg = (err, str) => {
      const msg = isNone(err.message) ? '' : err.message;
      return msg.includes(str);
    };
  
    assert.expect(3);
  
    // Check if both 'autocomplete' and 'dropdown' flags enabled cause an error.
    assert.throws(
      () => {
        this.render(hbs`{{flexberry-lookup
          autocomplete=true
          dropdown=true
        }}`);
      },
      (err) => checkErrMsg(err, 'flags \'autocomplete\' and \'dropdown\' enabled'),
      'Both \'autocomplete\' and \'dropdown\' flags enabled cause an error.');
  
    // Check if both 'dropdown' flag enabled and the block form definition cause an error.
    assert.throws(
      () => {
        this.render(hbs`{{#flexberry-lookup
          dropdown=true
        }}
        {{/flexberry-lookup}}`);
      },
      (err) => checkErrMsg(err, 'flag \'dropdown\' enabled and the block form definition'),
      'Both \'dropdown\' flag enabled and the block form definition cause an error.');
  
    // Check if both 'autocomplete' flag enabled and the block form definition cause an error.
    assert.throws(
      () => {
        this.render(hbs`{{#flexberry-lookup
          autocomplete=true
        }}
        {{/flexberry-lookup}}`);
      },
      (err) => checkErrMsg(err, 'flag \'autocomplete\' enabled and the block form definition'),
      'Both \'autocomplete\' flag enabled and the block form definition cause an error.');
  });

  test('autocomplete doesn\'t send data-requests in readonly mode', async function(assert) {
    assert.expect(1);

    let store = this.owner.lookup('service:store');

    // Override store.query method.
    let ajaxMethodHasBeenCalled = false;
    let originalAjaxMethod = $.ajax;
    $.ajax = function() {
      ajaxMethodHasBeenCalled = true;

      return originalAjaxMethod.apply(this, arguments);
    };

    let asyncOperationsCompleted = assert.async();

    this.set('actions.showLookupDialog', () => {});
    this.set('actions.removeLookupValue', () => {});

    await render(hbs`{{flexberry-lookup
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
  let $componentInput = $('input', $component);

    run(async () => {
      this.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'TestTypeName'
      }));

      let testPromise = new RSVP.Promise((resolve) => {
        ajaxMethodHasBeenCalled = false;

        // Imitate focus on component, which can cause async data-requests.
        focus($componentInput);

        // Wait for some time which can pass after focus, before possible async data-request will be sent.
        later(() => {
          resolve();
        }, 300);
      });

      await testPromise;

      // Check that store.query hasn't been called after focus.
      assert.strictEqual(ajaxMethodHasBeenCalled, false, '$.ajax hasn\'t been called after click on autocomplete lookup in readonly mode');

      // Restore original method.
      $.ajax = originalAjaxMethod;

      asyncOperationsCompleted();
    });
  });

  test('preview button renders properly', async function(assert) {
    assert.expect(11);
  
    let store = this.owner.lookup('service:store');
  
    await render(hbs`{{flexberry-lookup
      value=model
      relationName="parent"
      projection="SuggestionTypeL"
      displayAttributeName="name"
      title="Parent"
      showPreviewButton=true
      previewFormRoute="ember-flexberry-dummy-suggestion-type-edit"
    }}`);
    
    // Retrieve component.
    let $component = this.$().children();
    let $lookupFluid = $component.children('.fluid');

    assert.strictEqual($lookupFluid.children('.ui-preview').length === 0, true, 'Component has inner title block');

    run(() => {
      this.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'TestTypeName'
      }));
  
      let $lookupButtonPreview = $lookupFluid.children('.ui-preview');
      let $lookupButtonPreviewIcon = $lookupButtonPreview.children('.eye');
  
      assert.strictEqual($lookupButtonPreview.length === 1, true, 'Component has inner title block');
      assert.strictEqual($lookupButtonPreview.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
      assert.strictEqual($lookupButtonPreview.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
      assert.strictEqual($lookupButtonPreview.hasClass('ui-preview'), true, 'Component\'s container has \'ui-preview\' css-class');
      assert.strictEqual($lookupButtonPreview.hasClass('button'), true, 'Component\'s container has \'button\' css-class');
      assert.equal($lookupButtonPreview.attr('title'), 'Просмотр');
  
      assert.strictEqual($lookupButtonPreviewIcon.length === 1, true, 'Component has inner title block');
      assert.strictEqual($lookupButtonPreviewIcon.prop('tagName'), 'I', 'Component\'s title block is a <i>');
      assert.strictEqual($lookupButtonPreviewIcon.hasClass('eye'), true, 'Component\'s container has \'eye\' css-class');
      assert.strictEqual($lookupButtonPreviewIcon.hasClass('icon'), true, 'Component\'s container has \'icon\' css-class');
      });
  });

  test('preview button view previewButtonClass and previewText properly', async function(assert) {
    assert.expect(3);
  
    let store = this.owner.lookup('service:store');
  
    run(async () => {
      this.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'TestTypeName'
      }));
  
      this.set('previewButtonClass', 'previewButtonClassTest');
      this.set('previewText', 'previewTextTest');
  
      await render(hbs`{{flexberry-lookup
        value=model
        relationName="parent"
        projection="SuggestionTypeL"
        displayAttributeName="name"
        title="Parent"
        showPreviewButton=true
        previewFormRoute="ember-flexberry-dummy-suggestion-type-edit"
        previewButtonClass=previewButtonClass
        previewText=previewText
      }}`);
  
      // Retrieve component.
      let $component = this.$().children();
      let $lookupFluid = $component.children('.fluid');
      let $lookupButtonPreview = $lookupFluid.children('.ui-preview');
  
      assert.strictEqual($lookupButtonPreview.length === 1, true, 'Component has inner title block');
      assert.strictEqual($lookupButtonPreview.hasClass('previewButtonClassTest'), true, 'Component\'s container has \'previewButtonClassTest\' css-class');
      assert.equal($lookupButtonPreview.text().trim(), 'previewTextTest');
    });
  });

  test('preview with readonly renders properly', async function(assert) {
    assert.expect(1);

    let store = this.owner.lookup('service:store');

    run(async () => {
      this.set('model', store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'TestTypeName'
      }));

      await render(hbs`{{flexberry-lookup
        value=model
        relationName="parent"
        projection="SuggestionTypeL"
        displayAttributeName="name"
        title="Parent"
        showPreviewButton=true
        previewFormRoute="ember-flexberry-dummy-suggestion-type-edit"
        readonly=true
      }}`);

      // Retrieve component.
      let $component = this.$().children();
      let $lookupFluid = $component.children('.fluid');
      let $lookupButtonPreview = $lookupFluid.children('.ui-preview');
  
      assert.strictEqual($lookupButtonPreview.hasClass('disabled'), false, 'Component\'s container has not \'disabled\' css-class');
    });
  });

  skip('autocompleteDirection adds no css-class if autocompleteDirection is not defined', async function(assert) {
    let store = this.owner.lookup('service:store');

    run(() => {
      set(this, 'model', store.createRecord('ember-flexberry-dummy-suggestion', {
        name: 'TestTypeName'
      }));
    });

    await render(hbs`{{flexberry-lookup
      value=model.type
      relationName="parent"
      projection="SettingLookupExampleView"
      displayAttributeName="name"
      title="Parent"
      autocomplete=true
      relatedModel=model
      relationName="type"
    }}`);

    let $resultAutocomplete = this.element.querySelector('div.results');
    assert.equal($resultAutocomplete.length, 1, 'Component has autocomplete window.');
    assert.notOk($resultAutocomplete.classList.contains('visible'), 'Autocomplete window is not visible until we start typing.');

    // let $lookupField = this.element.querySelector('input.lookup-field');
    let $lookupField = this.$('input.lookup-field');
    await fillIn($lookupField, 'gghj');

    let done = assert.async();
    later(() => {
      assert.ok($resultAutocomplete.classList.contains('visible'), 'Autocomplete window is now visible.');
      assert.notOk($resultAutocomplete.classList.contains('upward'), 'Autocomplete window has no extra class.');
      done();
    }, 5000);
  });

  skip('autocompleteDirection adds css-class if autocompleteDirection is defined as upward', async function(assert) {
    let store = this.owner.lookup('service:store');

    await run(async () => {
      set(this, 'model', store.createRecord('ember-flexberry-dummy-suggestion', {
        name: 'TestTypeName'
      }));

      set(this, 'autocompleteDirection', undefined);
      await render(hbs`{{flexberry-lookup
        value=model.type
        relationName="parent"
        projection="SettingLookupExampleView"
        displayAttributeName="name"
        title="Parent"
        autocomplete=true
        autocompleteDirection="upward"
        relatedModel=model
        relationName="type"
      }}`);
    });

    let $resultAutocomplete = this.element.querySelector('div.results');
    assert.equal($resultAutocomplete !== null, true, 'Component has autocomplete window.');
    assert.equal($resultAutocomplete.classList.contains('visible'), false, 'Autocomplete window is not visible until we start typing.');

    let $lookupField = this.element.querySelector('input.lookup-field');
    await fillIn($lookupField, 'g');

    let asyncOperationsCompleted = assert.async();
    later(() => {
      asyncOperationsCompleted();
      assert.equal($resultAutocomplete.classList.contains('visible'), true, 'Autocomplete window is now visible.');
      assert.equal($resultAutocomplete.classList.contains('upward'), true, 'Autocomplete window has extra class.');
    }, 5000);
  });

  skip('autocompleteDirection adds no css-class if autocompleteDirection is defined as downward', async function(assert) {
    let store = this.owner.lookup('service:store');

    run(async () => {
      set(this, 'model', store.createRecord('ember-flexberry-dummy-suggestion', {
        name: 'TestTypeName'
      }));

      await render(hbs`{{flexberry-lookup
        value=model.type
        relationName="parent"
        projection="SettingLookupExampleView"
        displayAttributeName="name"
        title="Parent"
        autocomplete=true
        autocompleteDirection="downward"
        relatedModel=model
        relationName="type"
      }}`);
    });

    let $resultAutocomplete = this.$('div.results');
    assert.equal($resultAutocomplete.length, 1, 'Component has autocomplete window.');
    assert.equal($resultAutocomplete.hasClass('visible'), false, 'Autocomplete window is not visible until we start typing.');
  
    let $lookupField = this.$('input.lookup-field');
    fillIn($lookupField, 'g');

    let asyncOperationsCompleted = assert.async();
    later(function() {
      asyncOperationsCompleted();
      assert.equal($resultAutocomplete.hasClass('visible'), true, 'Autocomplete window is now visible.');
      assert.equal($resultAutocomplete.hasClass('upward'), false, 'Autocomplete window has no extra class.')
    }, 5000);
  });
});
