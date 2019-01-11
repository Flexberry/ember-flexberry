import { Serializer as MasterSerializer } from
  '../mixins/regenerated/serializers/ember-flexberry-dummy-master';
import __ApplicationSerializer from './application';

export default __ApplicationSerializer.extend(MasterSerializer, {
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
