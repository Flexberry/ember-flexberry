import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  text: DS.attr('string')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-textarea/settings-example/base', {
  text: Projection.attr('Text')
});

export default Model;
