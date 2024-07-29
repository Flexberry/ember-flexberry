import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default Route.extend({
  intl: service(),

  store: service(),

  beforeModel() {
    this.intl.setLocale(['ru']);
  },

  model(params) {
    return this.store.findRecord('ember-flexberry-dummy-application-user', '25ffc9ca-b45b-4185-be49-ba944002f2ea').then(function(user) {
      return user;
  });
  }
});
