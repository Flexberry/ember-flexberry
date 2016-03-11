import Ember from 'ember';
import Moment from 'moment';

export default Ember.Route.extend({

  /**
   * Returns a locale name for the application.
   *
   * @method _getLocale
   * @protected
   * @return {String} Locale name
   */
  _getLocale: function() {
    return navigator.language || navigator.userLanguage || 'en';
  },

  beforeModel: function() {
    var locale = this._getLocale();
    this.set('i18n.locale', locale);
    Moment.locale(locale);
  }
});
