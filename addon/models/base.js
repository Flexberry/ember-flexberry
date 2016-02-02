import Proj from 'ember-flexberry-projections';
import ValidateModel from '../mixins/validate-model';

export default Proj.Model.extend(ValidateModel, {
  makeDirty() {
    // Transition into the `updated.uncommitted` state
    // if the model in the `saved` state (no local changes).
    // Alternative: this.get('currentState').becomeDirty();
    this.send('becomeDirty');
  }
});
