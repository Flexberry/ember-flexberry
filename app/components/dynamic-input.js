import Ember from 'ember';

// Dynamic input component to bind {{input}} helper to an object property by property name.
export default Ember.Component.extend({

  // Remove default tag name to avoid wrapping component content.
  tagName: '',

  // Item to which property input binding.
  item: undefined,

  // Item property name.
  propName: undefined,

  // String with input css classes.
  classes: undefined,

  // Flag to make control readonly.
  readonly: false,

  // Input value.
  value: undefined,

  init: function() {
    this._super.apply(this, arguments);

    // Set input value on component init.
    this.set('value', this.item.get(this.propName));

    // Bind item[propertyName] to this.value property.
    // Now we can edit input and item property will be auto-updated.
    return Ember.Binding.from('item.' + this.propName).to('value').connect(this);
  }
});
