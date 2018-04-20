import EditFormController from 'ember-flexberry/controllers/edit-form';
import { Query } from 'ember-flexberry-data';

const { StringPredicate } = Query;

export default EditFormController.extend({
  /**
    Object containing dynamic properties that must be assigned to
    component using {{#crossLink "DynamicPropertiesMixin"}}dynamic-properties mixin{{/crossLink}}.

    @property dynamicProperties
    @type Object
    @default undefined
  */
  dynamicProperties: undefined,

  /**
    Current predicate to limit accessible values for lookup.

    @property firstLimitType
    @type BasePredicate
    @default undefined
   */
  firstLimitType: undefined,

  /**
    Current predicate to limit accessible values for lookup.

    @property secondLimitType
    @type BasePredicate
    @default undefined
   */
  secondLimitType: undefined,

  lookupCustomLimitPredicate: undefined,

  actions: {

    /**
      This method set dynamicProperties.lookupLimitPredicate for lookup window.

      @method firstLimitFunction
     */
    firstLimitFunction() {
      let currentLookupValue = this.get('firstLimitType');
      let limitFunction = new StringPredicate('name').contains(currentLookupValue);
      this.set('dynamicProperties.lookupLimitPredicate', limitFunction);
    },

    /**
      This method set dynamicProperties.lookupLimitPredicate for lookup window.

      @method secondLimitFunction
     */
    secondLimitFunction() {
      let currentLookupValue = this.get('secondLimitType');
      let limitFunction = new StringPredicate('name').contains(currentLookupValue);
      this.set('dynamicProperties.lookupLimitPredicate', limitFunction);
    },

    /**
      This method set dynamicProperties.lookupLimitPredicate for lookup window.

      @method clearLimitFunction
     */
    clearLimitFunction() {
      this.set('dynamicProperties.lookupLimitPredicate', undefined);
    }
  },

  /**
    Set limit accessible values for lookup.

    @method init
   */
  init() {
    this._super(...arguments);
    this.set('dynamicProperties',
    {
      lookupLimitPredicate: null
    });
    this.set('firstLimitType', this.get('controller.firstLimitType'));
    this.set('secondLimitType', this.get('controller.secondLimitType'));
  }
});
