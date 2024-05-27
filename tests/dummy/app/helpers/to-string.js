import Helper from '@ember/component/helper';

/**
  Casts given value into string.
  This is a convenient way to render JS variables values as their string representations.

  @method toString
  @for Ember.Templates.helpers
  @param {*} value Value to be casted into string.
  @public
*/
export default Helper.extend({
  compute: function ([value]) {
    return '' + value;
  }
});
