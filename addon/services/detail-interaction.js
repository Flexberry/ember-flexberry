/**
  @module ember-flexberry
*/

import Service from '@ember/service';
import { A, isArray } from '@ember/array';

/**
  Service for interaction between agregator's and detail's forms.

  It is usually used to go after row click on {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} to corresponding child's route.

  Warning: this service should not be used outside of addon because it can lead to unpredictable side effects.

  @class DetailInterationService
  @extends Service
  @public
*/
export default Service.extend({
  /**
    Selected detail.
    Its selection triggered transition to detail's route.
    This parameter is initialized on agregator's form after click on not saved details.
    This parameter is used only on detail's new form in order to open already created not saved detail object.

    @property modelSelectedDetail
    @type Object
  */
  modelSelectedDetail: undefined,

  /**
    Current detail's agregators (stack of previous agregators in order to support detail of N-level).
    This parameter is initialized on agregator's form after click on detail.
    This parameter is used only on detail's form in order to return to proper agregator.

    @property modelCurrentAgregators
    @type Object
  */
  modelCurrentAgregators: undefined,

  /**
    Pathes to detail's agregators (stack of previous pathes in order to support detail of N-level).
    This parameter is initialized on agregator's form after click on detail.
    This parameter is used only on detail's form in order to get return url.

    @property modelCurrentAgregatorPathes
    @type Object
  */
  modelCurrentAgregatorPathes: undefined,

  /**
    Current not saved model.
    This parameter is initialized on detail's form after triggerring return to agregator's form.
    This parameter is used only on agregator's form in order to get already created not saved agregator object and not to create new instance.

    @property modelCurrentNotSaved
    @type Object
  */
  modelCurrentNotSaved: undefined,

  /**
    Last updated detail.
    This parameter is initialized on detail's form after triggerring return to agregator's form.
    This parameter is used only on agregator's form in order to undestand updated detail state.

    @property modelLastUpdatedDetail
    @type Object
  */
  modelLastUpdatedDetail: undefined,

  /**
    Flag: indicates whether to save current model before going to agregator's route.

    @property saveBeforeRouteLeave
    @type Boolean
  */
  saveBeforeRouteLeave: undefined,

  /**
    Returns a logic value showing if givven value is array and has values.

    @method hasValues
    @public

    @param {Array} currentArray Value to check if it is array and has values.
    @return {Boolean} Logic value showing if givven value is array and has values..
  */
  hasValues(currentArray) {
    return currentArray && isArray(currentArray) && currentArray.length > 0;
  },

  /**
    Pushes givven value to givven array and saves this array to givven property.

    @method pushValue
    @public

    @param {String} propertyName Name of property to save result array to.
    @param {Array} currentArray Array to add value to. If it is not array, new array will be created.
    @param {Object} value A value to add to array.
  */
  pushValue(propertyName, currentArray, value) {
    let currentPropertyValue;
    if (this.hasValues(currentArray)) {
      currentArray.push(value);
      currentPropertyValue = currentArray;
    } else {
      currentPropertyValue = A();
      currentPropertyValue.push(value);
    }

    this.set(propertyName, currentPropertyValue);
  },

  /**
    Returns the last value of array (or `undefined` if array contains no values).
    Array is kept at givven property.

    @method getLastValue
    @public

    @param {String} propertyName The name of property where array is kept.
    @return {Object} The last value of array (or `undefined` if array contains no values).
  */
  getLastValue(propertyName) {
    let currentPropertyValue = this.get(propertyName);
    if (!this.hasValues(currentPropertyValue)) {
      return undefined;
    }

    return currentPropertyValue.objectAt(currentPropertyValue.length - 1);
  }
});
