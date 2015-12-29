/**
 * @module ember-flexberry
 */

import BaseComponent from './flexberry-base-component';

export default BaseComponent.extend({
  tagName: 'td',
  classNames: [],
  column: null,
  record: null,

  didInsertElement: function() {
    var _this = this;
    this.$('input').change(function() {
      _this._setValue();
    });
    this.$('input').keyup(function() {
      _this._setValue();
    });
  },

  _setValue: function() {
    var currentModelValue = this.record.get(this.column.propName);
    var currentInputValue = this.$('input').val();
    if (currentModelValue !== currentInputValue) {
      this.record.set(this.column.propName, currentInputValue);
    }
  }
});
