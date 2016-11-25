/*import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | flexberry lookup');

test('visiting flexberry-lookup', function(assert) {
  assert.expect(3);

  visit('components-acceptance-tests/flexberry-lookup/settings-example');

  andThen(function() {

    let expandAnimationCompleted = new Ember.RSVP.Promise((resolve, reject) => {

      assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example');

      let $lookupButtouChoose = Ember.$('.lookup-choose-button');

      Ember.run(() => {
        $lookupButtouChoose.click();
      });

      Ember.run(() => {
        var done = assert.async();
        setTimeout(function() {

          let $modal = Ember.$('.flexberry-modal');
          let $modalHeader = Ember.$('.header');

          assert.strictEqual($modal.length === 1, true, 'Component open flexberry-modal block');
          assert.strictEqual($modalHeader.text().trim(), 'Temp title', 'Component flexberry-modal has title');

          //First record name
          //let $records = Ember.$('.content table.object-list-view tbody tr');
          //let $record = Ember.$($records[0]);
          //let $recordFirstCell = Ember.$(Ember.$('td', $record)[1]);
          //assert.strictEqual($recordFirstCell.text().trim(), 'per', 'LimitFunction works correctly');

          done();
          resolve();
        }, 1000);
      });
    });

    expandAnimationCompleted.then(() => {
      Ember.run(() => {
        let $modalCloseIcon = Ember.$('.close.icon');
        $modalCloseIcon.click();
      });

      Ember.run(() => {
        var endClose = assert.async();
        setTimeout(function() { endClose(); }, 1000);
      });
    });
  });
});*/
