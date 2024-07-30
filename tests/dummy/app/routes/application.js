import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default Route.extend({
  intl: service(),

  store: service(),

  beforeModel() {
    this.intl.setLocale(['ru']);
  }
});
