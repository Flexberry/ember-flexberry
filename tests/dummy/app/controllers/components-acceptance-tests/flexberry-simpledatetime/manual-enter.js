import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
const { getOwner } = Ember;

export default EditFormController.extend({
  /**
    Model projection for 'flexberry-groupedit' component 'modelProjection' property.

    @property detailsProjection
    @type Object
   */
  detailsProjection: Ember.computed(function() {
    let detailsProjectionName = 'DetailE';
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
    Flag for 'flexberry-groupedit' component 'rowClickable' property.

    @property rowClickable
    @type Boolean
   */
  rowClickable: false,

  /**
    Flag for 'flexberry-groupedit' component 'immediateDelete' property.

    @property immediateDelete
    @type Boolean
   */
  immediateDelete: false,

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
  getCellComponent: function(attr, bindingPath, modelClass) {
    var cellComponent = this._super(...arguments);
    var modelAttr = !Ember.isNone(modelClass) ? Ember.get(modelClass, 'attributes').get(bindingPath) : null;
    if (attr.kind === 'attr' && modelAttr && modelAttr.type && modelAttr.type === 'date') {
      cellComponent.componentProperties = {
        type: 'date'
      };
    }

    return cellComponent;
  }
});
