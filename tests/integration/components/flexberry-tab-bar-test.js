import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import $ from 'jquery';

moduleForComponent('flexberry-tab-bar', 'Integration | Component | flexberry-tab-bar', {
  integration: true,
});

test('it renders properly', function(assert) {
  assert.expect(5);

  this.render(hbs`{{flexberry-tab-bar}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $menu = $component.children('div.menu');
  let $dropdown = $component.children('div.dropdown');

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-tab-bar'), true, 'Component\'s wrapper has \' flexberry-tab-bar\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($menu.hasClass('menu'), true, 'Component\'s wrapper has \'menu\' css-class');
  assert.strictEqual($dropdown.hasClass('dropdown link item'), true, 'Component\'s wrapper has \'dropdown icon\' css-class');
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
  let $menu = $component.children('div.menu');
  let $dropdownMenu = $component.children('div.dropdown').children('div.menu');
  let $menuItems = $menu.children('button.item');
  let $dropdownItems = $dropdownMenu.children('button.item');

  // Check component's captions and array.
  $menuItems.each(function(i) {
    let $item = $(this);

    // Check that the captions matches the array.
    assert.strictEqual($item.attr('data-tab'), 'tab' + new Number(i + 1), 'Component\'s item\'s сaptions matches the array');
  });

  $dropdownItems.each(function(i) {
    let $item = $(this);

    // Check that the captions matches the array.
    assert.strictEqual($item.attr('data-tab'), 'tab' + new Number(i + 1), 'Component\'s item\'s сaptions matches the array');
  });
});

test('tabs are switched in the menu', function(assert) {
  assert.expect(2);

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

  this.render(hbs`{{flexberry-tab-bar items=items}}
    <div class="ui bottom attached tab active segment" data-tab="tab1">
      <h4>Tab №1</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab2">
      <h4>Tab №2</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab3">
      <h4>Tab №3</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab4">
      <h4>Tab №4</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab5">
      <h4>Tab №5</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab6">
      <h4>Tab №6</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab7">
      <h4>Tab №7</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab8">
      <h4>Tab №8</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab9">
      <h4>Tab №9</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab10">
      <h4>Tab №10</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab11">
      <h4>Tab №11</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab12">
      <h4>Tab №12</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab13">
      <h4>Tab №13</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab14">
      <h4>Tab №14</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab15">
      <h4>Tab №15</h4>
    </div>
  `);
  
  // Retrieve component.
  let $component = this.$().children();
  let $menu = $component.children('div.menu');
  let $dropdown = $component.children('div.dropdown');

  // To select some item, menu must contain such item (with the specified caption).
  let $itemMenu = $('.item:contains(' + this.get('items')[1].caption + ')', $menu);
  let $itemDropdown = $('.item:contains(' + this.get('items')[1].caption + ')', $dropdown);

  // Click on item to select it.
  run(() => {
    $itemMenu.click();
    assert.strictEqual($itemMenu.hasClass('active'), true, 'Component\'s tab has \'active\' css-class');
    assert.strictEqual($itemDropdown.hasClass('active'), true, 'Component\'s tab has \'active\' css-class');
  });
});

test('tabs are switched in the dropdown list', function(assert) {
  assert.expect(2);

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

  this.render(hbs`{{flexberry-tab-bar items=items}}
    <div class="ui bottom attached tab active segment" data-tab="tab1">
      <h4>Tab №1</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab2">
      <h4>Tab №2</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab3">
      <h4>Tab №3</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab4">
      <h4>Tab №4</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab5">
      <h4>Tab №5</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab6">
      <h4>Tab №6</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab7">
      <h4>Tab №7</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab8">
      <h4>Tab №8</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab9">
      <h4>Tab №9</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab10">
      <h4>Tab №10</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab11">
      <h4>Tab №11</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab12">
      <h4>Tab №12</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab13">
      <h4>Tab №13</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab14">
      <h4>Tab №14</h4>
    </div>
    <div class="ui bottom attached tab segment" data-tab="tab15">
      <h4>Tab №15</h4>
    </div>
  `);
  
  // Retrieve component.
  let $component = this.$().children();
  let $menu = $component.children('div.menu');
  let $dropdown = $component.children('div.dropdown');

  // To select some item, menu must contain such item (with the specified caption).
  let $itemMenu = $('.item:contains(' + this.get('items')[1].caption + ')', $menu);
  let $itemDropdown = $('.item:contains(' + this.get('items')[1].caption + ')', $dropdown);

  // Click on item to select it.
  run(() => {
    $dropdown.click();
    $itemDropdown.click();
    assert.strictEqual($itemMenu.hasClass('active'), true, 'Component\'s tab has \'active\' css-class');
    assert.strictEqual($itemDropdown.hasClass('active selected'), true, 'Component\'s tab has \'active\' css-class');
  });
});
