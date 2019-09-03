"use strict";
const skipConfirmationFunc = require('../utils/skip-confirmation');
module.exports = {
    description: 'Generates core-offline entities for flexberry.',
    availableOptions: [
        { name: 'file', type: String },
        { name: 'metadata-dir', type: String },
        { name: 'skip-confirmation', type: Boolean }
    ],
    supportsAddon: function () {
        return false;
    },

    processFiles(intoDir, templateVariables) {
        let skipConfirmation = this.options.skipConfirmation;
        if (skipConfirmation) {
            return skipConfirmationFunc(this, intoDir, templateVariables);
        }

        return this._super.processFiles.apply(this, [intoDir, templateVariables]);
    }
};
//# sourceMappingURL=index.js.map