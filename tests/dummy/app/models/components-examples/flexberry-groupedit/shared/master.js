import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import { Projection } from 'ember-flexberry-data';

var Model = BaseModel.extend({
  text: DS.attr('string')
});

Model.defineProjection('MasterL', 'components-examples/flexberry-groupedit/shared/master', {
  text: Projection.attr('Text')
});

export default Model;
