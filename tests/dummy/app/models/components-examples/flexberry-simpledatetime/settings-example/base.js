import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  date: DS.attr('date')
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-flexberry-simpledatetime/settings-example/base', {
  date: attr('Date')
});

export default Model;
