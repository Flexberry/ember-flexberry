(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);
    if (attr.kind === 'belongsTo') {
      let updateLookupValue = this.get('actions.updateLookupValue').bind(this);
      switch (<%= '`${model.modelName}+${bindingPath}`' %>) {
<%= bodySwitchBindingPath %>
      }
    }

    return cellComponent;
  }
