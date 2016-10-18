import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-toggler', 'Integration | Component | flexberry toggler', {
  integration: true
});

test('component renders properly closed', function(assert) {
  assert.expect(18);


  this.render(hbs`{{#flexberry-toggler
  caption=caption
  expandedCaption=expandedCaption
  collapsedCaption=collapsedCaption
  expanded=true
  iconClass=iconClass
  }}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();    
  let $togglerDiv = $component.children('.title');
  let $togglerI = $togglerDiv.children('i');
  let $togglerSpan = $togglerDiv.children('span');
  let $togglerContent = $component.children('.content');
  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-toggler'), true, 'Component\'s container has \'flexberry-toggler\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('accordion'), true, 'Component\'s wrapper has \'accordion\' css-class');
  assert.strictEqual($component.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');

  // Check <title>.
  assert.strictEqual($togglerDiv.length === 1, true, 'Component has inner <title>');
  assert.strictEqual($togglerDiv.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($togglerDiv.hasClass('title'), true, 'Component\'s container has \'title\' css-class');

  // Check <i>.
  assert.strictEqual($togglerI.length === 1, true, 'Component has inner <i>');
  assert.strictEqual($togglerI.prop('tagName'), 'I', 'Component\'s wrapper is a <i>');
  assert.strictEqual($togglerI.hasClass('dropdown icon'), true, 'Component\'s container has \'dropdown icon\' css-class');

  // Check <span>
  assert.strictEqual($togglerSpan.length === 1, true, 'Component has inner <span>');
  assert.strictEqual($togglerSpan.prop('tagName'), 'SPAN', 'Component\'s wrapper is a <span>');
  assert.strictEqual($togglerSpan.hasClass('flexberry-toggler-caption'), true, 'Component\'s container has \'flexberry-toggler-caption\' css-class');


  // Check <content>
  assert.strictEqual($togglerContent.length === 1, true, 'Component has inner <content>');
  assert.strictEqual($togglerContent.prop('tagName'), 'DIV', 'Component\'s wrapper is a <content>');
  assert.strictEqual($togglerContent.hasClass('content'), true, 'Component\'s container has \'content\' css-class');
  assert.strictEqual($togglerContent.hasClass('flexberry-toggler-content'), true, 'Component\'s container has \'flexberry-toggler-content\' css-class');
});

test('component renders properly open', function(assert) {
  assert.expect(3);

  let tempText = 'Temp arcardion text.';
  this.set('tempText', tempText);

  this.render(hbs`{{#flexberry-toggler
  caption=caption
  expandedCaption=expandedCaption
  collapsedCaption=collapsedCaption
  expanded=true
  iconClass=iconClass
  }}
  {{tempText}}
  {{/flexberry-toggler}}`);

  //setTimeout(Ember.$.fn.accordion.settings.duration + 50);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();    
  let $togglerDiv = $component.children('.title');
  let $togglerI = $togglerDiv.children('i');
  let $togglerSpan = $togglerDiv.children('span');
  let $togglerContent = $component.children('.content');

  // Check wrapper <div>.
  assert.strictEqual($togglerDiv.hasClass('active'), true, 'Component\'s container has \'active\' css-class');

  // Check <content>
  assert.strictEqual($togglerContent.hasClass('active'), true, 'Component\'s container has \'active\' css-class');
  assert.strictEqual($togglerContent.text().trim(), tempText,'Component\'s container has \'tempText\' text');
});

test('component renders properly opening', function(assert) {
  assert.expect(1);

  this.render(hbs`{{flexberry-toggler
    caption=caption
    expandedCaption=expandedCaption
    collapsedCaption=collapsedCaption
    expanded=expanded
    currentCaption=currentCaption}}`);
  
  let $component = this.$().children();    
  let $togglerDiv = $component.children('.title');
  let $togglerContent = $component.children('.content');

  Ember.run(() => {
  $togglerDiv.click();

  assert.strictEqual($togglerContent.hasClass('animating'), true, 'Component\'s container has \'animating\' css-class');
 });
});

test('it renders', function(assert) {

  this.render(hbs`{{flexberry-toggler}}`);

  assert.equal(this.$().text().trim(), '');

  this.render(hbs`
    {{#flexberry-toggler}}
      template block text
    {{/flexberry-toggler}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});