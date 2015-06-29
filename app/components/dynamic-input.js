import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  item: undefined,
  propName: undefined,

  classes: undefined,
  value: undefined,

  init: function () {
    this._super.apply(this, arguments);
    this.set('value', this.item.get(this.propName));
    return Ember.Binding.from("item." + this.propName).to('value').connect(this);
  }
});
