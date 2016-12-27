import { Query } from 'ember-flexberry-data';
import ListFormRoute from 'ember-flexberry/routes/list-form';

export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionL'
   */
  modelProjection: 'SuggestionL',

  /**
  developerUserSettings.
  {
  <componentName>: {
    <settingName>: {
        colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
        sorting: [{ propName: <colName>, direction: "asc"|"desc" }, ... ],
        colsWidths: [ <colName>:<colWidth>, ... ],
      },
      ...
    },
    ...
  }
  For default userSetting use empty name ('').
  <componentName> may contain any of properties: colsOrder, sorting, colsWidth or being empty.

  @property developerUserSettings
  @type Object
  @default {}
  */
  developerUserSettings: { FOLVSettingExampleObjectListView: { } },

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion',

  /**
    Returns model related to current route.

    @method model
   */
  model(params) {

    let store = this.get('store');

    let query = new Query.Builder(store)
      .from('ember-flexberry-dummy-suggestion')
      .selectByProjection('SuggestionE');

    let list;
    return this._super(...arguments).then((data) => {
      list = data;
      return store.query('ember-flexberry-dummy-suggestion', query.build());
    }).then((limitdata) => {
      let limitTypesArr = limitdata.toArray();
      this.set('configurateRowByAddress', limitTypesArr.objectAt(0).get('address'));

      if (this.get('reloadColl') === 1)
      {
        this.refresh();
      }

      return list;
    });
  },

  /**
    Load strings coloring condition in settigs.

    @method setupController
   */
  setupController() {
    this._super(...arguments);

    this.set('controller.configurateRowByAddress', this.get('configurateRowByAddress'));
  }
});
