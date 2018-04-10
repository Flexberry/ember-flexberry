# Ember Flexberry
[![npm](https://img.shields.io/npm/v/ember-flexberry.svg?label=npm%20latest%20version)](https://www.npmjs.com/package/ember-flexberry)
[![Travis master branch](https://img.shields.io/travis/Flexberry/ember-flexberry/master.svg?label=master%20build%20)](https://travis-ci.org/Flexberry/ember-flexberry)
[![Travis develop branch](https://img.shields.io/travis/Flexberry/ember-flexberry/develop.svg?label=develop%20build)](https://travis-ci.org/Flexberry/ember-flexberry/branches)
[![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg)](https://github.com/orangemug/stability-badges#work-in-progress)

[![ember](https://embadge.io/v1/badge.svg?label=ember&range=~2.4.3)](https://github.com/emberjs/ember.js/releases)
[![ember-data](https://embadge.io/v1/badge.svg?label=ember-data&range=~2.4.2)](https://github.com/emberjs/data/releases)
[![ember-cli](https://embadge.io/v1/badge.svg?label=ember-cli&range=2.4.3)](https://github.com/ember-cli/ember-cli/releases)

Ember Flexberry Addon - [Flexberry ORM](http://flexberry.ru/) SPA UI Framework powered by Ember.js.

## Installation or Upgrading

* Latest release: `ember install ember-flexberry`
* Specific version: `ember install ember-flexberry@x.x.x`
* Latest commit from a branch: `ember install flexberry/ember-flexberry#<BRANCH_NAME>`
* Specific commit: `ember install flexberry/ember-flexberry#<COMMIT_SHA>`

## Documentation

* Common Flexberry PLATFORM documentation site: http://flexberry.github.io
* Auto-generated documentation under `master` branch: http://flexberry.github.io/master
* Auto-generated documentation under `develop` branch: http://flexberry.github.io/develop

## Demo

Ember Flexberry comes with a [dummy app](/tests/dummy) that covers functionality of the addon.

* Stable version (master branch): https://flexberry.github.io/ember-flexberry/dummy/master/
* Bleeding edge version (develop branch): https://flexberry.github.io/ember-flexberry/dummy/develop/
* For temporal testing: https://flexberry.github.io/ember-flexberry/dummy/dummy-test/

## Collaborating / Development

Information on how to contribute to the project you can find [here](https://github.com/Flexberry/Home/blob/master/CONTRIBUTING.md).

#### Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [Google Chrome](https://www.google.ru/chrome/index.html)

#### Installation

* `git clone <repository-url>` this repository
* `cd ember-flexberry`
* `yarn install`
* `bower install`

#### Running Dummy Application

Ember Flexberry comes with a [dummy app](/tests/dummy) that covers functionality of the addon.

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

#### Running Tests

* `yarn test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

#### Building

* `ember build` (development)
* `ember build --environment production` (production)

#### Releasing

* Merge current release branch with master branch
  * `git checkout master`
  * `git merge --no-ff <release-branch>`
  * `git push origin master`
* `ember release` (for more information visit [ember-cli-release](https://github.com/lytics/ember-cli-release))
  * To increment patch version run without specifying options.
  * To increment minor version run with `--minor` option.
  * To increment major version run with `--major` option.
* `npm publish ./` (for more information visit [How to publish packages to NPM](https://gist.github.com/coolaj86/1318304))
* Merge master branch that contains additional commit for changing addon version with develop branch using current release branch as intermediary
  * `git checkout <release-branch>`
  * `git merge --no-ff master`
  * `git push origin <release-branch>`
  * `git checkout develop`
  * `git merge --no-ff <release-branch>`
  * `git push origin develop`
* Delete current release branch on GitHub

#### Deploying Dummy Application

Automatic deployment on [Firebase](https://www.firebase.com):
* After a successful [Travis CI build](https://travis-ci.org/Flexberry/ember-flexberry), dummy app deploys on
  * https://flexberry-ember.firebaseapp.com for master branch
  * https://flexberry-ember-dev.firebaseapp.com for develop branch
* After update dummy-test branch, dummy app deploy on
  * https://flexberry-ember-test.firebaseapp.com

Manual deployment on [Firebase](https://www.firebase.com):
* `npm install -g firebase-tools` (install [Firebase CLI](https://www.firebase.com/docs/hosting/command-line-tool.html))
* `ember build` (build application to `dist/` directory)
* Deploying:
  * For owners, who have access to the https://ember-flexberry-test.firebaseio.com:</br>`firebase deploy` (deploy `dist/` directory on https://ember-flexberry-test.firebaseapp.com, as described in the [firebase.json](/firebase.json))
  * For others:</br>`firebase deploy -f you-firebase-app` (deploy `dist/` directory on your own Firebase application)

#### Documenting

* Document your code using [YUIDoc Syntax Reference](http://yui.github.io/yuidoc/syntax/index.html). For examples, you can look at the documented code in the ember.js repository.
* After pushing into master or develop branch, documentation will be automatically generated and updated in [Flexberry/Documentation repository](https://github.com/Flexberry/flexberry.github.io), which is available via http://flexberry.github.io.
* For testing and generating documentation by hands use [YUIDoc](http://yui.github.io/yuidoc/).

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://www.ember-cli.com/)
* Development Browser Extensions
  * [Ember Inspector for Chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [Ember Inspector for Firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
