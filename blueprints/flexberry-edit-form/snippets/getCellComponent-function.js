(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);
    if (attr.kind === 'belongsTo') {
      switch (<%= '`${model.modelName}+${bindingPath}`' %>) {
<%= bodySwitchBindingPath %>
      }
    }

    return cellComponent;
  }
