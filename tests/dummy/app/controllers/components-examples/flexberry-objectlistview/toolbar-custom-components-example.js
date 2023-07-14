import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  /**
    Name of related edit form route (for 'flexberry-objectlistview' component 'editFormRoute' property).

    @property editFormRoute
    @type String
  */
  editFormRoute: 'ember-flexberry-dummy-suggestion-edit',

  /**
    The value in the dropdown list.

    @property dropdownValue
    @type String
  */
  dropdownValue: null,

  /**
    Items in the dropdown list.

    @property dropdownItems
    @type Object
  */
  dropdownItems: null,

  /**
    Method that is called when a value in the dropdown list changes.

    @method onChange.
    @param {String} value Selected value in the drop-down list .
  */
  onChange: function(value) {
    this.set('dropdownValue', value);
  },

  /**
    Custom components in the toolbar.

    @property customToolbarComponents
    @type Array
  */
  customToolbarComponents: computed('dropdownValue', function() {
    return [{
      name: 'flexberry-dropdown',
      properties: {
        items: this.get('dropdownItems'),
        value: this.get('dropdownValue'),
        onChange: this.get('onChange').bind(this)
      }
    }];
  }),

  init() {
    this._super(...arguments);
    this.set('componentTemplateText', new htmlSafe(
      '{{flexberry-objectlistview<br>' +
      '  customToolbarComponents=customToolbarComponents<br>' +
      '}}'));

    this.set('dropdownItems', {
      Value1: 'Enum value №1',
      Value2: 'Enum value №2',
      Value3: 'Enum value №3',
      Value4: 'Enum value №4',
      Value5: 'Enum value №5',
      Value6: 'Enum value №6',
      Value7: 'Enum value №7',
      Value8: 'Enum value №8',
      Value9: 'Enum value №9'
    });
  
    this.set('dropdownValue', this.get('dropdownItems.Value1'));
  },
});
