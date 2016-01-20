import Proj from 'ember-flexberry-projections';
import ValidateModel from '../mixins/validate-model';

export default Proj.Model.extend(ValidateModel, {
  makeDirty() {
    this.transitionTo('updated.inFlight');
  }
});
