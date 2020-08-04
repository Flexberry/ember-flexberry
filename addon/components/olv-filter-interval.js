import { observer } from '@ember/object';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

export default FlexberryBaseComponent.extend({

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
  componentName: null,

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
    let valueSplit = (this.get('value') || '').toString().split(this.get('separator'));
    this.set('from', valueSplit[0]);
    this.set('to', valueSplit[1]);
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

  /**
   * Sets value with format '{from}{separator}{to}'
   */
  valueSetter: observer('from', 'to', 'value', function () {
    let from = this.get('from') || '';
    let to = this.get('to') || '';
    let separator = this.get('separator');
    this.set('value', from + separator + to);
  }),
});
