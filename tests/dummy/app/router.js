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

  // Logging.
  this.route('i-i-s-caseberry-logging-objects-application-log-l');
  this.route('i-i-s-caseberry-logging-objects-application-log-e', { path: 'i-i-s-caseberry-logging-objects-application-log-e/:id' });
  this.route('i-i-s-caseberry-logging-objects-application-log-e.new', { path: 'i-i-s-caseberry-logging-objects-application-log-e/new' });
  this.route('log-service-examples/settings-example');

  // Components examples routes (sorted by component's names).
  this.route('components-examples/flexberry-checkbox/settings-example');
  this.route('components-examples/flexberry-datepicker/settings-example');
  this.route('components-examples/flexberry-dropdown/settings-example');
  this.route('components-examples/flexberry-dropdown/conditional-render-example');
  this.route('components-examples/flexberry-dropdown/items-example');
  this.route('components-examples/flexberry-field/settings-example');
  this.route('components-examples/flexberry-file/settings-example');
  this.route('components-examples/flexberry-groupedit/settings-example');
  this.route('components-examples/flexberry-groupedit/model-update-example');
  this.route('components-examples/flexberry-lookup/settings-example');
  this.route('components-examples/flexberry-lookup/customizing-window-example');
  this.route('components-examples/flexberry-lookup/limit-function-example');
  this.route('components-examples/flexberry-lookup/lookup-block-form-example');
  this.route('components-examples/flexberry-lookup/lookup-in-modal');
  this.route('components-examples/flexberry-lookup/dropdown-mode-example');
  this.route('components-examples/flexberry-menu/settings-example');
  this.route('components-examples/flexberry-objectlistview/settings-example');
  this.route('components-examples/flexberry-objectlistview/toolbar-custom-buttons-example');
  this.route('components-examples/flexberry-objectlistview/limit-function-example');
  this.route('components-examples/flexberry-objectlistview/on-edit-form');
  this.route('components-examples/flexberry-objectlistview/on-edit-form/user', { path: 'components-examples/flexberry-objectlistview/on-edit-form/user/:id' });
  this.route('components-examples/flexberry-objectlistview/custom-filter');
  this.route('components-examples/flexberry-simpledatetime/settings-example');
  this.route('components-examples/flexberry-textarea/settings-example');
  this.route('components-examples/flexberry-textbox/settings-example');
  this.route('components-examples/flexberry-toggler/settings-example');

  // Integration examples routes
  this.route('integration-examples/edit-form/readonly-mode');
  this.route('integration-examples/edit-form/validation');

});

export default Router;
