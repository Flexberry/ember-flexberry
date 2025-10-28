import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';
import moment from 'moment';

const { get, set, observer, setProperties } = Ember;

export default FlexberryBaseComponent.extend({

  /**
    Overload wrapper tag name for disabling wrapper.
  */
  tagName: '',

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

    const [fromRaw = '', toRaw = ''] = (get(this, 'value') || '').toString().split(get(this, 'separator'));
    const isDate = get(this, 'componentName') === 'flexberry-simpledatetime';

    const parse = (val) => {
      if (!val) return null;
      if (!isDate) return val;
      const m = moment(val);
      return m.isValid() ? m.toDate() : null;
    };

    setProperties(this, {
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
      set(this, 'from', null);
    },
    clearTo() {
      set(this, 'to', null);
    }
  },

  /**
   * Sets value with format '{from}{separator}{to}'
   */
  valueSetter: observer('from', 'to', 'value', function () {
    let from = get(this, 'from') || '';
    let to = get(this, 'to') || '';
    let separator = get(this, 'separator');
    set(this, 'value', from + separator + to);
  }),
});
