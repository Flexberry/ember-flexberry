import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({

  /**
    Model projection for 'flexberry-objectlistview' component 'modelProjection' property.

    @property projection
    @type Object
   */
  projection: 'SuggestionE',

  /**
    Name of related edit form route (for 'flexberry-objectlistview' component 'editFormRoute' property).

    @property editFormRoute
    @type String
   */
  editFormRoute: 'ember-flexberry-dummy-suggestion-edit',


  /**
    Cout of list loading.

    @property loadCount
    @type Int
  */
  loadCount: 0,

  immediateDelete: true
});
