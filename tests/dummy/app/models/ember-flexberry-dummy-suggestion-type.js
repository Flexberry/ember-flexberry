import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  name: DS.attr('string'),
  moderated: DS.attr('boolean'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  parent: DS.belongsTo('ember-flexberry-dummy-suggestion-type', {
    inverse: null,
    async: false
  }),

  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  localizedTypes: DS.hasMany('ember-flexberry-dummy-localized-suggestion-type', {
    inverse: 'suggestionType',
    async: false
  }),

  // Model validation rules.
  validations: {
    name: {
      presence: {
        message: 'Name is required'
      }
    }
  },

  /**
    Non-stored property.

    @property computedField
  */
  computedField: DS.attr('string'),

  moderatedChanged: Ember.on('init', Ember.observer('Name', function() {
    Ember.run.once(this, 'computedFieldCompute');
  })),

  nameChanged: Ember.on('init', Ember.observer('Moderated', function() {
    Ember.run.once(this, 'computedFieldCompute');
  })),

  computedFieldCompute: function() {
    let result =  this.get('name') + ' ' + this.get('moderated');
    this.set('computedField', result);
  },
});

// Edit form projection.
Model.defineProjection('SuggestionTypeE', 'ember-flexberry-dummy-suggestion-type', {
  name: Projection.attr('Name'),
  moderated: Projection.attr('Moderated'),
  parent: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  localizedTypes: Projection.hasMany('ember-flexberry-dummy-localized-suggestion-type', 'Localized types', {
    name: Projection.attr('Name'),
    localization: Projection.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
      name: Projection.attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

// List form projection.
Model.defineProjection('SuggestionTypeL', 'ember-flexberry-dummy-suggestion-type', {
  name: Projection.attr('Name'),
  moderated: Projection.attr('Moderated'),
  parent: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup example on window customization.
Model.defineProjection('SettingLookupExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: Projection.attr('Name'),
  moderated: Projection.attr('Moderated')
});

// Projection for lookup example on window customization.
Model.defineProjection('CustomizeLookupWindowExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: Projection.attr('Name'),
  moderated: Projection.attr('Moderated')
});

// Projection for lookup with limit function example.
Model.defineProjection('LookupWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: Projection.attr('Name'),
  moderated: Projection.attr('Moderated')
});

// Projection for lookup in dropdown mode example.
Model.defineProjection('DropDownLookupExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: Projection.attr('Name'),
  moderated: Projection.attr('Moderated')
});

Model.defineProjection('SuggestionTypeEWithComputedField', 'ember-flexberry-dummy-suggestion-type', {
  name: Projection.attr(''),
  moderated: Projection.attr(''),
  computedField: Projection.attr(''),
  parent: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', '', {
    name: Projection.attr(''),
    moderated: Projection.attr(''),
    computedField: Projection.attr('')
  }, {
    displayMemberPath: 'computedField'
  }),
  localizedTypes: Projection.hasMany('ember-flexberry-dummy-localized-suggestion-type', '', {
    name: Projection.attr('Name'),
    localization: Projection.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
      name: Projection.attr('Name', { hidden: true })
    }, { displayMemberPath: 'name' }),
    suggestionType: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', '', {
    }, { hidden: true })
  })
});

Model.defineProjection('AutocompleteProjectionExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: Projection.attr('Name'),
  moderated: Projection.attr('Moderated'),
  computedField: Projection.attr(''),
});

export default Model;
