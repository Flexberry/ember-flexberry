import Ember from 'ember';
import colsConfigMenu from 'ember-flexberry/services/cols-config-menu';
import config from '../config/environment';

let environment = Ember.get(config, 'environment');
colsConfigMenu.reopen({
  environment: environment
});

export default colsConfigMenu;
// export { default } from 'ember-flexberry/services/cols-config-menu';
