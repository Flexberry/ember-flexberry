import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({

  dataReceived: false,
  receivedMasters: false,
  receivedMasterMasters: false,

  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'ember-flexberry-dummy-sotrudnik-e'
   */
  editFormRoute: 'integration-examples/odata-examples/get-masters/ember-flexberry-dummy-sotrudnik-e',

  actions: {
    doOdataFunction() {
      const adapter = Ember.get(this, 'store').adapterFor('application');
      let args = {
        functionName: 'GetMastersForTest',
        store: Ember.get(this, 'store'),
        modelName: 'ember-flexberry-dummy-sotrudnik',
        modelProjection: 'SotrudnikE'
      };

      adapter.callFunction(args)
        .then(sotrudniks => {
          if (!Ember.isEmpty(sotrudniks)) {
            Ember.set(this, 'dataReceived', true);
            let departaments = sotrudniks.map((a) => Ember.get(a, 'departament'));
            let departamentsIsNull = sotrudniks.find((a) => Ember.isNone(Ember.get(a, 'departament')));
            if (!Ember.isEmpty(departaments) && Ember.isNone(departamentsIsNull)) {
              Ember.set(this, 'receivedMasters', true);
              let vid = departaments.map((a) => Ember.get(a, 'vid'));
              let vidIsNull = departaments.find((a) => Ember.isNone(Ember.get(a, 'vid')));
              if (!Ember.isEmpty(vid) && Ember.isNone(vidIsNull)) {
                Ember.set(this, 'receivedMasterMasters', true);
              }
            }
          }
        });
    }
  }
});
