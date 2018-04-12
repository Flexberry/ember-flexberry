import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
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
  }
});

// Edit form projection.
Model.defineProjection('SuggestionTypeE', 'ember-flexberry-dummy-suggestion-type', {
  name: attr('Name'),
  moderated: attr('Moderated'),
  parent: belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  localizedTypes: hasMany('ember-flexberry-dummy-localized-suggestion-type', 'Localized types', {
    name: attr('Name'),
    localization: belongsTo('ember-flexberry-dummy-localization', 'Localization', {
      name: attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

// List form projection.
Model.defineProjection('SuggestionTypeL', 'ember-flexberry-dummy-suggestion-type', {
  name: attr('Name'),
  moderated: attr('Moderated'),
  parent: belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup example on window customization.
Model.defineProjection('SettingLookupExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: attr('Name'),
  moderated: attr('Moderated')
});

// Projection for lookup example on window customization.
Model.defineProjection('CustomizeLookupWindowExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: attr('Name'),
  moderated: attr('Moderated')
});

// Projection for lookup with limit function example.
Model.defineProjection('LookupWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: attr('Name'),
  moderated: attr('Moderated')
});

// Projection for lookup in dropdown mode example.
Model.defineProjection('DropDownLookupExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: attr('Name'),
  moderated: attr('Moderated')
});

export default Model;
