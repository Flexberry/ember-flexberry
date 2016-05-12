import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // /login
  this.route('login');

	this.route('ember-flexberry-dummy-application-user-list');
	this.route('ember-flexberry-dummy-application-user-edit', { path: 'ember-flexberry-dummy-application-user-edit/:id' });
	this.route('ember-flexberry-dummy-application-user-edit.new', { path: 'ember-flexberry-dummy-application-user-edit/new' });
	this.route('ember-flexberry-dummy-comment-list');
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

  // /test-flexberry-dropdown
  this.route('test-flexberry-dropdown');

  // /test-flexberry-dropdown-conditional-render
  this.route('test-flexberry-dropdown-conditional-render');

  // /test-flexberry-groupedit-embedding-components
  this.route('test-flexberry-groupedit');

  // /test-flexberry-menu
  this.route('test-flexberry-menu');
});

export default Router;
