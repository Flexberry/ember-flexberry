import Ember from 'ember';
import EditFormRoute from './edit-form';

export default EditFormRoute.extend({
  renderTemplate: function(controller, model) {
    this.render(this.routeName, {
      model: model,
      controller: controller,
      outlet: 'main',
      into: 'application'
    });
  },

  actions: {
    transitionToParentRoute() {
      this.transitionToParentRoute();
    }
  },

  transitionToParentRoute() {
    // TODO: generate or get dynamically?
    // const parentRouteName = this.get('parentRouteName');
    let parentRouteName = this._getParentRouteName();
    Ember.assert('Detail\'s route should have a parent route', parentRouteName);

    this.transitionTo(parentRouteName);
  },

  _getRouteDynamicSegmentForId() {
    return Ember.String.camelize(this.routeName) + '_id';
  },

  _getParentRouteName() {
    return this.routeName.substring(0, this.routeName.lastIndexOf('.'));
  },

  serialize(model) {
    let params = this._super(...arguments);
    let idSegment = this._getRouteDynamicSegmentForId();
    params[idSegment] = model.id;
    return params;
  },

  model(params, transition) {
    let modelName = this.get('modelName');
    let modelProjName = this.get('modelProjection');
    let idSegment = this._getRouteDynamicSegmentForId();
    let id = params[idSegment];

    Ember.assert(`modelName should be defined for ${this.routeName} route`, modelName);
    Ember.assert(`${idSegment} param should be defined for ${this.routeName} route`, id);

    return this.store.findRecord(modelName, id, {
      projection: modelProjName
    });
  },

  setupController(controller, model) {
    this._super(...arguments);

    let parentRouteName = this._getParentRouteName();
    if (parentRouteName) {
      let parentController = this.controllerFor(parentRouteName);
      controller.set('parentController', parentController);
    }
  }
});
