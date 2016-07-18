/**
  @module ember-flexberry
*/

import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';

/**
  @class FlexberryObjectlistviewHierarchicalRouteMixin
*/
export default Ember.Mixin.create({
  actions: {
    /**
    */
    loadRecordsById(id, target, property) {
      let hierarchicalAttribute = this.controllerFor(this.routeName).get('hierarchicalAttribute');
      let modelName = this.get('modelName');
      let projectionName = this.get('modelProjection');
      let builder = new QueryBuilder(this.store)
        .from(modelName)
        .selectByProjection(projectionName)
        .where(hierarchicalAttribute, 'eq', id);

      Ember.set(target, property, this.store.query(modelName, builder.build()));
    },
  },
});
