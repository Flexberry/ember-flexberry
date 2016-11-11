import Ember from 'ember';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const animationDuration = Ember.$.fn.dropdown.settings.duration + 100;

moduleForComponent('flexberry-dropdown', 'Integration | Component | flexberry dropdown', {
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
  }
});

test('it renders properly', function(assert) {
  assert.expect(15);

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
  assert.strictEqual($component.hasClass('ember-view'), true, 'Component\'s wrapper has \'ember-view\' css-class');
  assert.strictEqual($component.hasClass('dropdown'), true, 'Component\'s wrapper has \'dropdown\' css-class');
  assert.strictEqual($dropdownIcon.hasClass('dropdown icon'), true, 'Component\'s wrapper has \'dropdown icon\' css-class');
  assert.strictEqual($dropdownText.hasClass('default text'), true, 'Component\'s wrapper has \'default text\' css-class');
  assert.strictEqual($dropdownMenu.hasClass('menu'), true, 'Component\'s wrapper has \'menu\' css-class');

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'scrolling compact fluid';
  this.set('class', additioanlCssClasses);
  Ember.A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
  });

  // Clean up wrapper's additional CSS-classes.
  this.set('class', '');
  Ember.A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    false,
    'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
  });
});

test('placeholder', function (assert) {

});

test('readonly mode works properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    class=class
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check that readonly (disabled) attribute doesn't exist yet.
  assert.strictEqual($component.hasClass('disabled'), false, 'Component\'s hasn\'t readonly');

  // Activate readonly mode & check that readonly (disabled) attribute exists now & has value equals to 'readonly'.
  this.set('class', 'disabled');
  assert.strictEqual($component.hasClass('disabled'), true, 'Component\'s has readonly');

  // Check that readonly (disabled) attribute doesn't exist now.
  this.set('class', '');
  assert.strictEqual($component.hasClass('disabled'), false, 'Component\'s hasn\'t readonly');
});

test('itemsObject render properly', function(assert) {
  assert.expect(4);

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
  let $dropdomnItem = $dropdownMenu.children('div.item');

  // Check that  class 'item' in <menu> exist.
  assert.strictEqual($dropdomnItem.hasClass('item'), true, 'Component\'s has class');

  // Check component's captions and objects.
  let itemsObjectKeys = Object.keys(itemsObject);
  $dropdomnItem.each(function(i) {
    let $item = Ember.$(this);
    let itemKey = itemsObjectKeys[i];
    let itemCaption = itemsObject[itemKey];

    // Check that the captions matches the objects.
    assert.strictEqual($item.attr('data-value'), itemCaption, 'Component\'s item\'s сaptions matches the objects');
  });
});

test('itemsArray render properly', function(assert) {
  assert.expect(4);

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
  let $dropdomnItem = $dropdownMenu.children('div.item');

  // Check that  class 'item' in <menu> exist.
  assert.strictEqual($dropdomnItem.hasClass('item'), true, 'Component\'s has class');

  // Check component's captions and array.
  $dropdomnItem.each(function(i) {
    let $item = Ember.$(this);
    let itemCaption = itemsArray[i];

    // Check that the captions matches the array.
    assert.strictEqual($item.attr('data-value'), itemCaption, 'Component\'s item\'s сaptions matches the array');
  });
});

test('animation dropdown without selecting a value', function(assert) {
  assert.expect(10);

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
  assert.strictEqual($component.hasClass('upward'), false, 'net');
  assert.strictEqual($component.hasClass('active'), false, 'net');
  assert.strictEqual($component.hasClass('visible'), false, 'net');
  assert.strictEqual($dropdownMenu.hasClass('transition'), false, 'net');
  assert.strictEqual($dropdownMenu.hasClass('visible'), false, 'net');

  let menuAnimationCompleted = new Ember.RSVP.Promise((resolve, reject) => {
    // Try to expand component.
    // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
    Ember.run(() => {
      $component.click();
    });

    // Wait animation to check component's state.
    Ember.run(() => {
      let animation = assert.async();
      setTimeout(() => {
        // Check that component is animating now.
        assert.strictEqual($dropdownMenu.hasClass('animating'), true);

        // Tell to test method that asynchronous operation completed.
        animation();

      }, animationDuration / 2);
    });

    // Wait for expand animation to be completed & check component's state.
    Ember.run(() => {
      let animationCompleted = assert.async();
      setTimeout(() => {
        // Check that component is expanded now.
        assert.strictEqual($component.hasClass('active'), true);
        assert.strictEqual($dropdownMenu.hasClass('visible'), true);

        // Tell to test method that asynchronous operation completed.
        animationCompleted();

        // Resolve 'menuAnimationCompleted' promise.
        resolve();
      }, animationDuration);
    });
  });

  // Wait animation to be completed (when resolve will be called inside previous timeout).
  // Then try to collapse component.
  menuAnimationCompleted.then(() => {
    // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
    Ember.run(() => {
      $component.click();
    });

    // Wait for collapse animation to be completed & check component's state.
    Ember.run(() => {
      let animationCompleted = assert.async();
      setTimeout(() => {
        // Check that component is expanded now.
        assert.strictEqual($component.hasClass('active'), false);
        assert.strictEqual($dropdownMenu.hasClass('visible'), false);

        animationCompleted();
      }, animationDuration);
    });
  });
});

test('animation dropdown with selecting a value', function(assert) {

  // Create array for testing.
  let itemsArray = ['Caption1'];
  this.set('itemsArray', itemsArray);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    items=itemsArray
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownMenu = $component.children('div.menu');
  let $dropdownText = $component.children('div.text');
  let $dropdomnItem = $dropdownMenu.children('div.item');

  let menuAnimationCompleted = new Ember.RSVP.Promise((resolve, reject) => {
    // Try to expand component.
    // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
    Ember.run(() => {
      $component.click();
    });

    // Wait animation to check component's state.
    Ember.run(() => {
      let animation = assert.async();
      setTimeout(() => {
        // Check that component is animating now.
        assert.strictEqual($dropdownMenu.hasClass('animating'), true);

        // Tell to test method that asynchronous operation completed.
        animation();

      }, animationDuration / 2);
    });

    // Wait for expand animation to be completed & check component's state.
    Ember.run(() => {
      let animationCompleted = assert.async();
      setTimeout(() => {

        // Tell to test method that asynchronous operation completed.
        animationCompleted();

        // Resolve 'menuAnimationCompleted' promise.
        resolve();
      }, animationDuration);
    });
  });

  let itemAnimationCompleted = new Ember.RSVP.Promise((resolve, reject) => {
    // Try to expand component.
    // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
    Ember.run(() => {
      $dropdomnItem.click();
    });

    // Wait animation to check component's state.
    Ember.run(() => {
      let animation = assert.async();
      setTimeout(() => {
        // Check that component is animating now.
        assert.strictEqual($dropdownMenu.hasClass('animating'), true);

        // Tell to test method that asynchronous operation completed.
        animation();

      }, animationDuration / 2);
    });

    // Wait for expand animation to be completed & check component's state.
    Ember.run(() => {
      let animationCompleted = assert.async();
      setTimeout(() => {
        // Check that component is expanded now.
        assert.strictEqual($dropdownMenu.hasClass('visible'), true);
        assert.strictEqual($dropdomnItem.hasClass('active'), true);
        assert.strictEqual($dropdomnItem.hasClass('selected'), true);

        // Tell to test method that asynchronous operation completed.
        animationCompleted();

        // Resolve 'menuAnimationCompleted' promise.
        resolve();
      }, animationDuration);
    });
  });

  // Wait animation to be completed (when resolve will be called inside previous timeout).
  // Then try to collapse component.
  itemAnimationCompleted.then(() => {
    // Wait for collapse animation to be completed & check component's state.
    Ember.run(() => {
      let animationCompleted = assert.async();
      setTimeout(() => {
        // Check that component is expanded now.
        assert.strictEqual($dropdownText.hasClass('default text'), false);
        assert.strictEqual($dropdownText.hasClass('text'), true);
        assert.strictEqual($dropdownMenu.hasClass('hidden'), true);
        assert.strictEqual($dropdomnItem.hasClass('active'), true);
        assert.strictEqual($dropdomnItem.hasClass('selected'), true);

        animationCompleted();
      }, animationDuration);
    });
  });
});
