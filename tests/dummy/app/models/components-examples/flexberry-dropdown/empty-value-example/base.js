import DS from 'ember-data';
import BaseModel from 'ember-flexberry-data/models/model';
import { Projection } from 'ember-flexberry-data';

var Model = BaseModel.extend({
  enumeration: DS.attr('components-examples/flexberry-dropdown/empty-value-example/enumeration')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-dropdown/empty-value-example/base', {
  enumeration: Projection.attr('Enumeration')
});
export default Model;
