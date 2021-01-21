'use strict';

module.exports = {
  extends: ['recommended', 'stylistic'],
  rules: {
    'no-bare-strings': true
  },
  ignore: [
    'blueprints/flexberry-edit-form/snippets/**',
    'blueprints/**/files/**/templates/__name__'
  ],
  pending: [
    {
      "moduleId": "app/templates/advlimit-dialog-content",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/advlimit-dialog",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/colsconfig-dialog-content",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/colsconfig-dialog",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/filters-dialog-content",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/filters-dialog",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/flexberry-file-view-dialog",
      "only": [
        "eol-last",
        "no-unnecessary-concat",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/i-i-s-caseberry-logging-objects-application-log-e",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "no-inline-styles",
        "simple-unless",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "app/templates/i-i-s-caseberry-logging-objects-application-log-l",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/lookup-dialog",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/new-platform-flexberry-services-lock-list",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/sitemap-node-content",
      "only": [
        "quotes",
        "deprecated-render-helper",
        "no-invalid-interactive"
      ]
    },
    {
      "moduleId": "app/templates/sitemap-node",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "no-invalid-interactive",
        "no-partial"
      ]
    },
    {
      "moduleId": "app/templates/sitemap",
      "only": [
        "block-indentation",
        "eol-last",
        "deprecated-render-helper"
      ]
    },
    {
      "moduleId": "app/templates/components/advlimit-dialog-content",
      "only": [
        "eol-last",
        "quotes",
        "no-invalid-interactive"
      ]
    },
    {
      "moduleId": "app/templates/components/colsconfig-dialog-content",
      "only": [
        "block-indentation",
        "eol-last",
        "no-trailing-spaces",
        "no-unnecessary-concat",
        "quotes",
        "link-href-attributes",
        "no-inline-styles",
        "no-invalid-interactive",
        "no-quoteless-attributes"
      ]
    },
    {
      "moduleId": "app/templates/components/filters-dialog-content",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-button",
      "only": [
        "eol-last",
        "no-unnecessary-concat"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-checkbox",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-colorpicker",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-datepicker",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-ddau-checkbox",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-ddau-slider",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-dialog",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-dropdown",
      "only": [
        "eol-last",
        "no-unnecessary-concat",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-error",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-field",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-file",
      "only": [
        "eol-last",
        "self-closing-void-elements",
        "no-inline-styles",
        "no-invalid-interactive"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-groupedit",
      "only": [
        "eol-last",
        "quotes",
        "no-attrs-in-components"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-icon",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-jsonarea",
      "only": [
        "eol-last",
        "no-negated-condition"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-lookup",
      "only": [
        "eol-last",
        "no-invalid-interactive",
        "no-triple-curlies"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-menuitem",
      "only": [
        "block-indentation",
        "eol-last",
        "no-unnecessary-concat",
        "no-negated-condition",
        "no-shadowed-elements"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-objectlistview",
      "only": [
        "quotes",
        "no-attrs-in-components"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-simpledatetime",
      "only": [
        "eol-last",
        "self-closing-void-elements"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-simpleolv",
      "only": [
        "block-indentation",
        "eol-last",
        "no-unnecessary-concat",
        "quotes",
        "self-closing-void-elements",
        "no-attrs-in-components",
        "no-inline-styles",
        "no-invalid-interactive",
        "simple-unless",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-tab-bar",
      "only": [
        "eol-last",
        "no-unnecessary-concat",
        "link-href-attributes",
        "no-invalid-interactive"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-text-cell",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-textarea",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-textbox",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-toggler",
      "only": [
        "eol-last",
        "no-unnecessary-concat",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-tree",
      "only": [
        "eol-last",
        "no-unnecessary-concat"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-treenode",
      "only": [
        "block-indentation",
        "eol-last",
        "no-inline-styles",
        "no-invalid-interactive"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-validationmessage",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-validationsummary",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/form-load-time-tracker",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/groupedit-toolbar",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/components/modal-dialog",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/components/object-list-view-cell",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/object-list-view-row",
      "only": [
        "block-indentation",
        "eol-last",
        "no-unnecessary-concat",
        "no-invalid-interactive",
        "no-unbound"
      ]
    },
    {
      "moduleId": "app/templates/components/object-list-view-single-column-cell",
      "only": [
        "eol-last",
        "no-negated-condition"
      ]
    },
    {
      "moduleId": "app/templates/components/object-list-view",
      "only": [
        "block-indentation",
        "eol-last",
        "no-unnecessary-concat",
        "quotes",
        "no-inline-styles",
        "no-invalid-interactive",
        "no-unbound",
        "simple-unless",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "app/templates/components/olv-filter-interval",
      "only": [
        "no-inline-styles"
      ]
    },
    {
      "moduleId": "app/templates/components/olv-setconfigdialogbutton",
      "only": [
        "eol-last",
        "quotes",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "app/templates/components/olv-toolbar",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "app/templates/components/ui-message-content",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/ui-message",
      "only": [
        "eol-last",
        "no-unnecessary-concat",
        "no-partial"
      ]
    },
    {
      "moduleId": "app/templates/mobile/sitemap-node",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "no-invalid-interactive",
        "no-partial"
      ]
    },
    {
      "moduleId": "app/templates/mobile/components/colsconfig-dialog-content",
      "only": [
        "eol-last",
        "no-unnecessary-concat",
        "quotes",
        "link-href-attributes"
      ]
    },
    {
      "moduleId": "app/templates/mobile/components/flexberry-file",
      "only": [
        "block-indentation",
        "eol-last",
        "self-closing-void-elements",
        "no-inline-styles",
        "no-invalid-interactive"
      ]
    },
    {
      "moduleId": "app/templates/mobile/components/flexberry-objectlistview",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "no-negated-condition"
      ]
    },
    {
      "moduleId": "app/templates/mobile/components/flexberry-simpleolv",
      "only": [
        "block-indentation",
        "eol-last",
        "no-unnecessary-concat",
        "quotes",
        "self-closing-void-elements",
        "no-inline-styles",
        "no-invalid-interactive",
        "no-unnecessary-component-helper",
        "simple-unless",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "app/templates/mobile/components/object-list-view-row",
      "only": [
        "eol-last",
        "no-unnecessary-concat",
        "no-inline-styles",
        "no-invalid-interactive",
        "no-unbound",
        "style-concatenation"
      ]
    },
    {
      "moduleId": "app/templates/mobile/components/object-list-view",
      "only": [
        "block-indentation",
        "eol-last",
        "no-unnecessary-concat",
        "quotes",
        "no-inline-styles",
        "no-invalid-interactive",
        "no-unbound",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/application-with-submenu",
      "only": [
        "eol-last",
        "quotes",
        "self-closing-void-elements",
        "deprecated-render-helper",
        "link-rel-noopener",
        "link-href-attributes",
        "no-invalid-interactive",
        "require-valid-alt-text"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/application",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "self-closing-void-elements",
        "deprecated-render-helper",
        "link-rel-noopener",
        "link-href-attributes",
        "no-inline-styles",
        "no-invalid-interactive",
        "require-valid-alt-text"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-application-user-edit",
      "only": [
        "eol-last",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-application-user-list",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-comment-edit",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-comment-vote-edit",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-localization-edit",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-localization-list",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-multi-list-user-edit",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "self-closing-void-elements",
        "no-inline-styles",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-multi-list",
      "only": [
        "eol-last",
        "quotes",
        "no-duplicate-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-suggestion-edit",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-suggestion-file-edit",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-suggestion-file-list",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-suggestion-list",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-suggestion-type-edit",
      "only": [
        "eol-last",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-suggestion-type-list",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-toggler-example-master-e",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/index",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/loading",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/new-platform-flexberry-services-lock-list",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "blueprints/flexberry-core/files/__root__/templates/application-with-submenu",
      "only": [
        "eol-last",
        "quotes",
        "deprecated-render-helper",
        "link-href-attributes",
        "no-invalid-interactive",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "blueprints/flexberry-core/files/__root__/templates/application",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "self-closing-void-elements",
        "deprecated-render-helper",
        "link-rel-noopener",
        "link-href-attributes",
        "no-invalid-interactive",
        "require-valid-alt-text",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components/css-picker",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components/settings-example",
      "only": [
        "block-indentation",
        "eol-last",
        "no-inline-styles",
        "style-concatenation"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/edit-form-readonly",
      "only": [
        "eol-last",
        "no-duplicate-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/log-service-examples/clear-log-form",
      "only": [
        "block-indentation",
        "eol-last",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/log-service-examples/settings-example",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "no-duplicate-attributes",
        "no-inline-styles",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/mobile/application",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "deprecated-render-helper",
        "link-rel-noopener",
        "link-href-attributes",
        "no-inline-styles",
        "no-invalid-interactive"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/user-setting-forms/user-setting-delete",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "blueprints/flexberry-core/files/__root__/templates/mobile/application",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "deprecated-render-helper",
        "link-rel-noopener",
        "link-href-attributes",
        "no-inline-styles",
        "no-invalid-interactive"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/edit-form-validation/validation",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/base-operations",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-actions",
      "only": [
        "eol-last",
        "no-duplicate-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-autocomplete",
      "only": [
        "eol-last",
        "no-duplicate-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-dropdown",
      "only": [
        "eol-last",
        "no-duplicate-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-limit-function",
      "only": [
        "eol-last",
        "quotes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-preview-page",
      "only": [
        "eol-last",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-preview",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-relation-name",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/base-operations",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/computable-field",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/custom-filter",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/date-format",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/folv-filter",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/folv-paging",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-button/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-checkbox/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-datepicker/settings-example",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-ddau-checkbox/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-dropdown/conditional-render-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-dropdown/empty-value-example",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-dropdown/items-example",
      "only": [
        "eol-last",
        "quotes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-dropdown/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-field/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-file/flexberry-file-in-modal",
      "only": [
        "eol-last",
        "quotes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-file/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/configurate-row-example",
      "only": [
        "eol-last",
        "no-duplicate-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/custom-buttons-example",
      "only": [
        "eol-last",
        "no-duplicate-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-groupedit-with-lookup-with-computed-atribute",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-readonly-columns-by-configurate-row-example",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-groupedit-with-lookup-with-computed-atribute",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-readonly-columns-by-configurate-row-example",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/model-update-example",
      "only": [
        "eol-last",
        "quotes",
        "no-duplicate-attributes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/autocomplete-order-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/autofill-by-limit-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/customizing-window-example",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/default-ordering-example",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/dropdown-mode-example",
      "only": [
        "block-indentation",
        "eol-last",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/hierarchy-olv-in-lookup-example",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/limit-function-example",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/limit-function-through-dynamic-properties-example",
      "only": [
        "eol-last",
        "quotes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/lookup-block-form-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/lookup-in-modal",
      "only": [
        "eol-last",
        "quotes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/numeric-autocomplete",
      "only": [
        "eol-last",
        "no-multiple-empty-lines"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-menu/settings-example",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/configurate-rows",
      "only": [
        "eol-last",
        "quotes",
        "no-duplicate-attributes",
        "require-button-type",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/custom-filter",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/downloading-files-from-olv-edit",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/downloading-files-from-olv-list",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/edit-form-with-detail-edit",
      "only": [
        "eol-last",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/edit-form-with-detail-list",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/hierarchy-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/hierarchy-paging-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/inheritance-models",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/limit-function-example",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/limited-text-size-example",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/list-on-editform",
      "only": [
        "block-indentation",
        "eol-last",
        "no-duplicate-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/lock-services-editor-view-edit",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/lock-services-editor-view-list",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/object-list-view-resize",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/on-edit-form",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/selected-rows",
      "only": [
        "eol-last",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/settings-example",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/toolbar-custom-buttons-example",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-simpledatetime/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-simpleolv/configurate-rows",
      "only": [
        "eol-last",
        "quotes",
        "require-button-type",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-simpleolv/custom-filter",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-simpleolv/limit-function-example",
      "only": [
        "block-indentation",
        "quotes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-simpleolv/on-edit-form",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-simpleolv/selected-rows",
      "only": [
        "eol-last",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-simpleolv/settings-example",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-simpleolv/toolbar-custom-buttons-example",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-text-cell/settings-example",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-textarea/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-textbox/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-toggler/ge-into-toggler-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-toggler/settings-example",
      "only": [
        "block-indentation"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-tree/settings-example",
      "only": [
        "eol-last",
        "link-href-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/ui-message/settings-example",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/integration-examples/edit-form/readonly-mode",
      "only": [
        "block-indentation",
        "eol-last",
        "no-duplicate-attributes",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/integration-examples/edit-form/validation",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-edit",
      "only": [
        "eol-last",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-list",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-cancel",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-immediately",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-cancel",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-immediately",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/inheritance-models/parent-edit",
      "only": [
        "eol-last",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/inheritance-models/parent-list",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-edit",
      "only": [
        "eol-last",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/inheritance-models/successor-phone-list",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit",
      "only": [
        "eol-last",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-list",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/on-edit-form/suggestion",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/on-edit-form/user",
      "only": [
        "eol-last",
        "quotes",
        "self-closing-void-elements",
        "no-inline-styles",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-edit",
      "only": [
        "eol-last",
        "quotes",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-simpleolv/on-edit-form/user",
      "only": [
        "eol-last",
        "self-closing-void-elements",
        "no-inline-styles",
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/mobile/components-examples/flexberry-lookup/lookup-in-modal",
      "only": [
        "eol-last",
        "quotes",
        "require-button-type"
      ]
    }
  ]
};
