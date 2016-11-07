import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from '../../../../mixins/edit-form-controller-operations-indication';

import { Query } from 'ember-flexberry-data';

const { Builder, StringPredicate } = Query;

export default EditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
   Route name for transition after close edit form.

   @property parentRoute
   @type String
   @default 'ember-flexberry-dummy-application-user-list'
  */
  parentRoute: 'components-examples/flexberry-simpleolv/on-edit-form',

  store: Ember.inject.service(),

  getCellComponent: null,

  perPageValues: [],

  customContent: Ember.computed('model.name', function() {
    let name = this.get('model.name');
    let builder = new Builder(this.get('store'))
      .from('ember-flexberry-dummy-suggestion')
      .selectByProjection('SuggestionL')
      .where(new StringPredicate('author.name').contains(name));
    return this.get('store').query('ember-flexberry-dummy-suggestion', builder.build());
  })
});
