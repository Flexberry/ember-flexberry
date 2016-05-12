import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
    order: DS.attr('number'),
    file: DS.attr('file'),
    suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', { inverse: 'files', async: false }),
    validations: {

 }
});

Model.defineProjection('SuggestionFileE', 'ember-flexberry-dummy-suggestion-file', {
order: Proj.attr('Order'),
    file: Proj.attr('File')
});

export default Model;
