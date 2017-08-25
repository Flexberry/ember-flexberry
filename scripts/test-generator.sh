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

# Initialize new ember app and install ember-flexberry from the build.
ember new ember-app
cd ember-app
ember install "${ADDON_DIR}"

# EmberCLI asks whether it needs to overwrite existing files,
# so we need to remove them for non-interactive build.
rm -r app/*[!index.html]

# Default blueprint not execute when install addon from local folder, run it manual.
ember generate ember-flexberry

# Generate components using Dummy metamodel.
ember generate flexberry-application app --metadata-dir=${META_DIR}

# Run tests.
ember test

# Part 2. Test generated addon.
popd

# Initialize new ember addon and install ember-flexberry from the build.
ember addon ember-addon
cd ember-addon
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
