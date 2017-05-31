import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

export function executeTest(testName, callback) {
  let app;
  let store;

  module('Acceptance | readonly-test | ' + testName, {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
      store = app.__container__.lookup('service:store');
    },

    afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  test(testName, (assert) => callback(store, assert, app));
}

executeTest('controller is render properly', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path, 'Path for edit-form-readonly-test is correctly');
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    assert.strictEqual(controller.get('readonly'), true, 'Controller\'s flag \'readonly\' is enabled');

    controller.set('readonly', false);
    assert.strictEqual(controller.get('readonly'), false, 'Controller\'s flag \'readonly\' is disabled');
  });
});

executeTest('flexbery-checkbox on readonly editform', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $checkbox = Ember.$('.not-in-groupedit .flexberry-checkbox');
    assert.strictEqual($checkbox.hasClass('read-only'), true, 'Checkbox is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual($checkbox.hasClass('read-only'), false, 'Checkbox don\'t readonly');
    });
  });
});

executeTest('flexbery-textbox on readonly editform', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $textbox = Ember.$('.not-in-groupedit .flexberry-textbox');
    let $textboxInput = $textbox.children('input');
    assert.strictEqual(Ember.$.trim($textboxInput.attr('readonly')), 'readonly', 'Textbox is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual($(this).is('readonly'), false, 'Textbox don\'t readonly');
    });
  });
});

executeTest('flexberry-textarea on readonly editform', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $textarea = Ember.$('.not-in-groupedit .flexberry-textarea');
    let $textareaInput = $textarea.children('textarea');
    assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), 'readonly', 'Textarea is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), '', 'Textarea don\'t readonly');
    });
  });
});

executeTest('flexberry-datepicker on readonly editform', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $datepicker = Ember.$('.not-in-groupedit .flexberry-datepicker');
    let $datepickerInput = $datepicker.children('input.ember-text-field');
    assert.strictEqual(Ember.$.trim($datepickerInput.attr('readonly')), 'readonly', 'Time is readonly');

    let $button = $datepicker.children('.calendar');
    assert.strictEqual($button.hasClass('link'), false, 'Datepicker hasn\'t link');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual(Ember.$.trim($datepickerInput.attr('readonly')), '', 'Time don\'t readonly');
      assert.strictEqual($button.hasClass('link'), true, 'Datepicker has link');
    });
  });
});

executeTest('flexberry-simpledatetime on readonly editform', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $simpledatetime = Ember.$('.not-in-groupedit .flexberry-simpledatetime');
    let $simpledatetimeInput = $simpledatetime.children('input.ember-text-field');
    assert.strictEqual(Ember.$.trim($simpledatetimeInput.attr('readonly')), 'readonly', 'Time is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual(Ember.$.trim($simpledatetimeInput.attr('readonly')), '', 'Time don\'t readonly');
    });
  });
});

executeTest('flexberry-dropdown on readonly editform', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $dropdown = Ember.$('.not-in-groupedit .flexberry-dropdown');
    assert.strictEqual($dropdown.hasClass('disabled'), true, 'Dropdown is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual($dropdown.hasClass('disabled'), false, 'Enumeration don\'t readonly');
    });
  });
});

executeTest('flexberry-file on readonly edit form', (store, assert, app) => {
  assert.expect(7);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());

    let $file = Ember.$('div.input input.flexberry-file-filename-input');
    assert.strictEqual(Ember.$.trim($file.attr('readonly')), 'readonly', 'Flexberry-file is readonly');

    let $downloadButton = Ember.$('div.input label.flexberry-file-download-button');
    assert.strictEqual($downloadButton.hasClass('disabled'), true, 'Flexberry-file\'s button \'Download\' is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual($(this).is('readonly'), false, 'Flexberry-file don\'t readonly');

      let $addButton = Ember.$('div.input label.flexberry-file-add-button');
      assert.strictEqual($addButton.hasClass('disabled'), false, 'Flexberry-file\'s button \'Add\' don\'t readonly');

      let $removeButton = Ember.$('div.input label.flexberry-file-remove-button');
      assert.strictEqual($removeButton.hasClass('disabled'), true, 'Flexberry-file has button \'Remove\'');

      let $uploadButton = Ember.$('div.input label.flexberry-file-upload-button');
      assert.strictEqual($uploadButton.hasClass('disabled'), true, 'Flexberry-file has button \'Upload\'');

      assert.strictEqual($downloadButton.hasClass('disabled'), true, 'Flexberry-file has button \'Download\'');
    });
  });
});

executeTest('flexberry-lookup on readonly edit form', (store, assert, app) => {
  assert.expect(6);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $lookup = Ember.$('div.input input.lookup-field');
    assert.strictEqual(Ember.$.trim($lookup.attr('readonly')), 'readonly', 'Lookup is readonly');

    let $chooseButton = Ember.$('div.input button.choose-button');
    assert.strictEqual($chooseButton.hasClass('disabled'), true, 'Flexberry-lookup\'s button \'Choose\' is readonly');

    let $removeButton = Ember.$('div.input button.remove-button');
    assert.strictEqual($removeButton.hasClass('disabled'), true, 'Flexberry-lookup\'s button \'Remove\' is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual($(this).is('readonly'), false, 'Lookup don\'t readonly');
      assert.strictEqual($chooseButton.hasClass('disabled'), false, 'Flexberry-lookup\'s button \'Choose\' don\'t readonly');
      assert.strictEqual($removeButton.hasClass('disabled'), false, 'Flexberry-lookup\'s button \'Remove\' don\'t readonly');
    });
  });
});

executeTest('flexberry-lookup as dropdown on readonly edit form', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $dropdownAsLookup = Ember.$('.not-in-groupedit .flexberry-lookup');
    let $dropdown = $($dropdownAsLookup[1]).children('.flexberry-dropdown');
    assert.strictEqual($dropdown.hasClass('disabled'), true, 'Lookup as dropdown is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual($dropdown.hasClass('disabled'), false, 'Lookup as dropdown don\'t readonly');
    });
  });
});

executeTest('flexberry-groupedit on readonly edit form', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $groupedit = Ember.$('.object-list-view-container .JColResizer');
    assert.strictEqual($groupedit.hasClass('readonly'), true, 'Groupedit is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual($groupedit.hasClass('readonly'), false, 'Groupedit don\'t readonly');
    });
  });
});

executeTest('flexberry-groupedit\'s button on readonly edit form', (store, assert, app) => {
  assert.expect(6);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());

    let $addButton = Ember.$('.groupedit-toolbar .add-button');
    assert.strictEqual(Ember.$.trim($addButton.attr('disabled')), 'disabled', 'Flexberry-groupedit\'s button \'Add\' is readonly');

    let $removeButton = Ember.$('.groupedit-toolbar .remove-button');
    assert.strictEqual(Ember.$.trim($removeButton.attr('disabled')), 'disabled', 'Flexberry-groupedit\'s button \'Remove\' is readonly');

    let $checkbox = Ember.$('.object-list-view-helper-column-cell .flexberry-checkbox');
    assert.strictEqual($checkbox.hasClass('read-only'), true, 'Flexberry-groupedit\'s checkbox helper is readonly');

    controller.set('readonly', false);
    Ember.run.scheduleOnce('afterRender', () => {
      assert.strictEqual($(this).is('disabled'), false, 'Flexberry-groupedit\'s button \'Add\' don\'t readonly');
      assert.strictEqual($(this).is('disabled'), false, 'Flexberry-groupedit\'s button \'Remove\' don\'t readonly');
      assert.strictEqual($checkbox.hasClass('read-only'), false, 'Flexberry-groupedit\'s checkbox helper don\'t readonly');
    });
  });
});
