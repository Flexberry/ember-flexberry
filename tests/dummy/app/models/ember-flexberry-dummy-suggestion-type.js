import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
  name: DS.attr('string'),
  moderated: DS.attr('boolean'),
  parent: DS.belongsTo('ember-flexberry-dummy-suggestion-type', { inverse: null, async: false }),
  localizedTypes: DS.hasMany('ember-flexberry-dummy-localized-suggestion-type', { inverse: 'suggestionType', async: false }),
  validations: {
    name: { presence: true }
  }
});

Model.defineProjection('SuggestionTypeE', 'ember-flexberry-dummy-suggestion-type', {
  name: Proj.attr('Name'),
  moderated: Proj.attr('Moderated'),
  parent: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent', {
    name: Proj.attr('Name', { hidden: true })
  }),
  localizedTypes: Proj.hasMany('ember-flexberry-dummy-localized-suggestion-type', 'Localized types', {
    name: Proj.attr('Name'),
    localization: Proj.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
      name: Proj.attr('Name', { hidden: true })
    })
  })
});

Model.defineProjection('SuggestionTypeL', 'ember-flexberry-dummy-suggestion-type', {
  name: Proj.attr('Name'),
  moderated: Proj.attr('Moderated'),
  parent: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Name', {

    }, { hidden: true })
});

export default Model;
