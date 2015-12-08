import Ember from 'ember';

export default Ember.Component.extend({
  items: null,
  selectedItem: null,
  selectedIndex: -1,
  id: null,
  cssClass: null,

  actions: {
    dropDown_onSelectedItemChanged: function() {
      const htmlSelect = this.$('select')[0];
      const selectedIndex = htmlSelect.selectedIndex;
      this.set('selectedIndex', selectedIndex);

      const items = this.get('items');
      const selectedItem = items[selectedIndex];
      this.set('selectedItem', selectedItem);

      this.sendAction('action', selectedItem);
    }
  },

  didInsertElement: function() {
    const htmlSelect = this.$('select');
    const selectedItem = this.get('selectedItem');
    htmlSelect.val(selectedItem);
  }
});
