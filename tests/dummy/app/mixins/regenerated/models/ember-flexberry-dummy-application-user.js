import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
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
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      name: { presence: true },
      eMail: { presence: true }
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineProjections = function (modelClass) {
  modelClass.defineProjection('ApplicationUserE', 'ember-flexberry-dummy-application-user', {
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
  modelClass.defineProjection('ApplicationUserL', 'ember-flexberry-dummy-application-user', {
    name: Projection.attr('Name'),
    eMail: Projection.attr('E-mail'),
    activated: Projection.attr('Activated'),
    birthday: Projection.attr('Birthday'),
    gender: Projection.attr('Gender'),
    karma: Projection.attr('Karma')
  });
  modelClass.defineProjection('AuditView', 'ember-flexberry-dummy-application-user', {
    name: Projection.attr('Name'),
    eMail: Projection.attr('E mail'),
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
};
