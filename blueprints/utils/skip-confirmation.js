'use strict';

const RSVP = require('rsvp');
const existsSync = require('exists-sync');
const minimatch = require('minimatch');
const fs = require('fs-extra');
const stat = RSVP.denodeify(fs.stat);

module.exports = function skipConfirmation(context, intoDir, templateVariables) {
    let files = context._getFilesForInstall(templateVariables.targetFiles);
    let fileInfos = context._getFileInfos(files, intoDir, templateVariables);
    context._checkForNoMatch(fileInfos, templateVariables.rawArgs);

    context._ignoreUpdateFiles();

    let fileInfosToRemove = context._getFileInfos(context.filesToRemove, intoDir, templateVariables);
    fileInfosToRemove = finishProcessingForUninstall(fileInfosToRemove);

    return RSVP.filter(fileInfos, isValidFile)
      .then(promises => RSVP.map(promises, prepareInfos))
      .then(fileInfos => fileInfos.concat(fileInfosToRemove));
};

function finishProcessingForUninstall(infos) {
    let validInfos = infos.filter(info => existsSync(info.outputPath));
    validInfos.forEach((info) => info.action = 'remove');

    return validInfos;
};

function isValidFile(fileInfo) {
    /*let fn = fileInfo.inputPath;
    if (this.ignoredFiles.some(ignoredFile => minimatch(fn, ignoredFile, { matchBase: true }))) {
      return Promise.resolve(false);
    } else {*/
      return stat(fileInfo.inputPath).then(it => it.isFile());
    //}
};

function prepareInfos(info) {
    return info.checkForConflict().then(resolution => {
      info.action = resolution === 'identical' ? 'skip' : 'overwrite';
      return info;
    });
};
