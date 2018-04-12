import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  togglerExampleMasterProperty: validator('presence', {
    presence: true,
    message: 'Master property is required',
  }),
});

let Model = Projection.Model.extend(Validations, {
  togglerExampleMasterProperty: DS.attr('string'),
  togglerExampleDetail: DS.hasMany('ember-flexberry-dummy-toggler-example-detail', {
    inverse: 'togglerExampleMaster',
    async: false
  }),
});

Model.defineProjection('TogglerExampleMasterE', 'ember-flexberry-dummy-toggler-example-master', {
  togglerExampleMasterProperty: Projection.attr('Наименование мастера'),
  togglerExampleDetail: Projection.hasMany('ember-flexberry-dummy-toggler-example-detail', '', {
    togglerExampleDetailProperty: Projection.attr('Наименование детейла')
  })
});
Model.defineProjection('TogglerExampleMasterL', 'ember-flexberry-dummy-toggler-example-master', {
  togglerExampleMasterProperty: Projection.attr('Наименование мастера'),
});

export default Model;
