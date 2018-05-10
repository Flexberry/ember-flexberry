import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, hasMany } from 'ember-flexberry-data/utils/attributes';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  togglerExampleMasterProperty: validator('presence', {
    presence: true,
    message: 'Master property is required',
  }),
});

let Model = EmberFlexberryDataModel.extend(Validations, {
  togglerExampleMasterProperty: DS.attr('string'),
  togglerExampleDetail: DS.hasMany('ember-flexberry-dummy-toggler-example-detail', {
    inverse: 'togglerExampleMaster',
    async: false
  }),
});

Model.defineProjection('TogglerExampleMasterE', 'ember-flexberry-dummy-toggler-example-master', {
  togglerExampleMasterProperty: attr('Наименование мастера'),
  togglerExampleDetail: hasMany('ember-flexberry-dummy-toggler-example-detail', '', {
    togglerExampleDetailProperty: attr('Наименование детейла')
  })
});
Model.defineProjection('TogglerExampleMasterL', 'ember-flexberry-dummy-toggler-example-master', {
  togglerExampleMasterProperty: attr('Наименование мастера'),
});

export default Model;
