import Ember from 'ember';

/**
  Calls [Ember.Handlebars.SafeString] with the provided string.
  This is a convenient way to render JS variables values and HTML-tags.

  @method toSafeString
  @for Ember.Templates.helpers
  @param {*} value Value to be formatted as safe string.
  @see {Ember.Handlebars.SafeString}
  @public
*/
export default Ember.Helper.extend({
  compute: function ([value]) {
    return new Ember.Handlebars.SafeString(value);
  }
});
