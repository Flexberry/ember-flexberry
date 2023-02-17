import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import sinon from 'sinon';

moduleFor('controller:lookup-dialog', 'Unit | Controller | lookup dialog', {
  // Specify the other units that are required for this test.
  needs: ['service:lookup-events']
});

// Replace this with your real tests.
test('it exists', function (assert) {
  const controller = this.subject();
  assert.ok(controller);
});

test('it shold set selected record to saveTo.propName of saveTo.model', function (assert) {
  const model = Ember.Object.extend({ makeDirty: function() {} }).create();
  const saveTo =
  {
    model: model,
    propName: 'testProperty'
  };

  const controller = this.subject();
  controller.set('saveTo', saveTo);

  sinon.stub(model, 'makeDirty');
  sinon.stub(controller, '_closeModalDialog');
  const master = Ember.Object.create();

  controller.send('objectListViewRowClick', master);

  assert.equal(model.get('testProperty'), master);
});
