import Ember from 'ember';
import { get, set } from '@ember/object';
import BaseValidator from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';
import Builder from 'ember-flexberry-data/query/builder';
import Condition from 'ember-flexberry-data/query/condition';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { SimplePredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

const uniqueAttributes = BaseValidator.extend({
  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {
    this._super(...arguments);
    if (this.options === true) {
      set(this, 'options', { allowBlank: false });
    }

    if (this.options.messages === undefined) {
      set(this, 'options.messages', {});
    }

    if (this.options.messages.blank === undefined) {
      this.options.messages.blank = Messages.render('blank', this.options);
    }

    if (this.options.messages.invalid === undefined) {
      this.options.messages.invalid = Messages.render('invalid', this.options);
    }
  },

  call() {
    // суть: запрос к серверу на уникальность сочетания полей
    let value = get(this.model, this.property);
    let secondProp = get(this.options, 'secondProperty');
    let errorMessage = get(this.options, 'message');
    let secondValue = get(this.model, secondProp);
    let modelName = get(this.options, 'modelName');
    let thisStore = get(this, 'store');

    if (Ember.isEmpty(modelName)) {
      modelName = this.model._internalModel.name;
    }

    if (Ember.isEmpty(modelName)) {
      modelName = this.model._internalModel.modelName;
    }

    if (!Ember.isEmpty(value) && !Ember.isEmpty(secondValue)) {
      let limitPredicate = new ComplexPredicate(Condition.And,
        new SimplePredicate(this.property, FilterOperator.Eq, value),
        new SimplePredicate(secondProp, FilterOperator.Eq, secondValue))
      let builder = new Builder(thisStore)
        .from(modelName)
        .selectByProjection(this.options.view)
        .where(limitPredicate);

      return thisStore.query(modelName, builder.build()).then((result) => {
        if (get(result, 'length') > 0) {
          return this.errors.pushObject(errorMessage);
        }
        else {
          return true;
        }
      }).catch(() => {
        return this.errors.pushObject(`${get(this.model, 'i18n').t('validations.server-side-validation-error')}`);
      });
    }
  }
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

    if (!Ember.isEmpty(secondProp)) {
        return [`model.${secondProp}`];
    }

    return [];
  }
});

export default uniqueAttributes;
