import ListFormRoute from 'ember-flexberry/routes/list-form';

import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';
import { DatePredicate } from 'ember-flexberry-data/query/predicate';

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

  predicateForFilter(filter) {
    if (filter.type === 'string' && filter.condition === 'like') {
      return new StringPredicate(filter.name).contains(filter.pattern);
    }

    if (filter.type === 'string' && filter.condition === 'empty') {
      return new SimplePredicate(filter.name, 'eq', null);
    }

    if (filter.type === 'decimal') {
      return new SimplePredicate(filter.name, filter.condition, filter.pattern ? Number(filter.pattern) : filter.pattern);
    }

    if (filter.type === 'date') {
      return new DatePredicate(filter.name, filter.condition, filter.pattern, true);
    }

    return this._super(...arguments);
  },

  predicateForAttribute(attribute, filter) {
    switch (attribute.type) {
      case 'boolean': {
        let yes = ['TRUE', 'True', 'true', 'YES', 'Yes', 'yes', 'ДА', 'Да', 'да', '1', '+'];
        let no = ['False', 'False', 'false', 'NO', 'No', 'no', 'НЕТ', 'Нет', 'нет', '0', '-'];

        if (yes.indexOf(filter) > 0) {
          return new SimplePredicate(attribute.name, 'eq', 'true');
        }

        if (no.indexOf(filter) > 0) {
          return new SimplePredicate(attribute.name, 'eq', 'false');
        }

        return null;
      }

      default: {
        return this._super(...arguments);
      }
    }
  },

  /**
    This method will be invoked always when load operation completed,
    regardless of load promise's state (was it fulfilled or rejected).

    @method onModelLoadingAlways.
    @param {Object} data Data about completed load operation.
   */
  /* eslint-disable no-unused-vars */
  onModelLoadingAlways(data) {
    let loadCount = this.get('controller.loadCount') + 1;
    this.set('controller.loadCount', loadCount);
  },
  /* eslint-enable no-unused-vars */
});
