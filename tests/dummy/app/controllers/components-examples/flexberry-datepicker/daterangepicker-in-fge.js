import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
const { getOwner } = Ember;

export default EditFormController.extend({
  /**
    Name of selected detail's model projection.

    @property _detailsProjectionName
    @type String
    @private
   */
  _detailsProjectionName: 'DetailE',

  /**
    Array of available detail's model projections.

    @property _detailsProjections
    @type Object[]
   */
  _detailsProjections: Ember.computed('model.details.relationship.belongsToType', function() {
    let detailsModelName = this.get('model.details.relationship.belongsToType');
    let detailsClass = getOwner(this)._lookupFactory('model:' + detailsModelName);

    return Ember.get(detailsClass, 'projections');
  }),

  /**
    Array of available detail's model projections names.

    @property _detailsProjectionsNames
    @type String[]
   */
  _detailsProjectionsNames: Ember.computed('_detailsProjections.[]', function() {
    let detailsProjections = this.get('_detailsProjections');
    if (Ember.isNone(detailsProjections)) {
      return [];
    }

    return Object.keys(detailsProjections);
  }),

  /**
    Model projection for 'flexberry-groupedit' component 'modelProjection' property.

    @property detailsProjection
    @type Object
   */
  detailsProjection: Ember.computed('_detailsProjections.[]', '_detailsProjectionName', function() {
    let detailsProjectionName = this.get('_detailsProjectionName');
    if (Ember.isBlank(detailsProjectionName)) {
      return null;
    }

    let detailsModelName = this.get('model.details.relationship.belongsToType');
    let detailsClass = getOwner(this)._lookupFactory('model:' + detailsModelName);
    let detailsClassProjections = Ember.get(detailsClass, 'projections');
    if (Ember.isNone(detailsClassProjections)) {
      return null;
    }

    return detailsClassProjections[detailsProjectionName];
  }),

  /**
    Template text for 'flexberry-groupedit' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-groupedit<br>' +
    '  componentName=\"aggregatorDetailsGroupedit\"<br>' +
    '  content=model.details<br>' +
    '  modelProjection=detailsProjection<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();

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
  getCellComponent: function(attr, bindingPath) {
    var cellComponent = this._super(...arguments);

    if (cellComponent.componentName === 'flexberry-datepicker') {
      cellComponent.componentName = 'daterangepicker-example';
    }

    return cellComponent;
  },
});
