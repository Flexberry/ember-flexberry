import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
export default Controller.extend({
  /**
    Message to be displayed in 'ui-message' component.
  */
  message: undefined,

  /**
    Items. Type array.
  */
  itemsArray: undefined,

  /**
    Items. Type object.
  */
  itemsObject: undefined,

  value: undefined,

  /**
    Flag indicates whether use `itemsArray` or `itemsObject`.
  */
  usedArray: true,

  /**
    Current items in `flexberry-objectlistview`.
  */
  currentItems: computed('usedArray', function() {
    let usedArray = this.get('usedArray');
    let currentItems = null;

    if (usedArray) {
      currentItems = this.get('itemsArray');
    } else {
      currentItems = this.get('itemsObject');
    }

    return currentItems;
  }),

  init() {
    this._super(...arguments);
    this.set('message', new htmlSafe(
      '<pre><code>' +
      '<strong>itemsArray: </strong>' +
        '["itemsArray1", "itemsArray2", "itemsArray3"]' +
        '<br><br>' +
        '<strong>itemsObject:</strong> {<br>' +
          '  itemsObject1: "itemsObject1",<br>' +
          '  itemsObject2: "itemsObject2",<br>' +
          '  itemsObject3: "itemsObject3"<br>' +
        '}' +
      '</code></pre>'
    ));
    this.set('itemsArray', ['itemsArray1', 'itemsArray2', 'itemsArray3']);
    this.set('itemsObject', {
      itemsObject1: 'itemsObject1',
      itemsObject2: 'itemsObject2',
      itemsObject3: 'itemsObject3'
    });
  },

  actions: {
    /**
      This action is called when `flexberry-checkox` change its value.
    */
    checked() {
      let usedArray = this.get('usedArray');
      this.set('usedArray', !usedArray);
    },

    /**
      This action is called when user clicks on reset button.
    */
    resetValue() {
      this.set('value', null);
    }
  }
});
