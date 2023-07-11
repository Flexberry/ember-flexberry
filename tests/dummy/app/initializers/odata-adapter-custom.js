import ODataAdapter from 'ember-flexberry-data/query/odata-adapter';
import getSerializedDateValue from 'ember-flexberry-data/utils/get-serialized-date-value';

export function initialize() {
    ODataAdapter.prototype._processConstForODataSimplePredicateByType = function (predicate, predicateValue, valueType) {
        return valueType === 'string' || valueType === 'ember-flexberry-dummy-json'
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