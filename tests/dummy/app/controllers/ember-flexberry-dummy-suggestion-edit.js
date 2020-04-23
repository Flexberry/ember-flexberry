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
    Name of model.comments edit route.

    @property commentsEditRoute
    @type String
    @default 'ember-flexberry-dummy-comment-edit'
   */
  commentsEditRoute: 'ember-flexberry-dummy-comment-edit',

  title: t('forms.application.flexberry-objectlistview-modal-question-caption.delete-at-editform-question-caption'),

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
    },

    openSidepageComments() {
      this.set('sidepageCommentsIsOpen', true);
      this.send('showModalDialog', 'modal/ember-flexberry-dummy-suggestion-edit-comments-sidepage', { controller: 'ember-flexberry-dummy-suggestion-edit' });
    },

    closeSidepageComments() {
      this.set('sidepageCommentsIsOpen', false);
    },

    openSidepageFiles() {
      this.set('sidepageFilesIsOpen', true);
      this.send('showModalDialog', 'modal/ember-flexberry-dummy-suggestion-edit-files-sidepage', { controller: 'ember-flexberry-dummy-suggestion-edit' });
    },

    closeSidepageFiles() {
      this.set('sidepageFilesIsOpen', false);
    },

    openSidepageUserVotes() {
      this.set('sidepageUserVotesIsOpen', true);
      this.send('showModalDialog', 'modal/ember-flexberry-dummy-suggestion-edit-uservotes-sidepage', { controller: 'ember-flexberry-dummy-suggestion-edit' });
    },

    closeSidepageUserVotes() {
      this.set('sidepageUserVotesIsOpen', false);
    }
  }
});
