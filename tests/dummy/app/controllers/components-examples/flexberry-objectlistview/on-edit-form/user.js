import Ember from 'ember';
import BaseEditFormController from '../../../base-edit-form';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';

export default BaseEditFormController.extend({
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
      .where(new StringPredicate('Author/Name').contains(name));
    return this.get('store').query('ember-flexberry-dummy-suggestion', builder.build());
  })
});
