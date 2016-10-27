import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-toggler', 'Integration | Component | flexberry toggler', {
  integration: true
});

test('component renders properly when closed', function(assert) {
  assert.expect(18);

  this.render(hbs`{{#flexberry-toggler}}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerTitle = $component.children('.title');
  let $togglerI = $togglerTitle.children('i');
  let $togglerSpan = $togglerTitle.children('span');
  let $togglerContent = $component.children('.content');

  // Check wrapper <title>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
  assert.strictEqual($component.hasClass('flexberry-toggler'), true, 'Component\'s container has \'flexberry-toggler\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('accordion'), true, 'Component\'s wrapper has \'accordion\' css-class');
  assert.strictEqual($component.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');

  // Check <title>.
  assert.strictEqual($togglerTitle.length === 1, true, 'Component has inner title block');
  assert.strictEqual($togglerTitle.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($togglerTitle.hasClass('title'), true, 'Component\'s title block has \'title\' css-class');

  // Check <i>.
  assert.strictEqual($togglerI.length === 1, true, 'Component has inner title block');
  assert.strictEqual($togglerI.prop('tagName'), 'I', 'Component\'s title block is a <i>');
  assert.strictEqual($togglerI.hasClass('dropdown icon'), true, 'Component\'s container has \'dropdown icon\' css-class');

  // Check <span>
  assert.strictEqual($togglerSpan.length === 1, true, 'Component has inner title block');
  assert.strictEqual($togglerSpan.prop('tagName'), 'SPAN', 'Component\'s title block is a <span>');
  assert.strictEqual($togglerSpan.hasClass('flexberry-toggler-caption'), true, 'Component\'s container has \'flexberry-toggler-caption\' css-class');

  // Check <content>
  assert.strictEqual($togglerContent.length === 1, true, 'Component has inner title block');
  assert.strictEqual($togglerContent.prop('tagName'), 'DIV', 'Component\'s title block is a <content>');
  assert.strictEqual($togglerContent.hasClass('content'), true, 'Component\'s container has \'content\' css-class');
  assert.strictEqual($togglerContent.hasClass('flexberry-toggler-content'), true, 'Component\'s container has \'flexberry-toggler-content\' css-class');
});

test('component renders properly when expanded', function(assert) {
  assert.expect(3);

  let tempText = 'Temp arcardion text.';
  this.set('tempText', tempText);

  this.render(hbs`{{#flexberry-toggler
    expanded=true
  }}
  {{tempText}}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerTitle = $component.children('.title');
  let $togglerContent = $component.children('.content');

  // Check wrapper <div>.
  assert.strictEqual($togglerTitle.hasClass('active'), true, 'Component\'s container has \'active\' css-class');

  // Check <content>
  assert.strictEqual($togglerContent.hasClass('active'), true, 'Component\'s container has \'active\' css-class');
  assert.strictEqual($togglerContent.text().trim(), tempText, 'Component\'s container has \'tempText\' text');
});

test('component expands/collapses/animating on title click', function(assert) {
  assert.expect(11);

  let content = 'Some content';
  let iconClass = 'marker icon';
  let expandedCaption = 'Toggler is expanded';
  let collapsedCaption = 'Toggler is collapsed';

  this.set('content', content);
  this.set('iconClass', iconClass);
  this.set('expandedCaption', expandedCaption);
  this.set('collapsedCaption', collapsedCaption);

  this.render(hbs`{{#flexberry-toggler
    iconClass=iconClass
    expandedCaption=expandedCaption
    collapsedCaption=collapsedCaption
  }}
    {{content}}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $componentTitle = $component.children('div .title');
  let $componentIcon = $componentTitle.children('i');
  let $componentCaption = $componentTitle.children('span');
  let $componentContent = $component.children('div .content');

  // Check icon class;
  assert.strictEqual($componentIcon.hasClass(iconClass), true);

  // Check that component is collapsed by default.
  assert.strictEqual($componentTitle.hasClass('active'), false);
  assert.strictEqual($componentContent.hasClass('active'), false);
  assert.strictEqual(Ember.$.trim($componentCaption.text()), collapsedCaption);

  let expandAnimationCompleted = new Ember.RSVP.Promise((resolve, reject) => {
    // Try to expand component.
    // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
    Ember.run(() => {
      $componentTitle.click();
    });

    // Wait animation to check component's state.
    Ember.run(() => {
      let animation = assert.async();
      setTimeout(() => {
        // Check that component is animating now.
        assert.strictEqual($componentContent.hasClass('animating'), true);

        // Tell to test method that asynchronous operation completed.
        animation();

      }, Ember.$.fn.accordion.settings.duration / 2);
    });

    // Wait for expand animation to be completed & check component's state.
    Ember.run(() => {
      let animationCompleted = assert.async();
      setTimeout(() => {
        // Check that component is expanded now.
        assert.strictEqual($componentTitle.hasClass('active'), true);
        assert.strictEqual($componentContent.hasClass('active'), true);
        assert.strictEqual(Ember.$.trim($componentCaption.text()), expandedCaption);

        // Tell to test method that asynchronous operation completed.
        animationCompleted();

        // Resolve 'expandAnimationCompleted' promise.
        resolve();
      }, Ember.$.fn.accordion.settings.duration + 100);
    });
  });

  // Wait for expand animation to be completed (when resolve will be called inside previous timeout).
  // Then try to collapse component.
  expandAnimationCompleted.then(() => {
    // Semantic UI will start asynchronous animation after click, so we need Ember.run here.
    Ember.run(() => {
      $componentTitle.click();
    });

    // Wait for collapse animation to be completed & check component's state.
    Ember.run(() => {
      let animationCompleted = assert.async();
      setTimeout(() => {
        // Check that component is expanded now.
        assert.strictEqual($componentTitle.hasClass('active'), false);
        assert.strictEqual($componentContent.hasClass('active'), false);
        assert.strictEqual(Ember.$.trim($componentCaption.text()), collapsedCaption);

        animationCompleted();
      }, Ember.$.fn.accordion.settings.duration + 100);
    });
  });
});

test('caption renders with collapsedCaption and expandedCaption test', function(assert) {
  assert.expect(2);

  let tempTextOpen = 'Temp opnen arcardion text.';
  let tempTextClosed = 'Temp closed arcardion text.';

  this.set('expandedCaption', tempTextOpen);
  this.set('collapsedCaption', tempTextClosed);

  this.render(hbs`{{#flexberry-toggler
    expandedCaption=expandedCaption
    collapsedCaption=collapsedCaption
    expanded=expanded
  }}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerTitle = $component.children('.title');
  let $togglerSpan = $togglerTitle.children('span');

  // Check that component has title by default.
  assert.strictEqual($togglerSpan.text().trim(), tempTextClosed, 'Component\'s container has title \'tempTextClosed\' text');

  // Try to expand component.
  Ember.run(() => {
    $togglerTitle.click();
  });

  // Wait for collapse animation to be completed & check component's state.
  var done = assert.async();
  Ember.run(() => {
    setTimeout(function() {
      assert.strictEqual($togglerSpan.text().trim(), tempTextOpen, 'Component\'s container has title \'tempTextOpen\' text after first click');
      done();
    }, Ember.$.fn.accordion.settings.duration + 100);

  });
});

test('caption renders with caption and expandedCaption test', function(assert) {
  assert.expect(2);

  let tempText = 'Temp caption arcardion text.';
  let tempTextOpen = 'Temp opne arcardion text.';

  this.set('caption', tempText);
  this.set('expandedCaption', tempTextOpen);

  this.render(hbs`{{#flexberry-toggler
    caption=caption
    expandedCaption=expandedCaption
    expanded=expanded
  }}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerDiv = $component.children('.title');
  let $togglerSpan = $togglerDiv.children('span');

  // Check that component has title by default.
  assert.strictEqual($togglerSpan.text().trim(), tempText, 'Component\'s container has title \'tempText\' text');

  // Try to expand component.
  Ember.run(() => {
    $togglerDiv.click();
  });

  // Wait for collapse animation to be completed & check component's state.
  var done = assert.async();
  Ember.run(() => {
    setTimeout(function() {
      // Check that component has title by open.
      assert.strictEqual($togglerSpan.text().trim(), tempTextOpen, 'Component\'s container has title \'tempTextOpen\' text after first click');
      done();
    }, Ember.$.fn.accordion.settings.duration + 100);
  });
});

test('caption renders with collapsedCaption and caption test', function(assert) {
  assert.expect(2);

  let tempText = 'Temp caption arcardion text.';
  let tempTextClosed = 'Temp closed arcardion text.';

  this.set('caption', tempText);
  this.set('collapsedCaption', tempTextClosed);

  this.render(hbs`{{#flexberry-toggler
    caption=caption
    collapsedCaption=collapsedCaption
    expanded=expanded
  }}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerDiv = $component.children('.title');
  let $togglerSpan = $togglerDiv.children('span');

  // Check that component has title by default.
  assert.strictEqual($togglerSpan.text().trim(), tempTextClosed, 'Component\'s container has title \'tempTextClosed\' text');

  // Try to expand component.
  Ember.run(() => {
    $togglerDiv.click();
  });

  // Wait for collapse animation to be completed & check component's state.
  var done = assert.async();
  Ember.run(() => {
    setTimeout(function() {
      // Check that component has title by open.
      assert.strictEqual($togglerSpan.text().trim(), tempText, 'Component\'s container has title \'tempText\' text after first click');
      done();
    }, Ember.$.fn.accordion.settings.duration + 100);
  });
});

test('caption renders with caption, expandedCaption and collapsedCaption test', function(assert) {
  assert.expect(2);

  let tempText = 'Temp caption arcardion text.';
  let tempTextOpen = 'Temp opne arcardion text.';
  let tempTextClosed = 'Temp closed arcardion text.';

  this.set('caption', tempText);
  this.set('expandedCaption', tempTextOpen);
  this.set('collapsedCaption', tempTextClosed);

  this.render(hbs`{{#flexberry-toggler
    caption=caption
    expandedCaption=expandedCaption
    collapsedCaption=collapsedCaption
    expanded=expanded
  }}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerDiv = $component.children('.title');
  let $togglerSpan = $togglerDiv.children('span');

  // Check that component has title by default.
  assert.strictEqual($togglerSpan.text().trim(), tempTextClosed, 'Component\'s container has title \'tempText\' text');

  // Try to expand component.
  Ember.run(() => {
    $togglerDiv.click();
  });

  // Wait for collapse animation to be completed & check component's state.
  var done = assert.async();
  Ember.run(() => {
    setTimeout(function() {
      // Check that component has title by open.
      assert.strictEqual($togglerSpan.text().trim(), tempTextOpen, 'Component\'s container has title \'tempTextOpen\' text after first click');
      done();
    }, Ember.$.fn.accordion.settings.duration + 100);
  });
});

test('caption renders with caption test', function(assert) {
  assert.expect(2);

  let tempText = 'Temp caption arcardion text.';

  this.set('caption', tempText);

  this.render(hbs`{{#flexberry-toggler
    caption=caption
    expanded=expanded
  }}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerDiv = $component.children('.title');
  let $togglerSpan = $togglerDiv.children('span');

  // Check that component has title by default.
  assert.strictEqual($togglerSpan.text().trim(), tempText, 'Component\'s container has title \'tempText\' text');

  // Try to expand component.
  Ember.run(() => {
    $togglerDiv.click();
  });

  // Wait for collapse animation to be completed & check component's state.
  var done = assert.async();
  Ember.run(() => {
    setTimeout(function() {
      // Check that component has title by open.
      assert.strictEqual($togglerSpan.text().trim(), tempText, 'Component\'s container has title \'tempText\' text after first click');
      done();
    }, Ember.$.fn.accordion.settings.duration + 100);
  });
});

test('caption renders with collapsedCaption test', function(assert) {
  assert.expect(2);

  let tempTextClosed = 'Temp closed arcardion text.';

  this.set('collapsedCaption', tempTextClosed);

  this.render(hbs`{{#flexberry-toggler
    collapsedCaption=collapsedCaption
    expanded=expanded
  }}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerDiv = $component.children('.title');
  let $togglerSpan = $togglerDiv.children('span');

  // Check that component has title by default.
  assert.strictEqual($togglerSpan.text().trim(), tempTextClosed, 'Component\'s container has title \'tempTextClosed\' text');

  // Try to expand component.
  Ember.run(() => {
    $togglerDiv.click();
  });

  // Wait for collapse animation to be completed & check component's state.
  var done = assert.async();
  Ember.run(() => {
    setTimeout(function() {
      // Check that component has title by open.
      assert.strictEqual($togglerSpan.text().trim(), '', 'Component\'s container hasn\'t text after first click');
      done();
    }, Ember.$.fn.accordion.settings.duration + 100);
  });
});

test('caption renders with expandedCaption test', function(assert) {
  assert.expect(2);

  let tempTextOpen = 'Temp opne arcardion text.';

  this.set('expandedCaption', tempTextOpen);

  this.render(hbs`{{#flexberry-toggler
    expandedCaption=expandedCaption
  }}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerDiv = $component.children('.title');
  let $togglerSpan = $togglerDiv.children('span');

  // Check that component has title by default.
  assert.strictEqual($togglerSpan.text().trim(), '', 'Component\'s container has title \'tempTextClosed\' text');

  // Try to expand component.
  Ember.run(() => {
    $togglerDiv.click();
  });

  // Wait for collapse animation to be completed & check component's state.
  var done = assert.async();
  Ember.run(() => {
    setTimeout(function() {
      // Check that component has title by open.
      assert.strictEqual($togglerSpan.text().trim(), tempTextOpen, 'Component\'s container hasn\'t text after first click');
      done();
    }, Ember.$.fn.accordion.settings.duration + 100);
  });
});

test('caption renders without text test', function(assert) {
  assert.expect(2);

  this.render(hbs`{{#flexberry-toggler}}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerDiv = $component.children('.title');
  let $togglerSpan = $togglerDiv.children('span');

  // Check that component has title by default.
  assert.strictEqual($togglerSpan.text().trim(), '', 'Component\'s container has title \'tempTextClosed\' text');

  // Try to expand component.
  Ember.run(() => {
    $togglerDiv.click();
  });

  // Wait for collapse animation to be completed & check component's state.
  var done = assert.async();
  Ember.run(() => {
    setTimeout(function() {
      // Check that component has title by open.
      assert.strictEqual($togglerSpan.text().trim(), '', 'Component\'s container hasn\'t text after first click');
      done();
    }, Ember.$.fn.accordion.settings.duration + 100);
  });
});

test('component open/closed afther change expanded test', function(assert) {
  assert.expect(2);

  this.render(hbs`{{#flexberry-toggler
    expanded=expanded
  }}
  {{/flexberry-toggler}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $togglerTitle = $component.children('.title');

  // Check that component has title by default.
  assert.strictEqual($togglerTitle.hasClass('active'), false);

  // Change expanded.
  this.set('expanded', true);

  // Check that component has title by default.
  assert.strictEqual($togglerTitle.hasClass('active'), true);
});
