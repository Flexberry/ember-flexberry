import Ember from 'ember';

/**
  Calls [Ember.String.htmlSafe] with the provided string.
  This is a convenient way to render JS variables values and HTML-tags.

  @method toSafeString
  @for Ember.Templates.helpers
  @param {*} value Value to be formatted as safe string.
  @see {Ember.String.htmlSafe}
  @public
*/
export default Ember.Helper.extend({
  compute: function ([value]) {
    return new Ember.String.htmlSafe(value);
  }
});
