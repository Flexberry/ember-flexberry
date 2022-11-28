import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  enumeration: DS.attr('components-examples/flexberry-dropdown/conditional-render-example/enumeration')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-dropdown/conditional-render-example/enumeration', {
  enumeration: attr('Enumeration')
});

export default Model;
