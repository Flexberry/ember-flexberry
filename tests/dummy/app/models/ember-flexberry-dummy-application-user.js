import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  name: validator('presence', {
    presence: true,
    message: 'Name is required',
  }),
  eMail: validator('presence', {
    presence: true,
    message: 'User email is required',
  }),
});

let Model = EmberFlexberryDataModel.extend(Validations, {
  name: DS.attr('string'),
  eMail: DS.attr('string'),
  phone1: DS.attr('string'),
  phone2: DS.attr('string'),
  phone3: DS.attr('string'),
  activated: DS.attr('boolean'),
  vK: DS.attr('string'),
  facebook: DS.attr('string'),
  twitter: DS.attr('string'),
  birthday: DS.attr('date'),
  gender: DS.attr('ember-flexberry-dummy-gender'),
  vip: DS.attr('boolean'),
  karma: DS.attr('decimal'),
});

// Edit form projection.
Model.defineProjection('ApplicationUserE', 'ember-flexberry-dummy-application-user', {
  name: attr('Name'),
  eMail: attr('E-mail'),
  phone1: attr('Phone1'),
  phone2: attr('Phone2'),
  phone3: attr('Phone3'),
  activated: attr('Activated'),
  vK: attr('VK'),
  facebook: attr('Facebook'),
  twitter: attr('Twitter'),
  birthday: attr('Birthday'),
  gender: attr('Gender'),
  vip: attr('Vip'),
  karma: attr('Karma')
});

// List form projection.
Model.defineProjection('ApplicationUserL', 'ember-flexberry-dummy-application-user', {
  name: attr('Name'),
  eMail: attr('E-mail'),
  activated: attr('Activated'),
  birthday: attr('Birthday'),
  gender: attr('Gender'),
  karma: attr('Karma')
});

export default Model;
