import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  name: DS.attr('string')
});

Model.defineProjection('MasterDropdownL', 'integration-examples/edit-form/readonly-mode/master-dropdown', {
  name: Proj.attr('Moderator')
});

export default Model;
