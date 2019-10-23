import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  // Inversed relationship for ember-flexberry-dummy-suggestion-type.localizedTypes.
  // It's not a property for flexberry-lookup component.
  suggestionType: DS.belongsTo('ember-flexberry-dummy-suggestion-type', {
    inverse: 'localizedTypes',
    async: false
  }),
  name: DS.attr('string'),

  /**
    Non-stored property.

    @property detailComputedField
  */
  detailComputedField: DS.attr('string'),

  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'detailComputedFieldCompute' method in model class (outside of this mixin) if you want to compute value of 'detailComputedField' property.

    @method _detailComputedFieldCompute
    @private
    @example
      ```javascript
      _detailComputedFieldChanged: on('init', observer('detailComputedField', function() {
        once(this, '_detailComputedFieldCompute');
      }))
      ```
  */

  _detailComputedFieldCompute: function() {
    let name = this.get('name');
    let localizationName = this.get('localization.name');
    let result = (localizationName) ? name + ':' + localizationName : name;
    this.set('detailComputedField', result);
  },

  detailComputedFieldChanged: Ember.on('init', Ember.observer('name', function() {
    Ember.run.once(this, '_detailComputedFieldCompute');
  })),

  localizationChanged: Ember.on('init', Ember.observer('localization', function() {
    Ember.run.once(this, '_detailComputedFieldCompute');
  })),

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
    },
    localization: {
      presence: {
        message: 'Localization is required'
      }
    }
  }
});

// Edit form projection.
Model.defineProjection('LocalizedSuggestionTypeE', 'ember-flexberry-dummy-localized-suggestion-type', {
  name: Projection.attr('Name'),
  localization: Projection.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

Model.defineProjection('LocalizedSuggestionTypeEWithComputedField', 'ember-flexberry-dummy-localized-suggestion-type', {
  name: Projection.attr('Name'),
  detailComputedField: Projection.attr(''),
  localization: Projection.belongsTo('ember-flexberry-dummy-localization', '', {
    name: Projection.attr('Name')
  }),
  suggestionType: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', '', {
  })
});

export default Model;
