import { run, scheduleOnce } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

import $ from 'jquery';

let app;
const path = 'components-acceptance-tests/edit-form-readonly';

module('Acceptance | edit-form | readonly-mode ', {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      const applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach() {
      run(app, 'destroy');
    }
  });

test('controller is render properly', (assert) => {
  assert.expect(3);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    assert.equal(currentPath(), path, 'Path for edit-form-readonly-test is correctly');
    assert.strictEqual(controller.get('readonly'), true, 'Controller\'s flag \'readonly\' is enabled');

    controller.set('readonly', false);
    assert.strictEqual(controller.get('readonly'), false, 'Controller\'s flag \'readonly\' is disabled');
  });
});

test('flexbery-checkbox on readonly editform', (assert) => {
  assert.expect(4);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const $checkbox = find('[data-test-checkbox]');
    assert.strictEqual($checkbox.hasClass('read-only'), true, 'Checkbox is readonly');

    const $checkboxFge = find('[data-test-groupedit] .flexberry-checkbox');
    assert.strictEqual($checkboxFge.hasClass('read-only'), true, 'Groupedit\'s checkbox is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($checkbox.hasClass('read-only'), false, 'Checkbox is not readonly');
      assert.strictEqual($checkboxFge.hasClass('read-only'), false, 'Groupedit\'s checkbox is not readonly');
    });
  });
});

test('flexbery-textbox on readonly editform', (assert) => {
  assert.expect(4);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const $textboxInput = find('[data-test-textbox] input');
    assert.strictEqual(Ember.$.trim($textboxInput.attr('readonly')), 'readonly', 'Textbox is readonly');

    const $textboxFgeInput = find('[data-test-groupedit] .flexberry-textbox input');
    assert.strictEqual(Ember.$.trim($textboxFgeInput.attr('readonly')), 'readonly', 'Groupedit\'s textbox is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($textbox.is('readonly'), false, 'Textbox is not readonly');
      assert.strictEqual($textboxFge.is('readonly'), false, 'Groupedit\'s textbox is not readonly');
    });
  });
});

test('flexberry-textarea on readonly editform', (assert) => {
  assert.expect(4);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const $textareaInput = find('[data-test-textarea] textarea');
    assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), 'readonly', 'Textarea is readonly');

    const $textareaInputFGE = find('[data-test-groupedit] .flexberry-textarea textarea');
    assert.strictEqual(Ember.$.trim($textareaInputFGE.attr('readonly')), 'readonly', 'Groupedit\'s textarea is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), '', 'Textarea don\'t readonly');
      assert.strictEqual(Ember.$.trim($textareaInputFGE.attr('readonly')), '', 'Groupedit\'s textarea don\'t readonly');
    });
  });
});

test('flexberry-datepicker on readonly editform', (assert) => {
  assert.expect(8);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const $datepicker = find('[data-test-datepicker]');
    const $datepickerInput = $datepicker.children('input');
    assert.strictEqual(Ember.$.trim($datepickerInput.attr('readonly')), 'readonly', 'Time is readonly');
    const $button = $datepicker.children('.calendar');
    assert.strictEqual($button.hasClass('link'), false, 'Datepicker hasn\'t link');

    const $datepickerFge = find('[data-test-groupedit] .flexberry-datepicker');
    const $datepickerFgeInput = $datepickerFge.children('input');
    assert.strictEqual(Ember.$.trim($datepickerFgeInput.attr('readonly')), 'readonly', 'Groupedit\'s datepicker is readonly');
    const $buttonFge = $datepickerFge.children('.calendar');
    assert.strictEqual($buttonFge.hasClass('link'), false, 'Groupedit\'s datepicker hasn\'t link');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual(Ember.$.trim($datepickerInput.attr('readonly')), '', 'Time don\'t readonly');
      assert.strictEqual($button.hasClass('link'), true, 'Datepicker has link');

      assert.strictEqual(Ember.$.trim($datepickerFgeInput.attr('readonly')), '', 'Groupedit\'s datepicker don\'t readonly');
      assert.strictEqual($buttonFge.hasClass('link'), true, 'Groupedit\'s datepicker has link');
    });
  });
});

test('flexberry-simpledatetime on readonly editform', (assert) => {
  assert.expect(4);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const $simpledatetime = find('[data-test-simpledatetime] .custom-flatpickr');

    let $simpledatetimeFge = $('.in-groupedit .flexberry-simpledatetime .custom-flatpickr');
    assert.strictEqual($.trim($simpledatetimeFge.attr('readonly')), 'readonly', 'Groupedit\'s datepicker is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($.trim($simpledatetime.attr('readonly')), '', 'Time is not readonly');
      assert.strictEqual($.trim($simpledatetimeFge.attr('readonly')), '', 'Groupedit\'s datepicker is not readonly');
    });
  });
});

test('flexberry-dropdown on readonly editform', (assert) => {
  assert.expect(4);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const $dropdown = find('.not-in-groupedit .flexberry-dropdown');
    assert.strictEqual($dropdown.hasClass('disabled'), true, 'Dropdown is readonly');

    const $dropdownFge = find('[data-test-groupedit] .flexberry-dropdown');
    assert.strictEqual($dropdownFge.hasClass('disabled'), true, 'Groupedit\'s dropdown is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($dropdown.hasClass('disabled'), false, 'Dropdown is not readonly');
      assert.strictEqual($dropdownFge.hasClass('disabled'), false, 'Groupedit\'s dropdown is not readonly');
    });
  });
});

test('flexberry-file on readonly edit form', (assert) => {
  assert.expect(14);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const $file = find('[data-test-file] input.flexberry-file-filename-input');
    assert.strictEqual(Ember.$.trim($file.attr('readonly')), 'readonly', 'Flexberry-file is readonly');
    const $downloadButton = find('[data-test-file] label.flexberry-file-download-button');
    assert.strictEqual($downloadButton.hasClass('disabled'), true, 'Flexberry-file\'s button \'Download\' is readonly');

    const $fileFge = find('[data-test-groupedit] input.flexberry-file-filename-input');
    assert.strictEqual(Ember.$.trim($fileFge.attr('readonly')), 'readonly', 'Groupedit\'s flexberry-file is readonly');
    const $downloadButtonFge = find('[data-test-groupedit] label.flexberry-file-download-button');
    assert.strictEqual($downloadButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file\'s button \'Download\' is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual($(this).is('readonly'), false, 'Flexberry-file don\'t readonly');
      const $addButton = find('[data-test-file] label.flexberry-file-add-button');
      assert.strictEqual($addButton.hasClass('disabled'), false, 'Flexberry-file\'s button \'Add\' don\'t readonly');
      const $removeButton = find('[data-test-file] label.flexberry-file-remove-button');
      assert.strictEqual($removeButton.hasClass('disabled'), true, 'Flexberry-file has button \'Remove\'');
      const $uploadButton = find('[data-test-file] label.flexberry-file-upload-button');
      assert.strictEqual($uploadButton.hasClass('disabled'), true, 'Flexberry-file has button \'Upload\'');
      assert.strictEqual($downloadButton.hasClass('disabled'), true, 'Flexberry-file has button \'Download\'');

      assert.strictEqual($(this).is('readonly'), false, 'Groupedit\'s flexberry-file don\'t readonly');
      const $addButtonFge = find('[data-test-groupedit] label.flexberry-file-add-button');
      assert.strictEqual($addButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-file\'s button \'Add\' don\'t readonly');
      const $removeButtonFge = find('[data-test-groupedit] label.flexberry-file-remove-button');
      assert.strictEqual($removeButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file has button \'Remove\'');
      const $uploadButtonFge = find('[data-test-groupedit] label.flexberry-file-upload-button');
      assert.strictEqual($uploadButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file has button \'Upload\'');
      assert.strictEqual($downloadButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file has button \'Download\'');

    });
  });
});

test('flexberry-lookup on readonly edit form', (assert) => {
  assert.expect(12);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const $lookup = find('[data-test-lookup] input.lookup-field');
    assert.strictEqual(Ember.$.trim($lookup.attr('readonly')), 'readonly', 'Lookup is readonly');
    const $chooseButton = find('[data-test-lookup] button.ui-change');
    assert.strictEqual($chooseButton.hasClass('disabled'), true, 'Flexberry-lookup\'s button \'Choose\' is readonly');
    let $removeButton = find('[data-test-lookup] button.ui-clear');
    assert.strictEqual($removeButton.hasClass('disabled'), true, 'Flexberry-lookup\'s button \'Remove\' is readonly');

    const $lookupFge = find('[data-test-groupedit] input.lookup-field');
    assert.strictEqual(Ember.$.trim($lookupFge.attr('readonly')), 'readonly', 'Groupedit\'s lookup is readonly');
    const $chooseButtonFge = find('[data-test-groupedit] button.ui-change');
    assert.strictEqual($chooseButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-lookup\'s button \'Choose\' is readonly');
    let $removeButtonFge = find('[data-test-groupedit] button.ui-clear');
    assert.strictEqual($removeButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-lookup\'s button \'Remove\' is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      $removeButton = find('[data-test-lookup] button.ui-clear');
      $removeButtonFge = find('[data-test-groupedit] button.ui-clear');
      assert.strictEqual($(this).is('readonly'), false, 'Lookup don\'t readonly');
      assert.strictEqual($chooseButton.hasClass('disabled'), false, 'Flexberry-lookup\'s button \'Choose\' don\'t readonly');
      assert.strictEqual($removeButton.hasClass('disabled'), false, 'Flexberry-lookup\'s button \'Remove\' don\'t readonly');

      assert.strictEqual($lookupFge.is('readonly'), false, 'Groupedit\'s lookup is not readonly');
      assert.strictEqual($chooseButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-lookup\'s button \'Choose\' is not readonly');
      assert.strictEqual($removeButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-lookup\'s button \'Remove\' is not readonly');
    });
  });
});

test('flexberry-lookup as dropdown on readonly edit form', (assert) => {
  assert.expect(2);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const $dropdown = find('[data-test-lookup-d] .flexberry-dropdown');
    assert.strictEqual($dropdown.hasClass('disabled'), true, 'Lookup as dropdown is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($dropdown.hasClass('disabled'), false, 'Lookup as dropdown is not readonly');
    });
  });
});

test('flexberry-groupedit on readonly edit form', (assert) => {
  assert.expect(2);

  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const $groupedit = find('[data-test-groupedit] table');
    assert.strictEqual($groupedit.hasClass('readonly'), true, 'Groupedit is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($groupedit.hasClass('readonly'), false, 'Groupedit is not readonly');
    });
  });
});

test('flexberry-groupedit\'s button on readonly edit form', (assert) => {
  assert.expect(12);

  visit(path);
  andThen(() => {
    const $addButton = find('[data-test-groupedit] .ui-add');
    const $removeButton = find('[data-test-groupedit] .ui-delete');
    let $checkbox = find('[data-test-groupedit] .flexberry-checkbox');
    let $removeButtonRow = find('[data-test-groupedit] .object-list-view-row-delete-button');
    let $itemEditMenu = find('[data-test-groupedit] .edit-menu');
    let $itemDeconsteMenu = find('[data-test-groupedit] .delete-menu');

    assert.strictEqual(Ember.$.trim($addButton.attr('disabled')), 'disabled', 'Flexberry-groupedit\'s button \'Add\' is readonly');
    assert.strictEqual(Ember.$.trim($removeButton.attr('disabled')), 'disabled', 'Flexberry-groupedit\'s button \'Remove\' is readonly');
    assert.strictEqual($checkbox.hasClass('read-only'), true, 'Flexberry-groupedit\'s checkbox helper is readonly');
    assert.strictEqual($removeButtonRow.hasClass('disabled'), true, 'Flexberry-groupedit\'s button \'Remove in row\' is readonly');
    assert.strictEqual($itemEditMenu.hasClass('disabled'), true, 'Flexberry-groupedit\'s item \'Edit\' in left menu is readonly');
    assert.strictEqual($itemDeconsteMenu.hasClass('disabled'), true, 'Flexberry-groupedit\'s item \'Deconste\' in left menu is readonly');

    const controller = app.__container__.lookup('controller:' + currentRouteName());
    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      $checkbox = find('[data-test-groupedit] .flexberry-checkbox');
      $itemEditMenu = find('[data-test-groupedit] .edit-menu');
      $itemDeconsteMenu = find('[data-test-groupedit] .delete-menu');
      $removeButtonRow = find('[data-test-groupedit] .object-list-view-row-delete-button');

      assert.strictEqual($(this).is('disabled'), false, 'Flexberry-groupedit\'s button \'Add\' don\'t readonly');
      assert.strictEqual($(this).is('disabled'), false, 'Flexberry-groupedit\'s button \'Remove\' don\'t readonly');
      assert.strictEqual($checkbox.hasClass('read-only'), false, 'Flexberry-groupedit\'s checkbox helper don\'t readonly');
      assert.strictEqual($removeButtonRow.hasClass('disabled'), false, 'Flexberry-groupedit\'s button \'Remove in row\' don\'t readonly');
      assert.strictEqual($itemEditMenu.hasClass('disabled'), false, 'Flexberry-groupedit\'s item \'Edit\' in left menu don\'t readonly');
      assert.strictEqual($itemDeconsteMenu.hasClass('disabled'), false, 'Flexberry-groupedit\'s item \'Deconste\' in left menu don\'t readonly');
    });
  });
});
