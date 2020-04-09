/*jshint node:true*/
const skipConfirmationFunc = require('../utils/skip-confirmation');
module.exports = {
    description: 'Generates common entities for flexberry.',
    supportsAddon: function () {
        return false;
    },
    availableOptions: [
        { name: 'skip-confirmation', type: Boolean }
    ],

    processFiles(intoDir, templateVariables) {
        let skipConfirmation = this.options.skipConfirmation;
        if (skipConfirmation) {
            return skipConfirmationFunc(this, intoDir, templateVariables);
        }

        return this._super(...arguments);
    },
};
//# sourceMappingURL=index.js.map