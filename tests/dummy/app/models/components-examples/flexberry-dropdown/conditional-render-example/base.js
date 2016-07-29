import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import { Projection } from 'ember-flexberry-data';

var Model = BaseModel.extend({
  enumeration: DS.attr('components-examples/flexberry-dropdown/conditional-render-example/enumeration')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-dropdown/conditional-render-example/enumeration', {
  enumeration: Projection.attr('Enumeration')
});

export default Model;
