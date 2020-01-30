import ListFormController from 'ember-flexberry/controllers/list-form';
import ListFormControllerOperationsIndicationMixin from '../mixins/list-form-controller-operations-indication';
import $ from 'jquery';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import { isEmpty } from '@ember/utils';

import RSVP from 'rsvp';

export default ListFormController.extend(ListFormControllerOperationsIndicationMixin, {
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-edit'
   */
  editFormRoute: 'ember-flexberry-dummy-suggestion-edit',

  exportExcelProjection: 'SuggestionL',

  actions: {
    /**
      Hook that executes before deleting all records on all pages.
      Need to be overriden in corresponding application controller.
    */
    beforeDeleteAllRecords(modelName, data) {
      data.cancel = false;
    },

    beforeDeleteMadalDialog: function() {
      return new RSVP.Promise((resolve, reject) => {
        let settings ={
          closable  : false,
          context: '.ember-application > .ember-view',
          transition: 'slide left',
          onDeny: function(){
            $(this).modal('hide');
            reject();
          },
          onApprove: function(){
            $(this).modal('hide');
            resolve();
          },
        };
    
        $('.delete-record-modal-dialog').modal(settings).modal('show');
      });
    }
  },
});
