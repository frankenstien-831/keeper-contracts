const fs = require('fs')
const glob = require('glob')
const pkg = require('../package.json')

const buildDir = './build/contracts/'
const outDir = './artifacts/'

const network = process.env.NETWORK || 'development'
const version = `v${pkg.version}`

const zosFile = glob.sync('./zos.dev-*.json', 'utf-8')[0]
/* eslint-disable-next-line security/detect-non-literal-fs-filename */
const migration = JSON.parse(fs.readFileSync(zosFile, 'utf-8').toString())
const { contracts } = migration

const contractNames = Object.keys(contracts)

/* eslint-disable-next-line no-console */
console.log(version, network)

contractNames.forEach((contractName) => {
    /* eslint-disable-next-line security/detect-non-literal-fs-filename */
    const contract = JSON.parse(fs.readFileSync(`${buildDir}${contractName}.json`, 'utf-8').toString())

    const artifact = {
        abi: contract.abi,
        bytecode: contract.bytecode,
        address: contracts[contractName].address,
        version
    }

    const filename = `${contractName}.${network.toLowerCase()}.json`

    /* eslint-disable-next-line security/detect-non-literal-fs-filename */
    fs.writeFileSync(`${outDir}${filename}`, JSON.stringify(artifact, null, 2))
})