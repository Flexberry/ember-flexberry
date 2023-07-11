import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  flag: DS.attr('boolean')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-ddau-checkbox/settings-example/base', {
  flag: attr('Flag')
});

export default Model;
