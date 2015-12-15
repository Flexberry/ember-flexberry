/* jshint node: true */
var path = require('path');
var fs = require('fs');

module.exports = {
  beforeCommit: function(project, versions) {
    var filePath = path.join(project.root, 'vendor/ember-flexberry/register-version.js');
    if (fs.existsSync(filePath)) {
      var contents = fs.readFileSync(filePath, {
        encoding: 'utf8'
      });

      // replace version number in line "var version = 'x.x.x';".
      contents = contents.replace(/(version = ')(.+)(';)/, '$12.2.2$3');

      fs.writeFileSync(filePath, contents, {
        encoding: 'utf8'
      });
    } else {
      throw new Error('File not found: ' + filePath);
    }
  }
};
