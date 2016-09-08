import DS from 'ember-data';
import BaseModel from 'ember-flexberry-data/models/model';
import { Projection } from 'ember-flexberry-data';

var Model = BaseModel.extend({
  text: DS.attr('string')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-textbox/settings-example/base', {
  text: Projection.attr('Text')
});

export default Model;
