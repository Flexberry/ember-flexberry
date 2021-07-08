import EditFormController from 'ember-flexberry/controllers/edit-form';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';

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

    @property limitType
    @type BasePredicate
    @default undefined
   */
  limitType: undefined,

  actions: {

    /**
      This method set dynamicProperties.lookupLimitPredicate for lookup window.

      @method limitFunction
     */
    limitFunction() {
      let currentLookupValue = this.get('limitType');
      let limitFunction = new StringPredicate('name').contains(currentLookupValue);
      this.set('dynamicProperties.lookupLimitPredicate', limitFunction);
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
    this.set('limitType', this.get('controller.limitType'));
  }
});
