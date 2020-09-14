import Ember from 'ember';

Ember.Test.registerAsyncHelper('openEditform',
  function(app, olvSelector, context, assert, editRoute) {
    if (Ember.isBlank(editRoute)) {
      throw new Error('editRoute can\'t be undefined');
    }

    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);

    const rows = helpers.findWithAssert('.object-list-view-container table.object-list-view tbody tr', olv);
    
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    controller.set('rowClickable', true);
  
    let timeout = 1000;    
    Ember.run.later((function() {
      helpers.click(rows[1].children[1]);
      Ember.run.later((function() {
        assert.equal(helpers.currentRouteName(), editRoute, 'on edit route');
      }), timeout);
    }), timeout);
  });
