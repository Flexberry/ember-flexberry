import { registerAsyncHelper } from '@ember/test';
import { isBlank } from '@ember/utils';
import { later } from '@ember/runloop';

registerAsyncHelper('openEditform',
  function(app, olvSelector, context, assert, editRoute) {
    if (isBlank(editRoute)) {
      throw new Error('editRoute can\'t be undefined');
    }

    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);

    const rows = helpers.findWithAssert('.object-list-view-container table.object-list-view tbody tr', olv);

    const controller = app.__container__.lookup('controller:' + helpers.currentRouteName());
    controller.set('rowClickable', true);

    const timeout = 1000;
    later((function() {
      helpers.click(rows[1].children[1]);
      later((function() {
        assert.equal(helpers.currentRouteName(), editRoute, 'on edit route');
      }), timeout);
    }), timeout);
  });
