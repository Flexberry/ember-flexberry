import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import { Projection } from 'ember-flexberry-data';

let Model = BaseModel.extend({
  text: DS.attr('string')
});

Model.defineProjection('MasterL', 'integration-examples/edit-form/readonly-mode/master', {
  text: Projection.attr('Text')
});

export default Model;
