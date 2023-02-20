import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

let app;
let store;
let userSettingsService;
const testName = 'default sort test';

module('Acceptance | flexberry-groupedit | ' + testName, {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);

      store = app.__container__.lookup('service:store');

      userSettingsService = app.__container__.lookup('service:user-settings');
    },

    afterEach() {
      Ember.run(app, 'destroy');
    }
  });

test(testName, (assert) => {
  assert.expect(9);
  let path = 'ember-flexberry-dummy-suggestion-edit/2e98a54d-7146-4e61-bb2d-a278796c861e';
  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    assert.equal(controller.model.id, '2e98a54d-7146-4e61-bb2d-a278796c861e');

    let currentSorting = controller.get('sorting')[0];
    let defaultSorting = controller.developerUserSettings.suggestionUserVotesGroupEdit.DEFAULT.sorting;

    let $usersVotesTable = Ember.$('.object-list-view')[1];

    click($usersVotesTable.tHead.rows[0].children[1]);
    andThen(() => {
      currentSorting = controller.get('sorting')[0];
      assert.ok(currentSorting.propName === 'voteType', currentSorting.direction === 'asc', 'sorting changed');

      let $defaultSortingButton = Ember.$('.object-list-view .clear-sorting-button')[0];

      click($defaultSortingButton);
      andThen(() => {
        currentSorting = controller.get('sorting')[0];
        assert.ok(currentSorting.propName === defaultSorting[0].propName, currentSorting.direction === defaultSorting[0].direction, 'default sorting');
        click($usersVotesTable.tHead.rows[0].children[1]);

        andThen(() => {
          currentSorting = controller.get('sorting')[0];
          assert.ok(currentSorting.propName === 'voteType', currentSorting.direction === 'asc', 'sorting changed');
          let $clearSettingsButton = Ember.$('.ui-clear-settings')[0];

          click($clearSettingsButton);
          andThen(() => {
            currentSorting = controller.get('sorting')[0];
            assert.ok(currentSorting.propName === defaultSorting[0].propName, currentSorting.direction === defaultSorting[0].direction);

            var press = $.Event('click');
            press.ctrlKey = true;
            press.which = 17;
            $('body').trigger(press);

            andThen(() => {
              $($usersVotesTable.tHead.rows[0].children[1]).trigger(press);
              //let done1 = assert.async();
              Ember.run.later((() => {
                currentSorting = controller.get('sorting');
                assert.ok(currentSorting[0].propName === 'author', currentSorting.direction === 'asc',
                          currentSorting[1].propName === 'voteType', currentSorting.direction === 'asc');

                click($defaultSortingButton);
                andThen(() => {
                  currentSorting = controller.get('sorting')[0];
                  assert.ok(currentSorting.propName === defaultSorting[0].propName,
                            currentSorting.direction === defaultSorting[0].direction);

                  $('body').trigger(press);
                  andThen(() => {
                    $($usersVotesTable.tHead.rows[0].children[1]).trigger(press);
                    //let done2 = assert.async();
                    Ember.run.later((() => {
                      currentSorting = controller.get('sorting');
                      assert.ok(currentSorting[0].propName === 'author', currentSorting.direction === 'asc',
                                currentSorting[1].propName === 'voteType', currentSorting.direction === 'asc');

                      click($clearSettingsButton);
                      andThen(() => {
                        currentSorting = controller.get('sorting')[0];
                        assert.ok(currentSorting.propName === defaultSorting[0].propName,
                                  currentSorting.direction === defaultSorting[0].direction);
                      });
                      //done2();
                    }));
                  });
                });
                //done1();
              }));
            });
          });
        });
      });
    });
  });
});
