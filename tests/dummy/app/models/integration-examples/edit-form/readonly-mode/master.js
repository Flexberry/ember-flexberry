import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model =EmberFlexberryDataModel.extend({
  text: DS.attr('string')
});

Model.defineProjection('MasterL', 'integration-examples/edit-form/readonly-mode/master', {
  text: attr('Text')
});

export default Model;
