# Ember Flexberry
[![npm](https://img.shields.io/npm/v/ember-flexberry.svg?label=npm%20latest%20version)](https://www.npmjs.com/package/ember-flexberry)
[![CI-master](https://github.com/Flexberry/ember-flexberry/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/Flexberry/ember-flexberry/actions/workflows/ci.yml?query=branch%3Amaster+)
[![CI-develop](https://github.com/Flexberry/ember-flexberry/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/Flexberry/ember-flexberry/actions/workflows/ci.yml?query=branch%3Adevelop+)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://github.com/orangemug/stability-badges#stable)

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

* Common Flexberry PLATFORM documentation site: https://flexberry.github.io
* Auto-generated documentation under `master` branch: https://flexberry.github.io/master
* Auto-generated documentation under `develop` branch: https://flexberry.github.io/develop

## Demo

Ember Flexberry comes with a [dummy app](/tests/dummy) that covers functionality of the addon.

* Stable version (master branch): http://flexberry.github.io/ember-flexberry/dummy/master/
* Bleeding edge version (develop branch): http://flexberry.github.io/ember-flexberry/dummy/develop/
* For temporal testing: http://flexberry.github.io/ember-flexberry/dummy/dummy-test/

## Collaborating / Development

Information on how to contribute to the project you can find [here](https://github.com/Flexberry/Home/blob/master/CONTRIBUTING.md).

#### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js (v10.*)](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI (v2.4.3)](http://www.ember-cli.com/)

#### Installation

* `git clone` this repository
* `npm install`
* `bower install`

#### Running Dummy Application

Ember Flexberry comes with a [dummy app](/tests/dummy) that covers functionality of the addon.

* `ember server`
* Visit your app at http://localhost:4200.

#### Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
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

#### Documenting

* Document your code using [YUIDoc Syntax Reference](http://yui.github.io/yuidoc/syntax/index.html). For examples, you can look at the documented code in the ember.js repository.
* After pushing into master or develop branch, documentation will be automatically generated and updated in [Flexberry/Documentation repository](https://github.com/Flexberry/flexberry.github.io), which is available via https://flexberry.github.io.
* For testing and generating documentation by hands use [YUIDoc](http://yui.github.io/yuidoc/).

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
