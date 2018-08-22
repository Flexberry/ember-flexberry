import { moduleFor, test } from 'ember-qunit';

moduleFor('service:app-state', 'Unit | Service | app-state', {});

test('it exists and works', function(assert) {
  let service = this.subject();

  assert.throws(() => {
    service.set('state', 'invalid');
  });
  assert.equal(service.get('state'), '', 'By default is empty string.');

  service.loading();
  assert.equal(service.get('state'), 'loading', `Change to 'loading'.`);

  service.success();
  assert.equal(service.get('state'), 'success', `Change to 'success'.`);

  service.error();
  assert.equal(service.get('state'), 'error', `Change to 'error'.`);

  service.warning();
  assert.equal(service.get('state'), 'warning', `Change to 'warning'.`);

  service.reset();
  assert.equal(service.get('state'), '', 'Reset to the default value.');
});
