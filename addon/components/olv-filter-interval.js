import { on } from '@ember/object/evented';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';
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
    let valueSplit = (this.get('value') || '').toString().split(this.get('separator'));
    let from = valueSplit[0] || '';
    let to = valueSplit[1] || '';
    if (this.get('componentName') === 'flexberry-simpledatetime') {
      from = moment(from).toDate();
      to = moment(to).toDate();
    }
  
    this.set('from', from);
    this.set('to', to);
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

  fromChanged: on('init', observer('from', function() {
    once(this, 'valueSetter');
  })),

  toChanged: on('init', observer('to', function() {
    once(this, 'valueSetter');
  })),

  /**
   * Sets value with format '{from}{separator}{to}'
   */
  valueSetter: observer('value', function () {
    let from = this.get('from') || '';
    let to = this.get('to') || '';
    let separator = this.get('separator');
    const value = this.get('value');

    if (!value && !isNaN(from) && !isNaN(to)) {
      this.set('from', null);
      this.set('to', null);
      separator = '';
    }

    this.set('value', from + separator + to);
  }),
});
