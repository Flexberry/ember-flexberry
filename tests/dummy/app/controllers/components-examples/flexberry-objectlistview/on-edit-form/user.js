import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from '../../../../mixins/edit-form-controller-operations-indication';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';

export default EditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
   Route name for transition after close edit form.

   @property parentRoute
   @type String
   @default 'ember-flexberry-dummy-application-user-list'
  */
  parentRoute: 'components-examples/flexberry-objectlistview/on-edit-form',

  store: Ember.inject.service(),

  getCellComponent: null,

  perPageValues: [],

  customContent: Ember.computed('model.name', function() {
    let name = this.get('model.name');
    let builder = new QueryBuilder(this.get('store'))
      .from('ember-flexberry-dummy-suggestion')
      .selectByProjection('SuggestionL')
      .where(new StringPredicate('author.name').contains(name));
    return this.get('store').query('ember-flexberry-dummy-suggestion', builder.build());
  })
});
