import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import sinon from 'sinon';

module('Unit | Controller | lookup dialog', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:lookup-dialog');
    assert.ok(controller);
  });

  test('it shold set selected record to saveTo.propName of saveTo.model', function (assert) {
    const model = EmberObject.extend({ makeDirty: function() {} }).create();
    const reloadContext = {
      send: function(name, options) {
        let modelToLookup = options.modelToLookup;
        let relationName = options.relationName;
        let newRelationValue = options.newRelationValue;

        modelToLookup.set(relationName, newRelationValue);
        modelToLookup.makeDirty();
      }
    };
    const saveTo = {
      model: model,
      propName: 'testProperty',
      updateLookupAction: 'updateLookupAction',
      componentContext: reloadContext
    };

    const controller = this.owner.lookup('controller:lookup-dialog');
    
    controller.set('saveTo', saveTo);

    sinon.stub(model, 'makeDirty');
    sinon.stub(controller, '_closeModalDialog');

    const master = EmberObject.create();

    controller.send('objectListViewRowClick', master);

    assert.equal(model.get('testProperty'), master);
  });
});


