//import Ember from 'ember';
import EditFormRoute from 'ember-flexberry/routes/edit-form';

//import { Query } from 'ember-flexberry-data';
//const { Builder } = Query;

export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionE'
   */
  modelProjection: 'SuggestionE',

  /**
  For default userSetting use empty name ('').
  <componentName> may contain any of properties: colsOrder, sorting, colsWidth or being empty.

  @property developerUserSettings
  @type Object
  @default {}
  */

  // developerUserSettings: { listOnEditform: { } },

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion',

  /** Get a list of all the detailes suggestion-type */
  getListLocalizedSuggestionType(modelName, modelProjection) {
    return this._super(...arguments)
    .then((model) => {
      let builder = new Builder(this.get('store'))
        .from(modelName)
        .selectByProjection(modelProjection)
        .where(relation, FilterOperator.Eq, key);

      let types = this.get('store').query(modelName, builder.build());
      return Ember.RSVP.hash({ base: model, types });
    });
  },

  setupController(controller, { base, types }) {
    this._super(controller, base);
    controller.set('types', types);
  }

});
