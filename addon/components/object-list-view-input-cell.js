import BaseComponent from './flexberry-base';

export default BaseComponent.extend({
  tagName: 'td',
  classNames: [],
  column: null,
  record: null,

  didInsertElement: function() {
    var _this = this;
    this.$('input').change(function() {
      _this.record.set(_this.column.propName, _this.$(this).val());
    });
  }
});
