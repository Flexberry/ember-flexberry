import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  getCellComponent: function(attr, bindingPath, model) {
    var cellComponent = this._super(...arguments);

    if (attr.kind === 'belongsTo') {
      if (model.modelName === 'ember-flexberry-dummy-localized-suggestion-type' && bindingPath === 'localization') {
        let updateLookupValue = this.get('actions.updateLookupValue').bind(this);
        cellComponent.componentProperties = {
          projection: 'LocalizationL',
          displayAttributeName: 'name',
          title: 'Localization',
          relationName: 'localization',
          choose: 'showLookupDialog',
          remove: 'removeLookupValue',
          autocomplete: true,
          updateLookupValue: updateLookupValue
        };
      }
    }

    return cellComponent;
  }
});
