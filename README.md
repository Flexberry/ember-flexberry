# Ember Flexberry
[![npm](https://img.shields.io/npm/v/ember-flexberry.svg?label=npm%20latest%20version)](https://www.npmjs.com/package/ember-flexberry)
[![Travis master branch](https://img.shields.io/travis/Flexberry/ember-flexberry/master.svg?label=master%20build%20)](https://travis-ci.org/Flexberry/ember-flexberry)
[![Travis develop branch](https://img.shields.io/travis/Flexberry/ember-flexberry/develop.svg?label=develop%20build)](https://travis-ci.org/Flexberry/ember-flexberry/branches)
[![See all badges](https://img.shields.io/badge/all%20badges-visit BADGES.md-blue.svg)](BADGES.md)

![ember](https://embadge.io/v1/badge.svg?label=ember&range=2.3.0)
![ember-data](https://embadge.io/v1/badge.svg?label=ember-data&range=^2.3.0)

Ember Flexberry Addon - Flexberry Template written in Ember.js.

## Installation

* Latest release: `ember install ember-flexberry`
* Specific version: `ember install ember-flexberry@x.x.x`

## Documentation

* Auto-generated under master branch: http://flexberry.github.io/Documentation

## Demo

Ember Flexberry comes with a [dummy app](/tests/dummy) that covers functionality of the addon.

* Stable version (master branch): https://ember-flexberry.firebaseapp.com
* Bleeding edge version (develop branch): https://ember-flexberry-dev.firebaseapp.com
* For temporal testing: https://ember-flexberry-test.firebaseapp.com

## Collaborating / Development

Information on how to contribute to the project you can find [here](https://github.com/Flexberry/Home/blob/master/CONTRIBUTING.md).

#### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

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

* Merge develop with master branch
  * `git checkout master`
  * `git merge --no-ff develop`
  * `git push`
* `ember release` (for more information visit [ember-cli-release](https://github.com/lytics/ember-cli-release))
* `npm publish ./` (for more information visit [How to publish packages to NPM](https://gist.github.com/coolaj86/1318304))

#### Deploying Dummy Application

Automatic deployment on [Firebase](https://www.firebase.com):
* After a successful [Travis CI build](https://travis-ci.org/Flexberry/ember-flexberry), dummy app deploys on
  * https://ember-flexberry.firebaseapp.com for master branch
  * https://ember-flexberry-dev.firebaseapp.com for develop branch

Manual deployment on [Firebase](https://www.firebase.com):
* `npm install -g firebase-tools` (install [Firebase CLI](https://www.firebase.com/docs/hosting/command-line-tool.html))
* `ember build` (build application to `dist/` directory)
* Deploying:
  * For owners, who have access to the https://ember-flexberry-test.firebaseio.com:</br>`firebase deploy` (deploy `dist/` directory on https://ember-flexberry-test.firebaseapp.com, as described in the [firebase.json](/firebase.json))
  * For others:</br>`firebase deploy -f you-firebase-app` (deploy `dist/` directory on your own Firebase application)

#### Documenting

* Document your code using [YUIDoc Syntax Reference](http://yui.github.io/yuidoc/syntax/index.html). For examples, you can look at the documented code in the ember.js repository.
* After pushing into master branch, documentation will be automatically generated and updated in [Flexberry/Documentation repository](https://github.com/Flexberry/Documentation), which is available via http://flexberry.github.io/Documentation.
* For testing and generating documentation by hands use [YUIDoc](http://yui.github.io/yuidoc/).

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
