/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import BaseModel from './base';
import Proj from 'ember-flexberry-data';

/**
  Model to work with user settings.

  @class NewPlatformFlexberryFlexberryUserSettingModel
  @extends BaseModel
*/
let Model = BaseModel.extend({
  appName: DS.attr('string'),
  userName: DS.attr('string'),
  moduleName: DS.attr('string'),
  settName: DS.attr('string'),
  settLastAccessTime: DS.attr('date'),
  txtVal: DS.attr('string')
});

Model.defineProjection('FlexberryUserSettingE', 'new-platform-flexberry-flexberry-user-setting', {
  appName: Proj.attr('Application page name'),
  userName: Proj.attr('User name'),
  moduleName: Proj.attr('Component name'),
  settName: Proj.attr('Setting name'),
  settLastAccessTime: Proj.attr('Modification time'),
  txtVal: Proj.attr('Text value')
});

export default Model;
