/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Service for interaction between agregator's and detail's forms.
 *
 * @class DetailInterationService
 * @extends Ember.Service
 * @public
 */
export default Ember.Service.extend({
  /**
   * Selected detail.
   * Its selection triggered transition to detail's route.
   * This parameter is initialized on agregator's form after click on not saved details.
   * This parameter is used only on detail's new form in order to open already created not saved detail object.
   *
   * @property modelSelectedDetail
   * @type Object
   * @default undefined
   */
  modelSelectedDetail: undefined,

  /**
   * Current detail's agregator.
   * This parameter is initialized on agregator's form after click on detail when agregator is not saved.
   * This parameter is used only on detail's form in order to return to proper agregator not saved object.
   *
   * @property modelCurrentAgregator
   * @type Object
   * @default undefined
   */
  modelCurrentAgregator: undefined,

  /**
   * Path to detail's agregator.
   * This parameter is initialized on agregator's form after click on detail.
   * This parameter is used only on detail's form in order to get return url.
   *
   * @property modelCurrentAgregatorPath
   * @type Object
   * @default undefined
   */
  modelCurrentAgregatorPath: undefined,

  /**
   * Current not saved model.
   * This parameter is initialized on detail's form after triggerring return to agregator's form.
   * This parameter is used only on agregator's form in order to get already created not saved agregator object and not to create new instance.
   *
   * @property modelCurrentNotSaved
   * @type Object
   * @default undefined
   */
  modelCurrentNotSaved: undefined,
});
