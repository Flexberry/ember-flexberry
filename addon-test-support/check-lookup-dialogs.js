import { registerAsyncHelper, registerWaiter, unregisterWaiter } from '@ember/test';

registerAsyncHelper('checkLookupDialogs',
  function(app) {
    const helpers = app.testHelpers;
    const lookups = helpers.find('[data-test-lookup]');
    if (lookups.length > 0) {
      checkLookups(lookups, 0, helpers);
    }
  }
);

const checkLookups = function(lookups, index, helpers) {
  const modalDialogWaiter = () => {
    const dimmer = helpers.find('.ui.dimmer');
    return !dimmer.hasClass('animating') || dimmer.hasClass('hidden');
  };
  registerWaiter(modalDialogWaiter);

  const lookup = lookups[index];
  const dialogButton = helpers.find('[data-test-lookup-change]', lookup);
  helpers.click(dialogButton);
  helpers.andThen(() => {
    const dialog = helpers.findWithAssert('[data-test-lookup-dialog]');
    helpers.findWithAssert('[data-test-lookup-olv]', dialog);
    const closeButton = helpers.findWithAssert('.close', dialog);
    helpers.click(closeButton);
    helpers.andThen(() => {
      unregisterWaiter(modalDialogWaiter);
      if (index < lookups.length - 1) {
        checkLookups(lookups, index + 1, helpers);
      }
    });
  });
};
