import { Serializer as DetailSerializer } from
  '../mixins/regenerated/serializers/ember-flexberry-dummy-detail';
import __ApplicationSerializer from './application';

export default __ApplicationSerializer.extend(DetailSerializer, {
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
