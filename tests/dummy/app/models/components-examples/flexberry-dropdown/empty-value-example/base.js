import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
  enumeration: DS.attr('components-examples/flexberry-dropdown/empty-value-example/enumeration')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-dropdown/empty-value-example/base', {
  enumeration: attr('Enumeration')
});
export default Model;
