import Ember from 'ember';
import EditFormRoute from 'ember-flexberry/routes/edit-form';
import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'DropDownLookupExampleView'
   */
  modelProjection: 'CustomizeLookupWindowExampleView',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion',

  /**
    Returns model related to current route.

    @method model
   */
  model(params) {
    let store = this.get('store');
    let base = store.createRecord('ember-flexberry-dummy-suggestion');
    return base;
  },

  actions: {
    loadRecordsById(id, target, property) {
      let hierarchicalAttribute = 'parent';
      let modelName = 'ember-flexberry-dummy-suggestion-type';
      let projectionName = 'SettingLookupExampleView';
      let builder = new Builder(this.store)
        .from(modelName)
        .selectByProjection(projectionName)
        .where(hierarchicalAttribute, 'eq', id);

      Ember.set(target, property, this.store.query(modelName, builder.build()));
    },
  }
});
