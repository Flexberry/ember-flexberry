import EditFormController from 'ember-flexberry/controllers/edit-form';
import { set, observer } from '@ember/object';


export default EditFormController.extend({

  getCellComponent: function(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);

    if (attr.kind === 'belongsTo') {
      if (model.modelName === 'components-examples/flexberry-groupedit/shared/detail' && bindingPath === 'master') {
        cellComponent.componentProperties = {
          projection: 'MasterL',
          displayAttributeName: 'text',
          title: 'Master',
          relationName: 'master',
          choose: 'showLookupDialog',
          remove: 'removeLookupValue',
          autocomplete: true
        };
      }
    }

    return cellComponent;
  },

  enumerationObserver: observer('model.details.@each.enumeration', function () {
    const details = this.get('model.details').toArray();

    details.forEach((detail) => {
      let rowConfig = detail.rowConfig;
      if (rowConfig) {
        this.send('configurateRow', rowConfig, detail);
      }
    });
  }),

  actions: {
    configurateRow(rowConfig, detail) {
      let enumeration = detail.enumeration;

      if (enumeration === 'Block Flag') {
        set(rowConfig, 'readonlyColumns', ['flag']);
      } else {
        set(rowConfig, 'readonlyColumns', []);
      }
    }
  }

});
