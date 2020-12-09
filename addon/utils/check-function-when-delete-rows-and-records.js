/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Used for check confirm delete rows function and get result. 

  @method checkConfirmDeleteRows
  @param {Function} confirmDeleteRowsFunction confirm function 
  @return {RSVP.Promise} Retriveved object from path
*/
let checkConfirmDeleteRows = function (confirmDeleteRowsFunction) {
    let possiblePromise = null;

    if (confirmDeleteRowsFunction) {
      Ember.assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRowsFunction === 'function');
      possiblePromise = confirmDeleteRowsFunction();
      possiblePromise = (possiblePromise instanceof Ember.RSVP.Promise) ? possiblePromise : null;
    } else {
      possiblePromise = Ember.RSVP.resolve();
    }

    return possiblePromise;
};

/**
  Used for check before delete record function and get result.

  @method checkBeforeDeleteRecord
  @param {Function} beforeDeleteRecordFunction before function
  @param {DS.Model} record A record to delete
  @param {Object} data Data object
  @return {RSVP.Promise} Retriveved object from path
*/
let checkBeforeDeleteRecord = function (beforeDeleteRecordFunction, record, data) {
  let possiblePromise = null;

  if (beforeDeleteRecordFunction) {
    Ember.assert('Error: beforeDeleteRecord must be a function', typeof beforeDeleteRecord === 'function');
    possiblePromise = beforeDeleteRecordFunction(record, data);
    possiblePromise = (possiblePromise instanceof Ember.RSVP.Promise && !data.cancel) ? possiblePromise : null;
  } else {
    possiblePromise = Ember.RSVP.resolve();
  }

  return possiblePromise;
};

export {
  checkConfirmDeleteRows,
  checkBeforeDeleteRecord
};
