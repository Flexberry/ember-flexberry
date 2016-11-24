import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-textbox', 'Integration | Component | flexberry-textbox', {
  integration: true,

  beforeEach: function () {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
  }
});

test('class changes through base-component\'s dynamic properties works properly', function (assert) {
  assert.expect(6);

  let initialClass = 'class1 class2';
  let anotherClass = 'firstClass secondClass';
  let dynamicProperties = {
    class: initialClass
  };

  this.set('dynamicProperties', dynamicProperties);

  this.render(hbs`
    {{flexberry-textbox
      dynamicProperties=dynamicProperties
    }}
  `);

  let $component = this.$().children();

  assert.strictEqual($component.hasClass('class1'), true, 'Component\'s container has \'class1\' css-class');
  assert.strictEqual($component.hasClass('class2'), true, 'Component\'s container has \'class2\' css-class');

  Ember.set(dynamicProperties, 'class', anotherClass);
  assert.strictEqual($component.hasClass('class1'), false, 'Component\'s container hasn\'t \'class1\' css-class');
  assert.strictEqual($component.hasClass('class2'), false, 'Component\'s container hasn\'t \'class2\' css-class');
  assert.strictEqual($component.hasClass('firstClass'), true, 'Component\'s container has \'firstClass\' css-class');
  assert.strictEqual($component.hasClass('secondClass'), true, 'Component\'s container has \'secondClass\' css-class');
});
