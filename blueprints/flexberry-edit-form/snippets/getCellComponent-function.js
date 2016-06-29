function(attr, bindingPath) {
    if (attr.kind === 'belongsTo') {
      switch (bindingPath) {
<%= bodySwitchBindingPath %>
      }
    }

    return this._super(...arguments);
  }
