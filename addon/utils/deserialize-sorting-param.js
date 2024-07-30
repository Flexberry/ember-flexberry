/**
  Convert string with sorting parameters to object.

  Expected string type: '+Name1-Name2...', where: '+' and '-' - sorting direction, 'NameX' - property name for soring.

  @method deserializeSortingParam
  @param {String} paramString String with sorting parameters.
  @returns {Array} Array objects type: { propName: 'NameX', direction: 'asc|desc' }
*/
export default function deserializeSortingParam(paramString) {
  let result = [];
  let getNextIndeces = (paramString) => {
    let nextIndices = ['+', '-', '!'].map(function(element) {
      let pos = paramString.indexOf(element);
      return pos === -1 ? paramString.length : pos;
    });

    return nextIndices;
  };

  while (paramString) {
    let order = paramString.charAt(0);
    let direction = order === '+' ? 'asc' :  order === '-' ? 'desc' : null;
    paramString = paramString.substring(1, paramString.length);
    let nextIndices = getNextIndeces(paramString);
    let nextPosition = Math.min.apply(null, nextIndices);
    let propName = paramString.substring(0, nextPosition);
    paramString = paramString.substring(nextPosition);

    if (direction) {
      result.push({
        propName: propName,
        direction: direction
      });
    }
  }

  return result;
}
