# Ember Flexberry
[![npm](https://img.shields.io/npm/v/ember-flexberry.svg?label=npm%20latest%20version)](https://www.npmjs.com/package/ember-flexberry)
[![Travis branch](https://img.shields.io/travis/Flexberry/ember-flexberry/master.svg?label=master%20build%20)](https://travis-ci.org/Flexberry/ember-flexberry)
[![Travis branch](https://img.shields.io/travis/Flexberry/ember-flexberry/develop.svg?label=develop%20build)](https://travis-ci.org/Flexberry/ember-flexberry/branches)

Ember Flexberry Addon - Flexberry Template written in Ember.js.

## Installation

* Latest release: `ember install ember-flexberry`
* Specific version: `ember install ember-flexberry@x.x.x`

## Documentation

* Auto-generated (TODO, manually for now): http://flexberry.github.io/Documentation

## Demo

Ember Flexberry comes with a [dummy app](/tests/dummy) that covers functionality of the addon.

* Stable version (master branch): https://ember-flexberry.firebaseapp.com (TODO)
* Bleeding edge version (develop branch): https://ember-flexberry-dev.firebaseapp.com (TODO)
* Temporarily: https://prototype-ember-app.firebaseapp.com

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

* `ember test`
* `ember test --server`

#### Building

* `ember build` (development)
* `ember build --environment production` (production)

#### Releasing

* `ember release` 

For more information visit [ember-cli-release](https://github.com/lytics/ember-cli-release).

#### Deploying
Manual deployment on [Firebase](https://www.firebase.com):
* `npm install -g firebase-tools` (install [Firebase CLI](https://www.firebase.com/docs/hosting/command-line-tool.html))
* `ember build` (build application to `dist/` directory)
* Deploying:
 * For owners, who have access to the https://prototype-ember-app.firebaseio.com:</br>`firebase deploy` (deploy `dist/` directory on https://prototype-ember-app.firebaseapp.com, as described in the [firebase.json](/firebase.json))
 * For others:</br>`firebase deploy -f you-firebase-app` (deploy `dist/` directory on your own Firebase application)

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
