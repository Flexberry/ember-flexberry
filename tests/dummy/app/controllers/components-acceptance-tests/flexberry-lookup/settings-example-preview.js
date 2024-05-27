import { observer } from '@ember/object';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { translationMacro as t } from 'ember-i18n';

export default EditFormController.extend({

  /**
    Current values name for lookup.

    @property testName
    @type BasePredicate
    @default undefined
   */
  testName: undefined,

  /**
    Text for 'flexberry-lookup' component 'placeholder' property.

    @property placeholder
    @type String
    @default 't('components.flexberry-lookup.placeholder')'
   */
  placeholder: t('components.flexberry-lookup.placeholder'),

  /**
    Handles changes in placeholder.

    @method _placeholderChanged
    @private
   */
  _placeholderChanged: observer('placeholder', function() {
    if (this.get('placeholder') === this.get('i18n').t('components.flexberry-lookup.placeholder').toString()) {
      this.set('placeholder', t('components.flexberry-lookup.placeholder'));
    }
  }),

  /**
    Flag indicates whether 'flexberry-lookup' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
    @default false
  */
  readonly: false,

  /**
    Text for 'flexberry-lookup' component 'placeholder' property.

    @property title
    @type String
    @default 'Master'
  */
  title: 'Temp title',

  /**
    Flag indicates whether 'flexberry-lookup' component is in 'autocomplete' mode or not.

    @property autocomplete
    @type Boolean
    @default false
  */
  autocomplete: false,

  /**
    Flag indicates whether 'flexberry-lookup' component is in 'dropdown' mode or not.

    @property dropdown
    @type Boolean
    @default false
  */
  dropdown: false,

  /**
    Content for 'flexberry-lookup' component 'chooseText' property.

    @property chooseText
    @type String
    @default 't('components.flexberry-lookup.choose-button-text')'
  */
  chooseText: t('components.flexberry-lookup.choose-button-text'),

  /**
    Content for 'flexberry-lookup' component 'removeText' property.

    @property removeText
    @type String
    @default '<i class="remove icon"></i>'
  */
  removeText: '<i class="remove icon"></i>',

  /**
    Text for 'flexberry-lookup' component 'chooseButtonClass' property.

    @property chooseButtonClass
    @type String
    @default 'purple'
  */
  chooseButtonClass: '',

  /**
    Text for 'flexberry-lookup' component 'removeButtonClass' property.

    @property removeButtonClass
    @type String
    @default 'olive'
  */
  removeButtonClass: '',

  /**
    Text for 'flexberry-lookup' component 'previewButtonClass' property.

    @property previewButtonClass
    @type String
  */
  previewButtonClass: '',

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
  getCellComponent(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);
    if (attr.kind === 'belongsTo') {
      let updateLookupValue = this.get('actions.updateLookupValue').bind(this);
      switch (`${model.modelName}+${bindingPath}`) {
        case 'ember-flexberry-dummy-vote+author':
          cellComponent.componentProperties = {
            choose: 'showLookupDialog',
            remove: 'removeLookupValue',
            preview: 'previewLookupValue',
            displayAttributeName: 'name',
            required: true,
            relationName: 'author',
            projection: 'ApplicationUserL',
            autocomplete: true,
            showPreviewButton: true,
            previewFormRoute: 'components-acceptance-tests/flexberry-lookup/settings-example-preview-page',
            updateLookupValue: updateLookupValue
          };
          break;
      }
    }

    return cellComponent;
  }
});
