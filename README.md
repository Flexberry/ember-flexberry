# Prototype-ember-cli-application [![Build Status](https://travis-ci.org/Flexberry/prototype-ember-application.svg)](https://travis-ci.org/Flexberry/prototype-ember-application)

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying
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

