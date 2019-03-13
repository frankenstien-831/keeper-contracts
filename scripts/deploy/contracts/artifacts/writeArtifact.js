const fs = require('fs')

const createArtifact = require('./createArtifact')

const artifactsDir = `${__dirname}/../../../../artifacts/`

function writeArtifact(
    name,
    address,
    networkName,
    version
) {
    // create the artifact
    const artifact = createArtifact(
        name,
        address,
        version
    )

    // set filename
    const filename = `${name}.${networkName.toLowerCase()}.json`

    // write artifact
    const artifactString = JSON.stringify(artifact, null, 2)

    /* eslint-disable-next-line security/detect-non-literal-fs-filename */
    fs.writeFileSync(`${artifactsDir}${filename}`, artifactString)

    return artifact
}

module.exports = writeArtifact
