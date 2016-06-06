import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  // Inversed relationship for ember-flexberry-dummy-suggestion-type.localizedTypes.
  // It's not a property for flexberry-lookup component.
  suggestionType: DS.belongsTo('ember-flexberry-dummy-suggestion-type', {
    inverse: 'localizedTypes',
    async: false
  }),
  name: DS.attr('string'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  localization: DS.belongsTo('ember-flexberry-dummy-localization', {
    inverse: null,
    async: false
  }),

  // Model validation rules.
  validations: {
    name: {
      presence: true
    }
  }
});

// Edit form projection.
Model.defineProjection('LocalizedSuggestionTypeE', 'ember-flexberry-dummy-localized-suggestion-type', {
  name: Proj.attr('Name'),
  localization: Proj.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
