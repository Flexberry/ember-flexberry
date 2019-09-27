/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { isNone } from '@ember/utils';
import $ from 'jquery';
import { A } from '@ember/array';
import ListParameters from '../objects/list-parameters';
import serializeSortingParam from '../utils/serialize-sorting-param';

import { ComplexPredicate } from 'ember-flexberry-data/query/predicate';
import { Condition } from 'ember-flexberry-data/query/condition';

export default Mixin.create({
  /**
    Settings for all lists on form.

    @property multiListSettings
    @type Object
  */
  multiListSettings: undefined,

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEvents
    @type Service
  */
  objectlistviewEvents: service(),

  /**
    Service for managing advLimits for lists.

    @property advLimit
    @type AdvLimitService
  */
  advLimit: service(),

  init() {
    this._super(...arguments);

    this.set('multiListSettings', {});
  },

  setupController: function(controller) {
    this._super(...arguments);

    let multiListSettings = this.get('multiListSettings');
    for (let componentName in multiListSettings) {
      let settings = get(multiListSettings, `${componentName}`);
      let modelClass = this.store.modelFor(settings.get('modelName'));
      let proj = modelClass.projections.get(settings.get('projectionName'));
      settings.set('modelProjection', proj);
      let predicate = this.objectListViewLimitPredicate({
        modelName: settings.get('modelName'),
        projectionName: settings.get('projectionName'),
        params: settings
      });
      settings.set('predicate', predicate);
    }

    controller.set('multiListSettings', multiListSettings);
    controller.set('error', undefined);
    controller.set('userSettings', this.userSettings);
    controller.set('developerUserSettings', this.get('developerUserSettings'));
    controller.set('_filtersPredicate', this.get('_filtersPredicate').bind(this));
    if (isNone(controller.get('defaultDeveloperUserSettings'))) {
      controller.set('defaultDeveloperUserSettings', $.extend(true, {}, this.get('developerUserSettings')));
    }

    this.get('objectlistviewEvents').on('refreshListOnly', this, this._reloadListByName);
  },

  resetController: function() {
    this._super(...arguments);

    this.get('objectlistviewEvents').off('refreshListOnly', this, this._reloadListByName);
  },

  /**
    Sets sorting and reload component content by component name.

    @method setSorting
    @param {String} componentName Component name.
    @param {Array} sorting Sorting object.
  */
  setSorting(componentName, sorting) {
    let settings = this.get(`multiListSettings.${componentName}`);
    if (!isNone(settings)) {
      let sort = serializeSortingParam(A(sorting));
      settings.set('sorting', sorting);
      settings.set('model.sorting', sorting);
      settings.set('sort', sort);
      this.send('reloadListByName', componentName);
    }
  },

  actions: {
    /**
      Reload list's data by name.

      @method actions.reloadListByName
      @param {String} componentName Component name.
    */
    reloadListByName(componentName) {
      this.get('appState').loading();
      let queryParameters = new ListParameters(this.get(`multiListSettings.${componentName}`));
      queryParameters.set('filters', this._filtersPredicate(componentName));
      if (!queryParameters.get('inHierarchicalMode')) {
        queryParameters.set('hierarchicalAttribute', null);
      }

      const advLimitService = this.get('advLimit');
      const advLimit = advLimitService.getCurrentAdvLimit(componentName);
      queryParameters.set('advLimit', advLimit);

      this.reloadList(queryParameters).then(result => {
        let controller = this.get('controller');
        if (this.get('updateModelOnListReload')) {
          controller.set(`model.${componentName}`, result);
        }

        let settings = controller.get(`multiListSettings.${componentName}`);
        settings.set('model', result);
        settings.set('model.sorting', settings.get('sorting'));
      }, this).finally(() => {
        this.get('appState').reset();
      }, this);
    },
  },

  /**
    Return predicate for `QueryBuilder` or `undefined`.

    @method _filtersPredicate
    @param {String} componentName Component name.
    @return {BasePredicate|undefined} Predicate for `QueryBuilder` or `undefined`.
    @private
  */
  _filtersPredicate(componentName) {
    let filters = this.get(`multiListSettings.${componentName}.filters`);
    if (filters) {
      let predicates = A();
      for (let filter in filters) {
        if (filters.hasOwnProperty(filter)) {
          let predicate = this.predicateForFilter(filters[filter], componentName);
          if (predicate) {
            predicates.pushObject(predicate);
          }
        }
      }

      return predicates.length ? predicates.length > 1 ? new ComplexPredicate(Condition.And, ...predicates) : predicates[0] : undefined;
    }

    return undefined;
  },

  /**
    Reloads list's data by name.

    @method _reloadListByName
    @param {String} componentName Component name.
    @private
  */
  _reloadListByName(componentName) {
    this.send('reloadListByName', componentName);
  }
});
