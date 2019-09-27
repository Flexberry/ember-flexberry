import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  /**
    Name of related edit form route (for 'flexberry-objectlistview' component 'editFormRoute' property).

    @property editFormRoute
    @type String
   */
  editFormRoute: 'ember-flexberry-dummy-suggestion-edit',

  /**
    'flexberry-text-cell' component's 'maxTextLength' property.

    @property maxTextLength
    @type Number
   */
  maxTextLength: 10,

  /**
    Flag for 'flexberry-text-cell' component 'cutBySpaces' property.

    @property cutBySpaces
    @type Boolean
   */
  cutBySpaces: false,

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', 'model.content', function() {
    let componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'maxTextLength',
      settingType: 'number',
      settingDefaultValue: 10,
      bindedControllerPropertieName: 'maxTextLength'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'cutBySpaces',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'cutBySpaces'
    });
    return componentSettingsMetadata;
  }),

  /**
    Method to get type and attributes of a component,
    which will be embeded in object-list-view cell.

    @method getCellComponent.
    @param {Object} attr Attribute of projection property related to current table cell.
    @param {String} bindingPath Path to model property related to current table cell.
    @param {DS.Model} modelClass Model class of data record related to current table row.
    @return {Object} Object containing name & properties of component, which will be used to render current table cell.
    { componentName: 'my-component',  componentProperties: { ... } }.
   */
  getCellComponent: function(attr) {
    let cellComponent = {
      componentName: 'object-list-view-cell',
      componentProperties: {
        maxTextLength: this.get('maxTextLength'),
        cutBySpaces: this.get('cutBySpaces'),
        displayMemberPath: Ember.get(attr, 'options.displayMemberPath')
      }
    };

    if (attr.caption === 'Text') {
      cellComponent = {
        componentName: 'flexberry-text-cell',
        componentProperties: {
          maxTextLength: this.get('maxTextLength'),
          cutBySpaces: this.get('cutBySpaces')
        }
      };
    }

    return cellComponent;
  }
});
