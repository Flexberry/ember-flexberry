import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';
import { merge } from '@ember/polyfills';
import { translationMacro as t } from 'ember-i18n';

export default BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
    Route name for transition after close edit form.

    @property parentRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-list'
   */
  parentRoute: 'ember-flexberry-dummy-suggestion-list',

  /**
    Available file extensions for upload. In MIME type format.

    @property availableMimeTypes
    @type String
  */
  availableMimeTypes: 'text/plain,video/mp4',

  /**
    Maximum file size in bytes for uploading files.
    It should be greater then 0 and less or equal then APP.components.file.maxUploadFileSize from application config\environment.
    If null or undefined, then APP.components.file.maxUploadFileSize from application config\environment will be used.

    @property maxUploadFileSize
    @type Number
  */
  maxUploadFileSize: 10,

  /**
    Maximum file size unit. May be 'Bt' 'Kb' 'Mb' or 'Gb'.

    @property maxUploadFileSizeUnit
    @type String
  */
  maxUploadFileSizeUnit: 'Mb',

  /**
    Name of model.comments edit route.

    @property commentsEditRoute
    @type String
    @default 'ember-flexberry-dummy-comment-edit'
   */
  commentsEditRoute: 'ember-flexberry-dummy-comment-edit',

  title: t('forms.application.flexberry-objectlistview-modal-question-caption.delete-at-editform-question-caption'),

  /**
    Function for check uploaded file type.

    @method checkFileType
    @param {String} fileType file type as MIME TYPES.
    @param {String} accept available MIME TYPES.
   */
  checkFileType: function(fileType, accept) {
    return true;
  },

  actions: {

    getLookupFolvProperties: function() {
      return {
        colsConfigButton: true
      };
    }
  },

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
    let i18n = this.get('i18n');
    if (attr.kind === 'belongsTo') {
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
            previewFormRoute: 'ember-flexberry-dummy-application-user-edit'
          };
          break;

        case 'ember-flexberry-dummy-comment+author':
          cellComponent.componentProperties = {
            choose: 'showLookupDialog',
            remove: 'removeLookupValue',
            displayAttributeName: 'name',
            required: true,
            relationName: 'author',
            projection: 'ApplicationUserL',
            autocomplete: true,
          };
          break;

      }
    } else if (attr.kind === 'attr') {
      switch (`${model.modelName}+${bindingPath}`) {
        case 'ember-flexberry-dummy-vote+author.eMail':
          cellComponent.componentProperties = {
            readonly: true,
          };
          break;

        case 'ember-flexberry-dummy-suggestion-file+file':
          cellComponent.componentProperties = {
            accept: this.get('availableMimeTypes'),
            isValidTypeFileCustom: this.get('checkFileType'),
            maxUploadFileSize: this.get('maxUploadFileSize'),
            maxUploadFileSizeUnit: this.get('maxUploadFileSizeUnit')
          };
          break;
      }
    }

    return cellComponent;
  },

  actions: {
    /**
      This method returns custom properties for lookup window.
      @method getLookupFolvProperties

      @param {Object} options Parameters of lookup that called this method.
      @param {String} [options.projection] Lookup projection.
      @param {String} [options.relationName] Lookup relation name.
      @return {Object} Set of options for lookup window.
     */
    getLookupFolvProperties: function(options) {
      let methodArgs = merge({
        projection: undefined,
        relationName: undefined
      }, options);

      if (methodArgs.relationName === 'editor1' || methodArgs.relationName === 'author') {
        return {
          refreshButton:true,
          enableFilters: true,
          filterButton: true,
          colsConfigButton: true
        };
      }
    },

    /**
      Show delete modal dialog before deleting.
    */
    delete(skipTransition) {
      this.set('approveDeleting', () => {this.delete(skipTransition)});
      this.set('denyDeleting',() => {});

      this.send('showModalDialog', 'modal/delete-record-modal-dialog', {
        controller: 'ember-flexberry-dummy-suggestion-edit'
      });
    },

    /**
      Close modal dialog and clear actions.
    */
    closeModalDialog() {
      this.set('approveDeleting', null);
      this.set('denyDeleting', null);

      this.send('removeModalDialog');
    }
  }
});
