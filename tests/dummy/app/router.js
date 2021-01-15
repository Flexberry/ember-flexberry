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

  this.route('ember-flexberry-dummy-multi-list');
  this.route('ember-flexberry-dummy-multi-list-user-edit', { path: 'ember-flexberry-dummy-multi-list-user-edit/:id' });
  this.route('ember-flexberry-dummy-multi-list-user-edit.new', { path: 'ember-flexberry-dummy-multi-list-user-edit/new' });
  this.route('components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit',
    { path: 'components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit/:id' });
  this.route('components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit.new',
    { path: 'components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit/new' });

  this.route('ember-flexberry-dummy-comment-edit', { path: 'ember-flexberry-dummy-comment-edit/:id' });
  this.route('ember-flexberry-dummy-comment-edit.new', { path: 'ember-flexberry-dummy-comment-edit/new' });

  this.route('ember-flexberry-dummy-comment-vote-edit', { path: 'ember-flexberry-dummy-comment-vote-edit/:id' });
  this.route('ember-flexberry-dummy-comment-vote-edit.new', { path: 'ember-flexberry-dummy-comment-vote-edit/new' });

  this.route('ember-flexberry-dummy-localization-list');
  this.route('ember-flexberry-dummy-localization-edit', { path: 'ember-flexberry-dummy-localization-edit/:id' });
  this.route('ember-flexberry-dummy-localization-edit.new', { path: 'ember-flexberry-dummy-localization-edit/new' });

  this.route('ember-flexberry-dummy-suggestion-list');
  this.route('ember-flexberry-dummy-suggestion-edit', { path: 'ember-flexberry-dummy-suggestion-edit/:id' });
  this.route('ember-flexberry-dummy-suggestion-edit.new', { path: 'ember-flexberry-dummy-suggestion-edit/new' });

  this.route('ember-flexberry-dummy-suggestion-file-list');
  this.route('ember-flexberry-dummy-suggestion-file-edit', { path: 'ember-flexberry-dummy-suggestion-file-edit/:id' });
  this.route('ember-flexberry-dummy-suggestion-file-edit.new', { path: 'ember-flexberry-dummy-suggestion-file-edit/new' });

  this.route('ember-flexberry-dummy-suggestion-type-list');
  this.route('ember-flexberry-dummy-suggestion-type-edit', { path: 'ember-flexberry-dummy-suggestion-type-edit/:id' });
  this.route('ember-flexberry-dummy-suggestion-type-edit.new', { path: 'ember-flexberry-dummy-suggestion-type-edit/new' });

  this.route('ember-flexberry-dummy-toggler-example-master-e', { path: 'ember-flexberry-dummy-toggler-example-master-e/:id' });
  this.route('ember-flexberry-dummy-toggler-example-master-e.new', { path: 'ember-flexberry-dummy-toggler-example-master-e/new' });

  // Logging.
  this.route('i-i-s-caseberry-logging-objects-application-log-l');
  this.route('i-i-s-caseberry-logging-objects-application-log-e', { path: 'i-i-s-caseberry-logging-objects-application-log-e/:id' });
  this.route('i-i-s-caseberry-logging-objects-application-log-e.new', { path: 'i-i-s-caseberry-logging-objects-application-log-e/new' });
  this.route('log-service-examples/settings-example');
  this.route('log-service-examples/clear-log-form');

  // Locks.
  this.route('new-platform-flexberry-services-lock-list');

  // Components examples routes (sorted by component's names).
  this.route('components-examples/flexberry-button/settings-example');
  this.route('components-examples/flexberry-checkbox/three-state-example');
  this.route('components-examples/flexberry-checkbox/settings-example');
  this.route('components-examples/flexberry-ddau-checkbox/settings-example');
  this.route('components-examples/flexberry-datepicker/settings-example');
  this.route('components-examples/flexberry-dropdown/settings-example');
  this.route('components-examples/flexberry-dropdown/conditional-render-example');
  this.route('components-examples/flexberry-dropdown/empty-value-example');
  this.route('components-examples/flexberry-dropdown/items-example');
  this.route('components-examples/flexberry-field/settings-example');
  this.route('components-examples/flexberry-file/settings-example');
  this.route('components-examples/flexberry-file/flexberry-file-in-modal');
  this.route('components-examples/flexberry-groupedit/settings-example');
  this.route('components-examples/flexberry-groupedit/model-update-example');
  this.route('components-examples/flexberry-groupedit/custom-buttons-example');
  this.route('components-examples/flexberry-groupedit/configurate-row-example');
  this.route('components-examples/flexberry-lookup/settings-example');
  this.route('components-examples/flexberry-lookup/customizing-window-example');
  this.route('components-examples/flexberry-lookup/hierarchy-olv-in-lookup-example');
  this.route('components-examples/flexberry-lookup/limit-function-example');
  this.route('components-examples/flexberry-lookup/autofill-by-limit-example');
  this.route('components-examples/flexberry-lookup/limit-function-through-dynamic-properties-example');
  this.route('components-examples/flexberry-lookup/lookup-block-form-example');
  this.route('components-examples/flexberry-lookup/lookup-in-modal');
  this.route('components-examples/flexberry-lookup/dropdown-mode-example');
  this.route('components-examples/flexberry-lookup/default-ordering-example');
  this.route('components-examples/flexberry-lookup/autocomplete-order-example');
  this.route('components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-list');
  this.route('components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-edit',
    { path: 'components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-edit/:id' });
  this.route('components-examples/flexberry-lookup/numeric-autocomplete');
  this.route('components-examples/flexberry-lookup/user-settings-example');
  this.route('components-examples/flexberry-menu/settings-example');
  this.route('components-examples/flexberry-objectlistview/settings-example');
  this.route('components-examples/flexberry-objectlistview/toolbar-custom-buttons-example');
  this.route('components-examples/flexberry-objectlistview/inheritance-models');
  this.route('components-examples/flexberry-objectlistview/inheritance-models/parent-list');
  this.route('components-examples/flexberry-objectlistview/inheritance-models/parent-edit',
    { path: 'components-examples/flexberry-objectlistview/inheritance-models/parent-edit/:id' });
  this.route('components-examples/flexberry-objectlistview/inheritance-models/parent-edit.new',
    { path: 'components-examples/flexberry-objectlistview/inheritance-models/parent-edit/new' });
  this.route('components-examples/flexberry-objectlistview/inheritance-models/successor-phone-list');
  this.route('components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit',
    { path: 'components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit/:id' });
  this.route('components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit.new',
    { path: 'components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit/new' });
  this.route('components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-list');
  this.route('components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit',
    { path: 'components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit/:id' });
  this.route('components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit.new',
    { path: 'components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit/new' });
  this.route('components-examples/flexberry-objectlistview/limit-function-example');
  this.route('components-examples/flexberry-objectlistview/on-edit-form');
  this.route('components-examples/flexberry-objectlistview/on-edit-form/user', { path: 'components-examples/flexberry-objectlistview/on-edit-form/user/:id' });
  this.route('components-examples/flexberry-objectlistview/list-on-editform');
  this.route('components-examples/flexberry-objectlistview/on-edit-form/suggestion',
  { path:
    'components-examples/flexberry-objectlistview/on-edit-form/suggestion/:id'
  });
  this.route('components-examples/flexberry-objectlistview/custom-filter');
  this.route('components-examples/flexberry-objectlistview/edit-form-with-detail-list');
  this.route('components-examples/flexberry-objectlistview/edit-form-with-detail-edit',
  { path: 'components-examples/flexberry-objectlistview/edit-form-with-detail-edit/:id' });
  this.route('components-examples/flexberry-objectlistview/edit-form-with-detail-edit.new',
  { path: 'components-examples/flexberry-objectlistview/edit-form-with-detail-edit/new' });
  this.route('components-examples/flexberry-objectlistview/configurate-rows');
  this.route('components-examples/flexberry-objectlistview/object-list-view-resize');
  this.route('components-examples/flexberry-objectlistview/hierarchy-example');
  this.route('components-examples/flexberry-objectlistview/hierarchy-paging-example');
  this.route('components-examples/flexberry-objectlistview/selected-rows');
  this.route('components-examples/flexberry-objectlistview/downloading-files-from-olv-list');
  this.route('components-examples/flexberry-objectlistview/downloading-files-from-olv-edit',
  { path: 'components-examples/flexberry-objectlistview/downloading-files-from-olv-edit/:id' });
  this.route('components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list');
  this.route('components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-edit',
  { path: 'components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-edit/:id' });
  this.route('components-examples/flexberry-objectlistview/lock-services-editor-view-list');
  this.route('components-examples/flexberry-objectlistview/lock-services-editor-view-edit',
  { path: 'components-examples/flexberry-objectlistview/lock-services-editor-view-edit/:id' });
  this.route('components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record');
  this.route('components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise');
  this.route('components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-cancel');
  this.route('components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-cancel');
  this.route('components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-immediately');
  this.route('components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-immediately');
  this.route('components-examples/flexberry-objectlistview/limited-text-size-example');

  this.route('components-examples/flexberry-simpleolv/settings-example');
  this.route('components-examples/flexberry-simpleolv/toolbar-custom-buttons-example');
  this.route('components-examples/flexberry-simpleolv/limit-function-example');
  this.route('components-examples/flexberry-simpleolv/on-edit-form');
  this.route('components-examples/flexberry-simpleolv/on-edit-form/user', { path: 'components-examples/flexberry-simpleolv/on-edit-form/user/:id' });
  this.route('components-examples/flexberry-simpleolv/custom-filter');
  this.route('components-examples/flexberry-simpleolv/configurate-rows');
  this.route('components-examples/flexberry-simpleolv/selected-rows');
  this.route('components-examples/flexberry-simpledatetime/settings-example');
  this.route('components-examples/flexberry-text-cell/settings-example');
  this.route('components-examples/flexberry-textarea/settings-example');
  this.route('components-examples/flexberry-textbox/settings-example');
  this.route('components-examples/flexberry-toggler/settings-example');
  this.route('components-examples/flexberry-toggler/settings-example-inner');
  this.route('components-examples/flexberry-toggler/ge-into-toggler-example');
  this.route('components-examples/flexberry-tree/settings-example');
  this.route('components-examples/ui-message/settings-example');

  // Integration examples routes.
  this.route('integration-examples/edit-form/readonly-mode');
  this.route('integration-examples/edit-form/validation');

  // User-setting forms.
  this.route('user-setting-forms/user-setting-delete');

  // Components acceptance tests forms.
  this.route('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  this.route('components-acceptance-tests/flexberry-lookup/base-operations');
  this.route('components-acceptance-tests/flexberry-lookup/settings-example');
  this.route('components-acceptance-tests/flexberry-lookup/settings-example-autocomplete');
  this.route('components-acceptance-tests/flexberry-lookup/settings-example-dropdown');
  this.route('components-acceptance-tests/flexberry-lookup/settings-example-projection');
  this.route('components-acceptance-tests/flexberry-lookup/settings-example-actions');
  this.route('components-acceptance-tests/flexberry-lookup/settings-example-relation-name');
  this.route('components-acceptance-tests/flexberry-lookup/settings-example-limit-function');
  this.route('components-acceptance-tests/flexberry-lookup/settings-example-preview');
  this.route('components-acceptance-tests/flexberry-lookup/settings-example-preview-page',
  { path: 'components-acceptance-tests/flexberry-lookup/settings-example-preview-page/:id' });

  this.route('components-acceptance-tests/flexberry-objectlistview/base-operations');
  this.route('components-acceptance-tests/flexberry-objectlistview/computable-field');
  this.route('components-acceptance-tests/flexberry-objectlistview/folv-paging');
  this.route('components-acceptance-tests/flexberry-objectlistview/date-format');
  this.route('components-acceptance-tests/edit-form-readonly');
  this.route('components-acceptance-tests/edit-form-validation/validation');
  this.route('components-acceptance-tests/flexberry-objectlistview/folv-filter');
  this.route('components-acceptance-tests/flexberry-objectlistview/custom-filter');

  this.route('components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-groupedit-with-lookup-with-computed-atribute');
  this.route('components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-groupedit-with-lookup-with-computed-atribute',
  { path: 'components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-groupedit-with-lookup-with-computed-atribute/:id' });
  this.route('components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-readonly-columns-by-configurate-row-example');
  this.route('components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-readonly-columns-by-configurate-row-example',
  { path: 'components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-readonly-columns-by-configurate-row-example/:id' });

  this.route('components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox');
  this.route('components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox',
  { path: 'components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox/:id' });
  this.route('components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox.new',
  { path: 'components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox/new' });

});

export default Router;
