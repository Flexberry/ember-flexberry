import { on } from '@ember/object/evented';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';
import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  name: validator('presence', {
    presence: true,
    message: 'Name is required',
  }),
});

let Model = EmberFlexberryDataModel.extend(Validations, {
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

  /**
    Non-stored property.

    @property computedField
  */
  computedField: DS.attr('string'),

  moderatedChanged: on('init', observer('Name', function() {
    once(this, 'computedFieldCompute');
  })),

  nameChanged: on('init', observer('Moderated', function() {
    once(this, 'computedFieldCompute');
  })),

  computedFieldCompute: function() {
    let result =  this.get('name') + ' ' + this.get('moderated');
    this.set('computedField', result);
  },
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

Model.defineProjection('SuggestionTypeEWithComputedField', 'ember-flexberry-dummy-suggestion-type', {
  name: attr(''),
  moderated: attr(''),
  computedField: attr(''),
  parent: belongsTo('ember-flexberry-dummy-suggestion-type', '', {
    name: attr(''),
    moderated: attr(''),
    computedField: attr('')
  }, {
    displayMemberPath: 'computedField'
  }),
  localizedTypes: hasMany('ember-flexberry-dummy-localized-suggestion-type', '', {
    name: attr('Name'),
    localization: belongsTo('ember-flexberry-dummy-localization', 'Localization', {
      name: attr('Name', { hidden: true })
    }, { displayMemberPath: 'name' }),
    suggestionType: belongsTo('ember-flexberry-dummy-suggestion-type', '', {
    }, { hidden: true })
  })
});

Model.defineProjection('AutocompleteProjectionExampleView', 'ember-flexberry-dummy-suggestion-type', {
  name: attr('Name'),
  moderated: attr('Moderated'),
  computedField: attr(''),
});

export default Model;
