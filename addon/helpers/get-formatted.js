/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Helper for get formatted value.

  @class EnumCaptionHelper
  @extends <a href="http://emberjs.com/api/classes/Ember.Helper.html">Ember.Helper</a>
  @public
*/
export default Ember.Helper.extend({
  compute(args, hash) {
    let argFirst = args[0];
    let argSecond = args[1];

    let value = Ember.get(argFirst, argSecond);
    let valueType = Ember.typeOf(value);

    switch (valueType) {
      case 'date':

        // Convert date to string.
        // Locale is current 'locale' from i18n, format is current 'moment.defaultFormat' from config/environment).
        let moment = Ember.get(hash, 'moment');
        let momentValue = moment.moment(value);
        let dateFormat = Ember.get(hash, 'dateFormat');
        return dateFormat ? momentValue.format(dateFormat) : momentValue.format();
      case 'boolean':
        return Ember.String.htmlSafe(`<div class='ui checkbox disabled'><input type='checkbox' class='hidden' ${value ? 'checked' : ''}><label></label></div>`);
      default:
        return value;
    }
  }
});
