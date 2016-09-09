import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  flag: DS.attr('boolean')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-checkbox/settings-example/base', {
  flag: Projection.attr('Flag')
});

export default Model;
