import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

inflector.irregular('poly', 'polys');
inflector.irregular('child', 'childs');
inflector.uncountable('advice');

export default App;
