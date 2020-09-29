import Ember from 'ember';

Ember.Test.registerAsyncHelper('checkLookupDialogs',
  function(app) {
    const helpers = app.testHelpers;
    const lookups = helpers.find('[data-test-lookup]');
    if (lookups.length > 0) {
      checkLookups(lookups, 0, helpers);
    }
  }
);

const checkLookups = function(lookups, index, helpers) {
  const lookup = lookups[index];
  const dialogButton = helpers.find('[data-test-lookup-change]', lookup);
  helpers.click(dialogButton);
  helpers.andThen(() => {
    const dialog = helpers.findWithAssert('[data-test-lookup-dialog]');
    helpers.findWithAssert('[data-test-lookup-olv]', dialog);
    const closeButton = helpers.findWithAssert('.close', dialog);
    helpers.click(closeButton);
    helpers.andThen(() => {
      if (index < lookups.length - 1) {
        Ember.run.later(this, function() {
          checkLookups(lookups, index + 1, helpers);
        }, 500);
      }
    });
  });
};
