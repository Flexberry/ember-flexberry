/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

/**
  Model to work with user settings.

  @class NewPlatformFlexberryFlexberryUserSettingModel
  @extends ember-flexberry-data/models/model
*/
let Model = EmberFlexberryDataModel.extend({
  appName: DS.attr('string'),
  userName: DS.attr('string'),
  moduleName: DS.attr('string'),
  settName: DS.attr('string'),
  settLastAccessTime: DS.attr('date'),
  txtVal: DS.attr('string')
});

Model.defineProjection('FlexberryUserSettingE', 'new-platform-flexberry-flexberry-user-setting', {
  appName: attr('Application page name'),
  userName: attr('User name'),
  moduleName: attr('Component name'),
  settName: attr('Setting name'),
  settLastAccessTime: attr('Modification time'),
  txtVal: attr('Text value')
});

export default Model;
