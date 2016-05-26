import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('ember-flexberry-dummy-application-user-list');
  this.route('ember-flexberry-dummy-application-user-edit', { path: 'ember-flexberry-dummy-application-user-edit/:id' });
  this.route('ember-flexberry-dummy-application-user-edit.new', { path: 'ember-flexberry-dummy-application-user-edit/new' });
  this.route('ember-flexberry-dummy-comment-edit', { path: 'ember-flexberry-dummy-comment-edit/:id' });
  this.route('ember-flexberry-dummy-comment-edit.new', { path: 'ember-flexberry-dummy-comment-edit/new' });
  this.route('ember-flexberry-dummy-localization-list');
  this.route('ember-flexberry-dummy-localization-edit', { path: 'ember-flexberry-dummy-localization-edit/:id' });
  this.route('ember-flexberry-dummy-localization-edit.new', { path: 'ember-flexberry-dummy-localization-edit/new' });
  this.route('ember-flexberry-dummy-suggestion-list');
  this.route('ember-flexberry-dummy-suggestion-edit', { path: 'ember-flexberry-dummy-suggestion-edit/:id' });
  this.route('ember-flexberry-dummy-suggestion-edit.new', { path: 'ember-flexberry-dummy-suggestion-edit/new' });
  this.route('ember-flexberry-dummy-suggestion-type-list');
  this.route('ember-flexberry-dummy-suggestion-type-edit', { path: 'ember-flexberry-dummy-suggestion-type-edit/:id' });
  this.route('ember-flexberry-dummy-suggestion-type-edit.new', { path: 'ember-flexberry-dummy-suggestion-type-edit/new' });

  // /components-examples/flexberry-dropdown/settings-example.
  this.route('components-examples/flexberry-dropdown/settings-example');

  // /components-examples/flexberry-dropdown/conditional-render-example.
  this.route('components-examples/flexberry-dropdown/conditional-render-example');

  // /components-examples/flexberry-menu/settings-example.
  this.route('components-examples/flexberry-menu/settings-example');

  // /components-examples/flexberry-lookup/settings-example.
  this.route('components-examples/flexberry-lookup/settings-example');

  // /components-examples/flexberry-groupedit/settings-example.
  this.route('components-examples/flexberry-groupedit/settings-example');
});

export default Router;
