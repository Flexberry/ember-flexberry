import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  enumeration: DS.attr('components-examples/flexberry-dropdown/conditional-render-example/enumeration')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-dropdown/conditional-render-example/enumeration', {
  enumeration: Projection.attr('Enumeration')
});

export default Model;
