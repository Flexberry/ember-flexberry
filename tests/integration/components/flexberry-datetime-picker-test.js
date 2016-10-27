import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-datepicker', 'Integration | Component | Flexberry datepicker', {
  integration: true,

  beforeEach: function () {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{flexberry-datepicker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#flexberry-datepicker}}
      template block text
    {{/flexberry-datepicker}}
  `);

  //Component does not support template block usage.
  assert.equal(this.$().text().trim(), '');
});

test('Testing dynamicProperties of flexberry-base-component', function (assert) {
  assert.expect(2);

  let propertyNameValue = 'class';
  let propertyValueClass = 'firstClass secondClass';
  let propertyValueClassChange = 'firstClass secondClass thirdClass';
  let dynamicPropertiesTemp = { class: propertyValueClass, propertyName: propertyNameValue };

  this.set('dynamicPropertiesTemp', dynamicPropertiesTemp);

  this.render(hbs`
    {{#flexberry-textbox
      dynamicProperties = dynamicPropertiesTemp
    }}
      template block text
    {{/flexberry-textbox}}
  `);

  let $component = this.$().children();

  assert.strictEqual($component.hasClass(propertyValueClass), true,
    'Component\'s container has \'firstClass and secondClass\' css-class');

  Ember.set(dynamicPropertiesTemp, 'class', propertyValueClassChange);

  this.set('dynamicPropertiesTemp', dynamicPropertiesTemp);

  $component = this.$().children();

  assert.strictEqual($component.hasClass(propertyValueClassChange), true,
    'Component\'s container has \'firstClass, secondClass and thirdClass\' css-class');
});
