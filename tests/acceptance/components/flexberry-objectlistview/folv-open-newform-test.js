import Ember from 'ember';
import moduleForAcceptance from './execute-folv-test';

let openEditForm = function($ctrlForClick, path) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;
    let timeout = 10000;

    Ember.run(() => {
      $ctrlForClick.click();
    });

    Ember.run(() => {
      checkIntervalId = window.setInterval(() => {
        let $editForm = Ember.$('form');
        let $fields = Ember.$('.field', $editForm);
        if ($fields.length === 0) {
          // Data isn't loaded yet.
          return;
        }
        // Data is loaded.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;
        resolve($editForm);
      }, checkInterval);
    });

    // Set wait timeout.
    Ember.run(() => {
      window.setTimeout(() => {
        if (checkIntervalSucceed) {
          return;
        }
        // Time is out.
        // Stop intervals & reject promise.
        window.clearInterval(checkIntervalId);
        reject('editForm load operation is timed out');
      }, timeout);
    });
  });
};

moduleForAcceptance('check goto new form', (store, assert) => {
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $toolBarButtons = $toolBar.children;

    let asyncOperationsCompleted = assert.async();

    openEditForm($toolBarButtons[1], path).then(($editForm) => {
      assert.ok($editForm, 'edit form open');
      assert.equal(currentPath(), 'ember-flexberry-dummy-suggestion-edit.new', 'new form open');
    }).catch((reason) => {
      throw new Error(reason);
    }).finally(() => {
      asyncOperationsCompleted();
    });

  });
});
