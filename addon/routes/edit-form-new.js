/**
  @module ember-flexberry
 */

import { assert } from '@ember/debug';
import EditFormRoute from './edit-form';

/**
  Base route for the Create Forms.

  Example:
  ```javascript
  // app/routes/employee/new.js
  import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
  export default EditFormNewRoute.extend({
  });
  ```

  @class EditFormNewRoute
  @extends EditFormRoute
 */
export default EditFormRoute.extend({
  /**
    Suffix for new route (has value only on new routes).

    @property newSuffix
    @type String
   */
  newSuffix: '.new',

  /**
    A hook you can implement to convert the URL into the model for this route.
    [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/model?anchor=model).

    @method model
    @param {Object} params
    @param {Object} transition
   */
  model(params, transition) {
    let flexberryDetailInteractionService = this.get('flexberryDetailInteractionService');
    let modelCurrentNotSaved = flexberryDetailInteractionService.get('modelCurrentNotSaved');
    let modelSelectedDetail = flexberryDetailInteractionService.get('modelSelectedDetail');
    flexberryDetailInteractionService.set('modelCurrentNotSaved', undefined);
    flexberryDetailInteractionService.set('modelSelectedDetail', undefined);

    if (modelCurrentNotSaved) {
      return modelCurrentNotSaved;
    }

    if (modelSelectedDetail) {
      return modelSelectedDetail;
    }

    // NOTE: record.id is null.
    let modelName = transition.queryParams.modelName || this.modelName;
    let record = this.store.createRecord(modelName);
    return record;
  },

  /**
    A hook you can use to render the template for the current route.
    [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/renderTemplate?anchor=renderTemplate).

    @method renderTemplate
    @param {Object} controller
    @param {Object} model
   */
  renderTemplate(controller, model) {
    var templateName = this.get('templateName');
    assert('Template name must be defined.', templateName);
    this.render(templateName, {
      model,
      controller,
    });
  },
});
