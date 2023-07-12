import { getOwner } from '@ember/application';
import { isNone } from '@ember/utils';

/**
  @module ember-flexberry
*/

/**
  Return available conditions for filter.

  @method defaultConditionsByType
  @param {String} type
  @return {Array} Available conditions for filter.
*/
export default function defaultConditionsByType(type, i18n) {
  let owner =  this != undefined ? getOwner(this) : getOwner(i18n);

  switch (type) {
    case 'file':
      return null;

    case 'date':
      return {
        'eq': i18n.t('components.object-list-view.filters.eq'),
        'neq': i18n.t('components.object-list-view.filters.neq'),
        'le': i18n.t('components.object-list-view.filters.le'),
        'ge': i18n.t('components.object-list-view.filters.ge'),
      };
    case 'number':
    case 'decimal':
      return {
        'eq': i18n.t('components.object-list-view.filters.eq'),
        'neq': i18n.t('components.object-list-view.filters.neq'),
        'le': i18n.t('components.object-list-view.filters.le'),
        'ge': i18n.t('components.object-list-view.filters.ge'),
        'between': i18n.t('components.object-list-view.filters.between'),
      };
    case 'string':
      return {
        'eq': i18n.t('components.object-list-view.filters.eq'),
        'neq': i18n.t('components.object-list-view.filters.neq'),
        'like': i18n.t('components.object-list-view.filters.like'),
        'nlike': i18n.t('components.object-list-view.filters.nlike')
      };

    case 'boolean':
      return {
        'eq': i18n.t('components.object-list-view.filters.eq'),
        'neq': i18n.t('components.object-list-view.filters.neq'),
        'nempty': i18n.t('components.object-list-view.filters.nempty'),
        'empty': i18n.t('components.object-list-view.filters.empty'),
      };

    default: {
      let transformInstance = owner.lookup('transform:' + type);
      let transformClass = !isNone(transformInstance) ? transformInstance.constructor : null;

      if (transformClass?.conditionsForFilter) {
        return transformClass.conditionsForFilter();
      }

      return {
        'eq': i18n.t('components.object-list-view.filters.eq'),
        'neq': i18n.t('components.object-list-view.filters.neq')
      };
    }
  }
}