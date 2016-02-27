import Ember from 'ember';
import ModalApplicationRouteMixin from '../mixins/modal-application-route';
import Moment from 'moment';

export default Ember.Route.extend(ModalApplicationRouteMixin, {
  beforeModel: function() {
    var language = navigator.language || navigator.userLanguage || 'en';
    this.set('i18n.locale', language);
    Moment.lang(language);
  }
});
