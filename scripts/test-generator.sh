#!/bin/sh

# Prerequisites:
#   - ember-cli

set -ev

# Prepare for tests.
ADDON_DIR="$PWD"
META_DIR="$PWD/vendor/flexberry/dummy-metadata"
TMP_DIR='/tmp/embertest'
mkdir -p "$TMP_DIR"

# Part 1. Test the generated app.
cd "$TMP_DIR"

# Initialize new ember app and install ember-flexberry from the build.
ember new ember-app --skip-npm
cd ember-app
yarn install
ember install "${ADDON_DIR}"

# EmberCLI asks whether it needs to overwrite existing files,
# so we need to remove them for non-interactive build.
yarn add ember-cli@3.1.4
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

# Run tests.
ember test

# Cleanup.
popd
rm -rf "$TMP_DIR"

# Initialize new ember addon and install ember-flexberry.
mkdir -p "$TMP_DIR"
rm -rf "$TMP_DIR/*"
pushd "$TMP_DIR"

yarn add ember-cli@3.1.4
ember addon new-addon-for-tests --skip-npm
pushd new-addon-for-tests

popd
popd
cp -f ./testem.js "$TMP_DIR/new-addon-for-tests/testem.js"
pushd "$TMP_DIR"
pushd new-addon-for-tests

yarn install
ember install "${ADDON_DIR}"

# Default blueprint not execute when install addon from local folder, run it manual.
ember generate ember-flexberry

# EmberCLI asks whether it needs to overwrite existing files,
# so we need to remove them for non-interactive build.
rm -r tests/dummy/app/*[!index.html]

# Generate components using Dummy metamodel.
ember generate flexberry-application --metadata-dir=${META_DIR}

# Run tests.
ember test
