import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  togglerExampleDetailProperty: DS.attr('string'),
  togglerExampleMaster: DS.belongsTo('ember-flexberry-dummy-toggler-example-master', { inverse: 'togglerExampleDetail', async: false }),

  // Model validation rules.
  validations: {
  }

});

Model.defineProjection('TogglerExampleDetailE', 'ember-flexberry-dummy-toggler-example-detail', {
  togglerExampleDetailProperty: Projection.attr('Наименование детейла'),
  togglerExampleMaster: Projection.belongsTo('ember-flexberry-dummy-toggler-example-master', '', {
    togglerExampleMasterProperty: Projection.attr('Наименование мастера')
  })
});
Model.defineProjection('TogglerExampleDetailL', 'ember-flexberry-dummy-toggler-example-detail', {
  togglerExampleDetailProperty: Projection.attr('Наименование детейла'),
  togglerExampleMaster: Projection.belongsTo('ember-flexberry-dummy-toggler-example-master', '', {
    togglerExampleMasterProperty: Projection.attr('Наименование мастера')
  })
});

export default Model;
