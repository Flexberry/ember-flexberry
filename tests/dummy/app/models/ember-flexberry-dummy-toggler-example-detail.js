import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  togglerExampleDetailProperty: validator('presence', {
    presence: true,
    message: 'Deteil property is required',
  }),
});

let Model = EmberFlexberryDataModel.extend(Validations, {
  togglerExampleDetailProperty: DS.attr('string'),
  togglerExampleMaster: DS.belongsTo('ember-flexberry-dummy-toggler-example-master', {
    inverse: 'togglerExampleDetail',
    async: false
  }),
});

Model.defineProjection('TogglerExampleDetailE', 'ember-flexberry-dummy-toggler-example-detail', {
  togglerExampleDetailProperty: attr('Наименование детейла')
});
Model.defineProjection('TogglerExampleDetailL', 'ember-flexberry-dummy-toggler-example-detail', {
  togglerExampleDetailProperty: attr('Наименование детейла')
});

export default Model;
