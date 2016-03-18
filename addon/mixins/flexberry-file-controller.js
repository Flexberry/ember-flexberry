/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Mixin for {{#crossLink "DS.Controller"}}Controller{{/crossLink}} to support
 * opening current selected image at flexberry-file at modal window.
 *
 * @class Controller
 * @extends Ember.Mixin
 * @public
 */
export default Ember.Mixin.create({
  /**
   * Controller for modal window content.
   *
   * @property flexberryFileModalController
   * @type DS.Controller
   * @default flexberry-file-view-dialog
   */
  flexberryFileModalController: Ember.inject.controller('flexberry-file-view-dialog'),

  /**
   * Name of template for modal window content.
   *
   * @property flexberryFileModalTemplateName
   * @type String
   * @default `flexberry-file-view-dialog`
   */
  flexberryFileModalTemplateName: 'flexberry-file-view-dialog',

  /**
   * Width of modal window.
   *
   * @property flexberryFileModalWindowWidth
   * @type Number
   * @default 750
   */
  flexberryFileModalWindowWidth: 750,

  /**
   * Height of modal window.
   *
   * @property flexberryFileModalWindowHeight
   * @type Number
   * @default 600
   */
  flexberryFileModalWindowHeight: 600,

  actions: {
    /**
     * This method creates modal window to view image preview.
     *
     * @method flexberryFileViewImageAction
     * @public
     *
     * @param {Object} selectedFileOptions Information about selected file.
     * @param {String} [selectedFileOptions.fileSrc] File content to set as source for image tag.
     * @param {String} [selectedFileOptions.fileName] File name to set as title of modal window.
     */
    flexberryFileViewImageAction: function(selectedFileOptions) {
      let options = Ember.merge({
        fileSrc: undefined,
        fileName: undefined
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
        modalWindowHeight: this.get('flexberryFileModalWindowWidth'),
        modalWindowWidth: this.get('flexberryFileModalWindowHeight'),
        imageSrc: fileSrc
      });

      this.send('showModalDialog', flexberryFileModalTemplateName, { controller: controller });
    },

    // TODO: try remove this lookup's logic.
    /**
     * Handles correcponding route's willTransition action.
     * It sends message about transition to showing lookup modal window controller.
     *
     * @method routeWillTransition
     */
    routeWillTransition: function() {
      this.get('flexberryFileModalController').send('routeWillTransition');
    }
  }
});
