import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import goNewFormHelper from 'ember-flexberry/test-helpers/go-to-new-form';
import checkOlvConfigHelper from 'ember-flexberry/test-helpers/check-olv-config';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    initTestHelpers();
    application.injectTestHelpers();
  });

  return application;
}

function initTestHelpers() {
  goNewFormHelper();
  checkOlvConfigHelper();
}
