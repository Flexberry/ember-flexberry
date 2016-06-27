import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  enumeration: DS.attr('components-examples/flexberry-dropdown/settings-example/enumeration')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-dropdown/settings-example/base', {
  enumeration: Proj.attr('Enumeration')
});

export default Model;
