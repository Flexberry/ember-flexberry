import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  text: DS.attr('string')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-field/settings-example/base', {
  text: Proj.attr('Text')
});

export default Model;
