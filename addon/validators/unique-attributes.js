import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import BaseValidator from 'ember-cp-validations/validators/base';
import { SimplePredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import QueryBuilder from 'ember-flexberry-data/query/builder';

const uniqueAttributes = BaseValidator.extend({
  store: service(),

  validate(value, options, model, attribute) {
    // суть: запрос к серверу на уникальность сочетания полей.
    let secondProp = get(options, 'secondProperty'); 
    let errorMessage = get(options, 'message');
    let secondValue = get(model, secondProp);
    let modelName = get(options, 'modelName');
    let thisStore = get(this, 'store');

    if (isEmpty(modelName)) {
      modelName = model._internalModel.name;
    }

    if (isEmpty(modelName)) {
      modelName = model._internalModel.modelName;
    }

    if (!isEmpty(value) && !isEmpty(secondValue)) {
      let limitPredicate = new ComplexPredicate(Condition.And,
        new SimplePredicate(attribute, FilterOperator.Eq, value),
        new SimplePredicate(secondProp, FilterOperator.Eq, secondValue));
      let builder = new QueryBuilder(thisStore)
        .from(modelName)
        .selectByProjection(options.view)
        .where(limitPredicate);

      return thisStore.query(modelName, builder.build()).then((result) => {
        if (get(result, 'length') > 0) {
          return errorMessage;
        }
        else {
          return true;
        }
      }).catch(() => {
        return `${get(model, 'i18n').t('validations.server-side-validation-error')}`;
      });
    }

    return true;
  },
});

uniqueAttributes.reopenClass({
  /**
   * Define attribute specific dependent keys for your validator
   *
   * [
   * 	`model.array.@each.${attribute}` --> Dependent is created on the model's context
   * 	`${attribute}.isValid` --> Dependent is created on the `model.validations.attrs` context
   * ]
   *
   * @returns {Array}
   */
  getDependentsFor(_attribute, options) {
    let secondProp = get(options, 'secondProperty');

    if (!isEmpty(secondProp)) {
        return [`model.${secondProp}`];
    }

    return [];
  }
});

export default uniqueAttributes;