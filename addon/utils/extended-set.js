/**
  @module ember-flexberry
*/

import { isArray } from '@ember/array';
import { assign } from '@ember/polyfills';
import { set } from '@ember/object';

/**
  Used for setting objects properties by path containing Ember.RecordArray

  @for Utils.Layers
  @method setRecord
  @param {Object} source this
  @param {String} keyName Property path
  @param {Object} value New value for Property
  @return {Object} Assigned value

  Usage:
  controllers/my-form.js
  ```javascript
    import { setRecord } from 'ember-flexberry/utils/setRecord'l
    setRecord(this, 'map.mapLayer.1.visibility', false)

  ```
*/
let setRecord = function (source, keyName, value) {
  // array of keys
  let keys = keyName.split('.');

  if (keys.length > 1) {
    // first object of path
    let result = source.get(keys[0]);

    for (let i = 1, len = keys.length; i < len; i++) {
      // needed for recognition if key is index
      let keyValue = parseInt(keys[i]);

      if (i === (len - 1)) {
        // if previous object is array and key is index
        if (isArray(result) && !isNaN(keyValue)) {
          return assign(result.objectAt(keys[i]), value);
        } else {
          return set(result, keys[i], value);
        }
      } else if (isArray(result) && !isNaN(keyValue)) {
        result = result.objectAt(keys[i]);
      } else {
        result = result.get(keys[i]);
      }
    }
  }

  // if key is lonely - directly set value for this property
  return set(source, keys[0] || keyName, value);
};

export {
  setRecord
};
