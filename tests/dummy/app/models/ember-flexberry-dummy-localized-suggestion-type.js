import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
    name: DS.attr('string'),
    localization: DS.belongsTo('ember-flexberry-dummy-localization', { inverse: null, async: false }),
    suggestionType: DS.belongsTo('ember-flexberry-dummy-suggestion-type', { inverse: 'localizedTypes', async: false }),
    validations: {
 name: { presence: true }
 }
});

Model.defineProjection('LocalizedSuggestionTypeE', 'ember-flexberry-dummy-localized-suggestion-type', {
name: Proj.attr('Name'),
    localization: Proj.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
    name: Proj.attr('Name', { hidden: true })
    })
});

export default Model;
