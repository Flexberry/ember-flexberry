import OdataAdapter from 'ember-flexberry-data/adapters/odata';
import AdapterMixin from 'ember-flexberry-data/mixins/adapter';
import ODataQueryAdapter from 'ember-flexberry-data/query/odata-adapter';
import { isNone } from '@ember/utils';
import config from 'dummy/config/environment';

export default OdataAdapter.extend(AdapterMixin, {
  host: config.APP.backendUrls.api,

  deleteAllRecords(store, modelName, filter) {
    if (!this.store) {
      this.store = store;
    }

    let url = this._buildURL(modelName);
    let pathName = this.pathForType(modelName);
    let builder = new ODataQueryAdapter(url, store);
    let filterValue = builder._buildODataFilters(filter);
    let filterQuery = !isNone(filterValue) ? '$filter=' + filterValue : '';
    let data = { pathName: pathName, filterQuery: filterQuery };

    return this.callAction('DeleteAllSelect', data, null, {});
  },
});