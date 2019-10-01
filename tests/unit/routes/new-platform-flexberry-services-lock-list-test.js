import { moduleFor, test } from 'ember-qunit';

moduleFor('route:new-platform-flexberry-services-lock-list', 'Unit | Route | new-platform-flexberry-services-lock-list', {
  needs: [
    'service:cols-config-menu',
    'service:form-load-time-tracker',
    'service:objectlistview-events',
    'service:app-state',
    'service:adv-limit',
  ],
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
