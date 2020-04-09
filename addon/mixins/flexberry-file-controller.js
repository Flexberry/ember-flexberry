/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { inject } from '@ember/controller';
import { merge } from '@ember/polyfills';

/**
  Mixin for <a href="https://emberjs.com/api/ember/release/classes/Controller">Controller</a>
  handling {{#crossLink "FlexberryFileComponent"}}flexberry-file{{/crossLink}} actions.

  @class FlexberryFileControllerMixin
  @extends <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
*/
export default Mixin.create({
  /**
    Controller for modal dialog content.

    @property flexberryFileModalController
    @type <a href="https://emberjs.com/api/ember/release/classes/Controller">Controller</a>
    @default Injected flexberry-file-view-dialog controller.
  */
  flexberryFileModalController: inject('flexberry-file-view-dialog'),

  /**
    Modal dialog content template's name.

    @property flexberryFileModalTemplateName
    @type String
    @default 'flexberry-file-view-dialog'
   */
  flexberryFileModalTemplateName: 'flexberry-file-view-dialog',

  actions: {
    /**
      Handles {{#crossLink "FlexberryFileComponent"}}flexberry-file{{/crossLink}} viewImageAction:
      creates modal dialog with selected file preview.

      @public
      @method actions.flexberryFileViewImageAction
      @param {Object} selectedFileOptions Information about selected file.
      @param {String} [selectedFileOptions.fileSrc] File as base64string image data or as URL (to be setted as img tag's 'src' property).
      @param {String} [selectedFileOptions.fileName] File name to be setted as modal dialog caption.
    */
    flexberryFileViewImageAction(selectedFileOptions) {
      let options = merge({
        fileSrc: undefined,
        fileName: undefined,
        settings: undefined
      }, selectedFileOptions);
      let fileSrc = options.fileSrc;
      let fileName = options.fileName;
      let flexberryFileModalTemplateName = this.get('flexberryFileModalTemplateName');

      if (!fileSrc || !fileName) {
        throw new Error('File data are not defined.');
      }

      if (!flexberryFileModalTemplateName) {
        throw new Error('Template for file modal dialog is not defined');
      }

      let controller = this.get('flexberryFileModalController');
      controller.setProperties({
        title: fileName,
        imageSrc: fileSrc,
        settings:options.settings
      });
      this.send('showModalDialog', flexberryFileModalTemplateName, { controller: controller });
    },

    /**
      Handles corresponding route's willTransition action.
      It sends message about transition to modal dialog's controller.

      @public
      @method actions.routeWillTransition
    */
    routeWillTransition() {
      this.get('flexberryFileModalController').send('routeWillTransition');
    }
  }
});
