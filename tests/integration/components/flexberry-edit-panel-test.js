import $ from 'jquery';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | flexberry edit panel', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Register translations
    this.owner.register('locale:ru/translations', I18nRuLocale);
    this.owner.register('locale:en/translations', I18nEnLocale);
    this.owner.register('service:i18n', I18nService);

    // Inject i18n service into all components
    Component.reopen({
      i18n: service('i18n')
    });

    // Set language to English for tests
    this.owner.lookup('service:i18n').set('locale', 'en');
  });

  // Helper method to check panel buttons.
  let checkPanelButtons = function($panelButtons, panelButtons, assert, isCustomButtons = false) {
    $panelButtons.each(function(i) {
      const $item = $(this);
      const expectButton = panelButtons[i];
      let buttonCaption = expectButton.text;
      if (!isCustomButtons) {
        buttonCaption = expectButton.text.string;
      }

      assert.strictEqual($item.prop('tagName'), 'BUTTON', `Component's button wrapper is a <button>`);
      assert.ok($item.hasClass('ui button'), 'Component\'s button has \'ui button\' class');
      assert.ok($item.hasClass(expectButton.class), `Component's button class is a ${expectButton.class}`);
      assert.strictEqual($.trim($item.text()), buttonCaption, `Component's button caption is a ${buttonCaption}`);

      if (expectButton.class !== 'close-button') {
        assert.strictEqual($item.attr('type'), expectButton.type, `Components type is a ${expectButton.type}`);
      }
    });
  };

  const panelButtons = [{
    type: 'submit',
    class: 'button-one-class',
    disabled: false,
    text: 'buttonOneCaption',
    action: 'firstButtonClick',
  }, {
    type: 'submit',
    class: 'button-two-class',
    disabled: false,
    text: 'buttonTwoCaption',
    action: 'save',
  }, {
    type: 'submit',
    class: 'button-three-class',
    disabled: false,
    text: 'buttonThreeCaption',
    action: 'threeButtonClick',
  }, {
    type: 'submit',
    class: 'button-four-class',
    disabled: false,
    text: 'buttonFourCaption',
    action: 'save',
  }, {
    type: 'submit',
    class: 'button-five-class',
    disabled: true,
    text: 'buttonFive',
    action: 'save',
  }];

  test('flexberry-edit-panel with default buttons renders properly', async function(assert) {
    assert.expect(21);
    let i18n = this.owner.lookup('service:i18n');

    // Create objects for testing.
    const panelButtons = [{
      type: 'submit',
      class: 'save-button',
      disabled: false,
      text: i18n.t('forms.edit-form.save-button-text'),
      action: 'save',
    }, {
      type: 'submit',
      class: 'save-close-button',
      disabled: false,
      text: i18n.t('forms.edit-form.saveAndClose-button-text'),
      action: 'save',
    }, {
      type: 'submit',
      class: 'save-del-button',
      disabled: false,
      text: i18n.t('forms.edit-form.delete-button-text'),
      action: 'save',
    }];
    this.set('panelButtons', panelButtons);

    // Render component.
    await render(hbs`{{flexberry-edit-panel
      showCloseButton=true
      deepMount=true
      buttons=panelButtons
    }}`);

    panelButtons.push({
      class: 'close-button',
      text: i18n.t('forms.edit-form.close-button-text')
    });
    // Retrieve component.
    const $component = $(this.element).children();

    // Check wrapper <div>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.ok($component.hasClass('flexberry-edit-panel'), 'Component\'s wrapper has \'flexberry-edit-panel\' css-class');

    // Check component's buttons.
    const $panelButtons = $component.children('button');
    checkPanelButtons($panelButtons, panelButtons, assert);
  });

  test('flexberry-edit-panel with custom buttons renders properly', async function(assert) {
    assert.expect(24);

    // Create objects for testing.
    this.set('panelButtons', panelButtons);

    // Render component.
    await render(hbs`{{flexberry-edit-panel
      showCloseButton=false
      deepMount=true
      buttons=panelButtons
    }}`);

    // Retrieve component.
    const $component = $(this.element).children();

    // Check wrapper <div>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.ok($component.hasClass('flexberry-edit-panel'), 'Component\'s wrapper has \' flexberry-edit-panel\' css-class');

    // Check component's captions.
    const $panelButtons = $component.children('button');
    const $menuButtons = $component.children('ui dropdown.menu-buttons');
    assert.strictEqual($panelButtons.length, panelButtons.length - 1, 'Component\'s buttons');
    assert.strictEqual($menuButtons.length, 0, 'Component\'s dropdown');

    checkPanelButtons($panelButtons, panelButtons, assert, true);
  });

  test('flexberry-edit-panel with custom buttons and dropdown renders properly', async function(assert) {
    assert.expect(20);

    // Create objects for testing.
    this.set('panelButtons', panelButtons);

    $('.ember-application').width(360);

    // Render component.
    await render(hbs`{{flexberry-edit-panel
      showCloseButton=false
      deepMount=true
      buttons=panelButtons
    }}`);

    // Retrieve component.
    const $component = $(this.element).children();

    // Check wrapper <div>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.ok($component.hasClass('flexberry-edit-panel'), 'Component\'s wrapper has \' flexberry-edit-panel\' css-class');

    // Check component's captions.
    const $panelButtons = $component.children('button');
    const $menuButtons = $component.children('.ui.dropdown.menu-buttons');

    assert.strictEqual($panelButtons.length, 2, 'Component\'s buttons');
    assert.strictEqual($menuButtons.length, 1, 'Component\'s dropdown');

    checkPanelButtons($panelButtons, panelButtons.slice(0, 2), assert, true);

    const $menuItems = $menuButtons.children('.button-dropdown-menu').children('.item');
    const menuItems = panelButtons.slice(2);
    $menuItems.each(function(i) {
      const $item = $(this);
      const expectButton = menuItems[i];

      assert.strictEqual($item.prop('tagName'), 'DIV', `Component's button wrapper is a <div>`);
      assert.ok($item.hasClass(expectButton.class), `Component's dropdown item class is a ${expectButton.class}`);
      assert.strictEqual($.trim($item.text()), expectButton.text, `Component's dropdown item caption is a ${expectButton.text}`);
    });
  });

  test('flexberry-edit-panel with custom buttons and dropdown actions', async function(assert) {
    assert.expect(1);
  
    this.set('actions', {
      buttonClick(className) {
        $('.button-two-class').addClass(className);
      }
    });
  
    panelButtons[0].action = 'firstButtonClick';
    panelButtons[2].action = 'threeButtonClick';
  
    // Create objects for testing.
    this.set('panelButtons', panelButtons);
  
    // Render component.
    await render(hbs`{{flexberry-edit-panel
      showCloseButton=false
      deepMount=false
      buttons=panelButtons
      firstButtonClick=(action "buttonClick" "first-button-clicked")
    }}`);
  
    // Retrieve component.
    const $component = $(this.element).children();
    const $panelButtons = $component.children('button');
  
    await run(() => {
      $panelButtons[0].click();
    });
  
    assert.ok($('.button-two-class').hasClass('first-button-clicked'), 'Component has css-class \'first-button-clicked\' after click');
  });
});


