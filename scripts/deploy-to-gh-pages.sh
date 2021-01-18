#!/bin/bash
# set -x

# Exit with nonzero exit code if anything fails.
set -e

# Define repository relative GitHub address.
repositoryRelativeGitHubAddress=$GITHUB_REPOSITORY

# Clone project into 'repository' subdirectory && move to it.
echo "Prepare for deploy to gh-pages."
echo "Clone ${repositoryRelativeGitHubAddress} repository & checkout latest version of gh-pages branch."
rm -rf emberFlexberryRepository
git clone --recursive --branch gh-pages --depth 1 "https://github.com/${repositoryRelativeGitHubAddress}.git" emberFlexberryRepository
cd emberFlexberryRepository

# Navigate into dummy deploy directory.
cd dummy

if [ "$GITHUB_EVENT_NAME" = 'pull_request' ]
then
  deployFolder="pull/${GITHUB_ACTION}"
else
  deployFolder="$GITHUB_BRANCH"
fi

# Remove results of previous deploy (for current branch) & recreate directory.
echo "Remove results of previous deploy (from ${deployFolder} folder)."
rm -rf "${deployFolder}"
mkdir -p "${deployFolder}"

# Copy builded ember application from 'dist' directory into 'repository/dummy/${deployFolder}'.
echo "Copy builded ember application (into ${deployFolder} folder)."
cp -r ../../dist/* "${deployFolder}"

if [ -z "$1" -o "$1" != "no-doc" ]
then
  cd ../..

  # Generate autodoc.
  npm install -g yuidocjs

  # Define yuidoc theme repository relative GitHub address.
  repositoryYuidocTheme="${GITHUB_REPOSITORY_OWNER}/flexberry-yuidoc-theme"

  # Clone project into 'repositoryYuidocTheme' subdirectory && move to it.
  echo "Prepare for deploy to gh-pages."
  rm -rf repositoryYuidocTheme
  echo "Clone ${repositoryYuidocTheme} repository & checkout latest version of gh-pages branch."
  git clone --recursive "https://github.com/${repositoryYuidocTheme}.git" repositoryYuidocTheme
  cd repositoryYuidocTheme

  # Checkout and pull same branch.
  git checkout ${GITHUB_BRANCH}
  git pull

  echo "Copy ember addon source (for ${GITHUB_BRANCH} branch) into addon directory."
  mkdir addon
  cp -r ../addon/* addon

  echo "Execute yuidoc autodocumentation generator."
  yuidoc

  echo "Navigate to target directory for autodoc in gh-pages."
  cd "../emberFlexberryRepository/autodoc"

  # Remove results of previous deploy (for current branch) & recreate directory.
  rm -rf "${GITHUB_BRANCH}"
  mkdir "${GITHUB_BRANCH}"

  echo "Copy autodoc result into ${GITHUB_BRANCH} directory."
  cp -r ../../repositoryYuidocTheme/autodoc-result/* ${GITHUB_BRANCH}
fi

cd ..
# Configure git.
git config user.name "Flexberry-man"
git config user.email "mail@flexberry.net"

echo "Commit & push changes."
git add --all
git commit --quiet --amend -m "Update gh-pages branch" -m "Deploy into '${deployFolder}' folder."

# Redirect any output to /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "git@github.com:${repositoryRelativeGitHubAddress}.git" > /dev/null 2>&1

# Add deploy status.
if [ "$GITHUB_EVENT_NAME" = 'pull_request' -o $GITHUB_EVENT_NAME = 'push' ]
then
  deployments=$(curl --silent --show-error https://api.github.com/repos/${repositoryRelativeGitHubAddress}/deployments?ref=${GITHUB_BRANCH})
  deploymentId=$(node -pe "(JSON.parse(process.argv[1])[0] || {}).id || 'undefined'" "${deployments}")
  if [ "${deploymentId}" != "undefined" ]
  then
    curl --silent --show-error \
      -X DELETE \
      -H "Accept: application/vnd.github.v3+json" \
      -H "Authorization: token ${GH_TOKEN}" \
      https://api.github.com/repos/${repositoryRelativeGitHubAddress}/deployments/${deploymentId}
  fi

  deployment=$(curl --silent --show-error \
      -X POST \
      -H "Accept: application/vnd.github.v3+json" \
      -H "Authorization: token ${GH_TOKEN}" \
      https://api.github.com/repos/${repositoryRelativeGitHubAddress}/deployments \
      -d "{\"ref\":\"${GITHUB_BRANCH}\",\"environment\":\"dummy/pull/${GITHUB_ACTION}\",\"auto_merge\":false,\"required_contexts\":[]}")
  deploymentId=$(node -pe "JSON.parse(process.argv[1]).id || 'undefined'" "${deployment}")
  if [ "${deploymentId}" != "undefined" ]
  then
    curl --silent --show-error \
      -X POST \
      -H "Accept: application/vnd.github.ant-man-preview+json" \
      -H "Authorization: token ${GH_TOKEN}" \
      https://api.github.com/repos/${repositoryRelativeGitHubAddress}/deployments/${deploymentId}/statuses \
      -d "{\"state\":\"success\",\"environment_url\":\"http://flexberry.github.io/ember-flexberry/dummy/pull/${GITHUB_ACTION}/\"}" > /dev/null

    echo "Deploy status for PR#${GITHUB_ACTION} added."
  fi
fi

echo "Deploy to gh-pages finished."
