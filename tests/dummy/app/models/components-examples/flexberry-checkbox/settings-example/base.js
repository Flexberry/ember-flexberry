import DS from 'ember-data';
import BaseModel from 'ember-flexberry-data/models/model';
import { Projection } from 'ember-flexberry-data';

var Model = BaseModel.extend({
  flag: DS.attr('boolean')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-checkbox/settings-example/base', {
  flag: Projection.attr('Flag')
});

export default Model;
