import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  text: DS.attr('string')
});

Model.defineProjection('MasterL', 'components-examples/flexberry-groupedit/shared/master', {
  text: Projection.attr('Text')
});

export default Model;
