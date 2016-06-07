import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  name: DS.attr('string')
});

Model.defineProjection('MasterL', 'integration-examples/edit-form/readonly-mode/master', {
  name: Proj.attr('Author')
});

export default Model;
