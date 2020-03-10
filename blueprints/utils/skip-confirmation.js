'use strict';

const RSVP = require('rsvp');
const minimatch = require('minimatch');
const fs = require('fs-extra');
const stat = RSVP.denodeify(fs.stat);
const Blueprint = require('ember-cli/lib/models/blueprint');
const Promise = require('ember-cli/lib/ext/promise');

module.exports = function skipConfirmation(context, intoDir, templateVariables) {
    let files = context._getFilesForInstall(templateVariables.targetFiles);
    let fileInfos = context._getFileInfos(files, intoDir, templateVariables);
    context._checkForNoMatch(fileInfos, templateVariables.rawArgs);

    context._ignoreUpdateFiles();

    return Promise.filter(fileInfos, isValidFile).
      map(prepareInfos);
};

function isValidFile(fileInfo) {
    let fn = fileInfo.inputPath;
    if (Blueprint.ignoredFiles.some(ignoredFile => minimatch(fn, ignoredFile, { matchBase: true }))) {
      return Promise.resolve(false);
    } else {
      return stat(fileInfo.inputPath).then(it => it.isFile());
    }
};

function prepareInfos(info) {
    return info.checkForConflict().then(resolution => {
      switch (resolution) {
        case 'identical':
          info.action = 'skip';
          break;
        case 'confirm':
          info.action = 'overwrite';
          break;
      }

      return info;
    });
};
