import Ember from 'ember';
import DS from 'ember-data';
import { buildValidations, validator } from 'ember-cp-validations';

import { Projection } from 'ember-flexberry-data';
import BaseModel from 'ember-flexberry-data/models/model-without-validation';

const { computed } = Ember;

const Validations = buildValidations({
  name: validator('presence', {
    presence: true,
    message: 'Name is required',
  }),
  eMail: validator('presence', {
    presence: true,
    message: 'User email is required',
  }),
  phone1: validator('presence', {
    presence: true,
    message: 'Phone is required',
    disabled: computed.not('model.phone1IsRequired'),
  }),
});

const Model = BaseModel.extend(Validations, {
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

  phone1IsRequired: false,
});

// Edit form projection.
Model.defineProjection('ApplicationUserE', 'ember-flexberry-dummy-application-user', {
  name: Projection.attr('Name'),
  eMail: Projection.attr('E-mail'),
  phone1: Projection.attr('Phone1'),
  phone2: Projection.attr('Phone2'),
  phone3: Projection.attr('Phone3'),
  activated: Projection.attr('Activated'),
  vK: Projection.attr('VK'),
  facebook: Projection.attr('Facebook'),
  twitter: Projection.attr('Twitter'),
  birthday: Projection.attr('Birthday'),
  gender: Projection.attr('Gender'),
  vip: Projection.attr('Vip'),
  karma: Projection.attr('Karma')
});

// List form projection.
Model.defineProjection('ApplicationUserL', 'ember-flexberry-dummy-application-user', {
  name: Projection.attr('Name'),
  eMail: Projection.attr('E-mail'),
  activated: Projection.attr('Activated'),
  birthday: Projection.attr('Birthday'),
  gender: Projection.attr('Gender'),
  karma: Projection.attr('Karma')
});

// Projection for lookup example on window customization.
Model.defineProjection('PreviewExampleView', 'ember-flexberry-dummy-application-user', {
  name: Projection.attr('Name'),
});

// Projection for lookup test with custom window.
Model.defineProjection('TestLookupCustomWindow', 'ember-flexberry-dummy-application-user', {
  eMail: Projection.attr('E-mail')
});

export default Model;
