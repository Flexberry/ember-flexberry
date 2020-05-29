import { helper } from '@ember/component/helper';
import { isBlank, isNone, isEmpty, typeOf } from '@ember/utils';
import { get } from '@ember/object';

/**
  Helper for get validation flag by object and property path.

  @class GetValidationCheckHelper
  @extends <a href="https://emberjs.com/api/ember/release/classes/Helper">Helper</a>
  @public
*/
export function getValidationCheck(params) {
  const object = params[0];
  const property = params[1];
  const objectIsNull = isNone(object) || isEmpty(object);
  const propertyIsNull = isNone(property) || typeOf(property) !== 'string' || isBlank(property);

  if (objectIsNull || propertyIsNull) {
    return false;
  }

  const lastDotIndex = property.lastIndexOf('.');
  const isHaveMaster = lastDotIndex > 0 && lastDotIndex < (property.length -1);

  const validationsAttrsPath = 'validations.attrs';
  const validationBadFlag = 'isInvalid';

  let validationPath = validationsAttrsPath + '.' + property + '.' + validationBadFlag;

  if (isHaveMaster) {
    const propertyMasterPath = property.substring(0, lastDotIndex);
    const propertyname = property.substring(lastDotIndex + 1);
    validationPath = propertyMasterPath + '.' + validationsAttrsPath + '.' + propertyname + '.' + validationBadFlag;
  }

  const objectValidationValue = get(object, validationPath);

  return objectValidationValue;
}

export default helper(getValidationCheck);