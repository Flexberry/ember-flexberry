import { isNone } from '@ember/utils';
import ODataAdapter from 'ember-flexberry-data/query/odata-adapter';
import getSerializedDateValue from 'ember-flexberry-data/utils/get-serialized-date-value';

export function initialize() {
  ODataAdapter.prototype._processConstForODataSimplePredicateByType = function (predicate, predicateValue, valueType) {
    let appContainer = Ember.Application.NAMESPACES.find(x => x.backendUrl && x.__container__).__container__;
    let transformInstance = appContainer.lookup('transform:' + valueType);
    let transformClass = !isNone(transformInstance) ? transformInstance.constructor : null;

    if (transformClass && transformClass.getOdataValue) {
      return transformClass.getOdataValue(predicateValue);
    }
    
    return valueType === 'string'
      ? `'${String(predicateValue).replace(/'/g, `''`)}'`
      : ((valueType === 'date' || (valueType === 'object' && predicateValue instanceof Date))
        ? getSerializedDateValue.call(this._store, predicateValue, predicate.timeless)
        : predicateValue);
  }
}

export default {
  name: 'odata-adapter-custom',
  initialize
};