"use strict";
'use-strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = (0, tslib_1.__importStar)(require("./util/nodecg-api-context"));
async function init() {
    require('./replicants');
    require('./websocket');
    require('./youtube');
}
module.exports = (nodecg) => {
    nodecgApiContext.set(nodecg);
    init()
        .then(() => {
        nodecg.log.info('Initialization successful.');
    })
        .catch((error) => {
        nodecg.log.error('Failed to initialize:', error);
    });
};
