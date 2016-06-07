import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  text: DS.attr('file')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-file/settings-example/base', {
  text: Proj.attr('file')
});

export default Model;
