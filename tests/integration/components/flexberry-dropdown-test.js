import $ from 'jquery';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { A } from '@ember/array';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';
import TestAdapter from '@ember/test/adapter';
import { get } from '@ember/object';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const animationDuration = $.fn.dropdown.settings.duration + 100;

moduleForComponent('flexberry-dropdown', 'Integration | Component | flexberry dropdown', {
  integration: true,

  beforeEach: function () {
    this.register('locale:ru/translations', I18nRuLocale);
    this.register('locale:en/translations', I18nEnLocale);
    this.register('service:i18n', I18nService);

    this.inject.service('i18n', { as: 'i18n' });
    Component.reopen({
      i18n: service('i18n')
    });

    // Set 'ru' as initial locale.
    this.set('i18n.locale', 'ru');
  }
});

// Helper method to expand flexberry-dropdown.
let expandDropdown = function(options) {
  options = options || {};

  let $component = options.dropdown;
  let $menu = $component.children('div.menu');

  let callbacks = A(options.callbacks || []);

  return new RSVP.Promise((resolve, reject) => {

    // Click on component to trigger expand animation.
    run(() => {
      $component.click();

      // Set timeouts for possibly defined additional callbacks.
      callbacks.forEach((callback) => {
        setTimeout(callback.callback, callback.timeout);
      });

      // Set timeout for end of expand animation.
      setTimeout(() => {
        if ($component.hasClass('active') && $component.hasClass('visible') && $menu.hasClass('visible')) {
          resolve();
        } else {
          reject(new Error('flexberry-dropdown\'s menu isn\'t expanded'));
        }
      }, animationDuration);
    });
  });
};

// Helper method to select item with specified caption from already expanded flexberry-dropdown's menu.
let selectDropdownItem = function(options) {
  options = options || {};

  let $component = options.dropdown;
  let $menu = $component.children('div.menu');

  let itemCaption = options.itemCaption;
  let callbacks = A(options.callbacks || []);

  return new RSVP.Promise((resolve, reject) => {

    // To select some item, menu must be expanded.
    if (!($component.hasClass('active') && $component.hasClass('visible') && $menu.hasClass('visible'))) {
      reject(new Error('flexberry-dropdown\'s menu isn\'t expanded'));
    }

    // To select some item, menu must contain such item (with the specified caption).
    let $item = $('.item:contains(' + itemCaption + ')', $menu);
    if ($item.length === 0) {
      reject(new Error('flexberry-dropdown\'s menu doesn\'t contain item with caption \'' + itemCaption + '\''));
    }

    // Click on item to select it & trigger collapse animation.
    run(() => {
      $item.click();

      // Set timeouts for possibly defined additional callbacks.
      callbacks.forEach((callback) => {
        setTimeout(callback.callback, callback.timeout);
      });

      // Set timeout for end of collapse animation.
      setTimeout(() => {
        if (!($component.hasClass('active') || $component.hasClass('visible') || $menu.hasClass('visible'))) {
          resolve();
        } else {
          reject(new Error('flexberry-dropdown\'s menu isn\'t collapsed'));
        }
      }, animationDuration);
    });
  });
};

test('it renders properly', function(assert) {
  assert.expect(14);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    class=class
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownIcon = $component.children('i.icon');
  let $dropdownText = $component.children('div.text');
  let $dropdownMenu = $component.children('div.menu');

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-dropdown'), true, 'Component\'s wrapper has \' flexberry-dropdown\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('selection'), true, 'Component\'s wrapper has \'selection\' css-class');
  assert.strictEqual($component.hasClass('dropdown'), true, 'Component\'s wrapper has \'dropdown\' css-class');
  assert.strictEqual($dropdownIcon.hasClass('dropdown icon'), true, 'Component\'s wrapper has \'dropdown icon\' css-class');
  assert.strictEqual($dropdownText.hasClass('default text'), true, 'Component\'s wrapper has \'default text\' css-class');
  assert.strictEqual($dropdownMenu.hasClass('menu'), true, 'Component\'s wrapper has \'menu\' css-class');

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'scrolling compact fluid';
  this.set('class', additioanlCssClasses);
  /* eslint-disable no-unused-vars */
  A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */

  // Clean up wrapper's additional CSS-classes.
  this.set('class', '');
  /* eslint-disable no-unused-vars */
  A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    false,
    'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */
});

test('it renders i18n-ed placeholder', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-dropdown}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownText = $component.children('div.default.text');

  // Check <dropdown>'s placeholder.
  assert.strictEqual(
    $.trim($dropdownText.text()),
    get(I18nRuLocale, 'components.flexberry-dropdown.placeholder'),
    'Component\'s inner <dropdown>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

  // Change current locale to 'en' & check <dropdown>'s placeholder again.
  this.set('i18n.locale', 'en');
  assert.strictEqual(
    $.trim($dropdownText.text()),
    get(I18nEnLocale, 'components.flexberry-dropdown.placeholder'),
    'Component\'s inner <dropdown>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
});

test('it renders manually defined placeholder', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    placeholder=placeholder
  }}`);

  // Set <dropdown>'s placeholder' & render component.
  let placeholder = 'please type some text';
  this.set('placeholder', placeholder);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownText = $component.children('div.default.text');

  // Check <dropdown>'s placeholder.
  assert.strictEqual(
    $.trim($dropdownText.text()), placeholder);

  // Change placeholder's value & check <dropdown>'s placeholder again.
  placeholder = 'dropdown has no value';
  this.set('placeholder', placeholder);
  assert.strictEqual($.trim($dropdownText.text()), placeholder);
});

test('readonly mode works properly', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    readonly=true
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownMenu = $component.children('div.menu');

  // Activate readonly mode & check that readonly (disabled) attribute exists now & has value equals to 'readonly'.
  assert.strictEqual($component.hasClass('disabled'), true, 'Component\'s has readonly');

  // Check that component is disabled.
  /* eslint-disable no-unused-vars */
  new RSVP.Promise(() => {
    run(() => {
      $component.click();
    });

    run(() => {
      let animation = assert.async();
      setTimeout(() => {
        assert.strictEqual($dropdownMenu.hasClass('animating'), false, 'Component is not active');

        animation();

      }, animationDuration / 2);
    });
  });
  /* eslint-enable no-unused-vars */
});

test('needChecksOnValue mode properly', function(assert) {
  let exceptionHandler = TestAdapter.exception;
  TestAdapter.exception = (error) => {
    throw error;
  };

  // Create array for testing.
  let itemsArray = ['Caption1', 'Caption2', 'Caption3'];
  this.set('itemsArray', itemsArray);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    value=value
    items=itemsArray
    needChecksOnValue=needChecksOnValue
  }}`);

  // Change property binded to 'value' & check them.
  this.set('needChecksOnValue', true);
  let newValue = 'Caption4';

  // Check that errors handled properly.
  assert.throws(() => { this.set('value', newValue); }, new RegExp(newValue));

  TestAdapter.exception = exceptionHandler;
});

test('dropdown with items represented by object renders properly', function(assert) {
  assert.expect(3);

  // Create objects for testing.
  let itemsObject = {
    item1: 'Caption1',
    item2: 'Caption2',
    item3: 'Caption3'
  };
  this.set('itemsObject', itemsObject);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    items=itemsObject
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownMenu = $component.children('div.menu');
  let $dropdownItem = $dropdownMenu.children('div.item');

  // Check component's captions and objects.
  let itemsObjectKeys = Object.keys(itemsObject);
  $dropdownItem.each(function(i) {
    let $item = $(this);
    let itemKey = itemsObjectKeys[i];

    // Check that the captions matches the objects.
    assert.strictEqual($item.attr('data-value'), itemKey, 'Component\'s item\'s сaptions matches the objects');
  });
});

test('dropdown with items represented by array renders properly', function(assert) {
  assert.expect(3);

  // Create array for testing.
  let itemsArray = ['Caption1', 'Caption2', 'Caption3'];
  this.set('itemsArray', itemsArray);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    items=itemsArray
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownMenu = $component.children('div.menu');
  let $dropdownItem = $dropdownMenu.children('div.item');

  // Check component's captions and array.
  $dropdownItem.each(function(i) {
    let $item = $(this);

    // Check that the captions matches the array.
    assert.strictEqual($item.attr('data-value'), String(i), 'Component\'s item\'s сaptions matches the array');
  });
});

test('expand animation works properly', function(assert) {
  assert.expect(9);

  // Create array for testing.
  let itemsArray = ['Caption1', 'Caption2', 'Caption3'];
  this.set('itemsArray', itemsArray);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    items=itemsArray
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownMenu = $component.children('div.menu');

  // Check that component is collapsed by default.
  assert.strictEqual($component.hasClass('active'), false, 'Component hasn\'t class \'active\'');
  assert.strictEqual($component.hasClass('visible'), false, 'Component hasn\'t class \'visible\'');
  assert.strictEqual($dropdownMenu.hasClass('visible'), false, 'Component\'s menu hasn\'t class \'visible\'');
  assert.strictEqual($dropdownMenu.hasClass('hidden'), false, 'Component\'s menu hasn\'t class \'hidden\'');

  let asyncAnimationsCompleted = assert.async();
  expandDropdown({
    dropdown: $component,
    callbacks: [{
      timeout: animationDuration / 2,
      callback: () => {

        // Check that component is animating now.
        assert.strictEqual($dropdownMenu.hasClass('animating'), true, 'Component has class \'animating\' during expand animation');
      }
    }]
  }).then(() => {

    // Check that component is expanded now.
    assert.strictEqual($component.hasClass('active'), true, 'Component has class \'active\'');
    assert.strictEqual($component.hasClass('visible'), true, 'Component has class \'visible\'');
    assert.strictEqual($dropdownMenu.hasClass('visible'), true, 'Component\'s menu has class \'visible\'');
    assert.strictEqual($dropdownMenu.hasClass('hidden'), false, 'Component\'s menu hasn\'t class \'hidden\'');
  }).catch((e) => {
    // Error output.
    assert.ok(false, e);
  }).finally(() => {
    asyncAnimationsCompleted();
  });
});

test('collapse animation works properly', function(assert) {
  assert.expect(9);

  // Create array for testing.
  let itemsArray = ['Caption1', 'Caption2', 'Caption3'];
  this.set('itemsArray', itemsArray);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    items=itemsArray
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownMenu = $component.children('div.menu');

  let asyncAnimationsCompleted = assert.async();
  expandDropdown({
    dropdown: $component
  }).then(() => {

    // Check that component is expanded now.
    assert.strictEqual($component.hasClass('active'), true, 'Component has class \'active\'');
    assert.strictEqual($component.hasClass('visible'), true, 'Component has class \'visible\'');
    assert.strictEqual($dropdownMenu.hasClass('visible'), true, 'Component\'s menu has class \'visible\'');
    assert.strictEqual($dropdownMenu.hasClass('hidden'), false, 'Component\'s menu hasn\'t class \'hidden\'');

    // Collapse component.
    let itemCaption = itemsArray[1];
    return selectDropdownItem({
      dropdown: $component,
      itemCaption: itemCaption,
      callbacks: [{
        timeout: animationDuration / 2,
        callback: () => {

          // Check that component is animating now.
          assert.strictEqual($dropdownMenu.hasClass('animating'), true, 'Component has class \'animating\' during collapse animation');
        }
      }]
    });
  }).then(() => {

    // Check that component is collapsed now.
    assert.strictEqual($component.hasClass('active'), false, 'Component hasn\'t class \'active\'');
    assert.strictEqual($component.hasClass('visible'), false, 'Component hasn\'t class \'visible\'');
    assert.strictEqual($dropdownMenu.hasClass('visible'), false, 'Component\'s menu hasn\'t class \'visible\'');
    assert.strictEqual($dropdownMenu.hasClass('hidden'), true, 'Component\'s menu has class \'hidden\'');
  }).catch((e) => {
    // Error output.
    assert.ok(false, e);
  }).finally(() => {
    asyncAnimationsCompleted();
  });
});

test('changes in inner <dropdown> causes changes in property binded to \'value\'', function(assert) {
  assert.expect(5);

  // Create array for testing.
  let itemsArray = ['Caption1', 'Caption2', 'Caption3'];
  this.set('itemsArray', itemsArray);
  this.set('value', null);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    items=itemsArray
    value=value
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownMenu = $component.children('div.menu');

  // Caption of the item to be selected.
  let itemCaption = itemsArray[2];

  // Select item & perform all necessary checks.
  let asyncAnimationsCompleted = assert.async();
  expandDropdown({
    dropdown: $component
  }).then(() => {

    // Select item & collapse component.
    return selectDropdownItem({
      dropdown: $component,
      itemCaption: itemCaption
    });
  }).then(() => {
    let $selectedItems = $dropdownMenu.children('div.item.active.selected');
    let $selectedItem = $($selectedItems[0]);
    let $dropdownText = $component.children('div.text');

    // Check that specified item is selected now & it is the only one selected item.
    assert.strictEqual($selectedItems.length, 1, 'Only one component\'s item is active');
    assert.strictEqual($.trim($selectedItem.text()), itemCaption, 'Selected item\'s caption is \'' + itemCaption + '\'');

    // Check that dropdown's text <div> has text equals to selected item's caption.
    assert.strictEqual($dropdownText.hasClass('default'), false, 'Component\'s text <div> hasn\'t class \'default\'');
    assert.strictEqual($.trim($dropdownText.text()), itemCaption, 'Component\'s text <div> has content equals to selected item \'' + itemCaption + '\'');

    // Check that related model's value binded to dropdown is equals to selected item's caption.
    assert.strictEqual(this.get('value'), itemCaption, 'Related model\'s value binded to dropdown is \'' + itemCaption + '\'');
  }).catch((e) => {
    // Error output.
    assert.ok(false, e);
  }).finally(() => {
    asyncAnimationsCompleted();
  });
});

test('changes in inner <dropdown> causes call to \'onChange\' action', function(assert) {
  assert.expect(2);

  // Create array for testing.
  let itemsArray = ['Caption1', 'Caption2', 'Caption3'];
  this.set('itemsArray', itemsArray);
  this.set('value', null);

  let onChangeHasBeenCalled = false;
  let onChangeArgument;
  this.set('actions.onDropdownChange', (e) => {
    onChangeHasBeenCalled = true;
    onChangeArgument = e;
  });

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    value=value
    items=itemsArray
    onChange = (action \"onDropdownChange\")
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Caption of the item to be selected.
  let itemCaption = itemsArray[2];

  // Select item & perform all necessary checks.
  let asyncAnimationsCompleted = assert.async();
  expandDropdown({
    dropdown: $component
  }).then(() => {

    // Select item & collapse component.
    return selectDropdownItem({
      dropdown: $component,
      itemCaption: itemCaption
    });
  }).then(() => {

    // Check that 'onChange' action has been called.
    assert.strictEqual(onChangeHasBeenCalled, true, 'Component\'s \'onChange\' action has been called');
    assert.strictEqual(onChangeArgument, itemCaption, 'Component\'s \'onChange\' action has been called with \'' + itemCaption + '\' as argument');
  }).catch((e) => {
    // Error output.
    assert.ok(false, e);
  }).finally(() => {
    asyncAnimationsCompleted();
  });
});
