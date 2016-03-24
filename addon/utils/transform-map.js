/**
 * @module ember-flexberry
 */

/**
 Class to transform mapped data structures

 @class TransformMap
 @constructor
 **/
export default class TransformMap {

  /**
   @method constructor
   @param {Object} [map] created with `null` as prototype
   **/
  constructor(map) {
    this.map = map;
    this.keys = Object.keys(map);
    let inverse = Object.create(null);
    let captions = [];
    for (let key in map) {
      captions.push(map[key]);
      inverse[map[key]] = key;
    }

    this.captions = captions;
    this.inverse = Object.freeze(inverse);
  }

  getCaption(value) {
    return this.map[value];
  }

  getValue(caption) {
    return this.inverse[caption];
  }
}
