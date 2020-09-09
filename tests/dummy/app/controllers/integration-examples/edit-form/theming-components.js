import { scheduleOnce } from '@ember/runloop';
import $ from 'jquery';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  init() {
    this._super(...arguments);
    scheduleOnce('afterRender', this, function() {
      // add popup to show name
      $('.ui.form.flexberry-vertical-form .ui:not(.container, .grid, .header)').each(function() {
        $(this)
          .popup({
            on        : 'hover',
            variation : 'small inverted',
            exclusive : true,
            content   : $(this).attr('class')
          })
        ;
      });
    });
  }
})