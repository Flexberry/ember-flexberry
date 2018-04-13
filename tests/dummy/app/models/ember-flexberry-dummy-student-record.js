import { Model as StudentRecordMixin, defineProjections, defineBaseModel  } from
  '../mixins/regenerated/models/ember-flexberry-dummy-student-record';
import StudyRecordModel from './ember-flexberry-dummy-study-record';

let Model = StudyRecordModel.extend(StudentRecordMixin, {

});
defineBaseModel(Model);
defineProjections(Model);
export default Model;
