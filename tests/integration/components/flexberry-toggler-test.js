import $ from 'jquery';
import { run, later } from '@ember/runloop';
import RSVP from 'rsvp';
import { A } from '@ember/array';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const animationDuration = $.fn.accordion.settings.duration + 100;

moduleForComponent('flexberry-toggler', 'Integration | Component | flexberry toggler', {
  integration: true
});

// Common expand/collapse test method.
let expandCollapseTogglerWithStateChecks = function(assert, captions) {
  assert.expect(10);
  let endFunction = assert.async();
  let content = 'Toggler\'s content';

  captions = captions || {};
  let caption = captions.caption || '';
  let expandedCaption = captions.expandedCaption || caption;
  let collapsedCaption = captions.collapsedCaption || caption;

  this.set('content', content);
  this.set('caption', caption);
  this.set('expandedCaption', expandedCaption);
  this.set('collapsedCaption', collapsedCaption);

  this.render(hbs`
    {{#flexberry-toggler
      caption=caption
      expandedCaption=expandedCaption
      collapsedCaption=collapsedCaption
    }}
      {{content}}
    {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $componentTitle = $component.children('div .title');
  let $componentCaption = $componentTitle.children('span');
  let $componentContent = $component.children('div .content');

  // Check that component is collapsed by default.
  assert.strictEqual($componentTitle.hasClass('active'), false);
  assert.strictEqual($componentContent.hasClass('active'), false);
  assert.strictEqual($.trim($componentCaption.text()), collapsedCaption);

  /* eslint-disable no-unused-vars */
  let expandAnimationCompleted = new RSVP.Promise((resolve, reject) => {
    // Try to expand component.
    // Semantic UI will start asynchronous animation after click, so we need run function here.
    run(() => {
      $componentTitle.click();
    });

    // Check that component is animating now.
    assert.strictEqual($componentContent.hasClass('animating'), true);

    // Wait for expand animation to be completed & check component's state.
    run(() => {
      let animationCompleted = assert.async();
      setTimeout(() => {
        // Check that component is expanded now.
        assert.strictEqual($componentTitle.hasClass('active'), true);
        assert.strictEqual($componentContent.hasClass('active'), true);
        assert.strictEqual($.trim($componentCaption.text()), expandedCaption);

        // Tell to test method that asynchronous operation completed.
        animationCompleted();

        // Resolve 'expandAnimationCompleted' promise.
        resolve();
      }, animationDuration);
    });
  });
  /* eslint-enable no-unused-vars */

  // Wait for expand animation to be completed (when resolve will be called inside previous timeout).
  // Then try to collapse component.
  expandAnimationCompleted.then(() => {
    // Semantic UI will start asynchronous animation after click, so we need run function here.
    run(() => {
      $componentTitle.click();
    });

    // Wait for collapse animation to be completed & check component's state.
    run(() => {
      let animationCompleted = assert.async();
      setTimeout(() => {
        // Check that component is expanded now.
        assert.strictEqual($componentTitle.hasClass('active'), false);
        assert.strictEqual($componentContent.hasClass('active'), false);
        assert.strictEqual($.trim($componentCaption.text()), collapsedCaption);

        animationCompleted();
        endFunction();
      }, animationDuration);
    });
  });
};

test('component renders properly', function(assert) {
  assert.expect(22);

  this.render(hbs`
    {{#flexberry-toggler
      class=class
    }}
    {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerTitle = $component.children('.title');
  let $togglerIcon = $togglerTitle.children('i');
  let $togglerCaption = $togglerTitle.children('span');
  let $togglerContent = $component.children('.content');

  // Check wrapper.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-toggler'), true, 'Component\'s wrapper has \'flexberry-toggler\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('accordion'), true, 'Component\'s wrapper has \'accordion\' css-class');
  assert.strictEqual($component.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');

  // Check title's <div>.
  assert.strictEqual($togglerTitle.length === 1, true, 'Component has inner title block');
  assert.strictEqual($togglerTitle.prop('tagName'), 'DIV', 'Component\'s inner title block is a <div>');
  assert.strictEqual($togglerTitle.hasClass('title'), true, 'Component\'s inner title block has \'title\' css-class');

  // Check title's icon <i>.
  assert.strictEqual($togglerIcon.length === 1, true, 'Component\'s title has icon block');
  assert.strictEqual($togglerIcon.prop('tagName'), 'I', 'Component\'s icon block is a <i>');
  assert.strictEqual($togglerIcon.hasClass('dropdown icon'), true, 'Component\'s icon block has \'dropdown icon\' css-class');

  // Check title's caption <span>.
  assert.strictEqual($togglerCaption.length === 1, true, 'Component has inner caption block');
  assert.strictEqual($togglerCaption.prop('tagName'), 'SPAN', 'Component\'s caption block is a <span>');
  assert.strictEqual($togglerCaption.hasClass('flexberry-toggler-caption'), true, 'Component\'s caption block has \'flexberry-toggler-caption\' css-class');

  // Check content's <div>.
  assert.strictEqual($togglerContent.length === 1, true, 'Component has inner content block');
  assert.strictEqual($togglerContent.prop('tagName'), 'DIV', 'Component\'s content block is a <div>');
  assert.strictEqual($togglerContent.hasClass('content'), true, 'Component\'s content block has \'content\' css-class');
  assert.strictEqual($togglerContent.hasClass('flexberry-toggler-content'), true, 'Component\'s content block has \'flexberry-toggler-content\' css-class');

  // Check component's additional CSS-classes.
  let additioanlCssClasses = 'firstClass secondClass';
  this.set('class', additioanlCssClasses);

  /* eslint-disable no-unused-vars */
  A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */

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

test('component\'s icon can be customized', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#flexberry-toggler
      iconClass=iconClass
    }}
    {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerTitle = $component.children('.title');
  let $togglerIcon = $togglerTitle.children('i');

  // Change default icon class.
  let defaultIconClass = 'dropdown icon';
  assert.strictEqual($togglerIcon.attr('class'), defaultIconClass, 'Component\'s icon is \'dropdown icon\' by default');

  // Change icon class & check again.
  let iconClass = 'marker icon';
  this.set('iconClass', iconClass);
  assert.strictEqual($togglerIcon.attr('class'), iconClass, 'Component\'s icon is \'dropdown icon\' by default');
});

test('component expands/collapses with defined \'expandedCaption\' & \'collapsedCaption\'', function(assert) {
  expandCollapseTogglerWithStateChecks.call(this, assert, {
    expandedCaption: 'Toggler\'s expanded caption',
    collapsedCaption: 'Toggler\'s collapsed caption'
  });
});

test('component expands/collapses with defined \'caption\' & \'collapsedCaption\'', function(assert) {
  expandCollapseTogglerWithStateChecks.call(this, assert, {
    caption: 'Toggler\'s caption',
    collapsedCaption: 'Toggler\'s collapsed caption'
  });
});

test('component expands/collapses with defined \'caption\' & \'expandedCaption\'', function(assert) {
  expandCollapseTogglerWithStateChecks.call(this, assert, {
    caption: 'Toggler\'s caption',
    expandedCaption: 'Toggler\'s expanded caption'
  });
});

test('component expands/collapses with only \'caption\' defined', function(assert) {
  expandCollapseTogglerWithStateChecks.call(this, assert, {
    caption: 'Toggler\'s caption'
  });
});

test('component expands/collapses with only \'expandedCaption\' defined', function(assert) {
  expandCollapseTogglerWithStateChecks.call(this, assert, {
    expandedCaption: 'Toggler\'s expanded caption'
  });
});

test('component expands/collapses with only \'collapsedCaption\' defined', function(assert) {
  expandCollapseTogglerWithStateChecks.call(this, assert, {
    collapsedCaption: 'Toggler\'s collapsed caption'
  });
});

test('component expands/collapses without defined captions', function(assert) {
  expandCollapseTogglerWithStateChecks.call(this, assert, {
  });
});

test('changes in \'expanded\' property causes changing of component\'s expand/collapse state', function(assert) {
  assert.expect(9);

  let content = 'Toggler\'s content';
  let collapsedCaption = 'Toggler\'s collapsed caption';
  let expandedCaption = 'Toggler\'s expanded caption';

  this.set('content', content);
  this.set('collapsedCaption', collapsedCaption);
  this.set('expandedCaption', expandedCaption);

  this.render(hbs`
    {{#flexberry-toggler
      expanded=expanded
      collapsedCaption=collapsedCaption
      expandedCaption=expandedCaption
    }}
      {{content}}
    {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerTitle = $component.children('.title');
  let $togglerCaption = $togglerTitle.children('span');
  let $togglerContent = $component.children('.content');

  // Check that component is collapsed by default.
  assert.strictEqual($togglerTitle.hasClass('active'), false);
  assert.strictEqual($togglerContent.hasClass('active'), false);
  assert.strictEqual($.trim($togglerCaption.text()), collapsedCaption);

  // Expand & check that component is expanded.
  this.set('expanded', true);
  assert.strictEqual($togglerTitle.hasClass('active'), true);
  assert.strictEqual($togglerContent.hasClass('active'), true);
  assert.strictEqual($.trim($togglerCaption.text()), expandedCaption);

  // Collapse & check that component is collapsed.
  this.set('expanded', false);
  assert.strictEqual($togglerTitle.hasClass('active'), false);
  assert.strictEqual($togglerContent.hasClass('active'), false);
  assert.strictEqual($.trim($togglerCaption.text()), collapsedCaption);
});

test('disabled animation', function(assert) {
  this.render(hbs`
    {{#flexberry-toggler
      caption="Click me!"
      duration=0}}
      Hello!
    {{/flexberry-toggler}}`);

  assert.notOk(this.$('.flexberry-toggler .content').hasClass('active'));

  this.$('.flexberry-toggler .title').click();

  assert.ok(this.$('.flexberry-toggler .content').hasClass('active'));
});

test('loong animation speed', function(assert) {
  assert.expect(3);
  let done = assert.async();

  this.render(hbs`
    {{#flexberry-toggler
      caption="Click me!"
      duration=750}}
      Hello!
    {{/flexberry-toggler}}`);

  this.$('.flexberry-toggler .title').click();

  assert.ok(this.$('.flexberry-toggler .content').hasClass('animating'));
  later(() => {
    assert.ok(this.$('.flexberry-toggler .content').hasClass('animating'));
  }, 500);
  later(() => {
    assert.notOk(this.$('.flexberry-toggler .content').hasClass('animating'));
    done();
  }, 1000);
});

test('Components property hasShadow works properly', function(assert) {
  this.set('hasShadow', true);

  this.render(hbs`
  {{#flexberry-toggler
    caption="Click me!"
    hasShadow=hasShadow
  }}
    Hello!
  {{/flexberry-toggler}}`);

  assert.ok(this.$('.flexberry-toggler').hasClass('has-shadow'));
  this.set('hasShadow', false);
  assert.notOk(this.$('.flexberry-toggler').hasClass('has-shadow'));
});

test('Components property hasBorder works properly', function(assert) {
  this.set('hasBorder', true);
  this.render(hbs`
  {{#flexberry-toggler
    caption="Click me!"
    hasBorder=hasBorder
  }}
    Hello!
  {{/flexberry-toggler}}`);

  assert.ok(this.$('.flexberry-toggler').hasClass('has-border'));
  this.set('hasBorder', false);
  assert.notOk(this.$('.flexberry-toggler').hasClass('has-border'));
});