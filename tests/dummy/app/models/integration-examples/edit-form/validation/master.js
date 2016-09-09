import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  text: DS.attr('string')
});

// Edit form projection.
Model.defineProjection('MasterL', 'integration-examples/edit-form/validation/master', {
  text: Projection.attr('Text')
});

export default Model;
