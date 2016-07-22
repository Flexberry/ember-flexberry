import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import { Projection } from 'ember-flexberry-data';

var Model = BaseModel.extend({
  date: DS.attr('date')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-datepicker/settings-example/base', {
  date: Projection.attr('Date')
});

export default Model;
