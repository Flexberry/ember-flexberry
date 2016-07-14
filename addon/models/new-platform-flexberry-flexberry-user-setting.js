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
  userName: DS.attr('string'),
  moduleName: DS.attr('string'),
  settName: DS.attr('string'),
  txtVal: DS.attr('string')
});

Model.defineProjection('FlexberryUserSettingE', 'new-platform-flexberry-flexberry-user-setting', {
  userName: Proj.attr('User name'),
  moduleName: Proj.attr('Module name'),
  settName: Proj.attr('Setting name'),
  txtVal: Proj.attr('Text value')
});

export default Model;
