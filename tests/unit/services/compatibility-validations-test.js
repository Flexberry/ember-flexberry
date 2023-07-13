import Ember from 'ember';
import { module, test } from 'qunit';

import absence from 'ember-validations/validators/local/absence';
import acceptance from 'ember-validations/validators/local/acceptance';
import confirmation from 'ember-validations/validators/local/confirmation';
import exclusion from 'ember-validations/validators/local/exclusion';
import format from 'ember-validations/validators/local/format';
import inclusion from 'ember-validations/validators/local/inclusion';
import length from 'ember-validations/validators/local/length';
import numericality from 'ember-validations/validators/local/numericality';
import presence from 'ember-validations/validators/local/presence';

import CompatibilityValidationsService from 'ember-flexberry/services/compatibility-validations';

import startApp from '../../helpers/start-app';

const { get } = Ember;

module('Unit | Service | compatibility-validations', function() {
  test('it works', function(assert) {
    const app = startApp();
    const service = CompatibilityValidationsService.create(app.__container__.ownerInjection());
    const cache = get(service, 'cache');

    assert.ok(cache.absence === absence);
    assert.ok(cache.acceptance === acceptance);
    assert.ok(cache.confirmation === confirmation);
    assert.ok(cache.exclusion === exclusion);
    assert.ok(cache.format === format);
    assert.ok(cache.inclusion === inclusion);
    assert.ok(cache.length === length);
    assert.ok(cache.numericality === numericality);
    assert.ok(cache.presence === presence);
  });
});
