import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-textbox', 'Integration | Component | flexberry textbox', {
  integration: true,

  beforeEach: function () {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
  }
});

test('Testing dynamicProperties of flexberry-base-component', function (assert) {
  assert.expect(5);

  let propertyValueClass = 'firstClass secondClass';
  let propertyValueClassChange = 'firstClass secondClass thirdClass';
  let dynamicPropertiesTemp = { class: propertyValueClass };

  this.set('dynamicPropertiesTemp', dynamicPropertiesTemp);

  this.render(hbs`
    {{#flexberry-textbox
      dynamicProperties = dynamicPropertiesTemp
    }}
      template block text
    {{/flexberry-textbox}}
  `);

  let $component = this.$().children();

  assert.strictEqual($component.hasClass('firstClass'), true,
    'Component\'s container has \'firstClass\' css-class');
  assert.strictEqual($component.hasClass('secondClass'), true,
    'Component\'s container has \'secondClass\' css-class');

  Ember.set(dynamicPropertiesTemp, 'class', propertyValueClassChange);

  $component = this.$().children();

  assert.strictEqual($component.hasClass('firstClass'), true,
    'Component\'s container has \'firstClass\' css-class');
  assert.strictEqual($component.hasClass('secondClass'), true,
    'Component\'s container has \'secondClass\' css-class');
  assert.strictEqual($component.hasClass('thirdClass'), true,
    'Component\'s container has \'thirdClass\' css-class');
});
