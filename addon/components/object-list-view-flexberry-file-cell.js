/**
 * @module ember-flexberry
 */

import OlvCellComponent from 'ember-flexberry/components/object-list-view-cell';

export default OlvCellComponent.extend({
  actions: {
    fileChange: function(options) {
      this.get('record').set(this.get('column.propName'), options.value);
    }
  }
});
