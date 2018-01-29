import Ember from 'ember';

/**
  Helper for get readonly property for list component's cell.

  @class ReadonlyCellHelper
  @extends <a href="http://emberjs.com/api/classes/Ember.Helper.html">Ember.Helper</a>
  @public
*/
export function readonlyCell(params) {
  let readonlyColumns = params[0] || [];
  let columnName = params[1];
  let defaultReadonly = params[2];
  let cellComponentPropertieReadonly = params[3];

  if (Ember.typeOf(cellComponentPropertieReadonly) === 'boolean') {
    return cellComponentPropertieReadonly;
  }

  if (readonlyColumns.indexOf(columnName) > -1) {
    return true;
  }

  return defaultReadonly;
}

export default Ember.Helper.helper(readonlyCell);
