import Ember from 'ember';

export default Ember.Service.extend({
  initTime: 0,
  beforeModelTime: 0,
  modelTime: 0,
  afterModelTime: 0,
  activateTime: 0,
  setupControllerTime: 0,
  renderTemplateTime:0,
  firstDidRenderTime: 0,
  lastDidRenderTime: 0
});
