import { Serializer as StudentRecordSerializer } from
  '../mixins/regenerated/serializers/ember-flexberry-dummy-student-record';
import StudyRecordSerializer from './ember-flexberry-dummy-study-record';

export default StudyRecordSerializer.extend(StudentRecordSerializer, {
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
