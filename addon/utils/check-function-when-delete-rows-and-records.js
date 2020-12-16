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
    let possiblePromise = Ember.RSVP.resolve();

    if (confirmDeleteRowsFunction) {
      Ember.assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRowsFunction === 'function');
      possiblePromise = confirmDeleteRowsFunction();
      possiblePromise = (possiblePromise && (possiblePromise instanceof Ember.RSVP.Promise)) ? possiblePromise : null;
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
  let possiblePromise = Ember.RSVP.resolve();

  if (beforeDeleteRecordFunction) {
    Ember.assert('Error: beforeDeleteRecord must be a function', typeof beforeDeleteRecordFunction === 'function');
    let promis = beforeDeleteRecordFunction(record, data);
    possiblePromise = (promis && (promis instanceof Ember.RSVP.Promise)) ? promis : possiblePromise;
    possiblePromise = (data.cancel) ? null : possiblePromise;
  } 

  return possiblePromise;
};

export {
  checkConfirmDeleteRows,
  checkBeforeDeleteRecord
};
