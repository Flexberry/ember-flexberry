import { run } from '@ember/runloop';
import RSVP from 'rsvp';
import $ from 'jquery';
import { executeTest} from './execute-validation-test';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

executeTest('check operation text+date unique', (store, assert, _app) => {
  assert.expect(3);

  let dateToSet = new Date(2012, 1, 12);

  dateToSet.setHours(13);
  dateToSet.setUTCHours(11);
  dateToSet.setUTCMinutes(0);
  dateToSet.setUTCSeconds(0);
  dateToSet.setUTCMilliseconds(0);

  let initTestData = function(createdRecordsPrefix) {
    // Add records for deleting.
    return RSVP.Promise.all([
      store.createRecord('ember-flexberry-dummy-suggestion-type', { name: createdRecordsPrefix + "0" }).save(),
      store.createRecord('ember-flexberry-dummy-application-user', {
                                                                    name: createdRecordsPrefix + "1",
                                                                    eMail: "1",
                                                                    phone1: "1"
                                                                   }).save()
    ])
    .then((createdCustomRecords) => {
        return store.createRecord('ember-flexberry-dummy-suggestion', {
            id: '75434dbd-f00c-4fd9-8483-c35aa59a18c3',
            text: '12345',
            date: dateToSet,
            type: createdCustomRecords[0],
            author: createdCustomRecords[1],
            editor1: createdCustomRecords[1],
        }).save();
    })
  };

  run(() => {
    let path = 'components-acceptance-tests/edit-form-validation/validation';
    let done1 = assert.async();

    initTestData('uniqueTest' + generateUniqueId()).then((suggestion) => {
        // Open validation page.
        visit(path);

        andThen(() => {
            assert.equal(currentPath(), path);

            // text
            let $validationField = $($('.field')[3]);
            let $validationFlexberryTextbox = $validationField.children('.flexberry-textbox');
            let $validationFlexberryTextboxInner = $validationFlexberryTextbox.children('input');
            let $validationFlexberryErrorLabel = $validationField.children('.label');

            // data
            let $validationDateField = $($('.field')[5]);
            let $validationDate = $('.flexberry-simpledatetime', $validationDateField);
            let $validationDateFlatpickr = $('.flatpickr > input', $validationDate);
            let $validationDateFlatpickrCustom = $('input.custom-flatpickr', $validationDate);

            let done2 = assert.async();
            // Insert text and date in textbox.
            run(() => {
                $validationDateFlatpickr[0]._flatpickr.open();
                $validationDateFlatpickr[0]._flatpickr.setDate(new Date(2012, 1, 12));
                $validationDateFlatpickr[0]._flatpickr.close();
                $validationDateFlatpickrCustom.change();

                $validationFlexberryTextboxInner[0].value = '12345';
                $validationFlexberryTextboxInner.change();
            });

            wait().then(() => {
                // Check validationmessage for non-unique combination text+date.
                assert.equal($validationFlexberryErrorLabel.text().trim(), 'Combination of attributes (Text, Date) are not unique', 'Text+date combination must be non-unique');

                // Change date value.
                run(() => {
                    $validationDateFlatpickr[0]._flatpickr.open();
                    $validationDateFlatpickr[0]._flatpickr.setDate(new Date(2012, 1, 13));
                    $validationDateFlatpickr[0]._flatpickr.close();
                    $validationDateFlatpickrCustom.change();

                    $validationFlexberryTextboxInner[0].value = '123456';
                    $validationFlexberryTextboxInner.change();
                });

                let done3 = assert.async();

                wait().then(() => {
                    // Check default validationmessage for text+date combination is unique.
                    assert.equal($validationFlexberryErrorLabel.text().trim(), '', 'Text+date combination must be unique');

                    let done5 = assert.async();

                    suggestion.destroyRecord().then(() => done5());

                    done3();
                });
                done2();
            });
            done1();
        });
    });
  });
});
