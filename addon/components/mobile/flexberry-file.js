/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryFile from './../flexberry-file';

/**
 * Mobile version of flexberry-file (with mobile-specific defaults).
 */
export default FlexberryFile.extend({
  /**
   * Flag: indicates whether to use single column to display all model properties or not.
   *
   * @property useSingleColumn
   * @type Boolean
   * @default false
   */
  addButtonText: '',

  /**
   * Init control, set current text for add file button.
   *
   * @method init
   * @public
   */
  init: function() {
    this._super(...arguments);
    var i18n = this.get('i18n');
    let currentName = this.get('addButtonText');
    if (!currentName) {
      this.set('addButtonText', i18n.t('flexberry-file.add-btn-text'));
    }

    // TODO: move to base mobile component.
    let currentClasses = this.get('classNames');
    if (currentClasses && Ember.isArray(currentClasses) && currentClasses.length > 0) {
      currentClasses.push('mobile');
    } else {
      currentClasses = ['mobile'];
    }

    this.set('classNames', currentClasses);
  }
});
