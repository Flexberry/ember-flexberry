import Ember from 'ember';
import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';

export default BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
    Route name for transition after close edit form.

    @property parentRoute
    @type String
    @default 'ember-flexberry-dummy-toggler-example-master'
   */
  parentRoute: 'ember-flexberry-dummy-toggler-example-master',

  /*  <div class="field {{if model.errors.userVotes "error" ""}}">
      <label>{{t "forms.ember-flexberry-dummy-suggestion-edit.userVotes-caption"}}</label>
      {{flexberry-groupedit
        componentName="suggestionUserVotesGroupEdit"
        content=model.userVotes
        mainModelProjection=modelProjection
        modelProjection=modelProjection.attributes.userVotes
        orderable=true
        readonly=readonly
        configurateRow=(action 'configurateVotesRow')
      }}
      {{flexberry-validationmessage error=model.errors.userVotes pointing="pointing"}}
    </div>
    */
});
