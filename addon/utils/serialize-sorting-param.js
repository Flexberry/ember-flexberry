/**
  Convert object with sorting parameters into string.

  @method serializeSortingParam
  @param {Array} sorting Array with objects contains sorting parameters.
  @param {String} sortDefaultValue Default value for sorting parameters.
  @returns {String} String with sorting parameters.
*/
export default function serializeSortingParam(sorting, sortDefaultValue = null) {
  return sorting.map(function(element) {
    return (element.direction === 'asc' ? '+' : element.direction === 'desc' ? '-' : '!') + element.propName;
  }).join('') || sortDefaultValue;
}
