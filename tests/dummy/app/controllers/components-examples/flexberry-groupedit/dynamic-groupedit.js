import ListFormController from 'ember-flexberry/controllers/list-form';
import FlexberryLookupMixin from 'ember-flexberry/mixins/flexberry-lookup-controller';
import { isNone } from '@ember/utils';

export default ListFormController.extend(FlexberryLookupMixin, {
  getCellComponent(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);
    const i18n = this.get('i18n');
    if (attr.kind === 'belongsTo' && !isNone(model)) {
      let updateLookupValue = this.get("actions.updateLookupValue").bind(this);
      switch (`${model.modelName}+${bindingPath}`) {
        case 'ember-flexberry-dummy-vote+author':
          cellComponent.componentProperties = {
            choose: 'showLookupDialog',
            remove: 'removeLookupValue',
            preview: 'previewLookupValue',
            displayAttributeName: 'name',
            title: i18n.t('forms.ember-flexberry-dummy-application-user-list.caption'),
            required: true,
            relationName: 'author',
            projection: 'ApplicationUserL',
            autocomplete: true,
            showPreviewButton: true,
            previewFormRoute: 'ember-flexberry-dummy-application-user-edit',
            updateLookupValue: updateLookupValue
          };
          break;
      }
    }
    return cellComponent;
  },

  actions: {
    objectListViewRowClick(record) {
      this.set('modelGroupedit', record.get('userVotes'));
    }
  }
});
