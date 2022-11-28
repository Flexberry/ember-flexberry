import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  file: DS.attr('file')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-file/settings-example/base', {
  file: attr('file')
});

export default Model;
