import Ember from 'ember';

// dynamic input component to bind {{input}} helper to an object property by property name
export default Ember.Component.extend({
  // remove default tag name to avoid wrapping component content
  tagName: '',
  // item to which property input binding
  item: undefined,
  // item property name
  propName: undefined,
  // string with input css classes
  classes: undefined,
  // input value
  value: undefined,

  init: function () {
    this._super.apply(this, arguments);
    // set input value on component init
    this.set('value', this.item.get(this.propName));
    // bind item[propertyName] to this.value property. Now we can edit input and item property will be auto-updated
    return Ember.Binding.from("item." + this.propName).to('value').connect(this);
  }
});
