/**
 * @module ember-flexberry
 */

import OlvInputCellComponent from 'ember-flexberry/components/object-list-view-input-cell';

export default OlvInputCellComponent.extend({
  actions: {
    fileChange: function(options) {
      this.get('record').set(this.get('column.propName'), options.value);
    }
  }
});
