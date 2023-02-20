import { module, test } from 'qunit';
import sinon from 'sinon';
import UserSettingsService from 'ember-flexberry/services/user-settings';
import Ember from 'ember';

module('Unit | Service | userSettings',
{
  beforeEach() {
    sinon.stub(Ember, 'getOwner').returns( 
      { 
      resolveRegistration: () =>({ APP: { components: { flexberryObjectlistview: { defaultPerPage: 5 } } } }),

      _lookupFactory: () =>({ APP: {} })
      })},
  afterEach() {
     Ember.getOwner.restore();}
});


test('get the set perPage', function (assert) {
 
    let service = UserSettingsService.create(); 
    let fakeDBconnection = sinon.fake.returns({ perPage : 11 }); // simulate input value 
    service.getCurrentUserSetting = fakeDBconnection; //mocking getCurrentUserSetting()
    

    assert.equal(service.getCurrentPerPage(), 11, 'input PerPage value is correct')
  });


test('get the default perPage from user-settings', function (assert) {
 
    let service = UserSettingsService.create();
    let fakeDBconnection = sinon.fake.returns(undefined); //no input value
    service.getCurrentUserSetting = fakeDBconnection;
    
    assert.equal(service.getCurrentPerPage(), 5, 'undefined PerPage value replaced with default')
  });

 