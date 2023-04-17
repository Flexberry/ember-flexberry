import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import RSVP from 'rsvp';
import { A } from '@ember/array';

moduleForComponent('flexberry-tab-bar', 'Integration | Component | flexberry-tab-bar', {
  integration: true,
});

test('it renders properly', function(assert) {
  assert.expect(5);

  this.render(hbs`{{flexberry-tab-bar}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $tabMenu = $component.children('div.menu');
  let $tabDropdown = $component.children('div.dropdown');

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-tab-bar'), true, 'Component\'s wrapper has \' flexberry-tab-bar\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($tabMenu.hasClass('menu'), true, 'Component\'s wrapper has \'menu\' css-class');
  assert.strictEqual($tabDropdown.hasClass('dropdown link item'), true, 'Component\'s wrapper has \'dropdown icon\' css-class');
});

test('it renders items', function(assert) {
  assert.expect(30);

  this.set('items', [
    { selector: 'tab1', caption: 'Tab №1', active: true },
    { selector: 'tab2', caption: 'Tab №2' },
    { selector: 'tab3', caption: 'Tab №3' },
    { selector: 'tab4', caption: 'Tab №4' },
    { selector: 'tab5', caption: 'Tab №5' },
    { selector: 'tab6', caption: 'Tab №6' },
    { selector: 'tab7', caption: 'Tab №7' },
    { selector: 'tab8', caption: 'Tab №8' },
    { selector: 'tab9', caption: 'Tab №9' },
    { selector: 'tab10', caption: 'Tab №10' },
    { selector: 'tab11', caption: 'Tab №11' },
    { selector: 'tab12', caption: 'Tab №12' },
    { selector: 'tab13', caption: 'Tab №13' },
    { selector: 'tab14', caption: 'Tab №14' },
    { selector: 'tab15', caption: 'Tab №15' }
  ]);

  this.render(hbs`{{flexberry-tab-bar items=items}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $tabsMenu = $component.children('div.menu');
  let $tabsDropdownMenu = $component.children('div.dropdown').children('div.menu');
  let $tabsItems = $tabsMenu.children('button.item');
  let $tabsDropdownItems = $tabsDropdownMenu.children('button.item');

  // Check component's captions and array.
  $tabsItems.each(function(i) {
    let $item = $(this);

    // Check that the captions matches the array.
    assert.strictEqual($item.attr('data-tab'), 'tab' + new Number(i + 1), 'Component\'s item\'s сaptions matches the array');
  });

  $tabsDropdownItems.each(function(i) {
    let $item = $(this);

    // Check that the captions matches the array.
    assert.strictEqual($item.attr('data-tab'), 'tab' + new Number(i + 1), 'Component\'s item\'s сaptions matches the array');
  });
});

// test('tabs are switched in the menu', function(assert) {
//   assert.expect(1);

//   this.set('items', [
//     { selector: 'tab1', caption: 'Tab №1', active: true },
//     { selector: 'tab2', caption: 'Tab №2' },
//     { selector: 'tab3', caption: 'Tab №3' },
//     { selector: 'tab4', caption: 'Tab №4' },
//     { selector: 'tab5', caption: 'Tab №5' },
//     { selector: 'tab6', caption: 'Tab №6' },
//     { selector: 'tab7', caption: 'Tab №7' },
//     { selector: 'tab8', caption: 'Tab №8' },
//     { selector: 'tab9', caption: 'Tab №9' },
//     { selector: 'tab10', caption: 'Tab №10' },
//     { selector: 'tab11', caption: 'Tab №11' },
//     { selector: 'tab12', caption: 'Tab №12' },
//     { selector: 'tab13', caption: 'Tab №13' },
//     { selector: 'tab14', caption: 'Tab №14' },
//     { selector: 'tab15', caption: 'Tab №15' }
//   ]);

//   this.render(hbs`{{flexberry-tab-bar items=items}}`);
  
//   // Retrieve component.
//   let $component = this.$().children();
//   let $tabMenu = $component.children('div.menu');

//   // To select some item, menu must contain such item (with the specified caption).
//   let $itemMenu = $('.item:contains(' + this.get('items')[1].caption + ')', $tabMenu);

//   // Click on item to select it.
//   run(() => {
//     $itemMenu.click();
//     assert.strictEqual($itemMenu.hasClass('active'), true, 'Component\'s tab has \'active\' css-class');
//   });
// });

// test('tabs are switched in the dropdown list', function(assert) {
//   assert.expect(1);

//   this.set('items', [
//     { selector: 'tab1', caption: 'Tab №1', active: true },
//     { selector: 'tab2', caption: 'Tab №2' },
//     { selector: 'tab3', caption: 'Tab №3' },
//     { selector: 'tab4', caption: 'Tab №4' },
//     { selector: 'tab5', caption: 'Tab №5' },
//     { selector: 'tab6', caption: 'Tab №6' },
//     { selector: 'tab7', caption: 'Tab №7' },
//     { selector: 'tab8', caption: 'Tab №8' },
//     { selector: 'tab9', caption: 'Tab №9' },
//     { selector: 'tab10', caption: 'Tab №10' },
//     { selector: 'tab11', caption: 'Tab №11' },
//     { selector: 'tab12', caption: 'Tab №12' },
//     { selector: 'tab13', caption: 'Tab №13' },
//     { selector: 'tab14', caption: 'Tab №14' },
//     { selector: 'tab15', caption: 'Tab №15' }
//   ]);

//   this.render(hbs`{{flexberry-tab-bar items=items}}`);
  
//   // Retrieve component.
//   let $component = this.$().children();
//   let $tabDropdown = $component.children('div.dropdown');
//   let $tabMenu = $component.children('div.menu');
//   let $tabDropdownMenu = $component.children('div.dropdown').children('div.menu');

//   // To select some item, menu must contain such item (with the specified caption).
//   let $itemMenu = $('.item:contains(' + this.get('items')[2].caption + ')', $tabMenu);
//   let $itemDropdown = $('.item:contains(' + this.get('items')[2].caption + ')', $tabDropdown);

//   // Click on item to select it.
//   run(() => {
//     $tabDropdown.click();
//     $itemDropdown.click();
//     assert.strictEqual($itemMenu.hasClass('active'), true, 'Component\'s tab has \'active\' css-class');
//   });
// });

test('tabs are switched in the dropdown list', function(assert) {
  // assert.expect(1);

  let items = [
    { selector: 'tab1', caption: 'Tab №1', active: true },
    { selector: 'tab2', caption: 'Tab №2' },
    { selector: 'tab3', caption: 'Tab №3' },
    { selector: 'tab4', caption: 'Tab №4' },
    { selector: 'tab5', caption: 'Tab №5' },
    { selector: 'tab6', caption: 'Tab №6' },
    { selector: 'tab7', caption: 'Tab №7' },
    { selector: 'tab8', caption: 'Tab №8' },
    { selector: 'tab9', caption: 'Tab №9' },
    { selector: 'tab10', caption: 'Tab №10' },
    { selector: 'tab11', caption: 'Tab №11' },
    { selector: 'tab12', caption: 'Tab №12' },
    { selector: 'tab13', caption: 'Tab №13' },
    { selector: 'tab14', caption: 'Tab №14' },
    { selector: 'tab15', caption: 'Tab №15' }
  ];
  this.set('items', items);

  this.render(hbs`{{flexberry-tab-bar items=items}}`);
  
  // Retrieve component.
  let $component = this.$().children();
  let $dropdown = $component.children('div.dropdown');
  let $tabMenu = $component.children('div.menu');
  let $dropdownMenu = $component.children('div.dropdown').children('div.menu');

  let $itemMenu = $('.item:contains(' + items[1].caption + ')', $tabMenu);
  // Check that component is collapsed by default.
  assert.strictEqual($dropdownMenu.hasClass('drop'), false, 'Component\'s dropdown menu hasn\'t class \'drop\'');

  run(() => {
    $dropdown.click();
    
    // Check that component is expanded now.
    assert.strictEqual($dropdownMenu.hasClass('drop'), true, 'Component\'s dropdown menu has class \'drop\'');
  });

  let asyncAnimationsCompleted = assert.async();
  // Collapse component.
  let itemCaption = items[1].caption;
  selectDropdownItem({
    dropdown: $dropdown,
    itemCaption: itemCaption,
  }).then(() => {
    // Check that component is collapsed now.
    assert.strictEqual($component.hasClass('active'), false, 'Component hasn\'t class \'active\'');
    assert.strictEqual($component.hasClass('visible'), false, 'Component hasn\'t class \'visible\'');
    assert.strictEqual($dropdownMenu.hasClass('visible'), false, 'Component\'s menu hasn\'t class \'visible\'');
    assert.strictEqual($dropdownMenu.hasClass('hidden'), true, 'Component\'s menu has class \'hidden\'');
    assert.strictEqual($itemMenu.hasClass('active'), true, 'Component\'s tab has \'active\' css-class');
  }).catch((e) => {
    // Error output.
    assert.ok(false, e);
  }).finally(() => {
    asyncAnimationsCompleted();
  });
});

// Helper method to select item with specified caption from already expanded flexberry-dropdown's menu.
let selectDropdownItem = function(options) {
  options = options || {};

  let $component = options.dropdown;
  let $menu = $component.children('div.menu');

  let itemCaption = options.itemCaption;

  return new RSVP.Promise((resolve, reject) => {

    // To select some item, menu must contain such item (with the specified caption).
    let $item = $('.item:contains(' + itemCaption + ')', $menu);
    if ($item.length === 0) {
      reject(new Error('flexberry-dropdown\'s menu doesn\'t contain item with caption \'' + itemCaption + '\''));
    }

    // Click on item to select it & trigger collapse animation.
    run(() => {
      $item.click();

      // Set timeout for end of collapse animation.
      setTimeout(() => {
        resolve();
      }, 50000);
    });
  });
};
