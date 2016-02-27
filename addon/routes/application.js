import Ember from 'ember';
import ModalApplicationRouteMixin from '../mixins/modal-application-route';

export default Ember.Route.extend(ModalApplicationRouteMixin, {
  beforeModel: function() {
    this.set('i18n.locale', navigator.language || navigator.userLanguage || 'en');
  }
});
