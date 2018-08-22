import Ember from 'ember';

// Function for waiting list loading.
export function loadingList($ctrlForClick, list, records) {
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
        let $list = Ember.$(list);
        let $records = Ember.$(records, $list);
        if ($records.length === 0) {

          // Data isn't loaded yet.
          return;
        }

        // Data is loaded.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;
        resolve($list);
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
}

// Function for waiting loading list.
export function loadingLocales(locale, app) {
  return new Ember.RSVP.Promise((resolve) => {
    let i18n = app.__container__.lookup('service:i18n');

    Ember.run(() => {
      i18n.set('locale', locale);
    });

    let timeout = 500;
    Ember.run.later((() => {
      resolve({ msg: 'ok' });
    }), timeout);
  });
}
