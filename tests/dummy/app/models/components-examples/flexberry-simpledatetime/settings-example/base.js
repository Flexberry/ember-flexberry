import DS from 'ember-data';
import BaseModel from 'ember-flexberry-data/models/model';
import { Projection } from 'ember-flexberry-data';

var Model = BaseModel.extend({
  date: DS.attr('date')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-flexberry-simpledatetime/settings-example/base', {
  date: Projection.attr('Date')
});

export default Model;
