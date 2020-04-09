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
pushd "$TMP_DIR"

# Logging ember version.
ember -v

# Initialize new ember app and install ember-flexberry from the build.
ember new ember-app --yarn
cd ember-app

# EmberCLI asks whether it needs to overwrite existing files,
# so we need to remove them for non-interactive build.
cp app/index.html .
rm -r app/*
mv index.html app

ember install "${ADDON_DIR}" --yarn

# Default blueprint not execute when install addon from local folder, run it manual.
ember generate ember-flexberry
bower install

# EmberCLI asks whether it needs to overwrite existing files,
# so we need to remove them for non-interactive build.
rm -f ./.eslintrc.js

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

ember addon new-addon-for-tests --yarn
cd new-addon-for-tests

ember install "${ADDON_DIR}" --yarn

# Default blueprint not execute when install addon from local folder, run it manual.
ember generate ember-flexberry
bower install

# EmberCLI asks whether it needs to overwrite existing files,
# so we need to remove them for non-interactive build.
rm -r tests/dummy/app/*[!index.html]
rm -f ./.eslintrc.js

# Generate components using Dummy metamodel.
ember generate flexberry-application --metadata-dir=${META_DIR}

# Run tests.
ember test

# Cleanup.
popd
rm -rf "$TMP_DIR"
