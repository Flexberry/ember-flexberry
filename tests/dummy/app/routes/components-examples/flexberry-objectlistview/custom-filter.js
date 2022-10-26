import ListFormRoute from 'ember-flexberry/routes/list-form';

import { Query } from 'ember-flexberry-data';

const { SimplePredicate } = Query;

export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'FlexberryObjectlistviewCustomFilter'
  */
  modelProjection: 'FlexberryObjectlistviewCustomFilter',

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-application-user'
  */
  modelName: 'ember-flexberry-dummy-suggestion',

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
  developerUserSettings: { FOLVCustomFilterObjectListView: { } },

  excludeFromSearchColumns: [],

  /**
    A hook you can use to setup the controller for the current route.
    [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/setupController?anchor=setupController).

    @method setupController
    @param {<a href="https://emberjs.com/api/ember/release/classes/Controller">Controller</a>} controller
  */
  setupController(controller) {
    this._super(...arguments);

    controller.set('excludeFromSearchColumns', this.get('excludeFromSearchColumns'));
  },

  predicateForFilter(filter) {
    if (filter.type === 'string' && filter.condition === 'empty') {
      return new SimplePredicate(filter.name, 'eq', null);
    }

    if (filter.type === 'decimal') {
      return new SimplePredicate(filter.name, filter.condition, filter.pattern ? Number(filter.pattern) : filter.pattern);
    }

    return this._super(...arguments);
  },

  predicateForAttribute(attribute, filter) {
    switch (attribute.type) {
      case 'boolean':
        let yes = ['TRUE', 'True', 'true', 'YES', 'Yes', 'yes', 'ДА', 'Да', 'да', '1', '+'];
        let no = ['False', 'False', 'false', 'NO', 'No', 'no', 'НЕТ', 'Нет', 'нет', '0', '-'];

        if (yes.indexOf(filter) > 0) {
          return new SimplePredicate(attribute.name, 'eq', 'true');
        }

        if (no.indexOf(filter) > 0) {
          return new SimplePredicate(attribute.name, 'eq', 'false');
        }

        return null;

      default:
        return this._super(...arguments);
    }
  },

  actions: {
    updateExcludeFromSearchColumns(value) {
      this.set('excludeFromSearchColumns', value);
    }
  }
});
