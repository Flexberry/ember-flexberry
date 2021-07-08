import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
  text: DS.attr('string')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-textarea/settings-example/base', {
  text: attr('Text')
});

export default Model;
