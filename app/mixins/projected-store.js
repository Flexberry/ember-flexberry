import Ember from 'ember';
import ProjectionQuery from '../utils/projection-query';

export default Ember.Mixin.create({
  findAll: function(modelName, options) {
    if (options && options.projection) {
      return this.query(modelName, {
        projection: options.projection
      });
    }

    return this._super.apply(this, arguments);
  },

  findRecord: function(modelName, id, options) {
    if (options && options.projection) {
      // TODO: case of options.reload === false.
      return this.queryRecord(modelName, {
        id: id,
        projection: options.projection
      });
    }

    return this._super.apply(this, arguments);
  },

  query: function(modelName, query) {
    query = this._normalizeQuery(modelName, query);
    return this._super(modelName, query).then(function(recordArray) {
      return recordArray;
    });
  },

  queryRecord: function(modelName, query) {
    query = this._normalizeQuery(modelName, query);
    return this._super(modelName, query).then(function(record) {
      return record;
    });
  },

  _normalizeQuery: function(modelName, query) {
    if (query && query.projection) {
      let projName = query.projection;
      let typeClass = this.modelFor(modelName);
      let proj = typeClass.projections.get(projName);
      let projQuery = ProjectionQuery.get(proj, this);

      delete query.projection;
      query = Ember.merge(query, projQuery);
    }

    return query;
  }
});
