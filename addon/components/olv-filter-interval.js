import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';
const { observer } = Ember;
import moment from 'moment';


export default FlexberryBaseComponent.extend({
  classNames: ['two fields'],

  /**
   * Start of interval
   * @type {*}
   */
  from: null,

  /**
   * End of interval
   * @type {*}
   */
  to: null,

  /**
   * Components to be rendered in from/to blocks
   */
  componentName: 'flexberry-textbox',

  /**
   * DynamicProperties for from/to components
   */
  dynProps: null,

  /**
    An overridable method called when objects are instantiated.
    For more information see {{#crossLink "FlexberryBaseComponent/init:method"}}init method{{/crossLink}}
    of {{#crossLink "FlexberryBaseComponent"}}{{/crossLink}}.

    @method init
  */
  init() {
    this._super(...arguments);

    const [fromRaw = '', toRaw = ''] = (this.get('value') || '').toString().split(this.get('separator'));
    const isDate = this.get('componentName') === 'flexberry-simpledatetime';

    const parse = (val) => {
      if (!val) return null;
      if (!isDate) return val;
      const m = moment(val);
      return m.isValid() ? m.toDate() : null;
    };

    this.setProperties({
      from: parse(fromRaw),
      to: parse(toRaw)
    });
  },

  /**
   * Start of interval placeholder
   * @type {string}
   */
  fromPlaceholder: t('components.olv-filter-interval.from'),

  /**
   * End of interval placeholder
   * @type {string}
   */
  toPlaceholder: t('components.olv-filter-interval.to'),

  /**
   * Separator used for value
   * @type {string}
   */
  separator: '|',

  actions: {
    clearFrom() {
      this.set('from', null);
    },
    clearTo() {
      this.set('to', null);
    }
  },
  
  /**
   * Sets value with format '{from}{separator}{to}'
   */
  valueSetter: observer('from', 'to', 'value', function () {
    let from = this.get('from') || '';
    let to = this.get('to') || '';
    let separator = this.get('separator');
    this.set('value', from + separator + to);
  }),

  filterIntervalStyle: Ember.computed('dynProps.type', function() {
    let dynPropsType = this.get('dynProps.type');
    let dateStyle = 'flex-direction: row; gap: 8px; width: 100%; align-items: center"';
    if (dynPropsType === 'date') {
      dateStyle = "flex-direction: column; gap: 6px; width: 100%; align-items: stretch;";
    }

    return Ember.String.htmlSafe(`display:flex; ${dateStyle}`);
  }),
});
