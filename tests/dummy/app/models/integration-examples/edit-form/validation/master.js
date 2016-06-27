import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  text: DS.attr('string')
});

// Edit form projection.
Model.defineProjection('MasterL', 'integration-examples/edit-form/validation/master', {
  text: Proj.attr('Text')
});

export default Model;
