import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  text: DS.attr('string')
});

Model.defineProjection('MasterDropdownL', 'integration-examples/edit-form/readonly-mode/master-dropdown', {
  text: Proj.attr('Text')
});

export default Model;
