import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  // Inversed relationship for ember-flexberry-dummy-suggestion.files.
  // It's not a property for flexberry-lookup component.
  suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', {
    address: 'string',
    inverse: 'files',
    async: false
  }),
  order: DS.attr('number', { ordered: true }),
  file: DS.attr('file'),

  // Model validation rules.
  validations: {
  }
});

// List form projection.
Model.defineProjection('SuggestionFileL', 'ember-flexberry-dummy-suggestion-file', {
  order: Projection.attr('Order'),
  suggestion: Projection.belongsTo('ember-flexberry-dummy-suggestion', 'Suggestion', {
    address: Projection.attr('Address', {
      hidden: true
    })
  }, {
    displayMemberPath: 'address'
  }),
  file: Projection.attr('File')
});

// Edit form projection.
Model.defineProjection('SuggestionFileE', 'ember-flexberry-dummy-suggestion-file', {
  order: Projection.attr('Order'),
  suggestion: Projection.belongsTo('ember-flexberry-dummy-suggestion', 'Suggestion', {
    address: Projection.attr('Address')
  }),
  file: Projection.attr('File')
});

export default Model;
