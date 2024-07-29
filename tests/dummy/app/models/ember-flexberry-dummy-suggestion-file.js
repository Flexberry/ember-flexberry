import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo } from 'ember-flexberry-data/utils/attributes';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  suggestion: validator('presence', {
    presence: true,
    message: 'Suggestion is required',
  }),
});

const Model = EmberFlexberryDataModel.extend(Validations, {
  // Inversed relationship for ember-flexberry-dummy-suggestion.files.
  // It's not a property for flexberry-lookup component.
  suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', {
    inverse: 'files',
    async: false
  }),
  order: DS.attr('number', { ordered: true }),
  file: DS.attr('file')
});

// List form projection.
Model.defineProjection('SuggestionFileL', 'ember-flexberry-dummy-suggestion-file', {
  order: attr('Order'),
  suggestion: belongsTo('ember-flexberry-dummy-suggestion', 'Suggestion', {
    address: attr('Address', {
      hidden: true
    })
  }, {
    displayMemberPath: 'address'
  }),
  file: attr('File')
});

// Edit form projection.
Model.defineProjection('SuggestionFileE', 'ember-flexberry-dummy-suggestion-file', {
  order: attr('Order'),
  suggestion: belongsTo('ember-flexberry-dummy-suggestion', 'Suggestion', {
    address: attr('Address')
  }),
  file: attr('File')
});

export default Model;
