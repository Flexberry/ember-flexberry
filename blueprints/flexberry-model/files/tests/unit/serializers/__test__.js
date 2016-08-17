import { moduleForModel, test } from 'ember-qunit';

moduleForModel('<%= name %>', 'Unit | Serializer | <%= name %>', {
  // Specify the other units that are required for this test.
  needs: [
    'serializer:<%= name %>',
    'transform:file',
    'transform:decimal',
<% if (!!needsAllEnums === true) { %>
<%= needsAllEnums %>,
<% } %>
<%= needsAllModels %>
  ]
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
