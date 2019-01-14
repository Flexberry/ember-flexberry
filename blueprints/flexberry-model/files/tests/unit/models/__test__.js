import { moduleForModel, test } from 'ember-qunit';

moduleForModel('<%= name %>', 'Unit | Model | <%= name %>', {
  // Specify the other units that are required for this test.
  needs: [
<%= needsAllModels %>,
    'validator:ds-error',
    'validator:presence',
    'validator:number',
    'validator:date',
    'validator:belongs-to',
    'validator:has-many',
    'service:syncer',
  ],
});

test('it exists', function(assert) {
  let model = this.subject();

  // let store = this.store();
  assert.ok(!!model);
});
