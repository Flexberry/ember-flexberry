import Controller from '@ember/controller';
import $ from 'jquery';
import config from '../../config/environment';
import { Query } from 'ember-flexberry-data';
import getSerializedDateValue from 'ember-flexberry-data/utils/get-serialized-date-value';
const { Builder } = Query;

export default Controller.extend({
  logRecordsTotalCount: 0,
  logRecordsOlderDate: null,
  logRecordsOlderDateCount: 0,
  queryInExecutingState: false,
  getCounts() {
    let _this = this;
    this.set('queryInExecutingState', true);
    let modelName = 'i-i-s-caseberry-logging-objects-application-log';
    let builder = new Builder(this.store, modelName)
      .top(1)
      .count();
    this.store.query(modelName, builder.build()).then((data) => {
      _this.set('logRecordsTotalCount', data.meta.count);
      if (_this.logRecordsOlderDate) {
        builder = new Builder(this.store, modelName)
          .top(1)
          .where('timestamp', Query.FilterOperator.Leq, _this.logRecordsOlderDate)
          .count();
        this.store.query(modelName, builder.build()).then((data) => {
          _this.set('logRecordsOlderDateCount', data.meta.count);
          this.set('queryInExecutingState', false);
        });
      } else {
        this.set('queryInExecutingState', false);
      }
    });
  },
  actions: {
    getCounts() {
      this.getCounts();
    },
    clearLogRecords() {
      let _this = this;
      this.set('queryInExecutingState', true);
      let date  = _this.logRecordsOlderDate;
      if (!date) {
        date = new Date();
      }

      let stringedDate = getSerializedDateValue.call(_this, date);
      stringedDate = stringedDate.substring(0, stringedDate.indexOf('T'));

      $.ajax({
        type: 'GET',
        url: `${config.APP.backendUrls.api}/ClearLogRecords(dateTime='${stringedDate}')`,
        /* eslint-disable no-unused-vars */
        success(result) {
          _this.set('queryInExecutingState', false);
          _this.getCounts();
        },
        /* eslint-enable no-unused-vars */
        error(xhr, textStatus, errorThrown) {
          _this.set('queryInExecutingState', false);
          window.alert(`${textStatus} ${errorThrown} Please check browser error console.`);
        },
      });
    }
  }
});
