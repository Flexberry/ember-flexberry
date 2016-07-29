/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import BaseModel from './base';
import { Projection } from 'ember-flexberry-data';

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
  appName: Projection.attr('Application page name'),
  userName: Projection.attr('User name'),
  moduleName: Projection.attr('Component name'),
  settName: Projection.attr('Setting name'),
  settLastAccessTime: Projection.attr('Modification time'),
  txtVal: Projection.attr('Text value')
});

export default Model;
