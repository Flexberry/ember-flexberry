import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

let app;
const testName = 'default sort test';

module('Acceptance | flexberry-groupedit | ' + testName, {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach() {
      run(app, 'destroy');
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

    let $usersVotesTable = $('.object-list-view')[1];

    click($usersVotesTable.tHead.rows[0].children[1]);
    andThen(() => {
      currentSorting = controller.get('sorting')[0];
      assert.ok(currentSorting.propName === 'voteType', currentSorting.direction === 'asc', 'sorting changed');

      let $defaultSortingButton = $('.object-list-view .clear-sorting-button')[0];

      click($defaultSortingButton);
      andThen(() => {
        currentSorting = controller.get('sorting')[0];
        assert.ok(currentSorting.propName === defaultSorting[0].propName, currentSorting.direction === defaultSorting[0].direction, 'default sorting');
        click($usersVotesTable.tHead.rows[0].children[1]);

        andThen(() => {
          currentSorting = controller.get('sorting')[0];
          assert.ok(currentSorting.propName === 'voteType', currentSorting.direction === 'asc', 'sorting changed');
          let $clearSettingsButton = $('.ui-clear-settings')[0];

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
              run.later((() => {
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
                    run.later((() => {
                      currentSorting = controller.get('sorting');
                      assert.ok(currentSorting[0].propName === 'author', currentSorting.direction === 'asc',
                                currentSorting[1].propName === 'voteType', currentSorting.direction === 'asc');

                      click($clearSettingsButton);
                      andThen(() => {
                        currentSorting = controller.get('sorting')[0];
                        assert.ok(currentSorting.propName === defaultSorting[0].propName,
                                  currentSorting.direction === defaultSorting[0].direction);
                      });
                    }));
                  });
                });
              }));
            });
          });
        });
      });
    });
  });
});
