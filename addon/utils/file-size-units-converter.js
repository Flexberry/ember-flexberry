/**
  @module ember-flexberry
*/

/**
  Used for convert file size value depending on units.

  @method getSizeInUnits
  @param {Number} fileSize file size in bytes.
  @param {String} fileSizeUnits wanted file size units as 'Bt' 'Kb' 'Mb' 'Gb'.
  @return {Number} File size in bytes.

  Usage:
  controllers/my-form.js
  ```javascript
    import { getRecord } from 'ember-flexberry/utils/file-size-units-converter'
    let layer = getSizeInUnits(file.size, 'Mb')

  ```
*/
let getSizeInUnits = function (fileSize, fileSizeUnits) {
  let fileSizeInUnits = fileSize;

  switch (fileSizeUnits) {
    case 'Kb':
      fileSizeInUnits *= 1e-3;
      break;
    case 'Mb':
      fileSizeInUnits *= 1e-6;
      break;
    case 'Gb':
      fileSizeInUnits *= 1e-9;
      break;
    default:
      throw new Error(`Wrong value of file size units - ${fileSizeUnits}`);
  }

  return fileSizeInUnits;
};

export {
  getSizeInUnits
};
