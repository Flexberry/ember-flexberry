import { Model as GraduateRecordMixin, defineProjections, defineBaseModel  } from
  '../mixins/regenerated/models/ember-flexberry-dummy-graduate-record';
import StudyRecordModel from './ember-flexberry-dummy-study-record';

let Model = StudyRecordModel.extend(GraduateRecordMixin, {

});
defineBaseModel(Model);
defineProjections(Model);
export default Model;
