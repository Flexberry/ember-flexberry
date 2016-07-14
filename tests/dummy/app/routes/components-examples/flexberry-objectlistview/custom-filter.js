import ListFormRoute from 'ember-flexberry/routes/list-form';

import { SimplePredicate, StringPredicate } from 'ember-flexberry-data/query/predicate';

export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ApplicationUserL'
   */
  modelProjection: 'ApplicationUserL',

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-application-user'
   */
  modelName: 'ember-flexberry-dummy-application-user',

  predicateForFilter(filter) {
    if (filter.type === 'string' && filter.condition === 'like') {
      return new StringPredicate(filter.name).contains(filter.pattern);
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
});
