import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  // Inversed relationship for ember-flexberry-dummy-suggestion.files.
  // It's not a property for flexberry-lookup component.
  suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', {
    inverse: 'files',
    async: false
  }),
  order: DS.attr('number'),
  file: DS.attr('file'),
});

// Edit form projection.
Model.defineProjection('SuggestionFileE', 'ember-flexberry-dummy-suggestion-file', {
  order: Projection.attr('Order'),
  file: Projection.attr('File')
});

export default Model;
