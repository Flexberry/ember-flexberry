import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
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
