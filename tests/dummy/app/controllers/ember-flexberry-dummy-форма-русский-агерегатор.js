import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  // Caption of this particular edit form.
  title: 'Форма русский агерегатор',
  parentRoute: 'ember-flexberry-dummy-список-русский-агерегатор',
  getCellComponent: function(attr, bindingPath) {
    if (attr.kind === 'belongsTo') {
      switch (bindingPath) {
        case 'мастерДетейла':
          return {
            componentName: 'flexberry-lookup',
            componentProperties: {
              choose: 'showLookupDialog',
              chooseText: '...',
              remove: 'removeLookupValue',
              displayAttributeName: 'полеМастераДетейла',
              required: true,
              relationName: 'мастерДетейла',
              projection: 'СписокМастерДетейла',
              autocomplete: true
            }
          };

      }
    }

    return this._super(...arguments);
  },
});
