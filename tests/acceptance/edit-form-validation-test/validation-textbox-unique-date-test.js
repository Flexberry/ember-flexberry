import Ember from 'ember';
import { executeTest } from './execute-validation-test';

executeTest('check operation text+date unique', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let suggestion = store.createRecord('ember-flexberry-dummy-suggestion', { 
        text: '12345',
        date: new Date(2012, 1, 12)
    });

    suggestion.save();//.then(() => {
        // text
        let $validationField = Ember.$(Ember.$('.field.error')[2]);
        let $validationFlexberryTextbox = $validationField.children('.flexberry-textbox');
        let $validationFlexberryTextboxInner = $validationFlexberryTextbox.children('input');
        let $validationFlexberryErrorLabel = $validationField.children('.label');

        // data
        let $validationDateField = Ember.$(Ember.$('.field.error')[4]);
        let $validationDate = Ember.$('.flexberry-simpledatetime', $validationDateField);
        let $validationDateInner = Ember.$('input.flatpickr-input', $validationDate);

        // Insert text and date in textbox.
        Ember.run(() => {
            $validationDateInner[0].value = '2012-01-12';
            $validationDateInner[1].value = '2012-01-12';
            $validationDateInner.change();

            $validationFlexberryTextboxInner[0].value = '12345';
            $validationFlexberryTextboxInner.change();
        });

        // Check validationmessage for non-unique combination text+date.
        assert.equal($validationFlexberryErrorLabel.text().trim(), 'Combination of attributes (Text, Date) are not unique', 'Text+date combination must be non-unique');

        // Change date value.
        Ember.run(() => {
            $validationDateInner[0].value = '2012-01-13';
            $validationDateInner[1].value = '2012-01-13';
            $validationDateInner.change();

            $validationFlexberryTextboxInner[0].value = '123456';
            $validationFlexberryTextboxInner.change();
        });

        // Check default validationmessage for text length >5 letter.
        assert.equal($validationFlexberryErrorLabel.text().trim(), '', 'Text+date combination must be unique');
    //});
    //.finally(() => {
        //suggestion.deleteRecord();
    //});
  });
});
