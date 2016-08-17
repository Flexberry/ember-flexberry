#!/bin/bash

# Exit with nonzero exit code if anything fails.
set -e

npm install -g yuidocjs
git clone --recursive https://github.com/Flexberry/flexberry.github.io.git docs
cd docs

npm install
git submodule update --remote --merge
cd "${TRAVIS_BRANCH}"
rm -rf assets
rm -rf classes
rm -rf elements
rm -rf files
rm -rf modules

yuidoc

git config user.name "Flexberry-man"
git config user.email "mail@flexberry.net"

git add --all
git commit -m "Update docs" -m "By Travis, Repo ${TRAVIS_REPO_SLUG}, Build #${TRAVIS_BUILD_NUMBER}, Commit ${TRAVIS_COMMIT}, Branch ${TRAVIS_BRANCH}."

# Redirect any output to /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${GH_TOKEN}@github.com/Flexberry/flexberry.github.io.git" > /dev/null 2>&1

echo "Done."
