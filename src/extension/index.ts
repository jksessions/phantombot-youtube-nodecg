'use-strict';

import { NodeCG } from 'nodecg/types/server';
import * as nodecgApiContext from './util/nodecg-api-context';

async function init(): Promise<void> {
    require('./replicants');
}

module.exports = (nodecg: NodeCG): void => {
    nodecgApiContext.set(nodecg);

    init()
        .then(() => {
            nodecg.log.info('Initialization successful.');
        })
        .catch((error) => {
            nodecg.log.error('Failed to initialize:', error);
        });
}