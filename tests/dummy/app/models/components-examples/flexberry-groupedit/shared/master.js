import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
  text: DS.attr('string')
});

Model.defineProjection('MasterL', 'components-examples/flexberry-groupedit/shared/master', {
  text: attr('Text')
});

export default Model;
