import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // Edit forms & list forms.
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

  //Logging
  this.route('i-i-s-caseberry-logging-objects-application-log-l');
  this.route('i-i-s-caseberry-logging-objects-application-log-e', { path: 'i-i-s-caseberry-logging-objects-application-log-e/:id' });
  this.route('i-i-s-caseberry-logging-objects-application-log-e.new', { path: 'i-i-s-caseberry-logging-objects-application-log-e/new' });

  // Components examples routes (sorted by component's names).
  this.route('components-examples/flexberry-checkbox/settings-example');
  this.route('components-examples/flexberry-dropdown/settings-example');
  this.route('components-examples/flexberry-dropdown/conditional-render-example');
  this.route('components-examples/flexberry-field/settings-example');
  this.route('components-examples/flexberry-groupedit/settings-example');
  this.route('components-examples/flexberry-lookup/settings-example');
  this.route('components-examples/flexberry-lookup/customizing-window-example');
  this.route('components-examples/flexberry-lookup/limit-function-example');
  this.route('components-examples/flexberry-lookup/dropdown-mode-example');
  this.route('components-examples/flexberry-menu/settings-example');
  this.route('components-examples/flexberry-objectlistview/limit-function-example');
  this.route('components-examples/flexberry-textarea/settings-example');
  this.route('components-examples/flexberry-textbox/settings-example');
  this.route('components-examples/flexberry-toggler/settings-example');
});

export default Router;
