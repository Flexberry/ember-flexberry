import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  date: DS.attr('date')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-flexberry-simpledatetime/settings-example/base', {
  date: Proj.attr('Date')
});

export default Model;
