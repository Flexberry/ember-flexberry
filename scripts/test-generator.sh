#!/bin/sh

# Prerequisites:
#   - ember-cli

set -ev

# Create temp directory for new ember app.
ADDON_DIR="$PWD"
META_DIR="$PWD/vendor/flexberry/dummy-metadata"
TMP_DIR='/tmp/embertest'
mkdir -p "$TMP_DIR"
rm -rf "$TMP_DIR/*"
pushd "$TMP_DIR"

# Initialize new ember app and install addon from the build.
# EmberCLI asks whether it needs to overwrite existing files,
# so we need to remove them for non-interactive build.
ember init
npm install broccoli-jscs --save-dev
cp app/index.html .
rm -r app/*
mv index.html app
ember install "${ADDON_DIR}"
rm -f ./ember-cli-build.js
cp "${ADDON_DIR}/vendor/flexberry/ember-cli-build.js" .
rm -f ./.jscsrc
cp "${ADDON_DIR}vendor/flexberry/.jscsrc" .

# Generate components using Dummy metamodel and test them.
ember generate route-test ember-flexberry-dummy-comment-list
ember generate route-test ember-flexberry-dummy-localization-list
ember generate route-test ember-flexberry-dummy-suggestion-type-list
ember generate route-test ember-flexberry-dummy-suggestion-list
ember generate route-test ember-flexberry-dummy-application-user-list
ember generate route-test ember-flexberry-dummy-application-user-edit
ember generate route-test ember-flexberry-dummy-localization-edit
ember generate route-test ember-flexberry-dummy-suggestion-edit
ember generate route-test ember-flexberry-dummy-suggestion-type-edit
ember generate route-test ember-flexberry-dummy-comment-edit
ember generate controller-test ember-flexberry-dummy-comment-list
ember generate controller-test ember-flexberry-dummy-localization-list
ember generate controller-test ember-flexberry-dummy-suggestion-type-list
ember generate controller-test ember-flexberry-dummy-suggestion-list
ember generate controller-test ember-flexberry-dummy-application-user-list
ember generate controller-test ember-flexberry-dummy-application-user-edit
ember generate controller-test ember-flexberry-dummy-localization-edit
ember generate controller-test ember-flexberry-dummy-suggestion-edit
ember generate controller-test ember-flexberry-dummy-suggestion-type-edit
ember generate controller-test ember-flexberry-dummy-comment-edit

ember generate flexberry-model ember-flexberry-dummy-suggestion-type --file=ember-flexberry-dummy-suggestion-type.json --metadata-dir=${META_DIR}
ember generate flexberry-model ember-flexberry-dummy-vote --file=ember-flexberry-dummy-vote.json --metadata-dir=${META_DIR}
ember generate flexberry-model ember-flexberry-dummy-suggestion --file=ember-flexberry-dummy-suggestion.json --metadata-dir=${META_DIR}
ember generate flexberry-model ember-flexberry-dummy-localized-suggestion-type --file=ember-flexberry-dummy-localized-suggestion-type.json --metadata-dir=${META_DIR}
ember generate flexberry-model ember-flexberry-dummy-comment-vote --file=ember-flexberry-dummy-comment-vote.json --metadata-dir=${META_DIR}
ember generate flexberry-model ember-flexberry-dummy-comment --file=ember-flexberry-dummy-comment.json --metadata-dir=${META_DIR}
ember generate flexberry-model ember-flexberry-dummy-suggestion-file --file=ember-flexberry-dummy-suggestion-file.json --metadata-dir=${META_DIR}
ember generate flexberry-model ember-flexberry-dummy-application-user --file=ember-flexberry-dummy-application-user.json --metadata-dir=${META_DIR}
ember generate flexberry-model ember-flexberry-dummy-localization --file=ember-flexberry-dummy-localization.json --metadata-dir=${META_DIR}
ember generate flexberry-enum ember-flexberry-dummy-gender --file=ember-flexberry-dummy-gender.json --metadata-dir=${META_DIR}
ember generate flexberry-enum ember-flexberry-dummy-vote-type --file=ember-flexberry-dummy-vote-type.json --metadata-dir=${META_DIR}
ember generate flexberry-list-form ember-flexberry-dummy-comment-list --file=ember-flexberry-dummy-comment-list.json --metadata-dir=${META_DIR}
ember generate flexberry-list-form ember-flexberry-dummy-localization-list --file=ember-flexberry-dummy-localization-list.json --metadata-dir=${META_DIR}
ember generate flexberry-list-form ember-flexberry-dummy-suggestion-type-list --file=ember-flexberry-dummy-suggestion-type-list.json --metadata-dir=${META_DIR}
ember generate flexberry-list-form ember-flexberry-dummy-suggestion-list --file=ember-flexberry-dummy-suggestion-list.json --metadata-dir=${META_DIR}
ember generate flexberry-list-form ember-flexberry-dummy-application-user-list --file=ember-flexberry-dummy-application-user-list.json --metadata-dir=${META_DIR}
ember generate flexberry-edit-form ember-flexberry-dummy-application-user-edit --file=ember-flexberry-dummy-application-user-edit.json --metadata-dir=${META_DIR}
ember generate flexberry-edit-form ember-flexberry-dummy-localization-edit --file=ember-flexberry-dummy-localization-edit.json --metadata-dir=${META_DIR}
ember generate flexberry-edit-form ember-flexberry-dummy-suggestion-edit --file=ember-flexberry-dummy-suggestion-edit.json --metadata-dir=${META_DIR}
ember generate flexberry-edit-form ember-flexberry-dummy-suggestion-type-edit --file=ember-flexberry-dummy-suggestion-type-edit.json --metadata-dir=${META_DIR}
ember generate flexberry-edit-form ember-flexberry-dummy-comment-edit --file=ember-flexberry-dummy-comment-edit.json --metadata-dir=${META_DIR}
ember generate flexberry-application app --metadata-dir=${META_DIR}
#ember build
ember test

# Cleanup.
popd
rm -rf "$TMP_DIR"
