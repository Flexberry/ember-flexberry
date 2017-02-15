import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-message', 'Integration | Component | ui-message', {
  integration: true,
});

test('it renders properly', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{ui-message
    }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check wrapper <div>.
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('message'), true, 'Component\'s wrapper has \' message\' css-class');
});

test('size renders properly', function(assert) {
  assert.expect(8);

  // Render component.
  this.render(hbs`{{ui-message
    size=size
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check component's syze's types.
  let syzeTypes = 'small large huge massive';
  this.set('size', syzeTypes);

  Ember.A(syzeTypes.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has css class \'' + cssClassName + '\'');
  });

  this.set('size', '');
  Ember.A(syzeTypes.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    false,
    'Component\'s wrapper hasn\'t css class \'' + cssClassName + '\'');
  });
});

test('type renders properly', function(assert) {
  assert.expect(12);

  // Render component.
  this.render(hbs`{{ui-message
    type=type
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check component's type's CSS-classes.
  let typeCssClasses = 'warning info positive success negative error';
  this.set('type', typeCssClasses);

  Ember.A(typeCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has css class \'' + cssClassName + '\'');
  });

  this.set('type', '');
  Ember.A(typeCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    false,
    'Component\'s wrapper hasn\'t css class \'' + cssClassName + '\'');
  });
});

test('color renders properly', function(assert) {
  assert.expect(24);

  // Render component.
  this.render(hbs`{{ui-message
    color=color
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check component's color's CSS-classes.
  let colorCssClasses = 'red orange yellow olive green teal blue violet purple pink brown black';
  this.set('color', colorCssClasses);

  Ember.A(colorCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has css class \'' + cssClassName + '\'');
  });

  this.set('color', '');
  Ember.A(colorCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    false,
    'Component\'s wrapper hasn\'t css class \'' + cssClassName + '\'');
  });
});

test('floating renders properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{ui-message
    floating=floating
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check wrapper <div>.
  assert.strictEqual($component.hasClass('floating'), false, 'Component\'s wrapper hasn\'t css class');

  this.set('floating', true);
  assert.strictEqual($component.hasClass('floating'), true, 'Component\'s wrapper has css class');

  this.set('floating', false);
  assert.strictEqual($component.hasClass('floating'), false, 'Component\'s wrapper hasn\'t css class');
});

test('attached renders properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{ui-message
    attached=attached
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check wrapper <div>.
  assert.strictEqual($component.hasClass('attached'), false, 'Component\'s wrapper hasn\'t css class');

  this.set('attached', true);
  assert.strictEqual($component.hasClass('attached'), true, 'Component\'s wrapper has css class');

  this.set('attached', false);
  assert.strictEqual($component.hasClass('attached'), false, 'Component\'s wrapper hasn\'t css class');
});

test('visible renders properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{ui-message
    visible=visible
    closeable=true
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $closeableIcon = $component.children('i');

  // Component is visible.
  assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css class \'hidden\'');

  // The component is hidden by the Close button.
  Ember.run(() => {
    $closeableIcon.click();
  });

  assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s wrapper has css class \'hidden\'');

  // Component is visible again.
  this.set('visible', true);
  assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css class \'hidden\'');
});

test('closeable renders properly', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{ui-message
    closeable=true
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $closeableIcon = $component.children('i');

  assert.strictEqual($closeableIcon.hasClass('close'), true, 'Component\'s wrapper has css class');
  assert.strictEqual($closeableIcon.hasClass('icon'), true, 'Component\'s wrapper has css class');
});

test('caption & massage renders properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{ui-message
    caption='My caption'
    message='My message'
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $captionText = $component.children('div');
  let $massageText = $component.children('p');

  assert.strictEqual($captionText.hasClass('header'), true, 'Component\'s wrapper has css class');
  assert.strictEqual(Ember.$.trim($captionText.text()), 'My caption', 'Text component\'s caption right');
  assert.strictEqual(Ember.$.trim($massageText.text()), 'My message', 'Text component\'s caption right');
});

test('icon renders properly', function(assert) {
  assert.expect(7);

  // Render component.
  this.render(hbs`{{ui-message
    icon='icon paw'
    caption='My caption'
    message='My message'
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $messageIcon = $component.children('i');
  let $captionDiv = $component.children('div.content');
  let $captionText = $captionDiv.children('div.header');
  let $massageText = $captionDiv.children('p');

  assert.strictEqual($component.hasClass('icon'), true, 'Component\'s wrapper has css class');
  assert.strictEqual($messageIcon.hasClass('paw'), true, 'Component\'s wrapper has css class');
  assert.strictEqual($messageIcon.hasClass('icon'), true, 'Component\'s wrapper has css class');
  assert.strictEqual($captionDiv.hasClass('content'), true, 'Component\'s wrapper has css class');
  assert.strictEqual($captionText.hasClass('header'), true, 'Component\'s wrapper has css class');
  assert.strictEqual(Ember.$.trim($captionText.text()), 'My caption', 'Text component\'s caption right');
  assert.strictEqual(Ember.$.trim($massageText.text()), 'My message', 'Text component\'s caption right');
});

test('component sends \'onHide\' action', function(assert) {
  assert.expect(3);

  let messageClose = false;
  this.set('actions.onClose', () => {
    messageClose = true;
  });

  // Render component.
  this.render(hbs`{{ui-message
    closeable=true
    onHide=(action \"onClose\")
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $closeableIcon = $component.children('i');

  // The component is visible.
  assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper has\'t css class \'hidden\'');

  // The component is hidden by the Close button.
  Ember.run(() => {
    let done = assert.async();
    $closeableIcon.click();
    setTimeout(() => {
      assert.strictEqual(messageClose, true, 'Component closed');
      assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s wrapper has css class \'hidden\'');
      done();
    }, 50);
  });
});

test('component sends \'onShow\' action', function(assert) {
  assert.expect(4);

  let messageVisible = false;
  this.set('actions.onVisible', () => {
    messageVisible = true;
  });

  // Render component.
  this.render(hbs`{{ui-message
    closeable=true
    visible=visible
    onShow=(action \"onVisible\")
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // The component is hidden.
  this.set('visible', false);
  assert.strictEqual(messageVisible, false, 'Component is not visible');
  assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s wrapper hasn css class \'hidden\'');

  // The component is visible.
  this.set('visible', true);
  assert.strictEqual(messageVisible, true, 'Component is visible');
  assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css class \'hidden\'');
});
