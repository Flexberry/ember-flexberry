import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  togglerExampleDetailProperty: validator('presence', {
    presence: true,
    message: 'Deteil property is required',
  }),
});

let Model = Projection.Model.extend(Validations, {
  togglerExampleDetailProperty: DS.attr('string'),
  togglerExampleMaster: DS.belongsTo('ember-flexberry-dummy-toggler-example-master', {
    inverse: 'togglerExampleDetail',
    async: false
  }),
});

Model.defineProjection('TogglerExampleDetailE', 'ember-flexberry-dummy-toggler-example-detail', {
  togglerExampleDetailProperty: Projection.attr('Наименование детейла')
});
Model.defineProjection('TogglerExampleDetailL', 'ember-flexberry-dummy-toggler-example-detail', {
  togglerExampleDetailProperty: Projection.attr('Наименование детейла')
});

export default Model;
