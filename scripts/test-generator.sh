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
ember init --skip-npm
cp app/index.html .
rm -r app/*
mv index.html app
yarn install
ember install "${ADDON_DIR}"
#npm install dexie@1.3.6
rm -f ./.jscsrc

# We want to run tests under Headless Chrome
# So we need to replace testem.js
popd
cp -f ./testem.js "$TMP_DIR/testem.js"
pushd "$TMP_DIR"

# Generate components using Dummy metamodel and test them.
ember generate flexberry-application app --metadata-dir=${META_DIR}

#ember build
ember test

# Cleanup.
popd
rm -rf "$TMP_DIR"

# Initialize new ember addon and install ember-flexberry.
mkdir -p "$TMP_DIR"
rm -rf "$TMP_DIR/*"
pushd "$TMP_DIR"

ember addon new-addon-for-tests --skip-npm
pushd new-addon-for-tests

popd
popd
cp -f ./testem.js "$TMP_DIR/new-addon-for-tests/testem.js"
pushd "$TMP_DIR"
pushd new-addon-for-tests

yarn install
ember install "${ADDON_DIR}"

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

ember test

# Cleanup.
popd
popd
rm -rf "$TMP_DIR"
