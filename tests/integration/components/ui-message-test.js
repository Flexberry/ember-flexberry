import $ from 'jquery';
import { run } from '@ember/runloop';
import { A } from '@ember/array';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-message', 'Integration | Component | ui-message', {
  integration: true,
});

test('it renders properly', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{ui-message}}`);

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
  let sizeTypes = A(['small', 'large', 'huge', 'massive']);
  /* eslint-disable no-unused-vars */
  sizeTypes.forEach((sizeCssClassName, index) => {
    this.set('size', sizeCssClassName);
    assert.strictEqual(
      $component.hasClass(sizeCssClassName),
      true,
      'Component\'s wrapper has size css-class \'' + sizeCssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */

  this.set('size', '');
  /* eslint-disable no-unused-vars */
  sizeTypes.forEach((sizeCssClassName, index) => {
    assert.strictEqual(
      $component.hasClass(sizeCssClassName),
      false,
      'Component\'s wrapper hasn\'t size css-class \'' + sizeCssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */
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
  let typeCssClasses = A(['warning', 'info', 'positive', 'success', 'negative', 'error']);
  /* eslint-disable no-unused-vars */
  typeCssClasses.forEach((typeCssClassName, index) => {
    this.set('type', typeCssClassName);
    assert.strictEqual(
      $component.hasClass(typeCssClassName),
      true,
      'Component\'s wrapper has type css-class \'' + typeCssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */

  this.set('type', '');
  /* eslint-disable no-unused-vars */
  typeCssClasses.forEach((typeCssClassName, index) => {
    assert.strictEqual(
      $component.hasClass(typeCssClassName),
      false,
      'Component\'s wrapper hasn\'t type css-class \'' + typeCssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */
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
  let colorCssClasses = A(['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'black']);
  /* eslint-disable no-unused-vars */
  colorCssClasses.forEach((colorCssClassName, index) => {
    this.set('color', colorCssClassName);
    assert.strictEqual(
      $component.hasClass(colorCssClassName),
      true,
      'Component\'s wrapper has color css-class \'' + colorCssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */

  this.set('color', '');
  /* eslint-disable no-unused-vars */
  colorCssClasses.forEach((colorCssClassName, index) => {
    assert.strictEqual(
      $component.hasClass(colorCssClassName),
      false,
      'Component\'s wrapper hasn\'t color css-class \'' + colorCssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */
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
  assert.strictEqual($component.hasClass('floating'), false, 'Component\'s wrapper hasn\'t \'floating\' css-class');

  this.set('floating', true);
  assert.strictEqual($component.hasClass('floating'), true, 'Component\'s wrapper has \'floating\' css-class');

  this.set('floating', false);
  assert.strictEqual($component.hasClass('floating'), false, 'Component\'s wrapper hasn\'t \'floating\' css-class');
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
  assert.strictEqual($component.hasClass('attached'), false, 'Component\'s wrapper hasn\'t \'attached\' css-class');

  this.set('attached', true);
  assert.strictEqual($component.hasClass('attached'), true, 'Component\'s wrapper has \'attached\' css-class');

  this.set('attached', false);
  assert.strictEqual($component.hasClass('attached'), false, 'Component\'s wrapper hasn\'t \'attached\' css-class');
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
  assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css-class \'hidden\'');

  // The component is hidden by the Close button.
  run(() => {
    $closeableIcon.click();
  });

  assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s wrapper has css-class \'hidden\'');

  // Component is visible again.
  this.set('visible', true);
  assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css-class \'hidden\'');
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

  assert.strictEqual($closeableIcon.hasClass('close'), true, 'Component\'s close icon has css-class \'close\'');
  assert.strictEqual($closeableIcon.hasClass('icon'), true, 'Component\'s wrapper has css-class \'icon\'');
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

  assert.strictEqual($captionText.hasClass('header'), true, 'Component\'s caption block has \'header\' css-class');
  assert.strictEqual($.trim($captionText.text()), 'My caption', 'Component\'s caption is right');
  assert.strictEqual($.trim($massageText.text()), 'My message', 'Component\'s message is right');
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

  assert.strictEqual($component.hasClass('icon'), true, 'Component\'s wrapper has \'icon\' css-class');
  assert.strictEqual($messageIcon.hasClass('paw'), true, 'Component\'s icon has \'paw\' css-class');
  assert.strictEqual($messageIcon.hasClass('icon'), true, 'Component\'s icon has \'icon\' css-class');
  assert.strictEqual($captionDiv.hasClass('content'), true, 'Component\'s content block has \'content\' css-class');
  assert.strictEqual($captionText.hasClass('header'), true, 'Component\'s caption block has \'header\' css-class');
  assert.strictEqual($.trim($captionText.text()), 'My caption', 'Component\'s caption is right');
  assert.strictEqual($.trim($massageText.text()), 'My message', 'Component\'s message is right');
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
  assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper has\'t css-class \'hidden\'');

  // The component is hidden by the Close button.
  run(() => {
    let done = assert.async();
    $closeableIcon.click();
    setTimeout(() => {
      assert.strictEqual(messageClose, true, 'Component closed');
      assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s wrapper has css-class \'hidden\'');
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
  assert.strictEqual($component.hasClass('hidden'), true, 'Component\'s wrapper has css-class \'hidden\'');

  // The component is visible.
  this.set('visible', true);
  assert.strictEqual(messageVisible, true, 'Component is visible');
  assert.strictEqual($component.hasClass('hidden'), false, 'Component\'s wrapper hasn\'t css-class \'hidden\'');
});
