import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({

  /**
    Flag indicate when component is in the hierarchical mode.

    @property inHierarchicalMode
    @type Boolean
    @default false
    @private
  */
  inHierarchicalMode: true,

  /**
    Store the attribute parent set by `hierarchyByAttribute`.

    @property _hierarchicalAttribute
    @type String
    @private
  */
  hierarchicalAttribute: 'parent',

  /**
    Current predicate to limit accessible values for olv.
    @property firstLimitType
    @type BasePredicate
    @default undefined
   */
  firstLimitType: undefined,

  /**
    Current predicate to limit accessible values for olv.
    @property secondLimitType
    @type BasePredicate
    @default undefined
   */
  secondLimitType: undefined,

  /**
    Current predicate to limit accessible values for olv.
    @property secondLimitType
    @type BasePredicate
    @default undefined
   */
  limitFunction: undefined,

  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-type-edit'
   */
  editFormRoute: 'ember-flexberry-dummy-suggestion-type-edit',

  loadCount: 0,

  actions: {
    /**
      This method set controller.limitFunction for olv window.
      @method firstLimitFunction
     */
    firstLimitFunction() {
      this.set('limitFunction', this.get('firstLimitType'));
      this.send('refreshModel');
    },

    /**
      This method set controller.limitFunction for olv window.
      @method secondLimitFunction
     */
    secondLimitFunction() {
      this.set('limitFunction', this.get('secondLimitType'));
      this.send('refreshModel');
    },

    /**
      This method set controller.limitFunction for olv window.
      @method clearLimitFunction
     */
    clearLimitFunction() {
      this.set('limitFunction', undefined);
      this.send('refreshModel');
    }
  }
});
