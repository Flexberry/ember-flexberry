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

test('it renders i18n-ed placeholder', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    class=class
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownText = $component.children('div.default.text');

  // Check <dropdown>'s placeholder.
  assert.strictEqual(
    Ember.$.trim($dropdownText.text()),
    Ember.get(I18nRuLocale, 'components.flexberry-dropdown.placeholder'),
    'Component\'s inner <dropdown>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

  // Change current locale to 'en' & check <dropdown>'s placeholder again.
  this.set('i18n.locale', 'en');
  assert.strictEqual(
    Ember.$.trim($dropdownText.text()),
    Ember.get(I18nEnLocale, 'components.flexberry-dropdown.placeholder'),
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
    Ember.$.trim($dropdownText.text()), placeholder);

  // Change placeholder's value & check <dropdown>'s placeholder again.
  placeholder = 'dropdown has no value';
  this.set('placeholder', placeholder);
  assert.strictEqual(Ember.$.trim($dropdownText.text()), placeholder);
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
  new Ember.RSVP.Promise((resolve, reject) => {
    Ember.run(() => {
      $component.click();
    });

    Ember.run(() => {
      let animation = assert.async();
      setTimeout(() => {
        assert.strictEqual($dropdownMenu.hasClass('animating'), false, 'Component is not active');

        animation();

      }, animationDuration / 2);
    });
  });
});

test('needChecksOnValue mode properly', function(assert) {
  assert.expect(2);

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
  let latestLoggerErrorMessage;
  Ember.Logger.error = function(message) {
    latestLoggerErrorMessage = message;
  };

  // Check that errors handled properly.
  this.set('value', newValue);
  assert.strictEqual(Ember.typeOf(latestLoggerErrorMessage) === 'string', true, 'Check message exists');
  assert.strictEqual(latestLoggerErrorMessage.indexOf(newValue) > 0, true, 'Invalide value exists');
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
    let $item = Ember.$(this);
    let itemKey = itemsObjectKeys[i];
    let itemCaption = itemsObject[itemKey];

    // Check that the captions matches the objects.
    assert.strictEqual($item.attr('data-value'), itemCaption, 'Component\'s item\'s сaptions matches the objects');
  });
});

test('dropdown with items represented by array renders properlyy', function(assert) {
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
    let $item = Ember.$(this);
    let itemCaption = itemsArray[i];

    // Check that the captions matches the array.
    assert.strictEqual($item.attr('data-value'), itemCaption, 'Component\'s item\'s сaptions matches the array');
  });
});

// Call animation for component & check that animation handled properly.
function clickOnDropdown(assert, resolve, $dropdownItem, $component, $dropdownMenu) {

  // Wait animation to check component's state.
  Ember.run(() => {
    let animation = assert.async();
    setTimeout(() => {
      // Check that component is animating now.
      if ($dropdownMenu) {
        assert.strictEqual($dropdownMenu.hasClass('animating'), true, 'Component has class \'animating\'');
      }

      // Tell to test method that asynchronous operation completed.
      animation();

    }, animationDuration / 2);
  });

  // Wait for expand animation to be completed & check component's state.
  Ember.run(() => {
    let animationCompleted = assert.async();
    setTimeout(() => {
      // Check that component is expanded now.
      if ($component) {
        assert.strictEqual($component.hasClass('active'), true, 'Component has class \'active\'');
      }

      if ($dropdownMenu) {
        assert.strictEqual($dropdownMenu.hasClass('visible'), true, 'Component\'s menu has class \'visible\'');
      }

      if ($dropdownItem) {
        assert.strictEqual($dropdownItem.hasClass('active'), true, 'Component\'s item has class \'active\'');
        assert.strictEqual($dropdownItem.hasClass('selected'), true, 'Component\'s item has class \'selected\'');
      }

      // Tell to test method that asynchronous operation completed.
      animationCompleted();

      // Resolve 'menuAnimationCompleted' promise.
      resolve();
    }, animationDuration);
  });
}

test('animation dropdown without selecting a value', function(assert) {
  assert.expect(11);

  // Create array for testing.
  let itemsArray = ['Caption1', 'Caption2', 'Caption3'];
  this.set('itemsArray', itemsArray);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    items=itemsArray
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownText = $component.children('div.text');
  let $dropdownMenu = $component.children('div.menu');

  // Check that component is collapsed by default.
  assert.strictEqual($component.hasClass('active'), false, 'Component hasn\'t class \'active\'');
  assert.strictEqual($component.hasClass('visible'), false, 'Component hasn\'t class \'visible\'');
  assert.strictEqual($dropdownText.hasClass('default'), true, 'Component\'s text has class \'default\'');
  assert.strictEqual($dropdownMenu.hasClass('transition'), false, 'Component\'s menu hasn\'t class \'transition\'');
  assert.strictEqual($dropdownMenu.hasClass('visible'), false, 'Component\'s menu hasn\'t class \'visible\'');

  let menuAnimationCompleted = new Ember.RSVP.Promise((resolve, reject) => {
    // Try to expand component.
    // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
    Ember.run(() => {
      $component.click();
    });

    clickOnDropdown(assert, resolve, null, $component, $dropdownMenu);
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
        assert.strictEqual($component.hasClass('active'), false, 'Component hasn\'t class \'active\'');
        assert.strictEqual($dropdownMenu.hasClass('visible'), false, 'Component\'s menu hasn\'t class \'visible\'');
        assert.strictEqual($dropdownText.hasClass('default'), true, 'Component\'s text has class \'default\'');

        animationCompleted();
      }, animationDuration);
    });
  });
});

test('animation dropdown with selecting a value', function(assert) {
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
  let $dropdownText = $component.children('div.text');
  let $dropdownItem = $dropdownMenu.children('div.item');

  let $items = Ember.$('div.item', $dropdownMenu);

  assert.strictEqual($dropdownText.hasClass('default'), true, 'Component\'s text has class \'default\'');

  let dropdownOpen = new Ember.RSVP.Promise((resolve, reject) => {
    // Try to expand component.
    // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
    Ember.run(() => {
      $component.click();
    });

    clickOnDropdown(assert, resolve, null, $component, $dropdownMenu);
  });

  dropdownOpen.then(() => {

    let itemAnimationCompleted = new Ember.RSVP.Promise((resolve, reject) => {

      // Try to expand component.
      // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
      Ember.run(() => {
        Ember.$($items[2]).click();
      });

      clickOnDropdown(assert, resolve, $dropdownItem, null, null);
    });

    // Wait animation to be completed (when resolve will be called inside previous timeout).
    // Then try to collapse component.
    itemAnimationCompleted.then(() => {
      // Wait for collapse animation to be completed & check component's state.
      Ember.run(() => {
        let animationCompleted = assert.async();
        setTimeout(() => {

          // Check that component is expanded now.
          assert.strictEqual($dropdownText.hasClass('default text'), false, 'Component\'s text hasn\'t class \'default\'');
          assert.strictEqual($dropdownText.hasClass('text'), true, 'Component\'s text has class \'text\'');
          assert.strictEqual($dropdownMenu.hasClass('transition'), true, 'Component\'s menu has class \'transition\'');
          assert.strictEqual($dropdownMenu.hasClass('hidden'), true, 'Component\'s menu has class \'hidden\'');
          animationCompleted();
        }, animationDuration);
      });
    });
  });
});

test('changes in inner <dropdown> causes changes in property binded to \'value\'', function(assert) {
  assert.expect(10);

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
  let $dropdownText = $component.children('div.text');
  let $dropdownItem = $dropdownMenu.children('div.item');

  let $items = Ember.$('div.item', $dropdownMenu);

  assert.strictEqual($dropdownText.hasClass('default'), true, 'Component\'s text has class \'default\'');
  assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

  let dropdownOpen = new Ember.RSVP.Promise((resolve, reject) => {
    // Try to expand component.
    // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
    Ember.run(() => {
      $component.click();
    });

    clickOnDropdown(assert, resolve, null, $component, $dropdownMenu);
  });

  dropdownOpen.then(() => {

    let itemAnimationCompleted = new Ember.RSVP.Promise((resolve, reject) => {

      // Try to expand component.
      // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
      Ember.run(() => {
        Ember.$($items[2]).click();
      });

      clickOnDropdown(assert, resolve, $dropdownItem, null, null);
    });

    // Wait animation to be completed (when resolve will be called inside previous timeout).
    // Then try to collapse component.
    itemAnimationCompleted.then(() => {
      // Wait for collapse animation to be completed & check component's state.
      Ember.run(() => {
        let animationCompleted = assert.async();
        setTimeout(() => {
          let $dropdownChangeText = $component.children('div.text');
          let $dropdownActiveItem = $dropdownMenu.children('div.item.active');
          let dropdownActiveItemText = $dropdownActiveItem.text();

          // Check that component is expanded now.
          assert.strictEqual($dropdownActiveItem.size(), 1, 'Only one component\'s item is active');
          assert.strictEqual(Ember.$.trim($dropdownChangeText.text()), dropdownActiveItemText, 'Component\'s default text is changes');
          assert.strictEqual(this.get('value'), dropdownActiveItemText,
          'Component\'s property binded to \'value\' is equals to \'' + dropdownActiveItemText + '\'');
          animationCompleted();
        }, animationDuration);
      });
    });
  });
});

test('changes in property binded to \'value\' causes changes in <dropdown>', function(assert) {
  assert.expect(8);

  // Create array for testing.
  let itemsArray = ['Caption1', 'Caption2', 'Caption3'];
  this.set('itemsArray', itemsArray);
  this.set('value', null);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    value=value
    items=itemsArray
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownMenu = $component.children('div.menu');
  let $dropdownText = $component.children('div.text');
  let $items = Ember.$('div.item', $dropdownMenu);

  // Check <dropdown>'s value & binded value for initial emptyness.
  assert.strictEqual($dropdownText.hasClass('default'), true, 'Component\'s text has class \'default\'');
  assert.strictEqual(Ember.$.trim($dropdownText.text()), Ember.get(I18nRuLocale, 'components.flexberry-dropdown.placeholder'),
  'Component\'s inner <dropdown\'s value is equals to \'\'');
  assert.strictEqual(this.get('value'), null, 'Component\'s property binded to \'value\' is equals to null');

  // Change property binded to 'value' & check them again.
  let newValue = itemsArray[0];
  this.set('value', newValue);
  let $dropdownActiveItem = $dropdownMenu.children('div.item.active');
  let $dropdownChangeText = $component.children('div.text');

  // Check that component is active now.
  assert.strictEqual($dropdownActiveItem.size(), 1, 'Only one component\'s item is active');
  assert.strictEqual(Ember.$.trim($dropdownChangeText.text()), $dropdownActiveItem.text(), 'Component\'s default text is changes');
  assert.strictEqual((Ember.$($items[0]).text()), newValue, 'Component\'s inner <dropdown>\'s value is equals to \'' + newValue + '\'');
  assert.strictEqual($dropdownText.hasClass('default text'), false, 'Component\'s text hasn\'t class \'default\'');
  assert.strictEqual($dropdownText.hasClass('text'), true, 'Component\'s text has class \'text\'');
});

test('onChange mode properly', function(assert) {
  assert.expect(5);

  // Create array for testing.
  let itemsArray = ['Caption1', 'Caption2', 'Caption3'];
  this.set('itemsArray', itemsArray);
  this.set('value', null);

  let onChangeFlag = null;
  let onDropdownChangeEventObject = null;

  this.set('actions.onDropdownChange', (e) => {
    onChangeFlag = true;
    onDropdownChangeEventObject = e;
  });

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    value=value
    items=itemsArray
    onChange = (action \"onDropdownChange\")
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $dropdownMenu = $component.children('div.menu');
  let $items = Ember.$('div.item', $dropdownMenu);

  let dropdownOpen = new Ember.RSVP.Promise((resolve, reject) => {
    // Try to expand component.
    // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
    Ember.run(() => {
      $component.click();
    });

    clickOnDropdown(assert, resolve, null, $component, $dropdownMenu);
  });

  dropdownOpen.then(() => {

    let itemAnimationCompleted = new Ember.RSVP.Promise((resolve, reject) => {

      // Try to expand component.
      // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
      Ember.run(() => {
        Ember.$($items[2]).click();
      });

      clickOnDropdown(assert, resolve, null, null, null);
    });

    // Wait animation to be completed (when resolve will be called inside previous timeout).
    // Then try to collapse component.
    itemAnimationCompleted.then(() => {
      // Wait for collapse animation to be completed & check component's state.
      Ember.run(() => {
        let animationCompleted = assert.async();
        setTimeout(() => {
          let $dropdownActiveItem = $dropdownMenu.children('div.item.active');
          let dropdownActiveItemText = $dropdownActiveItem.text();

          // Check that component is expanded now.
          assert.strictEqual(onChangeFlag, true);
          assert.strictEqual(onDropdownChangeEventObject, dropdownActiveItemText);
          animationCompleted();
        }, animationDuration);
      });
    });
  });
});
