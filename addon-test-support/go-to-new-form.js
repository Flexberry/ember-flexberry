import Ember from 'ember';

Ember.Test.registerAsyncHelper('goToNewForm',
  function(app, olvSelector, context, assert, newRoute) {
    if (Ember.isBlank(newRoute)) {
      throw new Error('newRoute can\'t be undefined');
    }

    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);
    const newButton = helpers.findWithAssert('.secondary.menu .create-button', olv);
    helpers.click(newButton);
    helpers.andThen(() => {
      assert.equal(helpers.currentRouteName(), newRoute, 'not on new route');
    });
  }
);
