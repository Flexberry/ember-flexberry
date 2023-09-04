import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { dynamicModelRegistration } from 'dummy/utils/create-dynamic-models';

export default Route.extend({
  appState: service(),

  beforeModel() {
    this._super(...arguments);

    this.get('appState').validationShow();
  },

  /**
    Returns model related to current route.

    @method model
   */
  model() {
    var store = this.get('store');

    let dynamicModel = {
      modelName: 'dynamic-model',
      attrs: [
        {
          "name": "text",
          "type": "string",
          "notNull": false,
          "defaultValue": "",
          "stored": true
        }
      ],
      projections: [
        {
          "name": "BaseE",
          "attrs": [
            {
              "name": "text",
              "caption": "Text",
              "hidden": false,
              "index": 0,
            }
          ]
        },
        {
          "name": "BaseL",
          "attrs": [
            {
              "name": "text",
              "caption": "Text",
              "hidden": false,
              "index": 0,
            }
          ]
        }
      ]
    };

    // Dynamic model registration and creation.
    dynamicModelRegistration(dynamicModel, getOwner(this));
    var base = store.createRecord('dynamic-model', { text: 'dynamic-model-text'});

    return base;
  }
});
