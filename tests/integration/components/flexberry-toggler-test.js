import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-toggler', 'Integration | Component | flexberry toggler', {
  integration: true
});

test('component renders properly closed', function(assert) {
  assert.expect(14);

  //this.set('expanded', false);

  this.render(hbs`{{flexberry-toggler caption=caption  expandedCaption=expandedCaption collapsedCaption=collapsedCaption expanded=expanded currentCaption=currentCaption}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();    
  let $togglerDiv = $component.children('.title');
  let $togglerI = $togglerDiv.children('i');
  let $togglerSpan = $togglerDiv.children('span');

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-toggler'), true, 'Component\'s container has \'flexberry-toggler\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('accordion'), true, 'Component\'s wrapper has \'accordion\' css-class');
  assert.strictEqual($component.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');

  // Check <title>.
  assert.strictEqual($togglerDiv.length === 1, true, 'Component has inner <title>');
  assert.strictEqual($togglerDiv.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($togglerDiv.hasClass('title '), true, 'Component\'s container has \'title\' css-class');

  // Check <i>.
  assert.strictEqual($togglerI.length === 1, true, 'Component has inner <i>');
  assert.strictEqual($togglerI.prop('tagName'), 'I', 'Component\'s wrapper is a <i>');
  assert.strictEqual($togglerI.hasClass('dropdown icon'), true, 'Component\'s container has \'dropdown icon\' css-class');

  // Check <span>
  assert.strictEqual($togglerSpan.length === 1, true, 'Component has inner <span>');
  assert.strictEqual($togglerSpan.prop('tagName'), 'SPAN', 'Component\'s wrapper is a <span>');
  assert.strictEqual($togglerSpan.hasClass('flexberry-toggler-caption'), true, 'Component\'s container has \'flexberry-toggler-caption\' css-class');
});

test('component renders properly open', function(assert) {
  assert.expect(14);

  this.render(hbs`{{flexberry-toggler caption=caption  expandedCaption=expandedCaption collapsedCaption=collapsedCaption expanded='true' currentCaption=currentCaption}}`);

  //setTimeout(Ember.$.fn.accordion.settings.duration + 50);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();    
  let $togglerDiv = $component.children('.title active');
  let $togglerI = $togglerDiv.children('i');
  let $togglerSpan = $togglerDiv.children('span');

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-toggler'), true, 'Component\'s container has \'flexberry-toggler\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('accordion'), true, 'Component\'s wrapper has \'accordion\' css-class');
  assert.strictEqual($component.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');

  // Check <title>.
  assert.strictEqual($togglerDiv.length === 1, true, 'Component has inner <title>');
  assert.strictEqual($togglerDiv.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($togglerDiv.hasClass('title active'), true, 'Component\'s container has \'title active\' css-class');

  // Check <i>.
  assert.strictEqual($togglerI.length === 1, true, 'Component has inner <i>');
  assert.strictEqual($togglerI.prop('tagName'), 'I', 'Component\'s wrapper is a <i>');
  assert.strictEqual($togglerI.hasClass('dropdown icon'), true, 'Component\'s container has \'dropdown icon\' css-class');

  // Check <span>
  assert.strictEqual($togglerSpan.length === 1, true, 'Component has inner <span>');
  assert.strictEqual($togglerSpan.prop('tagName'), 'SPAN', 'Component\'s wrapper is a <span>');
  assert.strictEqual($togglerSpan.hasClass('flexberry-toggler-caption'), true, 'Component\'s container has \'flexberry-toggler-caption\' css-class');
});

test('component renders properly opening', function(assert) {
  assert.expect(14);

  this.render(hbs`{{flexberry-toggler caption=caption  expandedCaption=expandedCaption collapsedCaption=collapsedCaption expanded='false' currentCaption=currentCaption}}`);

  this.set('expanded', true)

  setTimeout(Ember.$.fn.accordion.settings.duration/2);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();    
  let $togglerDiv = $component.children('.title animating');
  let $togglerI = $togglerDiv.children('i');
  let $togglerSpan = $togglerDiv.children('span');

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-toggler'), true, 'Component\'s container has \'flexberry-toggler\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('accordion'), true, 'Component\'s wrapper has \'accordion\' css-class');
  assert.strictEqual($component.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');

  // Check <title>.
  assert.strictEqual($togglerDiv.length === 1, true, 'Component has inner <title>');
  assert.strictEqual($togglerDiv.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($togglerDiv.hasClass('title animating'), true, 'Component\'s container has \'title animating\' css-class');

  // Check <i>.
  assert.strictEqual($togglerI.length === 1, true, 'Component has inner <i>');
  assert.strictEqual($togglerI.prop('tagName'), 'I', 'Component\'s wrapper is a <i>');
  assert.strictEqual($togglerI.hasClass('dropdown icon'), true, 'Component\'s container has \'dropdown icon\' css-class');

  // Check <span>
  assert.strictEqual($togglerSpan.length === 1, true, 'Component has inner <span>');
  assert.strictEqual($togglerSpan.prop('tagName'), 'SPAN', 'Component\'s wrapper is a <span>');
  assert.strictEqual($togglerSpan.hasClass('flexberry-toggler-caption'), true, 'Component\'s container has \'flexberry-toggler-caption\' css-class');
});


/*test('Test click', function(assert) {
    assert.expect(3);

    this.render(hbs`{{flexberry-toggler caption=caption  expandedCaption=expandedCaption 
      collapsedCaption='закрыт' expanded=expanded currentCaption=currentCaption}}`);

    let $component = this.$().children();    
    let $togglerDiv = $component.children('div .title');
    let $togglerSpan = $togglerDiv.children('span');

    assert.equal($component.hasClass('expanded'), false);
    assert.strictEqual($component.hasClass('expanded'), false, 'Component hasn\'t css-class \'checked\' before first click');

    this.set('collapsedCaption', 'закрыто');

    //component.set('expandedCaption', 'открыт');
    //component.set('collapsedCaption', 'закрыт');

    assert.equal( $togglerSpan.text().trim(),'закрыт');
});*/

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