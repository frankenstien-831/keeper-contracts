/* eslint-disable no-console */
// List of contracts
const contractNames = require('./contracts.json')

function evaluateContracts({
    contracts,
    testnet,
    verbose
}) {
    if (!contracts || contracts.length === 0) {
        // contracts not supplied, loading from disc
        contracts = contractNames

        // if we are on a testnet, add dispenser
        if (testnet && contracts.indexOf('Dispenser') < 0) {
            // deploy the Dispenser if we are in a testnet
            contracts.push('Dispenser')
        }
    }

    if (verbose) {
        console.log(
            `Deploying contracts: '${contracts.join(', ')}'`
        )
    }

    return contracts
}

module.exports = evaluateContracts