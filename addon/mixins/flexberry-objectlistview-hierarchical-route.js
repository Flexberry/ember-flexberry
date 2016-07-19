/**
  @module ember-flexberry
*/

import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';

/**
  Mixin for [Ember.Route](http://emberjs.com/api/classes/Ember.Route.html) to support hierarchical mode into {{#crossLink "FlexberryObjectlistviewComponent"}}{{/crossLink}}.

  @class FlexberryObjectlistviewHierarchicalRouteMixin
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  actions: {
    /**
      Set in `property` for `target` promise that load nested records.

      @method actions.loadRecordsById
      @param {String} id Record ID.
      @param {ObjectListViewRowComponent} Instance of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {String} property Property name into {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
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
