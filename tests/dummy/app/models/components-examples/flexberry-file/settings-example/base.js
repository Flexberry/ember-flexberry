import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  file: DS.attr('file')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-file/settings-example/base', {
  file: Projection.attr('file')
});

export default Model;
