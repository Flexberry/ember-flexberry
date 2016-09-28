import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  enumeration: DS.attr('components-examples/flexberry-dropdown/settings-example/enumeration')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-dropdown/settings-example/base', {
  enumeration: Projection.attr('Enumeration')
});

export default Model;
