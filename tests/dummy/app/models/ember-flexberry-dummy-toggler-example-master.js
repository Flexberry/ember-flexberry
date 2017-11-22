import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  togglerExampleMasterProperty: DS.attr('string'),
  togglerExampleDetail: DS.hasMany('ember-flexberry-dummy-toggler-example-detail', { inverse: 'togglerExampleMaster', async: false }),

  // Model validation rules.
  validations: {
  }
});

Model.defineProjection('TogglerExampleMasterE', 'ember-flexberry-dummy-toggler-example-master', {
  togglerExampleMasterProperty: Projection.attr('Наименование мастера')
});
Model.defineProjection('TogglerExampleMasterL', 'ember-flexberry-dummy-toggler-example-master', {
  togglerExampleMasterProperty: Projection.attr('Наименование мастера')
});

export default Model;
