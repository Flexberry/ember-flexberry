import ListFormRoute from 'ember-flexberry/routes/list-form';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import {SimplePredicate, StringPredicate} from 'ember-flexberry-data/query/predicate';
import GenderEnum from '../enums/ember-flexberry-dummy-gender';


export default ListFormRoute.extend({
  /**
   * Name of model projection to be used as record's properties limitation.
   *
   * @property modelProjection
   * @type String
   * @default 'ApplicationUserL'
   */
  modelProjection: 'ApplicationUserL',

  /**
   * Name of model to be used as list's records types.
   *
   * @property modelName
   * @type String
   * @default 'ember-flexberry-dummy-application-user'
   */
  modelName: 'ember-flexberry-dummy-application-user',

  objectListViewLimitPredicate: function(options) {
    // должно быть так http://www.odata.org/getting-started/basic-tutorial/
    //var asd = new StringPredicate('gender').contains('Male');
    //var asd = new SimplePredicate('gender', FilterOperator.Eq, '%Male%');
    var asd = new SimplePredicate('gender', FilterOperator.Eq, 'Microsoft.OData.ember-flexberry.ember-flexberry-dummy-application-user.ember-flexberry-dummy-gender'+'%Male%');
    return asd
  }

});
