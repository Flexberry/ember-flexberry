import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  text: DS.attr('datetime')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-flexberry-simpledatetime/settings-example/base', {
  text: Proj.attr('Datetime')
});

export default Model;
