const inflector = require("inflection");

module.exports = {
  description: 'Generates an import wrapper for new routes and controllers.',

  availableOptions: [
    { name: 'middle-path', type: String }
  ],

  fileMapTokens: function() {
    return {
      __name__: function(options) {
        return options.dasherizedModuleName;
      },
      __path__: function(options) {
        return inflector.pluralize( options.originBlueprintName );
      },
      __root__: function(options) {
        return 'app';
      }
    };
  },

   /**
   * Blueprint Hook locals.
   * Use locals to add custom template variables. The method receives one argument: options.
   *
   * @method locals
   * @public
   *
   * @param {Object} options Options is an object containing general and entity-specific options.
   * @return {Object} Сustom template variables.
   */
  locals: function(options) {
    return {
      middlePath: `${inflector.pluralize(options.middlePath)}`,
      projectName: `${options.project.name()}`,
      entityName: `${options.entity.name}`
    }
  }
}
