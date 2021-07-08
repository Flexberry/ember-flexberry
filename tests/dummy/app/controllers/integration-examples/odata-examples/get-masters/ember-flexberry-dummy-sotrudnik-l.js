import { get, set } from '@ember/object';
import { isNone, isEmpty } from '@ember/utils';
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
      const adapter = get(this, 'store').adapterFor('application');
      let args = {
        functionName: 'GetMastersForTest',
        store: get(this, 'store'),
        modelName: 'ember-flexberry-dummy-sotrudnik',
        modelProjection: 'SotrudnikE'
      };

      adapter.callFunction(args)
        .then(sotrudniks => {
          if (!isEmpty(sotrudniks)) {
            set(this, 'dataReceived', true);
            let departaments = sotrudniks.map((a) => get(a, 'departament'));
            let departamentsIsNull = sotrudniks.find((a) => isNone(get(a, 'departament')));
            if (!isEmpty(departaments) && isNone(departamentsIsNull)) {
              set(this, 'receivedMasters', true);
              let vid = departaments.map((a) => get(a, 'vid'));
              let vidIsNull = departaments.find((a) => isNone(get(a, 'vid')));
              if (!isEmpty(vid) && isNone(vidIsNull)) {
                set(this, 'receivedMasterMasters', true);
              }
            }
          }
        });
    }
  }
});
