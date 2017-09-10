import { moduleFor, test } from 'ember-qunit';

moduleFor('route:list-form', 'Unit | Route | list form', {
  needs: [
    'service:cols-config-menu',
    'service:form-load-time-tracker',
    'service:objectlistview-events',
  ],
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
