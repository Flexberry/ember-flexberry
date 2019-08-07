import { moduleFor, test } from 'ember-qunit';
import EmberObject from '@ember/object';
import sinon from 'sinon';

moduleFor('controller:lookup-dialog', 'Unit | Controller | lookup dialog', {
  needs: [
    'controller:advlimit-dialog',
    'controller:colsconfig-dialog',
    'service:lookup-events',
    'service:objectlistview-events',
    'service:user-settings',
    'service:adv-limit',
  ],
});

// Replace this with your real tests.
test('it exists', function (assert) {
  let controller = this.subject();
  assert.ok(controller);
});

test('it shold set selected record to saveTo.propName of saveTo.model', function (assert) {
  let model = EmberObject.extend({ makeDirty: function() {} }).create();
  let saveTo =
  {
    model: model,
    propName: 'testProperty'
  };

  let controller = this.subject();
  controller.set('saveTo', saveTo);

  sinon.stub(model, 'makeDirty');
  sinon.stub(controller, '_closeModalDialog');
  let master = EmberObject.create();

  controller.send('objectListViewRowClick', master);

  assert.equal(model.get('testProperty'), master);
});
