/* globals findWithAssert, click, andThen, equal, currentRouteName */
import Ember from 'ember';

export default function goToNewForm() {
  Ember.Test.registerAsyncHelper('goToNewForm',
    function(app, olvSelector, context, newRoute) {
      if (Ember.isNone(newRoute)) {
        throw new Error('newRoute can\'t be undefined');
      }

      const olv = findWithAssert(olvSelector, context);
      const newButton = findWithAssert('.secondary.menu .create-button', olv);
      click(newButton);
      andThen(() => {
        equal(currentRouteName(), newRoute, 'not on new route');
      });
    }
  );
}
