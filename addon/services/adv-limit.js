/**
  @module ember-flexberry
*/

import Ember from 'ember';

import Builder from 'ember-flexberry-data/query/builder';
import { SimplePredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

const defaultSettingName = 'DEFAULT';

/**
  Service to store/read adv limits to/from application storage.

  @class AdvLimitService
  @extends <a href="http://emberjs.com/api/classes/Ember.Service.html">Ember.Service</a>
*/
export default Ember.Service.extend({
  /**
    Ember data store.

    @property store
    @type DS.Store
  */
  store: Ember.inject.service(),

  /**
    Flag: indicates whether to use adv limit service.
    This flag is readed from config setting `APP.isAdvLimitServiceEnabled` and can be changed programatically later.

    @property isAdvLimitServiceEnabled
    @type Boolean
    @default false
  */
  isAdvLimitServiceEnabled: false,

  /**
    Current application page name.

    @property currentAppPage
    @type String
    @default ''
  */
  currentAppPage: '',

  /**
    Adv limit model name.

    @property avdLimitModelName
    @type String
    @default 'flexberry-adv-limit'
  */
  avdLimitModelName: 'flexberry-adv-limit',

  /**
    Adv limit projection name.

    @property avdLimitProjectionName
    @type String
    @default 'AdvLimitE'
  */
  avdLimitProjectionName: 'AdvLimitE',

  /**
    Current user settings for all pages

    @property currentAdvLimits
    @type Object
    @default {}
  */
  currentAdvLimits: Ember.computed(() => { return {}; }).readOnly(),

  init() {
    this._super(...arguments);
    const appConfig = Ember.getOwner(this)._lookupFactory('config:environment');
    const useAdvLimitService = Ember.get(appConfig, 'APP.useAdvLimitService');
    if (!Ember.isNone(useAdvLimitService)) {
      this.set('isAdvLimitServiceEnabled', useAdvLimitService);
    }
  },

  /**
   Set current Web Page.

   @method setCurrentAppPage
   @param {String} pageName.
  */
  setCurrentAppPage(pageName) {
    this.set('currentAppPage', pageName);
  },

  /**
   Get current App Page.

   @method getCurrentAppPage
   @return {String}
  */
  getCurrentAppPage() {
    let currAppPage = this.get('currentAppPage');
    currAppPage = currAppPage.replace('.', '/');
    return currAppPage;
  },

  /**
    Get adv limits from store.

    @method getAdvLimitsFromStore
    @param {Array} componentNames
  */
  getAdvLimitsFromStore(componentNames) {
    if (this.get('isAdvLimitServiceEnabled')) {
      return this._getAdvLimits(componentNames).then(
        advLimits => {
          const ret = {};
          if (Ember.isArray(advLimits)) {
            advLimits.forEach(({ record }) => {
              let advLimitValue = record.get('value');
              let advLimitName = record.get('name') || defaultSettingName;
              let componentName = record.get('module').split('@')[1];

              if (advLimitValue) {
                if (!(componentName in ret)) {
                  ret[componentName] = {};
                }

                ret[componentName][advLimitName] = advLimitValue;
              }
            }, this);
          }

          return ret;
        }
      ).then(appPageAdvLimits => {
        return this._setCurrentAdvLimits(appPageAdvLimits);
      });
    }

    return Ember.RSVP.resolve(undefined);
  },

  /**
   Get list of component names.

   @method getListComponentNames
   @return {Array}
  */
  getListComponentNames() {
    const ret = Ember.A();
    const appPage = this.getCurrentAppPage();
    if (appPage in this.get('currentAdvLimits')) {
      for (let componentName in this.get(`currentAdvLimits.${appPage}`)) {
        ret.addObject(componentName);
      }
    }

    return ret;
  },

  /**
    Returns  true if adv limit for current appPage exists.

    @method exists
    @return {Boolean}
  */
  exists() {
    return this.getCurrentAppPage() in this.get('currentAdvLimits');
  },

  /**
    Returns current list of named adv limits.

    @method getNamedAdvLimits
    @param componentName
    @return {Object}
  */
  getNamedAdvLimits(componentName) {
    const ret = {};
    const currentAdvLimits = this.getCurrentAdvLimits(componentName);
    for (let settingName in currentAdvLimits) {
      if (settingName === defaultSettingName) {
        continue;
      }

      ret[settingName] = currentAdvLimits[settingName];
    }

    return ret;
  },

  /**
   Returns current adv limits for specified component.

   @method getCurrentAdvLimits
   @param {String} componentName Name of component.
   @return {Object}
  */
  getCurrentAdvLimits(componentName) {
    const currentAppPage = this.getCurrentAppPage();

    return this.get(`currentAdvLimits.${currentAppPage}.${componentName}`);
  },

  /**
   Returns current adv limit by name.

   @method getCurrentAdvLimit
   @param {String} componentName Name of component.
   @param {String} advLimitName Name of adv limit.
   @return {Object}
  */
  getCurrentAdvLimit(componentName, advLimitName = defaultSettingName) {
    const currentAppPage = this.getCurrentAppPage();

    return this.get(`currentAdvLimits.${currentAppPage}.${componentName}.${advLimitName}`);
  },

  /**
   Deletes given adv limit from storage.

   @method deleteAdvLimit
   @param {String} componentName Component name.
   @param {String} settingName Setting name.
   @return {Promise}
  */
  deleteAdvLimit(componentName, settingName = defaultSettingName) {
    Ember.assert('deleteAdvLimit:: Adv limit componentName is not defined.', componentName);
    Ember.assert('deleteAdvLimit:: Adv limit name is not defined.', settingName);

    const appPage = this.getCurrentAppPage();
    const currentAdvLimits = this.get(`currentAdvLimits.${appPage}.${componentName}`) || {};
    if (settingName in currentAdvLimits) {
      delete currentAdvLimits[settingName];
    }

    if (!this.get('isAdvLimitServiceEnabled')) {
      return Ember.RSVP.resolve(undefined);
    }

    return this._deleteExistingRecord(componentName, settingName);
  },

  /**
   Saves given adv limit to storage.

   @method saveAdvLimit
   @param {String} advLimit Adv limit data to save.
   @param {String} componentName Component name.
   @param {String} settingName Setting name.
   @return {Promise} Save operation promise.
  */
  saveAdvLimit(advLimit, componentName, settingName = defaultSettingName) {
    Ember.assert('saveAdvLimit:: componentName is not defined.', componentName);
    Ember.assert('saveAdvLimit:: Adv limit data are not defined.', !Ember.isNone(advLimit));
    Ember.assert('saveAdvLimit:: Limit name is not defined.', !Ember.isNone(settingName));

    const currentAppPage = this.getCurrentAppPage();

    if (!(this.exists())) {
      this.set(`currentAdvLimits.${currentAppPage}`, {});
    }

    if (!(componentName in this.get(`currentAdvLimits.${currentAppPage}`))) {
      this.set(`currentAdvLimits.${currentAppPage}.${componentName}`, {});
    }

    this.set(`currentAdvLimits.${currentAppPage}.${componentName}.${settingName}`, advLimit);
    if (!this.get('isAdvLimitServiceEnabled')) {
      return Ember.RSVP.resolve();
    }

    const store = this.get('store');
    return this._getExistingRecord(componentName, settingName).then(
      (foundRecord) => {
        if (!foundRecord) {
          const userService = Ember.getOwner(this).lookup('service:user');
          const currentUserName = userService.getCurrentUserName();
          foundRecord = store.createRecord(this.get('avdLimitModelName'));
          foundRecord.set('user', currentUserName);
          foundRecord.set('module', `${currentAppPage}@${componentName}`);
          foundRecord.set('name', settingName);
        }

        foundRecord.set('value', advLimit);

        return foundRecord.save();
      });
  },

  /**
    Returns  adv limits for current appPage from storage.

    @method _getAdvLimits
    @param {Array} componentNames
    @return {Object}
  */
  _getAdvLimits(componentNames) {
    if (!this.get('isAdvLimitServiceEnabled')) {
      return Ember.RSVP.resolve(Ember.A());
    }

    const promises = Ember.A();
    componentNames.forEach(componentName => {
      promises.pushObject(this._getExistingLimits(componentName));
    });

    return Ember.RSVP.all(promises).then(results => {
      const records = Ember.A();
      results.forEach(result => {
        records.addObjects(result);
      });

      return records;
    });
  },

  /**
    Sets current adv limits

    @method _setCurrentAdvLimits
    @param {Object} appPageAdvLimits Current adv limits
    @return {Object}
  */
  _setCurrentAdvLimits(appPageAdvLimits) {
    const appPage = this.getCurrentAppPage();

    let currentAdvLimits = this.get(`currentAdvLimits.${appPage}`);

    if (Ember.isNone(currentAdvLimits)) {
      currentAdvLimits = {};
      this.set(`currentAdvLimits.${appPage}`, currentAdvLimits);
    }

    for (let componentName in appPageAdvLimits) {
      currentAdvLimits[componentName] = appPageAdvLimits[componentName];
    }

    return currentAdvLimits;
  },

  /**
   Deletes adv limit record from storage.

   @method _deleteExistingRecord
   @param {Object} componentName Component name.
   @param {String} settingName Setting name.
   @return {Promise}
   @private
  */
  _deleteExistingRecord(componentName, settingName) {
    return this._getLimitFromStore(componentName, settingName).then((result) => {
      if (result) {
        const delPromises = Ember.A();
        const foundRecords = result.get('content');
        if (Ember.isArray(foundRecords) && foundRecords.length > 0) {
          foundRecords.forEach(({ record }) => {
            delPromises.addObject(record.destroyRecord());
          }, this);

          return Ember.RSVP.all(delPromises);
        }
      }

      return undefined;
    });
  },

  /**
   Looks for already created adv limit record.

   @method _getExistingRecord
   @param {Object} componentName Component name.
   @param {String} settingName Setting name.
   @return {<a href="http://emberjs.com/api/classes/RSVP.Promise.html">Promise</a>} A promise that returns founded record
   or `undefined` if there is no such setting.
   @private
  */
  _getExistingRecord(componentName, settingName) {
    return this._getLimitFromStore(componentName, settingName).then((result) => {
      if (result) {
        const foundRecords = result.get('content');
        if (Ember.isArray(foundRecords) && foundRecords.length > 0) {
          for (let i = 1; i < foundRecords.length; i++) {
            foundRecords[i].record.destroyRecord();
          }

          return foundRecords[0].record;
        }
      }

      return undefined;
    });
  },

  /**
   Looks for all created adv limits.

   @method _getExistingLimits
   @param {String} componentName Component name.
   @param {String} settingName Setting name.
   @return {Promise} A promise that returns found records or `undefined` if there is no such adv limit.
   @private
  */
  _getExistingLimits(componentName, settingName) {
    return this._getLimitFromStore(componentName, settingName).then((result) => {
      if (result) {
        let foundRecords = result.get('content');
        if (!Ember.isArray(foundRecords)) {
          foundRecords = Ember.A();
        }

        return foundRecords;
      }
    });
  },

  /**
   Gets adv limit from storage.

   @method _getLimitFromStore
   @param {String} componentName Component name.
   @param {String} settingName Setting name.
   @return {Promise} A promise that returns found records or `undefined` if there is no such adv limit.
   @private
  */
  _getLimitFromStore(componentName, settingName) {
    const searchPredicate = this._getSearchPredicate(componentName, settingName);
    const store = this.get('store');
    const avdLimitModelName = this.get('avdLimitModelName');
    const avdLimitProjectionName = this.get('avdLimitProjectionName');
    const builder = new Builder(store)
      .from(avdLimitModelName)
      .selectByProjection(avdLimitProjectionName)
      .where(searchPredicate);

    return store.query(avdLimitModelName, builder.build());
  },

  /**
   Creates predicate for adv limit.

   @method _getLimitFromStore
   @param {String} componentName Component name.
   @param {String} settingName Setting name.
   @return {Object} Predicate for adv limit.
   @private
  */
  _getSearchPredicate(componentName, settingName) {
    Ember.assert('Can\'t find adv limit for undefined componentName', !Ember.isNone(componentName));
    let searchPredicate;
    const userService = Ember.getOwner(this).lookup('service:user');
    const currentUserName = userService.getCurrentUserName();
    const p1 = new SimplePredicate('user', 'eq', currentUserName);
    const p2 = new SimplePredicate('module', 'eq', `${this.getCurrentAppPage()}@${componentName}`);
    if (!Ember.isNone(settingName)) {
      const p3 = new SimplePredicate('name', 'eq', settingName);
      searchPredicate = new ComplexPredicate('and', p1, p2, p3);
    } else {
      searchPredicate = new ComplexPredicate('and', p1, p2);
    }

    return searchPredicate;
  }
});
