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
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/colsconfig-dialog",
      "only": [
        "eol-last"
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
      "moduleId": "app/templates/new-platform-flexberry-services-lock-list",
      "only": [
        "eol-last"
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
        "no-unnecessary-concat",
        "quotes",
        "link-href-attributes",
        "no-inline-styles",
        "no-invalid-interactive",
        "no-quoteless-attributes"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-edit-panel",
      "only": [
        // don't delete, exception for text in button.
        "block-indentation"
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
        "no-unnecessary-concat",
        "eol-last"
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
      "moduleId": "app/templates/components/flexberry-multiple-lookup",
      "only": [
        "link-href-attributes",
        "no-invalid-interactive",
        "no-unnecessary-concat"
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
        "self-closing-void-elements",
        "require-button-type"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-sitemap-guideline",
      "only": [
        "block-indentation",
        "eol-last"
      ]
    },
    {
      "moduleId": "app/templates/components/flexberry-sitemap",
      "only": [
        "eol-last",
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
      "moduleId": "app/templates/components/highload-edit-form-menu",
      "only": [
        "link-href-attributes",
        "no-invalid-interactive"
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
        "quotes",
        "no-invalid-interactive"
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
        "no-inline-styles",
        "no-invalid-interactive",
        "simple-unless"
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
      "moduleId": "app/templates/mobile/components/object-list-view-row",
      "only": [
        "eol-last",
        "no-inline-styles",
        "no-invalid-interactive",
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
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/application-with-submenu",
      "only": [
        "eol-last",
        "quotes",
        "self-closing-void-elements",
        "link-rel-noopener",
        "link-href-attributes",
        "no-invalid-interactive",
        "require-valid-alt-text"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/application",
      "only": [
        "eol-last",
        "quotes",
        "self-closing-void-elements",
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
        "simple-unless",
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-application-user-list",
      "only": [
        "eol-last",
        "no-trailing-spaces"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-comment-edit",
      "only": [
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-localization-edit",
      "only": [
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
        "self-closing-void-elements",
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-suggestion-file-edit",
      "only": [
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-suggestion-file-list",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-suggestion-list",
      "only": [
        "eol-last",
        "quotes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/ember-flexberry-dummy-suggestion-type-edit",
      "only": [
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
        "block-indentation"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/index",
      "only": [
        "eol-last",
        "quotes",
        "require-button-type",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/loading",
      "only": [
        "eol-last",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/login",
      "only": [
        "eol-last",
        "quotes",
        "link-href-attributes",
        "no-invalid-interactive",
        "require-valid-alt-text"
      ]
    },
    {
      "moduleId": "blueprints/flexberry-core/files/__root__/templates/application-with-submenu",
      "only": [
        "eol-last",
        "quotes",
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
        "link-rel-noopener",
        "link-href-attributes",
        "no-invalid-interactive",
        "require-valid-alt-text"
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
      "moduleId": "tests/dummy/app/templates/log-service-examples/clear-log-form",
      "only": [
        "block-indentation",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/log-service-examples/settings-example",
      "only": [
        "eol-last",
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
        "self-closing-void-elements",
        "link-rel-noopener",
        "link-href-attributes",
        "no-invalid-interactive",
        "require-valid-alt-text"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/mobile/index",
      "only": [
        "block-indentation",
        "eol-last",
        "quotes",
        "link-href-attributes",
        "require-button-type",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/modal/delete-record-modal-dialog",
      "only": [
        "eol-last",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/modal/ember-flexberry-support-modal",
      "only": [
        "quotes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/modal/modal-dialog",
      "only": [
        "block-indentation",
        "no-trailing-spaces",
        "require-button-type"
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
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-edit-with-checked-checkbox",
      "only": [
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
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-groupedit/properly-rerenders",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-autocomplete",
      "only": [
        "no-duplicate-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-simpledatetime/manual-enter",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-custom-window",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-simpledatetime/manual-enter",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-custom-window",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-dropdown",
      "only": [
        "no-duplicate-attributes"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-lookup/settings-example-limit-function",
      "only": [
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
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/base-operations",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-groupedit/delete-with-details",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/delete-with-details",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-groupedit/delete-with-details",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/delete-with-details",
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
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/folv-user-settings",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-acceptance-tests/flexberry-objectlistview/ember-flexberry-dummy-multi-list",
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
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-file/settings-example",
      "only": [
        "eol-last"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/configurate-row-example",
      "only": [
        "eol-last"
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
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/groupedit-with-multiselect-edit",
      "only": [
        "simple-unless"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-edit-readonly-columns-by-configurate-row-example",
      "only": [
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
        "no-duplicate-attributes",
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/dropdown-mode-example",
      "only": [
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/limit-function-through-dynamic-properties-example",
      "only": [
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
        "require-button-type"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/numeric-autocomplete",
      "only": [
        "no-multiple-empty-lines"
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
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-objectlistview/toolbar-custom-components-example",
      "only": [
        "eol-last"
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
      "moduleId": "tests/dummy/app/templates/components-examples/modal-dialog/index",
      "only": [
        "block-indentation",
        "no-trailing-spaces",
        "require-button-type"
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
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/integration-examples/edit-form/theming-components",
      "only": [
        "eol-last",
        "no-multiple-empty-lines",
        "link-href-attributes",
        "require-button-type",
        "require-valid-alt-text",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-edit",
      "only": [
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
      "moduleId": "tests/dummy/app/templates/mobile/components-examples/flexberry-lookup/lookup-in-modal",
      "only": [
        "require-button-type"
      ]
    }
  ]
};
