import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  text: DS.attr('string')
});

Model.defineProjection('MasterDropdownL', 'integration-examples/edit-form/readonly-mode/master-dropdown', {
  text: Projection.attr('Text')
});

export default Model;
