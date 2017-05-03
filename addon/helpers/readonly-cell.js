import Ember from 'ember';

export function readonlyCell(params) {
  let readonlyColumns = params[0] || [];
  let columnName = params[1];
  let defaultReadonly = params[2];

  if (readonlyColumns.includes(columnName)) {
    return true;
  }

  return defaultReadonly;
}

export default Ember.Helper.helper(readonlyCell);
