import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
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
  name: Proj.attr('Name'),
  moderated: Proj.attr('Moderated'),
  parent: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  localizedTypes: Proj.hasMany('ember-flexberry-dummy-localized-suggestion-type', 'Localized types', {
    name: Proj.attr('Name'),
    localization: Proj.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
      name: Proj.attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

// List form projection.
Model.defineProjection('SuggestionTypeL', 'ember-flexberry-dummy-suggestion-type', {
  name: Proj.attr('Name'),
  moderated: Proj.attr('Moderated'),
  parent: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup example on window customization.
Model.defineProjection('SettingLookupExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: Proj.attr('Name'),
  moderated: Proj.attr('Moderated')
});

// Projection for lookup example on window customization.
Model.defineProjection('CustomizeLookupWindowExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: Proj.attr('Name'),
  moderated: Proj.attr('Moderated')
});

// Projection for lookup with limit function example.
Model.defineProjection('LookupWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: Proj.attr('Name'),
  moderated: Proj.attr('Moderated')
});

// Projection for lookup in dropdown mode example.
Model.defineProjection('DropDownLookupExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: Proj.attr('Name'),
  moderated: Proj.attr('Moderated')
});

export default Model;
