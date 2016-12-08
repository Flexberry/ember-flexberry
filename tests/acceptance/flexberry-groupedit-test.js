import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | flexberry groupedit');

let createNewolvRecord = function() {

  let $olvAddButton = Ember.$('.ui.button');

  $olvAddButton =$ ($olvAddButton[1]);

  Ember.run(() => {
    $olvAddButton.click();
  });

  wait().then(() => {
    let $lookup = Ember.$('.flexberry-lookup');
    $lookup1 =$ ($lookup[1]);
    $lookup2 =$ ($lookup[2]);

    choseFirstRecordAtLookup($lookup1);
    wait().then(() => {
      choseFirstRecordAtLookup($lookup2);
      wait().then(() => {
        return "per";
      });
    });
  });
};

let choseFirstRecordAtLookup = function($lookup) {
  
  openLookupDialog($lookup).then(($lookupDialog) => {

      // Lookup dialog successfully opened & data is loaded.
      // Try to choose first loaded record.
      return chooseRecordInLookupDialog($lookupDialog, 0);
    })

  return;
};

let openLookupDialog = function($lookup) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;

    let timeout = 10000;

    let $lookupChooseButton = Ember.$('button', $lookup);
    $lookupChooseButton = $($lookupChooseButton[0]);

    // Try to open lookup dialog.
    Ember.run(() => {
      $lookupChooseButton.click();
    });

    // Wait for lookup dialog to be opened & data loaded.
    Ember.run(() => {
      checkIntervalId = window.setInterval(() => {
        let $lookupDialog = Ember.$('.flexberry-modal');
        let $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
        if ($records.length === 0) {
          // Data isn't loaded yet.
          return;
        }

        // Data is loaded.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;

        resolve($lookupDialog);
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
        reject('flexberry-lookup load data operation is timed out');
      }, timeout);
    });
  });
};

let chooseRecordInLookupDialog = function($lookupDialog, recordIndex) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;

    let timeout = 10000;

    let $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
    let $choosedRecord = Ember.$($records[recordIndex]);

    // Try to choose record in the lookup dialog.
    Ember.run(() => {
      // Inside object-list-views component click actions are available only if cell in row has been clicked.
      // Click on whole row wont take an effect.
      let $choosedRecordFirstCell = Ember.$(Ember.$('td', $choosedRecord)[1]);
      $choosedRecordFirstCell.click();

      // Click on modal-dialog close icon.
      // Сrutch correcting irregular bug
      let $modelDilogClose = Ember.$('.close.icon');
      $modelDilogClose.click();
    });

    // Wait for lookup dialog to be closed.
    Ember.run(() => {
      checkIntervalId = window.setInterval(() => {
        if (!$lookupDialog.hasClass('hidden')) {
          // Dialog is still opened.
          return;
        }

        // Dialog is closed.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;

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
        reject('flexberry-lookup choose record operation is timed out');
      }, timeout);
    });
  });
};

test('visiting flexberry-groupedit', function(assert) {

  visit('components-acceptance-tests/flexberry-groupedit/settings-example');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-groupedit/settings-example');
    
    let recordKey = createNewolvRecord();

    wait().then(() => {
      assert.ok(true);
    });

    /*let $olvBody = $olvCompontnt.children('tbody');

    let $olvTr = Ember.$('td', $olvBody);

    $olvTr = $($olvTr[1]);

    Ember.run(() => {
      $olvTr.click();
    })

    wait().then(() => {

      let $groupeditToolbar = Ember.$('.groupedit-toolbar');
      let $toolbat = $($groupeditToolbar[2]);
      let $addButton = $toolbat.children('.button');
      $addButton = $($addButton[0]);

      Ember.run(() => {
        $addButton.click();
      })

      wait().then(() => {
        let $lookup = Ember.$('.fluid');
        let $choseButton = $toolbat.children('.button');
        $choseButton = $($choseButton[0]);

        Ember.run(() => {
          $choseButton.click();
        })

        wait().then(() => {
          assert.ok(true);
        });
      });

      $olvCompontnt = Ember.$('.object-list-view');

      $olv = $($olvCompontnt[2]);

      $olvBody = $olv.children('tbody');

      $olvTr = Ember.$('td', $olvBody);

      $olvTr = $($olvTr[1]);

      Ember.run(() => {
        $olvTr.click();
      })

      wait().then(() => {
      	assert.ok(true);
      });
    });*/
  });
});

// Проверка изменение значение при входе в дочерний детейл
// Проверка создания дочерних детейлов