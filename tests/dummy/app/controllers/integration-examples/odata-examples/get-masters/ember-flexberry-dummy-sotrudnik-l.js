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
      const adapter = this.get('store').adapterFor('application');
      let args = {
        functionName: 'GetMastersForTest',
        store: this.get('store'),
        modelName: 'ember-flexberry-dummy-sotrudnik',
        modelProjection: 'SotrudnikE'
      };

      adapter.callFunction(args)
        .then(sotrudniks => {
          if (!Ember.isEmpty(sotrudniks)) {
            this.set('dataReceived', true);
            let departaments = sotrudniks.map((a) => a.get('departament'));
            let departamentsIsNull = sotrudniks.find((a) => Ember.isNone(a.get('departament')));
            if (!Ember.isEmpty(departaments) && Ember.isNone(departamentsIsNull)) {
              this.set('receivedMasters', true);
              let vid = departaments.map((a) => a.get('vid'));
              let vidIsNull = departaments.find((a) => Ember.isNone(a.get('vid')));
              if (!Ember.isEmpty(vid) && Ember.isNone(vidIsNull)) {
                this.set('receivedMasterMasters', true);
              }
            }
          }
        });
    }
  }
});
