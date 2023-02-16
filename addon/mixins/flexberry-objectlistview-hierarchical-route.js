/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { Query } from 'ember-flexberry-data';

const { Builder } = Query;

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
      @param {ObjectListViewRowComponent} target Instance of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {String} property Property name into {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {Boolean} firstRunMode Flag indicates that this is the first download of data.
      @param {Object} recordParams Record params such as modelName, modelProjection and hierarchicalAttribute.
    */
    loadRecordsById(id, target, property, firstRunMode, recordParams) {
      let params = recordParams || {};
      let hierarchicalAttribute = params.hierarchicalAttribute || this.controllerFor(this.routeName).get('hierarchicalAttribute');
      let modelName = params.modelName || this.get('modelName');

      if (firstRunMode) {
        let projectionName = params.projectionName || this.get('modelProjection');
        let builder = new Builder(this.store)
          .from(modelName)
          .selectByProjection(projectionName)
          .where(hierarchicalAttribute, 'eq', id);

        Ember.set(target, property, this.store.query(modelName, builder.build()));
      } else {
        let store = this.get('store');
        let records = store.peekAll(modelName);
        let recordsArray = records.content;
        let sortRecordsArray = Ember.A();
        for (let i = 0; i < recordsArray.length; i++) {
          let record = store.peekRecord(modelName, recordsArray[i].id);

          if (record && (!Ember.isNone(record.get(hierarchicalAttribute))) && (record.get(hierarchicalAttribute).id === id)) {
            sortRecordsArray.push(record);
          }
        }

        if (sortRecordsArray.length === 0) {
          this.send('loadRecordsById', id, target, property, true, recordParams);
        } else {
          let recordsArrayinPromise = new Ember.RSVP.Promise((resolve, reject) => {
            resolve(sortRecordsArray);
          });

          Ember.set(target, property, recordsArrayinPromise);
        }
      }
    },

    objectListViewRowClick(record, params) {
      // Prevent transition to edit form if click target is hierarchy expand button.
      if (params && params.originalEvent && Ember.$(params.originalEvent.target).hasClass('hierarchy-expand')) {
        params.goToEditForm = false;
      }

      this._super(...arguments);
    }
  },
});
