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
#npm install dexie@1.3.6
rm -f ./ember-cli-build.js
cp "${ADDON_DIR}/vendor/flexberry/ember-cli-build.js" .
rm -f ./.jscsrc

# Generate components using Dummy metamodel and test them.
ember generate flexberry-application app --metadata-dir=${META_DIR}

#ember build
ember test

# Cleanup.
popd
rm -rf "$TMP_DIR"
