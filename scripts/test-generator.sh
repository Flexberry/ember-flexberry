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
cp app/index.html .
rm -r app/*
mv index.html app
ember install "${ADDON_DIR}"

# I do not understand why there is something like this:
# https://github.com/ember-cli/ember-cli/issues/4003
# Install each addon, instead of run default blueprint.
npm install dexie@1.4.2
npm install node-uuid@1.4.7
npm install inflection@1.10.0
ember install semantic-ui-ember@0.9.3
ember install ember-moment@6.0.0
ember install ember-link-action@0.0.35
ember install ember-cli-sass@5.2.0
ember install broccoli-jscs@1.4.1
ember install ember-browserify@1.1.9
ember install ember-href-to@1.9.0
bower install semantic-ui-daterangepicker#5d46ed2e6e5a0bf398bb6a5df82e06036dfc46be
bower install blueimp-file-upload#9.11.2
bower install devicejs#0.2.7
bower install git://github.com/chmln/flatpickr.git#4ca9590caa70bc0232cf0a3455cfac1be9c65c2a

rm -f ./ember-cli-build.js
cp "${ADDON_DIR}/vendor/flexberry/ember-cli-build.js" .
#npm install dexie@1.3.6
rm -f ./.jscsrc

# Generate components using Dummy metamodel and test them.
ember generate flexberry-application app --metadata-dir=${META_DIR}

npm install
bower install

#ember build
ember test

# Cleanup.
popd
rm -rf "$TMP_DIR"

# Initialize new ember addon and install ember-flexberry.
mkdir -p "$TMP_DIR"
rm -rf "$TMP_DIR/*"
pushd "$TMP_DIR"

ember addon new-addon-for-tests
pushd new-addon-for-tests

ember install "${ADDON_DIR}"

# Here is the same.
npm install dexie@1.4.2
npm install node-uuid@1.4.7
npm install inflection@1.10.0
ember install semantic-ui-ember@0.9.3
ember install ember-moment@6.0.0
ember install ember-link-action@0.0.35
ember install ember-cli-sass@5.2.0
ember install broccoli-jscs@1.4.1
ember install ember-browserify@1.1.9
ember install ember-href-to@1.9.0
bower install semantic-ui-daterangepicker#5d46ed2e6e5a0bf398bb6a5df82e06036dfc46be
bower install blueimp-file-upload#9.11.2
bower install devicejs#0.2.7
bower install git://github.com/chmln/flatpickr.git#4ca9590caa70bc0232cf0a3455cfac1be9c65c2a

# EmberCLI asks whether it needs to overwrite existing files,
# so we need to remove them for non-interactive build.
rm -f ./tests/dummy/app/app.js
rm -f ./tests/dummy/app/resolver.js
rm -f ./tests/dummy/app/router.js
rm -f ./tests/dummy/app/templates/application.hbs
rm -f ./tests/dummy/app/templates/loading.hbs
# rm -f ./ember-cli-build.js // TODO: Wy on Travis this file don't created?
rm -f ./.jscsrc

# Generate components using Dummy metamodel and test them.
ember generate flexberry-application --metadata-dir=${META_DIR}

npm install
bower install

ember test

# Cleanup.
popd
popd
rm -rf "$TMP_DIR"
