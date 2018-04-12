import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
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
      presence: {
        message: 'Name is required'
      }
    }
  }
});

// Edit form projection.
Model.defineProjection('LocalizedSuggestionTypeE', 'ember-flexberry-dummy-localized-suggestion-type', {
  name: attr('Name'),
  localization: belongsTo('ember-flexberry-dummy-localization', 'Localization', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
