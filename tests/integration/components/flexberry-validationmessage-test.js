import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-validationmessage', 'Integration | Component | flexberry-validationmessage', {
  integration: true
});

test('it renders and works', function (assert) {
  this.render(hbs`{{flexberry-validationmessage error=error color=color pointing=pointing}}`);

  [undefined, null, '', []].forEach((error) => {
    this.set('error', error);
    assert.ok(this.$('.ui.label').is(':hidden'), 'Component is hidden if no error.');
  });

  this.set('error', 'This is error.');
  assert.ok(this.$('.ui.label').is(':visible'), 'Component is visible if there errors.');
  assert.equal(this.$().text().trim(), 'This is error.', 'Component shows error.');

  this.set('error', ['First error.', 'Second error.']);
  assert.equal(this.$().text().trim(), 'First error.,Second error.', 'Component shows all errors.');

  assert.notOk(this.$('.ui.label').hasClass('red'), 'Override default color with undefined value.');
  assert.notOk(this.$('.ui.label').hasClass('pointing'), 'Override default pointing with undefined value.');

  this.set('color', 'pink');
  this.set('pointing', 'left pointing');
  assert.ok(this.$('.ui.label').hasClass('pink'), 'Color works through CSS class.');
  assert.ok(this.$('.ui.label').hasClass('left'), 'Pointing works through CSS class.');

  this.render(hbs`{{flexberry-validationmessage}}`);
  assert.ok(this.$('.ui.label').hasClass('red'), `Default color 'red'.`);
  assert.ok(this.$('.ui.label').hasClass('pointing'), `Default pointing 'pointing'.`);
});
